---
seoTitle: Flask Framework - Python Micro Web Framework Reference Guide
description: "Flask is a lightweight Python web framework. Covers routing, templates, Blueprints, Flask-SQLAlchemy, Flask-Login, REST APIs, and application factory pattern."
keywords: "Flask, Python web framework, routing, Jinja2 templates, Blueprints, Flask-SQLAlchemy, Flask-Login, REST API, micro framework, Python library, web development"
---

- # 📘 **Overview**
	- **What is it?**: Flask is a lightweight WSGI web application framework in Python. Designed to make getting started quick and easy, it is a "microframework" because it does not require particular tools or libraries (such as a database abstraction layer or validation form).
	- **Key Features**:
		- **Micro & Pluggable**: Core features are minimal, but it is highly extensible, allowing developers to add SQLAlchemy, Web Forms, User Auth, etc., as needed.
		- **Routing**: Clean decorator-based URL mapping.
		- **Jinja2 Templating**: Powerful layout building with template inheritance, loops, and variable binding.
		- **Built-in Dev Server**: Fast reload and debugger in development.
	- **Installation**:
		- ```bash
		  pip install Flask
		  ```
- # 🧾 **Core Concepts**
	- **Routing**: Mapping URL paths to Python view functions (e.g. `@app.route('/user/<username>')`).
	- **Blueprints**: Modules used to organize application routes, assets, and templates into clean components (crucial for scaling Flask apps).
	- **Request/Response**: Context objects representing incoming client requests (`request.args`, `request.form`, `request.json`) and the outgoing response structure.
	- **Application Factory Pattern**: A design pattern where the application instance is created inside a function (e.g., `create_app()`), allowing multiple configurations and better testing.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Basic Application**:
		- ```python
		  from flask import Flask, jsonify, request
		  
		  app = Flask(__name__)
		  
		  @app.route("/", methods=["GET"])
		  def home():
		      return jsonify({"message": "Hello from Flask!"})
		  
		  if __name__ == "__main__":
		      app.run(debug=True)
		  ```
	- **Dynamic Routing & Request Handling**:
		- ```python
		  @app.route("/user/<int:user_id>", methods=["POST"])
		  def update_user(user_id):
		      # Extract JSON payload
		      data = request.get_json()
		      username = data.get("username")
		      
		      # Process data...
		      return jsonify({"id": user_id, "updated_to": username}), 200
		  ```
	- **Using Blueprints (Modularity)**:
		- ```python
		  # routes/auth.py
		  from flask import Blueprint
		  
		  auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
		  
		  @auth_bp.route("/login")
		  def login():
		      return "Login Page"
		  
		  # main.py
		  from flask import Flask
		  from routes.auth import auth_bp
		  
		  app = Flask(__name__)
		  app.register_blueprint(auth_bp)
		  ```
- # 💡 **Best Practices & Tips**
	- **Factory Pattern**: Always use the application factory pattern (`def create_app(): ...`) for production apps to avoid global state issues and make testing easier.
	- **Config Management**: Store sensitive configs in a class (like `ProductionConfig` or `DevelopmentConfig`) loaded from environment variables.
	- **Error Handling**: Register global error handlers using `@app.errorhandler(404)` or `@app.errorhandler(Exception)` to return clean JSON error payloads.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Web Development]] | [[FastAPI]] | [[SQLAlchemy]]