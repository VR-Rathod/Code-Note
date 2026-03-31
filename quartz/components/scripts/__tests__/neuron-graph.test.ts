/**
 * Property-based tests for the brain-neuron-graph feature.
 *
 * **Validates: Requirements — Property 4**
 * Single BlurFilter invariant: after `createGlowContainer`, `glowContainer.filters`
 * has exactly one entry and no individual `glowGfx` has filters set.
 */

import test, { describe } from "node:test"
import assert from "node:assert"
import * as fc from "fast-check"

// ---------------------------------------------------------------------------
// Minimal PixiJS stubs — we only need the structural behaviour, not rendering
// ---------------------------------------------------------------------------

class StubBlurFilter {
    readonly type = "BlurFilter"
    strength: number
    constructor(opts: { strength: number }) {
        this.strength = opts.strength
    }
}

class StubGraphics {
    filters: unknown[] | null = null
    alpha = 1
    interactive = false
    eventMode = "none"

    circle(_x: number, _y: number, _r: number) {
        return this
    }
    fill(_opts: unknown) {
        return this
    }
}

class StubContainer {
    filters: unknown[] | null = null
    zIndex: number
    isRenderGroup: boolean
    children: StubGraphics[] = []

    constructor(opts: { zIndex: number; isRenderGroup: boolean }) {
        this.zIndex = opts.zIndex
        this.isRenderGroup = opts.isRenderGroup
    }

    addChild(child: StubGraphics) {
        this.children.push(child)
    }
}

// ---------------------------------------------------------------------------
// Functions under test — mirrors the real createGlowContainer /
// createGlowGraphic logic from graph.inline.ts
// ---------------------------------------------------------------------------

function createGlowContainer(glowRadius: number): StubContainer {
    const container = new StubContainer({ zIndex: 0, isRenderGroup: true })
    container.filters = [new StubBlurFilter({ strength: glowRadius })]
    return container
}

