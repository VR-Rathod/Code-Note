---
seoTitle: OpenBSD Security Hardening, PF Firewall & Sandboxing Guide
description: "Comprehensive OpenBSD reference covering kernel security (KARL, W^X), pledge and unveil sandboxing, PF firewall rules, softraid encryption, and package management."
keywords: "OpenBSD, OpenBSD pledge, OpenBSD unveil, PF firewall, LibreSSL, OpenSSH, doas, softraid, vmd, OpenBSD guide, OpenBSD tutorial, OpenBSD administration, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: OpenBSD – Complete Guide
enableToc: true
comments: true
---

- # History
  collapsed:: true
	- ## Theo de Raadt and the NetBSD Split (1994–1995)
		- OpenBSD was founded by **Theo de Raadt** in **late 1995**.
		- De Raadt was one of the co-founders of the [[NetBSD]] project, but after differences in opinion regarding development direction, release coordination, and project management, he was asked to resign from the NetBSD core group.
		- In response, de Raadt decided to fork NetBSD 1.0 to create a new project. The first official release, **OpenBSD 1.2**, was shipped in **July 1996**, followed quickly by OpenBSD 2.0 in October 1996.
		- The project was established with a flat organizational model where Theo de Raadt acts as the lead coordinator, making design decisions with inputs from committers.
	- ## Security Auditing and the "Secure by Default" Philosophy (1996–Present)
		- From its inception, the OpenBSD project focused on a proactive approach to security: **systematic source code auditing**.
		- The developers began auditing the entire codebase line-by-line, searching for security vulnerabilities, buffer overflows, and race conditions.
		- This audit led to the design of the famous slogan: *"Only two local vulnerabilities in the default install, in a heck of a long time!"* (originally zero, then one, and now two over more than 25 years of distribution).
		- Security was integrated as a default design constraint; services that could be disabled were turned off by default, and cryptographic tools were integrated directly into the base system.
		- Security advisories are numbered sequentially per release (e.g. `001_syspatch` or `002_pf`) and are accompanied by source code patches.
	- ## The Cryptographic Export Regulations Conflict
		- During the late 1990s, the United States government restricted the export of strong cryptographic software (treating it as munitions).
		- To bypass these legal restrictions, Theo de Raadt established the OpenBSD project in **Calgary, Canada**.
		- The cryptographic libraries and code were written and hosted on servers located outside the USA, enabling OpenBSD to ship with full-strength encryption protocols worldwide without legal complications.
		- This international development structure allowed OpenBSD to lead the implementation of cryptographically secure daemons globally.
	- ## Genesis of OpenSSH, LibreSSL, and OpenBGPD
		- OpenBSD has spawned several critical, widely-used open-source software tools:
		- **OpenSSH (1999)**: When licensing issues affected the SSH program, OpenBSD developers wrote a secure fork. Today, OpenSSH is the default secure remote administration standard across almost all Linux, macOS, and BSD systems.
		- **OpenBGPD / OpenOSPFD (2004)**: Secure, clean routing daemon alternatives built to replace complex legacy daemons.
		- **LibreSSL (2014)**: Following the devastating Heartbleed security vulnerability in OpenSSL, the OpenBSD team forked the codebase to create LibreSSL, cleaning up decades of legacy code and APIs to enforce modern security standards.
		- **OpenNTPD (2004)**: A secure, clean implementation of the Network Time Protocol (NTP), designed to run as a sandboxed process.
	- ## OpenBSD Release Timeline and Architecture Mapping
		- The table outlines major OpenBSD releases, including their hardware support and life status:
		- | Marketing Release | Kernel Version | Release Year | Main CPU Architectures | Status |
		  |-------------------|----------------|--------------|------------------------|--------|
		  | OpenBSD 2.0 | 2.0-RELEASE | 1996 | i386, SPARC, Alpha, HP300 | End of Life (EOL) |
		  | OpenBSD 3.0 | 3.0-RELEASE | 2001 | i386, alpha, sparc64, macppc | End of Life (EOL) |
		  | OpenBSD 4.0 | 4.0-RELEASE | 2006 | i386, amd64, sparc64, macppc | End of Life (EOL) |
		  | OpenBSD 5.0 | 5.0-RELEASE | 2011 | i386, amd64, sparc64, armish | End of Life (EOL) |
		  | OpenBSD 6.0 | 6.0-RELEASE | 2016 | amd64, i386, arm64, octeon | End of Life (EOL) |
		  | OpenBSD 7.0 | 7.0-RELEASE | 2021 | amd64, arm64, i386, riscv64 | End of Life (EOL) |
		  | OpenBSD 7.4 | 7.4-RELEASE | 2023 | amd64, arm64, i386, powerpc | End of Life (EOL) |
		  | OpenBSD 7.5 | 7.5-RELEASE | 2024 | amd64, arm64, riscv64, octeon | Active Support |
		  | OpenBSD 7.6 | 7.6-RELEASE | 2024 | amd64, arm64, riscv64, octeon | Active Support |
		  | OpenBSD 7.7 | 7.7-CURRENT | 2025 | amd64, arm64, riscv64 | Development |
