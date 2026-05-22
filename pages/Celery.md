---
seoTitle: Celery Python Library – Distributed Task Queue Reference Guide
description: "Comprehensive guide to Celery: distributed task queue for Python. Covers architecture, RabbitMQ/Redis configuration, worker pools, custom tasks, canvas workflows, signals, beat scheduler, framework integrations, and monitoring."
keywords: "Celery, distributed task queue, Python tasks, Redis broker, RabbitMQ, Celery workers, beat scheduler, task chaining, Flower monitoring, Python library, async tasks, Celery signals, gevent, prefork, Django Celery, FastAPI Celery"
---

- # History & Philosophy
	- **Origins**:
		- Celery was created by Ask Solem in 2009 to solve the problem of running background jobs in Django applications.
		- Originally designed as a Django-specific backend, it was refactored into a standalone Python library in version 2.0.
		- Developed under the BSD License, Celery has evolved into the de facto standard for distributed task execution in the Python ecosystem.
	- **Problem Statement**:
		- Python's standard web frameworks (Django, Flask, FastAPI) operate on a synchronous request-response cycle or asynchronous loops where blocking operations degrade performance.
		- Long-running tasks (image processing, PDF generation, email dispatching, machine learning inference, API calls) block thread execution and degrade user experience.
		- Decoupling these blocking operations requires a message broker to queue messages and a pool of background workers to process them asynchronously.
	- **Architecture Paradigm**:
		- **Producer (Client)** — Generates task requests and submits them to the broker (e.g., a web application calling `.delay()`).
		- **Message** — Serialized data representing the function name, arguments, and metadata.
		- **Broker** — The transport channel that routes and holds messages in queues until consumed (e.g., RabbitMQ, Redis).
		- **Consumer (Worker)** — Independent daemon processes that fetch messages from the broker and execute them inside execution pools.
		- **Result Backend** — Storage for tracking task status, metadata, return values, and traceback traces (e.g., Redis, SQL databases, Memcached).
	- **Message Lifecycle Flow**:
		- ```mermaid
		  flowchart TD
		      A[Web Client / Producer] -->|1. Invokes task.delay| B(Serializer: JSON/Msgpack)
		      B -->|2. Send message| C[Broker Exchange]
		      C -->|3. Route via routing_key| D[Queue]
		      D -->|4. Consume message| E[Worker parent process]
		      E -->|5. Prefetch and allocate| F[Worker execution pool Prefork/Gevent]
		      F -->|6. Execute task| G[Write results]
		      G --> H[(Result Backend Database/Cache)]
		  ```
-
- # Core Architecture & Internals
	- ## Worker Process Tree Architecture:
		- Celery worker executes as a parent supervisor process with child execution pool processes.
		- **Parent Process**:
			- Handles network I/O with the broker, listens for control commands, manages signals, and performs heartbeat checks.
			- Allocates jobs to worker subprocesses or threads based on scheduling limits and prefetch ratios.
		- **Child Processes/Pools**:
			- Execution pool units that run the actual Python task code.
			- Prevent task crashes from taking down the parent supervisor process.
	- ## Message Acknowledgement & Reliability:
		- **Early Acknowledgement (Default)**:
			- Message is acknowledged immediately upon receipt from the broker, before execution begins.
			- **Pros**: Frees up broker resources quickly; prevents task execution retry loops on uncaught crashes.
			- **Cons**: If the worker process is killed mid-execution (OOM, power failure), the task is lost.
		- **Late Acknowledgement (`acks_late=True`)**:
			- Message is acknowledged only after successful task execution or handled exception.
			- **Pros**: Highly reliable; ensures tasks are redelivered and retried if a worker crashes.
			- **Cons**: Requires tasks to be strictly **idempotent** (safe to execute multiple times with the same input without side effects).
	- ## Prefetching Mechanics:
		- Prefetching controls how many messages are reserved by a worker instance.
		- **Formula**: `prefetch_limit = worker_prefetch_multiplier * concurrency`
		- **Configuration**: `worker_prefetch_multiplier`
			- **Default (4)**: Ideal for short, high-throughput tasks. A worker with 4 cores will prefetch 16 tasks.
			- **Long-running tasks**: Set to `1`. Ensures workers only take new tasks as they finish current ones, preventing scheduling bottlenecks.
			- **Disable Prefetching**: Set to `0`. Worker consumes as many messages as the broker will send. Useful when queuing mechanisms are handled externally.
	- ## Task Lifecycle State Machine:
		- Tasks progress through specific states during execution.
		- ```mermaid
		  stateDiagram-v2
		      [*] --> PENDING : Task published to broker
		      PENDING --> STARTED : Worker starts execution (track_started=True)
		      STARTED --> SUCCESS : Task executed successfully
		      STARTED --> FAILURE : Exception raised during execution
		      STARTED --> RETRY : Task failed but retry is triggered
		      RETRY --> PENDING : Re-queued with ETA/countdown
		      STARTED --> REVOKED : Terminated/cancelled by CLI or expire ETA
		      FAILURE --> [*]
		      SUCCESS --> [*]
		      REVOKED --> [*]
		  ```
	- ## Serialization Protocols:
		- Celery supports serializing arguments and results into several formats:
		- | Format | Speed | Security | Standard Compatibility | Description |
		  | :--- | :--- | :--- | :--- | :--- |
		  | **JSON** | Fast | High | Universal | Default serializer. Restricts arguments to native JSON types (strings, numbers, lists, dicts). |
		  | **Msgpack** | Extremely Fast | High | Multi-language binary | Binary alternative to JSON. Smaller payloads, fast serialization/deserialization. |
		  | **YAML** | Slow | High | Universal | Human-readable formatting. Complex type support. |
		  | **Pickle** | Moderate | Very Low | Python only | Discouraged. Allows python object serialization. Vulnerable to arbitrary code execution attacks. |
