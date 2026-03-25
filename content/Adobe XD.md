---
seoTitle: Adobe XD Reference – UI/UX Design and Prototyping Complete Guide
description: "Adobe XD complete reference covering artboards, components, auto-animate, prototyping, design systems, plugins, developer handoff, and UI/UX workflows."
keywords: "Adobe XD, UI design, UX design, prototyping, artboards, components, auto-animate, design systems, developer handoff, wireframing, interaction design, plugins, repeat grid"
---

- # History
	- **Created by**: Adobe Inc. — internal team focused on UI/UX tooling.
	- **First release**: March 2016 (macOS preview), Windows support added in 2017.
	- **Why**: Designers were using Sketch, InVision, and Figma separately — XD aimed to combine design + prototyping + handoff in one Adobe-native tool.
	- **End of new features**: Adobe announced in 2023 it would stop adding new features to XD, shifting focus to Firefly and Figma (after failed acquisition). XD still works and is widely used.
-
- # Introduction
	- **Adobe XD** is a vector-based UI/UX design and prototyping tool for web, mobile, and desktop interfaces.
	- Works on a **canvas** with **artboards** — each artboard represents one screen or state.
	- Covers the full design workflow: **wireframe → visual design → prototype → handoff**.
	- Part of Adobe Creative Cloud — integrates with Photoshop, Illustrator, After Effects, and Fonts.
	-
	- ## Advantages
		- All-in-one: design, prototype, and share in one app.
		- Fast and lightweight compared to Photoshop/Illustrator for UI work.
		- Repeat Grid — powerful feature for quickly building lists and grids.
		- Auto-Animate — creates smooth micro-interactions between artboards.
		- Deep Adobe CC integration (drag assets from Photoshop/Illustrator directly).
		- Free starter plan available.
	-
	- ## Disadvantages
		- Adobe stopped adding new features in 2023 — no active development.
		- Figma has largely replaced it in the industry for collaborative work.
		- Real-time collaboration is limited compared to Figma.
		- No Linux support.
		- Plugin ecosystem smaller than Figma's.
-
- # Core Workspace
	- ## Canvas & Artboards
	  collapsed:: true
		- The **canvas** is the infinite workspace where all artboards live.
		- An **artboard** = one screen/state (e.g., Home Screen, Login Page, Modal).
		- Add artboard: press **A** → choose preset size (iPhone, iPad, Web 1920, custom).
		- ```
		  Common Artboard Presets:
		  iPhone 14 Pro       393 × 852 px
		  iPhone SE           375 × 667 px
		  iPad Pro 12.9"      1024 × 1366 px
		  Web 1920            1920 × 1080 px
		  Web 1280            1280 × 800 px
		  Android (360dp)     360 × 640 px
		  ```
	-
	- ## Panels Overview
	  collapsed:: true
		- ```
		  Panel              Location     Purpose
		  Layers Panel       Left         View/select all layers and groups
		  Assets Panel       Left         Components, colors, character styles
		  Design Panel       Right        Position, size, fill, border, effects
		  Prototype Panel    Right        Interactions, triggers, transitions
		  Share Panel        Right        Publish links, developer specs
		  ```
	-
	- ## Design vs Prototype vs Share Modes
	  collapsed:: true
		- **Design Mode** — draw, style, and arrange elements on artboards.
		- **Prototype Mode** — connect artboards with interaction wires.
		- **Share Mode** — publish to cloud for review, testing, or developer handoff.
		- Switch between modes using the tabs at the top-left of the toolbar.
