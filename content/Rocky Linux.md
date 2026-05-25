---
date: 2026-04-06T11:04:22+05:30
lastmod: 2026-04-06T11:04:22+05:30

seoTitle: Rocky Linux Complete Guide – RHEL-Compatible Enterprise Linux
description: "Comprehensive Rocky Linux reference covering installation, DNF package management, SELinux, firewalld, systemd, server setup, security hardening, and RHEL compatibility."
keywords: "Rocky Linux, rocky linux guide, rocky linux commands, rocky linux dnf, rocky linux tutorial, rocky linux server, rocky linux rhel, rocky linux selinux, rocky linux firewalld, rocky linux administration, enterprise linux, RHEL compatible, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Rocky Linux – Complete Guide
enableToc: true
---

- # History
  collapsed:: true
	- ## The CentOS Shock of 2020
		- For nearly two decades, **CentOS** (Community ENTerprise Operating System) was the go-to free, binary-compatible clone of **Red Hat Enterprise Linux (RHEL)**.
		- On **December 8, 2020**, Red Hat and the CentOS project announced that **CentOS 8 would reach EOL on December 31, 2021** — cutting its life short by nearly a decade.
		- CentOS would pivot to **CentOS Stream**, a rolling-release distro that sits *upstream* of RHEL rather than being a downstream clone.
		- This meant CentOS Stream would receive changes *before* RHEL, making it a preview/testing ground — not the stable, production-ready clone the community relied on.
		- The announcement sent shockwaves through the Linux community. Millions of servers worldwide ran CentOS. Businesses, universities, and developers suddenly needed an alternative.
	- ## Gregory Kurtzer Steps Up
		- **Gregory Kurtzer** — one of the original co-founders of CentOS — announced on the same day (December 8, 2020) that he would create a new community-driven, RHEL-compatible distribution.
		- He posted in the CentOS forum: *"If this is true, I would like to announce that I will be starting a new project to fill the void that CentOS is leaving behind."*
		- The project was named **Rocky Linux** — a tribute to **Rocky McGaugh**, the other CentOS co-founder who had passed away before seeing CentOS reach its full potential.
		- Development moved at remarkable speed. A community of thousands rallied around the project within weeks.
	- ## Timeline
		- ```
		  Dec 8,  2020  → CentOS shift announced; Rocky Linux project announced same day
		  Dec 2020      → Rocky Linux GitHub org created; community forms
		  Jan 2021      → Rocky Linux Enterprise Software Foundation (RESF) established
		  Apr 2021      → Rocky Linux 8.3 Release Candidate published
		  Jun 21, 2021  → Rocky Linux 8.4 — first stable release (GA)
		  Nov 2021      → Rocky Linux 8.5 released
		  Jul 2022      → Rocky Linux 9.0 released (RHEL 9 compatible)
		  2023-2024     → Rocky Linux 8.x and 9.x point releases continue
		  ```
	- ## Rocky Linux Enterprise Software Foundation (RESF)
		- Rocky Linux is governed by the **RESF** — a Public Benefit Corporation (PBC) in Delaware, USA.
		- Designed to ensure the project remains community-owned and cannot be "pulled" by any single company.
		- Sponsors include **CIQ** (Gregory Kurtzer's company), **AWS**, **Google Cloud**, **Microsoft Azure**, **ARM**, and others.
		- Competing alternative: **AlmaLinux** (created by CloudLinux, also announced in Dec 2020).
- # Introduction
  collapsed:: true
	- ## What is Rocky Linux?
		- Rocky Linux is a **free, open-source, community-driven enterprise Linux distribution** that is **1:1 binary compatible** with Red Hat Enterprise Linux (RHEL).
		- It is designed as a drop-in replacement for CentOS — every RPM package, library, and binary behaves identically to its RHEL counterpart.
		- Targets **production servers**, **enterprise workloads**, **HPC clusters**, **cloud deployments**, and anyone who needs long-term stability without paying for RHEL subscriptions.
		- Uses **DNF** package manager, **RPM** packages, **SELinux** enforcing by default, **firewalld**, **systemd** — the full RHEL stack.
	- ## Rocky Linux vs RHEL vs CentOS Stream vs AlmaLinux
		- | Feature | Rocky Linux | RHEL | CentOS Stream | AlmaLinux |
		  |---------|-------------|------|---------------|-----------|
		  | Cost | Free | Paid (free ≤16 systems) | Free | Free |
		  | RHEL compatibility | 1:1 binary | Source | Upstream preview | 1:1 binary |
		  | Support lifecycle | 10 years | 10 years | ~5 years | 10 years |
		  | Governed by | RESF (community) | Red Hat (IBM) | Red Hat (IBM) | AlmaLinux OS Foundation |
		  | Release model | Downstream RHEL clone | Enterprise | Rolling (pre-RHEL) | Downstream RHEL clone |
		  | Package manager | DNF/RPM | DNF/RPM | DNF/RPM | DNF/RPM |
		  | SELinux | Enforcing default | Enforcing default | Enforcing default | Enforcing default |
		  | Target | Servers, enterprise | Enterprise | CI/CD, testing | Servers, enterprise |
		  | Cloud images | Yes | Yes | Yes | Yes |
		  | Sponsor | CIQ, AWS, Google | IBM/Red Hat | Red Hat | CloudLinux |
	- ## Rocky Linux Editions
		- ```
		  Rocky Linux DVD ISO     → Full installer with all packages (~10 GB)
		  Rocky Linux Boot ISO    → Minimal network installer (~800 MB)
		  Rocky Linux Minimal ISO → Minimal offline install (~2 GB)
		  Rocky Linux Cloud       → AWS AMI, Azure, GCP, OpenStack images
		  Rocky Linux Container   → Docker/OCI container images
		  Rocky Linux Vagrant     → Vagrant boxes for dev environments
		  Rocky Linux Live        → Live desktop (GNOME/KDE/XFCE spins)
		  ```
	- ## Advantages
		- **Free RHEL clone** — identical binaries, no licensing cost, 10-year support lifecycle.
		- **Enterprise stability** — conservative package updates, long-term ABI compatibility.
		- **RHEL skills transfer** — everything you learn on Rocky applies directly to RHEL.
		- **SELinux enforcing** — strong mandatory access control out of the box.
		- **Large ecosystem** — EPEL, PowerTools/CRB, thousands of RPM packages.
		- **Community governed** — RESF structure prevents corporate capture.
		- **Excellent cloud support** — official images on all major cloud providers.
		- **Cockpit web UI** — browser-based server management included.
	- ## Disadvantages
		- **Older packages** — ships with older (but stable) software versions vs Fedora/Ubuntu.
		- **No rolling updates** — major version upgrades require a migration process.
		- **Smaller desktop community** — primarily server-focused, desktop experience is secondary.
		- **RHEL source dependency** — Rocky rebuilds from RHEL sources; Red Hat's source access policies can affect rebuild timelines.
		- **Less cutting-edge** — not suitable if you need the latest kernel or toolchain versions.
	- ## Use Cases
		- Production web servers (LAMP/LEMP stacks), database servers (PostgreSQL, MySQL, MariaDB), HPC clusters, enterprise application servers, CI/CD build environments, learning RHEL administration, cloud-native workloads, container hosts (Podman/Docker), home labs mimicking enterprise environments.
- # Installation
  collapsed:: true
	- ## System Requirements
		- ```
		  Rocky Linux 9 (Minimum):
		    CPU:   1 GHz 64-bit (x86_64, aarch64, ppc64le, s390x)
		    RAM:   1.5 GB (2 GB recommended for GUI)
		    Disk:  10 GB (20 GB recommended)
		    GPU:   1024x768 (for graphical install)
		  
		  Rocky Linux 9 (Recommended Server):
		    CPU:   2+ cores, 64-bit
		    RAM:   4 GB+
		    Disk:  40 GB+ (SSD preferred)
		    NIC:   1 Gbps+
		  ```
	- ## ISO Types
		- ```
		  DVD ISO    (~10 GB)  → Complete offline installer; all package groups included
		                          Best for: air-gapped installs, full control
		  Boot ISO   (~800 MB) → Minimal; downloads packages from internet during install
		                          Best for: always-fresh packages, small download
		  Minimal ISO (~2 GB)  → Offline minimal install; no GUI packages
		                          Best for: servers, containers, scripted installs
		  ```
		- Download from: `https://rockylinux.org/download`
		- Verify checksum:
		- ```bash
		  # Download the CHECKSUM file alongside the ISO
		  sha256sum -c CHECKSUM --ignore-missing
		  # Or manually:
		  sha256sum Rocky-9.x-x86_64-dvd.iso
		  ```
	- ## Creating Bootable USB
		- ```bash
		  # Linux — using dd
		  sudo dd if=Rocky-9.x-x86_64-dvd.iso of=/dev/sdX bs=4M status=progress oflag=sync
		  
		  # Windows — use Rufus (https://rufus.ie) or Ventoy
		  # macOS
		  sudo dd if=Rocky-9.x-x86_64-dvd.iso of=/dev/rdiskX bs=4m
		  ```
	- ## Anaconda Installer Steps
		- Rocky Linux uses the **Anaconda** installer (same as Fedora and RHEL).
		- ```
		  1. Boot from USB → select "Install Rocky Linux 9"
		  2. Language & Keyboard → choose your locale
		  3. Installation Summary screen (hub-and-spoke model):
		     ┌─ Software Selection ──────────────────────────────┐
		     │  Base Environment:                                 │
		     │  • Server with GUI    → GNOME + server tools       │
		     │  • Server             → CLI only (recommended)     │
		     │  • Minimal Install    → bare minimum               │
		     │  • Workstation        → desktop environment        │
		     │  • Custom OS          → you choose everything      │
		     └───────────────────────────────────────────────────┘
		  4. Installation Destination → select disk
		     - Automatic partitioning (recommended):
		       /boot/efi  → 600 MB  (EFI, FAT32)
		       /boot      → 1 GB    (ext4)
		       /          → rest    (XFS — Rocky default)
		       swap       → auto    (or zram on modern systems)
		     - Custom: LVM is common for enterprise flexibility
		  5. Network & Hostname → set hostname (e.g., server01.example.com)
		  6. Root Password → set strong root password (or lock root, use sudo user)
		  7. User Creation → create admin user, check "Make this user administrator"
		  8. Begin Installation → ~10-20 minutes
		  9. Reboot → remove USB
		  ```
	- ## Default Filesystem: XFS
		- Rocky Linux (like RHEL) defaults to **XFS** for the root filesystem.
		- ```
		  XFS advantages:
		  • High performance for large files and parallel I/O
		  • Excellent scalability (supports up to 8 exabytes)
		  • Online defragmentation and resizing (grow only)
		  • Journaling for crash recovery
		  • Default in RHEL/Rocky since RHEL 7
		  
		  Note: XFS cannot shrink — plan partition sizes carefully.
		  LVM is recommended for flexibility (can add space later).
		  ```
	- ## First Boot Setup
		- ```bash
		  # Update all packages immediately
		  sudo dnf update -y
		  
		  # Enable EPEL (Extra Packages for Enterprise Linux)
		  sudo dnf install epel-release -y
		  
		  # Enable CRB (CodeReady Builder) — needed by many EPEL packages
		  sudo dnf config-manager --set-enabled crb
		  
		  # Install common tools
		  sudo dnf install -y vim curl wget git htop net-tools bash-completion \
		    tar unzip zip bind-utils lsof strace tcpdump
		  
		  # Check SELinux status
		  getenforce        # should say "Enforcing"
		  sestatus          # detailed SELinux status
		  
		  # Check firewall status
		  sudo systemctl status firewalld
		  
		  # Set timezone
		  sudo timedatectl set-timezone Asia/Kolkata   # adjust to your zone
		  timedatectl status
		  
		  # Set hostname
		  sudo hostnamectl set-hostname myserver.example.com
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## RHEL-Compatible Kernel
		- Rocky Linux ships the **same kernel version as RHEL** — stable, heavily patched, and enterprise-tested.
		- Unlike Fedora (which ships the latest upstream kernel), Rocky's kernel is conservative and backport-heavy.
		- ```bash
		  uname -r                    # current kernel version
		  uname -a                    # full system info
		  rpm -q kernel               # all installed kernels
		  sudo dnf list installed kernel*
		  
		  # Rocky 9 ships kernel 5.14.x (RHEL 9 baseline)
		  # Rocky 8 ships kernel 4.18.x (RHEL 8 baseline)
		  
		  # GRUB2 — manage boot entries
		  sudo grub2-mkconfig -o /boot/grub2/grub.cfg
		  sudo grubby --default-kernel          # show default kernel
		  sudo grubby --set-default /boot/vmlinuz-<version>
		  sudo grubby --info=ALL                # all boot entries
		  ```
	- ## Boot Process
		- ```mermaid
		  flowchart TD
		      A[Power On / Reset] --> B[UEFI/BIOS POST]
		      B --> C[UEFI reads EFI partition\n/boot/efi/EFI/rocky/]
		      C --> D[GRUB2 Bootloader\n/boot/grub2/grub.cfg]
		      D --> E[Kernel selected\nvmlinuz-x.x.x]
		      E --> F[initramfs loaded\ndracut-generated]
		      F --> G[Kernel decompresses\nand initializes hardware]
		      G --> H[systemd PID 1 starts]
		      H --> I[sysinit.target\nmount filesystems, udev]
		      I --> J[basic.target\nlogging, sockets]
		      J --> K{Boot target?}
		      K -->|Server| L[multi-user.target\nCLI login]
		      K -->|Workstation| M[graphical.target\nGDM login]
		  ```
	- ## Linux File System Hierarchy (FHS) on Rocky
		- ```
		  /           Root filesystem (XFS by default)
		  ├── /bin    → symlink to /usr/bin  (merged-usr since Rocky 9)
		  ├── /boot   Kernel, initramfs, GRUB2 config
		  ├── /dev    Device files (managed by udev)
		  ├── /etc    System-wide configuration files
		  ├── /home   User home directories
		  ├── /lib    → symlink to /usr/lib
		  ├── /lib64  → symlink to /usr/lib64
		  ├── /media  Auto-mount removable media
		  ├── /mnt    Manual temporary mount point
		  ├── /opt    Optional/third-party software
		  ├── /proc   Virtual FS: process and kernel info
		  ├── /root   Root user's home directory
		  ├── /run    Runtime data (tmpfs, cleared on reboot)
		  ├── /sbin   → symlink to /usr/sbin
		  ├── /srv    Data served by this system
		  ├── /sys    Virtual FS: hardware/driver info (sysfs)
		  ├── /tmp    Temporary files (tmpfs or XFS)
		  ├── /usr    User programs, libraries, docs
		  │   ├── /usr/bin    User executables
		  │   ├── /usr/lib    Libraries
		  │   ├── /usr/local  Locally compiled software
		  │   └── /usr/share  Architecture-independent data
		  └── /var    Variable data (logs, spool, cache)
		      ├── /var/log    System logs
		      ├── /var/lib    Application state data
		      └── /var/spool  Print/mail queues
		  ```
	- ## GRUB2 Management
		- ```bash
		  # Edit GRUB defaults
		  sudo vim /etc/default/grub
		  # Key options:
		  # GRUB_TIMEOUT=5          → boot menu timeout in seconds
		  # GRUB_DEFAULT=saved      → remember last selection
		  # GRUB_CMDLINE_LINUX=""   → kernel parameters
		  
		  # Regenerate GRUB config after changes
		  # UEFI systems:
		  sudo grub2-mkconfig -o /boot/efi/EFI/rocky/grub.cfg
		  # BIOS/Legacy systems:
		  sudo grub2-mkconfig -o /boot/grub2/grub.cfg
		  
		  # List all kernels
		  sudo grubby --info=ALL
		  
		  # Set default kernel
		  sudo grubby --set-default /boot/vmlinuz-5.14.0-xxx.el9.x86_64
		  
		  # Add kernel parameter (e.g., disable IPv6)
		  sudo grubby --update-kernel=ALL --args="ipv6.disable=1"
		  
		  # Remove kernel parameter
		  sudo grubby --update-kernel=ALL --remove-args="ipv6.disable=1"
		  ```
- # DNF Package Management
  collapsed:: true
	- ## DNF Overview
		- **DNF** (Dandified YUM) is the default package manager for Rocky Linux, inherited from RHEL/Fedora.
		- Handles dependency resolution, transaction history, module streams, and repository management.
		- ```mermaid
		  flowchart LR
		      A[User: dnf install nginx] --> B[DNF reads repo metadata]
		      B --> C[Resolves dependencies]
		      C --> D[Downloads RPMs\nfrom enabled repos]
		      D --> E[GPG signature check]
		      E --> F[RPM transaction\ninstall/upgrade/erase]
		      F --> G[Run scriptlets\npost-install hooks]
		      G --> H[Package installed ✓]
		  ```
	- ## Essential DNF Commands
		- ```bash
		  # ── SEARCH & INFO ──────────────────────────────────────
		  dnf search nginx                    # search by name/description
		  dnf info nginx                      # detailed package info
		  dnf list available                  # all available packages
		  dnf list installed                  # all installed packages
		  dnf list updates                    # available updates
		  dnf provides /usr/bin/python3       # which package owns a file
		  dnf repoquery --list nginx          # list files in a package
		  dnf repoquery --requires nginx      # show dependencies
		  
		  # ── INSTALL & REMOVE ───────────────────────────────────
		  sudo dnf install nginx              # install package
		  sudo dnf install nginx-1.20.1       # install specific version
		  sudo dnf install ./local.rpm        # install local RPM file
		  sudo dnf remove nginx               # remove package
		  sudo dnf autoremove                 # remove unused dependencies
		  sudo dnf reinstall nginx            # reinstall package
		  
		  # ── UPDATE ─────────────────────────────────────────────
		  sudo dnf update                     # update all packages
		  sudo dnf update nginx               # update specific package
		  sudo dnf upgrade                    # alias for update
		  sudo dnf check-update               # check without installing
		  
		  # ── GROUPS ─────────────────────────────────────────────
		  dnf group list                      # list all package groups
		  dnf group info "Development Tools"  # group details
		  sudo dnf group install "Development Tools"
		  sudo dnf group remove "Development Tools"
		  
		  # ── HISTORY ────────────────────────────────────────────
		  dnf history                         # transaction history
		  dnf history info 5                  # details of transaction #5
		  sudo dnf history undo 5             # undo transaction #5
		  sudo dnf history rollback 3         # rollback to transaction #3
		  
		  # ── CACHE ──────────────────────────────────────────────
		  sudo dnf clean all                  # clean all cached data
		  sudo dnf clean packages             # clean cached packages only
		  sudo dnf makecache                  # rebuild metadata cache
		  ```
	- ## DNF Modules (AppStream)
		- Rocky Linux uses **Application Streams (AppStream)** — allows multiple versions of the same software to coexist.
		- ```bash
		  # List all available modules
		  dnf module list
		  
		  # List specific module streams
		  dnf module list nodejs
		  
		  # Enable a specific stream
		  sudo dnf module enable nodejs:18
		  
		  # Install module (default profile)
		  sudo dnf module install nodejs:18
		  
		  # Install specific profile
		  sudo dnf module install nodejs:18/development
		  
		  # Switch streams (e.g., PHP 7.4 → 8.1)
		  sudo dnf module reset php
		  sudo dnf module enable php:8.1
		  sudo dnf module install php:8.1
		  
		  # Disable a module
		  sudo dnf module disable nodejs:18
		  
		  # Show active module info
		  dnf module info nodejs
		  ```
		- > [!tip] AppStream lets you run PHP 8.1 on one server and PHP 7.4 on another — both from the same base OS — without third-party repos.
	- ## Repository Management
		- ```bash
		  # List all repos
		  dnf repolist
		  dnf repolist all              # including disabled repos
		  
		  # Enable/disable a repo
		  sudo dnf config-manager --set-enabled powertools   # Rocky 8
		  sudo dnf config-manager --set-enabled crb          # Rocky 9
		  sudo dnf config-manager --set-disabled crb
		  
		  # Add a repo manually
		  sudo dnf config-manager --add-repo https://example.com/repo.repo
		  
		  # Repo files location
		  ls /etc/yum.repos.d/
		  ```
	- ## Rocky Linux Default Repos
		- ```
		  baseos      → Core OS packages (kernel, glibc, systemd)
		  appstream   → Application packages + module streams
		  extras      → Extra packages not in RHEL
		  crb         → CodeReady Builder (Rocky 9) / PowerTools (Rocky 8)
		              → Needed for EPEL and development headers
		  ```
	- ## EPEL Repository
		- ```bash
		  # Install EPEL (Extra Packages for Enterprise Linux)
		  sudo dnf install epel-release -y
		  
		  # Enable CRB first (many EPEL packages need it)
		  sudo dnf config-manager --set-enabled crb   # Rocky 9
		  # or
		  sudo dnf config-manager --set-enabled powertools  # Rocky 8
		  
		  # Verify EPEL is active
		  dnf repolist | grep epel
		  
		  # EPEL provides: htop, tmux, neovim, fail2ban, certbot, and thousands more
		  sudo dnf install htop tmux neovim fail2ban -y
		  ```
	- ## RPM Commands
		- ```bash
		  # Query installed packages
		  rpm -qa                          # list all installed packages
		  rpm -qi nginx                    # package info
		  rpm -ql nginx                    # list files in package
		  rpm -qf /etc/nginx/nginx.conf    # which package owns this file
		  rpm -qR nginx                    # package dependencies
		  
		  # Install/verify RPM files
		  sudo rpm -ivh package.rpm        # install with verbose + hash
		  sudo rpm -Uvh package.rpm        # upgrade
		  sudo rpm -e nginx                # erase/remove
		  rpm -V nginx                     # verify package integrity
		  rpm -Va                          # verify all packages
		  
		  # GPG keys
		  rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-rockyofficial
		  rpm -q gpg-pubkey --qf '%{name}-%{version}-%{release} --> %{summary}\n'
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell: Bash
		- Rocky Linux uses **Bash** (Bourne Again Shell) as the default shell — same as RHEL.
		- ```bash
		  echo $SHELL          # /bin/bash
		  bash --version       # GNU bash version
		  cat /etc/shells      # all available shells
		  chsh -s /bin/zsh     # change your shell to zsh
		  ```
	- ## Essential Commands
		- ```bash
		  # ── NAVIGATION ─────────────────────────────────────────
		  pwd                  # print working directory
		  ls -la               # list with hidden files + details
		  ls -lh               # human-readable sizes
		  cd /etc              # change directory
		  cd ~                 # go to home
		  cd -                 # go to previous directory
		  
		  # ── FILE OPERATIONS ────────────────────────────────────
		  cp -r src/ dest/     # copy recursively
		  mv file.txt /tmp/    # move/rename
		  rm -rf dir/          # remove recursively (careful!)
		  mkdir -p a/b/c       # create nested directories
		  touch file.txt       # create empty file / update timestamp
		  ln -s /etc/nginx nginx_link   # symbolic link
		  ln /etc/hosts hosts_hard      # hard link
		  
		  # ── VIEWING FILES ───────────────────────────────────────
		  cat /etc/os-release  # view file
		  less /var/log/messages  # paginated view
		  head -20 file.log    # first 20 lines
		  tail -f /var/log/messages  # follow log in real time
		  grep -r "error" /var/log/  # recursive search
		  grep -i "failed" auth.log  # case-insensitive
		  
		  # ── DISK & SYSTEM ───────────────────────────────────────
		  df -h                # disk usage (human-readable)
		  du -sh /var/log/     # directory size
		  free -h              # memory usage
		  top                  # process monitor
		  htop                 # better process monitor (install via EPEL)
		  ps aux               # all running processes
		  ps aux | grep nginx  # find specific process
		  kill -9 PID          # force kill process
		  killall nginx        # kill by name
		  
		  # ── ARCHIVES ────────────────────────────────────────────
		  tar -czf archive.tar.gz dir/   # create gzip archive
		  tar -xzf archive.tar.gz        # extract gzip archive
		  tar -cjf archive.tar.bz2 dir/  # create bzip2 archive
		  tar -xjf archive.tar.bz2       # extract bzip2 archive
		  zip -r archive.zip dir/        # create zip
		  unzip archive.zip              # extract zip
		  ```
	- ## File Permissions
		- ```bash
		  # Permission format: [type][owner][group][others]
		  # Example: -rwxr-xr-- 1 root wheel 4096 Jan 1 12:00 script.sh
		  #           d = directory, - = file, l = symlink
		  #           r=4, w=2, x=1
		  
		  chmod 755 script.sh      # rwxr-xr-x
		  chmod 644 config.conf    # rw-r--r--
		  chmod +x script.sh       # add execute for all
		  chmod u+x,g-w file       # symbolic mode
		  chmod -R 755 /var/www/   # recursive
		  
		  chown user:group file    # change owner and group
		  chown -R nginx:nginx /var/www/html/
		  chgrp wheel file         # change group only
		  
		  # Special permissions
		  chmod 4755 file          # setuid (runs as owner)
		  chmod 2755 dir/          # setgid (new files inherit group)
		  chmod 1777 /tmp          # sticky bit (only owner can delete)
		  
		  # View permissions
		  ls -la file
		  stat file                # detailed file info including permissions
		  ```
	- ## Shell Scripting Basics
		- ```bash
		  #!/bin/bash
		  # Rocky Linux bash script example
		  
		  # Variables
		  NAME="Rocky"
		  VERSION=9
		  echo "Welcome to $NAME Linux $VERSION"
		  
		  # Conditionals
		  if [ -f /etc/rocky-release ]; then
		      echo "This is Rocky Linux"
		  elif [ -f /etc/redhat-release ]; then
		      echo "This is a RHEL-family distro"
		  else
		      echo "Unknown distro"
		  fi
		  
		  # Loops
		  for pkg in nginx vim curl; do
		      sudo dnf install -y "$pkg"
		  done
		  
		  # Functions
		  check_service() {
		      if systemctl is-active --quiet "$1"; then
		          echo "$1 is running"
		      else
		          echo "$1 is NOT running"
		      fi
		  }
		  check_service nginx
		  check_service sshd
		  
		  # Read user input
		  read -p "Enter hostname: " HOSTNAME
		  sudo hostnamectl set-hostname "$HOSTNAME"
		  ```
- # User & Group Management
  collapsed:: true
	- ## User Account Types
		- ```
		  root (UID 0)      → superuser, full system access
		  System users      → UID 1-999, for services (nginx, postgres, etc.)
		  Regular users     → UID 1000+, human users
		  ```
	- ## User Commands
		- ```bash
		  # Create user
		  sudo useradd username                    # basic user creation
		  sudo useradd -m -s /bin/bash -c "Full Name" username  # with home + shell
		  sudo useradd -u 1500 -g developers username  # specific UID/GID
		  
		  # Set password
		  sudo passwd username
		  
		  # Modify user
		  sudo usermod -aG wheel username          # add to wheel (sudo) group
		  sudo usermod -aG docker,nginx username   # add to multiple groups
		  sudo usermod -s /bin/zsh username        # change shell
		  sudo usermod -l newname oldname          # rename user
		  sudo usermod -L username                 # lock account
		  sudo usermod -U username                 # unlock account
		  
		  # Delete user
		  sudo userdel username                    # keep home directory
		  sudo userdel -r username                 # remove home + mail spool
		  
		  # View user info
		  id username                              # UID, GID, groups
		  whoami                                   # current user
		  who                                      # logged-in users
		  w                                        # who + what they're doing
		  last                                     # login history
		  cat /etc/passwd                          # user database
		  getent passwd username                   # user entry
		  ```
	- ## Group Commands
		- ```bash
		  sudo groupadd developers                 # create group
		  sudo groupadd -g 2000 developers         # with specific GID
		  sudo groupmod -n devs developers         # rename group
		  sudo groupdel developers                 # delete group
		  
		  # View groups
		  groups username                          # user's groups
		  cat /etc/group                           # group database
		  getent group wheel                       # specific group
		  ```
	- ## The wheel Group & sudo
		- On Rocky Linux (like RHEL), the **wheel** group grants sudo access.
		- ```bash
		  # Add user to wheel group
		  sudo usermod -aG wheel username
		  
		  # Verify
		  groups username    # should show "wheel"
		  
		  # sudo configuration
		  sudo visudo        # safely edit /etc/sudoers
		  
		  # /etc/sudoers key lines:
		  # %wheel  ALL=(ALL)  ALL          → wheel group can sudo (with password)
		  # %wheel  ALL=(ALL)  NOPASSWD: ALL → no password (less secure)
		  
		  # User-specific sudo rule (in /etc/sudoers.d/)
		  echo "username ALL=(ALL) NOPASSWD: /usr/bin/dnf" | sudo tee /etc/sudoers.d/username
		  ```
		- > [!warning] Never edit `/etc/sudoers` directly with a text editor — always use `visudo` which validates syntax before saving. A broken sudoers file can lock you out.
	- ## Password Policies
		- ```bash
		  # View password aging info
		  sudo chage -l username
		  
		  # Set password expiry (90 days)
		  sudo chage -M 90 username
		  
		  # Force password change on next login
		  sudo chage -d 0 username
		  
		  # Set minimum days between changes
		  sudo chage -m 7 username
		  
		  # Password policy in /etc/login.defs
		  grep -E "PASS_MAX_DAYS|PASS_MIN_DAYS|PASS_WARN_AGE" /etc/login.defs
		  ```
- # Systemd & Service Management
  collapsed:: true
	- ## systemctl Essentials
		- ```bash
		  # ── SERVICE CONTROL ────────────────────────────────────
		  sudo systemctl start nginx          # start service
		  sudo systemctl stop nginx           # stop service
		  sudo systemctl restart nginx        # stop + start
		  sudo systemctl reload nginx         # reload config (no downtime)
		  sudo systemctl enable nginx         # start on boot
		  sudo systemctl disable nginx        # don't start on boot
		  sudo systemctl enable --now nginx   # enable + start immediately
		  sudo systemctl disable --now nginx  # disable + stop immediately
		  
		  # ── STATUS & INFO ───────────────────────────────────────
		  systemctl status nginx              # service status + recent logs
		  systemctl is-active nginx           # active/inactive
		  systemctl is-enabled nginx          # enabled/disabled
		  systemctl is-failed nginx           # failed/not-failed
		  systemctl list-units --type=service # all active services
		  systemctl list-units --type=service --all  # including inactive
		  systemctl list-unit-files --type=service   # all + enabled state
		  
		  # ── SYSTEM TARGETS ──────────────────────────────────────
		  systemctl get-default               # current default target
		  sudo systemctl set-default multi-user.target   # set CLI default
		  sudo systemctl set-default graphical.target    # set GUI default
		  sudo systemctl isolate rescue.target            # switch to rescue mode
		  
		  # ── SYSTEM POWER ────────────────────────────────────────
		  sudo systemctl reboot               # reboot
		  sudo systemctl poweroff             # shutdown
		  sudo systemctl halt                 # halt (no power off)
		  sudo systemctl suspend              # suspend to RAM
		  ```
	- ## journalctl — Log Management
		- ```bash
		  # View all logs
		  journalctl                          # all logs (oldest first)
		  journalctl -r                       # reverse (newest first)
		  journalctl -f                       # follow (like tail -f)
		  journalctl -n 50                    # last 50 lines
		  
		  # Filter by service
		  journalctl -u nginx                 # nginx logs only
		  journalctl -u nginx -f              # follow nginx logs
		  journalctl -u nginx --since today   # today's nginx logs
		  
		  # Filter by time
		  journalctl --since "2024-01-01 00:00:00"
		  journalctl --since "1 hour ago"
		  journalctl --since yesterday --until today
		  
		  # Filter by priority
		  journalctl -p err                   # errors only
		  journalctl -p warning               # warnings and above
		  # Priorities: emerg, alert, crit, err, warning, notice, info, debug
		  
		  # Filter by boot
		  journalctl -b                       # current boot
		  journalctl -b -1                    # previous boot
		  journalctl --list-boots             # all boot sessions
		  
		  # Kernel messages
		  journalctl -k                       # kernel messages (like dmesg)
		  dmesg | tail -20                    # recent kernel messages
		  
		  # Disk usage
		  journalctl --disk-usage
		  sudo journalctl --vacuum-size=500M  # keep only 500MB of logs
		  sudo journalctl --vacuum-time=30d   # keep only last 30 days
		  ```
	- ## Traditional Log Files
		- ```bash
		  /var/log/messages       # general system messages (main log)
		  /var/log/secure         # authentication, sudo, SSH logs
		  /var/log/cron           # cron job logs
		  /var/log/maillog        # mail server logs
		  /var/log/boot.log       # boot messages
		  /var/log/dnf.log        # DNF package manager log
		  /var/log/audit/audit.log # SELinux + auditd events
		  /var/log/httpd/         # Apache access + error logs
		  /var/log/nginx/         # Nginx access + error logs
		  ```
	- ## Custom Systemd Unit
		- ```ini
		  # /etc/systemd/system/myapp.service
		  [Unit]
		  Description=My Custom Application
		  After=network.target
		  Wants=network-online.target
		  
		  [Service]
		  Type=simple
		  User=myapp
		  Group=myapp
		  WorkingDirectory=/opt/myapp
		  ExecStart=/opt/myapp/bin/myapp --config /etc/myapp/config.yaml
		  ExecReload=/bin/kill -HUP $MAINPID
		  Restart=on-failure
		  RestartSec=5s
		  StandardOutput=journal
		  StandardError=journal
		  SyslogIdentifier=myapp
		  
		  # Security hardening
		  NoNewPrivileges=yes
		  ProtectSystem=strict
		  ProtectHome=yes
		  PrivateTmp=yes
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  # After creating the unit file:
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now myapp
		  journalctl -u myapp -f
		  ```
- # Networking
  collapsed:: true
	- ## Network Commands
		- ```bash
		  # ── IP & INTERFACES ────────────────────────────────────
		  ip addr show                        # all interfaces + IPs
		  ip addr show eth0                   # specific interface
		  ip link show                        # link layer info
		  ip route show                       # routing table
		  ip route add default via 192.168.1.1  # add default gateway
		  ip neigh show                       # ARP table
		  
		  # ── CONNECTIVITY ────────────────────────────────────────
		  ping -c 4 8.8.8.8                   # ping (4 packets)
		  traceroute 8.8.8.8                  # trace route
		  mtr 8.8.8.8                         # combined ping + traceroute
		  curl -I https://rockylinux.org      # HTTP headers
		  wget https://example.com/file.tar.gz  # download file
		  
		  # ── SOCKETS & PORTS ─────────────────────────────────────
		  ss -tulnp                           # all listening ports + process
		  ss -tulnp | grep :80                # who's on port 80
		  netstat -tulnp                      # older alternative (net-tools)
		  
		  # ── DNS ─────────────────────────────────────────────────
		  dig rockylinux.org                  # DNS lookup
		  dig +short rockylinux.org           # just the IP
		  nslookup rockylinux.org             # alternative DNS lookup
		  host rockylinux.org                 # simple lookup
		  cat /etc/resolv.conf                # DNS servers
		  ```
	- ## NetworkManager & nmcli
		- Rocky Linux uses **NetworkManager** for network configuration.
		- ```bash
		  # ── STATUS ──────────────────────────────────────────────
		  nmcli general status               # overall NM status
		  nmcli connection show              # all connections
		  nmcli device status                # all devices
		  nmcli device show eth0             # device details
		  
		  # ── CONFIGURE STATIC IP ─────────────────────────────────
		  nmcli connection modify "eth0" \
		      ipv4.method manual \
		      ipv4.addresses "192.168.1.100/24" \
		      ipv4.gateway "192.168.1.1" \
		      ipv4.dns "8.8.8.8,8.8.4.4"
		  nmcli connection up "eth0"
		  
		  # ── CONFIGURE DHCP ──────────────────────────────────────
		  nmcli connection modify "eth0" ipv4.method auto
		  nmcli connection up "eth0"
		  
		  # ── ADD NEW CONNECTION ───────────────────────────────────
		  nmcli connection add type ethernet ifname eth1 con-name "my-eth1"
		  
		  # ── WIFI (if applicable) ─────────────────────────────────
		  nmcli device wifi list
		  nmcli device wifi connect "SSID" password "password"
		  
		  # Connection files location
		  ls /etc/NetworkManager/system-connections/
		  ```
	- ## firewalld — Zone-Based Firewall
		- Rocky Linux uses **firewalld** with a zone-based model (same as RHEL/Fedora).
		- ```bash
		  # ── STATUS ──────────────────────────────────────────────
		  sudo systemctl status firewalld
		  sudo firewall-cmd --state
		  sudo firewall-cmd --get-active-zones
		  sudo firewall-cmd --get-default-zone
		  sudo firewall-cmd --list-all              # current zone rules
		  
		  # ── ZONES ───────────────────────────────────────────────
		  # Zones (trust level low → high):
		  # drop, block, public, external, dmz, work, home, internal, trusted
		  sudo firewall-cmd --set-default-zone=public
		  
		  # ── ALLOW SERVICES ──────────────────────────────────────
		  sudo firewall-cmd --permanent --add-service=http
		  sudo firewall-cmd --permanent --add-service=https
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --reload                # apply permanent rules
		  
		  # ── ALLOW PORTS ─────────────────────────────────────────
		  sudo firewall-cmd --permanent --add-port=8080/tcp
		  sudo firewall-cmd --permanent --add-port=3000-3010/tcp
		  sudo firewall-cmd --permanent --remove-port=8080/tcp
		  
		  # ── RICH RULES (advanced) ───────────────────────────────
		  # Allow specific IP to SSH
		  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.50" service name="ssh" accept'
		  # Block an IP
		  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="10.0.0.5" drop'
		  
		  # ── LIST & REMOVE ────────────────────────────────────────
		  sudo firewall-cmd --list-services
		  sudo firewall-cmd --list-ports
		  sudo firewall-cmd --permanent --remove-service=telnet
		  ```
		- > [!info] Always use `--permanent` flag to persist rules across reboots, then `--reload` to apply them. Without `--permanent`, rules are lost on reboot.
	- ## SSH Hardening
		- ```bash
		  # Edit SSH config
		  sudo vim /etc/ssh/sshd_config
		  
		  # Recommended hardening settings:
		  ```
		- ```ini
		  # /etc/ssh/sshd_config — Rocky Linux SSH hardening
		  Port 2222                        # change default port (optional)
		  Protocol 2                       # SSH protocol 2 only
		  PermitRootLogin no               # disable root SSH login
		  PasswordAuthentication no        # key-based auth only
		  PubkeyAuthentication yes         # enable key auth
		  AuthorizedKeysFile .ssh/authorized_keys
		  PermitEmptyPasswords no          # no empty passwords
		  MaxAuthTries 3                   # limit auth attempts
		  LoginGraceTime 30                # 30 second login window
		  ClientAliveInterval 300          # disconnect idle after 5 min
		  ClientAliveCountMax 2
		  AllowUsers youruser              # whitelist specific users
		  X11Forwarding no                 # disable X11 forwarding
		  ```
		- ```bash
		  # Apply changes
		  sudo systemctl restart sshd
		  
		  # If you changed the port, update firewalld
		  sudo firewall-cmd --permanent --remove-service=ssh
		  sudo firewall-cmd --permanent --add-port=2222/tcp
		  sudo firewall-cmd --reload
		  
		  # Generate SSH key pair (on client)
		  ssh-keygen -t ed25519 -C "your@email.com"
		  ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server
		  ```
- # SELinux
  collapsed:: true
	- ## What is SELinux?
		- **Security-Enhanced Linux (SELinux)** is a mandatory access control (MAC) system built into the Linux kernel, developed by the NSA and Red Hat.
		- On Rocky Linux (like RHEL and [[Fedora]]), SELinux is **enforcing by default** — it actively blocks unauthorized access.
		- Unlike traditional Unix permissions (DAC), SELinux enforces policies based on **labels/contexts** on every file, process, and port.
		- > [!info] SELinux is one of the most powerful security features of the RHEL family. Disabling it is strongly discouraged — learn to work with it instead.
	- ## SELinux Modes
		- ```bash
		  # Check current mode
		  getenforce                    # Enforcing / Permissive / Disabled
		  sestatus                      # detailed status
		  
		  # Temporarily change mode (until reboot)
		  sudo setenforce 0             # switch to Permissive (log but don't block)
		  sudo setenforce 1             # switch back to Enforcing
		  
		  # Permanently change mode
		  sudo vim /etc/selinux/config
		  ```
		- ```ini
		  # /etc/selinux/config
		  SELINUX=enforcing     # enforcing | permissive | disabled
		  SELINUXTYPE=targeted  # targeted (default) | mls
		  ```
		- > [!warning] Setting `SELINUX=disabled` requires a reboot and triggers a full filesystem relabel on re-enable. Use `permissive` for debugging instead.
	- ## SELinux Contexts
		- ```bash
		  # View contexts
		  ls -Z /var/www/html/          # file contexts
		  ps -eZ | grep nginx           # process contexts
		  ss -tlnpZ                     # port contexts
		  
		  # Context format: user:role:type:level
		  # Example: system_u:object_r:httpd_sys_content_t:s0
		  
		  # Change file context
		  sudo chcon -t httpd_sys_content_t /var/www/html/myfile.html
		  sudo chcon -R -t httpd_sys_content_t /var/www/mysite/
		  
		  # Restore default context (from policy)
		  sudo restorecon -v /var/www/html/myfile.html
		  sudo restorecon -Rv /var/www/mysite/
		  
		  # Set persistent custom context
		  sudo semanage fcontext -a -t httpd_sys_content_t "/mywebroot(/.*)?"
		  sudo restorecon -Rv /mywebroot/
		  ```
	- ## SELinux Booleans
		- ```bash
		  # List all booleans
		  getsebool -a
		  getsebool -a | grep httpd
		  
		  # Common booleans
		  sudo setsebool -P httpd_can_network_connect on    # allow Apache to connect to network
		  sudo setsebool -P httpd_can_network_connect_db on # allow Apache → database
		  sudo setsebool -P httpd_use_nfs on                # allow Apache to use NFS
		  sudo setsebool -P httpd_execmem on                # allow Apache to execute memory
		  sudo setsebool -P allow_user_exec_content on      # allow users to run content
		  
		  # -P flag makes the change persistent across reboots
		  ```
	- ## SELinux Port Management
		- ```bash
		  # List ports for a type
		  sudo semanage port -l | grep http
		  sudo semanage port -l | grep ssh
		  
		  # Add a custom port (e.g., Nginx on port 8080)
		  sudo semanage port -a -t http_port_t -p tcp 8080
		  
		  # Modify existing port label
		  sudo semanage port -m -t http_port_t -p tcp 8080
		  
		  # Remove custom port
		  sudo semanage port -d -t http_port_t -p tcp 8080
		  ```
	- ## Troubleshooting SELinux Denials
		- ```bash
		  # View recent denials
		  sudo ausearch -m avc -ts recent
		  sudo ausearch -m avc -ts today
		  
		  # View denials in human-readable form
		  sudo sealert -a /var/log/audit/audit.log
		  
		  # Install setroubleshoot for better messages
		  sudo dnf install setroubleshoot-server -y
		  sudo systemctl restart auditd
		  
		  # audit2why — explain why something was denied
		  sudo ausearch -m avc -ts recent | audit2why
		  
		  # audit2allow — generate a policy module to allow the action
		  sudo ausearch -m avc -ts recent | audit2allow -M mypolicy
		  sudo semodule -i mypolicy.pp
		  
		  # Check /var/log/audit/audit.log directly
		  sudo grep "denied" /var/log/audit/audit.log | tail -20
		  ```
		- > [!tip] When something breaks after enabling SELinux, switch to `permissive` mode, reproduce the issue, then run `audit2why` to understand what policy is needed. Never just disable SELinux.
- # Security Hardening
  collapsed:: true
	- ## System Crypto Policies
		- Rocky Linux 9 introduces **system-wide cryptographic policies** — a single setting that configures all crypto libraries consistently.
		- ```bash
		  # View current policy
		  update-crypto-policies --show
		  
		  # Available policies:
		  # DEFAULT  → balanced security/compatibility
		  # FUTURE   → stricter (may break old clients)
		  # LEGACY   → maximum compatibility (weaker)
		  # FIPS     → FIPS 140-2 compliance
		  
		  # Set policy
		  sudo update-crypto-policies --set DEFAULT
		  sudo update-crypto-policies --set FUTURE
		  
		  # Apply FIPS mode (requires reboot)
		  sudo fips-mode-setup --enable
		  sudo reboot
		  ```
	- ## fail2ban — Brute Force Protection
		- ```bash
		  # Install (from EPEL)
		  sudo dnf install fail2ban -y
		  sudo systemctl enable --now fail2ban
		  
		  # Configuration
		  sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
		  sudo vim /etc/fail2ban/jail.local
		  ```
		- ```ini
		  # /etc/fail2ban/jail.local — key settings
		  [DEFAULT]
		  bantime  = 3600        ; ban for 1 hour
		  findtime = 600         ; within 10 minutes
		  maxretry = 5           ; after 5 failures
		  
		  [sshd]
		  enabled  = true
		  port     = ssh
		  logpath  = %(sshd_log)s
		  backend  = %(sshd_backend)s
		  
		  [nginx-http-auth]
		  enabled  = true
		  port     = http,https
		  logpath  = /var/log/nginx/error.log
		  ```
		- ```bash
		  sudo systemctl restart fail2ban
		  
		  # Check status
		  sudo fail2ban-client status
		  sudo fail2ban-client status sshd
		  
		  # Unban an IP
		  sudo fail2ban-client set sshd unbanip 192.168.1.100
		  ```
	- ## auditd — System Auditing
		- ```bash
		  # auditd is installed and running by default on Rocky Linux
		  sudo systemctl status auditd
		  
		  # View audit log
		  sudo ausearch -ts today
		  sudo ausearch -m USER_LOGIN -ts today    # login events
		  sudo ausearch -m SYSCALL -ts recent      # system calls
		  
		  # Add audit rules
		  sudo auditctl -w /etc/passwd -p wa -k passwd_changes
		  sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes
		  sudo auditctl -w /var/log/auth.log -p wa -k auth_log
		  
		  # Persistent audit rules
		  sudo vim /etc/audit/rules.d/audit.rules
		  ```
		- ```bash
		  # /etc/audit/rules.d/audit.rules
		  -w /etc/passwd -p wa -k passwd_changes
		  -w /etc/shadow -p wa -k shadow_changes
		  -w /etc/sudoers -p wa -k sudoers_changes
		  -w /etc/ssh/sshd_config -p wa -k sshd_config
		  -a always,exit -F arch=b64 -S execve -k exec_commands
		  ```
		- ```bash
		  sudo service auditd restart
		  sudo aureport --summary                  # audit summary report
		  sudo aureport --login                    # login report
		  sudo aureport --failed                   # failed events
		  ```
	- ## AIDE — File Integrity Monitoring
		- ```bash
		  # Install AIDE (Advanced Intrusion Detection Environment)
		  sudo dnf install aide -y
		  
		  # Initialize the database (takes a few minutes)
		  sudo aide --init
		  sudo mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
		  
		  # Run a check (compare current state vs baseline)
		  sudo aide --check
		  
		  # Update database after legitimate changes
		  sudo aide --update
		  sudo mv /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
		  
		  # Schedule daily checks via cron
		  echo "0 3 * * * root /usr/sbin/aide --check | mail -s 'AIDE Report' admin@example.com" \
		      | sudo tee /etc/cron.d/aide
		  ```
	- ## dnf-automatic — Automatic Security Updates
		- ```bash
		  sudo dnf install dnf-automatic -y
		  
		  # Configure
		  sudo vim /etc/dnf/automatic.conf
		  ```
		- ```ini
		  # /etc/dnf/automatic.conf
		  [commands]
		  upgrade_type = security    # only security updates (or 'default' for all)
		  apply_updates = yes        # auto-apply (or 'no' to just download)
		  download_updates = yes
		  
		  [emitters]
		  emit_via = email
		  
		  [email]
		  email_from = root@localhost
		  email_to = admin@example.com
		  email_host = localhost
		  ```
		- ```bash
		  # Enable the timer
		  sudo systemctl enable --now dnf-automatic.timer
		  sudo systemctl status dnf-automatic.timer
		  ```
	- ## Lynis — Security Auditing
		- ```bash
		  # Install Lynis (from EPEL)
		  sudo dnf install lynis -y
		  
		  # Run full system audit
		  sudo lynis audit system
		  
		  # View report
		  cat /var/log/lynis.log
		  cat /var/log/lynis-report.dat
		  
		  # Lynis gives a hardening index score and specific recommendations
		  # Focus on "Suggestions" and "Warnings" in the output
		  ```
- # Rocky Linux as a Server
  collapsed:: true
	- ## LAMP Stack (Linux + Apache + MariaDB + PHP)
		- ```bash
		  # Install Apache
		  sudo dnf install httpd -y
		  sudo systemctl enable --now httpd
		  sudo firewall-cmd --permanent --add-service=http
		  sudo firewall-cmd --permanent --add-service=https
		  sudo firewall-cmd --reload
		  
		  # Install MariaDB
		  sudo dnf install mariadb-server -y
		  sudo systemctl enable --now mariadb
		  sudo mysql_secure_installation    # secure the installation
		  
		  # Install PHP (using AppStream module)
		  sudo dnf module enable php:8.1 -y
		  sudo dnf install php php-mysqlnd php-fpm php-json php-mbstring php-xml -y
		  sudo systemctl enable --now php-fpm
		  sudo systemctl restart httpd
		  
		  # Test PHP
		  echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/info.php
		  curl http://localhost/info.php | grep "PHP Version"
		  sudo rm /var/www/html/info.php   # remove after testing!
		  
		  # SELinux for Apache
		  sudo setsebool -P httpd_can_network_connect_db on
		  sudo restorecon -Rv /var/www/html/
		  ```
	- ## Nginx Web Server
		- ```bash
		  # Install Nginx
		  sudo dnf install nginx -y
		  sudo systemctl enable --now nginx
		  
		  # Basic virtual host config
		  sudo vim /etc/nginx/conf.d/mysite.conf
		  ```
		- ```ini
		  # /etc/nginx/conf.d/mysite.conf
		  server {
		      listen 80;
		      server_name mysite.example.com;
		      root /var/www/mysite;
		      index index.html index.php;
		  
		      access_log /var/log/nginx/mysite_access.log;
		      error_log  /var/log/nginx/mysite_error.log;
		  
		      location / {
		          try_files $uri $uri/ =404;
		      }
		  
		      location ~ \.php$ {
		          fastcgi_pass unix:/run/php-fpm/www.sock;
		          fastcgi_index index.php;
		          include fastcgi_params;
		          fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
		      }
		  }
		  ```
		- ```bash
		  sudo nginx -t                    # test config
		  sudo systemctl reload nginx      # apply config
		  
		  # SELinux for Nginx
		  sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/mysite(/.*)?"
		  sudo restorecon -Rv /var/www/mysite/
		  ```
	- ## PostgreSQL Database Server
		- ```bash
		  # Install PostgreSQL (using AppStream module)
		  sudo dnf module enable postgresql:15 -y
		  sudo dnf install postgresql-server postgresql-contrib -y
		  
		  # Initialize database cluster
		  sudo postgresql-setup --initdb
		  
		  # Start and enable
		  sudo systemctl enable --now postgresql
		  
		  # Connect as postgres user
		  sudo -u postgres psql
		  
		  # Basic PostgreSQL commands
		  ```
		- ```sql
		  -- Create database and user
		  CREATE DATABASE myapp;
		  CREATE USER myuser WITH ENCRYPTED PASSWORD 'strongpassword';
		  GRANT ALL PRIVILEGES ON DATABASE myapp TO myuser;
		  \q
		  ```
		- ```bash
		  # Configure remote access
		  sudo vim /var/lib/pgsql/data/postgresql.conf
		  # listen_addresses = 'localhost'   → change to '*' for remote
		  
		  sudo vim /var/lib/pgsql/data/pg_hba.conf
		  # Add: host myapp myuser 192.168.1.0/24 md5
		  
		  sudo systemctl restart postgresql
		  sudo firewall-cmd --permanent --add-service=postgresql
		  sudo firewall-cmd --reload
		  ```
	- ## Let's Encrypt SSL with Certbot
		- ```bash
		  # Install Certbot (from EPEL)
		  sudo dnf install certbot python3-certbot-nginx -y
		  
		  # Obtain certificate (Nginx)
		  sudo certbot --nginx -d mysite.example.com -d www.mysite.example.com
		  
		  # Obtain certificate (Apache)
		  sudo certbot --apache -d mysite.example.com
		  
		  # Test auto-renewal
		  sudo certbot renew --dry-run
		  
		  # Certbot auto-renewal timer (installed automatically)
		  sudo systemctl status certbot-renew.timer
		  
		  # Manual renewal
		  sudo certbot renew
		  ```
	- ## Cockpit Web UI
		- **Cockpit** is a browser-based server management interface — included in Rocky Linux.
		- ```bash
		  # Install Cockpit
		  sudo dnf install cockpit -y
		  sudo systemctl enable --now cockpit.socket
		  
		  # Open firewall
		  sudo firewall-cmd --permanent --add-service=cockpit
		  sudo firewall-cmd --reload
		  
		  # Access at: https://your-server-ip:9090
		  # Login with your system username and password
		  
		  # Install additional Cockpit modules
		  sudo dnf install cockpit-machines    # VM management (libvirt)
		  sudo dnf install cockpit-podman      # container management
		  sudo dnf install cockpit-storaged    # storage management
		  sudo dnf install cockpit-networkmanager  # network management
		  ```
		- > [!tip] Cockpit is perfect for managing Rocky Linux servers without memorizing every CLI command. It provides real-time metrics, log viewing, service management, and storage configuration — all from a browser.
	- ## Podman — Rootless Containers
		- ```bash
		  # Podman is available in Rocky Linux repos
		  sudo dnf install podman podman-compose -y
		  
		  # Run a container (rootless — no sudo needed)
		  podman run -d --name nginx -p 8080:80 nginx:latest
		  
		  # List containers
		  podman ps
		  podman ps -a    # including stopped
		  
		  # Manage containers
		  podman stop nginx
		  podman start nginx
		  podman rm nginx
		  podman logs nginx
		  
		  # Pull images
		  podman pull rockylinux:9
		  podman images
		  
		  # Run Rocky Linux container
		  podman run -it rockylinux:9 bash
		  
		  # Generate systemd unit for container
		  podman generate systemd --name nginx --files --new
		  ```
- # More Learn
	- ## Official Resources
		- [Rocky Linux Official Website](https://rockylinux.org)
		- [Rocky Linux Documentation](https://docs.rockylinux.org)
		- [Rocky Linux Wiki](https://wiki.rockylinux.org)
		- [Rocky Linux GitHub](https://github.com/rocky-linux)
		- [RESF (Rocky Enterprise Software Foundation)](https://resf.org)
		- [Rocky Linux Forums](https://forums.rockylinux.org)
		- [Rocky Linux Mattermost Chat](https://chat.rockylinux.org)
	- ## Related Distros & Comparisons
		- [[Fedora]] — upstream of RHEL; cutting-edge RPM-based distro
		- [[CentOS]] — predecessor to Rocky Linux; now CentOS Stream
		- [[Debian]] — different family (APT-based), also enterprise-friendly
		- [[Kali Linux]] — security-focused Debian-based distro
		- [[Ubuntu]] — popular Debian-based distro with LTS releases
		- [[Linux Advanced]] — advanced Linux administration topics
	- ## Key Concepts to Learn Next
		- SELinux deep dive → [[Linux Advanced]]
		- LVM (Logical Volume Manager) for flexible storage
		- Ansible automation for Rocky Linux fleet management
		- Podman + Kubernetes on Rocky Linux
		- Rocky Linux in AWS/GCP/Azure cloud environments
		- RHEL certification (RHCSA/RHCE) — Rocky is perfect for exam prep
	- ## YouTube Playlists
		- Search: "Rocky Linux tutorial" on YouTube
		- Search: "RHEL 9 administration" — applies directly to Rocky Linux
		- Search: "Linux Foundation RHCSA prep Rocky Linux"
	- ## Books & Courses
		- "RHCSA Red Hat Enterprise Linux 9" by Michael Jang — applies to Rocky
		- Red Hat Learning Subscription (concepts apply to Rocky)
		- Linux Foundation LFCS certification prep