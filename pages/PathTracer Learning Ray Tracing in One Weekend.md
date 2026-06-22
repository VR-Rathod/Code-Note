---
seoTitle: Ray Tracing in One Weekend – Complete Notes & Learning Guide
description: "Complete notes for 'Ray Tracing in One Weekend' by Peter Shirley. Covers ray-sphere intersection, camera setup, diffuse and specular materials, anti-aliasing, and BVH."
keywords: "ray tracing in one weekend, Peter Shirley, ray tracing, path tracing, ray-sphere intersection, diffuse, specular, Lambertian, metal, dielectric, BVH, anti-aliasing, C++, CPU path tracer"
treeTitle: Game Development - Path Tracing - Ray Tracing in One Weekend
---

tags:: reference, book, tutorial, cpu-raytracer, beginner
title:: PathTracer Learning Ray Tracing in One Weekend

- # Ray Tracing in One Weekend — Notes
	- **Author:** Peter Shirley
	- **Free online:** https://raytracing.github.io/
	- **What it teaches:** Build a complete software path tracer from scratch in C++, step by step
	- **Why read it:** Build intuition for path tracing on the CPU before tackling Vulkan RT GPU
	- Parent: [[PathTracer Learning Books and Tutorials]]
- ---
- ## Why This Book First?
	- Before Vulkan, before BVH, before shaders — understand the ALGORITHM
	- Every line you write teaches something: normals, reflection, shadows, sampling
	- The CPU version is slow but 100% transparent — you can debug every pixel
	- Once you understand this, GPU path tracing is "just parallelism"
	- Recommended by the Godot NVPathtracer contributors in their chat
- ---
- ## Book 1: Ray Tracing in One Weekend
	- ### Chapter Overview
		- **Chapter 1** — Output an Image (PPM format)
		- **Chapter 2** — The Ray and Camera
		- **Chapter 3** — Ray-Sphere Intersection
		- **Chapter 4** — Surface Normals and Multiple Objects
		- **Chapter 5** — Anti-Aliasing
		- **Chapter 6** — Diffuse Materials
		- **Chapter 7** — Metal
		- **Chapter 8** — Dielectrics (Glass)
		- **Chapter 9** — Positionable Camera
		- **Chapter 10** — Defocus Blur (Depth of Field)
		- **Chapter 11** — Final Scene