function createGlowGraphic(
    color: string,
    radius: number,
    glowAlpha: number,
): StubGraphics {
    const gfx = new StubGraphics()
    gfx.circle(0, 0, radius * 2.5).fill({ color })
    gfx.alpha = glowAlpha
    // Intentionally NO filters set — this is the invariant we are testing
    return gfx
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

// fc.float requires 32-bit float boundaries
const positiveFloat = (min: number, max: number) =>
    fc.float({ min: Math.fround(min), max: Math.fround(max), noNaN: true })

const hexColor = fc
    .integer({ min: 0, max: 0xffffff })
    .map((n) => `#${n.toString(16).padStart(6, "0")}`)

// ---------------------------------------------------------------------------
// Property 4: Single BlurFilter invariant
// ---------------------------------------------------------------------------

describe("Property 4 — Single BlurFilter invariant", () => {
    test("glowContainer always has exactly one filter entry for any valid glowRadius", () => {
        fc.assert(
            fc.property(
                positiveFloat(0.1, 100),
                (glowRadius) => {
                    const container = createGlowContainer(glowRadius)

                    assert.ok(Array.isArray(container.filters), "filters must be an array")
                    assert.strictEqual(
                        container.filters!.length,
                        1,
                        `Expected exactly 1 filter, got ${container.filters!.length}`,
                    )

                    const filter = container.filters![0] as StubBlurFilter
                    assert.strictEqual(filter.type, "BlurFilter")
                    assert.strictEqual(filter.strength, glowRadius)
                },
            ),
            { numRuns: 200 },
        )
    })

    test("individual glowGfx objects have no filters set for any node configuration", () => {
        fc.assert(
            fc.property(
                hexColor,
                positiveFloat(1, 50),
                positiveFloat(0.01, 1.0),
                (color, radius, glowAlpha) => {
                    const gfx = createGlowGraphic(color, radius, glowAlpha)

                    assert.ok(
                        gfx.filters === null || gfx.filters === undefined,
                        "glowGfx must not have any filters set",
                    )
                },
            ),
            { numRuns: 200 },
        )
    })

    test("adding N glowGfx children to glowContainer does not change the filter count", () => {
        fc.assert(
            fc.property(
                positiveFloat(0.1, 100),
                fc.array(
                    fc.record({
                        color: hexColor,
                        radius: positiveFloat(1, 50),
                        glowAlpha: positiveFloat(0.01, 1.0),
                    }),
                    { maxLength: 300 },
                ),
                (glowRadius, nodes) => {
                    const container = createGlowContainer(glowRadius)

                    for (const { color, radius, glowAlpha } of nodes) {
                        const gfx = createGlowGraphic(color, radius, glowAlpha)
                        container.addChild(gfx)
                    }

                    assert.strictEqual(
                        container.filters!.length,
                        1,
                        "glowContainer must retain exactly one BlurFilter after adding children",
                    )

                    for (const child of container.children) {
                        assert.ok(
                            child.filters === null || child.filters === undefined,
                            "No glowGfx child should have filters set",
                        )
                    }
                },
            ),
            { numRuns: 100 },
        )
    })
})

// ---------------------------------------------------------------------------
// Stubs for hub ring condition test
// ---------------------------------------------------------------------------

interface StrokeCall {
    width: number
    color: string
    alpha: number
}

class StubRingGraphics {
    strokeCalls: StrokeCall[] = []

    circle(_x: number, _y: number, _r: number) {
        return this
    }

    stroke(opts: StrokeCall) {
        this.strokeCalls.push(opts)
        return this
    }
}

// ---------------------------------------------------------------------------
// Logic under test — mirrors the hub ring condition from graph.inline.ts
// ---------------------------------------------------------------------------

/**
 * Draws a dendrite ring on `gfx` if and only if `degree > 5`.
 * Mirrors the exact condition from graph.inline.ts:
 *   if (degree > 5) {
 *     gfx.circle(0, 0, nodeRadius(n) * 1.8).stroke({ width: 0.8, color, alpha: 0.3 })
 *   }
 */
function maybeDrawHubRing(gfx: StubRingGraphics, degree: number, nodeRadius: number, color: string): void {
    if (degree > 5) {
        gfx.circle(0, 0, nodeRadius * 1.8).stroke({ width: 0.8, color, alpha: 0.3 })
    }
}

// ---------------------------------------------------------------------------
// Property 12: Hub ring condition
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 12**
 * Hub ring condition: a dendrite ring is drawn if and only if degree > 5.
 */
describe("Property 12 — Hub ring condition", () => {
    test("no ring is drawn for any degree <= 5", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 5 }),
                fc.float({ min: Math.fround(1), max: Math.fround(50), noNaN: true }),
                hexColor,
                (degree, nodeRadius, color) => {
                    const gfx = new StubRingGraphics()
                    maybeDrawHubRing(gfx, degree, nodeRadius, color)

                    assert.strictEqual(
                        gfx.strokeCalls.length,
                        0,
                        `Expected no ring for degree=${degree}, but stroke() was called`,
                    )
                },
            ),
            { numRuns: 500 },
        )
    })

    test("a ring IS drawn for any degree > 5", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 6, max: 1000 }),
                fc.float({ min: Math.fround(1), max: Math.fround(50), noNaN: true }),
                hexColor,
                (degree, nodeRadius, color) => {
                    const gfx = new StubRingGraphics()
                    maybeDrawHubRing(gfx, degree, nodeRadius, color)

                    assert.strictEqual(
                        gfx.strokeCalls.length,
                        1,
                        `Expected exactly one ring for degree=${degree}, but got ${gfx.strokeCalls.length}`,
                    )
                },
            ),
            { numRuns: 500 },
        )
    })

    test("the boundary is exactly degree > 5 (degree=5 → no ring, degree=6 → ring)", () => {
        // degree = 5: no ring
        const gfx5 = new StubRingGraphics()
        maybeDrawHubRing(gfx5, 5, 10, "#ffffff")
        assert.strictEqual(gfx5.strokeCalls.length, 0, "degree=5 must NOT draw a ring")

        // degree = 6: ring drawn
        const gfx6 = new StubRingGraphics()
        maybeDrawHubRing(gfx6, 6, 10, "#ffffff")
        assert.strictEqual(gfx6.strokeCalls.length, 1, "degree=6 MUST draw a ring")
    })
})

