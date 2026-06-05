---
seoTitle: SQLAlchemy Python Library - ORM and Core SQL Reference Guide
description: "SQLAlchemy provides both ORM and Core SQL for Python. Covers declarative models, sessions, relationships, query API, migrations with Alembic, and async support."
keywords: "SQLAlchemy, Python ORM, declarative models, sessions, relationships, query API, Alembic, migrations, async SQLAlchemy, Python library, database, SQL Core"
---

- # 📘 **Overview**
	- **What is it?**: SQLAlchemy is the Python SQL toolkit and Object Relational Mapper (ORM) that gives application developers the full power and flexibility of SQL. It provides a full suite of well-known enterprise-level persistence patterns, designed for efficient and high-performance database access.
	- **Key Features**:
		- **ORM (Object-Relational Mapping)**: Map database tables to Python classes and operations, automatically syncing object state changes to the database.
		- **SQL Expression Language (Core)**: A Pythonic syntax for building SQL queries, independent of the ORM layer.
		- **Connection Pooling**: Automatic, high-performance connection pooling and transaction management.
	- **Installation**:
		- ```bash
		  pip install sqlalchemy
		  ```
- # 🧾 **Core Concepts**
	- **Engine**: The entry point for database communication. It manages the connection pool and dialect behavior (e.g. SQLite, PostgreSQL).
	- **Declarative Base**: The base class for defining database tables as Python objects. Inherited classes map attributes to table columns.
	- **Session**: The transaction manager. It keeps track of modifications (inserts, updates, deletes) and executes them on commit/flush.
	- **Relationship**: Links records in different tables (e.g., One-to-Many, Many-to-Many) using foreign keys, simplifying object-graph traversal.
- # 💻 **Common Code Patterns & Cheat Sheet**
	- **Defining Models & Creating Database**:
		- ```python
		  from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
		  from sqlalchemy.orm import declarative_base, relationship
		  
		  # 1. Setup Engine & Base
		  engine = create_engine("sqlite:///example.db", echo=True)
		  Base = declarative_base()
		  
		  # 2. Define Models
		  class User(Base):
		      __tablename__ = "users"
		      
		      id = Column(Integer, primary_key=True)
		      name = Column(String(50))
		      emails = relationship("Email", back_populates="user")
		  
		  class Email(Base):
		      __tablename__ = "emails"
		      
		      id = Column(Integer, primary_key=True)
		      email_address = Column(String(100), nullable=False)
		      user_id = Column(Integer, ForeignKey("users.id"))
		      user = relationship("User", back_populates="emails")
		  
		  # 3. Create Tables
		  Base.metadata.create_all(engine)
		  ```
	- **CRUD Operations**:
		- ```python
		  from sqlalchemy.orm import sessionmaker
		  
		  # Create Session Class
		  Session = sessionmaker(bind=engine)
		  session = Session()
		  
		  # Create (Insert)
		  new_user = User(name="Alice")
		  new_email = Email(email_address="alice@example.com", user=new_user)
		  session.add(new_user)
		  session.add(new_email)
		  session.commit()
		  
		  # Read (Select)
		  user = session.query(User).filter_by(name="Alice").first()
		  print(user.emails[0].email_address)
		  
		  # Update
		  user.name = "Alice Smith"
		  session.commit()
		  
		  # Delete
		  session.delete(user)
		  session.commit()
		  ```
- # 💡 **Best Practices & Tips**
	- **N+1 Query Prevention**: By default, SQLAlchemy relationships use lazy loading. Use `joinedload` (e.g. `from sqlalchemy.orm import joinedload; session.query(User).options(joinedload(User.emails))`) to perform an SQL JOIN and fetch related items in a single query, preventing performance bottlenecks.
	- **Context Managers for Sessions**: Wrap database sessions in context managers (like `with sessionmaker()() as session:`) to automatically close connections and rollback transactions on error.
	- **Alembic Migrations**: For production databases, always use **Alembic** (the companion migration tool) to version and apply database schema changes rather than running `Base.metadata.create_all()`.
- # 🔗 **Navigation & Internal Links**
	- **Parent**: [[Python]]
	- **Related Notes**: [[Databases]] | [[MySQL]] | [[PostgreSQL]] | [[SQLite]] | [[FastAPI]] | [[Flask]]