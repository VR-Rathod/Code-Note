---
seoTitle: Linux Advanced Guide – Kernel, Internals, Networking & Hardening
description: "Advanced Linux reference covering kernel internals, system calls, memory management, process scheduling, networking stack, filesystem internals, performance tuning, and security hardening."
keywords: "linux advanced, linux kernel, linux internals, linux system calls, linux memory management, linux networking, linux hardening, linux performance, linux security, linux administration advanced, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Linux Advanced – Kernel, Internals & Security
enableToc: true
treeTitle: OS - Linux Advanced
---

- > [!info] Prerequisites
- > This page assumes familiarity with basic Linux commands.
- > See [[Kali Linux]] for fundamentals and [[Ubuntu]] for desktop/server basics.
- # Kernel Internals
  collapsed:: true
	- ## What is the Linux Kernel?
		- The kernel is the **core of the OS** — it manages hardware, processes, memory, and I/O.
		- Monolithic kernel with **loadable kernel modules (LKM)** — best of both worlds.
		- Written in **C** (and some Assembly for architecture-specific code).
		- Source: [kernel.org](https://kernel.org)
		  
		  ```mermaid
		  graph TD
		    HW["🖥️ Hardware\nCPU · RAM · Disk · Network · GPU"]
		    KM["Kernel Mode (Ring 0)\nFull hardware access"]
		    UM["User Mode (Ring 3)\nRestricted — apps run here"]
		    SC["System Call Interface\nsyscall / int 0x80"]
		    HW --> KM
		    KM --> SC
		    SC --> UM
		  ```
	- ## Kernel Subsystems
		- | Subsystem | Responsibility |
		  |-----------|---------------|
		  | Process Scheduler | Decides which process runs on CPU and when |
		  | Memory Manager | Virtual memory, paging, swapping, OOM killer |
		  | VFS (Virtual File System) | Unified interface for all filesystems |
		  | Network Stack | TCP/IP implementation, socket layer |
		  | Device Drivers | Hardware abstraction (block, char, network) |
		  | IPC | Inter-process communication (pipes, signals, sockets, shared mem) |
		  | Security (LSM) | Linux Security Modules — SELinux, AppArmor hooks |
	- ## Kernel Version & Info
	  ```bash title="Kernel information commands"
	  uname -r                        # kernel version (e.g. 6.5.0-45-generic)
	  uname -a                        # full info: kernel + arch + hostname
	  cat /proc/version               # kernel version + compiler
	  cat /proc/sys/kernel/osrelease  # release string
	  ls /boot/vmlinuz*               # installed kernels
	  dmesg | head -50                # kernel ring buffer (boot messages)
	  dmesg -T | grep -i error        # kernel errors with timestamps
	  journalctl -k                   # kernel messages via systemd
	  ```
	- ## Kernel Modules (LKM)
	  ```bash title="Kernel module management"
	  lsmod                           # list loaded modules
	  modinfo module_name             # module details (author, params, deps)
	  sudo modprobe module_name       # load module (with deps)
	  sudo modprobe -r module_name    # unload module
	  sudo insmod module.ko           # load specific .ko file
	  sudo rmmod module_name          # remove module
	  cat /proc/modules               # loaded modules (raw)
	  ls /lib/modules/$(uname -r)/    # available modules
	  depmod -a                       # rebuild module dependency map
	  # Blacklist a module (prevent loading):
	  echo "blacklist nouveau" | sudo tee /etc/modprobe.d/blacklist-nouveau.conf
	  ```
	- ## Kernel Parameters (sysctl)
	  ```bash title="sysctl — kernel runtime parameters"
	  sysctl -a                       # list all parameters
	  sysctl net.ipv4.ip_forward      # check IP forwarding
	  sudo sysctl -w net.ipv4.ip_forward=1  # enable IP forwarding (temp)
	  # Permanent: add to /etc/sysctl.conf or /etc/sysctl.d/99-custom.conf
	  sudo sysctl -p                  # reload sysctl config
	  ```
		- | Parameter | Purpose | Recommended Value |
		  |-----------|---------|------------------|
		  | `net.ipv4.ip_forward` | Enable IP routing | `1` (router) / `0` (host) |
		  | `net.ipv4.tcp_syncookies` | SYN flood protection | `1` |
		  | `kernel.randomize_va_space` | ASLR | `2` (full) |
		  | `net.ipv4.conf.all.rp_filter` | Reverse path filtering | `1` |
		  | `net.ipv4.conf.all.accept_redirects` | ICMP redirects | `0` |
		  | `kernel.dmesg_restrict` | Restrict dmesg to root | `1` |
		  | `vm.swappiness` | Swap aggressiveness | `10` (SSD) |
		  | `fs.file-max` | Max open file descriptors | `2097152` |
-
- # System Calls & Process Internals
  collapsed:: true
	- ## What are System Calls?
		- The interface between **user space** and **kernel space**.
		- When a program needs kernel services (read file, create process, allocate memory), it makes a syscall.
		- Linux has ~350+ system calls defined in `<sys/syscall.h>`.
		  
		  ```mermaid
		  sequenceDiagram
		    participant App as 🖥️ User App
		    participant Lib as 📚 glibc (libc)
		    participant SC as 🔀 Syscall Interface
		    participant K as ⚙️ Kernel
		    App->>Lib: printf() / fopen() / malloc()
		    Lib->>SC: syscall(SYS_write, ...) / int 0x80
		    SC->>K: Switches to Ring 0
		    K->>SC: Executes + returns result
		    SC->>Lib: Returns to Ring 3
		    Lib->>App: Returns result
		  ```
	- ## Common System Calls
		- | Syscall | Number | Description |
		  |---------|--------|-------------|
		  | `read` | 0 | Read from file descriptor |
		  | `write` | 1 | Write to file descriptor |
		  | `open` | 2 | Open a file |
		  | `close` | 3 | Close a file descriptor |
		  | `stat` | 4 | Get file status |
		  | `mmap` | 9 | Map memory |
		  | `brk` | 12 | Change data segment size |
		  | `fork` | 57 | Create child process |
		  | `execve` | 59 | Execute a program |
		  | `exit` | 60 | Terminate process |
		  | `socket` | 41 | Create network socket |
		  | `connect` | 42 | Connect socket to address |
		  | `clone` | 56 | Create thread/process |
	- ## Tracing System Calls
	  ```bash title="strace — trace system calls"
	  strace ls                           # trace all syscalls of ls
	  strace -e trace=open,read ls        # trace specific syscalls
	  strace -p 1234                      # attach to running process
	  strace -o output.txt ls             # save to file
	  strace -c ls                        # count + summarize syscalls
	  strace -f ./program                 # follow child processes
	  ltrace ./program                    # trace library calls (libc)
	  ```
	- ## Process Lifecycle
	  ```mermaid
	  graph LR
	     NEW["New\nProcess created\nfork() / clone()"]
	     READY["Ready\nWaiting for CPU\nIn run queue"]
	     RUN["Running\nOn CPU\nexecve()"]
	     WAIT["Waiting\nBlocked on I/O\nor signal"]
	     ZOMBIE["Zombie\nExited, parent\nnot called wait()"]
	     DEAD["Dead\nParent called wait()\nPCB freed"]
	     NEW --> READY --> RUN
	     RUN --> WAIT --> READY
	     RUN --> ZOMBIE --> DEAD
	  ```
	- ## Process Information
	  ```bash title="Process inspection"
	  ps aux                          # all processes
	  ps -ef --forest                 # process tree with parent info
	  pstree -p                       # visual tree with PIDs
	  cat /proc/1234/status           # process status (PID 1234)
	  cat /proc/1234/maps             # memory map of process
	  cat /proc/1234/fd/              # open file descriptors
	  cat /proc/1234/cmdline          # command line arguments
	  cat /proc/1234/environ          # environment variables
	  ls -la /proc/1234/exe           # executable path
	  lsof -p 1234                    # open files by PID
	  lsof -i :80                     # process using port 80
	  ```
	- ## Signals
		- | Signal | Number | Default Action | Description |
		  |--------|--------|---------------|-------------|
		  | SIGHUP | 1 | Terminate | Hangup (reload config) |
		  | SIGINT | 2 | Terminate | Interrupt (Ctrl+C) |
		  | SIGQUIT | 3 | Core dump | Quit (Ctrl+\\) |
		  | SIGKILL | 9 | Terminate | **Cannot be caught or ignored** |
		  | SIGSEGV | 11 | Core dump | Segmentation fault |
		  | SIGTERM | 15 | Terminate | Graceful termination (default kill) |
		  | SIGSTOP | 19 | Stop | **Cannot be caught or ignored** |
		  | SIGCONT | 18 | Continue | Resume stopped process |
		  | SIGUSR1 | 10 | Terminate | User-defined signal 1 |
		  | SIGUSR2 | 12 | Terminate | User-defined signal 2 |
		  
		  ```bash title="Signal commands"
		  kill -l                         # list all signals
		  kill -15 1234                   # SIGTERM (graceful)
		  kill -9 1234                    # SIGKILL (force)
		  kill -HUP 1234                  # SIGHUP (reload)
		  killall -9 nginx                # kill all by name
		  pkill -f "python script.py"     # kill by pattern
		  trap 'echo "Caught SIGINT"' INT # trap signal in bash script
		  ```
-
- # Memory Management
  collapsed:: true
	- ## Virtual Memory Architecture
	  ```mermaid
	  graph TD
	     subgraph VM["Virtual Address Space (per process)"]
	         K["Kernel Space\n(top, shared across all processes)"]
	         S["Stack\n(grows downward)\nLocal vars, return addresses"]
	         M["Memory-mapped files\nmmap() region"]
	         H["Heap\n(grows upward)\nmalloc() / new"]
	         BSS["BSS Segment\nUninitialized global vars"]
	         DATA["Data Segment\nInitialized global vars"]
	         TEXT["Text Segment\nProgram code (read-only)"]
	     end
	  ```
	- ## Memory Concepts
		- | Concept | Description |
		  |---------|-------------|
		  | Virtual Memory | Each process has its own address space — isolated from others |
		  | Physical Memory | Actual RAM — managed by kernel page allocator |
		  | Page | Fixed-size block (4KB default) — unit of memory management |
		  | Page Table | Maps virtual addresses → physical addresses |
		  | TLB | Translation Lookaside Buffer — cache for page table lookups |
		  | Swap | Disk space used when RAM is full — slow |
		  | OOM Killer | Kernel kills processes when RAM is exhausted |
		  | ASLR | Address Space Layout Randomization — randomizes memory layout |
		  | NX/XD bit | No-Execute bit — prevents code execution in data pages |
		  | SMEP/SMAP | Supervisor Mode Execution/Access Prevention |
	- ## Memory Commands
	  ```bash title="Memory analysis"
	  free -h                         # RAM + swap usage
	  cat /proc/meminfo               # detailed memory info
	  vmstat -s                       # memory statistics
	  vmstat 1 5                      # virtual memory stats every 1s, 5 times
	  slabtop                         # kernel slab cache usage
	  cat /proc/buddyinfo             # buddy allocator info
	  # Per-process memory
	  cat /proc/1234/status | grep -i vm   # virtual memory stats
	  pmap 1234                       # memory map of process
	  pmap -x 1234                    # extended map with RSS
	  # Find memory hogs
	  ps aux --sort=-%mem | head -10
	  ```
	- ## Memory Security Features
	  ```bash title="Check memory security features"
	  # Check ASLR
	  cat /proc/sys/kernel/randomize_va_space
	  # 0=disabled  1=partial  2=full (recommended)
	  
	  # Check if binary has security features
	  checksec --file=/usr/bin/ls     # requires checksec tool
	  # Or: readelf -l binary | grep GNU_STACK
	  # Or: hardening-check binary    # Debian/Ubuntu
	  
	  # ASLR + PIE + Stack Canary + NX + RELRO
	  ```
	- ## /proc Filesystem
	  ```bash title="/proc — virtual filesystem for kernel/process info"
	  cat /proc/cpuinfo               # CPU details
	  cat /proc/meminfo               # memory details
	  cat /proc/loadavg               # load average (1/5/15 min)
	  cat /proc/uptime                # uptime in seconds
	  cat /proc/net/tcp               # TCP connections (hex)
	  cat /proc/net/if_inet6          # IPv6 interfaces
	  cat /proc/sys/                  # sysctl parameters
	  ls /proc/                       # numbered dirs = running PIDs
	  cat /proc/self/maps             # current process memory map
	  ```
-
- # Linux Networking Deep Dive
  collapsed:: true
	- > [!info] Networking Context
	  > This covers kernel-level networking. For firewall automation in pipelines see [[DevOps]]. For packet-level attack/defense see [[Cybersecurity]] and [[Ethical Hacking Advanced]].
	- ## Network Stack Architecture
	  ```mermaid
	  graph TD
	     APP["Application Layer\nsocket() · bind() · connect() · send() · recv()"]
	     SOCK["Socket Layer\nAF_INET · AF_UNIX · AF_NETLINK"]
	     TCP["Transport Layer\nTCP (reliable) · UDP (fast)"]
	     IP["Network Layer\nIP routing · ICMP · Netfilter/iptables"]
	     DRV["Device Driver\neth0 · wlan0 · lo"]
	     HW["Network Hardware\nNIC · Wi-Fi card"]
	     APP --> SOCK --> TCP --> IP --> DRV --> HW
	  ```
	- ## Socket Programming Concepts
		- | Socket Type | Protocol | Use Case |
		  |-------------|---------|---------|
		  | `SOCK_STREAM` | TCP | Reliable, ordered, connection-based |
		  | `SOCK_DGRAM` | UDP | Fast, connectionless, no guarantee |
		  | `SOCK_RAW` | Raw IP | Custom protocol, packet crafting |
		  | `AF_UNIX` | Unix domain | IPC on same machine (faster than TCP) |
		  | `AF_NETLINK` | Netlink | Kernel ↔ userspace communication |
	- ## Advanced Network Commands
	  ```bash title="Advanced networking tools"
	  # ip — modern replacement for ifconfig/route
	  ip addr show                    # all interfaces + IPs
	  ip addr add 192.168.1.100/24 dev eth0
	  ip addr del 192.168.1.100/24 dev eth0
	  ip link set eth0 up/down
	  ip link set eth0 mtu 9000       # jumbo frames
	  ip route show                   # routing table
	  ip route add 10.0.0.0/8 via 192.168.1.1
	  ip route del 10.0.0.0/8
	  ip neigh show                   # ARP table
	  ip neigh flush dev eth0         # flush ARP cache
	  
	  # ss — socket statistics (replaces netstat)
	  ss -tulnp                       # TCP+UDP listening + process
	  ss -s                           # socket summary
	  ss -tp                          # TCP connections + process
	  ss -o state established         # established connections
	  ss 'dport = :80'                # filter by destination port
	  
	  # Network performance
	  iperf3 -s                       # start iperf server
	  iperf3 -c server_ip             # test bandwidth to server
	  iperf3 -c server_ip -u -b 100M  # UDP test at 100Mbps
	  mtr --report google.com         # traceroute + packet loss report
	  ```
	- ## iptables / nftables (Firewall)
	  ```bash title="iptables — Linux firewall"
	  # View rules
	  iptables -L -n -v               # list all rules
	  iptables -L INPUT -n -v         # INPUT chain only
	  iptables -t nat -L -n -v        # NAT table
	  
	  # Basic rules
	  iptables -A INPUT -p tcp --dport 22 -j ACCEPT   # allow SSH
	  iptables -A INPUT -p tcp --dport 80 -j ACCEPT   # allow HTTP
	  iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
	  iptables -A INPUT -j DROP       # drop everything else
	  
	  # NAT / Masquerading (router setup)
	  iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
	  echo 1 > /proc/sys/net/ipv4/ip_forward
	  
	  # Port forwarding
	  iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080
	  
	  # Save/restore rules
	  iptables-save > /etc/iptables/rules.v4
	  iptables-restore < /etc/iptables/rules.v4
	  
	  # nftables (modern replacement)
	  nft list ruleset
	  nft add rule inet filter input tcp dport 22 accept
	  ```
	- ## Network Namespaces (Containers/VMs)
	  ```bash title="Network namespaces"
	  ip netns list                   # list namespaces
	  ip netns add myns               # create namespace
	  ip netns exec myns bash         # run shell in namespace
	  ip netns exec myns ip addr      # run command in namespace
	  ip link add veth0 type veth peer name veth1  # virtual ethernet pair
	  ip link set veth1 netns myns    # move veth1 to namespace
	  # This is how Docker creates isolated networks
	  ```
	- ## TCP Deep Dive
	  ```mermaid
	  sequenceDiagram
	     participant C as Client
	     participant S as Server
	     Note over C,S: 3-Way Handshake (Connection Setup)
	     C->>S: SYN (seq=x)
	     S->>C: SYN-ACK (seq=y, ack=x+1)
	     C->>S: ACK (ack=y+1)
	     Note over C,S: Data Transfer
	     C->>S: Data
	     S->>C: ACK
	     Note over C,S: 4-Way Teardown (Connection Close)
	     C->>S: FIN
	     S->>C: ACK
	     S->>C: FIN
	     C->>S: ACK
	  ```
		- | TCP State | Description |
		  |-----------|-------------|
		  | LISTEN | Server waiting for connections |
		  | SYN_SENT | Client sent SYN, waiting for SYN-ACK |
		  | SYN_RECEIVED | Server received SYN, sent SYN-ACK |
		  | ESTABLISHED | Connection active, data transfer |
		  | FIN_WAIT_1 | Sent FIN, waiting for ACK |
		  | TIME_WAIT | Waiting to ensure remote received ACK (2×MSL) |
		  | CLOSE_WAIT | Received FIN, waiting for app to close |
-
- # Filesystem Internals
  collapsed:: true
	- ## Inode Architecture
	  ```mermaid
	  graph LR
	     FN["Filename\n(directory entry)"]
	     IN["Inode\nMetadata: size, permissions\ntimestamps, owner, block pointers"]
	     B1["Data Block 1"]
	     B2["Data Block 2"]
	     B3["Data Block N"]
	     FN --> IN --> B1
	     IN --> B2
	     IN --> B3
	  ```
	  
	  > [!info] Key Inode Facts
	  > - Filename is stored in the **directory**, not the inode
	  > - Hard links share the same inode — deleting one doesn't delete data
	  > - Symbolic links have their own inode pointing to a path string
	  > - `stat file` shows inode number, permissions, timestamps, link count
	- ## Filesystem Types
		- | Filesystem | Features | Use Case |
		  |-----------|---------|---------|
		  | ext4 | Journaling, extents, 1EB max | Default Linux FS |
		  | XFS | High performance, parallel I/O | Large files, databases |
		  | Btrfs | Copy-on-write, snapshots, RAID | Modern workloads |
		  | ZFS | Enterprise, checksums, dedup | NAS, servers |
		  | tmpfs | RAM-based, volatile | /tmp, /run |
		  | overlayfs | Layered FS | Docker containers |
		  | NFS | Network filesystem | Shared storage |
		  | FUSE | Userspace filesystem | Custom FS implementations |
	- ## Filesystem Commands
	  ```bash title="Filesystem inspection and management"
	  # Filesystem info
	  df -hT                          # disk usage + filesystem type
	  du -sh /* 2>/dev/null | sort -rh | head -20
	  lsblk -f                        # block devices + filesystems
	  blkid                           # UUIDs + filesystem types
	  tune2fs -l /dev/sda1            # ext4 filesystem info
	  xfs_info /dev/sda1              # XFS filesystem info
	  dumpe2fs /dev/sda1 | head -50   # ext4 superblock info
	  
	  # Inode info
	  stat file.txt                   # inode, permissions, timestamps
	  ls -i file.txt                  # show inode number
	  df -i                           # inode usage per filesystem
	  find / -inum 12345              # find file by inode number
	  
	  # Filesystem check + repair
	  sudo fsck -n /dev/sdb1          # check without fixing
	  sudo fsck -y /dev/sdb1          # auto-fix (unmounted only)
	  sudo e2fsck -f /dev/sdb1        # force check ext4
	  
	  # Mount options
	  mount -o remount,ro /           # remount root read-only
	  mount -o noexec,nosuid /tmp     # security mount options
	  cat /proc/mounts                # currently mounted filesystems
	  ```
	- ## Advanced File Operations
	  ```bash title="Advanced file operations"
	  # Hard vs Symbolic links
	  ln file.txt hardlink            # hard link (same inode)
	  ln -s /path/to/file symlink     # symbolic link (different inode)
	  readlink -f symlink             # resolve symlink to real path
	  
	  # File attributes (ext4)
	  lsattr file.txt                 # list attributes
	  chattr +i file.txt              # immutable (even root can't delete)
	  chattr -i file.txt              # remove immutable
	  chattr +a file.txt              # append-only
	  
	  # Extended attributes
	  getfattr -d file.txt            # get extended attributes
	  setfattr -n user.comment -v "my note" file.txt
	  
	  # Sparse files
	  dd if=/dev/zero of=sparse.img bs=1 count=0 seek=1G  # 1GB sparse file
	  ls -lh sparse.img               # shows 1GB
	  du -sh sparse.img               # shows actual disk usage (tiny)
	  
	  # File descriptor limits
	  ulimit -n                       # current open file limit
	  ulimit -n 65536                 # increase for current session
	  cat /proc/sys/fs/file-max       # system-wide max
	  ```
-
- # Performance Analysis & Tuning
  collapsed:: true
	- > [!info] Performance in Production
	  > For production infrastructure automation and observability pipelines see [[DevOps]]. For container-level performance, [[Docker]] and [[Kubernetes]] cgroup limits apply the same kernel primitives shown here.
	- ## Performance Monitoring Stack
	  ```mermaid
	  graph TD
	     APP["Application Metrics\nResponse time · Throughput · Error rate"]
	     SYS["System Metrics\nCPU · Memory · Disk I/O · Network"]
	     KERN["Kernel Metrics\nScheduler · Interrupts · Context switches"]
	     HW["Hardware Metrics\nCPU cycles · Cache misses · Bus bandwidth"]
	     APP --> SYS --> KERN --> HW
	  ```
	- ## CPU Analysis
	  ```bash title="CPU performance analysis"
	  top -d 1                        # real-time, refresh every 1s
	  htop                            # interactive process viewer
	  mpstat -P ALL 1                 # per-CPU stats every 1s
	  sar -u 1 10                     # CPU utilization 10 times
	  pidstat -u 1                    # per-process CPU usage
	  perf top                        # real-time CPU profiling
	  perf stat ./program             # CPU event counts for program
	  perf record ./program && perf report  # flame graph data
	  
	  # Load average interpretation
	  # /proc/loadavg: 1min 5min 15min running/total lastpid
	  # Load = 1.0 on single core = 100% utilized
	  # Load > num_cores = overloaded
	  nproc                           # number of CPU cores
	  cat /proc/cpuinfo | grep "cpu cores" | head -1
	  ```
	- ## Memory Analysis
	  ```bash title="Memory performance analysis"
	  free -h                         # RAM + swap overview
	  vmstat 1 5                      # virtual memory stats
	  # vmstat columns: r=run queue, b=blocked, swpd=swap used
	  # si/so = swap in/out (bad if non-zero)
	  # bi/bo = block in/out (disk I/O)
	  # us/sy/id/wa = user/system/idle/wait
	  
	  sar -r 1 5                      # memory stats
	  slabtop -s c                    # kernel slab cache (sorted by cache size)
	  cat /proc/slabinfo              # raw slab info
	  # Find memory leaks:
	  valgrind --leak-check=full ./program
	  ```
	- ## Disk I/O Analysis
	  ```bash title="Disk I/O analysis"
	  iostat -x 1                     # extended disk stats every 1s
	  # Key columns: %util (saturation), await (latency ms), r/s w/s (IOPS)
	  iotop -o                        # per-process I/O (only active)
	  iotop -a                        # accumulated I/O
	  lsof +D /path                   # processes with files open in dir
	  fio --name=test --rw=randread --bs=4k --size=1G  # disk benchmark
	  
	  # Block device info
	  hdparm -I /dev/sda              # ATA device info
	  hdparm -tT /dev/sda             # disk read speed test
	  nvme smart-log /dev/nvme0       # NVMe health info
	  smartctl -a /dev/sda            # SMART disk health
	  ```
	- ## Network Performance
	  ```bash title="Network performance analysis"
	  sar -n DEV 1 5                  # network interface stats
	  nethogs                         # per-process bandwidth
	  iftop -i eth0                   # per-connection bandwidth
	  nload eth0                      # real-time bandwidth graph
	  ss -s                           # socket statistics summary
	  cat /proc/net/dev               # raw interface stats
	  ethtool eth0                    # NIC info + speed
	  ethtool -S eth0                 # NIC statistics (drops, errors)
	  ```
	- ## System Profiling with perf
	  ```bash title="perf — Linux performance analysis"
	  perf list                       # available events
	  perf stat -e cycles,instructions,cache-misses ./program
	  perf record -g ./program        # record with call graph
	  perf report                     # interactive report
	  perf top -e cache-misses        # real-time cache miss profiling
	  # Flame graphs (requires FlameGraph tool):
	  perf record -F 99 -g -p PID -- sleep 30
	  perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg
	  ```
	- ## Linux Tuning for Production
	  ```bash title="Production server tuning"
	  # /etc/sysctl.d/99-production.conf
	  ```
	  ```ini title="/etc/sysctl.d/99-production.conf"
	  # Network performance
	  net.core.somaxconn = 65535
	  net.core.netdev_max_backlog = 65535
	  net.ipv4.tcp_max_syn_backlog = 65535
	  net.ipv4.tcp_fin_timeout = 15
	  net.ipv4.tcp_keepalive_time = 300
	  net.ipv4.tcp_tw_reuse = 1
	  net.core.rmem_max = 134217728
	  net.core.wmem_max = 134217728
	  
	  # Memory
	  vm.swappiness = 10
	  vm.dirty_ratio = 15
	  vm.dirty_background_ratio = 5
	  
	  # File descriptors
	  fs.file-max = 2097152
	  fs.nr_open = 2097152
	  
	  # Security
	  net.ipv4.tcp_syncookies = 1
	  kernel.randomize_va_space = 2
	  net.ipv4.conf.all.rp_filter = 1
	  ```
-
- # Linux Security Hardening
  collapsed:: true
	- ## Hardening Checklist
	  > [!tip] Linux Server Hardening — Priority Order
	  > 1. Keep system updated (patch management)
	  > 2. Minimize installed packages (reduce attack surface)
	  > 3. Configure firewall (UFW/iptables)
	  > 4. Harden SSH configuration
	  > 5. Enable SELinux or AppArmor
	  > 6. Configure audit logging (auditd)
	  > 7. Set up fail2ban
	  > 8. Disable unnecessary services
	  > 9. Configure file integrity monitoring (AIDE)
	  > 10. Run CIS benchmark audit (Lynis)
	  > 
	  > For broader attack/defense context see [[Cybersecurity]] and [[Ethical Hacking Advanced]].
	- ## SSH Hardening
	  ```ini title="/etc/ssh/sshd_config — hardened configuration"
	  Port 2222                           # change default port
	  Protocol 2                          # SSH2 only
	  PermitRootLogin no                  # never allow root login
	  PasswordAuthentication no           # key-based auth only
	  PubkeyAuthentication yes
	  AuthorizedKeysFile .ssh/authorized_keys
	  MaxAuthTries 3                      # limit auth attempts
	  LoginGraceTime 30                   # 30s to authenticate
	  ClientAliveInterval 300             # disconnect idle after 5min
	  ClientAliveCountMax 2
	  AllowUsers deploy admin             # whitelist users
	  X11Forwarding no                    # disable X11 forwarding
	  AllowTcpForwarding no               # disable TCP forwarding (if not needed)
	  Banner /etc/ssh/banner              # show legal warning banner
	  ```
	- ## SELinux
	  ```bash title="SELinux — Mandatory Access Control"
	  getenforce                      # Enforcing / Permissive / Disabled
	  sestatus                        # detailed SELinux status
	  setenforce 1                    # enable enforcing (temp)
	  setenforce 0                    # permissive mode (temp, for debugging)
	  # Permanent: edit /etc/selinux/config → SELINUX=enforcing
	  
	  # Context management
	  ls -Z file.txt                  # show SELinux context
	  ps -eZ | grep nginx             # process context
	  chcon -t httpd_sys_content_t /var/www/html/  # change context
	  restorecon -Rv /var/www/html/   # restore default context
	  
	  # Troubleshooting
	  ausearch -m avc -ts recent      # recent SELinux denials
	  audit2why < /var/log/audit/audit.log  # explain denials
	  audit2allow -a -M mypolicy      # generate policy from denials
	  semodule -i mypolicy.pp         # install policy module
	  ```
	- ## AppArmor
	  ```bash title="AppArmor — Profile-based MAC"
	  aa-status                       # show status + profiles
	  aa-enforce /etc/apparmor.d/usr.sbin.nginx   # enforce profile
	  aa-complain /etc/apparmor.d/usr.sbin.nginx  # complain mode
	  aa-disable /etc/apparmor.d/usr.sbin.nginx   # disable profile
	  apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx  # reload
	  
	  # Generate profile for new app
	  aa-genprof /usr/bin/myapp       # interactive profile generation
	  aa-logprof                      # update profile from logs
	  ```
	- ## auditd — System Auditing
	  ```bash title="auditd — kernel audit framework"
	  sudo systemctl enable --now auditd
	  auditctl -l                     # list active rules
	  auditctl -s                     # audit system status
	  
	  # Add audit rules
	  auditctl -w /etc/passwd -p wa -k passwd_changes   # watch passwd file
	  auditctl -w /etc/sudoers -p wa -k sudoers_changes
	  auditctl -a always,exit -F arch=b64 -S execve -k exec_commands
	  auditctl -a always,exit -F arch=b64 -S open -F exit=-EACCES -k access_denied
	  
	  # Persistent rules: /etc/audit/rules.d/audit.rules
	  
	  # Search audit logs
	  ausearch -k passwd_changes      # search by key
	  ausearch -m USER_LOGIN -ts today  # today's logins
	  ausearch -ua 1000               # events by UID
	  aureport --summary              # summary report
	  aureport --auth                 # authentication report
	  aureport --failed               # failed events
	  ```
	- ## File Integrity Monitoring (AIDE)
	  ```bash title="AIDE — Advanced Intrusion Detection Environment"
	  sudo apt install aide -y
	  sudo aideinit                   # initialize database (takes time)
	  sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
	  sudo aide --check               # check for changes
	  sudo aide --update              # update database after approved changes
	  
	  # Schedule daily checks
	  echo "0 3 * * * root /usr/bin/aide --check | mail -s 'AIDE Report' admin@example.com" \
	   | sudo tee /etc/cron.d/aide
	  ```
	- ## CIS Benchmark Audit (Lynis)
	  ```bash title="Lynis — security auditing tool"
	  sudo apt install lynis -y
	  sudo lynis audit system         # full system audit
	  sudo lynis audit system --quick # quick scan
	  # Results: /var/log/lynis.log
	  # Hardening index score + recommendations
	  ```
	- ## Privilege Escalation Prevention
	  > [!warning] Common Linux PrivEsc Vectors (for defenders)
	  > Understanding these helps you **close the gaps**. See [[Ethical Hacking Advanced]] for offensive perspective and [[Cybersecurity Architecture]] for defense-in-depth design.
	  
	  ```bash title="Check for common misconfigurations"
	  # SUID binaries (should be minimal)
	  find / -perm -u=s -type f 2>/dev/null
	  
	  # World-writable files (dangerous)
	  find / -perm -o+w -type f 2>/dev/null | grep -v /proc
	  
	  # Cron jobs writable by non-root
	  ls -la /etc/cron* /var/spool/cron/
	  
	  # Sudo permissions
	  sudo -l
	  
	  # Capabilities (can replace SUID)
	  getcap -r / 2>/dev/null
	  
	  # Writable /etc/passwd (critical)
	  ls -la /etc/passwd /etc/shadow
	  
	  # PATH hijacking risk
	  echo $PATH | tr ':' '\n' | xargs ls -ld 2>/dev/null | grep -v "^d..x..x..x"
	  ```
-
- # Advanced Shell & Scripting
  collapsed:: true
	- > [!info] Shell & Scripting
	  > This section covers advanced [[Shell Script]] patterns. For a dedicated scripting reference see [[Shell Script]].
	- ## Bash Advanced Features
	  ```bash title="Advanced bash scripting"
	  # Process substitution
	  diff <(ls dir1) <(ls dir2)
	  while read line; do echo "$line"; done < <(command)
	  
	  # Here documents
	  cat << 'EOF' > script.sh
	  #!/bin/bash
	  echo "This is a heredoc"
	  EOF
	  
	  # Here strings
	  grep "pattern" <<< "string to search"
	  
	  # Brace expansion
	  echo {a,b,c}_{1,2,3}            # a_1 a_2 a_3 b_1 ...
	  mkdir -p project/{src,tests,docs,build}
	  cp file.txt{,.bak}              # backup: file.txt → file.txt.bak
	  
	  # Parameter expansion
	  ${var:-default}                 # use default if var unset
	  ${var:=default}                 # set and use default if unset
	  ${var:?error message}           # error if unset
	  ${#var}                         # length of var
	  ${var#prefix}                   # remove shortest prefix
	  ${var##prefix}                  # remove longest prefix
	  ${var%suffix}                   # remove shortest suffix
	  ${var%%suffix}                  # remove longest suffix
	  ${var/old/new}                  # replace first occurrence
	  ${var//old/new}                 # replace all occurrences
	  ${var^^}                        # uppercase
	  ${var,,}                        # lowercase
	  
	  # Arrays
	  arr=(one two three)
	  echo "${arr[@]}"                # all elements
	  echo "${#arr[@]}"               # length
	  echo "${arr[@]:1:2}"            # slice (index 1, length 2)
	  arr+=("four")                   # append
	  unset arr[1]                    # delete element
	  
	  # Associative arrays (bash 4+)
	  declare -A map
	  map[key]="value"
	  echo "${map[key]}"
	  echo "${!map[@]}"               # all keys
	  ```
	- ## Advanced Text Processing
	  ```bash title="awk, sed, grep advanced"
	  # awk — field processing
	  awk '{print $1, $3}' file                   # print fields 1 and 3
	  awk -F: '{print $1}' /etc/passwd            # custom delimiter
	  awk 'NR==5,NR==10' file                     # print lines 5-10
	  awk '/pattern/{print NR": "$0}' file        # print matching with line numbers
	  awk '{sum+=$1} END{print sum}' file         # sum column 1
	  awk '!seen[$0]++'                           # remove duplicate lines
	  awk '{print NF}' file                       # print field count per line
	  
	  # sed — stream editor
	  sed 's/old/new/g' file                      # replace all
	  sed -i.bak 's/old/new/g' file               # in-place with backup
	  sed -n '5,10p' file                         # print lines 5-10
	  sed '/pattern/d' file                       # delete matching lines
	  sed '/pattern/a\new line after' file        # append after match
	  sed '/pattern/i\new line before' file       # insert before match
	  sed 's/^/  /' file                          # indent all lines
	  sed 's/[[:space:]]*$//' file                # trim trailing whitespace
	  
	  # grep advanced
	  grep -P '\d{3}-\d{4}' file                 # Perl regex
	  grep -o 'pattern' file                     # print only match
	  grep -c 'pattern' file                     # count matches
	  grep -l 'pattern' *.txt                    # files containing match
	  grep -A 3 -B 3 'pattern' file              # 3 lines context
	  grep -E '(error|warning|critical)' log     # multiple patterns
	  ```
	- ## Job Control & Background Processing
	  ```bash title="Job control"
	  command &                       # run in background
	  jobs                            # list background jobs
	  fg %1                           # bring job 1 to foreground
	  bg %1                           # resume job 1 in background
	  Ctrl+Z                          # suspend current job
	  disown %1                       # detach from shell (survives logout)
	  nohup command &                 # immune to hangup signal
	  wait                            # wait for all background jobs
	  
	  # GNU Screen
	  screen -S session_name          # new named session
	  screen -ls                      # list sessions
	  screen -r session_name          # reattach
	  # Inside screen: Ctrl+A d=detach  Ctrl+A c=new window  Ctrl+A n=next
	  
	  # tmux
	  tmux new -s session_name        # new session
	  tmux ls                         # list sessions
	  tmux attach -t session_name     # attach
	  # Inside tmux: Ctrl+B d=detach  Ctrl+B c=new window  Ctrl+B %=split vertical
	  ```
-
- # eBPF — In-Kernel Tracing & Networking
  collapsed:: true
	- [[eBPF]] lets you run sandboxed programs **inside the Linux kernel** without modifying kernel source or loading modules — the modern standard for production observability (Datadog, Pixie), security (Falco, Tetragon), and networking ([[Cilium]], [[Kubernetes]] CNI).
	- Key hook types: `kprobe` (any kernel function), `tracepoint` (stable hooks), `uprobe` (user-space), [[XDP]] (NIC driver — line-rate packet processing), `TC` (ingress/egress), `LSM BPF` (runtime [[Cybersecurity]] enforcement).
	- → Full coverage including BPF maps, CO-RE, libbpf, bpftrace one-liners, and production tooling: [[eBPF]]
-
- # Linux Containers — Kernel Internals
  collapsed:: true
	- > [!info] Containers = Linux Kernel Primitives
	  > A container is NOT a VM. It's an isolated process using **namespaces** (isolation) + **cgroups** (resource limits) + **overlayfs** (layered filesystem).
	  > For Docker usage see [[Docker]]. For orchestration see [[Kubernetes]].
	-
	- ## Namespaces — Process Isolation
		- | Namespace | Isolates | Key Command |
		  |-----------|---------|-------------|
		  | `pid` | Process IDs — container has PID 1 | `unshare --pid --fork --mount-proc bash` |
		  | `net` | Network stack — own interfaces, routes, iptables | `ip netns add myns` |
		  | `mnt` | Mount points — own filesystem view | `unshare --mount bash` |
		  | `uts` | Hostname and domain name | `unshare --uts bash` |
		  | `ipc` | SysV IPC, POSIX message queues | `unshare --ipc bash` |
		  | `user` | UID/GID mapping — root in container ≠ root on host | `unshare --user bash` |
		  | `cgroup` | cgroup root — hides host cgroup tree | kernel 4.6+ |
		  | `time` | Clock offsets (monotonic, boot time) | kernel 5.6+ |
		- ```bash title="Inspect and enter namespaces"
		  ls -la /proc/<PID>/ns/              # all namespaces of a process
		  sudo nsenter -t <PID> --net --pid bash  # enter a container's namespaces
		  sudo ip netns exec myns bash        # run shell in network namespace
		  sudo unshare --pid --fork --mount-proc bash  # new isolated PID namespace
		  ```
	-
	- ## cgroups v2 — Resource Limits
		- ```bash title="cgroups v2 resource control"
		  # Create cgroup and add process
		  sudo mkdir /sys/fs/cgroup/mygroup
		  echo $$ | sudo tee /sys/fs/cgroup/mygroup/cgroup.procs
		  # CPU: 10% of one core (100ms per 1000ms period)
		  echo "100000 1000000" | sudo tee /sys/fs/cgroup/mygroup/cpu.max
		  # Memory: 512 MB hard limit
		  echo $((512*1024*1024)) | sudo tee /sys/fs/cgroup/mygroup/memory.max
		  # I/O: 1 MB/s read on /dev/sda (major:minor = 8:0)
		  echo "8:0 rbps=1048576" | sudo tee /sys/fs/cgroup/mygroup/io.max
		  # Inspect via systemd
		  systemd-cgls              # tree view of all cgroups
		  cat /sys/fs/cgroup/mygroup/memory.current
		  ```
	-
	- ## OverlayFS — Layered Filesystem
		- ```bash title="How Docker image layers work"
		  # lower = read-only base layers  upper = writable container layer
		  sudo mount -t overlay overlay \
		    -o lowerdir=lower,upperdir=upper,workdir=work merged/
		  # Files written in the container go to upper/ only — lower is untouched
		  docker image inspect ubuntu:22.04 | jq '.[0].GraphDriver'
		  ls /var/lib/docker/overlay2/   # inspect layer directories
		  ```
	-
	- ## Build a Container from Scratch
		- ```bash title="Minimal container using only kernel primitives"
		  debootstrap focal /tmp/rootfs http://archive.ubuntu.com/ubuntu
		  sudo unshare --pid --fork --mount-proc --net --uts --ipc \
		    chroot /tmp/rootfs /bin/bash
		  # Now inside: ps aux shows only your processes, empty network stack
		  ```
	-
	- ## seccomp — Syscall Allowlist
		- ```bash title="seccomp profile inspection"
		  cat /etc/docker/seccomp.json | jq '.syscalls | length'  # Docker's default profile
		  docker run --security-opt seccomp=my-profile.json ubuntu
		  cat /proc/$(pgrep nginx)/status | grep Seccomp  # 0=off 1=strict 2=filter
		  ```
		- > [!tip] See Also
		  > [[Docker]] — full container management, Dockerfile, multi-stage builds, volumes, networking.
		  > [[Kubernetes]] — container orchestration, pods, services, namespaces, RBAC, Helm.
		  > [[eBPF]] — `LSM BPF` and `seccomp-bpf` for advanced runtime security policies.
-
- # systemd — System and Service Manager
  collapsed:: true
	- > [!info] systemd is PID 1
	  > systemd is the standard init system and service manager for all major Linux distributions (Ubuntu, Debian, Fedora, Arch, RHEL).
	  > It manages services, sockets, mount points, and timers, and handles logging via `journald`.
	- Key components: `systemctl` (service control), `journalctl` (centralized logging), systemd unit files (`.service`, `.timer`, `.socket`), socket activation, and boot performance analysis (`systemd-analyze`).
	- → Full reference for service management, unit files, logging, custom timers, and security hardening: [[systemd]]
-
- # More Learn
	- ## Github & Webs
		- [Linux Kernel Documentation](https://www.kernel.org/doc/html/latest/)
		- [Linux man pages online](https://man7.org/linux/man-pages/)
		- [The Linux Programming Interface (book)](https://man7.org/tlpi/)
		- [Brendan Gregg — Linux Performance](https://www.brendangregg.com/linuxperf.html)
		- [Linux Hardening Guide](https://madaidans-insecurities.github.io/guides/linux-hardening.html)
		- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
		- [[eBPF]] — Complete eBPF guide with BCC, bpftrace, CO-RE, XDP
		- [[Kali Linux]] — security tools and penetration testing
		- [[Ubuntu]] — desktop and server administration
		- [[Ethical Hacking Advanced]] — advanced offensive security concepts
	-
	- ## Master Playlists YouTube
		- [Linux Internals – Low Level Learning](https://www.youtube.com/results?search_query=linux+internals+low+level+learning)
		- [Linux Performance – Brendan Gregg](https://www.youtube.com/results?search_query=linux+performance+brendan+gregg)
		- [Linux Security Hardening – Full Course](https://www.youtube.com/results?search_query=linux+security+hardening+full+course)