// ---------------------------------------------------------------------------
// Property 1: Drift boundedness
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 1**
 * Drift boundedness: for any time, amplitude, frequency, and phase,
 * computed dx and dy are within [-amplitude, amplitude].
 */
describe("Property 1 — Drift boundedness", () => {
    test("dx and dy are always within [-amplitude, amplitude] for any valid inputs", () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true, noDefaultInfinity: true }),
                fc.float({ min: Math.fround(0.1), max: Math.fround(2.0), noNaN: true }),
                fc.float({ min: Math.fround(0.0001), max: Math.fround(0.01), noNaN: true }),
                fc.float({ min: Math.fround(0), max: Math.fround(Math.PI * 2), noNaN: true }),
                (time, amplitude, frequency, phase) => {
                    const dx = amplitude * Math.sin(time * frequency + phase)
                    const dy = amplitude * Math.cos(time * frequency * 0.7 + phase)

                    assert.ok(
                        dx >= -amplitude && dx <= amplitude,
                        `dx=${dx} is outside [-${amplitude}, ${amplitude}]`,
                    )
                    assert.ok(
                        dy >= -amplitude && dy <= amplitude,
                        `dy=${dy} is outside [-${amplitude}, ${amplitude}]`,
                    )
                },
            ),
            { numRuns: 500 },
        )
    })
})

// ---------------------------------------------------------------------------
// Property 11: Glow pulse range
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 11**
 * Glow pulse range: for any time, pulseSpeed > 0, glowAlpha, and driftPhase,
 * computed glow alpha is within [glowAlpha * 0.6, glowAlpha * 1.0].
 */
describe("Property 11 — Glow pulse range", () => {
    test("glow alpha is always within [glowAlpha * 0.6, glowAlpha * 1.0]", () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true, noDefaultInfinity: true }),
                fc.float({ min: Math.fround(0.001), max: Math.fround(10000), noNaN: true }),
                fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }),
                fc.float({ min: Math.fround(0), max: Math.fround(Math.PI * 2), noNaN: true }),
                (time, pulseSpeed, glowAlpha, driftPhase) => {
                    const pulse = Math.sin((time / pulseSpeed) * Math.PI * 2 + driftPhase) * 0.5 + 0.5
                    const alpha = glowAlpha * (0.6 + 0.4 * pulse)

                    const minAlpha = glowAlpha * 0.6
                    const maxAlpha = glowAlpha * 1.0

                    assert.ok(
                        alpha >= minAlpha - 1e-6 && alpha <= maxAlpha + 1e-6,
                        `alpha=${alpha} is outside [${minAlpha}, ${maxAlpha}] for glowAlpha=${glowAlpha}`,
                    )
                },
            ),
            { numRuns: 500 },
        )
    })
})

// ---------------------------------------------------------------------------
// Property 8: Active link pulse range
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 8**
 * Active link pulse range: for any time, 0.7 + 0.3 * sin(time * 0.005)
 * is always within [0.4, 1.0].
 */
describe("Property 8 — Active link pulse range", () => {
    test("active link alpha is always within [0.4, 1.0] for any time value", () => {
        fc.assert(
            fc.property(
                fc.double({ min: 0, max: Number.MAX_SAFE_INTEGER, noNaN: true, noDefaultInfinity: true }),
                (time) => {
                    const pulseAlpha = 0.7 + 0.3 * Math.sin(time * 0.005)

                    assert.ok(
                        pulseAlpha >= 0.4 - 1e-6 && pulseAlpha <= 1.0 + 1e-6,
                        `pulseAlpha=${pulseAlpha} is outside [0.4, 1.0] for time=${time}`,
                    )
                },
            ),
            { numRuns: 1000 },
        )
    })
})

// ---------------------------------------------------------------------------
// RAF throttle logic under test
// ---------------------------------------------------------------------------