- ---
- ## Core Concepts — Book 1
	- ### The Ray
		- `P(t) = origin + t * direction`
		- `origin` — starting point (camera)
		- `direction` — unit vector (where the ray is going)
		- `t` — parameter: positive = forward, negative = behind camera
		- ```cpp
		  struct Ray {
		      vec3 origin, direction;
		      vec3 at(float t) const { return origin + t * direction; }
		  };
		  ```
		- See [[PathTracer Learning Ray Definition]]
	- ### Camera and Primary Ray Generation
		- Pinhole camera: all rays pass through a single point
		- Define a "viewport" rectangle in 3D space
		- For each pixel `(i, j)`, generate a ray from camera origin through the pixel
		- ```cpp
		  // Viewport at z = -1, aspect ratio preserved
		  float viewport_height = 2.0f;
		  float viewport_width  = aspect_ratio * viewport_height;
		  vec3 lower_left = origin - vec3(viewport_width/2, viewport_height/2, 1.0f);
		  
		  // Ray for pixel (u, v) in [0,1]²
		  Ray ray(origin, lower_left + u * horizontal + v * vertical - origin);
		  ```
		- See [[PathTracer Learning Camera Model]]
	- ### Ray-Sphere Intersection
		- Sphere equation: `|P - C|² = r²`
		- Substitute ray `P(t)`: `|origin + t*dir - C|² = r²`
		- Expand to get a quadratic in `t`: `at² + bt + c = 0`
		- Discriminant `b² - 4ac`:
			- `> 0` — two intersections (ray passes through)
			- `= 0` — one intersection (tangent)
			- `< 0` — no intersection (miss)
		- Take the smaller `t > t_min` as the hit
		- ```cpp
		  bool hitSphere(vec3 center, float radius, Ray r, float &t) {
		      vec3 oc = r.origin - center;
		      float a = dot(r.direction, r.direction);
		      float b = 2.0f * dot(oc, r.direction);
		      float c = dot(oc, oc) - radius * radius;
		      float discriminant = b*b - 4*a*c;
		      if (discriminant < 0) return false;
		      t = (-b - sqrt(discriminant)) / (2.0f * a);
		      return t > 0.001f;
		  }
		  ```
	- ### Surface Normals
		- At hit point `P`, normal of a sphere centered at `C`: `N = normalize(P - C)`
		- Normal always points outward (away from center)
		- For front/back face detection: if `dot(ray.dir, N) < 0` → front face
		- Visualize normals by mapping `(N + 1) / 2` to RGB → great debug view
	- ### Anti-Aliasing
		- For each pixel, send multiple rays with random sub-pixel offsets
		- Average the results → smooth edges
		- ```cpp
		  vec3 color = vec3(0.0f);
		  for (int s = 0; s < SAMPLES_PER_PIXEL; s++) {
		      float u = (float(i) + random_float()) / (width - 1);
		      float v = (float(j) + random_float()) / (height - 1);
		      Ray ray = camera.get_ray(u, v);
		      color += trace(ray, world, MAX_DEPTH);
		  }
		  color /= SAMPLES_PER_PIXEL; // average
		  ```
		- See [[PathTracer Learning Anti-Aliasing]]
	- ### Diffuse (Lambertian) Material
		- When a ray hits a diffuse surface, scatter it in a random direction
		- The randomness models the microscopic roughness of matte surfaces
		- ```cpp
		  // Simple diffuse: random direction in hemisphere
		  vec3 scattered = hit.normal + random_unit_vector();
		  
		  // Lambertian (more accurate): cosine-weighted
		  vec3 scattered = hit.normal + random_unit_vector(); // same formula!
		  // This gives cosine-weighted distribution naturally
		  ```
		- Each bounce multiplies by the albedo color
		- After many bounces → black (all light absorbed)
		- See [[PathTracer Learning BRDF]] — Lambertian BRDF = `albedo / π`
	- ### Metal Material
		- Perfect mirror reflection: `reflect(v, n) = v - 2 * dot(v, n) * n`
		- Add fuzz (roughness): perturb reflection by small random vector
		- ```cpp
		  vec3 reflected = reflect(ray.direction, hit.normal);
		  // Fuzz: reflected + fuzz * random_in_unit_sphere()
		  // fuzz = 0 → perfect mirror
		  // fuzz = 1 → very rough metal
		  ```
	- ### Dielectric (Glass) Material
		- Light refracts when entering/exiting glass
		- Snell's law: `n₁ sin(θ₁) = n₂ sin(θ₂)`
		- Schlick approximation for Fresnel — some light reflects even at normal incidence
		- Total internal reflection: when light tries to exit glass at too steep an angle
		- ```cpp
		  // Schlick approximation
		  float schlick(float cos_theta, float ref_idx) {
		      float r0 = (1 - ref_idx) / (1 + ref_idx);
		      r0 = r0 * r0;
		      return r0 + (1 - r0) * pow(1 - cos_theta, 5);
		  }
		  ```
		- See [[PathTracer Learning Fresnel Effect]]
- ---
- ## Book 2: The Next Week
	- Adds: motion blur, textures, perlin noise, image textures, rectangles, lights, Cornell box, volumes, BVH
	- ### Key additions
		- **BVH (Bounding Volume Hierarchy)** — speed up ray-scene intersection from O(N) to O(log N)
			- See [[PathTracer Learning BVH Construction]] and [[Pathtracer Concept BVH Traversal]]
		- **Emissive Materials** — make objects into light sources
			- When a ray hits an emissive surface: return `emitted_color * intensity`
		- **Cornell Box** — the classic test scene for global illumination
			- Two walls: red and green. Top light. Two boxes inside.
		- **Participating Media** — volumetric fog/smoke
		- **Textures** — map images onto geometry using UV coordinates
