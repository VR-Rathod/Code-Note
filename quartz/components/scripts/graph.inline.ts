import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  forceRadial,
  zoomIdentity,
  select,
  drag,
  zoom,
} from "d3"
import { Text, Graphics, Application, Container, Circle, BlurFilter } from "pixi.js"
import { Group as TweenGroup, Tween as Tweened } from "@tweenjs/tween.js"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { D3Config } from "../Graph"

type GraphicsInfo = {
  color: string
  gfx: Graphics
  alpha: number
  active: boolean
}

type NodeData = {
  id: SimpleSlug
  text: string
  tags: string[]
} & SimulationNodeDatum

type SimpleLinkData = {
  source: SimpleSlug
  target: SimpleSlug
}

type LinkData = {
  source: NodeData
  target: NodeData
} & SimulationLinkDatum<NodeData>

type LinkRenderData = GraphicsInfo & {
  simulationData: LinkData
}

type NodeRenderData = GraphicsInfo & {
  simulationData: NodeData
  label: Text
  glowGfx: Graphics
  driftPhase: number
}

const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

type TweenNode = {
  update: (time: number) => void
  stop: () => void
}

async function renderGraph(graph: HTMLElement, fullSlug: FullSlug) {
  const slug = simplifySlug(fullSlug)
  const visited = getVisited()
  removeAllChildren(graph)

  let {
    drag: enableDrag,
    zoom: enableZoom,
    depth,
    scale,
    repelForce,
    centerForce,
    linkDistance,
    fontSize,
    opacityScale,
    removeTags,
    showTags,
    focusOnHover,
    enableRadial,
    neuronMode,
    driftAmplitude,
    driftFrequency,
    glowRadius,
    glowAlpha,
    pulseSpeed,
  } = JSON.parse(graph.dataset["cfg"]!) as D3Config

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug),
      v,
    ]),
  )
  const links: SimpleLinkData[] = []
  const tags: SimpleSlug[] = []
  const validLinks = new Set(data.keys())

  const tweens = new Map<string, TweenNode>()
  for (const [source, details] of data.entries()) {
    const outgoing = details.links ?? []

    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      const localTags = details.tags
        .filter((tag) => !removeTags.includes(tag))
        .map((tag) => simplifySlug(("tags/" + tag) as FullSlug))

      tags.push(...localTags.filter((tag) => !tags.includes(tag)))

      for (const tag of localTags) {
        links.push({ source: source, target: tag })
      }
    }
  }

  const neighbourhood = new Set<SimpleSlug>()
  const wl: (SimpleSlug | "__SENTINEL")[] = [slug, "__SENTINEL"]
  if (depth >= 0) {
    while (depth >= 0 && wl.length > 0) {
      // compute neighbours
      const cur = wl.shift()!
      if (cur === "__SENTINEL") {
        depth--
        wl.push("__SENTINEL")
      } else {
        neighbourhood.add(cur)
        const outgoing = links.filter((l) => l.source === cur)
        const incoming = links.filter((l) => l.target === cur)
        wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
      }
    }
  } else {
    validLinks.forEach((id) => neighbourhood.add(id))
    if (showTags) tags.forEach((tag) => neighbourhood.add(tag))
  }

  const nodes = [...neighbourhood].map((url) => {
    const text = url.startsWith("tags/") ? "#" + url.substring(5) : (data.get(url)?.title ?? url)
    return {
      id: url,
      text,
      tags: data.get(url)?.tags ?? [],
    }
  })
  const graphData: { nodes: NodeData[]; links: LinkData[] } = {
    nodes,
    links: links
      .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
      .map((l) => ({
        source: nodes.find((n) => n.id === l.source)!,
        target: nodes.find((n) => n.id === l.target)!,
      })),
  }

  const width = graph.offsetWidth
  const height = Math.max(graph.offsetHeight, 250)

  // we virtualize the simulation and use pixi to actually render it
  const simulation: Simulation<NodeData, LinkData> = forceSimulation<NodeData>(graphData.nodes)
    .force("charge", forceManyBody().strength(-100 * repelForce))
    .force("center", forceCenter().strength(centerForce))
    .force("link", forceLink(graphData.links).distance(linkDistance))
    .force("collide", forceCollide<NodeData>((n) => nodeRadius(n)).iterations(3))
    .velocityDecay(0.6)

  const radius = (Math.min(width, height) / 2) * 0.8
  if (enableRadial) simulation.force("radial", forceRadial(radius).strength(0.2))

  // precompute style prop strings as pixi doesn't support css variables
  const cssVars = [
    "--secondary",
    "--tertiary",
    "--gray",
    "--light",
    "--lightgray",
    "--dark",
    "--darkgray",
    "--bodyFont",
  ] as const
  const computedStyleMap = cssVars.reduce(
    (acc, key) => {
      acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
      return acc
    },
    {} as Record<(typeof cssVars)[number], string>,
  )

  // neuron-palette: cool blue/cyan/violet tones that read as neural tissue
  const nodeColors = [
    "#58a6ff", "#79c0ff", "#a5d6ff",
    "#bc8cff", "#d2a8ff",
    "#56d364", "#3fb950",
    "#ffa657", "#f0883e",
    "#ff7b72",
  ]
  const tagColorMap = new Map<string, string>()
  let colorIdx = 0

  const color = (d: NodeData) => {
    const isCurrent = d.id === slug
    if (isCurrent) {
      return "#79c0ff"  // bright blue for current node
    } else if (visited.has(d.id)) {
      return "#58a6ff"
    } else if (d.id.startsWith("tags/")) {
      return "#bc8cff"  // violet for tag nodes
    } else {
      const firstTag = d.tags?.[0]
      if (firstTag) {
        if (!tagColorMap.has(firstTag)) {
          tagColorMap.set(firstTag, nodeColors[colorIdx++ % nodeColors.length])
        }
        return tagColorMap.get(firstTag)!
      }
      return nodeColors[Math.abs(d.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % nodeColors.length]
    }
  }

  function nodeRadius(d: NodeData) {
    const numLinks = graphData.links.filter(
      (l) => l.source.id === d.id || l.target.id === d.id,
    ).length
    return 2 + Math.sqrt(numLinks)
  }

  let hoveredNodeId: string | null = null
  let hoveredNeighbours: Set<string> = new Set()
  const linkRenderData: LinkRenderData[] = []
  const nodeRenderData: NodeRenderData[] = []
  function updateHoverInfo(newHoveredId: string | null) {
    hoveredNodeId = newHoveredId

    if (newHoveredId === null) {
      hoveredNeighbours = new Set()
      for (const n of nodeRenderData) {
        n.active = false
      }

      for (const l of linkRenderData) {
        l.active = false
      }
    } else {
      hoveredNeighbours = new Set()
      for (const l of linkRenderData) {
        const linkData = l.simulationData
        if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
          hoveredNeighbours.add(linkData.source.id)
          hoveredNeighbours.add(linkData.target.id)
        }

        l.active = linkData.source.id === newHoveredId || linkData.target.id === newHoveredId
      }

      for (const n of nodeRenderData) {
        n.active = hoveredNeighbours.has(n.simulationData.id)
      }
    }
  }

  let dragStartTime = 0
  let dragging = false

  function renderLinks() {
    tweens.get("link")?.stop()
    const tweenGroup = new TweenGroup()

    for (const l of linkRenderData) {
      let alpha: number

      if (hoveredNodeId) {
        if (l.active) {
          alpha = 0.9  // active links — pulse will be applied in animate loop
          l.color = "#58a6ff"  // bright blue axon when active
        } else {
          alpha = 0.05  // non-connected links nearly invisible
          l.color = "#30363d"
        }
      } else {
        alpha = 0.5  // idle default — visible but subtle
        l.color = "#30363d"
      }

      tweenGroup.add(new Tweened<LinkRenderData>(l).to({ alpha }, 250))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("link", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderLabels() {
    tweens.get("label")?.stop()
    const tweenGroup = new TweenGroup()

    const defaultScale = 1 / scale
    const activeScale = defaultScale * 1.15

    for (const n of nodeRenderData) {
      const nodeId = n.simulationData.id

      if (hoveredNodeId === null) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to({ alpha: 0, scale: { x: defaultScale, y: defaultScale } }, 200)
        )
      } else if (nodeId === hoveredNodeId) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to({ alpha: 1.0, scale: { x: activeScale, y: activeScale } }, 120)
        )
      } else if (hoveredNeighbours.has(nodeId)) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to({ alpha: 0.75, scale: { x: defaultScale, y: defaultScale } }, 150)
        )
      } else {
        tweenGroup.add(
          new Tweened<Text>(n.label).to({ alpha: 0, scale: { x: defaultScale, y: defaultScale } }, 200)
        )
      }
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("label", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() { tweenGroup.getAll().forEach((tw) => tw.stop()) },
    })
  }

  function renderNodes() {
    tweens.get("hover")?.stop()
    const tweenGroup = new TweenGroup()

    for (const n of nodeRenderData) {
      let alpha = 1
      let targetScale = { x: 1, y: 1 }
      let targetGlowAlpha = glowAlpha ?? 0.35

      if (hoveredNodeId !== null && focusOnHover) {
        if (n.simulationData.id === hoveredNodeId) {
          targetScale = { x: 1.3, y: 1.3 }
          targetGlowAlpha = 0.9
        } else if (n.active) {
          alpha = 1
          targetScale = { x: 1.1, y: 1.1 }
          targetGlowAlpha = 0.9
        } else {
          alpha = 0.15
        }
      } else if (hoveredNodeId !== null) {
        // focusOnHover is false but we still want scale pop
        if (n.simulationData.id === hoveredNodeId) {
          targetScale = { x: 1.3, y: 1.3 }
          targetGlowAlpha = 0.9
        } else if (n.active) {
          targetScale = { x: 1.1, y: 1.1 }
          targetGlowAlpha = 0.9
        }
      }

      tweenGroup.add(new Tweened<Graphics>(n.gfx, tweenGroup).to({ alpha, scale: targetScale }, 200))
      tweenGroup.add(new Tweened<Graphics>(n.glowGfx, tweenGroup).to({ alpha: targetGlowAlpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("hover", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() { tweenGroup.getAll().forEach((tw) => tw.stop()) },
    })
  }

  function renderPixiFromD3() {
    renderNodes()
    renderLinks()
    renderLabels()
  }

  tweens.forEach((tween) => tween.stop())
  tweens.clear()

  const app = new Application()
  await app.init({
    width,
    height,
    antialias: true,
    autoStart: false,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgpu",
    resolution: window.devicePixelRatio,
    eventMode: "static",
  })
  graph.appendChild(app.canvas)

  const stage = app.stage
  stage.interactive = false

  const labelsContainer = new Container<Text>({ zIndex: 3, isRenderGroup: true })
  const nodesContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
  const linkContainer = new Container<Graphics>({ zIndex: 1, isRenderGroup: true })
  const glowContainer = new Container<Graphics>({ zIndex: 0, isRenderGroup: true })
  glowContainer.filters = [new BlurFilter({ strength: glowRadius ?? 8 })]
  stage.addChild(glowContainer, linkContainer, nodesContainer, labelsContainer)

  for (const n of graphData.nodes) {
    const nodeId = n.id

    const label = new Text({
      interactive: false,
      eventMode: "none",
      text: n.text,
      alpha: 0,
      anchor: { x: 0.5, y: 1.6 },
      style: {
        fontSize: fontSize * 13,
        fill: "#e6edf3",
        fontFamily: computedStyleMap["--bodyFont"],
        dropShadow: {
          color: "#000000",
          blur: 4,
          distance: 0,
          alpha: 0.8,
        },
      },
      resolution: window.devicePixelRatio * 4,
    })
    label.scale.set(1 / scale)

    let oldLabelOpacity = 0
    const isTagNode = nodeId.startsWith("tags/")
    const gfx = new Graphics({
      interactive: true,
      label: nodeId,
      eventMode: "static",
      hitArea: new Circle(0, 0, nodeRadius(n)),
      cursor: "pointer",
    })
      .circle(0, 0, nodeRadius(n))
      .fill({ color: isTagNode ? "#bc8cff" : color(n) })

    const degree = graphData.links.filter(
      (l) => l.source.id === n.id || l.target.id === n.id,
    ).length
    if (degree > 5) {
      // subtle inner ring for hub nodes — same radius as node, just a faint outline
      gfx
        .circle(0, 0, nodeRadius(n) * 1.3)
        .stroke({ width: 0.5, color: isTagNode ? computedStyleMap["--light"] : color(n), alpha: 0.2 })
    }

    gfx.on("pointerover", (e) => {
      updateHoverInfo(e.target.label)
      oldLabelOpacity = label.alpha
      if (!dragging) {
        renderPixiFromD3()
      }
    })
      .on("pointerleave", () => {
        updateHoverInfo(null)
        label.alpha = oldLabelOpacity
        if (!dragging) {
          renderPixiFromD3()
        }
      })

    if (isTagNode) {
      gfx.stroke({ width: 1.5, color: "#bc8cff" })
    }

    nodesContainer.addChild(gfx)
    labelsContainer.addChild(label)

    const glowGfx = new Graphics({ interactive: false, eventMode: "none" })
      .circle(0, 0, nodeRadius(n) * 1.4)
      .fill({ color: isTagNode ? "#bc8cff" : color(n) })
    glowGfx.alpha = glowAlpha ?? 0.5
    glowContainer.addChild(glowGfx)

    const nodeRenderDatum: NodeRenderData = {
      simulationData: n,
      gfx,
      label,
      color: color(n),
      alpha: 1,
      active: false,
      glowGfx,
      driftPhase: Math.random() * Math.PI * 2,
    }

    nodeRenderData.push(nodeRenderDatum)
  }

  for (const l of graphData.links) {
    const gfx = new Graphics({ interactive: false, eventMode: "none" })
    linkContainer.addChild(gfx)

    const linkRenderDatum: LinkRenderData = {
      simulationData: l,
      gfx,
      color: "#30363d",  // dark axon color
      alpha: 0.5,
      active: false,
    }

    linkRenderData.push(linkRenderDatum)
  }

  let currentTransform = zoomIdentity
  if (enableDrag) {
    select<HTMLCanvasElement, NodeData | undefined>(app.canvas).call(
      drag<HTMLCanvasElement, NodeData | undefined>()
        .container(() => app.canvas)
        .subject(() => graphData.nodes.find((n) => n.id === hoveredNodeId))
        .on("start", function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(1).restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
          event.subject.__initialDragPos = {
            x: event.subject.x,
            y: event.subject.y,
            fx: event.subject.fx,
            fy: event.subject.fy,
          }
          dragStartTime = Date.now()
          dragging = true
        })
        .on("drag", function dragged(event) {
          const initPos = event.subject.__initialDragPos
          event.subject.fx = initPos.x + (event.x - initPos.x) / currentTransform.k
          event.subject.fy = initPos.y + (event.y - initPos.y) / currentTransform.k
        })
        .on("end", function dragended(event) {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
          dragging = false

          // if the time between mousedown and mouseup is short, we consider it a click
          if (Date.now() - dragStartTime < 500) {
            const node = graphData.nodes.find((n) => n.id === event.subject.id) as NodeData
            const targ = resolveRelative(fullSlug, node.id)
            window.spaNavigate(new URL(targ, window.location.toString()))
          }
        }),
    )
  } else {
    for (const node of nodeRenderData) {
      node.gfx.on("click", () => {
        const targ = resolveRelative(fullSlug, node.simulationData.id)
        window.spaNavigate(new URL(targ, window.location.toString()))
      })
    }
  }

  if (enableZoom) {
    select<HTMLCanvasElement, NodeData>(app.canvas).call(
      zoom<HTMLCanvasElement, NodeData>()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.25, 4])
        .on("zoom", ({ transform }) => {
          currentTransform = transform
          stage.scale.set(transform.k, transform.k)
          stage.position.set(transform.x, transform.y)

          // zoom adjusts opacity of labels too (disabled in neuronMode — hover controls visibility)
          const scale = transform.k * opacityScale
          let scaleOpacity = Math.max((scale - 1) / 3.75, 0)
          const activeNodes = nodeRenderData.filter((n) => n.active).flatMap((n) => n.label)

          if (!neuronMode) {
            for (const label of labelsContainer.children) {
              if (!activeNodes.includes(label)) {
                label.alpha = scaleOpacity
              }
            }
          }
        }),
    )
  }

  let stopAnimation = false
  let frameSkip = 0
  let paused = false
  const onVisibilityChange = () => { paused = document.hidden }
  document.addEventListener("visibilitychange", onVisibilityChange)

  function animate(time: number) {
    if (stopAnimation) return
    if (paused) { requestAnimationFrame(animate); return }

    const isIdle = hoveredNodeId === null && simulation.alpha() < 0.05
    if (isIdle) {
      frameSkip++
      if (frameSkip % 2 !== 0) { requestAnimationFrame(animate); return }
    } else {
      frameSkip = 0
    }

    if (simulation.alpha() < 0.1) {
      for (const n of graphData.nodes) {
        const phase = (n as any).driftPhase ?? 0
        const t = time * (driftFrequency ?? 0.0008)
        n.vx = (n.vx ?? 0) + (driftAmplitude ?? 0.4) * Math.sin(t + phase)
        n.vy = (n.vy ?? 0) + (driftAmplitude ?? 0.4) * Math.cos(t * 0.7 + phase)
      }
    }

    for (const n of nodeRenderData) {
      const { x, y } = n.simulationData
      if (!x || !y) continue
      n.gfx.position.set(x + width / 2, y + height / 2)
      n.glowGfx.position.set(x + width / 2, y + height / 2)
      if (n.label) {
        n.label.position.set(x + width / 2, y + height / 2)
      }
      if (!n.active) {
        const pulse = Math.sin((time / (pulseSpeed ?? 2000)) * Math.PI * 2 + n.driftPhase) * 0.5 + 0.5
        n.glowGfx.alpha = (glowAlpha ?? 0.35) * (0.6 + 0.4 * pulse)
      }
    }

    for (const l of linkRenderData) {
      const linkData = l.simulationData
      l.gfx.clear()
      l.gfx.moveTo(linkData.source.x! + width / 2, linkData.source.y! + height / 2)
      if (l.active) {
        const pulseAlpha = 0.6 + 0.4 * Math.sin(time * 0.004)
        l.gfx.lineTo(linkData.target.x! + width / 2, linkData.target.y! + height / 2)
          .stroke({ alpha: pulseAlpha, width: 1.2, color: "#58a6ff" })
      } else {
        l.gfx.lineTo(linkData.target.x! + width / 2, linkData.target.y! + height / 2)
          .stroke({ alpha: l.alpha, width: 0.6, color: l.color })
      }
    }

    tweens.forEach((t) => t.update(time))
    app.renderer.render(stage)
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
  return () => {
    stopAnimation = true
    document.removeEventListener("visibilitychange", onVisibilityChange)
    app.destroy()
  }
}