-
- # Drawing & Design Tools
  collapsed:: true
	- ## Shape Tools
	  collapsed:: true
		- ```
		  Tool          Shortcut    Use
		  Rectangle     R           Boxes, cards, buttons, containers
		  Ellipse       E           Circles, avatars, icons
		  Line          L           Dividers, borders
		  Polygon       Y           Triangles, custom polygons
		  Pen           P           Custom vector paths
		  ```
		- Hold **Shift** while drawing to constrain proportions (perfect circle/square).
		- Double-click a shape to enter **path editing** mode — move anchor points.
	-
	- ## Text Tool
	  collapsed:: true
		- Press **T** to activate. Click for point text, click-drag for area text.
		- ```
		  Text Properties (Design Panel):
		  - Font family, weight, size
		  - Line height, letter spacing
		  - Alignment (left, center, right, justify)
		  - Text transform (uppercase, lowercase)
		  - Fixed width / auto height / auto width
		  ```
	-
	- ## Boolean Operations
	  collapsed:: true
		- Combine shapes to create complex icons and UI elements.
		- ```
		  Operation       Result
		  Add             Union of both shapes
		  Subtract        Remove top shape from bottom
		  Intersect       Keep only overlapping area
		  Exclude         Keep non-overlapping areas only
		  ```
		- Access via: Object menu → Path → Add / Subtract / Intersect / Exclude.
	-
	- ## Repeat Grid
	  collapsed:: true
		- Select any element or group → click **Repeat Grid** in the Design panel.
		- Drag the green handles to repeat horizontally or vertically.
		- Adjust gap between items by dragging the pink gap area.
		- **Drag and drop data** into a repeat grid to auto-populate:
			- Drag a `.txt` file → fills all text layers.
			- Drag multiple images → fills all image placeholders in sequence.
		- Great for: contact lists, product cards, nav menus, table rows.
-
- # Components (Symbols)
  collapsed:: true
	- ## What Are Components
	  collapsed:: true
		- **Components** are reusable UI elements — like symbols in Sketch or components in Figma.
		- Create a component: select element → right-click → **Make Component** (Cmd+K / Ctrl+K).
		- The original becomes the **Main Component** (shown with a green outline).
		- All copies are **Instances** — they inherit changes from the main component.
	-
	- ## Component States
	  collapsed:: true
		- Components can have multiple **states** (Default, Hover, Pressed, Disabled).
		- Switch states in the Design panel under the component section.
		- Used for interactive buttons, toggles, input fields.
		- ```
		  Button Component States:
		  - Default   → normal appearance
		  - Hover     → slightly lighter/darker
		  - Pressed   → depressed/scaled down
		  - Disabled  → grayed out, no interaction
		  ```
	-
	- ## Overriding Instances
	  collapsed:: true
		- Instances inherit from the main component but you can **override** specific properties.
		- Override text, fill color, image, or visibility on individual instances.
		- Overrides are preserved even when the main component updates.
-
- # Assets Panel
  collapsed:: true
	- ## Colors
	  collapsed:: true
		- Save brand colors as **document colors** for reuse across the project.
		- Add color: Design panel → fill color → click the `+` in Assets panel.
		- Editing a saved color updates all elements using it — like a global variable.
	-
	- ## Character Styles
	  collapsed:: true
		- Save text styles (font, size, weight, color) as reusable **character styles**.
		- Ensures typographic consistency across all screens.
		- ```
		  Example Character Styles:
		  H1 — Inter Bold 32px #1A1A1A
		  H2 — Inter SemiBold 24px #1A1A1A
		  Body — Inter Regular 16px #4A4A4A
		  Caption — Inter Regular 12px #888888
		  ```
	-
	- ## Components Library
	  collapsed:: true
		- All components created in the document appear here.
		- Drag from Assets panel to place a new instance on the canvas.
		- **Linked Assets**: Share assets across multiple XD documents via Creative Cloud Libraries.