-
- # Setup & Message Broker Configurations
	- ## Prerequisites & Libraries:
		- ```bash
		  # Core install
		  pip install celery
		  
		  # Install with Redis transport dependencies
		  pip install celery[redis]
		  
		  # Install with Msgpack and Redis
		  pip install celery[redis,msgpack]
		  ```
	- ## Celery Configuration (settings.py / celeryconfig.py):
		- ```python
		  # config.py
		  broker_url = 'redis://localhost:6379/0'
		  result_backend = 'redis://localhost:6379/1'
		  
		  # Serialization configurations
		  task_serializer = 'json'
		  result_serializer = 'json'
		  accept_content = ['json']
		  
		  # Timezone management
		  timezone = 'UTC'
		  enable_utc = True
		  
		  # Performance settings
		  worker_prefetch_multiplier = 1
		  task_acks_late = True
		  broker_pool_limit = 10  # Pool size for connection sharing
		  broker_connection_retry_on_startup = True
		  ```
	- ## RabbitMQ Production Configuration:
		- Configure RabbitMQ as the broker with security credentials and virtual hosts:
		- ```python
		  # broker configuration using AMQP protocol
		  broker_url = 'amqp://admin:secure_password@rabbitmq-host.domain.com:5672/my_vhost'
		  
		  # RabbitMQ transport SSL configuration
		  import ssl
		  broker_use_ssl = {
		      'keyfile': '/path/to/client/key.pem',
		      'certfile': '/path/to/client/cert.pem',
		      'ca_certs': '/path/to/ca/cacert.pem',
		      'cert_reqs': ssl.CERT_REQUIRED
		  }
		  ```
	- ## Redis Production Configuration:
		- Configure Redis as the broker and backend with credentials and connection pool options:
		- ```python
		  # Redis connection using SSL and database indexes
		  broker_url = 'rediss://:strong_redis_password@redis-server:6379/0'
		  result_backend = 'rediss://:strong_redis_password@redis-server:6379/1'
		  
		  # Secure transport options
		  broker_transport_options = {
		      'ssl': {
		          'ssl_cert_reqs': 'required',
		          'ssl_ca_certs': '/path/to/ca/certs.pem'
		      },
		      'visibility_timeout': 3600,  # 1 hour visibility check
		      'max_connections': 20,       # Limit broker pool connections
		  }
		  ```
