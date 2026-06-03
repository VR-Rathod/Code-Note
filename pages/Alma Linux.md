---
seoTitle: AlmaLinux Complete Guide – DNF, SELinux & ELevate Hardening
description: "Comprehensive AlmaLinux reference covering history, DNF package management, ELevate migrations, SELinux configurations, firewalld, and Completely Fair Scheduler (CFS) kernel architectures."
keywords: "AlmaLinux, DNF Package Manager, SELinux, ELevate, firewalld, Apache HTTPD, MariaDB, NFS, Completely Fair Scheduler, CFS Scheduler, Virtual Memory, Kernel Scheduling, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: AlmaLinux – Complete Guide
enableToc: true
comments: true
---

- # History
	- ## The Red Hat Pivot and the End of CentOS (2020)
		- For nearly two decades, **CentOS (Community Enterprise Operating System)** was the de facto standard for open-source enterprise web servers. It provided a free, community-supported 1:1 downstream binary clone of **RHEL (Red Hat Enterprise Linux)**.
		- In **December 2020**, Red Hat announced a major shift in its strategy: stable CentOS releases would be discontinued. The project would transition to **CentOS Stream**, an upstream development platform positioned ahead of RHEL.
		- This change left system administrators without a free, stable, bug-for-bug compatible replacement for production servers.
	- ## The Birth of AlmaLinux (2021)
		- In response, **CloudLinux Inc.**, led by founder and CEO **Igor Seletskiy**, announced the launch of a new distribution originally codenamed **Project Lenix**.
		- The project aimed to deliver a free, community-driven, 1:1 binary-compatible clone of RHEL.
		- CloudLinux committed $1 million in annual funding to sponsor development.
		- In **January 2021**, the project was officially renamed **AlmaLinux**, derived from the Latin word *alma* meaning "soul" or "nourishing," as a tribute to the community.
		- The first stable release, **AlmaLinux 8.3**, was launched in **March 2021**, just four months after the CentOS Stream announcement.
	- ## The AlmaLinux OS Foundation
		- To prevent a single corporate entity from controlling the distribution, CloudLinux established the **AlmaLinux OS Foundation** in **2021** as a non-profit organization under 501(c)(6) rules.
		- The foundation holds the intellectual property, trademarks, and governs the project through a community-elected Board of Directors. Board members include representatives from CloudLinux, AWS, Microsoft, and independent developers.
	- ## The ABI Compatibility Shift (2023)
		- In **June 2023**, Red Hat changed its policy, restricting public access to RHEL source code repositories, making it available only to paying customers via the Red Hat Customer Portal.
		- In response, the AlmaLinux OS Foundation announced that it would no longer attempt to maintain strict 1:1 bug-for-bug binary matching with RHEL.
		- Instead, AlmaLinux shifted to maintaining **ABI (Application Binary Interface) compatibility** with RHEL.
		- This allows AlmaLinux developers to resolve bugs and security vulnerabilities independently (using upstream sources like Fedora and CentOS Stream) while ensuring that applications compiled for RHEL continue to run without modification on AlmaLinux.
	- ## Version Release Timeline and Lifecycle Mapping
		- The release table demonstrates the relation between AlmaLinux versions, upstream RHEL bases, and lifecycle states:
		- ```
		  AlmaLinux Version   -->   Upstream RHEL Base   -->   Release Date    -->   End of Life (EOL)
		  AlmaLinux 8.3       -->   RHEL 8.3             -->   March 2021      -->   May 2029 (Active Support)
		  AlmaLinux 8.8       -->   RHEL 8.8             -->   May 2023        -->   May 2029 (Active Support)
		  AlmaLinux 9.0       -->   RHEL 9.0             -->   May 2022        -->   May 2032 (Active Support)
		  AlmaLinux 9.2       -->   RHEL 9.2             -->   May 2023        -->   May 2032 (Active Support)
		  AlmaLinux 9.4       -->   RHEL 9.4             -->   May 2024        -->   May 2032 (Active Support)
		  ```
	- ## Distribution Lineage Architecture
		- AlmaLinux maps its release packages using RHEL development tracks:
		- ```
		                    [ Fedora Project Upstream Base ]
		                                 |
		                                 v
		                      [ CentOS Stream Upstream ]
		                        (RHEL Development Base)
		                                 |
		                                 v
		                    [ Red Hat Enterprise Linux ]
		                                 |
		                                 v
		                 [ AlmaLinux OS Release Codebase ]
		               (ABI Compatible, community governed)
		  ```
- # Introduction
  collapsed:: true
	- ## What is AlmaLinux?
		- AlmaLinux is an enterprise-grade, community-governed Linux operating system built to be binary-compatible with Red Hat Enterprise Linux (RHEL).
		- It is designed to run mission-critical workloads, database servers, web clusters, and containerized virtualization environments.
		- It is governed by a non-profit foundation, ensuring that the distribution remains free and open-source forever.
	- ## Advantages of AlmaLinux
		- **Long-Term Support Lifecycle**: Every major release is supported for 10 years, matching RHEL's support cycles.
		- **Non-Profit Governance**: The AlmaLinux OS Foundation guarantees that the distribution is not subject to corporate acquisitions or sudden license changes.
		- **100% ABI Compatibility**: Applications built for RHEL, CentOS, or Rocky Linux run without modification on AlmaLinux.
		- **ELevate Migration Support**: The ELevate framework simplifies in-place upgrades between major operating system versions (e.g., CentOS 7 to AlmaLinux 8).
		- **Secure Boot Integration**: Natively supports UEFI Secure Boot keys, ensuring hardware verification.
	- ## Disadvantages of AlmaLinux
		- **Conservative Software Library**: Standard package versions prioritize stability, meaning developers must use AppStream modules or third-party repositories (EPEL) to access the latest compilers and languages.
		- **Lacks Corporate Services Bundling**: Unlike SLES or RHEL, commercial support contracts must be purchased separately through third-party vendors (like CloudLinux TuxCare).
	- ## Core Use Cases
		- **Production Enterprise Web Servers**: Running Apache, Nginx, or database stacks in data centers.
		- **Virtualization Hypervisors**: Running KVM virtual machines or Podman/Docker container hosts.
		- **Cloud Infrastructure Instances**: Running VM templates across AWS, GCP, and Microsoft Azure.
	- ## Feature Comparison: AlmaLinux vs. Rocky Linux vs. CentOS Stream
		- | Feature | AlmaLinux | Rocky Linux | CentOS Stream |
		  |---------|-----------|-------------|---------------|
		  | Upstream Base | RHEL / CentOS Stream | RHEL Downstream | Fedora Upstream |
		  | Compatibility | ABI Compatible with RHEL | 1:1 Bug-for-Bug with RHEL | RHEL Upstream Preview |
		  | Governance | Non-Profit Foundation | Corporate-backed (CIQ) | Red Hat / IBM |
		  | Target Audience | Enterprise Servers, Cloud Nodes | Enterprise Servers, HPC | Package Developers, Enthusiasts |
		  | Lifecycle Support | 10 Years | 10 Years | 5 Years |
		  | Primary Package Tool | DNF / RPM | DNF / RPM | DNF / RPM |