-
- # Prototyping
  collapsed:: true
	- ## Connecting Artboards
	  collapsed:: true
		- Switch to **Prototype Mode** (top-left tab).
		- Hover over an element → blue arrow appears → drag to target artboard.
		- This creates an **interaction wire**.
	-
	- ## Triggers
	  collapsed:: true
		- ```
		  Trigger         When it fires
		  Tap             User taps/clicks the element
		  Drag            User drags the element
		  Hover           Mouse enters the element area
		  Keys & Gamepad  Keyboard key press
		  Time            Fires automatically after a delay
		  Voice           Voice command (Alexa-style)
		  ```
	-
	- ## Transitions & Animations
	  collapsed:: true
		- ```
		  Transition       Description
		  None             Instant switch, no animation
		  Dissolve         Fade between screens
		  Slide Left/Right Slide in from a direction
		  Push Left/Right  Current screen pushes out
		  Auto-Animate     Morphs matching layers between artboards
		  Overlay          New screen appears on top (modal/drawer)
		  ```
		- Set **duration** (ms) and **easing** (ease-in, ease-out, snap, etc.) per transition.
	-
	- ## Auto-Animate
	  collapsed:: true
		- The most powerful XD prototyping feature.
		- Automatically animates **matching layers** (same name) between two artboards.
		- Works for: position, size, rotation, opacity, fill color changes.
		- ```
		  How to use Auto-Animate:
		  1. Duplicate an artboard (Cmd+D / Ctrl+D)
		  2. Move/resize/recolor elements on the duplicate
		  3. Connect original → duplicate with trigger: Tap
		  4. Set transition: Auto-Animate
		  5. Preview → XD morphs between the two states
		  ```
		- Use cases: expanding cards, button press effects, menu open/close, tab switches.
	-
	- ## Scrollable Artboards
	  collapsed:: true
		- Make an artboard taller than the viewport to simulate scrolling.
		- In Prototype panel → enable **Scrolling** → set viewport height.
		- ```
		  Viewport Height = visible screen height (e.g., 812px for iPhone)
		  Artboard Height = full content height (e.g., 2000px for long page)
		  ```
	-
	- ## Fixed Elements (Sticky)
	  collapsed:: true
		- Select a layer → Prototype panel → enable **Fix Position when Scrolling**.
		- Use for: sticky headers, floating action buttons, bottom nav bars.
-
- # Design Systems in XD
  collapsed:: true
	- ## What Is a Design System
	  collapsed:: true
		- A collection of reusable components, styles, and guidelines that ensure consistency.
		- In XD: built from **Components + Colors + Character Styles + CC Libraries**.
	-
	- ## CC Libraries (Shared Assets)
	  collapsed:: true
		- Store colors, character styles, and components in a **Creative Cloud Library**.
		- Share the library with your team — everyone uses the same assets.
		- Updates to library assets propagate to all linked documents.
		- Access via: Window → CC Libraries (or Assets panel → Libraries tab).
	-
	- ## Design Tokens Workflow
	  collapsed:: true
		- Export design tokens (colors, spacing, typography) using plugins like **Design Tokens** or **Zeplin**.
		- Tokens bridge the gap between design and code — developers use the same values.
		- ```
		  Example Token Export (JSON):
		  {
		    "color-primary": "#0057FF",
		    "color-text": "#1A1A1A",
		    "spacing-sm": "8px",
		    "spacing-md": "16px",
		    "font-size-body": "16px"
		  }
		  ```
-
- # Developer Handoff
  collapsed:: true
	- ## Share for Development
	  collapsed:: true
		- Switch to **Share Mode** → choose **Development** as the share type.
		- Publish to cloud → share the link with developers.
		- Developers can inspect every element: dimensions, spacing, fonts, colors, CSS.
	-
	- ## Inspect Panel (Developer View)
	  collapsed:: true
		- Click any element in the shared link to see:
		- ```
		  Property         What developers see
		  Position         X, Y coordinates on artboard
		  Size             Width × Height in px
		  Fill             Hex color, opacity, gradient details
		  Border           Color, width, radius
		  Typography       Font, size, weight, line-height, letter-spacing
		  Effects          Drop shadow values, blur
		  CSS Snippet      Auto-generated CSS for the element
		  ```
	-
	- ## Exporting Assets
	  collapsed:: true
		- Mark any layer for export: right-click → **Mark for Export**.
		- Export formats: PNG, SVG, PDF, JPG.
		- Set scale multipliers: 1x, 2x, 3x for different screen densities.
		- ```
		  Export Settings:
		  Format    Use Case
		  PNG       Raster images, icons with transparency
		  SVG       Icons, illustrations (scalable, code-friendly)
		  PDF       Print assets, vector documents
		  JPG       Photos, backgrounds (smaller file size)
		  ```