-
- # Task Definitions & Customization
	- ## Advanced Task Decorator Options:
		- Decorating functions with configurations to manage runtime limits, retries, and result logging:
		- ```python
		  from celery import Celery
		  import time
		  
		  app = Celery('app_instance')
		  app.config_from_object('config')
		  
		  @app.task(
		      bind=True,                             # Passes task instance (self) to the function
		      name='io_operations.download_file',    # Shadow task name instead of python module path
		      ignore_result=False,                   # Set to True to prevent writing results to backend
		      track_started=True,                    # Enables STARTED state reporting
		      acks_late=True,                        # Ack message after completion
		      reject_on_worker_lost=True,            # Requeues message if worker subprocess dies
		      max_retries=3,                         # Total number of retries
		      default_retry_delay=60,                # Retry wait duration in seconds
		      time_limit=120,                        # Hard time limit in seconds (SIGKILL after 120s)
		      soft_time_limit=90                     # Raises SoftTimeLimitExceeded after 90s
		  )
		  def download_file(self, url, destination):
		      print(f"Executing task id: {self.request.id}")
		      print(f"Retries completed: {self.request.retries}")
		      # Perform download logic...
		      time.sleep(10)
		      return {"status": "success", "file": destination}
		  ```
	- ## Creating Custom Task Base Classes:
		- Inheritance from `celery.Task` allows custom error logging, metrics collections, or database cleanups on task lifecycles:
		- ```python
		  import logging
		  from celery import Task
		  
		  logger = logging.getLogger("celery_custom_tasks")
		  
		  class DatabaseAwareTask(Task):
		      """
		      A custom Celery task class that manages database connections and logs execution metrics.
		      """
		      abstract = True  # Declare abstract to prevent direct Celery execution registration
		      
		      def __call__(self, *args, **kwargs):
		          """
		          Runs when task execution starts. Setup context before invocation.
		          """
		          logger.info("Initializing task database context.")
		          # E.g., open db session
		          return super(DatabaseAwareTask, self).__call__(*args, **kwargs)
		  
		      def on_success(self, retval, task_id, args, kwargs):
		          """
		          Success handler callback hook.
		          """
		          logger.info(f"Task {task_id} finished successfully. Return: {retval}")
		  
		      def on_failure(self, exc, task_id, args, kwargs, einfo):
		          """
		          Failure handler callback hook.
		          """
		          logger.error(f"Task {task_id} failed. Exception: {exc}", exc_info=einfo)
		          # E.g., rollback active database sessions
		  
		      def on_retry(self, exc, task_id, args, kwargs, einfo):
		          """
		          Retry callback hook.
		          """
		          logger.warning(f"Task {task_id} is retrying. Reason: {exc}")
		  
		      def after_return(self, status, retval, task_id, args, kwargs, einfo):
		          """
		          Teardown hook executed after success or failure execution.
		          """
		          logger.info(f"Task {task_id} finished with status {status}. Closing DB sessions.")
		          # E.g., close db session
		  
		  # Apply the custom base class to tasks
		  @app.task(base=DatabaseAwareTask)
		  def process_transaction(user_id, amount):
		      # Task logic automatically benefits from custom hooks
		      return f"Processed ${amount} for User {user_id}"
		  ```
	- ## Accessing Task Context (self.request):
		- Using the `self.request` object inside bound tasks to read runtime properties:
		- ```python
		  @app.task(bind=True)
		  def inspect_context(self):
		      request_info = {
		          "id": self.request.id,
		          "retries": self.request.retries,
		          "expires": self.request.expires,
		          "hostname": self.request.hostname,
		          "delivery_info": self.request.delivery_info,
		          "args": self.request.args,
		          "kwargs": self.request.kwargs,
		          "root_id": self.request.root_id,      # ID of the parent workflow task
		          "parent_id": self.request.parent_id
		      }
		      return request_info
		  ```