- # Installation & Setup
  collapsed:: true
	- ## Hardware Requirements
		- Ensure the target system matches the configuration limits prior to installation:
		- ```
		  Metric            -->   Minimum Requirements       -->   Recommended Workstation
		  CPU architecture  -->   x86_64, aarch64, ppc64le   -->   x86_64 Multi-Core (4+ Cores)
		  System RAM        -->   1.5 GB RAM                 -->   4 GB RAM (8 GB+ preferred)
		  Disk Space        -->   10 GB                      -->   50 GB+ (SSD highly recommended)
		  Display Interface -->   Text Console Only          -->   1024x768 (GUI console)
		  ```
	- ## ISO Downloading and Verification
		- Download official ISOs from local mirrors. Verify the ISO signature using GnuPG to prevent MITM tampering:
		- ```bash
		  # 1. Import the AlmaLinux public signing key
		  curl -O https://repo.almalinux.org/almalinux/RPM-GPG-KEY-AlmaLinux-9
		  gpg --import RPM-GPG-KEY-AlmaLinux-9
		  
		  # 2. Download the CHECKSUM file and signature
		  curl -O https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9-latest-x86_64-dvd.iso.sha256sum.txt.asc
		  curl -O https://repo.almalinux.org/almalinux/9/isos/x86_64/AlmaLinux-9-latest-x86_64-dvd.iso.sha256sum.txt
		  
		  # 3. Verify the checksum file signature
		  gpg --verify AlmaLinux-9-latest-x86_64-dvd.iso.sha256sum.txt.asc AlmaLinux-9-latest-x86_64-dvd.iso.sha256sum.txt
		  
		  # 4. Check the calculated hash of the ISO matches the verified sha256sums
		  sha256sum -c AlmaLinux-9-latest-x86_64-dvd.iso.sha256sum.txt --ignore-missing
		  # Output on success: AlmaLinux-9.x-x86_64-dvd.iso: OK
		  ```
	- ## Anaconda Installer Partition Configurations
		- The Anaconda installer supports LVM (Logical Volume Manager) layouts to allow dynamic partition resizing:
		- ### Standard LVM Layout
			- Recommended for standard enterprise servers:
			- ```
			  Device       -->   Size      -->   Filesystem  -->   Mount Point   -->   Description
			  /dev/sda1    -->   600 MB    -->   vfat (FAT32)-->   /boot/efi     -->   EFI System Partition (ESP)
			  /dev/sda2    -->   1 GB      -->   xfs         -->   /boot         -->   Static boot files
			  /dev/sda3    -->   Rest      -->   LVM PV      -->   [Volume Group]-->   Physical Volume Group (vg_system)
			  ```
			- Inside the LVM Volume Group (`vg_system`), allocate logical volumes:
				- `lv_root`: Mounted at `/` (XFS filesystem, 40 GB+).
				- `lv_var`: Mounted at `/var` (XFS filesystem, 20 GB+ for logs and caches).
				- `lv_tmp`: Mounted at `/tmp` (XFS filesystem, 5 GB+).
				- `lv_swap`: Allocated as system swap space (8 GB+).
	- ## ELevate Migration Walkthrough (CentOS 7 to AlmaLinux 8)
		- The ELevate framework, built by CloudLinux and powered by Leapp utility packages, allows in-place upgrades of major Red Hat-derived distributions.
		- ### Step-by-Step ELevate CLI Upgrade
			- ```bash
			  # 1. Update CentOS 7 system packages to latest release versions
			  sudo yum update -y
			  sudo reboot
			  
			  # 2. Install the elevate-release package repository configuration
			  sudo yum install -y http://repo.almalinux.org/elevate/elevate-release-latest-el7.noarch.rpm
			  
			  # 3. Install the leapp upgrade engine and AlmaLinux data package
			  sudo yum install -y leapp-upgrade leapp-data-almalinux
			  
			  # 4. Execute the pre-upgrade assessment check
			  sudo leapp preupgrade
			  
			  # 5. Examine output reports (/var/log/leapp/leapp-report.txt)
			  # Solve inhibit blocks (e.g., modules loading, root login permissions, boot parameters)
			  # Example: Allow root login over SSH during migration if required:
			  # sudo leapp answer --section remove_pam_pkcs11_module_check.confirm=True
			  
			  # 6. Initialize the upgrade sequence
			  sudo leapp upgrade
			  
			  # 7. Once upgrade completes, reboot system manually
			  sudo reboot
			  ```
			- During the boot process, select the "ELevate-Upgrade-Initramfs" bootloader option in GRUB. Leapp will execute package updates and system transitions recursively. Once finished, the system reboots into AlmaLinux 8.
	- ## Performance Tuning fstab Configuration
		- Adjust the `/etc/fstab` settings to optimize read and write speeds, configure mount optimizations for Solid State Drives (SSDs), and reduce metadata write cycles:
		- ```
		  # Recommended fstab optimizations for SSD root XFS partitions on AlmaLinux:
		  UUID=b7c6b907-7d12-4f38-89c0-5de85a6a6bb7  /  xfs  noatime,nodiratime,discard,inode64  0  0
		  ```
		- Explanation of performance flags:
			- `noatime`: Disables updating file access times during read cycles. This significantly reduces disk write operations and SSD wear.
			- `nodiratime`: Disables directory access time updates, accelerating directory traversals.
			- `discard`: Enables immediate background TRIM commands, notifying the SSD controller which blocks are no longer mapped to files.
			- `inode64`: Tells the kernel to place inodes at any allocation group location, supporting large disk partitions (greater than 2 TB).
	- ## First Boot Configurations
		- ```bash
		  # 1. Register EPEL (Extra Packages for Enterprise Linux) repositories
		  sudo dnf install -y epel-release
		  
		  # 2. Force DNF cache updates
		  sudo dnf makecache
		  
		  # 3. Configure hostnames
		  sudo hostnamectl set-hostname almalinux-host.enterprise.local
		  ```
	- ## Logical Volume Manager (LVM) CLI Partitioning Guide
		- When deploying AlmaLinux on enterprise servers, the Anaconda GUI installer might not be available or custom manual partition modifications are required via the CLI.
		- ### Step-by-Step LVM Partitioning Workflow
			- ```bash
			  # 1. Scan the system to identify available raw disks
			  sudo lsscsi
			  sudo fdisk -l
			  
			  # 2. Initialize a physical volume on the target disk partition (e.g., /dev/sdb1)
			  sudo pvcreate /dev/sdb1
			  # Output: Physical volume "/dev/sdb1" successfully created.
			  
			  # 3. Verify the physical volume parameters
			  sudo pvdisplay /dev/sdb1
			  
			  # 4. Create a volume group named 'vg_data' using the physical volume
			  sudo vgcreate vg_data /dev/sdb1
			  # Output: Volume group "vg_data" successfully created.
			  
			  # 5. Verify the volume group parameters
			  sudo vgdisplay vg_data
			  
			  # 6. Allocate a logical volume of 100 GB for application storage named 'lv_apps'
			  sudo lvcreate -L 100G -n lv_apps vg_data
			  # Output: Logical volume "lv_apps" created.
			  
			  # 7. Format the new logical volume with XFS filesystem (default for AlmaLinux)
			  sudo mkfs.xfs /dev/vg_data/lv_apps
			  
			  # 8. Create a mount point and mount the volume
			  sudo mkdir -p /srv/apps
			  sudo mount /dev/vg_data/lv_apps /srv/apps
			  
			  # 9. Verify mount points and active space
			  df -hT | grep apps
			  ```
		- ### Dynamic Logical Volume Resizing (No Downtime)
			- If the application storage fills up, LVM allows extending the volume dynamically without unmounting the XFS filesystem:
			- ```bash
			  # 1. Extend the logical volume by adding another 50 GB
			  sudo lvextend -L +50G /dev/vg_data/lv_apps
			  # Output: Size of logical volume vg_data/lv_apps changed from 100.00 GiB to 150.00 GiB.
			  
			  # 2. Grow the XFS filesystem online to consume the newly allocated volume space
			  sudo xfs_growfs /srv/apps
			  # Output: data blocks changed from 26214400 to 39321600.
			  
			  # 3. Verify that the filesystem partition size has increased
			  df -h /srv/apps
			  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Kernel Architecture & Core Customizations
		- AlmaLinux runs a standard monolithic kernel derived from RHEL. The kernel encapsulates device drivers, virtual memory management, filesystem engines, and network protocol suites:
		- ```
		  +-------------------------------------------------------------+
		  |                       User Space Applications               |
		  +-------------------------------------------------------------+
		  |                   Virtual System Call Interface             |
		  +-------------------------------------------------------------+
		  | AlmaLinux Monolithic Kernel Space:                          |
		  |  [Process Scheduler]   [Virtual Filesystem (VFS)]           |
		  |  [Slab Allocator]      [Page Cache & kswapd Engine]         |
		  |  [SELinux MAC Module]  [Network Socket Filters]             |
		  +-------------------------------------------------------------+
		  |                          Hardware Layer                     |
		  +-------------------------------------------------------------+
		  ```
	- ## Filesystem Directory Hierarchy (Linux Standard Base)
		- AlmaLinux maps directories according to the Filesystem Hierarchy Standard (FHS):
		- | Path | Description | Access Rights / Security Level |
		  |------|-------------|--------------------------------|
		  | `/boot` | Static bootloader configurations, vmlinuz kernels, and initrd RAM disk blocks. | Root read-only (unprivileged can view, root writes). |
		  | `/etc` | System configuration files specific to the local machine. | Root write/read; unprivileged read-only. |
		  | `/bin` | Essential system utility commands available to all users (e.g., cat, cp, ls). | Read-execute for all; root write only. |
		  | `/sbin` | Essential administration commands intended for system administration (e.g., fdisk, iptables). | Read-execute for root/sudoers. |
		  | `/usr` | Secondary user data hierarchy; shareable, read-only libraries, programs, docs. | Write access restricted to package manager. |
		  | `/var` | Variable data directories (logs, cache pools, spool directories, databases). | Managed by specific system services. |
		  | `/sys` | Virtual sysfs filesystem interface tracking hardware device parameters. | Dynamically managed by kernel subsystem. |
		  | `/proc` | Virtual procfs interface tracking process metrics and kernel states. | Dynamically managed by kernel subsystem. |
		  | `/dev` | Physical and virtual device file nodes representing system hardware. | Controlled via udev rules. |
		  | `/opt` | Add-on application software packages (third-party vendor applications). | Write access restricted to root. |
		  | `/srv` | Data for services hosted on this machine (e.g., www files). | Service specific write access. |
		  | `/run` | Ephemeral runtime data detailing active service PIDs and socket maps. | Volatile memory storage (wiped at boot). |
	- ## Boot Process Sequence
		- 1. **POST (Power-On Self-Test)**: System firmware (UEFI/BIOS) initializes hardware.
		- 2. **GRUB2 Loader**: UEFI reads the system ESP partition and loads `/boot/efi/EFI/almalinux/grubx64.efi`.
		- 3. **Kernel Loading**: GRUB2 reads the configuration file, prints the boot menu, loads `/boot/vmlinuz-<version>` into memory, and loads `/boot/initrd.img-<version>` (initial RAM disk).
		- 4. **initramfs phase**: The temporary root filesystem is mounted in RAM. Storage controllers and filesystem module drivers are loaded, then the real root filesystem `/` is mounted.
		- 5. **systemd Initialization**: systemd is launched as PID 1. It mounts partitions specified in `/etc/fstab`, processes dependency targets, and starts background services.
		- 6. **Display Manager Execution**: systemd starts the display manager system service (GDM/SDDM) if configured for graphical mode, otherwise presents a login getty prompt.
	- ## Systemd Targets Architecture
		- AlmaLinux manages state transitions through systemd target hierarchies, allowing servers and desktops to boot into specific run levels:
		- ```
		  [sysinit.target] (Pre-requisite mounting, load storage drivers, crypt filesystems)
		         |
		         v
		  [basic.target]   (Initialize system sockets, hardware dev pathways, timers)
		         |
		         v
		  [network.target] (Launch NetworkManager or network interface protocols)
		         |
		         v
		  [multi-user.target] (Initialize headless servers, terminal-only multi-user logins)
		         |
		         v
		  [graphical.target]  (Start display manager GUI session logins)
		  ```
		- Useful administration commands for targets:
		- ```bash
		  # Check the default boot target configuration
		  systemctl get-default
		  
		  # Change the boot target to headless terminal mode permanently
		  sudo systemctl set-default multi-user.target
		  
		  # Change boot target back to graphical GUI permanently
		  sudo systemctl set-default graphical.target
		  
		  # Isolate active session target to multi-user terminal immediately
		  sudo systemctl isolate multi-user.target
		  ```
	- ## Kernel Sysctl Virtual Memory Optimization
		- Tuning kernel virtual memory settings ensures responsiveness on low-resource enterprise configurations. Write modifications to `/etc/sysctl.d/99-server-performance.conf`:
		- ```ini
		  # File: /etc/sysctl.d/99-server-performance.conf
		  
		  # Swappiness: Controls the kernel priority for page evictions.
		  # Lower values prevent swapping pages to disk prematurely, preserving memory page caches.
		  vm.swappiness = 10
		  
		  # Cache Pressure: Controls kernel tendency to reclaim directory and inode caches.
		  # Increasing value to 50 prevents excessive disk scanning for folder structures.
		  vm.vfs_cache_pressure = 50
		  
		  # Writeback: Increases flush timers to write dirty filesystem pages less frequently.
		  vm.dirty_writeback_centisecs = 1500
		  vm.dirty_expire_centisecs = 3000
		  ```
		- ```bash
		  # Reload system configurations immediately
		  sudo sysctl --system
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Shell Types in AlmaLinux
		- **bash**: Bourne-Again Shell. The default command interpreter for user and administrative shells.
		- **zsh**: Z Shell. Supported; features advanced autocomplete engines.
		- To install and toggle shell interpreters:
		- ```bash
		  # Install Zsh
		  sudo dnf install zsh -y
		  
		  # Change the default login shell for current user
		  chsh -s /bin/zsh
		  ```
	- ## Essential Commands Directory (75+ Commands)
		- ### File Operations & Inspection
			- ```bash
			  pwd                        # Print path of the active working directory
			  ls -laF                    # List files in verbose table format, showing hidden files and directory indicators
			  cd /var/log/               # Change active directory location
			  mkdir -p /srv/www/app/     # Create nested folders
			  touch /tmp/agent.lock      # Create empty file or update access timestamp
			  cp -a /etc/network/ /backup/# Copy directory recursively, preserving permissions, links, and details
			  mv source.txt target.txt   # Rename or move file
			  rm -rf /tmp/scratch/       # Delete files and directories recursively
			  ln -sf /etc/nginx/ nginx_lnk# Create symbolic link overriding old link
			  find /etc/ -name "*.conf"  # Find files matching name mask under directory tree
			  locate index.html          # Find files quickly using prebuilt system database
			  cat /etc/hostname          # Display file contents
			  head -n 20 /var/log/messages # Output first 20 lines of a file
			  tail -f /var/log/secure    # Output and monitor new entries in a file in real-time
			  grep -rn "error" /var/log/ # Search recursively for string pattern showing line numbers
			  wc -l /etc/passwd          # Count lines in a file
			  file /usr/bin/find         # Display file format description and dynamic loading details
			  stat /etc/shadow           # View detailed file size, links, permissions, and creation timestamps
			  diff config.old config.new # Compare text file structures and output line modifications
			  ```
		- ### Archiving & Compression
			- ```bash
			  tar -cvzf archive.tar.gz /etc/  # Create compressed gzip archive from target directory
			  tar -xvzf archive.tar.gz -C /tmp/ # Extract gzip archive contents to /tmp/ path
			  tar -cvjf archive.bz2 /srv/log/ # Create bzip2 compressed archive
			  tar -xvjf archive.bz2 -C /opt/  # Extract bzip2 archive contents
			  zip -r backup.zip /var/www/     # Create compressed zip archive of directory tree
			  unzip backup.zip -d /tmp/       # Extract zip file contents to target directory
			  gzip large_log.log              # Compress file directly, replacing it with .gz format
			  gunzip large_log.log.gz         # Decompress .gz file back to standard log format
			  ```
		- ### Process Management & Job Control
			- ```bash
			  ps auxf                    # Display all running processes in hierarchical tree format
			  top -b -n 1                # Print active process resource usage statistics in batch mode
			  htop                       # Launch interactive process monitoring console (requires installation)
			  pgrep -u www-data nginx    # Print PIDs of nginx processes owned by www-data user
			  kill -15 1024              # Send SIGTERM signal to PID 1024 to terminate gracefully
			  kill -9 1024               # Send SIGKILL signal to PID 1024 to terminate immediately
			  pkill -u visitor           # Terminate all active processes owned by visitor account
			  killall httpd              # Kill all instances of httpd processes
			  jobs                       # List background jobs
			  bg %1                      # Resume suspended job 1 in background
			  fg %1                      # Bring background job 1 to foreground
			  nohup node server.js &     # Run process in background, ignoring hangup signals
			  ulimit -a                  # Display current user process limits and descriptors thresholds
			  nice -n 10 backup.sh       # Start process with elevated nice value (lower priority)
			  renice +5 -p 2045          # Modify priority level of active PID 2045 process
			  ```
		- ### System Diagnostics & Hardware
			- ```bash
			  uname -a                   # Output kernel release, OS name, and architecture
			  lshw -short                # Print brief hardware configuration details
			  lspci | grep VGA           # List PCI graphics cards
			  lsusb                      # List USB buses and connected hardware
			  df -hT                     # Output disk space metrics and filesystem types
			  du -sh /var/log/           # Summarize disk usage of target directory
			  free -h                    # Show RAM and swap metrics
			  uptime                     # Print system running time and average CPU loads
			  journalctl -p err -n 10    # Show the 10 most recent error log entries from systemd journal
			  dmesg | grep -i hardware   # Print kernel ring buffer messages filtered by search term
			  lsmod                      # List loaded kernel module drivers
			  modinfo ext4               # Display information about ext4 kernel module details
			  sudo dmidecode -t system   # Read motherboard bios and hardware serialization metrics
			  lscpu                      # View CPU cores and architecture descriptors
			  lsblk                      # Display disk partition structures and UUID layouts
			  ```
		- ### Networking Utilities
			- ```bash
			  ip addr show dev eth0      # Display active IP configuration for eth0 interface
			  ping -c 3 google.com       # Send ICMP echo packets to verify remote host connectivity
			  ss -tulnp                  # Show active TCP and UDP sockets with owning process details
			  traceroute 8.8.8.8         # Display hop paths to destination host
			  curl -I https://almalinux.org# Fetch HTTP headers of target site
			  wget -c https://site.com/f # Download file with resume capability
			  dig @8.8.8.8 almalinux.org # Perform DNS record queries using Google Resolver
			  nslookup google.com        # Query internet name servers for IP mapping
			  hostnamectl                # Display active hostnames and architecture details
			  ip route show              # Print active system routing path configurations
			  ip neigh show              # Display ARP mapping table records
			  netstat -i                 # Print network interface packets statistics
			  ```
		- ### Permissions & Security
			- ```bash
			  chmod 755 script.sh        # Set owner (rwx), group (r-x), and others (r-x) permissions
			  chown -R apache:apache     # Recursively assign file ownership to apache user and group
			  su - administrator         # Log in to administrator user session
			  sudo -i                    # Escalate terminal session to superuser (root) configuration
			  visudo                     # Safely edit system sudoers rules file
			  useradd -m -s /bin/bash usr# Create new user account with home folder and bash shell
			  userdel -r usr             # Delete user account, home folder, and mail spool
			  id apache                  # Print user and group IDs (UID/GID) for account
			  w                          # Display logged in users and their active command sessions
			  last                       # View history of user login and system reboot records
			  ```
	- ## File Permissions & Special Flags
		- System permissions are managed via Owner, Group, and Others octal bit settings:
		- ```bash
		  # Set standard execute permissions (rwxr-xr-x)
		  chmod 755 /usr/local/bin/deploy
		  ```
		- ### Special Permission Flags
			- **SUID (Set Owner User ID)**: When an executable with SUID is run, it executes with the privileges of the file owner (typically root) rather than the user calling the command.
			- **SGID (Set Group ID)**: For executables, runs with the privileges of the file group. For directories, any new files created inside inherit the group of the parent directory.
			- **Sticky Bit**: Applied to directories (e.g., `/tmp`). Prevents users from deleting or renaming files unless they own the file, directory, or have root access.
			- ```bash
			  # Apply SUID to a custom binary (Caution: potential privilege escalation point)
			  sudo chmod u+s /usr/local/bin/helper
			  
			  # Apply SGID to a shared directory
			  sudo chmod g+s /srv/shared/
			  
			  # Apply Sticky Bit to a temporary directory
			  sudo chmod +t /srv/public/
			  ```
	- ## Piping and Standard Redirection
		- Redirect output streams to process data flows:
		- ```bash
		  # Overwrite file with stdout
		  ls -la /var/log/ > /tmp/logs.txt
		  
		  # Append stdout to file
		  echo "System backup initiated" >> /var/log/audit.log
		  
		  # Redirect stderr (standard error) to log
		  sudo dnf update 2> /tmp/dnf-errors.log
		  
		  # Redirect both stdout and stderr to the same file
		  sudo tar -cvzf /backup/sys.tar.gz /etc/ &> /var/log/backup-run.log
		  
		  # Discard errors by redirecting to dev null
		  find / -name "secret.txt" 2> /dev/null
		  
		  # Pipe stdout as input to another command
		  ss -tulnp | grep ":80" | awk '{print $5}'
		  ```
	- ## Production Shell Automation Scripts
		- ### Script 1: AlmaLinux Enterprise System Security Auditor
			- Save as `/usr/local/bin/sys_auditor.sh` and set execution permissions: `chmod +x sys_auditor.sh`.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: sys_auditor.sh
			  # Description: Audits active directories, system logs, memory thresholds.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  AUDIT_LOG="/var/log/almalinux_audit.log"
			  DISK_LIMIT=85
			  
			  log_event() {
			      echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] - $2" >> "$AUDIT_LOG"
			  }
			  
			  log_event "INFO" "Initializing system security audit..."
			  
			  # 1. Audit Disk Space
			  DISK_USAGE=$(df / | tail -n 1 | awk '{print $5}' | sed 's/%//')
			  if [ "$DISK_USAGE" -gt "$DISK_LIMIT" ]; then
			      log_event "CRITICAL" "Root partition usage is at $DISK_USAGE%!"
			  else
			      log_event "INFO" "Root partition usage stable at $DISK_USAGE%."
			  fi
			  
			  # 2. Check for active root-privileged background processes
			  ROOT_PROC=$(ps -ef | grep -v "\]$" | awk '{print $1}' | grep "root" | wc -l)
			  log_event "INFO" "Found $ROOT_PROC root-owned processes active."
			  
			  # 3. Log Active Kernel and Uptime metrics
			  ACTIVE_KERNEL=$(uname -r)
			  SYSTEM_UPTIME=$(uptime -p)
			  log_event "INFO" "Active Kernel version: $ACTIVE_KERNEL | Uptime stats: $SYSTEM_UPTIME"
			  
			  echo "System audit complete. Logging results to $AUDIT_LOG."
			  exit 0
			  ```
		- ### Script 2: ELevate Migration Pre-Upgrade Verification tool
			- Save as `/usr/local/bin/elevate_precheck.sh`. Validates system states prior to upgrades.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: elevate_precheck.sh
			  # Description: Runs basic validation audits on CentOS 7 packages prior to ELevate migrations.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  LOG_FILE="/var/log/elevate_precheck.log"
			  
			  log_write() {
			      echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] - $2" | tee -a "$LOG_FILE"
			  }
			  
			  # 1. Check Kernel Release version
			  KERNEL_MAJOR=$(uname -r | cut -d'.' -f1)
			  if [ "$KERNEL_MAJOR" -ne 3 ]; then
			      log_write "WARNING" "Kernel major is not 3 (CentOS 7 default). Verify packages."
			  else
			      log_write "INFO" "Kernel major version verified: 3.x"
			  fi
			  
			  # 2. Check for active PAM modules that break upgrades
			  if rpm -qa | grep -q "pam_pkcs11"; then
			      log_write "WARNING" "pam_pkcs11 package found. This must be removed before upgrade."
			  else
			      log_write "INFO" "pam_pkcs11 check passed."
			  fi
			  
			  # 3. Verify free space on root partition (Requires 10 GB minimum)
			  FREE_SPACE=$(df -BG / | tail -n 1 | awk '{print $4}' | sed 's/G//')
			  if [ "$FREE_SPACE" -lt 10 ]; then
			      log_write "CRITICAL" "Root has only ${FREE_SPACE}GB free. Upgrade requires at least 10GB."
			  else
			      log_write "INFO" "Root partition free space verified: ${FREE_SPACE}GB."
			  fi
			  
			  exit 0
			  ```
		- ### Script 3: Firewalld Monitor & Attack Alert Daemon
			- Save as `/usr/local/bin/firewalld_monitor.sh`. Analyzes syslog logs and alerts on blocked packet spikes.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: firewalld_monitor.sh
			  # Description: Tail parses system logs, increments IP counters, alerts on spikes.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  SYS_LOG="/var/log/messages"
			  ALERT_LOG="/var/log/firewalld_alerts.log"
			  SPIKE_THRESHOLD=10
			  
			  if [ ! -f "$SYS_LOG" ]; then
			      echo "System log file not found at $SYS_LOG. Ensure logging is enabled."
			      exit 1
			  fi
			  
			  echo "Starting Firewalld intrusion monitoring engine..."
			  
			  # Run log aggregation for past 30 minutes
			  BLOCKED_IPS=$(grep -i "FINAL_REJECT" "$SYS_LOG" | awk -F'SRC=' '{print $2}' | awk '{print $1}' | sort | uniq -c | sort -nr)
			  
			  echo "$BLOCKED_IPS" | while read -r count ip; do
			      if [ -n "$count" ] && [ "$count" -gt "$SPIKE_THRESHOLD" ]; then
			          # Resolve source hostname
			          HOST_RESOLVE=$(dig +short -x "$ip" | head -n 1)
			          [ -z "$HOST_RESOLVE" ] && HOST_RESOLVE="Unknown Hostname"
			          
			          echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ALERT] IP $ip ($HOST_RESOLVE) triggered $count blocks!" >> "$ALERT_LOG"
			          echo "WARNING: Block spike detected for $ip ($count blocks)."
			      fi
			  done
			  
			  exit 0
			  ```
		- ### Script 4: Apache HTTPD Status Performance Checker Daemon
			- Save as `/usr/local/bin/httpd_status_daemon.sh`. Gathers Apache metrics and writes stats.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: httpd_status_daemon.sh
			  # Description: Queries local Apache server status pages, aggregates requests counts,
			  #              saves stats to performance database.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  STATS_FILE="/var/log/httpd_performance.stats"
			  
			  # Ensure Apache status module is active
			  if ! curl -s http://localhost/server-status?auto > /dev/null; then
			      echo "Apache server-status page is unreachable. Enable mod_status."
			      exit 1
			  fi
			  
			  # Query stats
			  STATUS_DATA=$(curl -s http://localhost/server-status?auto)
			  REQ_PER_SEC=$(echo "$STATUS_DATA" | grep "ReqPerSec" | awk '{print $2}')
			  BYTES_PER_SEC=$(echo "$STATUS_DATA" | grep "BytesPerSec" | awk '{print $2}')
			  BUSY_WORKERS=$(echo "$STATUS_DATA" | grep "BusyWorkers" | awk '{print $2}')
			  
			  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Requests/sec: $REQ_PER_SEC | Bytes/sec: $BYTES_PER_SEC | Active Workers: $BUSY_WORKERS" >> "$STATS_FILE"
			  exit 0
			  ```
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- **Root Administrator**: UID 0. Complete control over operating system components, kernel modules, filesystems, and security parameters.
		- **System Service Accounts**: UID 1 to 999. Created for running specific system daemons (e.g., bin, sys, mail, www-data, apache, mysql). These do not have login shells.
		- **Regular User Accounts**: UID 1000+. Created for standard human users and developers.
	- ## User Administration Commands
		- ```bash
		  # Create user 'developer' with home folder, default bash shell, and account details
		  sudo useradd -m -s /bin/bash -c "Primary Developer Account" developer
		  
		  # Configure user password
		  sudo passwd developer
		  
		  # Add user to the administration group 'wheel' (grants access to run privileged commands)
		  sudo usermod -aG wheel developer
		  
		  # Change user shell to zsh
		  sudo usermod -s /bin/zsh developer
		  
		  # Lock the user account (disables login attempts)
		  sudo usermod -L developer
		  
		  # Unlock the user account
		  sudo usermod -U developer
		  
		  # Delete user and wipe their home folder and mailbox files
		  sudo userdel -r developer
		  ```
	- ## Group Administration Commands
		- ```bash
		  # Create a new group 'secops'
		  sudo groupadd secops
		  
		  # Add user to the group
		  sudo gpasswd -a developer secops
		  
		  # Remove user from the group
		  sudo gpasswd -d developer secops
		  
		  # Delete the group
		  sudo groupdel secops
		  ```
	- ## Configuration Files
		- `/etc/passwd`: Stores user accounts configuration parameters (read-accessible to all users).
			- Format: `username:x:UID:GID:gecos:home_directory:login_shell`
		- `/etc/shadow`: Stores encrypted password hashes and account expiration flags (accessible only by root).
			- The file is structured into nine colon-separated fields:
				- **Field 1 (Login Name)**: User's login username.
				- **Field 2 (Encrypted Password)**: Hashed credentials. If it contains `!` or `*`, the account cannot login via password authentication.
				- **Field 3 (Last Password Change)**: Date of last password change, represented as days since epoch (January 1, 1970).
				- **Field 4 (Minimum Password Age)**: Minimum days required between password changes before the user can modify it again.
				- **Field 5 (Maximum Password Age)**: Maximum days the password is valid. After this, users must modify their password.
				- **Field 6 (Password Warning Period)**: Days before password expiration when warning notices are shown.
				- **Field 7 (Password Inactivity Period)**: Days after expiration during which the account remains valid before locking permanently.
				- **Field 8 (Account Expiration Date)**: Date when the account expires, represented as days since epoch.
				- **Field 9 (Reserved)**: A reserved field for future system parameters.
		- `/etc/login.defs`: Configures the shadow suite parameters (e.g. password age and hashing algorithms):
			- ```ini
			  # Default parameters inside /etc/login.defs:
			  PASS_MAX_DAYS   90      # Enforce password rotation every 90 days
			  PASS_MIN_DAYS   7       # Restrict password updates within a week of last change
			  PASS_WARN_AGE   7       # Alert users 7 days prior to password EOL
			  ENCRYPT_METHOD  SHA512  # Set default hashing algorithm to secure SHA-512
			  ```
		- `/etc/group`: Stores group definitions and membership lists.
	- ## Sudoers Configuration Hardening
		- Secure the `/etc/sudoers` file via standard rules:
		- ```bash
		  # Open the sudoers configuration file safely for syntax verification
		  sudo visudo
		  
		  # Allow members of group 'wheel' to execute any command
		  # %wheel ALL=(ALL:ALL) ALL
		  
		  # Allow user 'developer' to reload Firewalld rules without password prompts
		  # developer ALL=(ALL) NOPASSWD: /usr/bin/firewall-cmd --reload
		  
		  # Configure custom sudoers timeout (duration before password prompt is required again)
		  # Defaults timestamp_timeout=15
		  
		  # Restrict path executions for safety
		  # Defaults secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
		  ```
	- ## Password Aging Policies
		- ```bash
		  # View password expiration parameters for user 'developer'
		  sudo chage -l developer
		  
		  # Force user to change password on their next login session
		  sudo chage -d 0 developer
		  
		  # Set maximum password validity period to 90 days, warning 7 days prior
		  sudo chage -M 90 -W 7 developer
		  ```
	- ## Pluggable Authentication Modules (PAM) Password Auditing
		- Enforce strong password complexity rules in `/etc/pam.d/system-auth` and `/etc/pam.d/password-auth` by modifying parameters:
		- ```
		  # Edit configuration files to include pwquality guidelines:
		  password  requisite  pam_pwquality.so  retry=3 minlen=14 dcredit=-1 ucredit=-1 ocredit=-1 lcredit=-1 enforce_for_root
		  ```
		- Parameter metrics:
			- `retry=3`: Limits user attempts to input a correct password sequence to three times before termination.
			- `minlen=14`: Requires passwords to contain a minimum of 14 characters.
			- `dcredit=-1`: Requires a minimum of one numeric character.
			- `ucredit=-1`: Requires a minimum of one uppercase character.
			- `ocredit=-1`: Requires a minimum of one special symbol.
			- `lcredit=-1`: Requires a minimum of one lowercase character.
			- `enforce_for_root`: Applies password validation rules directly to root (UID 0), preventing simple root credentials.
	- ## Password Cryptographic Hash Configurations
		- When user passwords are created or modified, they are hashed before being saved in `/etc/shadow`. Configure secure SHA-512 rounds in `/etc/pam.d/system-auth`:
		- ```
		  # Enforce SHA-512 encryption hash with custom rounds
		  password  required  pam_unix.so  sha512  rounds=65536  obscure  use_authtok  try_first_pass  yescrypt
		  ```
	- ## User Session Hardening Policies
		- Restrict system resource consumption to mitigate Local Denial of Service (DoS) fork bomb attacks. Configure session thresholds in `/etc/security/limits.conf`:
		- ```ini
		  # File: /etc/security/limits.conf
		  # Limit maximum user process forks
		  *               hard    nproc           2048
		  *               soft    nproc           1024
		  
		  # Limit open file descriptors per session
		  *               hard    nofile          65536
		  *               soft    nofile          32768
		  ```
