---
seoTitle: systemd – Complete System & Service Manager Guide for Linux
description: "In-depth systemd guide covering architecture, unit file structure, systemctl, journalctl, timers (cron replacement), socket activation, and production hardening."
keywords: "systemd, systemctl, journalctl, systemd service, systemd timer, socket activation, systemd-resolved, systemd-networkd, linux init, pid 1, RHEL, Ubuntu, Arch Linux, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: systemd — System and Service Manager
treeTitle: OS - Linux Distros - systemd
enableToc: true
---

- # Introduction to systemd
	- **systemd** is the software suite that provides fundamental building blocks for a Linux operating system. Chiefly, it runs as **PID 1** (the init system) and acts as a system and service manager.
	- It was designed to replace the traditional System V init system, introducing parallel service startup, socket/bus activation, cgroup resource tracking, and unified logging.
	- Almost all major modern Linux distributions use systemd as their default init system (including Ubuntu, Debian, Fedora, Arch Linux, and RHEL).
	-
	- ## systemd Architecture
		- ```mermaid
		  graph TD
		      Kernel["Linux Kernel"]
		      PID1["systemd (PID 1)\nSystem and Service Manager"]
		      Units["Units (.service .socket .timer .target .mount)"]
		      Services["Services (nginx, sshd, docker)"]  
		      Sockets["Socket Activation"]
		      Timers["Timers (cron replacement)"]
		      Journal["journald — unified logging"]
		      Resolve["systemd-resolved — DNS"]
		      Network["systemd-networkd — networking"]
		      Kernel --> PID1 --> Units
		      Units --> Services
		      Units --> Sockets
		      Units --> Timers
		      PID1 --> Journal
		      PID1 --> Resolve
		      PID1 --> Network
		  ```
	-
	- ## Advantages & Disadvantages
		- | Pros | Cons |
		  |------|------|
		  | Fast, parallel boot times using socket activation | Complex and monolithic (opinionated scope) |
		  | Unified logging via binary logs (`journald`) | Binary logs can be corrupted easier than text |
		  | Native process resource tracking with cgroups | Harder to debug when low-level failures occur |
		  | Hardened sandboxing options built into unit files | Violates the Unix philosophy of doing "one thing well" |
- # systemctl — Service & System Control
	- The `systemctl` command is the primary tool for inspecting and controlling the state of the systemd system and service manager.
	-
	- ## Service Lifecycle Management
		- ```bash title="Basic service control"
		  systemctl start myapp            # start a service immediately
		  systemctl stop myapp             # stop a service immediately
		  systemctl restart myapp          # stop and start a service
		  systemctl reload myapp           # send HUP signal to reload configuration
		  systemctl status myapp           # inspect service state and recent logs
		  ```
	-
	- ## Boot Management (Enable/Disable)
		- Enabling a service creates a symbolic link in the appropriate `.wants` directory under `/etc/systemd/system/`.
		- ```bash title="Boot settings"
		  systemctl enable myapp           # enable service to start at boot
		  systemctl disable myapp          # disable service from starting at boot
		  systemctl enable --now myapp     # enable at boot + start immediately
		  systemctl is-active myapp        # returns active/inactive state
		  systemctl is-enabled myapp       # check if enabled to start at boot
		  systemctl mask myapp             # prevent service from starting (even manually)
		  systemctl unmask myapp           # allow service to start again
		  ```
	-
	- ## System State & Performance Analysis
		- ```bash title="Analyzing system state"
		  systemctl list-units --type=service  # list all loaded active services
		  systemctl list-units --failed        # list all failed units
		  systemctl list-unit-files            # list all installed unit files and enablement state
		  systemctl list-timers                # list all active systemd timers
		  systemctl daemon-reload              # reload systemd after modifying unit files
		  ```
		- ```bash title="Analyze boot performance"
		  systemd-analyze                      # show total boot time breakdown
		  systemd-analyze blame                # list units sorted by boot time overhead
		  systemd-analyze critical-chain       # show critical chain of boot dependencies
		  systemd-analyze plot > boot.svg      # generate SVG graph of startup timeline
		  ```
