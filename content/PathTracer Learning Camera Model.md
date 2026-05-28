---
seoTitle: Camera Model in Path Tracing – Pinhole, Lens, and DOF Guide
description: "Camera models define how rays are generated in path tracers. Covers pinhole camera, thin lens model, depth of field, field of view, and physically-based."
keywords: "camera model, path tracing, ray tracing, pinhole camera, thin lens, depth of field, field of view, physically-based rendering, GPU rendering, Vulkan, ray generation"
---

tags:: concept, camera, ray-generation, optics
title:: PathTracer Learning Camera Model

- # Concept: Camera Model
	- Parent: [[PathTracer Learning Phase 2 CPU Ray Tracing]]
- ---
- ## Pinhole Camera
	- The simplest camera model — all rays pass through a single point (the pinhole)
	- No depth of field — everything is in focus
	- Parameters
		- `position` — camera origin in world space
		- `forward` — direction the camera looks (normalized)
		- `up` — world up vector (used to compute right vector)
		- `fov` — vertical field of view (degrees or radians)
		- `aspect_ratio` — width / height
	- Building the camera basis
		- ```glsl
		  vec3 forward = normalize(target - position);
		  vec3 right   = normalize(cross(forward, world_up));
		  vec3 up      = cross(right, forward);
		  ```
	- Viewport dimensions
		- `viewport_height = 2 * tan(fov / 2)` (at unit focal distance)
		- `viewport_width  = viewport_height * aspect_ratio`
	- Generating a ray for pixel `(i, j)` in an `(W, H)` image
		- ```glsl
		  // Jitter for anti-aliasing
		  float u = (i + random()) / W;
		  float v = (j + random()) / H;
		  
		  // Map to [-1, 1] range
		  vec2 ndc = vec2(u, v) * 2.0 - 1.0;
		  
		  vec3 ray_dir = normalize(
		      forward
		      + ndc.x * (viewport_width  / 2.0) * right
		      + ndc.y * (viewport_height / 2.0) * up
		  );
		  return Ray(position, ray_dir);
		  ```
- ---
- ## Thin Lens Camera (Depth of Field)
	- Real cameras have a lens with finite aperture
	- Objects at the focal distance are sharp; others are blurry (bokeh)
	- Parameters (in addition to pinhole)
		- `aperture` — lens diameter (larger = more blur)
		- `focus_distance` — distance to the focal plane
	- Algorithm
		- Sample a random point on the lens disk: `lens_offset = aperture/2 * random_disk()`
		- Compute the focus point: `focus_point = position + focus_distance * ray_dir`
		- New ray origin: `origin = position + lens_offset.x * right + lens_offset.y * up`
		- New ray direction: `direction = normalize(focus_point - origin)`
	- ```glsl
	  vec2 disk = aperture * 0.5 * random_in_unit_disk();
	  vec3 lens_origin = position + disk.x * right + disk.y * up;
	  vec3 focus_point = position + focus_distance * normalize(ray_dir);
	  return Ray(lens_origin, normalize(focus_point - lens_origin));
	  ```
- ---
- ## Field of View
	- Vertical FOV: angle from bottom to top of the image
	- Horizontal FOV: `2 * atan(tan(vfov/2) * aspect_ratio)`
	- Common values: 60° (telephoto feel), 90° (wide), 120° (very wide)
	- In Godot: `Camera3D.fov` is vertical FOV in degrees
	- Relationship to focal length: `fov = 2 * atan(sensor_height / (2 * focal_length))`
		- 50mm lens on 35mm sensor: `fov ≈ 39.6°` (normal lens)
		- 24mm lens: `fov ≈ 73.7°` (wide angle)
- ---
- ## Camera in Vulkan Ray Tracing
	- Pass camera data as a uniform buffer to the ray generation shader
	- ```glsl
	  layout(set=0, binding=2) uniform CameraData {
	      mat4 view_inverse;   // inverse view matrix
	      mat4 proj_inverse;   // inverse projection matrix
	      float aperture;
	      float focus_distance;
	  } camera;
	  
	  void main() {
	      vec2 pixel = vec2(gl_LaunchIDEXT.xy) + vec2(random(), random());
	      vec2 uv = pixel / vec2(gl_LaunchSizeEXT.xy) * 2.0 - 1.0;
	      
	      // Unproject from NDC to world space
	      vec4 origin    = camera.view_inverse * vec4(0, 0, 0, 1);
	      vec4 target    = camera.proj_inverse * vec4(uv.x, uv.y, 1, 1);
	      vec4 direction = camera.view_inverse * vec4(normalize(target.xyz), 0);
	      
	      traceRayEXT(tlas, ..., origin.xyz, 0.001, direction.xyz, 1e4, 0);
	  }
	  ```
- ---
- ## Motion Blur
	- Shutter opens for a time interval `[t0, t1]`
	- Sample a random time `t = lerp(t0, t1, random())`
	- Evaluate object transforms at time `t`
	- Requires per-object velocity data or interpolated transforms
	- In path tracing: each ray sample uses a different time → natural motion blur
- ---
- ## Related
	- [[PathTracer Learning Ray Definition]]
	- [[PathTracer Learning Anti-Aliasing]]
	- [[PathTracer Learning Phase 2 CPU Ray Tracing]]