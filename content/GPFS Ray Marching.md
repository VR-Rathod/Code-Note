---
seoTitle: Ray Marching From Scratch – Complete Beginner to Advanced SDF Guide
description: "Learn ray marching and signed distance functions (SDFs) completely from scratch. Covers sphere tracing, all SDF primitives, boolean operations, lighting, soft shadows, AO, and complete Shadertoy demos from beginner to advanced."
keywords: "ray marching from scratch, signed distance functions, SDF, sphere tracing, Shadertoy, GLSL, Inigo Quilez, soft shadows, ambient occlusion, SDF operations, beginner graphics shader"
treeTitle: Game Development - Graphics Programming From Scratch - Ray Marching
---

tags:: graphics, ray-marching, sdf, glsl, shadertoy, beginner-to-advanced
title:: GPFS Ray Marching

- # Ray Marching — From Scratch
	- The easiest way to write real-time 3D graphics from scratch — no GPU pipeline, no mesh files, just math and a browser.
	- Everything runs on [Shadertoy](https://www.shadertoy.com) — open it now in another tab!
	- **Prerequisites:** Very basic GLSL knowledge (variables, functions, vec2/vec3)
	- Parent: [[Graphics Programming From Scratch]]
- ---
- ## 🟢 Chapter 1 — What is Ray Marching?
  collapsed:: true
	- ### Two Ways to Describe 3D Objects
		- **Traditional (triangles):** Define objects as a mesh of triangles. A sphere is ~1000 triangles.
		- **Ray Marching (SDFs):** Define objects as a **mathematical formula** that tells you how far any point in space is from the surface.
		- ```
		  Triangle approach: "This sphere is made of 1,000 triangles stored in this buffer"
		  SDF approach:      "Any point p is at distance |p| - r from a sphere of radius r"
		  
		  float sdSphere(vec3 p, float r) { return length(p) - r; }
		  ```
	- ### What is an SDF?
		- A **Signed Distance Function** `f(p)` takes a point `p` in 3D space and returns:
		- ```
		  f(p) > 0   → point is OUTSIDE the surface (positive = outside)
		  f(p) = 0   → point is ON the surface
		  f(p) < 0   → point is INSIDE the surface (negative = inside)
		  
		  The value = exact minimum distance to the nearest surface point
		  ```
		- For a sphere centered at origin with radius `r`:
		- ```
		  f(p) = |p| - r  (length of p minus radius)
		  
		  Point at (0, 2, 0), sphere radius 1:
		  f = length(0,2,0) - 1 = 2 - 1 = 1.0   → 1 unit outside
		  
		  Point at (0, 0.5, 0):
		  f = length(0,0.5,0) - 1 = 0.5 - 1 = -0.5  → 0.5 units inside
		  ```
	- ### Why SDFs Enable Ray Marching
		- If you're at point `p` and the SDF returns `d = 2.5`...
		- ...you KNOW there is no surface within 2.5 units in ANY direction
		- So you can safely step 2.5 units forward along your ray without overshooting any surface
		- This is the key insight — the SDF gives you a "safe step size"
		- ```
		  Ray at position p, pointing direction d:
		    step 1: p1 = p + d * SDF(p)      safely move SDF(p) forward
		    step 2: p2 = p1 + d * SDF(p1)    safely move SDF(p1) forward
		    ...
		    until SDF(p_n) < epsilon: HIT!
		  ```
	- ### Ray Marching vs Ray Tracing
		- **Ray Tracing (triangles):** Cast ray → analytically solve intersection with triangle geometry → instant hit
		- **Ray Marching (SDFs):** Cast ray → step forward repeatedly evaluating SDF → approximate hit
		- | | Ray Tracing | Ray Marching |
		  |---|---|---|
		  | Geometry | Triangles | Mathematical functions |
		  | Intersection | Exact | Iterative (many small steps) |
		  | Mesh assets | ✅ Standard formats | ❌ Must express as formula |
		  | Procedural shapes | ❌ Complex | ✅ Trivial |
		  | Getting started | ❌ Need full pipeline | ✅ 50 lines, runs in browser |
		  | Infinite repetition | ❌ Expensive | ✅ One `mod()` call |
- ---
- ## 🟢 Chapter 2 — Your First Ray Marcher
  collapsed:: true
	- Open [shadertoy.com](https://www.shadertoy.com) → New → delete all code → paste this:
	- ```glsl
	  // ================================================
	  // RAY MARCHER #1 — The absolute minimum
	  // ================================================
	  
	  // STEP 1: Define the scene — a single sphere
	  float sceneSDF(vec3 p) {
	      return length(p) - 1.0;  // Sphere: radius 1, centered at origin
	      // length(p) = distance from origin
	      // subtract radius → SDF of sphere
	  }
	  
	  // STEP 2: March a ray through the scene
	  float march(vec3 ro, vec3 rd) {
	      float t = 0.0;  // distance traveled along the ray
	      for (int i = 0; i < 100; i++) {
	          vec3 p = ro + rd * t;     // current position on the ray
	          float d = sceneSDF(p);    // distance to nearest surface
	          if (d < 0.001) return t;  // close enough → HIT
	          if (t > 100.0) break;     // too far → MISS
	          t += d;                   // safe step forward
	      }
	      return -1.0;  // no hit
	  }
	  
	  // STEP 3: Shadertoy's main entry point
	  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	      // Convert pixel to UV in [-1, 1] range (with aspect ratio)
	      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
	  
	      // Camera: positioned at (0, 0, 3) looking toward -Z
	      vec3 ro = vec3(0.0, 0.0, 3.0);    // ray origin (camera position)
	      vec3 rd = normalize(vec3(uv, -1.5)); // ray direction (through pixel)
	  
	      // Default: sky blue background
	      vec3 col = vec3(0.3, 0.6, 1.0);
	  
	      // March the ray
	      float t = march(ro, rd);
	      if (t > 0.0) {
	          col = vec3(0.8, 0.3, 0.1);  // hit → orange sphere
	      }
	  
	      fragColor = vec4(col, 1.0);
	  }
	  ```
	- **What you see:** An orange circle on a blue background
	- **What just happened:** Rays shot from the camera. The ones that hit the sphere returned orange. Others returned blue.
	- > [!tip] Try changing the sphere radius!
	  > Change `1.0` in `sceneSDF` to `0.5` or `2.0` — watch the sphere shrink or grow
- ---
- ## 🟢 Chapter 3 — Adding Surface Normals and Lighting
  collapsed:: true
	- A sphere with flat color isn't interesting. Let's add a light so it looks 3D.
	- ### Computing the Normal
		- The SDF gradient (rate of change) points perpendicular to the surface
		- We compute it numerically using **central differences**:
		- ```glsl
		  vec3 getNormal(vec3 p) {
		      // Sample SDF at 6 nearby points (±ε in each axis)
		      const float eps = 0.001;
		      return normalize(vec3(
		          sceneSDF(p + vec3(eps,0,0)) - sceneSDF(p - vec3(eps,0,0)),
		          sceneSDF(p + vec3(0,eps,0)) - sceneSDF(p - vec3(0,eps,0)),
		          sceneSDF(p + vec3(0,0,eps)) - sceneSDF(p - vec3(0,0,eps))
		      ));
		      // This is ∇f(p) = gradient of SDF = outward surface normal
		  }
		  ```
	- ### Basic Diffuse Lighting
		- ```glsl
		  // Complete lit ray marcher
		  float sceneSDF(vec3 p) { return length(p) - 1.0; }
		  
		  vec3 getNormal(vec3 p) {
		      const float eps = 0.001;
		      return normalize(vec3(
		          sceneSDF(p+vec3(eps,0,0)) - sceneSDF(p-vec3(eps,0,0)),
		          sceneSDF(p+vec3(0,eps,0)) - sceneSDF(p-vec3(0,eps,0)),
		          sceneSDF(p+vec3(0,0,eps)) - sceneSDF(p-vec3(0,0,eps))
		      ));
		  }
		  
		  float march(vec3 ro, vec3 rd) {
		      float t = 0.0;
		      for (int i = 0; i < 100; i++) {
		          float d = sceneSDF(ro + rd * t);
		          if (d < 0.001) return t;
		          if (t > 100.0) break;
		          t += d;
		      }
		      return -1.0;
		  }
		  
		  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
		      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
		      vec3 ro = vec3(0.0, 0.0, 3.0);
		      vec3 rd = normalize(vec3(uv, -1.5));
		  
		      vec3 col = vec3(0.2, 0.2, 0.3);  // dark sky
		  
		      float t = march(ro, rd);
		      if (t > 0.0) {
		          vec3 p = ro + rd * t;          // hit point
		          vec3 N = getNormal(p);          // surface normal
		          vec3 L = normalize(vec3(2.0, 3.0, 2.0)); // light direction
		  
		          // Lambertian (diffuse) shading
		          float diff = max(dot(N, L), 0.0);  // N · L = cos(θ)
		  
		          // Ambient + diffuse
		          vec3 albedo = vec3(0.8, 0.3, 0.1);
		          col = albedo * (diff + 0.1);    // 0.1 = ambient term
		      }
		  
		      fragColor = vec4(col, 1.0);
		  }
		  ```
	- **What you see:** A shaded 3D-looking orange ball! The dark side faces away from the light.
- ---
- ## 🟡 Chapter 4 — SDF Primitives (The Building Blocks)
  collapsed:: true
	- All shapes are functions `float sdShape(vec3 p, ...) → distance`
	- ### Sphere
		- ```glsl
		  float sdSphere(vec3 p, float r) {
		      return length(p) - r;
		      // p: center at origin, r: radius
		  }
		  ```
	- ### Axis-Aligned Box (AABB)
		- ```glsl
		  float sdBox(vec3 p, vec3 b) {
		      // b: half-extents (box goes from -b to +b on each axis)
		      vec3 q = abs(p) - b;
		      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
		      // The first term: distance to nearest corner when outside
		      // The second term: signed distance when inside (negative)
		  }
		  // sdBox(p, vec3(1,0.5,2)) → box 2 wide, 1 tall, 4 deep
		  ```
	- ### Rounded Box
		- ```glsl
		  float sdRoundBox(vec3 p, vec3 b, float r) {
		      vec3 q = abs(p) - b;
		      return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
		      // Just subtract radius r → rounds all edges by r units
		  }
		  ```
	- ### Torus (Donut)
		- ```glsl
		  float sdTorus(vec3 p, vec2 t) {
		      // t.x: major radius (center of ring to center of tube)
		      // t.y: minor radius (tube radius)
		      vec2 q = vec2(length(p.xz) - t.x, p.y);
		      return length(q) - t.y;
		      // First: distance to the ring center circle
		      // Then: subtract tube radius
		  }
		  // sdTorus(p, vec2(1.5, 0.3)) → donut, ring r=1.5, tube r=0.3
		  ```
	- ### Capsule (Two Spheres + Cylinder)
		- ```glsl
		  float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
		      // Segment from point a to point b with radius r
		      vec3 pa = p - a, ba = b - a;
		      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
		      return length(pa - ba * h) - r;
		      // h: closest point on segment parameter [0,1]
		      // distance from p to nearest point on segment, minus radius
		  }
		  ```
	- ### Infinite Plane
		- ```glsl
		  float sdPlane(vec3 p, vec3 n, float h) {
		      // n: unit normal of plane, h: height offset
		      return dot(p, n) + h;
		      // Signed distance from p to plane (positive = above, negative = below)
		  }
		  // sdPlane(p, vec3(0,1,0), 0.0) → horizontal floor at y=0
		  ```
	- ### Cylinder
		- ```glsl
		  float sdCylinder(vec3 p, vec3 c) {
		      // c.xy: 2D center, c.z: radius
		      return length(p.xz - c.xy) - c.z;
		  }
		  // For capped cylinder (finite length) → slightly more complex
		  float sdCappedCylinder(vec3 p, float h, float r) {
		      vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
		      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
		  }
		  ```
	- ### Cone
		- ```glsl
		  float sdCone(vec3 p, vec2 c, float h) {
		      // c = sin/cos of half-angle, h = height
		      vec2 q = h * vec2(c.x/c.y, -1.0);
		      vec2 w = vec2(length(p.xz), p.y);
		      vec2 a = w - q * clamp(dot(w,q)/dot(q,q), 0.0, 1.0);
		      vec2 b = w - q * vec2(clamp(w.x/q.x, 0.0, 1.0), 1.0);
		      float k = sign(q.y);
		      float d = min(dot(a,a), dot(b,b));
		      float s = max(k*(w.x*q.y-w.y*q.x), k*(w.y-q.y));
		      return sqrt(d)*sign(s);
		  }
		  ```
- ---
- ## 🟡 Chapter 5 — SDF Operations (Combining Shapes)
  collapsed:: true
	- The real power of SDFs — combine and modify shapes with simple math.
	- ### Boolean Operations
		- ```glsl
		  // UNION — keep both shapes (minimum distance wins)
		  float opUnion(float d1, float d2) {
		      return min(d1, d2);
		      // At any point, we're closest to whichever shape is nearer
		  }
		  
		  // SUBTRACTION — carve shape2 out of shape1
		  float opSubtraction(float d1, float d2) {
		      return max(d1, -d2);
		      // Inside d2 AND outside d1 → inside the cut
		  }
		  
		  // INTERSECTION — keep only the overlap
		  float opIntersection(float d1, float d2) {
		      return max(d1, d2);
		      // Only where we're inside BOTH shapes
		  }
		  ```
		- Example — subtract a sphere from a box to get a box with a spherical hole:
		- ```glsl
		  float sceneSDF(vec3 p) {
		      float box    = sdBox(p, vec3(1.0));
		      float sphere = sdSphere(p - vec3(0, 0.5, 0), 0.8);  // slightly off-center
		      return opSubtraction(box, sphere);  // box minus sphere
		  }
		  ```
	- ### Smooth Blending (Smooth Union)
		- Hard union gives sharp edges where shapes meet
		- Smooth union blends shapes together like clay or organic forms:
		- ```glsl
		  float opSmoothUnion(float d1, float d2, float k) {
		      // k = blend radius (how far shapes merge together)
		      float h = max(k - abs(d1 - d2), 0.0) / k;
		      return min(d1, d2) - h * h * k * (1.0 / 4.0);
		  }
		  
		  // Smooth subtraction and intersection also exist:
		  float opSmoothSubtraction(float d1, float d2, float k) {
		      float h = max(k - abs(-d2 - d1), 0.0) / k;
		      return max(d1, -d2) + h * h * k * (1.0 / 4.0);
		  }
		  ```
		- Demo — two spheres merging like blobs:
		- ```glsl
		  float sceneSDF(vec3 p) {
		      float s1 = sdSphere(p - vec3(-0.7, 0, 0), 0.7);  // left sphere
		      float s2 = sdSphere(p - vec3( 0.7, 0, 0), 0.7);  // right sphere
		      return opSmoothUnion(s1, s2, 0.5);   // 0.5 = blend region
		  }
		  ```
	- ### Transformations
		- ```glsl
		  // TRANSLATION: shift the space (not the shape!)
		  float sdShiftedSphere(vec3 p, vec3 offset, float r) {
		      return sdSphere(p - offset, r);  // subtract offset from p
		  }
		  
		  // ROTATION: apply inverse rotation matrix to p
		  mat2 rot2D(float angle) {
		      float s = sin(angle), c = cos(angle);
		      return mat2(c, -s, s, c);
		  }
		  float sdRotatedBox(vec3 p, float angle) {
		      p.xz = rot2D(angle) * p.xz;  // rotate in XZ plane
		      return sdBox(p, vec3(0.5));
		  }
		  
		  // SCALE: divide p by scale factor, multiply result by scale factor
		  float sdScaledSphere(vec3 p, float s) {
		      return sdSphere(p / s, 1.0) * s;
		      // Dividing p = zooming out → smaller shape
		      // Multiplying result = restores correct distance units
		  }
		  ```
	- ### Infinite Repetition
		- ```glsl
		  // Repeat space with period c in all 3 axes
		  vec3 opRepeat(vec3 p, vec3 c) {
		      return mod(p + 0.5 * c, c) - 0.5 * c;
		      // Wraps coordinates to [-c/2, c/2]
		    // Free infinite grid — just a mod operation!
		  }
		  
		  float sceneSDF(vec3 p) {
		      // Infinite grid of spheres, spaced 3 units apart
		      vec3 rep = opRepeat(p, vec3(3.0));
		      return sdSphere(rep, 0.4);
		  }
		  ```
- ---
- ## 🟠 Chapter 6 — Soft Shadows and Ambient Occlusion
  collapsed:: true
	- ### Hard Shadows
		- Cast a ray from the hit point toward the light
		- If it hits anything: in shadow (return 0)
		- If no hit: in light (return 1)
		- ```glsl
		  float hardShadow(vec3 ro, vec3 rd, float mint, float maxt) {
		      for (float t = mint; t < maxt; ) {
		          float h = sceneSDF(ro + rd * t);
		          if (h < 0.001) return 0.0;  // blocked
		          t += h;
		      }
		      return 1.0;  // clear
		  }
		  ```
	- ### Soft Shadows (Inigo Quilez Method)
		- While marching toward the light, track how CLOSE we got to occluders
		- Closer occlusion = darker shadow (penumbra effect)
		- ```glsl
		  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
		      float res = 1.0;
		      float t = mint;
		      for (int i = 0; i < 64; i++) {
		          float h = sceneSDF(ro + rd * t);
		          if (h < 0.001) return 0.0;  // fully occluded
		          // k * h / t: how much penumbra from this near-miss
		          // Smaller h (closer to surface) → darker shadow
		          res = min(res, k * h / t);
		          t += h;
		          if (t > maxt) break;
		      }
		      return clamp(res, 0.0, 1.0);
		  }
		  // k: shadow sharpness. k=2 → very soft, k=32 → hard-ish
		  ```
	- ### Ambient Occlusion (AO)
		- March along the surface normal for a short distance
		- Check how occluded the local area is by sampling SDF values
		- ```glsl
		  float calcAO(vec3 pos, vec3 nor) {
		      float occ = 0.0;
		      float sca = 1.0;
		      for (int i = 0; i < 5; i++) {
		          float h = 0.01 + 0.12 * float(i) / 4.0;
		          float d = sceneSDF(pos + h * nor);
		          occ += (h - d) * sca;    // positive when surface is near
		          sca *= 0.95;              // further samples matter less
		      }
		      return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
		  }
		  // Returns: 1.0 = fully open, 0.0 = fully occluded in crevice
		  ```
	- ### Complete Scene with Soft Shadows + AO
		- ```glsl
		  float sceneSDF(vec3 p) {
		      float sphere = sdSphere(p - vec3(0, 0.5, 0), 0.5);
		      float plane  = p.y;  // ground plane at y=0
		      return min(sphere, plane);
		  }
		  
		  vec3 getNormal(vec3 p) {
		      const float eps = 0.001;
		      return normalize(vec3(
		          sceneSDF(p+vec3(eps,0,0))-sceneSDF(p-vec3(eps,0,0)),
		          sceneSDF(p+vec3(0,eps,0))-sceneSDF(p-vec3(0,eps,0)),
		          sceneSDF(p+vec3(0,0,eps))-sceneSDF(p-vec3(0,0,eps))
		      ));
		  }
		  
		  float march(vec3 ro, vec3 rd) {
		      float t = 0.0;
		      for (int i = 0; i < 128; i++) {
		          float d = sceneSDF(ro + rd * t);
		          if (d < 0.001) return t;
		          if (t > 50.0) break;
		          t += d;
		      }
		      return -1.0;
		  }
		  
		  float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
		      float res = 1.0; float t = mint;
		      for (int i = 0; i < 64; i++) {
		          float h = sceneSDF(ro + rd * t);
		          if (h < 0.001) return 0.0;
		          res = min(res, k * h / t);
		          t += h; if (t > maxt) break;
		      }
		      return clamp(res, 0.0, 1.0);
		  }
		  
		  float calcAO(vec3 pos, vec3 nor) {
		      float occ = 0.0, sca = 1.0;
		      for (int i = 0; i < 5; i++) {
		          float h = 0.01 + 0.12 * float(i) / 4.0;
		          occ += (h - sceneSDF(pos + h * nor)) * sca;
		          sca *= 0.95;
		      }
		      return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
		  }
		  
		  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
		      vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
		      vec3 ro = vec3(0.0, 1.5, 3.0);
		      vec3 rd = normalize(vec3(uv.x, uv.y - 0.1, -1.5));
		  
		      vec3 col = vec3(0.6, 0.8, 1.0);  // sky
		  
		      float t = march(ro, rd);
		      if (t > 0.0) {
		          vec3 p = ro + rd * t;
		          vec3 N = getNormal(p);
		          vec3 L = normalize(vec3(2.0, 4.0, 3.0));
		  
		          float diff   = max(dot(N, L), 0.0);
		          float shadow = softShadow(p + N*0.01, L, 0.01, 10.0, 16.0);
		          float ao     = calcAO(p, N);
		  
		          // Ground: grey, sphere: orange
		          vec3 albedo = (p.y < 0.01) ? vec3(0.5) : vec3(0.8, 0.4, 0.1);
		  
		          col = albedo * (diff * shadow + 0.05 * ao);
		      }
		  
		      // Gamma correction
		      col = pow(col, vec3(0.4545));
		      fragColor = vec4(col, 1.0);
		  }
		  ```
- ---
- ## 🔴 Chapter 7 — Camera Control and Animation
  collapsed:: true
	- ### Orbiting Camera
		- ```glsl
		  // Rotate camera around Y axis using mouse
		  vec2 mouse = iMouse.xy / iResolution.xy;  // [0,1]
		  float angleY = mouse.x * 6.28;  // full rotation
		  float angleX = (mouse.y - 0.5) * 3.14;  // up/down
		  
		  vec3 ro = vec3(
		      3.0 * sin(angleY) * cos(angleX),
		      3.0 * sin(angleX),
		      3.0 * cos(angleY) * cos(angleX)
		  );
		  ```
	- ### Look-At Matrix
		- ```glsl
		  mat3 lookAt(vec3 ro, vec3 ta, vec3 up) {
		      vec3 z = normalize(ro - ta);  // forward
		      vec3 x = normalize(cross(up, z));  // right
		      vec3 y = cross(z, x);              // up
		      return mat3(x, y, z);
		  }
		  
		  // Usage:
		  vec3 target = vec3(0.0);  // look at origin
		  mat3 camMatrix = lookAt(ro, target, vec3(0,1,0));
		  vec3 rd = camMatrix * normalize(vec3(uv, -1.5));
		  ```
	- ### Animation with iTime
		- `iTime` = time in seconds since the shader started (built into Shadertoy)
		- ```glsl
		  // Animating sphere position
		  float t = iTime;
		  vec3 spherePos = vec3(sin(t) * 1.5, 0.5, cos(t) * 1.5);
		  float sphere = sdSphere(p - spherePos, 0.4);
		  
		  // Animating rotation
		  p.xz = rot2D(iTime * 0.5) * p.xz;  // rotate scene
		  float box = sdBox(p, vec3(0.5));
		  ```
- ---
- ## 🔴 Chapter 8 — Materials and Shading Models
  collapsed:: true
	- ### Color by SDF ID
		- ```glsl
		  // Return struct: distance + material id
		  vec2 sceneSDF(vec3 p) {
		      float sphere = sdSphere(p, 0.7);
		      float plane  = p.y + 0.5;
		      if (sphere < plane) return vec2(sphere, 1.0);  // id 1 = sphere
		      else                return vec2(plane,  0.0);  // id 0 = floor
		  }
		  
		  // In main:
		  vec2 hit = marchFull(ro, rd);  // returns (t, materialId)
		  vec3 albedo = (hit.y > 0.5)
		      ? vec3(0.8, 0.3, 0.1)  // sphere: orange
		      : checkerPattern(p);    // floor: checker
		  ```
	- ### Checker Pattern Floor
		- ```glsl
		  vec3 checkerPattern(vec3 p) {
		      vec2 c = floor(p.xz);
		      float checker = mod(c.x + c.y, 2.0);  // alternates 0 and 1
		      return mix(vec3(0.3), vec3(0.7), checker);  // grey and white
		  }
		  ```
	- ### Phong Specular (Fast, Good Enough for SDFs)
		- ```glsl
		  vec3 phongShading(vec3 p, vec3 N, vec3 V, vec3 L, vec3 albedo, float shininess) {
		      vec3 R = reflect(-L, N);              // reflected light direction
		      float diff = max(dot(N, L), 0.0);
		      float spec = pow(max(dot(R, V), 0.0), shininess);
		      return albedo * diff + vec3(1.0) * spec;
		  }
		  ```
	- ### Fog
		- ```glsl
		  // Exponential fog based on ray distance
		  float fogFactor = 1.0 - exp(-0.02 * t * t);
		  col = mix(col, vec3(0.5, 0.7, 0.9), fogFactor);  // blend toward sky
		  ```
- ---
- ## 🔴 Chapter 9 — Fractals and Advanced SDFs
  collapsed:: true
	- ### Menger Sponge (IFS — Iterated Function System)
		- ```glsl
		  float sdMengerSponge(vec3 p, int iterations) {
		      float d = sdBox(p, vec3(1.0));
		      float scale = 1.0;
		  
		      for (int i = 0; i < iterations; i++) {
		          // Fold space into [0,1] cube using mod
		          vec3 a = mod(p * scale, 2.0) - 1.0;
		          scale *= 3.0;
		          // Create 3D cross (union of 3 cylinders)
		          vec3 r = abs(1.0 - 3.0 * abs(a));
		          float da = max(r.x, r.y);
		          float db = max(r.y, r.z);
		          float dc = max(r.z, r.x);
		          float c  = (min(da, min(db, dc)) - 1.0) / scale;
		          d = max(d, c);  // subtract the cross holes from the cube
		      }
		      return d;
		  }
		  ```
	- ### Mandelbulb (3D Mandelbrot)
		- ```glsl
		  float sdMandelbulb(vec3 p, int iterations) {
		      vec3 z = p;
		      float dr = 1.0, r = 0.0;
		      float power = 8.0;  // classic Mandelbulb power
		  
		      for (int i = 0; i < iterations; i++) {
		          r = length(z);
		          if (r > 4.0) break;  // escaped
		          // Convert to spherical, apply power, convert back
		          float theta  = acos(z.z / r) * power;
		          float phi    = atan(z.y, z.x) * power;
		          float zr     = pow(r, power);
		          dr = pow(r, power - 1.0) * power * dr + 1.0;
		          z  = zr * vec3(sin(theta)*cos(phi), sin(theta)*sin(phi), cos(theta)) + p;
		      }
		      return 0.5 * log(r) * r / dr;  // distance estimate
		  }
		  ```
- ---
- ## 📚 Chapter 10 — Resources and Next Steps
  collapsed:: true
	- ### Essential References
		- **Inigo Quilez SDF Functions** — https://iquilezles.org/articles/distfunctions/
			- The DEFINITIVE SDF primitive reference — bookmark this page
			- Every shape with derivations and formulas
		- **Inigo Quilez Articles** — https://iquilezles.org/articles/
			- Soft shadows, AO, smooth min, SDF operations — all explained by the inventor
		- **The Art of Code (YouTube)** — Ray Marching for Dummies
			- https://www.youtube.com/watch?v=PGtv-dBi2wE — absolute beginner friendly
		- **kishimisu (YouTube)** — An introduction to Shader Art Coding
			- https://www.youtube.com/watch?v=f4s1h2YETNY
	- ### Shadertoy Examples to Study
		- https://shadertoy.com/view/Xds3zN — Inigo Quilez: classic SDF primitives
		- https://shadertoy.com/view/XllGW4 — Ray Marching: SDFs tutorial
		- Search "ray march" or "SDF" on Shadertoy — hundreds of examples
	- ### Next Steps After This Page
		- Practice: write your own scenes combining 3+ SDF shapes with smooth union
		- Read [[GPFS PBR]] and replace the Phong shading with a full PBR model
		- Read [[GPFS Render Equation]] to understand WHY the lighting math works
		- Level up: add refraction (glass spheres), fog volumes, or a fractal scene
		- Eventually: [[PathTracer Learning]] for GPU path tracing with triangle meshes
- ---
- ## ✅ Checklist
  collapsed:: true
	- ### Beginner
		- TODO Run the minimal ray marcher in Shadertoy
		- TODO Change the sphere radius and observe the result
		- TODO Add a second sphere and use `min()` to union them
		- TODO Compute the normal and add basic diffuse lighting
	- ### Intermediate
		- TODO Implement box, torus, capsule SDFs
		- TODO Use smooth union to blend two shapes
		- TODO Add soft shadows
		- TODO Add ambient occlusion
		- TODO Add a checker floor
	- ### Advanced
		- TODO Add mouse-controlled orbiting camera
		- TODO Implement infinite repetition with `mod()`
		- TODO Use SDF subtraction to carve shapes
		- TODO Add fog and tone mapping
		- TODO Try to implement a simple fractal (Menger sponge or Mandelbulb)
- ---
- ## 🔗 Related
	- [[GPFS PBR]] — Add physically correct materials to your ray-marched scene
	- [[GPFS Render Equation]] — The theory behind the lighting math
	- [[GPFS Vulkan GPU Architecture]] — How shaders run on GPU hardware
	- [[PathTracer Learning Ray Definition]] — Ray math basics
	- [[PathTracer Learning Physically Based Rendering]] — PBR for path tracing
	- [[Graphics Programming From Scratch]]