-
- # Routing & Multi-Queue Systems
	- ## Queue Configurations:
		- Restricting tasks to run on dedicated queues isolated by priorities, speed constraints, or compute requirements:
		- ```python
		  from kombu import Exchange, Queue
		  
		  # Configure exchange bindings
		  default_exchange = Exchange('default', type='direct')
		  media_exchange = Exchange('media', type='direct')
		  high_priority_exchange = Exchange('high_priority', type='direct')
		  
		  task_queues = (
		      Queue('default', default_exchange, routing_key='default'),
		      Queue('video_processing', media_exchange, routing_key='media.video'),
		      Queue('high_priority', high_priority_exchange, routing_key='high'),
		  )
		  
		  task_default_queue = 'default'
		  task_default_exchange = 'default'
		  task_default_routing_key = 'default'
		  ```
	- ## Routing Keys & Router Classes:
		- Using static patterns or dynamic class-based routers to direct tasks:
		- ```python
		  # Static Routing definition
		  task_routes = {
		      'tasks.add': {'queue': 'high_priority', 'routing_key': 'high'},
		      'tasks.compress_video': {'queue': 'video_processing', 'routing_key': 'media.video'},
		  }
		  
		  # Dynamic router class implementation
		  class PriorityRouter:
		      def route_for_task(self, task, args=None, kwargs=None, client=None):
		          if task == 'tasks.process_payment':
		              return {'queue': 'high_priority', 'routing_key': 'high'}
		          if kwargs and kwargs.get('priority') == 'urgent':
		              return {'queue': 'high_priority', 'routing_key': 'high'}
		          return None
		  
		  # Register router
		  task_routers = (PriorityRouter(),)
		  ```
	- ## Priority Queues:
		- **RabbitMQ (Native Priority)**:
			- RabbitMQ handles queue-level maximum priorities (`x-max-priority`).
			- ```python
			  task_queues = [
			      Queue('priority_queue', Exchange('priority'), routing_key='priority',
			            queue_arguments={'x-max-priority': 10})
			  ]
			  ```
			- Calling tasks with dynamic priorities:
			- ```python
			  my_task.apply_async(args=[1, 2], priority=9)  # 0 to 9 scale
			  ```
		- **Redis (Emulated Priority)**:
			- Redis has no native priorities. Celery simulates this by generating sub-queues (e.g. `priority_queue\x06\x16`).
			- Emulation adds overhead; separate explicit queues (e.g. `high_priority`, `low_priority`) are recommended for Redis backends.
	- ## Broadcast Tasks:
		- Directing tasks to execute across **every** active worker pool rather than a single worker (useful for purging local caches, updating node configs):
		- ```python
		  from kombu.common import Broadcast
		  
		  task_queues = (
		      Queue('default', Exchange('default'), routing_key='default'),
		      Broadcast('broadcast_config_updates'),  # Broadcast queue using Fanout exchange
		  )
		  
		  task_routes = {
		      'tasks.sync_cache': {'queue': 'broadcast_config_updates'},
		  }
		  ```
-
- # Canvas Workflows (Advanced Composition)
	- ## Task Signatures:
		- Signatures (`s()` or `signature()`) encapsulate arguments, execution options, and routes of a task.
		- **Mutable Signature (`s()`)**:
			- Parameters can be injected dynamically by preceding tasks in a chain.
			- ```python
			  # Signature expecting user_id downstream:
			  email_sig = send_email.s(subject="Hello")
			  ```
		- **Immutable Signature (`si()`)**:
			- Does not accept prepended inputs from parent chain outputs.
			- ```python
			  # Ignores previous return values:
			  cleanup_sig = run_cleanup.si(directory="/tmp")
			  ```
	- ## Parallel Groups:
		- Execute multiple tasks simultaneously. Returns a `GroupResult` to fetch list results:
		- ```python
		  from celery import group
		  
		  # Run 5 scraper requests in parallel
		  job = group(scrape_page.s(url=f"http://site.com/p/{i}") for i in range(1, 6))
		  result = job.apply_async()
		  
		  # Resolve values (blocks until all execute)
		  pages_content = result.get()
		  ```
	- ## Sequential Chains:
		- Links tasks together sequentially. The result of one task is passed as the first positional argument to the next:
		- ```python
		  from celery import chain
		  
		  # Pipeline: fetch user -> transform details -> generate invoice file -> mail PDF
		  # chain executes: fetch_user() -> transform_details(user) -> generate_invoice(details)
		  job = chain(
		      fetch_user_details.s(user_id=451),
		      transform_details.s(),
		      generate_invoice.s(),
		      send_email.s(subject="Your Monthly Invoice")
		  )
		  result = job.apply_async()
		  invoice_sent = result.get()
		  ```
	- ## Orchestrated Chords:
		- Runs tasks inside a parallel group, forwarding all execution results into a final callback execution task:
		- ```python
		  from celery import chord
		  
		  @app.task
		  def aggregate_report(results_list, report_name):
		      # results_list contains output of all group steps
		      return f"Report {report_name}: parsed {sum(results_list)} elements."
		  
		  # Run parallel checks, then summarize
		  header = [check_security.s(host="10.0.0.1"), check_security.s(host="10.0.0.2")]
		  callback = aggregate_report.s(report_name="Main Security Summary")
		  
		  job = chord(header, callback)
		  result = job.apply_async()
		  print(result.get())
		  ```
	- ## Starmap & Chunks:
		- **Starmap**: Map list of tuple arguments to a task execution:
			- ```python
			  # Run: add(1, 1), add(2, 2)
			  job = add.starmap([(1, 1), (2, 2)])
			  job.apply_async().get() # [2, 4]
			  ```
		- **Chunks**: Splits list of operations into chunks to reduce serialization overhead over broker channels:
			- ```python
			  # Split 1000 items into chunks of 100
			  job = add.chunks([(i, i) for i in range(1000)], 100)
			  job.apply_async()
			  ```
	- ## Nested Complex Workflows:
		- Complex hierarchical operations composition:
		- ```python
		  # Run Group A and Group B in sequence, then run final task
		  job = chain(
		      group(fetch_data.s(src="API1"), fetch_data.s(src="API2")),
		      group(process_record.s(), process_record.s()),
		      send_alert.s()
		  )
		  ```
