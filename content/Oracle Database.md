---
date: 2024-12-04T11:51:44+05:30
lastmod: 2026-03-30T10:55:09+05:30

seoTitle: Oracle Database Reference – PL/SQL and Administration Guide
description: "Oracle Database reference covering PL/SQL, stored procedures, indexes, partitioning, RAC, Data Guard, Oracle 19c/21c features, and performance tuning."
keywords: "Oracle Database, PL/SQL, stored procedures, indexes, partitioning, RAC, Data Guard, Oracle 19c, Oracle 21c, database administration, RDBMS, performance tuning"
---

- # History
	- **How**:
		- **Oracle Database**, originally known as **Oracle RDBMS**, was created by **Larry Ellison**, **Bob Miner**, and **Ed Oates** in **1977** as part of a project at **Software Development Laboratories** (SDL), later renamed **Oracle Corporation**.
		- The first version of Oracle was released in **1979** and was the first commercially available relational database management system (RDBMS) to fully implement **SQL (Structured Query Language)**.
		- Oracle was developed with the goal of providing businesses with a reliable, scalable, and flexible relational database system that could handle large-scale data storage and transactions.
		- Over the years, Oracle expanded its offerings, adding **advanced features** like **multi-tenant architecture**, **cloud capabilities**, **distributed databases**, and **automatic data management** tools, making it one of the most robust and widely-used RDBMS in the world.
		- Oracle Database became especially popular in enterprise environments for applications requiring high availability, security, and scalability, particularly in industries like banking, telecommunications, and government.
	-
	- **Who**:
		- **Larry Ellison** is the co-founder and former CEO of **Oracle Corporation** and played a crucial role in the development and marketing of Oracle Database.
		- **Bob Miner** and **Ed Oates** were also key co-founders and developers of the Oracle Database in its early days.
		- Oracle Database is maintained and continuously improved by **Oracle Corporation**, with contributions from a large team of developers and engineers.
		- Oracle Corporation also offers a comprehensive suite of products and services related to database management, cloud computing, and enterprise software solutions.
	-
	- **Why**:
		- Oracle Database was created to address the need for a powerful, scalable, and feature-rich relational database system for enterprise applications.
		- Its development was driven by the growing demand for databases that could support large-scale data storage, manage high-volume transactions, and ensure **data consistency**, **security**, and **reliability** in mission-critical systems.
		- Oracle aimed to provide a database solution that could handle diverse use cases, from small businesses to global enterprises, with features like **data partitioning**, **advanced indexing**, and **high availability** that were not available in earlier database systems.
-
- # Introduction
	- ## Advantages:
		- **Scalability and Performance**: Oracle Database is known for its ability to scale horizontally and vertically, handling large amounts of data and high transaction volumes. Its **Real Application Clusters (RAC)** feature allows for clustering multiple database instances to improve performance and availability.
		- **High Availability**: Oracle provides robust features for high availability, including **Data Guard**, **Active Data Guard**, and **Flashback Technology**. These ensure that databases are fault-tolerant and can recover quickly from hardware failures.
		- **Advanced Security Features**: Oracle Database offers advanced security features, including **Transparent Data Encryption (TDE)**, **Data Masking**, **Virtual Private Database (VPD)**, and fine-grained access control to help protect sensitive data and comply with regulatory requirements.
		- **Comprehensive Data Management**: Oracle supports **multi-model data**, meaning it can handle not only traditional relational data but also JSON, XML, spatial data, and other unstructured data types. This makes it versatile for a wide range of applications.
		- **Automation and Self-Management**: Oracle offers **automatic tuning**, **self-healing**, and **auto-patching** features through its **Oracle Autonomous Database** offerings, reducing the need for manual intervention in database administration.
		- **Enterprise Features**: Oracle provides extensive support for **transaction management**, **high concurrency**, and **complex queries**. Its features like **partitioning**, **materialized views**, and **in-memory processing** are designed for enterprise-grade workloads.
		- **Comprehensive Tooling**: Oracle offers a wide range of **tools** for database management, reporting, and analytics, including **Oracle Enterprise Manager**, **Oracle SQL Developer**, and **Oracle Application Express (APEX)** for building applications.
		-
	- ## Disadvantages:
		- **Cost**: Oracle Database is known for its high licensing and support costs, making it an expensive choice, especially for small to medium-sized businesses. The **per-core** pricing model and additional costs for advanced features can add up quickly.
		- **Complexity**: Oracle Database is highly feature-rich, but this comes with a steep learning curve. Its **administration**, **optimization**, and **configuration** can be complex, requiring specialized knowledge and skills.
		- **Resource Intensive**: Oracle Database can be resource-intensive, requiring significant **CPU**, **memory**, and **disk space** to run efficiently. This can lead to high infrastructure costs, particularly in environments with large datasets or high-transaction volumes.
		- **Vendor Lock-In**: Oracle's ecosystem and licensing model may lead to vendor lock-in, making it difficult to migrate to other database systems or cloud providers without significant cost or effort.
		- **Complex Licensing**: Oracle's licensing structure can be difficult to understand, and businesses may struggle with tracking usage to ensure compliance. This complexity often results in unexpected costs.
		- **Overkill for Small Applications**: While Oracle Database is powerful, it may be overkill for small applications or environments that do not require its full suite of features. For less complex workloads, other databases like **MySQL** or **PostgreSQL** may be more appropriate.
	-
	- ## Remember Points:
		- **Scalability and High Availability**: Oracle is known for its ability to handle large-scale databases and ensure high availability with features like **Real Application Clusters (RAC)** and **Data Guard**.
		- **Advanced Security**: Oracle Database offers industry-leading security features, including encryption, data masking, and access control, making it suitable for handling sensitive data.
		- **Comprehensive Data Management**: Oracle supports a wide variety of data models, including relational, NoSQL, and unstructured data, giving it versatility for various use cases.
		- **Automation and Self-Management**: Oracle's **Autonomous Database** offerings simplify database administration by automating tasks like patching, tuning, and backups.
		- **Enterprise-Grade Features**: Oracle provides robust support for complex, high-concurrency workloads and is known for handling mission-critical applications in large organizations.
		- **Cost and Complexity**: Oracle Database is best suited for large enterprises with complex database needs, but its high cost and complexity make it less ideal for smaller projects or budgets.
-