- # Package Management (DNF, EPEL & Local Repos)
  collapsed:: true
	- ## DNF Package Manager Architecture
		- **DNF (Dandified YUM)** is the default package management engine for AlmaLinux. DNF uses the **libsolv** library to execute dependency resolutions, accelerating processing.
		- ### DNF AppStream Modules
			- RHEL-based distributions separate packages into base operating system targets (**BaseOS**) and dynamic application streams (**AppStream**). AppStream modules allow administrators to run multiple versions of applications (e.g., Node.js or Python) on the same machine without dependency conflicts:
			- ```bash
			  # 1. List available modules for Node.js
			  dnf module list nodejs
			  # Output:
			  # nodejs  [18]  common [d]  Node.js Software Platform
			  # nodejs  [20]  common      Node.js Software Platform
			  
			  # 2. Enable specific module version stream
			  sudo dnf module enable nodejs:20 -y
			  
			  # 3. Install nodejs package from enabled stream
			  sudo dnf install nodejs -y
			  ```
	- ## Common DNF Commands
		- ```bash
		  # Update package repository index databases
		  dnf check-update
		  
		  # Upgrade all installed packages to their latest versions
		  sudo dnf upgrade -y
		  
		  # Install a package
		  sudo dnf install httpd -y
		  
		  # Remove a package but preserve configuration files
		  sudo dnf remove httpd -y
		  
		  # Search for a package matching a query
		  dnf search postgresql
		  
		  # Show detailed information about a package
		  dnf info postgresql
		  
		  # Clean local package cache files
		  sudo dnf clean all
		  ```
	- ## EPEL Repository Integration
		- EPEL (Extra Packages for Enterprise Linux) is a Fedora Special Interest Group project that creates, maintains, and manages high-quality add-on packages for RHEL-compatible distributions.
		- ```bash
		  # Install EPEL repository packages
		  sudo dnf install -y epel-release
		  
		  # Force cache updates
		  sudo dnf makecache
		  ```
	- ## Setting Up a Local Offline DNF Repository
		- To deploy packages in offline corporate intranets, administrators build custom localized repository nodes:
		- ```bash
		  # 1. Create a repository directory
		  mkdir -p /srv/local_repo/x86_64
		  
		  # 2. Copy downloaded RPM files into the folder
		  cp /var/cache/dnf/*.rpm /srv/local_repo/x86_64/
		  
		  # 3. Create repository metadata using createrepo (requires createrepo_c package)
		  sudo dnf install -y createrepo_c
		  createrepo /srv/local_repo/x86_64/
		  
		  # 4. Reference the local path in a custom repository configuration file
		  # File: /etc/yum.repos.d/local_repo.repo
		  # [local_repo]
		  # name=Local Enterprise Offline Repository
		  # baseurl=file:///srv/local_repo/x86_64/
		  # enabled=1
		  # gpgcheck=0
		  ```
		- Update local cache databases:
		- ```bash
		  # Verify local packages parsing
		  sudo dnf clean all && dnf makecache
		  ```
	- ## Building RPM Packages Natively
		- AlmaLinux administrators build custom RPMs using system utilities (`rpmbuild` and `rpmdevtools`) to distribute custom configuration files or compiled applications.
		- ### Step-by-Step RPM Build Workflow
			- ```bash
			  # 1. Install development tools and rpm packaging tools
			  sudo dnf groupinstall -y "Development Tools"
			  sudo dnf install -y rpm-build rpmdevtools
			  
			  # 2. Create the standard rpmbuild workspace directory structure
			  rpmdev-setuptree
			  # This generates folder maps under ~/rpmbuild:
			  # ~/rpmbuild/SOURCES/   - Compressed source code (.tar.gz) and patch files
			  # ~/rpmbuild/SPECS/     - Package specification files (.spec)
			  # ~/rpmbuild/BUILD/     - Raw files compiled during build processes
			  # ~/rpmbuild/RPMS/      - Resulting compiled binary packages (.rpm)
			  # ~/rpmbuild/SRPMS/     - Resulting source RPM packages (.src.rpm)
			  
			  # 3. Generate a template specification file inside SPECS folder
			  cd ~/rpmbuild/SPECS/
			  rpmdev-newspec enterprise-monitor
			  ```
		- ### Complete Spec File Example (`enterprise-monitor.spec`)
			- Build a custom monitoring package script distribution using a detailed specification configuration file:
			- ```spec
			  Name:           enterprise-monitor
			  Version:        1.0.0
			  Release:        1%{?dist}
			  Summary:        Custom enterprise security auditor script package for AlmaLinux.
			  
			  License:        GPLv3+
			  URL:            https://github.com/VR-Rathod/enterprise-monitor
			  Source0:        %{name}-%{version}.tar.gz
			  
			  BuildArch:      noarch
			  Requires:       bash, systemd
			  
			  %description
			  This package distributes system security auditing shell daemons to monitor configuration states.
			  
			  %prep
			  %setup -q
			  
			  %install
			  rm -rf %{buildroot}
			  mkdir -p %{buildroot}/usr/local/bin
			  mkdir -p %{buildroot}/lib/systemd/system
			  
			  # Copy file binaries to buildroot locations
			  install -m 0755 monitor.sh %{buildroot}/usr/local/bin/enterprise-monitor.sh
			  
			  %files
			  /usr/local/bin/enterprise-monitor.sh
			  
			  %changelog
			  * Sat May 30 2026 Vaibhav Rathod <vr@code-note.com> - 1.0.0-1
			  - Initial distribution package creation.
			  ```
			- Build the package binary commands:
			- ```bash
			  # Build binary and source RPM files
			  rpmbuild -bb ~/rpmbuild/SPECS/enterprise-monitor.spec
			  
			  # Install local custom RPM package
			  sudo dnf localinstall ~/rpmbuild/RPMS/noarch/enterprise-monitor-1.0.0-1.el9.noarch.rpm -y
			  ```