- ---
- ## Book 3: The Rest of Your Life
	- Adds: PDF sampling, importance sampling, MIS — the real path tracing theory
	- ### Key additions
		- **PDF sampling** — replace random hemisphere sampling with smart sampling
		- **Mixture PDFs** — blend BRDF sampling and light sampling
		- **MIS (Multiple Importance Sampling)** — optimally combine multiple strategies
			- See [[PathTracer Learning MIS]]
		- **Importance Sampling BRDFs** — sample toward specular highlights
			- See [[PathTracer Learning Importance Sampling]]
		- The variance drops dramatically — the same scene converges much faster
- ---
- ## Key Lessons from the Series
	- Lesson 1: A path tracer is just a recursive function — trace a ray, hit something, trace another ray
	- Lesson 2: The more you know about your sampling distribution, the less variance you get
	- Lesson 3: BVH is not optional — O(N) intersection will destroy you on real scenes
	- Lesson 4: Monte Carlo is the only practical way to solve the rendering equation
	- Lesson 5: Russian Roulette terminates paths correctly — fixed depth introduces bias
	- Lesson 6: Every material is just a scattering function — diffuse, metal, glass are all the same interface
- ---
- ## After the Books — What's Next?
	- Read → [[PathTracer Learning Phase 2 CPU Ray Tracing]] — extend your tracer with real PBR
	- Read → [[PathTracer Learning Phase 3 GPU and Vulkan]] — port to the GPU
	- Practice → [[PathTracer Learning Ray Marching]] — explore SDFs on Shadertoy
	- Theory → [[PathTracer Learning Render Equation]] — understand the math behind it all
	- Theory → [[PathTracer Learning Physically Based Rendering]] — add physically correct materials
- ---
- ## Quick Reference — Important C++ Snippets
	- ### Random number in [0, 1)
		- ```cpp
		  float random_float() {
		      static std::uniform_real_distribution<float> dist(0.0f, 1.0f);
		      static std::mt19937 gen;
		      return dist(gen);
		  }
		  ```
	- ### Random unit vector (for diffuse scatter)
		- ```cpp
		  vec3 random_unit_vector() {
		      while (true) {
		          vec3 p = vec3(random_float(-1,1), random_float(-1,1), random_float(-1,1));
		          if (p.length_squared() < 1.0f) return normalize(p);
		      }
		  }
		  ```
	- ### Gamma correction
		- ```cpp
		  // Convert linear to sRGB for display
		  color = vec3(sqrt(color.r), sqrt(color.g), sqrt(color.b)); // gamma 2.0
		  ```
		- Path tracers work in linear light — must gamma-correct before writing pixels
		- See [[PathTracer Learning Tone Mapping]]
- ---
- ## Checklist
	- TODO Complete Book 1 (build your first ray tracer)
	- TODO Add anti-aliasing (multiple samples per pixel)
	- TODO Implement all 3 material types: diffuse, metal, dielectric
	- TODO Complete Book 2 (add BVH + lights + Cornell box)
	- TODO Complete Book 3 (add importance sampling + MIS)
	- TODO Time your tracer and measure samples/second improvement from BVH
	- TODO Render the final Cornell box scene
- ---
- ## Related
	- [[PathTracer Learning Books and Tutorials]]
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]
	- [[PathTracer Learning Ray Definition]]
	- [[PathTracer Learning BRDF]]
	- [[PathTracer Learning BVH Construction]]
	- [[PathTracer Learning Monte Carlo Integration]]
	- [[PathTracer Learning Importance Sampling]]
	- [[PathTracer Learning MIS]]
	- [[PathTracer Learning Render Equation]]
	- [[PathTracer Learning Physically Based Rendering]]