- # Introduction
  collapsed:: true
	- ## What is OpenBSD?
		- OpenBSD is a free and open-source operating system descended from Berkeley Software Distribution (BSD) Unix, focusing on **security, code correctness, and cryptography**.
		- Like [[FreeBSD]], OpenBSD is developed as a single, cohesive repository hosting both the kernel and core userland utilities.
		- OpenBSD is widely recognized as a premier security operating system, serving as the development home for OpenSSH, LibreSSL, and the PF (Packet Filter) firewall.
	- ## POSIX Compliance and Standards
		- OpenBSD adheres strictly to the POSIX standards (IEEE Std 1003.1), prioritizing standard behavior over custom OS extensions.
		- The project rejects features that increase system complexity at the cost of security audits, meaning it occasionally drops support for obsolete or overly complex POSIX APIs.
	- ## BSD License vs GPL
		- Released under the permissive BSD License, OpenBSD permits modification and commercial integration without copyleft restrictions.
		- This has allowed companies like Cisco, Juniper, and various cloud providers to integrate OpenSSH and OpenBSD components into their commercial routing and hypervisor products.
	- ## Core Advantages of OpenBSD
		- **Security Hardening by Default**: Includes proactive defense technologies like KARL, W^X, malloc guard pages, and sandboxing APIs (`pledge` and `unveil`).
		- **High Code Quality**: The entire codebase undergoes continuous security audits, resulting in clean, readable source code.
		- **PF Firewall Integration**: Serves as the native home of the **PF firewall**, which features clean syntax and robust packet inspection.
		- **Cohesive Base System**: Includes secure, built-in services like OpenSMTPD, OpenNTPD, and iked, eliminating the need to install third-party mail, time, or VPN packages.
	- ## Core Disadvantages of OpenBSD
		- **Performance Trade-offs**: In multi-core CPU environments, OpenBSD's symmetric multiprocessing (SMP) throughput can be slower than FreeBSD's or Linux's due to a focus on security checks over raw speed.
		- **No Native OpenZFS Support**: Due to CDDL licensing conflicts and memory management choices, OpenZFS is not natively supported in the base install, relying instead on the traditional FFS (Fast File System).
		- **Slower Driver Porting**: Graphics acceleration drivers (DRM/KMS) and high-speed wireless drivers are ported from Linux, occasionally resulting in delay support cycles.
	- ## Comparison: OpenBSD vs FreeBSD vs Linux vs macOS
		- The table highlights core differences between the operating systems:
		- | Feature | OpenBSD | FreeBSD | Linux (e.g., Debian) | macOS |
		  |---------|---------|---------|-----------------------|-------|
		  | **Primary Focus** | Proactive security & audits | High-performance storage/net | General-purpose use | Consumer desktop UI |
		  | **Sandboxing API** | `pledge` / `unveil` | Capsicum (Capabilities) | Seccomp / Namespaces | App Sandbox (TCC) |
		  | **Default Firewall** | PF (Packet Filter) | PF / IPFW / IPFilter | Netfilter (nftables) | PF (Packet Filter) |
		  | **Binary Package Tool** | `pkg_add` | `pkg` | APT / DNF | Homebrew |
		  | **Filesystem Default** | FFS (Fast File System) | OpenZFS / UFS2 | Ext4 / Btrfs | APFS |
		  | **Default Shell** | Ksh (Korn Shell) | `sh` (Bourne Shell) | Bash | Zsh |
		  | **Privilege Tool** | `doas` | `su` / `sudo` | `sudo` | `sudo` |
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum (CLI / Server):
		    CPU:   amd64, arm64, i386, or powerpc
		    RAM:   512 MB minimum (2 GB recommended)
		    Disk:  2 GB minimum space
		    Network: Ethernet interface card
		  
		  Recommended (Workstation / Router):
		    CPU:   Intel/AMD 64-bit multi-core processor
		    RAM:   8 GB or higher
		    Disk:  50 GB SSD storage
		  ```
	- ## Download and Verification
		- ```bash
		  # Download the official OpenBSD install image
		  # Fetch the SHA256 checksum file to verify download integrity
		  fetch https://cdn.openbsd.org/pub/OpenBSD/7.6/amd64/install76.img
		  fetch https://cdn.openbsd.org/pub/OpenBSD/7.6/amd64/SHA256
		  
		  # Validate the checksum matches on a Unix-like system
		  sha256sum -c SHA256 --ignore-missing
		  
		  # Burn image to a USB flash drive
		  sudo dd if=install76.img of=/dev/sdX bs=1M status=progress
		  sync
		  ```
	- ## The Interactive CLI Installer (bsd.rd)
		- OpenBSD boots into a lightweight ramdisk installer named `bsd.rd`.
		- The installer uses a clean, text-based interactive wizard that asks questions to guide the setup:
		- 1. Select install mode: `(I)nstall`, `(U)pgrade`, or `(A)utoinstall`.
		- 2. Select keyboard layout (e.g., `us`).
		- 3. Set hostname (e.g., `openbsd-server`).
		- 4. Select network interface configuration (IP address, routing gateways).
		- 5. Set root password and configure sshd auto-start.
		- 6. Partition disks using `fdisk` and `disklabel`.
		- 7. Install system file packages (called sets: `base76.tgz`, `comp76.tgz`, `game76.tgz`, `xbase76.tgz`).
	- ## Partitioning Layout: softraid Encrypted Setup
		- Rather than formatting a raw drive, security-focused administrators configure encrypted volumes using OpenBSD's **softraid** subsystem:
		- ```bash
		  # Enter shell from the installer prompt
		  # 1. Initialize partition layout on disk 'sd0'
		  fdisk -iy sd0
		  
		  # 2. Create a disklabel with partition 'a' as RAID type
		  disklabel -E sd0
		  # (Add partition 'a' spanning the entire disk, type 'RAID')
		  
		  # 3. Create an encrypted softraid container on partition 'sd0a'
		  bioctl -c C -l sd0a softraid0
		  # (Enter passphrase to encrypt the volume)
		  
		  # 4. The system maps the new decrypted container to virtual disk 'sd1'
		  # Exit shell and return to installer, choosing 'sd1' as installation target disk
		  exit
		  ```
	- ## Automated Installation Template (install.conf)
		- OpenBSD supports unattended hands-off installations using an `install.conf` responses script loaded over floppy, disk, or HTTP:
		- ```ini
		  # /etc/install.conf responses template
		  System hostname = openbsd-server
		  Password for root = $1$hashed_password_here$
		  Change the default console to com0 = no
		  Setup a user = sysadmin
		  Password for user = $1$user_hashed_password$
		  Allow root ssh login = no
		  What timezone are you in = US/Eastern
		  Location of sets = http
		  HTTP Server = cdn.openbsd.org
		  Server directory = pub/OpenBSD/7.6/amd64
		  Set name(s) = +* -game*
		  ```
	- ## First Boot Configuration and syspatch updates
		- Upon booting into a fresh OpenBSD install:
		- **syspatch**: OpenBSD's binary patching system. It fetches pre-compiled security and errata patches from official servers and applies them to the base system instantly.
		- **doas**: A lightweight alternative to `sudo` developed for OpenBSD. Configured via `/etc/doas.conf`.
		- ```bash
		  # Check for and apply system security patches on first boot
		  sudo syspatch
		  
		  # Configure doas to permit your user 'sysadmin' to run administrative commands
		  # Create the file /etc/doas.conf
		  echo "permit keepenv :wheel" | sudo tee /etc/doas.conf
		  
		  # Test doas privilege escalation
		  doas pkg_add -u
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Monolithic Design with KARL (Kernel Address Randomized Link)
		- OpenBSD uses a monolithic kernel architecture where all drivers, filesystems, and memory allocators run inside a single supervisor address space.
		- To protect the kernel from exploit code injection attacks, OpenBSD implements **KARL** (Kernel Address Randomized Link) on every boot:
		- During a normal boot or update, the system relinks the kernel object files in a completely randomized order.
		- Each boot runs a unique kernel binary with different internal function offsets, preventing attackers from relying on static memory addresses to jump into shellcode.
	- ## W^X (Write XOR Execute) Memory Enforcements
		- **W^X** is a security enforcement policy implemented at the hardware page table level.
		- A page of memory can be writeable, or executable, but **never both at the same time**.
		- This prevents stack overflows from writing execution payloads into stack space and running them, blocking standard buffer overflow exploit vectors.
		- Attempting to violate W^X results in immediate process termination by the kernel:
		- ```bash
		  # If a process attempts to allocate memory that is both writeable and executable:
		  # Kernel raises a SIGSEGV signal and logs the violation to system logs:
		  # dmesg | tail -n 2
		  # app[1025] mprotect: W^X violation
		  ```
	- ## Hardened Memory Allocator: malloc protections
		- OpenBSD's userspace memory allocator (`malloc`) is built from the ground up with defensive features designed to break exploit payloads:
		- **Guard Pages**: Places unmapped pages (guard pages) before and after memory block allocations. Accessing these pages triggers an immediate core dump, blocking heap overflow indexing.
		- **Address Randomization**: Randomizes heap allocations, preventing memory layouts from being predicted.
		- **Junk Filling**: Fills newly allocated memory with junk bytes (`0xdb`) and writes junk bytes (`0xdf`) to memory upon being freed. This breaks applications relying on uninitialized variables or trying to read freed buffers (use-after-free).
		- **Control variables**: Users control allocator options using the `MALLOC_OPTIONS` environment variable:
		- ```bash
		  # Run an application enabling extra heap checks and junking
		  export MALLOC_OPTIONS="J"
		  ./my_app
		  ```
	- ## System Startup Boot Flow
		- The boot sequence is designed for verification:
		- 1. **BootROM/UEFI**: Loads the early boot loader code from disk.
		- 2. **boot (2nd Stage Bootloader)**: Initializes early system parameters and loads the kernel (`/bsd`).
		- 3. **Kernel Initialization**: Mounts the root directory (FFS) and spawns the first user space process, `init` (PID 1).
		- 4. **init (PID 1)**: Spawns the startup shell executing `/etc/rc` configuration directives.
		- 5. **rc.d Scripts**: Reads service configurations from `/etc/rc.conf.local` and starts system services.
	- ## OpenBSD Boot Process Flow
		- The diagram outlines the secure boot sequence of an OpenBSD system:
		- ```mermaid
		  flowchart TD
		      HW[Power On / BIOS / UEFI] --> BOOT[Boot Loader /boot]
		      BOOT --> KARL[KARL Execution\nRelinks kernel in random order]
		      KARL --> KERN[Kernel Starts\n/bsd execution]
		      KERN --> INIT[init Spawning\nPID 1 Created]
		      INIT --> RC[rc.d Daemon Scripts\nProcesses config from rc.conf.local]
		      RC --> LOG[getty Terminals\nLogin Shell Prompt]
		  
		      style HW fill:#1a202c,color:#fff
		      style KARL fill:#9b2c2c,color:#fff
		      style RC fill:#276749,color:#fff
		      style LOG fill:#744210,color:#fff
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Korn Shell (Ksh) Environment
		- The Korn Shell (`ksh`) is the default shell for both the root user and standard system accounts on OpenBSD.
		- ksh is POSIX-compliant, extremely lightweight, and has a smaller memory footprint than Bash or Zsh.
	- ## Shell Customization
		- Ksh configurations are defined in the user's home profile directory:
		- ```bash
		  # ~/.profile configuration parameters
		  export HISTFILE=$HOME/.ksh_history
		  export HISTSIZE=1000
		  
		  # Set interactive visual prompt showing host and current path
		  PS1='[OpenBSD] $USER:$PWD $ '
		  
		  # Enable vi-style terminal command line editing
		  set -o vi
		  
		  # Set default editor path
		  export EDITOR=vi
		  ```
	- ## Unix Permissions and File Flags
		- In addition to standard owner/group file permissions, OpenBSD supports file flags via the `chflags` command:
		- `schg`: System Immutable flag. Can only be altered when the system is in single-user mode or securelevel is <= 0.
		- `sappnd`: System Append-only flag. Permits appending text to log files, but blocks modifications and deletions.
		- ```bash
		  # Lock a critical configuration file using the system immutable flag
		  sudo chflags schg /etc/resolv.conf
		  
		  # Lock syslog logs to prevent attackers from deleting evidence of intrusion
		  sudo chflags sappnd /var/log/messages
		  ```
- # User & Group Management
  collapsed:: true
	- ## The Account Database Structures
		- OpenBSD stores password data inside `/etc/master.passwd`, which is protected from read permissions for non-privileged accounts.
		- Passwords are hashed using the **bcrypt** algorithm (which was invented by OpenBSD developers in 1999). Bcrypt uses a configurable cost parameter to slow down dictionary and brute force attacks.
	- ## Account Management Commands
		- Users are managed using standard Unix utilities:
		- ```bash
		  # Add a new group 'admins'
		  sudo groupadd -g 1010 admins
		  
		  # Create a new user with home directory, shell, and primary group
		  sudo useradd -u 1010 -g admins -m -s /bin/ksh -c "System Administrator" sysadmin
		  
		  # Set user password
		  sudo passwd sysadmin
		  
		  # Add 'sysadmin' to the wheel group (required to switch to root shell)
		  sudo usermod -G wheel sysadmin
		  
		  # Delete a user account and purge their files
		  sudo userdel -r sysadmin
		  ```
	- ## Using doas for Privilege Escalation
		- OpenBSD developed `doas` as a secure, simple replacement for `sudo`.
		- Its configuration file is `/etc/doas.conf`, which uses a strict syntax:
		- ```
		  # /etc/doas.conf examples
		  # 1. Allow wheel group members to execute commands as root, keeping their environment variables
		  permit keepenv :wheel
		  
		  # 2. Allow user 'operator' to restart the web server without entering a password
		  permit nopass operator as root cmd rcctl args restart nginx
		  ```
	- ## Login Classes (/etc/login.conf)
		- OpenBSD groups users into login classes to configure system resource limit profiles:
		- ```ini
		  # /etc/login.conf section entry example
		  # Limit memory and process boundaries for developer classes
		  developers:\
		          :datasize-max=2048M:\
		          :datasize-cur=1024M:\
		          :maxproc-max=512:\
		          :openfiles-cur=1024:\
		          :tc=default:
		  ```
- # System Configuration & Services (rc.d)
  collapsed:: true
	- ## The rcctl Service Management Tool
		- OpenBSD uses a unified CLI utility named `rcctl` to enable, disable, configure, and monitor system services.
		- System services are defined in `/etc/rc.d/` and configured in `/etc/rc.conf.local`.
		- ```bash
		  # Enable a service (e.g., nginx) to start on boot
		  doas rcctl enable nginx
		  
		  # Start the service immediately
		  doas rcctl start nginx
		  
		  # Check service running status
		  rcctl check nginx
		  
		  # Reload service configurations without stopping execution
		  doas rcctl reload nginx
		  
		  # Restart the service
		  doas rcctl restart nginx
		  
		  # Disable the service
		  doas rcctl disable nginx
		  
		  # Change service startup flags (e.g., run httpd in chroot mode)
		  doas rcctl set httpd flags "-v"
		  ```
	- ## The /etc/rc.conf.local Configuration File
		- OpenBSD reserves `/etc/rc.conf` for default system services.
		- Custom services and configuration overrides are written to `/etc/rc.conf.local`:
		- ```bash
		  # Example /etc/rc.conf.local entries
		  pkg_scripts="nginx postgresql"
		  sshd_flags=""
		  ntpd_flags="-s"
		  ```
	- ## System Configuration Files Map
		- `/etc/sysctl.conf`: Adjusts kernel runtime settings.
		- `/etc/resolv.conf`: Configures DNS nameserver lookups.
		- `/etc/hosts`: Configures static IP-to-hostname mappings.
		- `/etc/myname`: Configures the system's hostname (e.g., `server.example.com`).
		- `/etc/mygate`: Configures the system's default network gateway.
	- ## Writing a Custom rc.d Script
		- Save this template as `/etc/rc.d/customapp` to manage a custom daemon:
		- ```bash
		  #!/bin/ksh
		  #
		  # Custom daemon startup script
		  
		  daemon="/usr/local/bin/custom_service"
		  daemon_flags="--daemon --config /etc/custom.conf"
		  
		  . /etc/rc.d/rc.subr
		  
		  # Custom pre-start validation function
		  rc_pre() {
		      if [ ! -f "/etc/custom.conf" ]; then
		          return 1
		      fi
		  }
		  
		  rc_cmd $1
		  ```
		- ```bash
		  # Make executable
		  doas chmod +x /etc/rc.d/customapp
		  
		  # Enable and start the service
		  doas rcctl enable customapp
		  doas rcctl start customapp
		  ```
- # Package Management & Ports Collection
  collapsed:: true
	- ## Package Managers (pkg_add, pkg_delete, pkg_info)
		- OpenBSD manages binary packages using the `pkg_*` command suite:
		- ```bash
		  # Configure repository mirrors by writing to /etc/installurl
		  # Example: https://cdn.openbsd.org/pub/OpenBSD
		  
		  # Install a binary package (e.g., git)
		  doas pkg_add git
		  
		  # Search for a package matching a keyword
		  pkg_info -Q nmap
		  
		  # List all installed packages
		  pkg_info
		  
		  # Query which package installed a specific file path
		  pkg_info -E /usr/local/bin/git
		  
		  # Update all installed packages to their latest versions
		  doas pkg_add -u
		  
		  # Uninstall a package
		  doas pkg_delete git
		  
		  # Remove unused dependencies and clean package database
		  doas pkg_delete -a
		  ```
	- ## Proxy Settings for pkg_add
		- If accessing internet resources through an enterprise gateway, define proxy paths:
		- ```bash
		  # Configure shell HTTP proxy path configurations
		  export http_proxy="http://proxy.example.com:8080"
		  export ftp_proxy="http://proxy.example.com:8080"
		  ```
	- ## The Ports Collection
		- The ports tree contains makefile build configurations to compile packages from source:
		- ```bash
		  # Clone the ports tree
		  cd /usr
		  doas cvs -qd anoncvs@anoncvs.ca.openbsd.org:/cvs checkout -P ports
		  
		  # Navigate to the target port (e.g., net/nmap)
		  cd /usr/ports/net/nmap
		  
		  # Compile from source and install
		  doas make install clean
		  ```
	- ## Package Cryptographic Signature Validation
		- To prevent package tampering, OpenBSD requires all binary packages to be cryptographically signed.
		- The package system uses **signify** (a tool developed by OpenBSD) to sign packages using public/private key pairs.
		- If a downloaded package does not match the signature keys stored in `/etc/signify/`, the installer rejects it:
		- ```bash
		  # Check signature key files for OpenBSD release
		  ls -la /etc/signify/
		  # Output: openbsd-76-base.pub, openbsd-76-pkg.pub
		  ```
- # Storage & Filesystems (FFS & softraid)
  collapsed:: true
	- ## FFS (Fast File System) and Soft Updates
		- OpenBSD uses the **Fast File System (FFS)** as its default filesystem.
		- To optimize metadata write speeds without risking data corruption during sudden power losses, FFS utilizes **Soft Updates**.
		- Soft Updates calculates dependency relationships for metadata updates, ensuring they are written to disk in a logical order that prevents filesystem corruption, eliminating the need for journaling.
		- ```bash
		  # Check filesystem configurations in /etc/fstab
		  # Example line:
		  # /dev/sd0a / ffs rw,wxallowed,softdep 1 1
		  # (softdep indicates Soft Updates is active)
		  ```
	- ## Encrypting Swap Space
		- To prevent sensitive memory fragments (such as encryption keys or user credentials) from being written to swap space in cleartext, OpenBSD encrypts swap pages by default.
		- During every boot, the kernel generates a new, random cryptographic key for swap space, making swap data unreadable after reboot.
	- ## softraid Crypto Partition Encryption
		- OpenBSD manages disk encryption using the `softraid` subsystem, which wraps partitions in a virtual encrypted container:
		- ```bash
		  # 1. Initialize softraid partition SD0
		  # 2. Attach partition SD0 to biomgr driver to create virtual container SD1
		  # 3. Mount filesystem onto virtual container disk partition 'sd1a'
		  
		  # Check the status of encrypted softraid disks
		  bioctl softraid0
		  ```
- # Security Sandboxing: pledge & unveil
  collapsed:: true
	- ## Sandboxing Philosophy
		- OpenBSD includes two unique system calls that allow developers to sandbox applications: `pledge(2)` and `unveil(2)`.
		- Unlike complex container frameworks or security wrappers (like AppArmor or SELinux), these sandboxing features are implemented directly in the application source code.
	- ## pledge(2) System Call Constraints
		- The `pledge(2)` system call allows a process to voluntarily limit the types of system calls it can make.
		- A program declares the resources it needs (called "promises") at startup, and the kernel blocks it from making any system calls outside that set.
		- If a pledged program attempts to make an unauthorized system call (e.g., trying to initiate a network request after promising only file read access), the kernel immediately terminates the process with a `SIGABRT` signal.
	- ## Pledge Promise Categories and Syscalls Mapping
		- The table outlines the promise string parameters and the associated kernel operations they permit:
		- | Promise Name | Permitted Capabilities | Key Associated System Calls |
		  |--------------|------------------------|-----------------------------|
		  | `stdio` | Basic standard I/O and memory | `read`, `write`, `mmap`, `getpid`, `exit` |
		  | `rpath` | Read access to files | `open`, `read`, `stat`, `readlink` |
		  | `wpath` | Write access to files | `write`, `open` (write mode), `ftruncate` |
		  | `cpath` | Create/delete files | `mkdir`, `rmdir`, `unlink`, `rename` |
		  | `inet` | Network socket connections | `socket`, `connect`, `bind`, `sendto`, `recvfrom` |
		  | `exec` | Program execution | `execve`, `fork` (under strict rules) |
		  | `proc` | Process limits control | `fork`, `getprio`, `setprio`, `kill` |
		  | `flock` | File lock operations | `flock`, `fcntl` |
	- ## unveil(2) File Path Virtualization
		- The `unveil(2)` system call limits the files and directories that a process is allowed to see.
		- A program can "unveil" specific directory paths with read, write, execute, or create permissions, and the kernel blocks it from accessing any other parts of the filesystem.
		- Once a process locks its unveiled paths (by calling `unveil(NULL, NULL)`), it cannot unveil any more files.
- # Networking, Firewall & Redundancy
  collapsed:: true
	- ## Network Interface Configuration
		- OpenBSD configures network interfaces using static configuration files in `/etc/`:
		- Files follow the format `/etc/hostname.interface_name`.
		- ```bash
		  # Configure a static IP on interface card 'em0'
		  # Create/edit the file /etc/hostname.em0
		  inet 192.168.1.100 255.255.255.0 NONE
		  
		  # Configure interface to use DHCP
		  # Edit the file /etc/hostname.em0
		  dhcp
		  
		  # Start/Stop the interface
		  doas sh /etc/netstart em0
		  ```
	- ## The Native PF (Packet Filter) Firewall
		- OpenBSD is the native home of the **PF firewall**.
		- PF features a clean syntax, table structures, and robust network address translation (NAT).
	- ## Advanced PF Rule Profiles
		- Below is a production configuration profile featuring tables, port redirection (NAT), and SSH protection rules:
		- ```
		  # /etc/pf.conf configuration profile
		  ext_if = "em0"
		  web_servers = "192.168.1.10"
		  
		  table <bruteforce> persist
		  table <blocklist> persist file "/etc/blocked_ips"
		  
		  set skip on lo0
		  block all
		  
		  # Outgoing traffic tracking
		  pass out on $ext_if proto { tcp, udp, icmp } all keep state
		  
		  # Block list enforcements
		  block in quick on $ext_if from { <bruteforce>, <blocklist> } to any
		  
		  # Port forwarding redirection (NAT)
		  pass in on $ext_if proto tcp to any port 80 rdr-to $web_servers port 80
		  
		  # Protect SSH against brute force attacks
		  pass in on $ext_if proto tcp to any port 22 \
		      keep state (max-src-conn 10, max-src-conn-rate 5/3, \
		      overload <bruteforce> flush global)
		  ```
		- ```bash
		  # Enable PF
		  doas pfctl -e
		  
		  # Load and validate pf.conf rule configurations
		  doas pfctl -f /etc/pf.conf
		  
		  # List active rules
		  doas pfctl -sr
		  
		  # List active connections state table
		  doas pfctl -ss
		  ```
	- ## High Availability via CARP (Common Address Redundancy Protocol)
		- **CARP** allows multiple OpenBSD hosts on a local network to share an IP address.
		- If the master node goes offline, the backup node automatically assumes the IP address, providing seamless failover.
		- ```bash
		  # Master node /etc/hostname.carp0
		  inet 192.168.1.150 255.255.255.0 192.168.1.255 vhid 1 pass securepass carpdev em0
		  
		  # Backup node /etc/hostname.carp0
		  inet 192.168.1.150 255.255.255.0 192.168.1.255 vhid 1 pass securepass carpdev em0 advskew 100
		  # (advskew 100 ensures the backup node defers to the master)
		  ```
	- ## DHCPD Daemon & Unbound DNS Resolver Configuration
		- OpenBSD includes secure, lightweight implementations of a DHCP server and a validating DNS caching resolver (Unbound) in the base system:
		- ### 1. DHCPD Configuration (/etc/dhcpd.conf)
			- The DHCP daemon assigns IP addresses to clients on a local subnet:
			- ```ini
			  # /etc/dhcpd.conf subnet configuration file
			  option domain-name "local.net";
			  option domain-name-servers 192.168.1.1, 8.8.8.8;
			  
			  subnet 192.168.1.0 netmask 255.255.255.0 {
			      range 192.168.1.200 192.168.1.250;
			      option routers 192.168.1.1;
			  }
			  ```
			- ```bash
			  # Enable and start the DHCP daemon on interface 'em1'
			  doas rcctl enable dhcpd
			  doas rcctl set dhcpd flags em1
			  doas rcctl start dhcpd
			  ```
		- ### 2. Unbound DNS Caching Resolver (/var/unbound/unbound.conf)
			- Unbound resolves DNS queries and validates signatures (DNSSEC) for local clients:
			- ```ini
			  # /var/unbound/unbound.conf configuration file
			  server:
			          interface: 192.168.1.1
			          interface: 127.0.0.1
			          access-control: 192.168.1.0/24 allow
			          access-control: 127.0.0.0/8 allow
			          
			          # Validate DNSSEC signatures
			          auto-trust-anchor-file: "/var/unbound/db/root.key"
			  
			  forward-zone:
			          name: "."
			          forward-addr: 8.8.8.8
			          forward-addr: 1.1.1.1
			  ```
			- ```bash
			  # Fetch the root anchor keys for DNSSEC validation
			  doas unbound-anchor -a "/var/unbound/db/root.key"
			  
			  # Enable and start the Unbound service
			  doas rcctl enable unbound
			  doas rcctl start unbound
			  ```
- # Virtualization & Compatibility (vmd)
  collapsed:: true
	- ## The vmd Hypervisor
		- OpenBSD includes a native hypervisor called **vmd** (Virtual Machine Daemon) to run guest operating systems.
		- vmd is designed to run OpenBSD or Linux guest virtual machines, prioritizing security over complex virtualization extensions.
		- ### Virtual Machine Configuration (`/etc/vm.conf`)
			- ```
			  # Global settings
			  switch "vswitch0" {
			      interface bridge0
			  }
			  
			  # Virtual Machine Definition
			  vm "guest_vm" {
			      memory 2048M
			      disk "/var/vm/guest_vm.raw"
			      interface { switch "vswitch0" }
			  }
			  ```
		- ### VM Management Commands
			- ```bash
			  # Create a 20 GB raw virtual disk file
			  vmctl create -s 20G /var/vm/guest_vm.raw
			  
			  # Enable and start the VM service
			  doas rcctl enable vmd
			  doas rcctl start vmd
			  
			  # Start the virtual machine
			  doas vmctl start guest_vm
			  
			  # Console access to the running VM
			  doas vmctl console guest_vm
			  
			  # Stop the virtual machine
			  doas vmctl stop guest_vm
			  ```
- # System Diagnostics, Tuning & Troubleshooting
  collapsed:: true
	- ## Runtime Tuning via sysctl
		- Adjust kernel settings at runtime:
		- ```bash
		  # Enable IP forwarding
		  doas sysctl net.inet.ip.forwarding=1
		  
		  # Adjust maximum open files limit
		  doas sysctl kern.maxfiles=65536
		  ```
	- ## Hardening Kernel Parameters via sysctl.conf
		- OpenBSD administrators enforce high security levels by overriding default kernel behaviors inside `/etc/sysctl.conf`:
		- ### Critical Hardening Options
			- **ddb.console**: Controls whether keyboard console buttons can drop the system into the kernel debugger (DDB). Disabling this prevents local users from bypassing authentication.
			- **net.inet.ip.redirect**: Controls whether the kernel accepts ICMP redirect packets. Disabling this prevents network redirects and MITM route hijackings.
			- **net.inet.tcp.drop_synfin**: Drops TCP packets that have both the SYN and FIN flags set, which are commonly used by port scanners to bypass logging rules.
			- **net.inet.ip.sourceroute**: Controls source-routing. Disabling this blocks source-routed packets, preventing routing path spoofing.
		- ### Production /etc/sysctl.conf Configuration
			- ```ini
			  # Enable IP forwarding (useful if acting as a secure gateway)
			  net.inet.ip.forwarding=1
			  
			  # Disable Console Kernel Debugger Access
			  ddb.console=0
			  
			  # Block Route Redirect Attacks
			  net.inet.ip.redirect=0
			  net.inet.ipv6.redirect=0
			  
			  # Drop SYN+FIN Scan Packets
			  net.inet.tcp.drop_synfin=1
			  
			  # Disable Source Routing
			  net.inet.ip.sourceroute=0
			  ```
			- ```bash
			  # Load sysctl updates immediately
			  doas sysctl -f /etc/sysctl.conf
			  ```
	- ## System Monitoring and Diagnostics
		- Monitor system resources using these utilities:
		- `top`: Monitor CPU usage and running processes.
		- `vmstat`: Display virtual memory allocations and page stats.
		- `iostat`: Monitor disk I/O metrics.
		- `netstat`: Monitor network connections and interfaces.
		- `fstat`: List open files held by running processes.
- # pledge and unveil Sandboxing Simulation (C Program)
  collapsed:: true
	- ## Sandboxing Subsystem Simulation
		- Below is a complete C program simulating OpenBSD's `pledge` and `unveil` sandboxing runtime system.
		- It defines virtual process contexts, capability structures, path maps, and checks if file operations or network accesses violate the process's promises:
		- collapsed:: true
		  ```c
		  /* ==============================================================================
		   * File: openbsd_sandbox_simulation.c
		   * Description: Simulation of OpenBSD pledge(2) and unveil(2) security sandboxing.
		   * Author: VR-Rathod
		   * ==============================================================================
		   */
		  
		  #include <stdio.h>
		  #include <stdlib.h>
		  #include <stdint.h>
		  #include <string.h>
		  #include <stdbool.h>
		  
		  #define MAX_PATHS 8
		  #define PATH_LEN 64
		  
		  // Sandbox capability flags
		  typedef struct {
		      bool stdio;
		      bool rpath;
		      bool wpath;
		      bool cpath;
		      bool inet;
		      bool exec;
		  } SandboxPromises;
		  
		  // Unveiled directory mapping details
		  typedef struct {
		      char path[PATH_LEN];
		      char permissions[4]; // e.g. "r", "rw", "rwx"
		      bool active;
		  } UnveiledPath;
		  
		  // Sandbox Process Context structure
		  typedef struct {
		      SandboxPromises promises;
		      UnveiledPath paths[MAX_PATHS];
		      uint32_t path_count;
		      bool pledged;
		      bool unveiled_locked;
		  } SandboxContext;
		  
		  SandboxContext g_ctx;
		  
		  // Initialize sandbox process context
		  void init_sandbox() {
		      g_ctx.promises.stdio = true;
		      g_ctx.promises.rpath = true;
		      g_ctx.promises.wpath = true;
		      g_ctx.promises.cpath = true;
		      g_ctx.promises.inet = true;
		      g_ctx.promises.exec = true;
		      
		      for (int i = 0; i < MAX_PATHS; i++) {
		          g_ctx.paths[i].active = false;
		      }
		      g_ctx.path_count = 0;
		      g_ctx.pledged = false;
		      g_ctx.unveiled_locked = false;
		      printf("[SANDBOX] Initialized context with full system privileges.\n");
		  }
		  
		  // Simulates the pledge(2) system call
		  bool virtual_pledge(const char *promises_str) {
		      if (g_ctx.pledged) {
		          printf("[ERROR] pledge() has already been called. Re-pledging is blocked.\n");
		          return false;
		      }
		      
		      // Remove default permissions
		      g_ctx.promises.stdio = false;
		      g_ctx.promises.rpath = false;
		      g_ctx.promises.wpath = false;
		      g_ctx.promises.cpath = false;
		      g_ctx.promises.inet = false;
		      g_ctx.promises.exec = false;
		      
		      // Parse the promises string
		      if (strstr(promises_str, "stdio")) g_ctx.promises.stdio = true;
		      if (strstr(promises_str, "rpath")) g_ctx.promises.rpath = true;
		      if (strstr(promises_str, "wpath")) g_ctx.promises.wpath = true;
		      if (strstr(promises_str, "cpath")) g_ctx.promises.cpath = true;
		      if (strstr(promises_str, "inet"))  g_ctx.promises.inet = true;
		      if (strstr(promises_str, "exec"))  g_ctx.promises.exec = true;
		      
		      g_ctx.pledged = true;
		      printf("[PLEDGE ACTIVE] Promises restricted to: \"%s\"\n", promises_str);
		      return true;
		  }
		  
		  // Simulates the unveil(2) system call
		  bool virtual_unveil(const char *path, const char *permissions) {
		      if (g_ctx.unveiled_locked) {
		          printf("[ERROR] unveil() is locked. Further path additions are blocked.\n");
		          return false;
		      }
		      
		      // Locking unveil mappings
		      if (path == NULL && permissions == NULL) {
		          g_ctx.unveiled_locked = true;
		          printf("[UNVEIL LOCKED] Path visibility configurations locked.\n");
		          return true;
		      }
		      
		      if (g_ctx.path_count >= MAX_PATHS) {
		          printf("[ERROR] Maximum unveiled paths limit reached!\n");
		          return false;
		      }
		      
		      strncpy(g_ctx.paths[g_ctx.path_count].path, path, PATH_LEN);
		      strncpy(g_ctx.paths[g_ctx.path_count].permissions, permissions, 4);
		      g_ctx.paths[g_ctx.path_count].active = true;
		      
		      printf("[UNVEIL PATH] Path \"%s\" unveiled with permissions: \"%s\"\n", path, permissions);
		      g_ctx.path_count++;
		      return true;
		  }
		  
		  // Helper function to verify path matches unveiled configurations
		  bool verify_path_permission(const char *target_path, const char req_perm) {
		      // If unveil has not been called, access is allowed by default
		      if (g_ctx.path_count == 0 && !g_ctx.unveiled_locked) return true;
		      
		      for (int i = 0; i < MAX_PATHS; i++) {
		          if (g_ctx.paths[i].active && strncmp(target_path, g_ctx.paths[i].path, strlen(g_ctx.paths[i].path)) == 0) {
		              if (strchr(g_ctx.paths[i].permissions, req_perm) != NULL) {
		                  return true;
		              }
		          }
		      }
		      return false;
		  }
		  
		  // Intercept and validate file read operations
		  bool virtual_read_file(const char *file_path) {
		      // 1. Check pledge promises
		      if (g_ctx.pledged && !g_ctx.promises.rpath) {
		          printf("[KILLED] Process terminated by SIGABRT: pledge violation on read call!\n");
		          exit(1);
		      }
		      
		      // 2. Check unveil path limits
		      if (!verify_path_permission(file_path, 'r')) {
			  // Returns a 'No such file or directory' error
		          printf("[ACCESS BLOCKED] read_file failed on path: \"%s\" (not unveiled)\n", file_path);
		          return false;
		      }
		      
		      printf("[SUCCESS] File read successful: \"%s\"\n", file_path);
		      return true;
		  }
		  
		  // Intercept and validate file write operations
		  bool virtual_write_file(const char *file_path) {
		      // 1. Check pledge promises
		      if (g_ctx.pledged && !g_ctx.promises.wpath) {
		          printf("[KILLED] Process terminated by SIGABRT: pledge violation on write call!\n");
		          exit(1);
		      }
		      
		      // 2. Check unveil path limits
		      if (!verify_path_permission(file_path, 'w')) {
		          printf("[ACCESS BLOCKED] write_file failed on path: \"%s\" (not unveiled)\n", file_path);
		          return false;
		      }
		      
		      printf("[SUCCESS] File write successful: \"%s\"\n", file_path);
		      return true;
		  }
		  
		  // Intercept and validate network operations
		  bool virtual_network_connect(const char *address, int port) {
		      if (g_ctx.pledged && !g_ctx.promises.inet) {
		          printf("[KILLED] Process terminated by SIGABRT: pledge violation on network connect call!\n");
		          exit(1);
		      }
		      
		      printf("[SUCCESS] Connected to server: %s:%d\n", address, port);
		      return true;
		  }
		  
		  // Intercept process creation operations
		  bool virtual_execve(const char *binary_path) {
		      if (g_ctx.pledged && !g_ctx.promises.exec) {
		          printf("[KILLED] Process terminated by SIGABRT: pledge violation on execve call!\n");
		          exit(1);
		      }
		      printf("[SUCCESS] Successfully executed binary: %s\n", binary_path);
		      return true;
		  }
		  
		  int main() {
		      printf("=== OPENBSD PLEDGE AND UNVEIL SIMULATION ===\n");
		      init_sandbox();
		      
		      // 1. Unveil directories and lock path configurations
		      virtual_unveil("/usr/home/user/docs", "r");
		      virtual_unveil("/tmp", "rw");
		      virtual_unveil(NULL, NULL); // Lock further path additions
		      
		      // Test file access inside unveiled directory
		      virtual_read_file("/usr/home/user/docs/report.txt");
		      
		      // Test file access outside unveiled directories (should be blocked)
		      virtual_read_file("/etc/master.passwd");
		      
		      // 2. Pledge syscall promises
		      virtual_pledge("stdio rpath"); // Remove write and network capabilities
		      
		      // Test read in permitted path (should pass)
		      virtual_read_file("/usr/home/user/docs/notes.md");
		      
		      // Test network connection (should fail and terminate process)
		      printf("\n[INFO] Attempting network call (violates pledge stdio rpath)...\n");
		      virtual_network_connect("192.168.1.5", 80);
		      
		      printf("[ERROR] This line should never execute if process was killed.\n");
		      return 0;
		  }
		  ```
- # Shell & Automation Scripts
  collapsed:: true
	- ## OpenBSD Production-Ready Automation Scripts
		- Below are five complete, production-grade automation scripts designed for OpenBSD system administrators:
		- ### Script 1: Automated User Provisioning and doas Setup
			- Creates system admin users and configures permissions in `/etc/doas.conf`:
			- ```bash
			  #!/bin/sh
			  # ==============================================================================
			  # Script: user_provisioner.sh
			  # Description: Automates user creation and doas configurations on OpenBSD.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  USERNAME=$1
			  USER_CLASS="staff"
			  
			  if [ -z "$USERNAME" ]; then
			      echo "Usage: $0 <username>"
			      exit 1
			  fi
			  
			  echo "[INFO] Creating user account: ${USERNAME}"
			  useradd -m -g =wheel -L ${USER_CLASS} -s /bin/ksh "${USERNAME}"
			  
			  echo "[INFO] Setting up user password..."
			  passwd "${USERNAME}"
			  
			  # Add permissions to /etc/doas.conf
			  DOAS_CONF="/etc/doas.conf"
			  if [ ! -f "$DOAS_CONF" ]; then
			      touch "$DOAS_CONF"
			      chmod 600 "$DOAS_CONF"
			  fi
			  
			  # Append permit rules
			  echo "permit keepenv ${USERNAME} as root" >> "$DOAS_CONF"
			  echo "[SUCCESS] User ${USERNAME} created and added to ${DOAS_CONF}."
			  exit 0
			  ```
		- ### Script 2: Automated backup script using softraid/crypto management
			- Mounts an encrypted softraid partition, performs system backup, and unmounts the volume safely:
			- ```bash
			  #!/bin/sh
			  # ==============================================================================
			  # Script: softraid_backup.sh
			  # Description: Mounts encrypted softraid, backups files, and decrypts pool.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  CRYPTO_DEV="sd0e" # Raw partition mapped to RAID
			  DECRYPTED_DISK="sd2" # Decrypted disk mapped by bioctl
			  MOUNT_DIR="/mnt/secure_backup"
			  SOURCE_DIR="/var/www"
			  
			  echo "[INFO] Decrypting softraid partition..."
			  bioctl -c C -l "/dev/${CRYPTO_DEV}" softraid0
			  
			  if [ $? -ne 0 ]; then
			      echo "[ERROR] Failed to decrypt partition."
			      exit 1
			  fi
			  
			  echo "[INFO] Mounting volume..."
			  mkdir -p "$MOUNT_DIR"
			  mount "/dev/${DECRYPTED_DISK}a" "$MOUNT_DIR"
			  
			  echo "[INFO] Running tar backup..."
			  tar -czf "${MOUNT_DIR}/www_backup_$(date +%F).tar.gz" "$SOURCE_DIR"
			  
			  echo "[INFO] Unmounting and locking partition..."
			  umount "$MOUNT_DIR"
			  bioctl -d "$DECRYPTED_DISK"
			  
			  echo "[SUCCESS] Backup complete. Container encrypted."
			  exit 0
			  ```
		- ### Script 3: PF Firewall CARP State Inspector and Failover Logger
			- Monitors CARP interfaces and logs state updates for high-availability setups:
			- ```bash
			  #!/bin/ksh
			  # ==============================================================================
			  # Script: carp_monitor.sh
			  # Description: Monitors and logs CARP interface state transitions.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  CARP_IF="carp0"
			  LOG_FILE="/var/log/carp_monitor.log"
			  LAST_STATE=""
			  
			  log_event() {
			      echo "[$(date '+%F %T')] [CARP] - $1" >> "$LOG_FILE"
			  }
			  
			  while true; do
			      CURRENT_STATE=$(ifconfig "$CARP_IF" 2>/dev/null | grep "carp:" | awk '{print $2}')
			      
			      if [ -z "$CURRENT_STATE" ]; then
			          log_event "ERROR: Interface ${CARP_IF} not found."
			          sleep 30
			          continue
			      fi
			      
			      if [ "$CURRENT_STATE" != "$LAST_STATE" ]; then
			          if [ -n "$LAST_STATE" ]; then
			              log_event "WARNING: State transitioned from ${LAST_STATE} to ${CURRENT_STATE}!"
			              # If transition to master, reload routing tables
			              if [ "$CURRENT_STATE" = "MASTER" ]; then
			                  pfctl -f /etc/pf.conf
			              fi
			          else
			              log_event "Monitoring active. Current state: ${CURRENT_STATE}"
			          fi
			          LAST_STATE="$CURRENT_STATE"
			      fi
			      sleep 5
			  done
			  ```
		- ### Script 4: Security Update and syspatch check Cron
			- Checks for binary patches, security updates, and packages vulnerabilities:
			- ```bash
			  #!/bin/sh
			  # ==============================================================================
			  # Script: auto_patcher.sh
			  # Description: Runs syspatch audits and pkg updates.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  LOG_FILE="/var/log/system_updates.log"
			  echo "=== Update Check [$(date)] ===" >> "$LOG_FILE"
			  
			  # 1. Run syspatch to apply binary patches to base system
			  echo "[INFO] Running syspatch..." >> "$LOG_FILE"
			  syspatch >> "$LOG_FILE" 2>&1
			  
			  # 2. Update binary packages
			  echo "[INFO] Running package upgrades..." >> "$LOG_FILE"
			  pkg_add -u >> "$LOG_FILE" 2>&1
			  
			  echo "[SUCCESS] Maintenance finished." >> "$LOG_FILE"
			  exit 0
			  ```
		- ### Script 5: Process Sandbox Wrapper using pledge/unveil (Concepts)
			- Template wrapper script illustrating process isolation rules:
			- ```bash
			  #!/bin/sh
			  # ==============================================================================
			  # Script: run_sandboxed.sh
			  # Description: Concept script detailing OpenBSD daemon sandboxing setups.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  DAEMON="/usr/sbin/httpd"
			  CHROOT_DIR="/var/www"
			  
			  # Restrict daemon process execution to read/write within /var/www only
			  echo "[INFO] Starting daemon in chroot sandboxed container..."
			  exec "$DAEMON" -d -u -u -t "$CHROOT_DIR"
			  ```
- # OpenBSD Command Reference
  collapsed:: true
	- ## Complete Command Reference (150+ Commands)
		- ### System Administration & Information
			- ```bash
			  sysctl -a                       # Query all active kernel variables
			  sysctl kern.version             # Read kernel version details
			  sysctl kern.maxfiles            # Query maximum open file descriptors limit
			  sysctl kern.securelevel         # Query active kernel security level value
			  uname -a                        # Display system details, architecture, and kernel version
			  syspatch                        # Apply binary patches to base operating system
			  syspatch -c                     # Check if binary patches are available
			  dmesg                           # Read the system boot and kernel message buffers
			  date                            # Display or adjust system calendar time settings
			  uptime                          # Show system uptime, load averages, and user count
			  shutdown -p now                 # Power down the system immediately
			  reboot                          # Reboot the system immediately
			  rcctl enable nginx              # Enable service to start on boot
			  rcctl disable nginx             # Disable service from starting on boot
			  rcctl start nginx               # Start a system service daemon
			  rcctl stop nginx                # Stop a system service daemon
			  rcctl restart nginx             # Restart a system service daemon
			  rcctl check nginx               # Check if a service is running and view its PID
			  rcctl get nginx                 # Show all parameters of a service
			  rcctl set nginx flags "-v"      # Set startup arguments for a service
			  kldstat                         # List all loaded kernel modules (legacy compat)
			  locale                          # Print active language and encoding configurations
			  pciconf -l                      # List PCI bus hardware devices and vendor codes
			  usbconfig                       # List USB controllers and attached devices
			  devinfo                         # Print system hardware device trees
			  installurl                      # File location mapping official mirrors (/etc/installurl)
			  signify                         # Cryptographic signing utility
			  signify -C -p pubkey.pub -x check.sig # Verify file checksum signature
			  ```
		- ### Storage & Filesystem Administration
			- ```bash
			  fdisk sd0                       # View partition layout on disk sd0
			  fdisk -iy sd0                   # Initialize partition table on disk sd0
			  disklabel sd0                   # View partitions within drive label sd0
			  disklabel -E sd0                # Edit partitions within drive label sd0
			  newfs /dev/rsd0a                # Format partition with FFS filesystem
			  fsck -y /dev/rsd0a              # Scan and repair FFS partition, auto-fixing issues
			  mount /dev/sd0a /mnt            # Mount partition to target directory path
			  umount /mnt                     # Unmount target device mount point
			  df -h                           # Display mounted filesystem space usage
			  du -sh /var/log/                # Calculate directory space usage
			  bioctl softraid0                # Display status of softraid encryption disks
			  bioctl -c C -l sd0a softraid0   # Create an encrypted softraid container on sd0a
			  bioctl -d sd1                   # Detach/lock encrypted softraid disk sd1
			  mount_cd9660 /dev/cd0 /mnt      # Mount ISO 9660 CD-ROM device
			  tunefs -p /                     # Print filesystem details for mount point
			  ```
		- ### Process Management & Diagnostics
			- ```bash
			  ps aux                          # Display running processes
			  pgrep -u root sshd              # Find process IDs matching criteria
			  pkill -9 -u testuser            # Kill processes matching criteria immediately
			  kill -15 1024                   # Terminate process gracefully using SIGTERM
			  kill -9 1024                    # Terminate process immediately using SIGKILL
			  top -o cpu                      # Monitor system processes, sorted by CPU usage
			  vmstat -s                       # Display page allocation statistics
			  iostat -w 2                     # Print disk I/O metrics every two seconds
			  systat -ifstat                  # Full-screen network interface statistics
			  systat -vmstat                  # Full-screen virtual memory and scheduling statistics
			  fstat -p 1024                   # List open files held by specific process ID
			  sockstat -4 -l                  # List processes listening on open TCP/UDP ports
			  procstat -f 1024                # Print detailed file descriptor table of a process
			  limit                           # Display shell session resource limits
			  ulimit -n 2048                  # Adjust open file descriptors limit in shell
			  nice -n 10 backup.sh            # Run process with low priority level
			  renice +15 -p 1024              # Lower priority level of active process ID
			  ```
		- ### Networking & Port Diagnostics
			- ```bash
			  ifconfig                        # List active network interfaces and configurations
			  ifconfig em0 up                 # Enable network interface card em0
			  ifconfig em0 down               # Disable network interface card em0
			  ifconfig em0 inet 192.168.1.5   # Configure IP address on interface em0
			  netstart                        # Shell script executing interface configurations (/etc/netstart)
			  route add default 192.168.1.1   # Add default gateway path to routing table
			  route show                      # Display active network routing tables
			  ping -c 5 1.1.1.1               # Send ICMP echo requests to verify remote host
			  traceroute 8.8.8.8              # Display hop path to remote destination
			  netstat -rn                     # Display active routing tables in numeric format
			  netstat -i                      # Display network interface statistics
			  netstat -an | grep LISTEN       # List open sockets listening for incoming connections
			  arp -a                          # Display ARP IP-to-MAC address mapping tables
			  dig @8.8.8.8 google.com         # Perform DNS lookup queries using Google DNS
			  host google.com                 # Perform quick DNS host resolution query
			  nc -zv 192.168.1.100 22         # Test connection to remote port (Netcat)
			  curl -I https://openbsd.org     # Fetch HTTP headers of target web server
			  fetch https://site.com/file.zip # Download file over HTTP/FTP
			  tcpdump -i em0                  # Capture network packets passing through interface em0
			  ndp -an                         # Display IPv6 neighbor cache mapping details
			  ```
		- ### Package & Ports Management
			- ```bash
			  pkg_add git                     # Install a binary package
			  pkg_add -u                      # Upgrade all installed binary packages to latest versions
			  pkg_delete git                  # Uninstall an installed binary package
			  pkg_info -Q nmap                # Search repositories for matching packages
			  pkg_info tmux                   # Display metadata details of an installed package
			  pkg_info -L tmux                # List all files installed by a package
			  pkg_delete -a                   # Delete orphaned dependencies
			  pkg_add -ui                     # Upgrade packages interactively
			  ```
		- ### Security, Auditing & Hardening
			- ```bash
			  chflags schg critical_file      # Set system immutable flag on a file
			  chflags noschg critical_file    # Clear system immutable flag on a file
			  chflags sappnd log_file         # Set system append-only flag on a log file
			  ls -lao                         # List directory files displaying system flags
			  useradd -m -g =wheel test       # Create system user account
			  userdel -r test                 # Delete user account and home directories
			  vipw                            # Safely edit system master password file
			  doas -u operator rcctl restart nginx # Run command as another user via doas
			  pfctl -e                        # Enable the PF firewall engine
			  pfctl -d                        # Disable the PF firewall engine
			  pfctl -f /etc/pf.conf           # Load firewall rules from pf.conf file
			  pfctl -sr                       # Display currently loaded firewall rules
			  pfctl -ss                       # Display active state tables of the firewall
			  pfctl -vvss                     # Verbose display of active firewall connections and counters
			  pfctl -t bad_ips -T show        # List IP addresses stored inside PF table bad_ips
			  pfctl -t bad_ips -T add 1.1.1.1 # Add IP address to PF firewall table bad_ips
			  pfctl -t bad_ips -T delete 1.1.1.1 # Delete IP address from PF firewall table bad_ips
			  pfctl -F all                    # Flush all PF rules, tables, counters, and active states
			  syspatch -l                     # List all applied binary security patches
			  syspatch -r                     # Revert the last applied binary security patch
			  doas -s                         # Open an interactive supervisor root shell session
			  encrypt -b 8                    # Generate bcrypt hash of a string password using cost 8
			  signify -V -p /etc/signify/openbsd-76-base.pub -x check.sig -m file # Verify signature on a file
			  ktrace ./my_app                 # Enable system call tracing on a process (writes to ktrace.out)
			  kdump                           # View ktrace.out execution log (highly useful for pledge/unveil debugs)
			  vmctl show                      # List all running guest virtual machines and JIDs under vmd
			  vmctl status                    # Query virtualization resource allocations and memory pools
			  unbound-checkconf               # Verify syntax configurations of the unbound resolver file
			  unbound-anchor                  # Download trust anchor keys for DNSSEC validation
			  ifconfig carp0 carpdev em0      # Map CARP interface to hardware network controller em0
			  ```
	- ## More Learn
		- ## Github & Webs
			- [Official OpenBSD Documentation Portal](https://www.openbsd.org/faq/index.html) - Official FAQ, hardware support guides, and manuals.
			- [OpenBSD Source Code Mirrors](https://github.com/openbsd) - Git mirrors of the OpenBSD src, ports, and xenocara repositories.
			- [OpenSSH Official Website](https://www.openssh.com/) - Documentation and release notes for the OpenSSH package.
			- [LibreSSL Official Portal](http://www.libressl.org/) - Documentation and cryptographic guides for LibreSSL.
			- [OpenBSD Web Manual Pages](https://man.openbsd.org/) - Comprehensive manual index for kernel calls and commands.
		- ## Master Playlists YouTube
			- [OpenBSD Security Design and Hardening - OpenBSD Foundation](https://www.youtube.com/@OpenBSDFoundation) - Lecture videos covering KARL, malloc hardening, and pledge/unveil sandboxing.
			- [PF Firewall Setup and CARP Network Failover Lectures - BSDCan](https://www.youtube.com/user/BSDCan) - Videos covering PF rule construction and redundancy configurations.
			- [UNIX Security Auditing and LibreSSL Development - EuroBSDcon](https://www.youtube.com/c/EuroBSDcon) - Technical presentations on code audits and library cleanups.