- # Networking
  collapsed:: true
	- ## NetworkManager Configuration
		- AlmaLinux uses **NetworkManager** to manage network connections. Control interface states using the command-line utility `nmcli`:
		- ```bash
		  # List network connections
		  nmcli connection show
		  
		  # Scan for available Wi-Fi access points
		  nmcli device wifi list
		  
		  # Connect to a Wi-Fi network
		  nmcli device wifi connect "SSID_NAME" password "WIFI_PASSWORD"
		  
		  # Configure a static IP on eth0 interface
		  nmcli connection modify eth0 ipv4.addresses 192.168.1.100/24 ipv4.gateway 192.168.1.1 ipv4.method manual
		  
		  # Apply static IP modifications
		  nmcli connection up eth0
		  ```
	- ## SSH Server Hardening
		- Secure the SSH server daemon by editing `/etc/ssh/sshd_config` to mitigate brute-force and credential-compromise attacks:
		- ```bash
		  # Edit configuration
		  sudo vim /etc/ssh/sshd_config
		  
		  # Key parameters:
		  # Port 2200                  # Change default port to prevent automated scanners
		  # PermitRootLogin no         # Block root login; enforce privilege escalation via sudo
		  # PasswordAuthentication no   # Disable password logins; enforce SSH key authentication
		  # AllowUsers developer       # Restrict login access to specific accounts
		  # MaxAuthTries 3             # Terminate connection after 3 failed login attempts
		  
		  # Restart the SSH service
		  sudo systemctl restart sshd
		  ```
		- ### Advanced Cryptographic Suite Hardening
			- Harden SSH transport layers by enforcing modern key-exchange algorithms and encryption ciphers:
			- ```ini
			  # Add parameters inside /etc/ssh/sshd_config:
			  
			  # Enforce modern Key Exchange algorithms
			  KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
			  
			  # Enforce secure symmetric ciphers
			  Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
			  
			  # Enforce secure MAC authentication hash protocols
			  MACs hmac-sha2-512-etm@openssh.com
			  
			  # Restrict SSH tunneling interfaces
			  AllowTcpForwarding no
			  X11Forwarding no
			  
			  # Enforce Client Alive heartbeat checks to auto-disconnect inactive sessions
			  ClientAliveInterval 300
			  ClientAliveCountMax 2
			  ```
	- ## Network Socket Audits
		- Run socket inspection queries to verify that unprivileged background services are not listening on active ports:
		- ```bash
		  # Show active listening sockets with PIDs and associated executable names
		  sudo ss -ldtupN
		  ```
	- ## Firewalld Configuration
		- AlmaLinux uses **firewalld** to manage system firewall rules.
		- ```bash
		  # Enable firewalld
		  sudo systemctl enable --now firewalld
		  
		  # Open HTTP port 80 permanently
		  sudo firewall-cmd --permanent --add-service=http
		  
		  # Open port 9000 TCP permanently
		  sudo firewall-cmd --permanent --add-port=9000/tcp
		  
		  # Reload firewall state
		  sudo firewall-cmd --reload
		  
		  # Add rich rule to restrict access to port 22 to specific IP
		  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.10" port port="22" protocol="tcp" accept'
		  ```