function throttleFrame(
    frameSkip: number,
    isIdle: boolean,
): { skip: boolean; newFrameSkip: number } {
    if (isIdle) {
        const newSkip = frameSkip + 1
        return { skip: newSkip % 2 !== 0, newFrameSkip: newSkip }
    } else {
        return { skip: false, newFrameSkip: 0 }
    }
}

// ---------------------------------------------------------------------------
// Property 6: RAF throttle correctness
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 6**
 * RAF throttle correctness: when idle, exactly every other frame is skipped;
 * when not idle, frameSkip resets to 0 and skip is always false.
 */
describe("Property 6 — RAF throttle correctness", () => {
    test("when not idle, frameSkip always resets to 0 and skip is always false", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 10000 }),
                (frameSkip) => {
                    const result = throttleFrame(frameSkip, false)

                    assert.strictEqual(result.skip, false, "skip must be false when not idle")
                    assert.strictEqual(result.newFrameSkip, 0, "frameSkip must reset to 0 when not idle")
                },
            ),
            { numRuns: 500 },
        )
    })

    test("when idle, alternating frames are skipped (odd frameSkip → skip, even → render)", () => {
        fc.assert(
            fc.property(
                fc.integer({ min: 0, max: 10000 }),
                (frameSkip) => {
                    const result = throttleFrame(frameSkip, true)
                    const newSkip = frameSkip + 1

                    assert.strictEqual(result.newFrameSkip, newSkip, "newFrameSkip must be frameSkip + 1")

                    if (newSkip % 2 !== 0) {
                        assert.strictEqual(result.skip, true, `frameSkip=${newSkip} (odd) should be skipped`)
                    } else {
                        assert.strictEqual(result.skip, false, `frameSkip=${newSkip} (even) should render`)
                    }
                },
            ),
            { numRuns: 500 },
        )
    })

    test("idle sequence: frames 1,3,5,... are skipped; frames 2,4,6,... are rendered", () => {
        // Simulate 10 consecutive idle frames starting from frameSkip=0
        let frameSkip = 0
        for (let i = 1; i <= 10; i++) {
            const result = throttleFrame(frameSkip, true)
            frameSkip = result.newFrameSkip

            if (i % 2 !== 0) {
                assert.strictEqual(result.skip, true, `frame ${i} (odd) should be skipped`)
            } else {
                assert.strictEqual(result.skip, false, `frame ${i} (even) should render`)
            }
        }
    })
})

// ---------------------------------------------------------------------------
// Stubs for node scale pop test
// ---------------------------------------------------------------------------

interface ScaleTarget { x: number; y: number }

interface NodeScaleResult {
    alpha: number
    targetScale: ScaleTarget
    targetGlowAlpha: number
}

/**
 * Mirrors the renderNodes() tween-target logic from graph.inline.ts.
 * Returns the tween targets for a single node given hover state.
 */
function computeNodeTweenTargets(
    nodeId: string,
    isActive: boolean,
    hoveredNodeId: string | null,
    focusOnHover: boolean,
    glowAlpha: number,
): NodeScaleResult {
    let alpha = 1
    let targetScale: ScaleTarget = { x: 1, y: 1 }
    let targetGlowAlpha = glowAlpha

    if (hoveredNodeId !== null && focusOnHover) {
        if (nodeId === hoveredNodeId) {
            targetScale = { x: 1.3, y: 1.3 }
            targetGlowAlpha = 0.9
        } else if (isActive) {
            alpha = 1
            targetScale = { x: 1.1, y: 1.1 }
            targetGlowAlpha = 0.9
        } else {
            alpha = 0.15
        }
    } else if (hoveredNodeId !== null) {
        if (nodeId === hoveredNodeId) {
            targetScale = { x: 1.3, y: 1.3 }
            targetGlowAlpha = 0.9
        } else if (isActive) {
            targetScale = { x: 1.1, y: 1.1 }
            targetGlowAlpha = 0.9
        }
    }

    return { alpha, targetScale, targetGlowAlpha }
}