- # Unit File Reference
	- Unit files tell systemd how to manage resources. They are typically located in:
		- `/lib/systemd/system/` (system default units, do not edit directly)
		- `/etc/systemd/system/` (administrator-defined custom units, takes priority)
	-
	- ## Production-Hardened Service Example
		- ```ini title="/etc/systemd/system/myapp.service"
		  [Unit]
		  Description=My Production Application Server
		  Documentation=https://example.com/docs
		  After=network-online.target postgresql.service
		  Requires=postgresql.service
		  Wants=redis.service
		  
		  [Service]
		  Type=notify                       # expects sd_notify() API call when fully started
		  # Type choices: simple (default), forking, oneshot, dbus, notify, idle
		  
		  User=myapp
		  Group=myapp
		  WorkingDirectory=/opt/myapp
		  
		  # Execution paths
		  ExecStartPre=/opt/myapp/bin/check-config.sh
		  ExecStart=/opt/myapp/bin/server --port 8080
		  ExecReload=/bin/kill -HUP $MAINPID
		  ExecStop=/opt/myapp/bin/server --stop
		  
		  # Process supervision & restart behavior
		  Restart=on-failure
		  RestartSec=5
		  StartLimitIntervalSec=60
		  StartLimitBurst=3
		  
		  # Resource Limits (cgroups)
		  LimitNOFILE=65536
		  LimitNPROC=512
		  MemoryMax=1G
		  CPUQuota=200%                     # Restrict process to maximum 2 CPU cores
		  
		  # Security Sandboxing & Hardening
		  NoNewPrivileges=yes               # Prevent child processes from gaining privileges
		  PrivateTmp=yes                    # Mounts private /tmp directory separate from host
		  PrivateDevices=yes                # Blocks access to physical hardware devices
		  ProtectSystem=strict              # Mount OS directory structure read-only
		  ProtectHome=yes                   # Blocks access to /home, /root, /run/user
		  ReadWritePaths=/var/lib/myapp /var/log/myapp  # White-listed directories for writing
		  CapabilityBoundingSet=CAP_NET_BIND_SERVICE   # Limit kernel capabilities
		  AmbientCapabilities=CAP_NET_BIND_SERVICE
		  
		  # Environment Variables
		  Environment=NODE_ENV=production
		  EnvironmentFile=/etc/myapp/env
		  
		  [Install]
		  WantedBy=multi-user.target        # Symlink created in multi-user.target.wants on enable
		  ```
- # journalctl — Log Management
	- `journald` is systemd's built-in logging daemon. It collects system log messages, kernel log messages, stdout/stderr from services, and stores them in a structured binary format.
	-
	- ## Common Queries
		- ```bash title="Querying logs"
		  journalctl                       # view all logs (from oldest to newest)
		  journalctl -f                    # follow logs in real-time (like tail -f)
		  journalctl -u nginx              # filter logs for a specific service
		  journalctl -u nginx -f           # follow logs for a specific service
		  journalctl -n 50                 # show only the last 50 log lines
		  journalctl -p err                # show only error priority logs and above
		  journalctl -p warning..err       # show warning to error priority logs
		  ```
	-
	- ## Filtering by Time and Boot
		- ```bash title="Time and boot filtering"
		  journalctl --since "1 hour ago"
		  journalctl --since "2026-06-01" --until "2026-06-04 12:00:00"
		  journalctl -b                    # show logs from the current boot only
		  journalctl -b -1                 # show logs from the previous boot
		  journalctl -b --list-boots       # list all recorded boots and indexes
		  journalctl -k                    # show kernel messages only (dmesg alternative)
		  ```
	-
	- ## Storage & Maintenance
		- ```bash title="Managing journal size"
		  journalctl --disk-usage          # show total size of journal files on disk
		  sudo journalctl --vacuum-size=1G # clean up logs to reduce total size to 1GB
		  sudo journalctl --vacuum-time=30d # remove logs older than 30 days
		  ```
	-
	- ## Exporting Logs
		- ```bash title="Exporting journal logs"
		  journalctl -o json-pretty        # print logs in structured JSON format
		  journalctl -u nginx -o json | jq . # pipe JSON log stream into jq
		  ```