-
- # Error Handling & Signals
	- ## Dynamic Retry Policies:
		- Best practices for database connectivity issues or network flake handling with exponential backoff:
		- ```python
		  import requests
		  
		  @app.task(bind=True, max_retries=10)
		  def make_api_request(self, endpoint):
		      try:
		          response = requests.get(endpoint)
		          response.raise_for_status()
		          return response.json()
		      except (requests.exceptions.HTTPError, requests.exceptions.Timeout) as exc:
		          # Exponential backoff: 2, 4, 8, 16... seconds with random jitter (+/- 2s)
		          import random
		          backoff = (2 ** self.request.retries) + random.uniform(0.5, 2.0)
		          raise self.retry(exc=exc, countdown=backoff)
		  ```
	- ## Automatic Exception Retrying (Celery 4.0+):
		- Setup exception classes to catch and auto-retry without manual try-except boilerplate:
		- ```python
		  @app.task(
		      autoretry_for=(requests.exceptions.RequestException, ValueError),
		      retry_backoff=True,          # Uses exponential backoff automatically
		      retry_backoff_max=300,       # Caps backoff duration to 5 minutes
		      retry_jitter=True,           # Adds random variance to backoff times
		      max_retries=5
		  )
		  def fetch_remote_assets(url):
		      return requests.get(url).text
		  ```
	- ## Handling Errors in Workflows (link_error):
		- Attaching error handlers (`link_error`) to catch failed execution steps:
		- ```python
		  @app.task
		  def error_callback(request, exc, traceback):
		      print(f"Task {request.id} failed. Error: {exc}")
		      # Alert developers, trigger alerts, clean directories...
		  
		  # Link error handler to task invocation
		  my_task.apply_async(args=[1, 2], link_error=error_callback.s())
		  ```
	- ## Celery Signals Reference:
		- Signals allow hooking into task lifecycle phases or worker initialization:
		- ```python
		  from celery.signals import (
		      before_task_publish, 
		      task_prerun, 
		      task_postrun, 
		      worker_shutdown
		  )
		  
		  @before_task_publish.connect
		  def setup_task_correlation_id(sender=None, headers=None, body=None, **kwargs):
		      # Inject correlation ID into headers before sending to broker
		      if headers:
		          headers['x-correlation-id'] = headers.get('id')
		  
		  @task_prerun.connect
		  def log_task_start(task_id, task, args, kwargs, **kwargs):
		      print(f"Worker preparing to run task: {task.name} [{task_id}]")
		  
		  @task_postrun.connect
		  def log_task_end(task_id, task, args, kwargs, retval, state, **kwargs):
		      print(f"Worker finished running task: {task.name} [{task_id}] with state: {state}")
		  
		  @worker_shutdown.connect
		  def cleanup_resources(sender, **kwargs):
		      print("Worker process shutting down. Releasing global sockets.")
		  ```