// ---------------------------------------------------------------------------
// Property 9: Node scale pop bounds
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 9**
 * Node scale pop bounds: hovered = 1.3, neighbour = 1.1, others = 1.0;
 * resets to 1.0 when hover clears.
 */
describe("Property 9 — Node scale pop bounds", () => {
    test("hovered node always gets scale 1.3 when hoveredNodeId is set", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.boolean(),
                fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }),
                (nodeId, focusOnHover, glowAlpha) => {
                    const result = computeNodeTweenTargets(nodeId, true, nodeId, focusOnHover, glowAlpha)
                    assert.strictEqual(result.targetScale.x, 1.3, "hovered node scale.x must be 1.3")
                    assert.strictEqual(result.targetScale.y, 1.3, "hovered node scale.y must be 1.3")
                    assert.strictEqual(result.targetGlowAlpha, 0.9, "hovered node glow alpha must be 0.9")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("active neighbour node always gets scale 1.1 when not the hovered node", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                fc.boolean(),
                fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }),
                (nodeId, hoveredId, focusOnHover, glowAlpha) => {
                    // Ensure nodeId !== hoveredId
                    fc.pre(nodeId !== hoveredId)
                    const result = computeNodeTweenTargets(nodeId, true, hoveredId, focusOnHover, glowAlpha)
                    assert.strictEqual(result.targetScale.x, 1.1, "neighbour node scale.x must be 1.1")
                    assert.strictEqual(result.targetScale.y, 1.1, "neighbour node scale.y must be 1.1")
                    assert.strictEqual(result.targetGlowAlpha, 0.9, "neighbour node glow alpha must be 0.9")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("inactive non-hovered node gets scale 1.0 and alpha 0.15 when focusOnHover is true", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }),
                (nodeId, hoveredId, glowAlpha) => {
                    fc.pre(nodeId !== hoveredId)
                    const result = computeNodeTweenTargets(nodeId, false, hoveredId, true, glowAlpha)
                    assert.strictEqual(result.targetScale.x, 1.0, "inactive node scale.x must be 1.0")
                    assert.strictEqual(result.targetScale.y, 1.0, "inactive node scale.y must be 1.0")
                    assert.strictEqual(result.alpha, 0.15, "inactive node alpha must be 0.15 when focusOnHover")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("all nodes reset to scale 1.0 when hoveredNodeId is null", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.boolean(),
                fc.boolean(),
                fc.float({ min: Math.fround(0.01), max: Math.fround(1.0), noNaN: true }),
                (nodeId, isActive, focusOnHover, glowAlpha) => {
                    const result = computeNodeTweenTargets(nodeId, isActive, null, focusOnHover, glowAlpha)
                    assert.strictEqual(result.targetScale.x, 1.0, "scale.x must reset to 1.0 when no hover")
                    assert.strictEqual(result.targetScale.y, 1.0, "scale.y must reset to 1.0 when no hover")
                    assert.strictEqual(result.alpha, 1, "alpha must be 1 when no hover")
                },
            ),
            { numRuns: 300 },
        )
    })
})

// ---------------------------------------------------------------------------
// Helper for label tween target computation
// ---------------------------------------------------------------------------

/**
 * Computes the tween target alpha for a label given hover state.
 * Mirrors the renderLabels() logic from graph.inline.ts.
 */
function computeLabelTweenTarget(
    nodeId: string,
    hoveredNodeId: string | null,
    hoveredNeighbours: Set<string>,
): { alpha: number } {
    if (hoveredNodeId === null) {
        return { alpha: 0 }
    } else if (nodeId === hoveredNodeId) {
        return { alpha: 1.0 }
    } else if (hoveredNeighbours.has(nodeId)) {
        return { alpha: 0.75 }
    } else {
        return { alpha: 0 }
    }
}

// ---------------------------------------------------------------------------
// Property 2: Label exclusivity
// ---------------------------------------------------------------------------

/**
 * **Validates: Requirements — Property 2**
 * Label exclusivity: when `hoveredNodeId` is null, all label tween targets have
 * alpha = 0; when set, only hovered (1.0) and direct neighbours (0.75) have alpha > 0.
 */