-
- # Plugins
  collapsed:: true
	- ## Installing Plugins
	  collapsed:: true
		- Plugins menu → Browse Plugins → search and install.
		- Or visit: https://xd.adobe.com/plugins/
	-
	- ## Essential Plugins
	  collapsed:: true
		- ```
		  Plugin              Use
		  UI Faces            Auto-fill avatar placeholders with real faces
		  Unsplash            Insert free stock photos directly into XD
		  Icons 4 Design      Access thousands of icons (Material, Font Awesome)
		  Stark               Accessibility checker — contrast ratios, color blindness
		  Overflow            Advanced user flow and journey mapping
		  Zeplin              Enhanced developer handoff with annotations
		  Anima               Export XD designs to HTML/CSS/React code
		  Content Generator   Fill designs with realistic dummy data
		  ```
-
- # Shortcuts (Essential)
  collapsed:: true
	- ```
	  Action                        Win                  Mac
	  Select Tool                   V / Esc              V / Esc
	  Rectangle                     R                    R
	  Ellipse                       E                    E
	  Line                          L                    L
	  Pen Tool                      P                    P
	  Text Tool                     T                    T
	  Artboard Tool                 A                    A
	  Zoom In / Out                 Ctrl + / Ctrl -      Cmd + / Cmd -
	  Fit All Artboards             Ctrl + Shift + H     Cmd + Shift + H
	  Duplicate                     Ctrl + D             Cmd + D
	  Make Component                Ctrl + K             Cmd + K
	  Group                         Ctrl + G             Cmd + G
	  Ungroup                       Ctrl + Shift + G     Cmd + Shift + G
	  Lock Layer                    Ctrl + L             Cmd + L
	  Hide Layer                    Ctrl + ;             Cmd + ;
	  Repeat Grid                   Ctrl + R             Cmd + R
	  Preview (Desktop)             Ctrl + Enter         Cmd + Enter
	  Export Selected               Ctrl + E             Cmd + E
	  Undo / Redo                   Ctrl + Z / Y         Cmd + Z / Y
	  Align Left                    Ctrl + Shift + ←     Cmd + Shift + ←
	  Align Right                   Ctrl + Shift + →     Cmd + Shift + →
	  ```
-
- # XD vs Figma vs Sketch
	- ```
	  Feature              Adobe XD          Figma              Sketch
	  Platform             Win + Mac         Browser + Desktop  Mac only
	  Real-time collab     Limited           Excellent          Via plugins
	  Auto-Animate         Built-in          Via plugins        Via plugins
	  Repeat Grid          Built-in          Components         Symbols
	  Dev Handoff          Share Mode        Dev Mode           Zeplin/plugin
	  Plugin ecosystem     Medium            Large              Large
	  Active development   No (2023)         Yes                Yes
	  Free tier            Yes (limited)     Yes (generous)     No
	  Adobe CC integration Excellent         Limited            Limited
	  ```
-
- # Useful Links
	- Official Docs: https://helpx.adobe.com/xd/user-guide.html
	- Plugin Directory: https://xd.adobe.com/plugins/
	- XD Scripting API: https://www.adobe.io/xd/uxp/develop/
	- Community Forum: https://community.adobe.com/t5/adobe-xd/ct-p/ct-adobe-xd
	- Tutorials: https://helpx.adobe.com/xd/tutorials.html
	- UI Kits (free): https://www.adobe.com/products/xd/resources.html
-
- # Key Takeaways
	- XD = design + prototype + handoff in one tool, tightly integrated with Adobe CC.
	- **Artboards** are screens, **Components** are reusable elements, **Assets** are shared styles.
	- **Auto-Animate** is XD's standout feature — smooth micro-interactions with zero code.
	- **Repeat Grid** saves massive time building lists, cards, and grids.
	- For new projects in 2024+, consider Figma — XD is stable but no longer actively developed.