-
- # Concurrency Pools & Performance Tuning
	- ## Choosing Execution Pools:
		- Celery executes tasks using various underlying concurrency abstractions:
		- **Prefork (Default)**:
			- Multi-processing model utilizing standard Python `multiprocessing`.
			- **Best for**: CPU-bound tasks (image processing, data manipulation, machine learning).
			- **Command**: `celery -A tasks worker --pool=prefork --concurrency=4`
		- **Gevent & Eventlet**:
			- Asynchronous greenlet execution pool utilizing cooperative monkey-patching.
			- **Best for**: High concurrency, I/O-bound workloads (web scraping, API integrations, chat alerts, bulk socket calls).
			- **Command**: `celery -A tasks worker --pool=gevent --concurrency=500`
		- **Solo**:
			- Runs tasks inside the main worker process loop sequentially.
			- **Best for**: Debugging, testing, and tiny resource-constrained nodes.
			- **Command**: `celery -A tasks worker --pool=solo`
		- **Threads**:
			- Multi-threading execution pools.
			- **Best for**: Lightweight execution environments that do not support multiprocessing. Subject to Python's GIL.
			- **Command**: `celery -A tasks worker --pool=threads --concurrency=10`
	- ## Memory Management (Taming Leaks):
		- Background worker processes run indefinitely. Slight memory leaks in third-party packages can quickly consume server RAM.
		- **Mitigation configuration options**:
		- ```python
		  # Recycle worker child subprocesses after executing N tasks
		  worker_max_tasks_per_child = 1000
		  
		  # Recycle worker child subprocesses if memory exceeds threshold (e.g. 500MB)
		  # Value in Kilobytes: 500,000 KB = ~500 MB
		  worker_max_memory_per_child = 500000
		  ```
	- ## Autoscaling Workers:
		- Dynamic adjustment of worker pools based on workload size:
		- ```bash
		  # Dynamic scaling: keep minimum 2 processes, scaling up to maximum 10
		  celery -A tasks worker --autoscale=10,2
		  ```
-
- # Periodic Tasks (Celery Beat)
	- ## Configuration Options:
		- Celery Beat scheduler maintains the schedule of tasks and submits messages to the broker at designated intervals.
		- ```python
		  from celery import Celery
		  from celery.schedules import crontab
		  
		  app = Celery('app')
		  
		  app.conf.beat_schedule = {
		      # Executes every 30 seconds
		      'run-fast-sync': {
		          'task': 'tasks.sync_local_cache',
		          'schedule': 30.0,
		      },
		      # Executes daily at 12:00 AM UTC
		      'daily-invoice-run': {
		          'task': 'tasks.generate_daily_invoices',
		          'schedule': crontab(hour=0, minute=0),
		          'args': ('production_billing',),
		      },
		      # Executes every Monday at 8:30 AM
		      'weekly-backup-task': {
		          'task': 'tasks.run_database_backup',
		          'schedule': crontab(hour=8, minute=30, day_of_week=1),
		      },
		      # Complex schedules (e.g., first day of every month, every 2 hours)
		      'monthly-audit': {
		          'task': 'tasks.audit_logs',
		          'schedule': crontab(day_of_month=1, hour='*/2', minute=0),
		      }
		  }
		  ```
	- ## Running the Scheduler:
		- Start Celery Beat in a dedicated, isolated server process to prevent double-scheduling runs:
		- ```bash
		  celery -A tasks beat --loglevel=info
		  ```
	- ## Database-Backed Dynamic Scheduling:
		- In production, hardcoded dictionaries in configuration files prevent administrators from updating schedules on the fly.
		- **Solution**: Use `django-celery-beat` (integrates schedule database models inside Django Admin) or custom schedulers:
		- ```bash
		  # Install the library
		  pip install django-celery-beat
		  
		  # Run scheduler using the custom database backend
		  celery -A tasks beat -S django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
		  ```