- # Enterprise Services
  collapsed:: true
	- ## Web Servers Setup (Apache & PHP-FPM)
		- Deploy a LAMP architecture on AlmaLinux:
		- ```bash
		  # 1. Install Apache and PHP-FPM
		  sudo dnf install -y httpd php php-fpm php-mysqlnd
		  
		  # 2. Configure PHP-FPM to listen on a Unix socket
		  # File: /etc/php-fpm.d/www.conf
		  # listen = /run/php-fpm/www.sock
		  # listen.owner = apache
		  # listen.group = apache
		  # listen.mode = 0660
		  
		  # 3. Configure Apache Virtual Host block
		  # File: /etc/httpd/conf.d/site.conf
		  # <VirtualHost *:80>
		  #     ServerName site.almalinux.local
		  #     DocumentRoot /var/www/html
		  #     <Directory /var/www/html>
		  #         AllowOverride All
		  #         Require all granted
		  #     </Directory>
		  # </VirtualHost>
		  
		  # 4. Enable and start services
		  sudo systemctl enable --now httpd php-fpm
		  ```
		- ### Production Nginx Virtual Host Configuration with Hardened TLS
			- Write Nginx configurations under `/etc/nginx/conf.d/` to manage domains and load SSL parameters:
			- ```nginx
			  # File: /etc/nginx/conf.d/enterprise_app.conf
			  upstream php_sockets {
			      server unix:/run/php-fpm/www.sock;
			      keepalive 16;
			  }
			  
			  server {
			      listen 80;
			      server_name app.almalinux.local;
			      return 301 https://$host$request_uri; # Redirect HTTP requests to secure layer
			  }
			  
			  server {
			      listen 443 ssl http2;
			      server_name app.almalinux.local;
			      root /var/www/enterprise_app;
			      index index.php index.html;
			      
			      # SSL Certificate configurations
			      ssl_certificate /etc/pki/tls/certs/app_prod.crt;
			      ssl_certificate_key /etc/pki/tls/private/app_prod.key;
			      
			      # Harden TLS variables
			      ssl_protocols TLSv1.2 TLSv1.3;
			      ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
			      ssl_prefer_server_ciphers on;
			      
			      # Security headers
			      add_header X-Frame-Options "DENY";
			      add_header X-Content-Type-Options "nosniff";
			      add_header X-XSS-Protection "1; mode=block";
			      
			      location / {
			          try_files $uri $uri/ /index.php?$query_string;
			      }
			      
			      location ~ \.php$ {
			          fastcgi_split_path_info ^(.+\.php)(/.+)$;
			          fastcgi_pass php_sockets;
			          fastcgi_index index.php;
			          include fastcgi_params;
			          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
			          fastcgi_param PATH_INFO $fastcgi_path_info;
			      }
			  }
			  ```
	- ## Custom Systemd Service
		- Create a daemon configuration:
		- ```ini
		  # File: /etc/systemd/system/node-app.service
		  [Unit]
		  Description=NodeJS Application Daemon
		  After=network.target
		  
		  [Service]
		  Type=simple
		  User=apache
		  Group=apache
		  WorkingDirectory=/var/www/node-app/
		  ExecStart=/usr/bin/node /var/www/node-app/server.js
		  Restart=on-failure
		  
		  # Sandboxing Hardening parameters
		  ProtectSystem=strict
		  ProtectHome=yes
		  PrivateTmp=yes
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  # Reload systemd configuration
		  sudo systemctl daemon-reload
		  
		  # Start service
		  sudo systemctl enable --now node-app.service
		  ```
	- ## Logrotate Configurations
		- ```bash
		  # File: /etc/logrotate.d/node-app
		  /var/log/node-app/*.log {
		      daily
		      rotate 7
		      compress
		      delaycompress
		      missingok
		      notifempty
		      create 0660 apache apache
		  }
		  ```
	- ## Network Storage (NFS & Samba)
		- ### NFS Export Setup
			- ```bash
			  # 1. Install NFS server packages
			  sudo dnf install -y nfs-utils
			  
			  # 2. Add exports to /etc/exports
			  # /srv/nfs-share 192.168.1.0/24(rw,sync,no_subtree_check)
			  
			  # 3. Start service
			  sudo systemctl enable --now nfs-server
			  ```
		- ### Samba Share Setup
			- ```bash
			  # 1. Install Samba packages
			  sudo dnf install -y samba samba-common
			  
			  # 2. Edit configurations in /etc/samba/smb.conf
			  # [shares]
			  # path = /srv/samba-share
			  # writable = yes
			  # guest ok = no
			  
			  # 3. Configure credentials
			  sudo smbpasswd -a developer
			  ```
