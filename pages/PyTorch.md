---
seoTitle: PyTorch Python Library - Deep Learning Framework Reference Guide
description: "PyTorch is a dynamic deep learning framework. Covers tensors, autograd, neural networks, optimizers, DataLoader, GPU acceleration, and model training patterns."
keywords: "PyTorch, deep learning, tensors, autograd, neural networks, optimizers, DataLoader, GPU, CUDA, model training, Python library, machine learning"
---

- # 📘 **Overview**
	- **What is it?**: PyTorch is an open-source machine learning library developed by Meta's AI Research lab. It is widely used for applications such as computer vision and natural language processing, due to its dynamic computation graph and Pythonic nature.
	- **Key Features**:
		- **Dynamic Computation Graphs**: Computations are defined dynamically at runtime (Imperative / Eager mode), allowing easy debugging and dynamic model architectures.
		- **Tensor Computation**: Support for multi-dimensional arrays (Tensors) with strong GPU acceleration via CUDA.
		- **Autograd Module**: Automatic differentiation engine that powers backpropagation.
	- **Installation**:
		- ```bash
		  # Core CPU/GPU installation (verify CUDA version on pytorch.org)
		  pip install torch torchvision torchaudio
		  ```
- # 🧾 **Core Concepts**
	- **Tensors**: The core data structure in PyTorch, similar to NumPy's `ndarray` but capable of running on a GPU.
	- **Autograd**: The automatic differentiation engine. By setting `requires_grad=True` on a tensor, PyTorch tracks operations on it and automatically computes gradients during the backward pass.
	- **nn.Module**: The base class for all neural network modules. Models inherit from this class and implement the `forward` pass.
	- **Dataset & DataLoader**: Classes to manage data parsing and batching during training.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Tensor Operations & GPU Usage**:
		- ```python
		  import torch
		  
		  # Create tensor from list
		  x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
		  
		  # Move to GPU if available
		  device = "cuda" if torch.cuda.is_available() else "cpu"
		  x = x.to(device)
		  
		  # Basic math
		  y = x ** 2 + 2
		  z = y.mean()
		  
		  # Backpropagation
		  z.backward()
		  print(x.grad)  # prints gradients of z w.r.t x
		  ```
	- **Defining a Neural Network**:
		- ```python
		  import torch.nn as nn
		  
		  class SimpleClassifier(nn.Module):
		      def __init__(self, input_dim, hidden_dim, output_dim):
		          super().__init__()
		          self.linear1 = nn.Linear(input_dim, hidden_dim)
		          self.relu = nn.ReLU()
		          self.linear2 = nn.Linear(hidden_dim, output_dim)
		          
		      def forward(self, x):
		          out = self.linear1(x)
		          out = self.relu(out)
		          out = self.linear2(out)
		          return out
		  ```
	- **Training Loop Pattern**:
		- ```python
		  import torch.optim as optim
		  
		  # Instantiate model, optimizer, and loss function
		  model = SimpleClassifier(input_dim=10, hidden_dim=20, output_dim=2).to(device)
		  optimizer = optim.Adam(model.parameters(), lr=0.001)
		  criterion = nn.CrossEntropyLoss()
		  
		  # Dummy input & target
		  inputs = torch.randn(32, 10).to(device)
		  targets = torch.randint(0, 2, (32,)).to(device)
		  
		  # Single step of training
		  model.train()               # set to training mode
		  optimizer.zero_grad()       # clear previous gradients
		  outputs = model(inputs)     # forward pass
		  loss = criterion(outputs, targets)
		  loss.backward()             # backward pass (compute gradients)
		  optimizer.step()            # update weights
		  ```
- # 💡 **Best Practices & Tips**
	- **Inference Mode**: Always wrap validation/inference code blocks in `with torch.no_grad():` to save memory and compute.
	- **Mode Toggling**: Toggle `model.train()` and `model.eval()` to correctly configure modules like Dropout and BatchNorm.
	- **Gradient Zeroing**: Never forget to run `optimizer.zero_grad()` before computing gradients, otherwise gradients will accumulate.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Machine Learning]] | [[Data Science]] | [[NumPy]] | [[Pandas]]