-
- # Framework Integrations
	- ## Django Integration Setup:
		- Complete directory pattern and config setup:
		- **Directory Layout**:
			- ```text
			  myproject/
			  ├── myproject/
			  │   ├── __init__.py
			  │   ├── celery.py
			  │   ├── settings.py
			  │   └── urls.py
			  └── manage.py
			  ```
		- **`myproject/celery.py`**:
			- ```python
			  import os
			  from celery import Celery
			  
			  # Set default Django settings module environment variable
			  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
			  
			  app = Celery('myproject')
			  
			  # Load config from settings namespace with CELERY_ prefix
			  app.config_from_object('django.conf:settings', namespace='CELERY')
			  
			  # Auto-discover task modules inside all registered django app directories
			  app.autodiscover_tasks()
			  ```
		- **`myproject/__init__.py`**:
			- ```python
			  # Ensure app is loaded when Django starts up
			  from .celery import app as celery_app
			  
			  __all__ = ('celery_app',)
			  ```
		- **`myproject/settings.py`**:
			- ```python
			  # Celery Broker Configurations
			  CELERY_BROKER_URL = 'redis://localhost:6379/0'
			  CELERY_RESULT_BACKEND = 'redis://localhost:6379/1'
			  CELERY_ACCEPT_CONTENT = ['json']
			  CELERY_TASK_SERIALIZER = 'json'
			  CELERY_RESULT_SERIALIZER = 'json'
			  CELERY_TASK_ACKS_LATE = True
			  ```
		- **Defining shared tasks in apps (`app_name/tasks.py`)**:
			- ```python
			  from celery import shared_task
			  from django.contrib.auth import get_user_model
			  
			  @shared_task
			  def send_welcome_email(user_id):
			      # Query database directly inside task to retrieve fresh data
			      User = get_user_model()
			      try:
			          user = User.objects.get(pk=user_id)
			          print(f"Sending welcome email to: {user.email}")
			          # send mail...
			          return True
			      except User.DoesNotExist:
			          return False
			      ```
	- ## FastAPI Integration Setup:
		- Configuring Celery tasks in asynchronous endpoints:
		- ```python
		  # main.py
		  from fastapi import FastAPI
		  from celery import Celery
		  from pydantic import BaseModel
		  
		  app = FastAPI()
		  
		  # Setup Celery
		  celery_app = Celery(
		      "worker_tasks",
		      broker="redis://localhost:6379/0",
		      backend="redis://localhost:6379/1"
		  )
		  
		  @celery_app.task(name="tasks.compute_factorial")
		  def compute_factorial(n: int):
		      import math
		      return math.factorial(n)
		  
		  class CalculationRequest(BaseModel):
		      number: int
		  
		  @app.post("/calculate-factorial")
		  async def run_calculation(req: CalculationRequest):
		      # Asynchronously call the Celery task
		      task_result = compute_factorial.delay(req.number)
		      return {
		          "task_id": task_result.id,
		          "status": "Task dispatched to worker queue"
		      }
		  
		  @app.get("/task-status/{task_id}")
		  async def get_task_status(task_id: str):
		      # Fetch status and results dynamically
		      result = celery_app.AsyncResult(task_id)
		      return {
		          "task_id": task_id,
		          "state": result.state,
		          "result": result.result if result.ready() else None
		      }
		  ```
	- ## Flask Integration Setup:
		- Wrapping tasks within the Flask application context using helper decorators:
		- ```python
		  # app.py
		  from flask import Flask
		  from celery import Celery, Task
		  
		  def make_celery(app):
		      class FlaskTask(Task):
		          def __call__(self, *args, **kwargs):
		              with app.app_context():
		                  return self.run(*args, **kwargs)
		                  
		      celery = Celery(
		          app.import_name,
		          broker=app.config['CELERY_BROKER_URL'],
		          backend=app.config['CELERY_RESULT_BACKEND'],
		          task_cls=FlaskTask
		      )
		      celery.conf.update(app.config)
		      return celery
		  
		  app = Flask(__name__)
		  app.config.update(
		      CELERY_BROKER_URL='redis://localhost:6379/0',
		      CELERY_RESULT_BACKEND='redis://localhost:6379/1'
		  )
		  
		  celery_app = make_celery(app)
		  
		  @celery_app.task
		  def db_operation_task():
		      # Safely query database using active Flask context structures
		      from models import db, Log
		      log_entry = Log(message="Cron checklist executed.")
		      db.session.add(log_entry)
		      db.session.commit()
		  ```
-
- # Monitoring, Logging & Security
	- ## Flower Administration Dashboard:
		- Setup, starting, and securing web dashboard instances:
		- ```bash
		  # Install package
		  pip install flower
		  
		  # Launch dashboard tracking celery worker states
		  celery -A tasks flower --port=5555 --basic_auth=admin:pass123
		  ```
	- ## CLI Remote Worker Commands:
		- Control active cluster workers directly from the terminal interface:
		- ```bash
		  # View worker statistics (uptime, pool type, task executions)
		  celery -A tasks inspect stats
		  
		  # Dynamic Rate Limiting: Adjust task rate limit limit dynamically without restarts
		  celery -A tasks control rate_limit tasks.add 10/m
		  
		  # Direct worker to consume from a new queue
		  celery -A tasks control add_consumer urgent_queue
		  
		  # Direct worker to stop consuming from a queue
		  celery -A tasks control cancel_consumer default
		  
		  # Revoke and Terminate task in mid-execution
		  celery -A tasks control revoke <task_id> --terminate --signal=SIGKILL
		  ```
	- ## Structured Logging Configurations:
		- Propagating logging details safely:
		- ```python
		  from celery.utils.log import get_task_logger
		  
		  logger = get_task_logger(__name__)
		  
		  @app.task
		  def process_metrics(data):
		      # Tasks should use task-aware loggers to capture execution contexts
		      logger.info("Initializing metrics calculations.")
		      try:
		          # process data...
		          logger.info("Metrics calculation success.")
		      except Exception as exc:
		          logger.error(f"Error calculating metrics: {exc}", exc_info=True)
		  ```
	- ## Security Best Practices:
		- 1. **Avoid dangerous serializers**: Whitelist JSON or Msgpack, never accept Pickle on untrusted public brokers.
			- `accept_content = ['json', 'msgpack']`
		- 2. **Implement Network TLS/SSL**: Protect message transport layers from man-in-the-middle data snooping.
		- 3. **Broker Authentication Policies**: Limit worker user access scopes using virtual hosts (`vhosts`) and read-write ACL settings.