- # Security Hardening & Ethical Hacking
  collapsed:: true
	- ## SELinux Deep Dive
		- **SELinux (Security-Enhanced Linux)** is a Mandatory Access Control (MAC) system developed by the NSA and implemented in RHEL-compatible distributions.
		- Unlike standard Unix permissions (Discretionary Access Control - DAC), which depend on file owners and group flags, SELinux enforces security policies using labels applied to all processes, files, and network sockets.
		- SELinux operates in one of three modes:
			- **Enforcing**: Security policies are blocked and logged.
			- **Permissive**: Operations violating policy are allowed, but the violation is logged.
			- **Disabled**: Policy is completely inactive.
		- ```bash
		  # Check SELinux status
		  sestatus
		  
		  # Set SELinux to permissive mode temporarily
		  sudo setenforce 0
		  
		  # Set SELinux to enforcing mode temporarily
		  sudo setenforce 1
		  ```
		- ### SELinux Security Context Labels
			- Context labels follow the format: `user:role:type:level`.
			- The **type** field (e.g., `httpd_sys_content_t` for web files) is the primary target for policy enforcement, known as **Type Enforcement**.
			- If you host web files in a custom folder (e.g., `/srv/www/`), SELinux blocks Apache from reading the files because the folder inherits the default `var_t` or `usr_t` label.
			- Restore correct labels recursively:
			- ```bash
			  # 1. Set the default policy context for custom web directory
			  sudo semanage fcontext -a -t httpd_sys_content_t "/srv/www(/.*)?"
			  
			  # 2. Apply the default policy context recursively
			  sudo restorecon -Rv /srv/www/
			  ```
		- ### Compiling a Custom SELinux Type Enforcement (.te) Module
			- When security logs report policy denials (e.g., custom scripts blocked from writing logs), administrators build custom modules:
			- ```bash
			  # 1. Parse audit logs for denials and generate policy source
			  sudo grep "denied" /var/log/audit/audit.log | audit2allow -m custom_agent > custom_agent.te
			  
			  # 2. Compile policy module into package format
			  checkmodule -M -m -o custom_agent.mod custom_agent.te
			  semodule_package -o custom_agent.pp -m custom_agent.mod
			  
			  # 3. Load the custom policy package into the active kernel
			  sudo semodule -i custom_agent.pp
			  ```
	- ## Linux Audit Daemon (auditd) Hardening Rules
		- The Linux Audit Daemon (`auditd`) is responsible for writing audit records to disk. Setting up custom tracking rules ensures privilege escalation and configuration changes are recorded:
		- ### Hardened Audit Rules Configuration (`/etc/audit/rules.d/audit.rules`)
			- ```ini
			  # First, delete all existing rules
			  -D
			  
			  # Increase buffer allocation size to prevent data loss under high load
			  -b 8192
			  
			  # Failure flag: set to 1 (print warning to kernel log)
			  -f 1
			  
			  # 1. Audit modifications to system identification configurations
			  -w /etc/group -p wa -k identity_changes
			  -w /etc/passwd -p wa -k identity_changes
			  -w /etc/shadow -p wa -k identity_changes
			  -w /etc/security/opasswd -p wa -k identity_changes
			  
			  # 2. Audit network environment modifications
			  -w /etc/issue -p wa -k network_configs
			  -w /etc/issue.net -p wa -k network_configs
			  -w /etc/hosts -p wa -k network_configs
			  -w /etc/sysconfig/network -p wa -k network_configs
			  
			  # 3. Audit user logins/logouts events
			  -w /var/log/lastlog -p wa -k session_events
			  -w /var/run/utmp -p wa -k session_events
			  
			  # 4. Audit execution of SUID/SGID commands
			  -a always,exit -F arch=b64 -S execve -F path=/usr/bin/sudo -F key=priv_escalation
			  -a always,exit -F arch=b64 -S execve -F path=/usr/bin/su -F key=priv_escalation
			  ```
			- Reload the daemon rules immediately:
			- ```bash
			  # Reload the auditd service configuration
			  sudo service auditd restart
			  ```
		- ### Parsing Audit Records with ausearch and sealert
			- Auditing generates detailed binaries logs under `/var/log/audit/audit.log`. Administrators parse these files using `ausearch` and `sealert` utilities:
			- ```bash
			  # 1. Search for shadow file access attempts
			  sudo ausearch -k identity_changes -i
			  
			  # 2. Search for privilege escalation events matching specific key tag
			  sudo ausearch -k priv_escalation -i
			  
			  # 3. Search for audit logs by time windows (e.g., last 2 hours)
			  sudo ausearch -ts recent -i
			  
			  # 4. Analyze SELinux AVC denials in details using sealert (requires setroubleshoot-server package)
			  sudo sealert -a /var/log/audit/audit.log
			  ```
	- ## Fail2ban Configuration
		- ```bash
		  # Install package
		  sudo dnf install -y fail2ban
		  
		  # Configure jail defaults
		  # File: /etc/fail2ban/jail.local
		  # [sshd]
		  # enabled = true
		  # port = ssh
		  # maxretry = 3
		  
		  # Start service
		  sudo systemctl enable --now fail2ban
		  ```
	- ## CIS Security Hardening Benchmark Checklist
		- A structured checklist derived from the Center for Internet Security (CIS) benchmarks for hardening AlmaLinux server installations:
		- | Hardening Item | Configuration Target | Implementation Action |
		  |----------------|----------------------|-----------------------|
		  | **Secure Boot** | GRUB2 / UEFI boot path | Enforce custom GRUB password. |
		  | **FileSystems** | `/etc/fstab` | Set `noexec,nodev,nosuid` on `/tmp` and `/dev/shm`. |
		  | **Permissions** | System Binaries | Restrict executable access of compilers (gcc) to root only. |
		  | **Networking** | `/etc/sysctl.d/` | Disable IP redirection, enable TCP SYN cookies. |
		  | **Services** | systemd services | Disable Avahi daemon, Bluetooth, and GUI if unused. |
		  | **Auditing** | auditd configuration | Configure rules to track writes to `/etc/shadow`. |
	- ## Pentesting & Ethical Hacking Scenarios (AlmaLinux Target)
		- Security auditors analyze AlmaLinux systems using structured penetration methodologies (described in `[[Cybersecurity]]` and `[[Ethical Hacking Advanced]]`).
		- ### 1. Port Scanning & Reconnaissance
			- Run `nmap` against the target to identify active ports and services:
			- ```bash
			  # Run syn scan and service detection
			  nmap -sS -sV 192.168.1.50
			  
			  # Output results:
			  # Port 2200/tcp open  ssh     OpenSSH 8.7p1 (AlmaLinux)
			  # Port 80/tcp   open  http    nginx 1.20.1
			  ```
		- ### 2. Local Privilege Escalation via SUID Exploitation
			- If a standard user account is compromised, attackers look for vulnerable SUID binaries.
			- For example, if the `find` binary is misconfigured with SUID privileges:
			- ```bash
			  # Check permissions on find binary
			  ls -lh /usr/bin/find
			  # Output: -rwsr-xr-x 1 root root ... /usr/bin/find
			  
			  # Exploit find to spawn a root shell, bypassing standard authorization
			  /usr/bin/find . -exec /bin/sh -p \;
			  # Output: # (Root privilege prompt)
			  ```
		- ### 3. Network Sniffing Auditing
			- Audit network communications to detect plain-text credential leaks:
			- ```bash
			  # Capture traffic on eth0 interface, filtering for HTTP port 80
			  sudo tcpdump -i eth0 port 80 -vv -A
			  ```
