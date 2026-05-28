---
seoTitle: Device Address in Vulkan Ray Tracing – Buffer Reference Guide
description: "Device addresses enable GPU buffer access in Vulkan ray tracing. Covers VkDeviceAddress, buffer device address feature, shader binding table, and BLAS/TLAS."
keywords: "device address, Vulkan ray tracing, VkDeviceAddress, buffer device address, shader binding table, BLAS, TLAS, GPU rendering, path tracing, Vulkan, ray tracing"
title: PathTracer Learning Device Address Bit
---

tags:: concept, vulkan, memory, device-address
title:: PathTracer Learning - Concept - Device Address Bit
title: PathTracer Learning Device Address Bit

- # Concept: VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT
	- Parent: [[PathTracer Learning Phase 3 GPU and Vulkan]]
- ---
- ## What It Is
	- A Vulkan buffer usage flag that enables GPU-side pointer access
	- Allows shaders to access buffer data via a raw 64-bit GPU address
	- Required for: Shader Binding Table, AS input buffers, AS scratch buffers
	- Extension: `VK_KHR_buffer_device_address` (core in Vulkan 1.2)
- ---
- ## Why It's Needed for Ray Tracing
	- Acceleration structure build inputs must be specified as device addresses
	- SBT entries contain shader handles accessed via device address
	- Allows the GPU to follow pointers — enables complex data structures on GPU
	- Without it: can't build BLAS/TLAS or create SBT
- ---
- ## How to Use
	- Buffer creation
		- ```c++
		  VkBufferCreateInfo bufferInfo{};
		  bufferInfo.usage = VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT
		                   | VK_BUFFER_USAGE_ACCELERATION_STRUCTURE_BUILD_INPUT_READ_ONLY_BIT_KHR;
		  // ... create buffer ...
		  ```
	- Memory allocation — must enable device address feature
		- ```c++
		  VkMemoryAllocateFlagsInfo flagsInfo{};
		  flagsInfo.sType = VK_STRUCTURE_TYPE_MEMORY_ALLOCATE_FLAGS_INFO;
		  flagsInfo.flags = VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT;
		  // chain into VkMemoryAllocateInfo.pNext
		  ```
	- Getting the device address
		- ```c++
		  VkBufferDeviceAddressInfo addressInfo{};
		  addressInfo.sType = VK_STRUCTURE_TYPE_BUFFER_DEVICE_ADDRESS_INFO;
		  addressInfo.buffer = myBuffer;
		  VkDeviceAddress address = vkGetBufferDeviceAddress(device, &addressInfo);
		  ```
	- Using in AS build
		- ```c++
		  geometry.geometry.triangles.vertexData.deviceAddress = vertexBufferAddress;
		  geometry.geometry.triangles.indexData.deviceAddress  = indexBufferAddress;
		  ```
- ---
- ## Device Address in Shaders
	- GLSL: use `uint64_t` or buffer reference extension
	- `GL_EXT_buffer_reference` — typed pointer to buffer
		- ```glsl
		  #extension GL_EXT_buffer_reference : require
		  layout(buffer_reference, scalar) buffer VertexBuffer {
		      Vertex vertices[];
		  };
		  // In shader:
		  VertexBuffer vb = VertexBuffer(instanceData[gl_InstanceCustomIndexEXT].vertexAddress);
		  Vertex v = vb.vertices[gl_PrimitiveID * 3 + 0];
		  ```
	- This is how NVPathtracer accesses per-instance vertex data in closest-hit shader
- ---
- ## Common Mistakes
	- Forgetting `VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT` on memory allocation
		- Buffer creation succeeds but `vkGetBufferDeviceAddress` returns 0
	- Not enabling `bufferDeviceAddress` feature in `VkPhysicalDeviceVulkan12Features`
		- ```c++
		  VkPhysicalDeviceVulkan12Features features12{};
		  features12.bufferDeviceAddress = VK_TRUE;
		  ```
	- Using device address after buffer is destroyed
		- Address becomes invalid — GPU will read garbage or crash
- ---
- ## Related
	- [[PathTracer Learning BLAS and TLAS]]
	- [[PathTracer Learning Vulkan RT Pipeline]]