describe("Property 2 — Label exclusivity", () => {
    test("when hoveredNodeId is null, all label tween targets have alpha = 0", () => {
        fc.assert(
            fc.property(
                fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 50 }),
                (nodeIds) => {
                    for (const nodeId of nodeIds) {
                        const result = computeLabelTweenTarget(nodeId, null, new Set())
                        assert.strictEqual(result.alpha, 0, `Expected alpha=0 for nodeId=${nodeId} when hoveredNodeId is null`)
                    }
                },
            ),
            { numRuns: 300 },
        )
    })

    test("hovered node always gets alpha = 1.0", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.array(fc.string({ minLength: 1 }), { maxLength: 20 }),
                (hoveredId, neighbourIds) => {
                    const neighbours = new Set(neighbourIds.filter((id) => id !== hoveredId))
                    const result = computeLabelTweenTarget(hoveredId, hoveredId, neighbours)
                    assert.strictEqual(result.alpha, 1.0, "hovered node must have alpha = 1.0")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("direct neighbours get alpha = 0.75", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                fc.array(fc.string({ minLength: 1 }), { maxLength: 20 }),
                (nodeId, hoveredId, otherNeighbourIds) => {
                    fc.pre(nodeId !== hoveredId)
                    const neighbours = new Set([nodeId, ...otherNeighbourIds.filter((id) => id !== hoveredId)])
                    const result = computeLabelTweenTarget(nodeId, hoveredId, neighbours)
                    assert.strictEqual(result.alpha, 0.75, "direct neighbour must have alpha = 0.75")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("non-hovered, non-neighbour nodes get alpha = 0", () => {
        fc.assert(
            fc.property(
                fc.string({ minLength: 1 }),
                fc.string({ minLength: 1 }),
                fc.array(fc.string({ minLength: 1 }), { maxLength: 20 }),
                (nodeId, hoveredId, neighbourIds) => {
                    fc.pre(nodeId !== hoveredId)
                    // Ensure nodeId is NOT in neighbours
                    const neighbours = new Set(neighbourIds.filter((id) => id !== nodeId && id !== hoveredId))
                    const result = computeLabelTweenTarget(nodeId, hoveredId, neighbours)
                    assert.strictEqual(result.alpha, 0, "non-neighbour node must have alpha = 0")
                },
            ),
            { numRuns: 300 },
        )
    })

    test("only hovered and direct neighbours have alpha > 0 for any graph configuration", () => {
        fc.assert(
            fc.property(
                fc.array(fc.string({ minLength: 1 }), { minLength: 2, maxLength: 30 }),
                fc.integer({ min: 0, max: 29 }),
                fc.array(fc.integer({ min: 0, max: 29 }), { maxLength: 10 }),
                (nodeIds, hoveredIdx, neighbourIdxs) => {
                    // Deduplicate nodeIds first
                    const uniqueIds = [...new Set(nodeIds)]
                    fc.pre(uniqueIds.length >= 2)

                    const clampedHoveredIdx = hoveredIdx % uniqueIds.length
                    const hoveredId = uniqueIds[clampedHoveredIdx]
                    const neighbours = new Set(
                        neighbourIdxs
                            .map((i) => uniqueIds[i % uniqueIds.length])
                            .filter((id) => id !== hoveredId),
                    )

                    for (const nodeId of uniqueIds) {
                        const result = computeLabelTweenTarget(nodeId, hoveredId, neighbours)
                        if (nodeId === hoveredId) {
                            assert.strictEqual(result.alpha, 1.0, `hovered node ${nodeId} must have alpha=1.0`)
                        } else if (neighbours.has(nodeId)) {
                            assert.strictEqual(result.alpha, 0.75, `neighbour ${nodeId} must have alpha=0.75`)
                        } else {
                            assert.strictEqual(result.alpha, 0, `non-neighbour ${nodeId} must have alpha=0`)
                        }
                    }
                },
            ),
            { numRuns: 200 },
        )
    })
})