- # DSA & System Design in Linux Kernels
  collapsed:: true
	- ## Kernel Scheduler & Memory Management Algorithms
		- AlmaLinux system administrators and kernel developers study resource allocation algorithms (detailed in `[[DSA Algo & System Design]]` and `[[System Design]]` and `[[Linux Advanced]]`) to optimize process execution speed and prevent resource fragmentation.
	- ## 1. Completely Fair Scheduler (CFS) Task Scheduling DSA
		- The Completely Fair Scheduler (CFS) is the default process scheduling engine in the Linux kernel. It models task allocation balancing using a Red-Black Tree search index.
		- ### The Scheduler Runqueue Tree Layout
			- Instead of traditional priority queues or multi-level feedback queues, CFS organizes tasks (`task_struct`) ready for execution in a time-ordered Red-Black Tree (`cfs_rq` tracking root node):
			- ```
			  CFS Scheduling Runqueue Red-Black Tree structure:
			                         [ Task C (vruntime: 45ms) ]
			                         /                         \
			             [ Task B (vruntime: 30ms) ]       [ Task D (vruntime: 60ms) ]
			             /
			  [ Task A (vruntime: 15ms) ] (Leftmost node - Selected next)
			  ```
		- ### Scheduling Logic Details
			- 1. **Virtual Runtime (vruntime)**: Each task has a virtual runtime metric, representing the amount of execution time it has received on the CPU, scaled by its priority (nice value). Tasks with lower nice values accumulate `vruntime` slower, receiving more execution time.
			- 2. **Execution Choice**: When the CPU scheduler context switches, it chooses the leftmost node in the Red-Black Tree (e.g., Task A, which has the smallest virtual runtime).
			- 3. **Tree Rebalancing**: While Task A runs, its virtual runtime increases. When it is interrupted or yields the CPU, its `vruntime` is updated, and the task is re-inserted into the Red-Black Tree. Re-insertion and lookup balances remain logarithmic: $O(\log N)$.
			- 4. **Leftmost Cache**: To avoid traversing the tree on every CPU scheduling operation, the kernel caches a direct pointer (`rb_leftmost` in the scheduler queue) to target the leftmost node, reducing lookup speed to a constant: $O(1)$.
	- ## 2. The Buddy Allocator
		- The Linux kernel allocates physical memory pages using the **Buddy Allocator** algorithm.
		- ### How the Buddy Allocator Works
			- Memory is structured into zones, and each zone maintains an array of free page lists, where the $i$-th list contains blocks of size $2^i$ pages.
			- When a process requests a block of pages of size $S$:
				- 1. The request size is rounded up to the nearest power of two: $2^k$.
				- 2. The allocator checks the free list of order $k$. If a block is available, it is allocated immediately.
				- 3. If the list of order $k$ is empty, the allocator searches higher-order lists ($k+1, k+2, \dots$).
				- 4. Once a larger block is found (e.g., at order $k+2$), it is split in half (creating two "buddies"). One buddy is returned to the lower order list, and the remaining half is split again until a block of order $k$ is obtained.
				- 5. When a block is freed, the allocator checks if its buddy is also free. If so, they are coalesced back into a single larger block of order $k+1$.
			- Allocator blocks:
			- ```
			  Initial Free Memory Pool (Order 3 - 8 Pages):
			  [ Page 0 | Page 1 | Page 2 | Page 3 | Page 4 | Page 5 | Page 6 | Page 7 ] (Free)
			  
			  Request Order 1 (2 Pages):
			  - Split Order 3 block into two Order 2 buddies (Pages 0-3 and Pages 4-7).
			  - Split Pages 0-3 Order 2 block into two Order 1 buddies (Pages 0-1 and Pages 2-3).
			  - Allocate Pages 0-1 Order 1 block.
			  
			  Allocated State:
			  [ Pages 0-1 (Allocated) ] [ Pages 2-3 (Free Order 1) ] [ Pages 4-7 (Free Order 2) ]
			  ```
	- ## 3. The Slab / Slub Allocator
		- Allocating memory at page granularity (typically 4 KB) is inefficient for small kernel objects (such as process descriptors, file system inodes, or network buffers) and leads to **internal fragmentation**.
		- The **Slab Allocator** solves this by requesting pages from the Buddy Allocator and carving them into smaller, fixed-size object caches.
		- ### Slab States
			- **Full**: All objects in the slab are allocated.
			- **Partial**: Contains both allocated and free objects (lookups prioritize partial slabs to optimize memory reuse).
			- **Empty**: All objects are free; the slab can be returned to the Buddy Allocator.
		- ### SLUB Allocator
			- Modern Linux Kernels (including AlmaLinux's kernel) use the simplified **SLUB** allocator. It removes metadata descriptors from the slab queues, tracking slab page states directly in the page structure. This reduces overhead and improves CPU cache usage.
		- ### Slab Merging Optimization
			- To optimize kernel memory allocations, the SLUB allocator dynamically merges different caches if they share compatible object sizes and flags. This reduces the number of separate cache objects and simplifies CPU cache line management.
	- ## 4. Page Replacement Algorithm (LRU active/inactive list)
		- When the system runs out of physical memory, the page-reclaim daemon (`kswapd`) identifies pages to evict using the **Least Recently Used (LRU)** algorithm.
		- The kernel manages pages using two circular doubly linked lists:
			- **Active List**: Pages that have been accessed recently.
			- **Inactive List**: Pages that are candidates for eviction.
		- When a page in the inactive list is accessed twice, it is promoted to the active list. Conversely, pages in the active list that have not been accessed recently are demoted to the inactive list. This dual-list mechanism prevents one-off file reads from flushing important application pages out of memory.
	- ## 5. Virtual Memory Page Tables & TLB Architecture
		- Physical and virtual system memory layouts are mapped using hierarchical page tables:
		- ```
		  Virtual Address Space (64-bit Canonical layout):
		  [ Page Global Dir (PGD) ] -> [ Page Upper Dir (PUD) ] -> [ Page Middle Dir (PMD) ] -> [ Page Table Entry (PTE) ] -> [ Offset ]
		  ```
		- ### 4-Level Paging Lookup Mechanism
			- 1. The CPU loads the base physical address of the Page Global Directory (PGD) from register `CR3` for the active process.
			- 2. Bits `47-39` of the virtual address select an entry in the PGD pointing to the Page Upper Directory (PUD).
			- 3. Bits `38-30` select an entry in the PUD pointing to the Page Middle Directory (PMD).
			- 4. Bits `29-21` select an entry in the PMD pointing to the Page Table Entry (PTE).
			- 5. Bits `20-12` select the physical page frame address from the PTE.
			- 6. Bits `11-0` (the offset) select the precise byte address inside the 4 KB page frame.
		- ### Translation Lookaside Buffer (TLB) Page Walks
			- Because traversing a 4-level page table requires five physical memory accesses for a single instruction read/write, hardware processors cache recent translation maps in the **TLB**.
			- If translation keys match inside the TLB (TLB Hit), translations occur immediately. If no translation keys are found (TLB Miss), hardware logic must perform a Page Walk, loading entries from memory nodes, leading to execution latency.
		- ### Page Fault Handler Flow (Major vs Minor Page Faults)
			- When the processor executes a virtual address access that is not currently mapped or loaded in RAM:
				- 1. The MMU raises a hardware page fault exception, saving the faulting address in control register `CR2`.
				- 2. The CPU context switches to the kernel exception handler `do_page_fault()`.
				- 3. The handler checks the virtual memory areas (VMAs) of the process to verify that the address is legal.
				- 4. **Minor Page Fault**: If the memory block exists in the physical Page Cache (or is a clean anonymous mapping) but does not have page table entries linked yet, the handler maps the page descriptors directly into the page tables. No disk reads occur.
				- 5. **Major Page Fault**: If the data must be read from secondary storage (e.g., loading executable binary blocks or swapped pages), the handler suspends the process, initiates a block I/O read from disk to memory, and configures the translation mapping once loaded.
	- ## 6. Memory Slab Cache Creation (VFS Inode Caching Example)
		- The kernel creates specialized slab caches dynamically. The Virtual Filesystem (VFS) layer uses caches to allocate inodes:
		- ```c
		  // Kernel-level slab cache declaration:
		  struct kmem_cache *inode_cachep;
		  
		  // Initialize the inode cache structure
		  void init_inode_cache(void) {
		      inode_cachep = kmem_cache_create(
		          "inode_cache",               // Cache name descriptor
		          sizeof(struct inode),        // Object size in bytes
		          0,                           // Align offset
		          SLAB_HWCACHE_ALIGN | SLAB_PANIC, // Hardened CPU cache alignments
		          inode_init_once              // Constructor function pointer
		      );
		  }
		  ```
	- ## Completely Fair Scheduler Simulation (C Implementation)
		- This program simulates a Completely Fair Scheduler (CFS) runqueue using a binary search tree layout (nodes representing tasks with runtime keys). It prevents integer overflows during midpoint calculations:
		- ```c
		  #include <stdio.h>
		  #include <stdlib.h>
		  #include <string.h>
		  
		  struct task_node {
		      int pid;
		      int vruntime; // Target search key
		      struct task_node *left;
		      struct task_node *right;
		  };
		  
		  // Create a new task node
		  struct task_node *new_task(int pid, int vruntime) {
		      struct task_node *node = (struct task_node *)malloc(sizeof(struct task_node));
		      node->pid = pid;
		      node->vruntime = vruntime;
		      node->left = NULL;
		      node->right = NULL;
		      return node;
		  }
		  
		  // Insert task into time-ordered runqueue
		  struct task_node *insert_task(struct task_node *root, struct task_node *node) {
		      if (root == NULL) return node;
		      
		      if (node->vruntime < root->vruntime) {
		          root->left = insert_task(root->left, node);
		      } else {
		          root->right = insert_task(root->right, node);
		      }
		      return root;
		  }
		  
		  // Find leftmost task in runqueue (smallest vruntime)
		  struct task_node *find_leftmost_task(struct task_node *root) {
		      struct task_node *current = root;
		      if (current == NULL) return NULL;
		      
		      while (current->left != NULL) {
		          current = current->left;
		      }
		      return current;
		  }
		  
		  // Remove task from runqueue
		  struct task_node *remove_task(struct task_node *root, int vruntime) {
		      if (root == NULL) return root;
		      
		      if (vruntime < root->vruntime) {
		          root->left = remove_task(root->left, vruntime);
		      } else if (vruntime > root->vruntime) {
		          root->right = remove_task(root->right, vruntime);
		      } else {
		          // Node with only one child or no child
		          if (root->left == NULL) {
		              struct task_node *temp = root->right;
		              free(root);
		              return temp;
		          } else if (root->right == NULL) {
		              struct task_node *temp = root->left;
		              free(root);
		              return temp;
		          }
		          
		          // Node with two children: Get inorder successor
		          struct task_node *temp = find_leftmost_task(root->right);
		          root->vruntime = temp->vruntime;
		          root->pid = temp->pid;
		          root->right = remove_task(root->right, temp->vruntime);
		      }
		      return root;
		  }
		  
		  // Print runqueue in execution order
		  void print_runqueue(struct task_node *root) {
		      if (root != NULL) {
			  print_runqueue(root->left);
			  printf("Task PID: %d (vruntime: %d ms)\n", root->pid, root->vruntime);
			  print_runqueue(root->right);
		      }
		  }
		  
		  int main() {
		      printf("=== CFS RUNQUEUE TREE SIMULATION ===\n");
		      struct task_node *runqueue = NULL;
		      
		      // Insert tasks into execution runqueue tree
		      runqueue = insert_task(runqueue, new_task(101, 45));
		      runqueue = insert_task(runqueue, new_task(102, 15));
		      runqueue = insert_task(runqueue, new_task(103, 30));
		      runqueue = insert_task(runqueue, new_task(104, 60));
		      
		      printf("\nTime-Ordered Tasks in Runqueue:\n");
		      print_runqueue(runqueue);
		      
		      // Select leftmost task for execution
		      struct task_node *next_task = find_leftmost_task(runqueue);
		      if (next_task != NULL) {
			  printf("\n[SCHEDULE] Dispatching leftmost task PID %d (vruntime: %d ms) to CPU\n", next_task->pid, next_task->vruntime);
			  
			  // Simulate execution: increment vruntime and reinsert
			  int old_vruntime = next_task->vruntime;
			  int pid = next_task->pid;
			  
			  runqueue = remove_task(runqueue, old_vruntime);
			  runqueue = insert_task(runqueue, new_task(pid, old_vruntime + 25)); // Run task for 25ms
		      }
		      
		      printf("\nUpdated Runqueue after scheduling execution cycle:\n");
		      print_runqueue(runqueue);
		      
		      // Clean memory
		      while (runqueue != NULL) {
			  struct task_node *leftmost = find_leftmost_task(runqueue);
			  runqueue = remove_task(runqueue, leftmost->vruntime);
		      }
		      
		      return 0;
		  }
		  ```
	- ## Memory Management Design Trade-offs
		- | Allocator | Minimum Unit | Search Complexity | Fragmentation Type | Primary Use Case |
		  |-----------|--------------|-------------------|--------------------|------------------|
		  | **Buddy Allocator** | 1 Page (4 KB) | $O(\log N)$ | External (splits blocks) | Page frame allocation from physical RAM |
		  | **Slab/Slub Allocator**| Variable (Bytes)| $O(1)$ (Cache reuse) | Internal (fixed sizes) | Kernel object caches (inodes, sockets) |
		  | **LRU Dual List** | 1 Page (4 KB) | $O(N)$ (Queue scanning)| N/A | Memory reclaiming and swapping cache |
- # More Learn
	- ## Github & Webs
		- [Official AlmaLinux Project Website](https://almalinux.org/) - Official downloads, security mirrors, news.
		- [AlmaLinux Wiki & Documentation](https://wiki.almalinux.org/) - Comprehensive user and administrator wikis.
		- [AlmaLinux OS Foundation GitHub](https://github.com/AlmaLinux) - Public source repositories and build scripts.
		- [ELevate Migration Project Documentation](https://wiki.almalinux.org/elevate/) - ELevate migration guides and packages.
		- [Rocky Linux and RHEL Ecosystem Info](https://rockylinux.org/) - Context on Rocky and RHEL configurations.
	- ## Master Playlists YouTube
		- [Red Hat Enterprise Linux Server Administration Full Course - FreeCodeCamp](https://www.youtube.com/watch?v=wBp0Rb-68lY) - RHEL/AlmaLinux system administration guides.
		- [SELinux Deep Dive and Policies Management - Sander van Vugt](https://www.youtube.com/user/sandervanvugt) - Video guides for troubleshooting and building SELinux policies.
		- [Linux Kernel Virtual Memory and Scheduler Internals - Sander van Vugt](https://www.youtube.com/user/sandervanvugt) - Video guides for memory cache layouts, slabs, and schedulers.
		- [Linux Command Line and Shell Scripting Bible - Richard Blum](https://www.amazon.com/Linux-Command-Shell-Scripting-Bible/dp/1119700914) - Recommended reference book for terminal commands and scripting automation.