-
- # Testing Celery Applications
	- ## Synchronous Task Testing:
		- You should unit test task function business logic directly by invoking it as a normal python function (without `.delay()` or `.apply_async()`):
		- ```python
		  # test_tasks.py
		  from tasks import add
		  
		  def test_add_business_logic():
		      # Normal synchronous call isolates task logic from Redis/Broker dependencies
		      result = add(4, 4)
		      assert result == 8
		  ```
	- ## Mocking Task Invocations:
		- Mocking delay behaviors in endpoint code to prevent broker calls:
		- ```python
		  from unittest.mock import patch
		  
		  @patch('tasks.send_welcome_email.delay')
		  def test_user_registration_endpoint(mock_delay, test_client):
		      # Post requests triggering task dispatches
		      response = test_client.post('/register', json={"email": "test@app.com"})
		      assert response.status_code == 201
		      
		      # Assert tasks are called with correct parameter payloads
		      mock_delay.assert_called_once_with(12)  # 12 = user_id
		  ```
	- ## Integration Testing with Celery Workers (pytest):
		- Run integration test suites using temporary in-memory workers:
		- ```python
		  import pytest
		  
		  # Configure celery to use temporary eager test modes
		  @pytest.fixture(scope='session')
		  def celery_config():
		      return {
		          'broker_url': 'memory://',
		          'result_backend': 'cache+memory://',
		          'task_always_eager': True,         # Forces local execution of delay()
		          'task_eager_propagates': True      # Propagates exceptions from tasks
		      }
		  
		  def test_workflow_eager(celery_session_app):
		      from tasks import compute_factorial
		      res = compute_factorial.delay(5)
		      assert res.get() == 120
		  ```
-
- # Configuration & CLI Cheat Sheet
	- ## Configuration Settings Mapping:
		- Celery 4.0 renamed configuration properties to lowercase. Standard legacy mappings:
		- | Legacy Setting (Uppercase) | Modern Setting (Lowercase) | Default Value |
		  | :--- | :--- | :--- |
		  | `BROKER_URL` | `broker_url` | `None` |
		  | `CELERY_RESULT_BACKEND` | `result_backend` | `None` |
		  | `CELERYD_CONCURRENCY` | `worker_concurrency` | CPU core count |
		  | `CELERYD_PREFETCH_MULTIPLIER`| `worker_prefetch_multiplier` | `4` |
		  | `CELERY_TASK_SERIALIZER` | `task_serializer` | `json` |
		  | `CELERY_ACKS_LATE` | `task_acks_late` | `False` |
	- ## Core CLI Command Cheat Sheet:
		- | Command | Description |
		  | :--- | :--- |
		  | `celery -A app_module worker --loglevel=info` | Start worker daemon. |
		  | `celery -A app_module beat --loglevel=info` | Start beat cron scheduler. |
		  | `celery -A app_module worker -B --loglevel=info` | Start worker + scheduler in single process (Dev only). |
		  | `celery -A app_module inspect active` | List running tasks. |
		  | `celery -A app_module inspect scheduled` | List tasks waiting to run on count/ETA. |
		  | `celery -A app_module inspect reserved` | List tasks prefetched by worker. |
		  | `celery -A app_module control revoke <task_id> -t -s SIGKILL` | Force terminate a running task. |
		  | `celery -A app_module purge` | Purge all broker queues (delete outstanding messages). |
-
- # More Learn
	Explore the following links for valuable resources and tools:
	- ## Official Resources:
		- [Celery Documentation](https://docs.celeryproject.org/en/stable/)
		- [Celery Github Repository](https://github.com/celery/celery)
	- ## Guides & Tools:
		- [[Django]] — Learn how to integrate Celery with Django web framework.
		- [[FastAPI]] — Learn how to use Celery for background tasks in FastAPI.
		- [[Flask]] — Integrate Celery with Flask application contexts.