let localGraphCleanups: (() => void)[] = []
let globalGraphCleanups: (() => void)[] = []

function cleanupLocalGraphs() {
  for (const cleanup of localGraphCleanups) {
    cleanup()
  }
  localGraphCleanups = []
}

function cleanupGlobalGraphs() {
  for (const cleanup of globalGraphCleanups) {
    cleanup()
  }
  globalGraphCleanups = []
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const slug = e.detail.url
  addToVisited(simplifySlug(slug))

  async function renderLocalGraph() {
    cleanupLocalGraphs()
    const localGraphContainers = document.getElementsByClassName("graph-container")
    for (const container of localGraphContainers) {
      localGraphCleanups.push(await renderGraph(container as HTMLElement, slug))
    }
  }

  await renderLocalGraph()
  const handleThemeChange = () => {
    void renderLocalGraph()
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => {
    document.removeEventListener("themechange", handleThemeChange)
  })

  const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]
  async function renderGlobalGraph() {
    const slug = getFullSlug(window)
    for (const container of containers) {
      container.classList.add("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = "1"
      }

      const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
      registerEscapeHandler(container, hideGlobalGraph)
      if (graphContainer) {
        globalGraphCleanups.push(await renderGraph(graphContainer, slug))
      }
    }
  }

  function hideGlobalGraph() {
    cleanupGlobalGraphs()
    for (const container of containers) {
      container.classList.remove("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }
  }

  async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const anyGlobalGraphOpen = containers.some((container) =>
        container.classList.contains("active"),
      )
      anyGlobalGraphOpen ? hideGlobalGraph() : renderGlobalGraph()
    }
  }

  const containerIcons = document.getElementsByClassName("global-graph-icon")
  Array.from(containerIcons).forEach((icon) => {
    icon.addEventListener("click", renderGlobalGraph)
    window.addCleanup(() => icon.removeEventListener("click", renderGlobalGraph))
  })

  document.addEventListener("keydown", shortcutHandler)
  window.addCleanup(() => {
    document.removeEventListener("keydown", shortcutHandler)
    cleanupLocalGraphs()
    cleanupGlobalGraphs()
  })
})