- # Timers (cron Replacement)
	- Systemd timers (`.timer` files) control `.service` files. They are a modern, robust replacement for cron jobs with built-in resource control, dependency checking, and execution safety.
	- A timer file named `backup.timer` automatically triggers a service file named `backup.service` unless explicitly configured otherwise.
	-
	- ## Timer Configuration Example
		- ```ini title="/etc/systemd/system/backup.timer"
		  [Unit]
		  Description=Run daily backup at 2 AM
		  
		  [Timer]
		  OnCalendar=*-*-* 02:00:00        # run daily at 2:00 AM
		  # OnCalendar=weekly              # alternate: once a week
		  # OnCalendar=Mon,Thu 10:30       # alternate: Mondays and Thursdays at 10:30 AM
		  # OnBootSec=5min                 # run 5 minutes after system bootup
		  # OnUnitActiveSec=1h             # run 1 hour after the service was last activated
		  AccuracySec=1min                 # allow execution window drift (saves battery/CPU)
		  Persistent=true                  # run immediately if missed due to system downtime
		  
		  [Install]
		  WantedBy=timers.target
		  ```
	-
	- ## Triggered Service Example
		- ```ini title="/etc/systemd/system/backup.service"
		  [Unit]
		  Description=Backup Database Service
		  
		  [Service]
		  Type=oneshot                      # run the command and exit immediately
		  ExecStart=/usr/local/bin/backup.sh
		  User=backup
		  ```
	-
	- ## Control Timers
		- ```bash title="Starting and viewing timers"
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now backup.timer
		  systemctl list-timers            # list all active timers and next run time
		  ```
- # Socket Activation
	- Socket activation is a powerful feature where systemd listens on a socket (IP port or Unix socket) on behalf of a service.
	- When a connection request arrives, systemd automatically spawns the service process and passes the socket file descriptor to it.
	-
	- ## Advantages
		- **On-demand starting**: Idle services do not consume system memory or CPU.
		- **Parallelization**: Multiple sockets can be opened simultaneously during boot.
		- **Zero-downtime restarts**: While a service is restarting, incoming requests queue in the socket file descriptor inside the kernel, avoiding dropped connections.
	-
	- ## Socket Configuration Example
		- ```ini title="/etc/systemd/system/myapp.socket"
		  [Unit]
		  Description=Web Application Socket Listener
		  
		  [Socket]
		  ListenStream=8080                 # TCP Port to listen on
		  # ListenDatagram=9000            # UDP alternative
		  # ListenLocal=/run/myapp.sock    # Unix socket alternative
		  Accept=no                         # Keep systemd listening, pass connection to one process
		  
		  [Install]
		  WantedBy=sockets.target
		  ```
	-
	- ## Matching Service Example
		- ```ini title="/etc/systemd/system/myapp.service"
		  [Unit]
		  Description=Web Application Server
		  Requires=myapp.socket
		  
		  [Service]
		  ExecStart=/opt/myapp/bin/server  # expects socket fd from systemd
		  User=myapp
		  ```
	-
	- ## Control Sockets
		- ```bash title="Enable and test socket activation"
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now myapp.socket
		  # myapp.service will stay inactive until you connect to port 8080:
		  curl http://localhost:8080
		  systemctl status myapp.service   # will show active (running)
		  ```
- # Related Notes
	- [[Linux Advanced]] — General kernel internals, system calls, and tuning
	- [[Cybersecurity]] — Security policy auditing and defensive concepts
	- [[Docker]] — Container runtime virtualization and namespaces
	- [[Kubernetes]] — Orchestrated container nodes and microservices