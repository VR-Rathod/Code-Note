---
seoTitle: FastAPI Framework - Python REST API Development Reference
description: "FastAPI builds high-performance REST APIs with automatic OpenAPI docs. Covers path operations, Pydantic models, dependency injection, async support, and security."
keywords: "FastAPI, Python REST API, Pydantic, OpenAPI, async API, dependency injection, path operations, authentication, Python framework, API development, Swagger"
---

- # 📘 **Overview**
	- **What is it?**: FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints.
	- **Key Features**:
		- **Speed**: Very high performance, on par with NodeJS and Go (thanks to Starlette and Pydantic).
		- **Automatic Docs**: Interactive API documentation (Swagger UI and ReDoc) generated automatically from code types.
		- **Type-Safety**: Built-in validation, serialization, and editor autocompletion powered by standard Python type hints.
		- **Async Native**: Supports `async`/`await` natively for non-blocking asynchronous requests.
	- **Installation**:
		- ```bash
		  pip install fastapi uvicorn[standard]
		  ```
- # 🧾 **Core Concepts**
	- **Path Operations**: Functions mapped to HTTP routes (e.g. `@app.get("/items/{id}")`).
	- **Data Validation (Pydantic)**: Request and response schemas are defined using Pydantic classes, ensuring strong data parsing and serialization.
	- **Dependency Injection**: A robust system to inject dependencies (like database sessions, configurations, or security utilities) into route handlers.
	- **Async vs Sync**: Route functions can be defined with `async def` (for non-blocking I/O) or standard `def` (which runs in an external threadpool).
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Basic Application**:
		- ```python
		  from fastapi import FastAPI
		  
		  app = FastAPI()
		  
		  @app.get("/")
		  async def read_root():
		      return {"message": "Welcome to FastAPI"}
		  ```
	- **Request Parameters & Pydantic Validation**:
		- ```python
		  from pydantic import BaseModel
		  from typing import Optional
		  
		  class Item(BaseModel):
		      name: str
		      description: Optional[str] = None
		      price: float
		      tax: Optional[float] = None
		  
		  @app.post("/items/")
		  async def create_item(item: Item):
		      return {"item_name": item.name, "total_price": item.price + (item.tax or 0)}
		  ```
	- **Dependency Injection Pattern**:
		- ```python
		  from fastapi import Depends, HTTPException, status
		  
		  def get_token_header(x_token: str = None):
		      if x_token != "supersecrettoken":
		          raise HTTPException(
		              status_code=status.HTTP_400_BAD_REQUEST,
		              detail="X-Token header invalid"
		          )
		      return x_token
		  
		  @app.get("/protected-route/")
		  async def read_protected_data(token: str = Depends(get_token_header)):
		      return {"secret_data": "FastAPI is awesome!", "token_used": token}
		  ```
- # 💡 **Best Practices & Tips**
	- **Run Command**: Start the dev server using `uvicorn main:app --reload` (assuming filename is `main.py`).
	- **Async Judgement**: Only use `async def` if you use an asynchronous library inside the route (like `asyncpg` or `httpx`). For blocking libraries (like standard `sqlite3` or `requests`), use standard `def` to avoid blocking the main event loop.
	- **Response Model**: Always specify `response_model` in path decorators (`@app.get("/", response_model=Item)`) to filter output data and enforce schema output structures.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Web Development]] | [[Api]] | [[Flask]] | [[SQLAlchemy]]