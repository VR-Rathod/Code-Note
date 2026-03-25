---
seoTitle: Async Compute in GPU Rendering – Overlap and Pipeline Guide
description: "Async compute overlaps graphics and compute workloads on the GPU. Covers compute queues, synchronization, barriers, and performance gains in path tracing."
keywords: "async compute, GPU rendering, compute queue, synchronization, barriers, pipeline overlap, path tracing, ray tracing, Vulkan, GPU optimization, performance, graphics"
---

tags:: concept, vulkan, gpu, async-compute, performance
title:: PathTracer Learning - Concept - Async Compute

- # Concept: Async Compute
	- Parent: [[PathTracer Learning - Phase 3 - GPU and Vulkan]]
- ---
- ## What Is Async Compute?
	- Running compute work in parallel with graphics work on the GPU
	- Modern GPUs have separate compute queues that can run alongside the graphics queue
	- Enables better GPU utilization by filling idle shader units
- ---
- ## GPU Queue Types
	- Graphics queue: supports all operations (graphics, compute, transfer)
	- Compute queue: compute + transfer only (no rasterization)
	- Transfer queue: DMA transfers only
	- Multiple queues can run simultaneously on different hardware units
- ---
- ## Why It Matters for Path Tracing
	- BLAS builds are compute-heavy — can overlap with rendering
	- Denoising passes can overlap with next frame's ray tracing
	- TLAS rebuild can overlap with shadow ray tracing
	- Typical frame timeline without async
		- `[BLAS build] → [TLAS build] → [Ray trace] → [Denoise] → [Present]`
	- With async compute
		- `[BLAS build (async)] ↕ [TLAS build] → [Ray trace] → [Denoise (async)] ↕ [Present]`
- ---
- ## Vulkan Async Compute Setup
	- Find a compute-only queue family
		- ```cpp
		  for (auto& queueFamily : queueFamilies) {
		      if ((queueFamily.queueFlags & VK_QUEUE_COMPUTE_BIT) &&
		          !(queueFamily.queueFlags & VK_QUEUE_GRAPHICS_BIT)) {
		          computeQueueFamily = index;
		      }
		  }
		  ```
	- Create separate command pools and queues for compute
	- Submit compute work to compute queue, graphics to graphics queue
- ---
- ## Synchronization
	- Async compute requires careful synchronization
	- Timeline semaphores (Vulkan 1.2) — preferred
		- ```cpp
		  VkSemaphoreTypeCreateInfo typeInfo{};
		  typeInfo.semaphoreType = VK_SEMAPHORE_TYPE_TIMELINE;
		  typeInfo.initialValue = 0;
		  ```
		- Signal from compute queue, wait on graphics queue
	- Pipeline barriers within a queue
	- Queue ownership transfers for shared resources
- ---
- ## Practical Considerations
	- Not all GPUs benefit equally
		- Integrated GPUs: often single queue, no benefit
		- Discrete GPUs: multiple compute units, significant benefit
	- Overhead: synchronization adds complexity and some latency
	- Profile first: measure actual GPU utilization before optimizing
	- NVIDIA NSight, AMD RGP — tools for visualizing queue utilization
- ---
- ## In Godot Context
	- Godot's `RenderingDevice` exposes compute queues
	- BLAS builds for skinned meshes are good candidates for async
	- Denoising (OIDN compute) can run async with next frame's RT
- ---
- ## Related
	- [[PathTracer Learning - Phase 3 - GPU and Vulkan]]
	- [[PathTracer Learning - BLAS and TLAS]]
