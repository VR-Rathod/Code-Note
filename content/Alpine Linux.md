---
seoTitle: Alpine Linux Complete Guide – apk, OpenRC, Docker & Security
description: "Comprehensive Alpine Linux reference covering installation, apk package management, OpenRC, musl libc, BusyBox, Docker containers, security hardening, and embedded/server use cases."
keywords: "Alpine Linux, alpine linux guide, alpine linux commands, alpine apk, alpine docker, alpine tutorial, alpine linux administration, alpine linux server, alpine linux security, musl libc, BusyBox, OpenRC, alpine container, alpine embedded, alpine raspberry pi, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Alpine Linux – Complete Guide
treeTitle: OS - Linux Distros - Alpine Linux
enableToc: true
---

- # History
  collapsed:: true
	- ## Origins — LEAF Project & Early Days
		- Alpine Linux was created by **Natanael Copa** in **2005**, initially as a fork of the **LEAF Project** (Linux Embedded Appliance Framework).
		- LEAF was a tiny Linux distribution designed to run from a single floppy disk for embedded firewall/router appliances.
		- Copa wanted something more capable — a small, secure, general-purpose Linux that could run on embedded hardware, routers, and servers.
		- The first public release was **Alpine Linux 1.0** in **2006**.
	- ## The musl + BusyBox Decision
		- Early Alpine used **uClibc** (micro C library) instead of the heavyweight **glibc** used by most distros.
		- In **2014**, Alpine switched to **musl libc** — a clean, standards-compliant, security-focused C library written from scratch.
		- Combined with **BusyBox** (a single binary providing ~300+ Unix utilities), Alpine achieved an incredibly small footprint.
		- The base system image is under **5 MB** — compared to Ubuntu's ~70 MB or Debian's ~120 MB.
	- ## Security-Hardened Kernel
		- Alpine ships a kernel patched with **grsecurity/PaX** patches (in the `linux-hardened` variant), providing:
			- **ASLR** (Address Space Layout Randomization) — stronger than vanilla kernel
			- **PaX** — prevents code execution in data pages
			- **Stack smashing protection** — SSP/canaries compiled into all packages
			- **PIE** (Position Independent Executables) — all binaries compiled as PIE
		- This made Alpine a natural fit for security-conscious deployments.
	- ## The Docker Revolution (2013–2015)
		- When **Docker** exploded in popularity around 2013–2014, the community needed a tiny, secure base image.
		- Alpine became the **#1 Docker base image** because:
			- `alpine:latest` is only **~5 MB** (vs `ubuntu:latest` at ~70 MB)
			- Fast pull times in CI/CD pipelines
			- Minimal attack surface — fewer packages = fewer CVEs
			- `apk` package manager is fast and simple
		- Today, Alpine is the most-pulled base image on Docker Hub, used by nginx, Redis, Node.js, Python, and hundreds of official images.
	- ## Timeline
		- ```
		  2005 → Natanael Copa starts Alpine as LEAF fork
		  2006 → Alpine Linux 1.0 released
		  2010 → Alpine Linux Foundation formed
		  2012 → Switched to OpenRC init system
		  2014 → Migrated from uClibc to musl libc
		  2015 → Became dominant Docker base image
		  2017 → Alpine 3.6 — first to ship musl 1.1.16
		  2021 → Alpine 3.14 — improved cloud/container support
		  2023 → Alpine 3.18 — improved Rust/Go toolchain support
		  2024 → Alpine 3.20 — latest stable branch
		  ```
- # Introduction
  collapsed:: true
	- ## What is Alpine Linux?
		- Alpine Linux is a **security-oriented, lightweight Linux distribution** based on musl libc and BusyBox.
		- It is designed for **power users, containers, embedded systems, and servers** where minimal footprint and security matter most.
		- Unlike most distros, Alpine does NOT use **systemd** — it uses **OpenRC**, a dependency-based init system.
		- The default shell is **ash** (from BusyBox), not bash.
		- Uses **doas** instead of sudo for privilege escalation (though sudo is available via apk).
		- See also: [[Linux Advanced]], [[Debian]], [[Fedora]]
	- ## Alpine vs Debian vs Ubuntu — Comparison Table
		- | Feature | Alpine Linux | Debian | Ubuntu |
		  |---------|-------------|--------|--------|
		  | Base size | ~5 MB | ~120 MB | ~70 MB |
		  | C library | musl libc | glibc | glibc |
		  | Init system | OpenRC | systemd | systemd |
		  | Package manager | apk | apt/dpkg | apt/dpkg |
		  | Default shell | ash (BusyBox) | bash | bash |
		  | Privilege tool | doas | sudo | sudo |
		  | Kernel | linux-lts / linux-hardened | linux | linux |
		  | Docker image size | ~5 MB | ~120 MB | ~70 MB |
		  | Release model | Rolling branches (3.x) | Stable/Testing/Unstable | LTS + interim |
		  | Target use | Containers, embedded, servers | Servers, desktops | Desktops, servers |
		  | Binary compatibility | musl only | glibc | glibc |
		  | systemd | No | Yes | Yes |
		  | Snap support | No | No | Yes |
	- ## Alpine Editions / Flavors
		- ```
		  Standard     → Full installer, for bare metal / VMs
		  Extended     → Standard + extra packages (useful tools pre-included)
		  Virtual      → Optimized for virtual machines (smaller kernel)
		  Netboot      → PXE boot over network, no local media needed
		  Mini Root FS → Tiny rootfs tarball for containers / chroot
		  Raspberry Pi → ARM image for RPi 2/3/4/5
		  Cloud        → AWS, GCP, Azure, OpenStack images
		  Xen          → Optimized for Xen hypervisor
		  ```
	- ## Advantages
		- Tiny footprint (~5 MB base) — fastest Docker pulls, minimal disk usage
		- Strong security defaults — musl libc, PIE, SSP, hardened kernel option
		- Fast `apk` package manager — written in C, extremely quick
		- No systemd — OpenRC is simpler, faster boot on minimal systems
		- Excellent for containers — official Docker base image
		- Rolling-style branches — `edge` for latest, `3.x` for stability
		- Works great on embedded hardware (Raspberry Pi, routers, NAS)
		- Diskless mode — runs entirely from RAM, perfect for appliances
		- Very low memory usage — can run in 64 MB RAM
		- Active community, well-maintained packages
	- ## Disadvantages
		- **musl libc incompatibility** — some software compiled for glibc won't run without recompilation
		- No bash by default — scripts assuming bash may fail (use `#!/bin/sh` or install bash)
		- Smaller package repository than Debian/Ubuntu
		- Some proprietary software (e.g., Oracle JDK, some games) won't run due to musl
		- Less desktop-friendly — no official GNOME/KDE spin
		- BusyBox utilities have fewer flags than GNU coreutils
		- `glibc`-only binaries (e.g., some Go/Rust pre-built binaries) need workarounds
		- Less documentation compared to Ubuntu/Debian
	- ## Use Cases
		- Docker / container base images (most popular use case)
		- Embedded systems and IoT devices
		- Minimal VMs and cloud instances
		- Security-hardened servers (web, DNS, VPN)
		- Network appliances (firewall, router, proxy)
		- CI/CD pipeline runners
		- Raspberry Pi and ARM boards
		- Diskless appliances (runs from RAM)
- # Installation
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum (CLI / Server):
		    CPU:   i486 or newer (x86), ARMv6+ (ARM)
		    RAM:   64 MB minimum, 256 MB recommended
		    Disk:  700 MB minimum, 4 GB recommended
		    Boot:  USB, CD, PXE, or existing disk
		  
		  Recommended (general use):
		    CPU:   64-bit x86_64 or aarch64
		    RAM:   512 MB+
		    Disk:  2 GB+ (depends on workload)
		  
		  Supported architectures:
		    x86, x86_64, aarch64, armhf, armv7, ppc64le, s390x, riscv64
		  ```
	- ## Download & Create Bootable USB
		- ```bash
		  # Download Alpine ISO from https://alpinelinux.org/downloads/
		  # Choose: Standard (bare metal), Virtual (VM), or Extended
		  
		  # Create bootable USB on Linux
		  sudo dd if=alpine-standard-3.20.0-x86_64.iso of=/dev/sdX bs=4M status=progress
		  sync
		  
		  # On macOS
		  sudo dd if=alpine-standard-3.20.0-x86_64.iso of=/dev/rdiskX bs=4m
		  
		  # Using Ventoy (multi-boot) — just copy ISO to Ventoy USB
		  # Using Rufus on Windows — select ISO, write in DD mode
		  ```
	- ## The setup-alpine Script
		- Alpine uses a single interactive script `setup-alpine` to configure the system.
		- ```bash
		  # Boot from USB → login as root (no password)
		  # Run the setup script:
		  setup-alpine
		  
		  # The script will ask:
		  # 1. Keyboard layout (e.g., us)
		  # 2. Hostname (e.g., alpine-server)
		  # 3. Network interface (eth0, wlan0, etc.)
		  # 4. IP address (DHCP or static)
		  # 5. DNS server (e.g., 8.8.8.8)
		  # 6. Root password
		  # 7. Timezone (e.g., UTC or Asia/Kolkata)
		  # 8. HTTP proxy (none if direct)
		  # 9. NTP client (chrony recommended)
		  # 10. Mirror for apk (select fastest)
		  # 11. SSH server (openssh or dropbear)
		  # 12. Disk to use (e.g., sda)
		  # 13. Install mode: sys / data / lvm / cryptsys / none
		  ```
	- ## Install Modes Explained
		- ```
		  sys       → Traditional install to disk (like any Linux distro)
		             Disk is read/write, changes persist on reboot
		             Best for: servers, VMs, workstations
		  
		  data      → OS runs from RAM (diskless), /var and /home on disk
		             Fast boot, disk used only for persistent data
		             Best for: appliances, routers
		  
		  lvm       → sys install but using LVM for disk management
		             Best for: servers needing flexible partitioning
		  
		  cryptsys  → sys install with full disk encryption (LUKS)
		             Best for: laptops, sensitive data
		  
		  none      → No disk install — pure diskless/RAM mode
		             Changes lost on reboot (use lbu to save)
		             Best for: live environments, embedded
		  ```
	- ## Manual Disk Setup
		- ```bash
		  # If you want manual partitioning before setup-alpine:
		  
		  # List disks
		  fdisk -l
		  lsblk
		  
		  # Partition with fdisk (MBR) or gdisk (GPT)
		  fdisk /dev/sda
		  # Create: /dev/sda1 (boot, 512MB), /dev/sda2 (swap, 2GB), /dev/sda3 (root, rest)
		  
		  # Format partitions
		  mkfs.ext4 /dev/sda3
		  mkfs.ext4 /dev/sda1
		  mkswap /dev/sda2
		  
		  # For UEFI systems — EFI partition
		  mkfs.fat -F32 /dev/sda1
		  
		  # setup-alpine will detect and use these partitions
		  ```
	- ## Network Setup During Install
		- ```bash
		  # Static IP configuration during setup-alpine:
		  # Interface: eth0
		  # IP: 192.168.1.100
		  # Netmask: 255.255.255.0
		  # Gateway: 192.168.1.1
		  # DNS: 8.8.8.8
		  
		  # Or use DHCP (just press Enter for auto)
		  
		  # After install, edit /etc/network/interfaces for changes
		  ```
	- ## First Boot — Post-Install Steps
		- ```bash
		  # Update package index and upgrade all packages
		  apk update && apk upgrade
		  
		  # Enable community repository (more packages)
		  # Edit /etc/apk/repositories and uncomment community line
		  vi /etc/apk/repositories
		  # Uncomment: http://dl-cdn.alpinelinux.org/alpine/v3.20/community
		  
		  # Install essential tools
		  apk add bash curl wget git vim nano htop
		  
		  # Create a regular user
		  adduser -D myuser
		  passwd myuser
		  
		  # Install doas (sudo alternative) and configure
		  apk add doas
		  echo "permit myuser as root" > /etc/doas.d/doas.conf
		  
		  # Or install sudo if preferred
		  apk add sudo
		  echo "myuser ALL=(ALL) ALL" >> /etc/sudoers
		  
		  # Enable and start SSH
		  rc-update add sshd default
		  rc-service sshd start
		  ```
	- > [!tip] Use `setup-*` helper scripts
	  > Alpine provides many `setup-*` scripts for individual tasks:
	  > `setup-hostname`, `setup-interfaces`, `setup-dns`, `setup-ntp`, `setup-sshd`, `setup-apkrepos`, `setup-timezone`, `setup-user`
	  > Run them individually to reconfigure specific parts after install.
- # Kernel & Architecture
  collapsed:: true
	- ## Alpine Kernel Variants
		- ```
		  linux-lts        → Long-term support kernel (default for most installs)
		                     Stable, well-tested, recommended for servers
		  
		  linux-hardened   → LTS kernel + grsecurity/PaX patches
		                     Extra security: stronger ASLR, PaX, RBAC
		                     Slight performance overhead
		  
		  linux-virt       → Stripped-down kernel for VMs
		                     Removes hardware drivers not needed in VMs
		                     Smaller, faster boot in hypervisors
		  
		  linux-edge       → Latest upstream kernel (from edge branch)
		                     Newest features, less tested
		  
		  linux-rpi        → Raspberry Pi specific kernel (ARM)
		  linux-rpi4       → Raspberry Pi 4 specific kernel
		  ```
		- ```bash
		  # Check current kernel
		  uname -r
		  uname -a
		  
		  # Install hardened kernel
		  apk add linux-hardened
		  
		  # List available kernel packages
		  apk search linux-
		  ```
	- ## musl libc vs glibc
		- | Feature | musl libc | glibc |
		  |---------|-----------|-------|
		  | Size | ~600 KB | ~2.5 MB |
		  | Standards compliance | Strict POSIX | Mostly POSIX + GNU extensions |
		  | Thread-local storage | Simpler model | Complex |
		  | DNS resolver | Built-in, simple | nsswitch.conf based |
		  | Locale support | Minimal | Full |
		  | Binary compatibility | musl binaries only | Broad compatibility |
		  | Security | Cleaner codebase, fewer CVEs | More CVEs historically |
		  | Performance | Slightly slower in some benchmarks | Faster in some workloads |
		  | Used by | Alpine, Void Linux | Debian, Ubuntu, Fedora, most distros |
		- > [!warning] musl vs glibc Compatibility
		  > Pre-compiled binaries built against glibc (e.g., downloaded `.tar.gz` apps) will NOT run on Alpine without recompilation or using a glibc compatibility layer (`apk add gcompat`).
		  > Always compile from source or use Alpine-native packages when possible.
	- ## BusyBox — The Swiss Army Knife
		- BusyBox is a single binary (`/bin/busybox`) that provides ~300+ Unix utilities.
		- Each utility is a symlink to `/bin/busybox`:
		- ```bash
		  ls -la /bin/ls      # → /bin/busybox
		  ls -la /bin/sh      # → /bin/busybox
		  ls -la /bin/grep    # → /bin/busybox
		  
		  # List all BusyBox applets
		  busybox --list
		  
		  # BusyBox version
		  busybox --help | head -1
		  ```
		- BusyBox applets are functional but have fewer options than GNU coreutils.
		- Install GNU coreutils if you need full compatibility:
		- ```bash
		  apk add coreutils        # GNU coreutils
		  apk add grep             # GNU grep (replaces BusyBox grep)
		  apk add sed              # GNU sed
		  apk add findutils        # GNU find, xargs
		  apk add util-linux       # more utilities
		  ```
	- ## OpenRC Init System
		- Alpine uses **OpenRC** — a dependency-based init system. NOT systemd.
		- OpenRC is lightweight, fast, and written in C + shell scripts.
		- PID 1 is `/sbin/init` (OpenRC's init), not systemd.
		- ```bash
		  # OpenRC is NOT systemd — different commands!
		  # systemctl → rc-service / rc-update
		  # journalctl → /var/log/ files or logread (syslog)
		  ```
	- ## Boot Process (OpenRC)
		- ```mermaid
		  flowchart TD
		      A[Power On / Reset] --> B[BIOS/UEFI POST]
		      B --> C[GRUB2 Bootloader\n/boot/grub/grub.cfg]
		      C --> D[Kernel loads\nvmlinuz-lts]
		      D --> E[initramfs mounts\nearly root filesystem]
		      E --> F[/sbin/init starts\nOpenRC PID 1]
		      F --> G[sysinit runlevel\nMount /proc /sys /dev\nfsck disk checks]
		      G --> H[boot runlevel\nMount filesystems\nSet hostname\nLoad modules]
		      H --> I[default runlevel\nStart services:\nnginx, sshd, crond...]
		      I --> J[Login prompt\n/sbin/getty on tty1]
		      J --> K[User logs in\nash shell]
		  
		      style A fill:#2d3748,color:#fff
		      style F fill:#2b6cb0,color:#fff
		      style I fill:#276749,color:#fff
		      style K fill:#744210,color:#fff
		  ```
	- ## Alpine FHS Layout
		- ```
		  /           Root filesystem (ext4 or tmpfs in diskless mode)
		  ├── /bin    BusyBox symlinks (ls, sh, grep, etc.)
		  ├── /boot   Kernel (vmlinuz-lts), initramfs, grub/
		  ├── /dev    Device files (managed by mdev, not udev)
		  ├── /etc    System configuration
		  │   ├── /etc/apk/          apk package manager config
		  │   ├── /etc/init.d/       OpenRC service scripts
		  │   ├── /etc/conf.d/       Service configuration files
		  │   ├── /etc/runlevels/    Runlevel symlinks
		  │   ├── /etc/network/      Network configuration
		  │   └── /etc/doas.d/       doas privilege config
		  ├── /home   User home directories
		  ├── /lib    musl libc + kernel modules
		  ├── /media  Removable media mount points
		  ├── /mnt    Manual mount points
		  ├── /opt    Optional third-party software
		  ├── /proc   Virtual: process info
		  ├── /root   Root user home
		  ├── /run    Runtime data (tmpfs)
		  ├── /sbin   System binaries (init, apk, ip, etc.)
		  ├── /srv    Service data
		  ├── /sys    Virtual: hardware/driver info
		  ├── /tmp    Temporary files (tmpfs)
		  ├── /usr    User programs
		  │   ├── /usr/bin    User binaries
		  │   ├── /usr/lib    Libraries
		  │   ├── /usr/share  Shared data, man pages
		  │   └── /usr/local  Locally installed software
		  └── /var    Variable data (logs, cache, spool)
		      ├── /var/cache/apk/    apk package cache
		      └── /var/log/          System logs
		  ```
	- ## mdev — Device Manager
		- Alpine uses **mdev** (from BusyBox) instead of udev for device management.
		- Lighter weight, suitable for embedded systems.
		- ```bash
		  # mdev is configured in /etc/mdev.conf
		  cat /etc/mdev.conf
		  
		  # Trigger mdev to re-scan devices
		  mdev -s
		  
		  # For more complex device management, install eudev
		  apk add eudev
		  rc-update add udev sysinit
		  ```
- # apk Package Manager
  collapsed:: true
	- ## What is apk?
		- `apk` (Alpine Package Keeper) is Alpine's native package manager — written in C, extremely fast.
		- Packages are `.apk` files (tar.gz archives with metadata).
		- Repository index is cached locally at `/var/cache/apk/`.
		- ```bash
		  # apk is available immediately after boot — no daemon needed
		  apk --version
		  ```
	- ## Repository Configuration
		- ```bash
		  # View current repositories
		  cat /etc/apk/repositories
		  
		  # Default /etc/apk/repositories content:
		  # http://dl-cdn.alpinelinux.org/alpine/v3.20/main
		  # http://dl-cdn.alpinelinux.org/alpine/v3.20/community
		  # #http://dl-cdn.alpinelinux.org/alpine/edge/main
		  # #http://dl-cdn.alpinelinux.org/alpine/edge/community
		  # #http://dl-cdn.alpinelinux.org/alpine/edge/testing
		  ```
		- ```
		  Repository branches:
		  
		  main        → Core packages, officially supported
		                Stable, security-patched
		  
		  community   → Community-maintained packages
		                Wider selection, still stable
		                Must be enabled manually (uncomment in repos file)
		  
		  edge/main   → Latest upstream packages (rolling)
		  edge/community → Latest community packages
		  edge/testing   → Experimental, may be broken
		  ```
		- ```bash
		  # Enable community repo (recommended)
		  sed -i 's|#.*community|http://dl-cdn.alpinelinux.org/alpine/v3.20/community|' /etc/apk/repositories
		  
		  # Or edit manually
		  vi /etc/apk/repositories
		  
		  # Add edge/testing for a specific package only (safer approach)
		  apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing <package>
		  
		  # Use setup-apkrepos for interactive mirror selection
		  setup-apkrepos
		  ```
	- ## Core apk Commands
		- ```bash
		  ## ── UPDATE & UPGRADE ──────────────────────────────────────
		  apk update                    # Refresh package index from repos
		  apk upgrade                   # Upgrade all installed packages
		  apk update && apk upgrade     # Update index then upgrade (common combo)
		  
		  ## ── INSTALL & REMOVE ──────────────────────────────────────
		  apk add <package>             # Install a package
		  apk add vim curl git htop     # Install multiple packages
		  apk add --no-cache <package>  # Install without caching (great for Dockerfiles)
		  apk del <package>             # Remove a package
		  apk del --purge <package>     # Remove package + config files
		  
		  ## ── SEARCH ────────────────────────────────────────────────
		  apk search <term>             # Search packages by name/description
		  apk search -v nginx           # Verbose search with descriptions
		  apk search -e nginx           # Exact name match only
		  
		  ## ── INFO ──────────────────────────────────────────────────
		  apk info                      # List all installed packages
		  apk info <package>            # Info about installed package
		  apk info -L <package>         # List files installed by package
		  apk info -R <package>         # Show reverse dependencies (what needs it)
		  apk info -r <package>         # Show dependencies of package
		  apk info -a <package>         # All info (size, deps, files)
		  
		  ## ── FIX & VERIFY ──────────────────────────────────────────
		  apk fix                       # Reinstall/repair broken packages
		  apk fix <package>             # Fix specific package
		  apk verify                    # Verify package integrity
		  apk audit                     # Check for modified files vs package db
		  apk audit --system            # Audit system files only
		  
		  ## ── CACHE MANAGEMENT ──────────────────────────────────────
		  apk cache clean               # Remove cached packages
		  apk cache download            # Download packages to cache
		  apk cache sync                # Sync cache with installed packages
		  
		  # Enable persistent cache (useful for offline installs)
		  mkdir -p /var/cache/apk
		  ln -s /var/cache/apk /etc/apk/cache
		  
		  ## ── STATS ─────────────────────────────────────────────────
		  apk stats                     # Show repository and package stats
		  apk version                   # Show installed vs available versions
		  apk version -l '<'            # Show packages with available upgrades
		  ```
	- ## apk Package Flow Diagram
		- ```mermaid
		  flowchart LR
		      A[Developer\nCreates Package] --> B[Alpine Package\nRepository\ndl-cdn.alpinelinux.org]
		      B --> C{/etc/apk/\nrepositories}
		      C --> D[main]
		      C --> E[community]
		      C --> F[edge/testing]
		      D --> G[apk update\nFetch APKINDEX]
		      E --> G
		      F --> G
		      G --> H[Local Index Cache\n/var/cache/apk/]
		      H --> I{apk add\npackage}
		      I --> J[Download .apk\nfrom mirror]
		      J --> K[Verify GPG\nsignature]
		      K --> L{Valid?}
		      L -- Yes --> M[Extract to /\nUpdate /lib/apk/db/]
		      L -- No --> N[Reject &\nError]
		      M --> O[Run post-install\nscripts]
		      O --> P[Package\nInstalled ✓]
		  
		      style A fill:#2d3748,color:#fff
		      style P fill:#276749,color:#fff
		      style N fill:#742a2a,color:#fff
		  ```
	- ## World File & Package Pinning
		- ```bash
		  # /etc/apk/world — list of explicitly installed packages
		  cat /etc/apk/world
		  
		  # Pin a package to a specific version
		  apk add nginx=1.24.0-r0
		  
		  # Pin to a specific repo
		  apk add nginx@community
		  
		  # Hold a package at current version (don't upgrade)
		  apk add nginx=~1.24          # pin to 1.24.x
		  
		  # Unhold / allow upgrade
		  apk add nginx                # removes version constraint
		  ```
	- ## Building Packages (APKBUILD)
		- ```bash
		  # Alpine packages are built from APKBUILD files (similar to Arch's PKGBUILD)
		  
		  # Install build tools
		  apk add alpine-sdk abuild
		  
		  # Add user to abuild group
		  adduser myuser abuild
		  
		  # Generate signing key
		  abuild-keygen -a -i
		  
		  # Example minimal APKBUILD:
		  ```
		- ```bash
		  # APKBUILD
		  pkgname=mypkg
		  pkgver=1.0.0
		  pkgrel=0
		  pkgdesc="My custom package"
		  url="https://example.com"
		  arch="all"
		  license="MIT"
		  depends=""
		  source="https://example.com/mypkg-$pkgver.tar.gz"
		  
		  build() {
		      cd "$builddir"
		      make
		  }
		  
		  package() {
		      cd "$builddir"
		      make DESTDIR="$pkgdir" install
		  }
		  ```
		- ```bash
		  # Build the package
		  abuild -r
		  
		  # Install locally built package
		  apk add --allow-untrusted ~/packages/mypkg-1.0.0-r0.apk
		  ```
	- > [!info] apk vs apt vs dnf Speed
	  > `apk` is significantly faster than `apt` or `dnf` because it's written in C with no daemon, no D-Bus, and minimal overhead. On a fresh Alpine container, `apk add nginx` typically completes in under 2 seconds.
- # OpenRC Service Management
  collapsed:: true
	- ## What is OpenRC?
		- **OpenRC** is a dependency-based init system used by Alpine Linux (and Gentoo, Void Linux).
		- It is NOT systemd — it uses shell scripts for service definitions.
		- Lightweight, fast, and easy to understand.
		- Services are defined in `/etc/init.d/` as shell scripts.
		- Configuration for each service lives in `/etc/conf.d/`.
	- ## rc-service — Control Services
		- ```bash
		  ## ── SERVICE CONTROL ───────────────────────────────────────
		  rc-service sshd start         # Start a service
		  rc-service sshd stop          # Stop a service
		  rc-service sshd restart       # Restart a service
		  rc-service sshd reload        # Reload config (if supported)
		  rc-service sshd status        # Check service status
		  rc-service sshd zap           # Reset crashed service state
		  
		  # Short form (same as rc-service)
		  service sshd start
		  service sshd status
		  
		  # List all services and their status
		  rc-status                     # Services in current runlevel
		  rc-status --all               # All services across all runlevels
		  rc-status --crashed           # Show crashed services
		  rc-status --unused            # Services not in any runlevel
		  ```
	- ## rc-update — Manage Runlevels
		- ```bash
		  ## ── RUNLEVEL MANAGEMENT ───────────────────────────────────
		  rc-update add sshd default    # Enable sshd at default runlevel
		  rc-update del sshd default    # Disable sshd from default runlevel
		  rc-update add nginx boot      # Enable nginx at boot runlevel
		  rc-update show                # Show all services and their runlevels
		  rc-update show default        # Show services in default runlevel
		  
		  # Change runlevel manually
		  openrc default                # Switch to default runlevel
		  openrc shutdown               # Switch to shutdown runlevel
		  ```
	- ## OpenRC Runlevels
		- ```
		  Runlevel      Purpose
		  ─────────────────────────────────────────────────────────────
		  sysinit       Very early boot: mount /proc, /sys, /dev
		                Load kernel modules, fsck, set up tmpfs
		                Services: devfs, dmesg, mdev, hwdrivers
		  
		  boot          System initialization: hostname, sysctl
		                Mount filesystems, set clock, start logging
		                Services: bootmisc, hostname, modules, syslog
		  
		  default       Normal multi-user mode (most services here)
		                Services: sshd, nginx, crond, networking, etc.
		                This is where you add your services
		  
		  nonetwork     Like default but without network services
		                Used for maintenance without network
		  
		  shutdown      Graceful shutdown sequence
		                Stop services, unmount filesystems, sync disks
		  
		  single        Single-user maintenance mode (root only)
		  ```
	- ## OpenRC vs systemd Comparison
		- | Feature | OpenRC | systemd |
		  |---------|--------|---------|
		  | Language | Shell scripts | INI-style unit files |
		  | PID 1 | /sbin/init | /lib/systemd/systemd |
		  | Service files | /etc/init.d/ | /etc/systemd/system/ |
		  | Config files | /etc/conf.d/ | Inside unit files |
		  | Logging | syslog (/var/log/) | journald (binary) |
		  | Log viewer | cat /var/log/messages | journalctl |
		  | Socket activation | No (limited) | Yes |
		  | Cgroups | Optional | Core feature |
		  | Boot speed | Fast on minimal systems | Fast on complex systems |
		  | Complexity | Simple | Complex but powerful |
		  | Parallel start | Yes | Yes |
		  | Dependency tracking | Yes | Yes |
		  | Used by | Alpine, Gentoo, Void | Debian, Ubuntu, Fedora, Arch |
	- ## Writing a Custom OpenRC Service
		- ```bash
		  # Create service script at /etc/init.d/myapp
		  vi /etc/init.d/myapp
		  ```
		- ```bash
		  #!/sbin/openrc-run
		  # OpenRC service script for myapp
		  
		  name="myapp"
		  description="My custom application"
		  
		  # Path to the binary
		  command="/usr/local/bin/myapp"
		  command_args="--config /etc/myapp/config.toml"
		  
		  # Run as this user
		  command_user="myuser"
		  
		  # PID file for tracking
		  pidfile="/run/${RC_SVCNAME}.pid"
		  command_background=true
		  
		  # Dependencies — start after network is up
		  depend() {
		      need net
		      after firewall
		  }
		  
		  # Optional: custom start/stop functions
		  start_pre() {
		      # Runs before starting
		      checkpath --directory --owner myuser:myuser /var/lib/myapp
		  }
		  ```
		- ```bash
		  # Make executable
		  chmod +x /etc/init.d/myapp
		  
		  # Enable at default runlevel
		  rc-update add myapp default
		  
		  # Start it
		  rc-service myapp start
		  rc-service myapp status
		  ```
	- ## Important Default Services
		- ```bash
		  # View what's running
		  rc-status
		  
		  # Common services and their runlevels:
		  # sysinit: devfs, dmesg, mdev, hwdrivers, modules
		  # boot:    bootmisc, hostname, modules, swap, sysctl, syslog
		  # default: networking, sshd, crond, ntpd/chronyd
		  
		  # Logging — Alpine uses busybox syslog by default
		  rc-service syslog start
		  rc-update add syslog boot
		  
		  # View logs
		  logread                       # BusyBox syslog reader
		  logread -f                    # Follow (like tail -f)
		  cat /var/log/messages         # Traditional syslog file
		  
		  # Install more capable syslog
		  apk add rsyslog
		  rc-update add rsyslog boot
		  ```
	- > [!tip] OpenRC Cheat Sheet
	  > Think of OpenRC like this:
	  > - `rc-service X start/stop/restart` = `systemctl start/stop/restart X`
	  > - `rc-update add X default` = `systemctl enable X`
	  > - `rc-update del X default` = `systemctl disable X`
	  > - `rc-status` = `systemctl list-units`
	  > - `logread` = `journalctl`
- # Shell & BusyBox
  collapsed:: true
	- ## ash — Alpine's Default Shell
		- Alpine's default shell is **ash** — the Almquist Shell, provided by BusyBox.
		- ash is a POSIX-compliant shell, lighter than bash, but lacks many bash-specific features.
		- ```bash
		  # Check current shell
		  echo $SHELL          # /bin/ash or /bin/sh
		  echo $0              # ash
		  
		  # ash vs bash differences:
		  # - No arrays (ash has no array support)
		  # - No [[ ]] (use [ ] instead)
		  # - No process substitution <(cmd)
		  # - No {a..z} brace expansion
		  # - No $'...' string literals
		  # - No local -n nameref
		  # - No mapfile/readarray
		  # - Simpler prompt customization
		  
		  # POSIX-safe shebang (works on Alpine)
		  #!/bin/sh
		  
		  # bash-specific shebang (requires bash installed)
		  #!/bin/bash
		  ```
	- ## Installing bash, zsh, fish
		- ```bash
		  # Install bash
		  apk add bash
		  
		  # Change default shell to bash for a user
		  chsh -s /bin/bash myuser
		  # Or edit /etc/passwd directly
		  
		  # Install zsh
		  apk add zsh zsh-vcs
		  chsh -s /bin/zsh myuser
		  
		  # Install fish
		  apk add fish
		  chsh -s /usr/bin/fish myuser
		  
		  # Install Oh My Zsh (requires curl + git)
		  apk add curl git zsh
		  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
		  ```
	- ## BusyBox Applets Reference
		- ```bash
		  # List all available BusyBox applets
		  busybox --list
		  
		  # Common applets and their GNU equivalents:
		  # File operations
		  ls, cp, mv, rm, mkdir, rmdir, ln, chmod, chown, chgrp
		  find, xargs, sort, uniq, wc, head, tail, cut, tr, tee
		  
		  # Text processing
		  grep, sed, awk (mawk-compatible), vi (minimal)
		  
		  # Archive
		  tar, gzip, gunzip, bzip2, bunzip2, unzip, zcat
		  
		  # Network
		  wget, ping, ping6, traceroute, netstat, ifconfig
		  udhcpc (DHCP client), ftpget, ftpput, httpd (tiny web server)
		  
		  # System
		  ps, top, kill, killall, free, df, du, mount, umount
		  dmesg, sysctl, reboot, halt, poweroff, shutdown
		  
		  # User management
		  adduser, deluser, addgroup, delgroup, passwd
		  
		  # Init
		  init, syslogd, klogd, crond, crontab
		  ```
	- ## Key Differences from GNU Coreutils
		- ```bash
		  # BusyBox grep — no -P (Perl regex) flag
		  grep -P "pattern" file        # FAILS on BusyBox grep
		  grep -E "pattern" file        # Works (extended regex)
		  apk add grep                  # Install GNU grep for -P support
		  
		  # BusyBox sed — no -i '' (macOS style)
		  sed -i 's/old/new/' file      # Works on BusyBox sed
		  
		  # BusyBox awk — limited compared to gawk
		  apk add gawk                  # Install GNU awk
		  
		  # BusyBox find — fewer options
		  find . -name "*.log" -delete  # Works
		  find . -printf "%f\n"         # May not work — install findutils
		  apk add findutils
		  
		  # BusyBox tar — slightly different flags
		  tar -czf archive.tar.gz dir/  # Works
		  tar --exclude-vcs             # May not work — install tar
		  apk add tar
		  
		  # BusyBox ps — limited output
		  ps                            # Basic process list
		  ps aux                        # Works but fewer columns
		  apk add procps                # Full ps, top, free, etc.
		  ```
	- ## Shell Scripting on Alpine (POSIX-safe)
		- ```bash
		  #!/bin/sh
		  # POSIX-compliant script — works on Alpine's ash
		  
		  # Variables
		  NAME="Alpine"
		  echo "Hello from $NAME"
		  
		  # Conditionals — use [ ] not [[ ]]
		  if [ "$NAME" = "Alpine" ]; then
		      echo "It's Alpine!"
		  fi
		  
		  # Loops
		  for i in 1 2 3 4 5; do
		      echo "Item: $i"
		  done
		  
		  # Functions
		  greet() {
		      local name="$1"
		      echo "Hello, $name!"
		  }
		  greet "World"
		  
		  # Read input
		  printf "Enter name: "
		  read -r username
		  echo "Welcome, $username"
		  
		  # Check if command exists
		  if command -v nginx > /dev/null 2>&1; then
		      echo "nginx is installed"
		  fi
		  
		  # Exit codes
		  some_command || { echo "Command failed"; exit 1; }
		  ```
	- ## Essential Terminal Tools
		- ```bash
		  # Install useful CLI tools
		  apk add \
		      vim \           # Text editor
		      nano \          # Beginner-friendly editor
		      htop \          # Interactive process viewer
		      curl \          # HTTP client
		      wget \          # File downloader
		      git \           # Version control
		      tmux \          # Terminal multiplexer
		      jq \            # JSON processor
		      ripgrep \       # Fast grep (rg)
		      fd \            # Fast find
		      bat \           # cat with syntax highlighting
		      tree \          # Directory tree viewer
		      ncdu \          # Disk usage analyzer
		      lsof \          # List open files
		      strace \        # System call tracer
		      tcpdump \       # Network packet capture
		      nmap            # Network scanner
		  ```
- # Networking
  collapsed:: true
	- ## Network Configuration Files
		- ```bash
		  # Main network config file
		  cat /etc/network/interfaces
		  
		  # Example /etc/network/interfaces:
		  ```
		- ```ini
		  # Loopback
		  auto lo
		  iface lo inet loopback
		  
		  # DHCP on eth0
		  auto eth0
		  iface eth0 inet dhcp
		  
		  # Static IP on eth0
		  auto eth0
		  iface eth0 inet static
		      address 192.168.1.100
		      netmask 255.255.255.0
		      gateway 192.168.1.1
		  
		  # DNS is configured in /etc/resolv.conf
		  ```
		- ```bash
		  # /etc/resolv.conf — DNS configuration
		  cat /etc/resolv.conf
		  # nameserver 8.8.8.8
		  # nameserver 1.1.1.1
		  # search local.domain
		  ```
	- ## Network Commands
		- ```bash
		  ## ── INTERFACE MANAGEMENT ──────────────────────────────────
		  ip addr show                  # Show all interfaces and IPs
		  ip addr show eth0             # Show specific interface
		  ip link show                  # Show link status
		  ip link set eth0 up           # Bring interface up
		  ip link set eth0 down         # Bring interface down
		  
		  # Add/remove IP address
		  ip addr add 192.168.1.100/24 dev eth0
		  ip addr del 192.168.1.100/24 dev eth0
		  
		  ## ── ROUTING ───────────────────────────────────────────────
		  ip route show                 # Show routing table
		  ip route add default via 192.168.1.1    # Add default gateway
		  ip route add 10.0.0.0/8 via 192.168.1.1 # Add static route
		  ip route del 10.0.0.0/8                  # Delete route
		  
		  ## ── RESTART NETWORKING ────────────────────────────────────
		  rc-service networking restart
		  ifup eth0                     # Bring up interface (reads /etc/network/interfaces)
		  ifdown eth0                   # Bring down interface
		  
		  ## ── DHCP ──────────────────────────────────────────────────
		  # Alpine uses udhcpc (BusyBox DHCP client)
		  udhcpc -i eth0                # Request DHCP lease on eth0
		  udhcpc -i eth0 -n            # Non-background mode
		  
		  ## ── DNS TOOLS ─────────────────────────────────────────────
		  nslookup google.com           # DNS lookup (BusyBox)
		  apk add bind-tools            # Install dig, host, nslookup (full)
		  dig google.com                # DNS lookup with dig
		  host google.com               # Simple DNS lookup
		  
		  ## ── CONNECTIVITY ──────────────────────────────────────────
		  ping -c 4 8.8.8.8            # Ping (4 packets)
		  ping6 -c 4 ::1               # IPv6 ping
		  traceroute google.com         # Trace route
		  curl -I https://google.com    # HTTP headers
		  wget -q -O- https://icanhazip.com  # Get public IP
		  
		  ## ── PORTS & CONNECTIONS ───────────────────────────────────
		  netstat -tulnp                # Show listening ports (BusyBox)
		  apk add net-tools             # For full netstat
		  ss -tulnp                     # Modern socket stats (install iproute2)
		  apk add iproute2              # Install ip, ss, tc commands
		  ```
	- ## Wireless Networking
		- ```bash
		  # Install wireless tools
		  apk add wireless-tools wpa_supplicant
		  
		  # Scan for networks
		  iwlist wlan0 scan | grep ESSID
		  
		  # Configure WPA2 network
		  wpa_passphrase "MyNetwork" "MyPassword" >> /etc/wpa_supplicant/wpa_supplicant.conf
		  
		  # Connect
		  wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
		  udhcpc -i wlan0
		  
		  # Add to /etc/network/interfaces for persistence:
		  ```
		- ```ini
		  auto wlan0
		  iface wlan0 inet dhcp
		      pre-up wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
		      post-down killall -q wpa_supplicant
		  ```
	- ## Firewall — nftables & iptables
		- ```bash
		  # Alpine supports both nftables (modern) and iptables (legacy)
		  
		  # Install nftables (recommended)
		  apk add nftables
		  rc-update add nftables boot
		  
		  # Basic nftables ruleset
		  nft list ruleset
		  ```
		- ```bash
		  # /etc/nftables.nft — basic firewall config
		  #!/usr/sbin/nft -f
		  
		  flush ruleset
		  
		  table inet filter {
		      chain input {
		          type filter hook input priority 0; policy drop;
		          
		          # Allow loopback
		          iif lo accept
		          
		          # Allow established/related connections
		          ct state established,related accept
		          
		          # Allow SSH
		          tcp dport 22 accept
		          
		          # Allow HTTP/HTTPS
		          tcp dport { 80, 443 } accept
		          
		          # Allow ICMP ping
		          icmp type echo-request accept
		          icmpv6 type echo-request accept
		          
		          # Log and drop everything else
		          log prefix "nftables drop: " drop
		      }
		      
		      chain forward {
		          type filter hook forward priority 0; policy drop;
		      }
		      
		      chain output {
		          type filter hook output priority 0; policy accept;
		      }
		  }
		  ```
		- ```bash
		  # Apply nftables rules
		  nft -f /etc/nftables.nft
		  rc-service nftables start
		  
		  # Using iptables (legacy, still works)
		  apk add iptables ip6tables
		  
		  # Basic iptables rules
		  iptables -P INPUT DROP
		  iptables -P FORWARD DROP
		  iptables -P OUTPUT ACCEPT
		  iptables -A INPUT -i lo -j ACCEPT
		  iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
		  iptables -A INPUT -p tcp --dport 22 -j ACCEPT
		  iptables -A INPUT -p tcp --dport 80 -j ACCEPT
		  iptables -A INPUT -p tcp --dport 443 -j ACCEPT
		  
		  # Save iptables rules
		  rc-update add iptables boot
		  /etc/init.d/iptables save
		  ```
	- ## SSH — Dropbear vs OpenSSH
		- ```
		  Dropbear                    OpenSSH
		  ─────────────────────────────────────────────────────
		  Tiny (~110 KB)              Full-featured (~1 MB+)
		  Built into Alpine           Separate package
		  Basic SSH client/server     Full SSH client/server
		  No SFTP server              Full SFTP/SCP support
		  No SSH agent forwarding     Full agent forwarding
		  Good for embedded/minimal   Good for servers/workstations
		  Port: 22 (default)          Port: 22 (default)
		  ```
		- ```bash
		  # Dropbear (default in Alpine)
		  apk add dropbear
		  rc-update add dropbear default
		  rc-service dropbear start
		  
		  # Dropbear config
		  vi /etc/conf.d/dropbear
		  # DROPBEAR_OPTS="-p 22 -w"   # -w disables root login
		  
		  # Switch to OpenSSH (recommended for servers)
		  apk del dropbear
		  apk add openssh
		  rc-update add sshd default
		  rc-service sshd start
		  
		  # OpenSSH config
		  vi /etc/ssh/sshd_config
		  # PermitRootLogin no
		  # PasswordAuthentication no
		  # PubkeyAuthentication yes
		  
		  # Generate SSH key pair (on client)
		  ssh-keygen -t ed25519 -C "myuser@alpine"
		  
		  # Copy public key to server
		  ssh-copy-id myuser@192.168.1.100
		  ```
- # Security Features
  collapsed:: true
	- ## Alpine's Security Philosophy
		- Alpine was designed from the ground up with security as a first-class concern.
		- Every package is compiled with security hardening flags.
		- The minimal footprint means fewer packages = fewer CVEs = smaller attack surface.
		- > [!info] Security by Default
		  > Alpine enables stack smashing protection (SSP), PIE, and RELRO for ALL packages by default — not just some. This is stricter than most mainstream distros.
	- ## musl libc Security Benefits
		- ```
		  musl libc security advantages over glibc:
		  
		  1. Cleaner codebase — fewer lines of code = fewer bugs
		  2. No RUNPATH/RPATH injection vulnerabilities
		  3. Strict POSIX compliance — no GNU extensions that introduce bugs
		  4. No NSS (Name Service Switch) complexity — simpler DNS resolution
		  5. No LD_PRELOAD abuse vectors (limited compared to glibc)
		  6. Fewer historical CVEs than glibc
		  7. No locale-related buffer overflows (minimal locale support)
		  8. Thread-safe by design from the start
		  ```
	- ## Kernel Security — PaX & grsecurity
		- ```bash
		  # Install hardened kernel (PaX/grsecurity patches)
		  apk add linux-hardened linux-hardened-dev
		  
		  # Reboot into hardened kernel
		  reboot
		  
		  # Verify hardened kernel is running
		  uname -r    # Should show -hardened suffix
		  
		  # PaX features enabled:
		  # PAGEEXEC  — prevents code execution in data pages (W^X)
		  # MPROTECT  — prevents making pages executable after mapping
		  # RANDMMAP  — randomizes mmap base address
		  # RANDKSTACK — randomizes kernel stack offset
		  # UDEREF   — prevents kernel from dereferencing user pointers
		  ```
	- ## Compiler Hardening Flags
		- ```bash
		  # All Alpine packages are compiled with:
		  # -fstack-protector-strong    Stack canaries (SSP)
		  # -fPIE / -pie                Position Independent Executable
		  # -Wl,-z,relro                Read-only relocations (RELRO)
		  # -Wl,-z,now                  Full RELRO (resolve all symbols at load)
		  # -D_FORTIFY_SOURCE=2         Buffer overflow detection
		  # -fstack-clash-protection    Stack clash protection
		  
		  # Verify a binary's security properties
		  apk add pax-utils
		  scanelf -e /usr/sbin/nginx    # Check ELF security properties
		  paxctl -v /usr/sbin/nginx     # View PaX flags
		  
		  # Check if binary is PIE
		  file /usr/sbin/nginx          # Should say "pie executable"
		  ```
	- ## ASLR — Address Space Layout Randomization
		- ```bash
		  # Check ASLR status
		  cat /proc/sys/kernel/randomize_va_space
		  # 0 = disabled, 1 = partial, 2 = full (default on Alpine)
		  
		  # Enable full ASLR (should already be 2)
		  echo 2 > /proc/sys/kernel/randomize_va_space
		  
		  # Make permanent via sysctl
		  echo "kernel.randomize_va_space = 2" >> /etc/sysctl.conf
		  sysctl -p
		  ```
	- ## doas — Privilege Escalation (Not sudo!)
		- Alpine uses **doas** (from OpenBSD) instead of sudo by default.
		- doas is simpler, smaller, and has a cleaner security model.
		- ```bash
		  # Install doas
		  apk add doas
		  
		  # Configure /etc/doas.d/doas.conf
		  vi /etc/doas.d/doas.conf
		  ```
		- ```
		  # /etc/doas.d/doas.conf syntax:
		  
		  # Allow user to run any command as root
		  permit myuser as root
		  
		  # Allow without password (nopass)
		  permit nopass myuser as root
		  
		  # Allow specific command only
		  permit myuser as root cmd /sbin/reboot
		  
		  # Allow wheel group
		  permit :wheel as root
		  
		  # Keep environment variables
		  permit keepenv myuser as root
		  
		  # Deny a user
		  deny baduser
		  ```
		- ```bash
		  # Use doas
		  doas apk update              # Run as root
		  doas -u otheruser command    # Run as specific user
		  doas -s                      # Open root shell
		  
		  # Install sudo if you prefer it
		  apk add sudo
		  visudo                       # Edit sudoers safely
		  ```
	- ## No SUID Binaries by Default
		- ```bash
		  # Alpine minimizes SUID binaries
		  # Find all SUID binaries on the system
		  find / -perm -4000 -type f 2>/dev/null
		  
		  # Typical Alpine SUID binaries (very few):
		  # /bin/busybox (some applets need it)
		  # /usr/bin/passwd
		  # /usr/bin/newgrp
		  
		  # Remove unnecessary SUID bits
		  chmod u-s /path/to/binary
		  
		  # Mount filesystems with nosuid
		  mount -o remount,nosuid /tmp
		  ```
	- ## Security Hardening Checklist
		- ```bash
		  # 1. Disable root SSH login
		  sed -i 's/#PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
		  
		  # 2. Use SSH keys only (disable password auth)
		  sed -i 's/#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
		  
		  # 3. Enable firewall
		  apk add nftables
		  rc-update add nftables boot
		  
		  # 4. Install fail2ban (SSH brute force protection)
		  apk add fail2ban
		  rc-update add fail2ban default
		  
		  # 5. Harden sysctl settings
		  cat >> /etc/sysctl.conf << 'EOF'
		  # Network hardening
		  net.ipv4.conf.all.rp_filter = 1
		  net.ipv4.conf.default.rp_filter = 1
		  net.ipv4.icmp_echo_ignore_broadcasts = 1
		  net.ipv4.conf.all.accept_redirects = 0
		  net.ipv4.conf.all.send_redirects = 0
		  net.ipv4.tcp_syncookies = 1
		  
		  # Kernel hardening
		  kernel.dmesg_restrict = 1
		  kernel.kptr_restrict = 2
		  kernel.randomize_va_space = 2
		  fs.protected_hardlinks = 1
		  fs.protected_symlinks = 1
		  EOF
		  sysctl -p
		  
		  # 6. Use hardened kernel
		  apk add linux-hardened
		  
		  # 7. Audit installed packages
		  apk audit --system
		  
		  # 8. Check for world-writable files
		  find / -xdev -type f -perm -0002 2>/dev/null
		  ```
- # Docker & Containers
  collapsed:: true
	- ## Why Alpine is the #1 Docker Base Image
		- ```
		  Image Size Comparison (compressed):
		  
		  alpine:3.20          ~3.5 MB   ← Winner
		  debian:bookworm-slim ~30 MB
		  ubuntu:24.04         ~28 MB
		  fedora:40            ~60 MB
		  centos:stream9       ~55 MB
		  
		  Benefits for containers:
		  ✓ Fastest pull times in CI/CD
		  ✓ Minimal attack surface (fewer packages = fewer CVEs)
		  ✓ Fast image builds
		  ✓ Low memory overhead
		  ✓ apk is faster than apt/dnf
		  ✓ Official images: nginx, redis, node, python all use Alpine variants
		  ```
		- See also: [[Docker]]
	- ## Basic Alpine Dockerfile
		- ```dockerfile
		  # Simple Alpine-based web app
		  FROM alpine:3.20
		  
		  # Install dependencies (--no-cache avoids storing apk index)
		  RUN apk add --no-cache \
		      nginx \
		      curl
		  
		  # Copy config and app files
		  COPY nginx.conf /etc/nginx/nginx.conf
		  COPY ./html /usr/share/nginx/html
		  
		  # Expose port
		  EXPOSE 80
		  
		  # Run nginx in foreground (containers need foreground process)
		  CMD ["nginx", "-g", "daemon off;"]
		  ```
	- ## Multi-Stage Build with Alpine
		- ```mermaid
		  flowchart LR
		      A[Stage 1: Builder\nFROM alpine:3.20\napk add build tools\nCompile source code] --> B[Stage 2: Runner\nFROM alpine:3.20\nCopy compiled binary only\nNo build tools included]
		      B --> C[Final Image\n~10-15 MB\nvs ~200 MB single stage]
		  
		      style A fill:#2d3748,color:#fff
		      style B fill:#276749,color:#fff
		      style C fill:#744210,color:#fff
		  ```
		- ```dockerfile
		  # Multi-stage build — Go application example
		  
		  # ── Stage 1: Build ──────────────────────────────────────────
		  FROM golang:1.22-alpine AS builder
		  
		  WORKDIR /app
		  
		  # Install build dependencies
		  RUN apk add --no-cache git ca-certificates
		  
		  # Copy and download dependencies
		  COPY go.mod go.sum ./
		  RUN go mod download
		  
		  # Copy source and build
		  COPY . .
		  RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o myapp .
		  
		  # ── Stage 2: Run ────────────────────────────────────────────
		  FROM alpine:3.20
		  
		  # Add CA certificates for HTTPS
		  RUN apk add --no-cache ca-certificates tzdata
		  
		  # Create non-root user
		  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
		  
		  WORKDIR /app
		  
		  # Copy only the compiled binary from builder stage
		  COPY --from=builder /app/myapp .
		  
		  # Run as non-root
		  USER appuser
		  
		  EXPOSE 8080
		  CMD ["./myapp"]
		  ```
	- ## Multi-Stage Build — Node.js Example
		- ```dockerfile
		  # Node.js multi-stage build with Alpine
		  
		  # ── Stage 1: Dependencies ───────────────────────────────────
		  FROM node:20-alpine AS deps
		  WORKDIR /app
		  COPY package*.json ./
		  RUN npm ci --only=production
		  
		  # ── Stage 2: Build ──────────────────────────────────────────
		  FROM node:20-alpine AS builder
		  WORKDIR /app
		  COPY package*.json ./
		  RUN npm ci
		  COPY . .
		  RUN npm run build
		  
		  # ── Stage 3: Production ─────────────────────────────────────
		  FROM node:20-alpine AS runner
		  WORKDIR /app
		  
		  ENV NODE_ENV=production
		  
		  # Create non-root user
		  RUN addgroup --system --gid 1001 nodejs
		  RUN adduser --system --uid 1001 nextjs
		  
		  COPY --from=deps /app/node_modules ./node_modules
		  COPY --from=builder /app/dist ./dist
		  COPY --from=builder /app/package.json ./
		  
		  USER nextjs
		  EXPOSE 3000
		  CMD ["node", "dist/index.js"]
		  ```
	- ## Python on Alpine — musl Gotchas
		- ```dockerfile
		  # Python on Alpine — common issues and solutions
		  FROM python:3.12-alpine
		  
		  WORKDIR /app
		  
		  # Many Python packages need build tools (C extensions)
		  # Install build dependencies
		  RUN apk add --no-cache \
		      gcc \
		      musl-dev \
		      libffi-dev \
		      openssl-dev \
		      python3-dev
		  
		  COPY requirements.txt .
		  RUN pip install --no-cache-dir -r requirements.txt
		  
		  # Clean up build deps to reduce image size
		  RUN apk del gcc musl-dev libffi-dev
		  
		  COPY . .
		  CMD ["python", "app.py"]
		  ```
		- > [!warning] Python + Alpine Performance
		  > Some Python packages (numpy, pandas, scipy) take very long to build on Alpine because they must compile from source (no pre-built musl wheels on PyPI). Consider using `python:3.12-slim` (Debian-based) for Python-heavy workloads where build time matters.
	- ## Common Alpine Docker Gotchas
		- ```bash
		  # 1. No bash by default
		  # WRONG:
		  RUN bash -c "echo hello"
		  # RIGHT:
		  RUN sh -c "echo hello"
		  # OR install bash:
		  RUN apk add --no-cache bash
		  
		  # 2. No glibc — some binaries won't run
		  # Install gcompat for glibc compatibility layer
		  RUN apk add --no-cache gcompat
		  
		  # 3. Missing timezone data
		  RUN apk add --no-cache tzdata
		  ENV TZ=Asia/Kolkata
		  
		  # 4. Missing CA certificates (HTTPS fails)
		  RUN apk add --no-cache ca-certificates
		  
		  # 5. No adduser --disabled-password (use Alpine syntax)
		  # WRONG (Debian syntax):
		  RUN adduser --disabled-password --gecos '' appuser
		  # RIGHT (Alpine syntax):
		  RUN adduser -D -g '' appuser
		  # Or:
		  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
		  
		  # 6. apk cache not needed in Docker
		  # Always use --no-cache in Dockerfiles
		  RUN apk add --no-cache nginx
		  # NOT:
		  RUN apk update && apk add nginx   # leaves cache in layer
		  ```
	- ## Docker Compose with Alpine Services
		- ```dockerfile
		  # docker-compose.yml — Alpine-based stack
		  ```
		- ```bash
		  # docker-compose.yml
		  version: '3.8'
		  
		  services:
		    web:
		      image: nginx:alpine
		      ports:
		        - "80:80"
		        - "443:443"
		      volumes:
		        - ./nginx.conf:/etc/nginx/nginx.conf:ro
		        - ./html:/usr/share/nginx/html:ro
		      restart: unless-stopped
		  
		    app:
		      build:
		        context: .
		        dockerfile: Dockerfile
		      environment:
		        - NODE_ENV=production
		      restart: unless-stopped
		  
		    db:
		      image: postgres:16-alpine
		      environment:
		        POSTGRES_DB: mydb
		        POSTGRES_USER: myuser
		        POSTGRES_PASSWORD: mypassword
		      volumes:
		        - pgdata:/var/lib/postgresql/data
		      restart: unless-stopped
		  
		  volumes:
		    pgdata:
		  ```
- # Alpine as a Server
  collapsed:: true
	- ## Web Server — nginx
		- ```bash
		  # Install nginx
		  apk add nginx
		  
		  # Enable and start
		  rc-update add nginx default
		  rc-service nginx start
		  
		  # Test config
		  nginx -t
		  
		  # Reload config without downtime
		  rc-service nginx reload
		  # or
		  nginx -s reload
		  ```
		- ```ini
		  # /etc/nginx/nginx.conf — minimal production config
		  user nginx;
		  worker_processes auto;
		  error_log /var/log/nginx/error.log warn;
		  pid /run/nginx/nginx.pid;
		  
		  events {
		      worker_connections 1024;
		      use epoll;
		      multi_accept on;
		  }
		  
		  http {
		      include /etc/nginx/mime.types;
		      default_type application/octet-stream;
		      
		      # Logging
		      access_log /var/log/nginx/access.log;
		      
		      # Performance
		      sendfile on;
		      tcp_nopush on;
		      tcp_nodelay on;
		      keepalive_timeout 65;
		      gzip on;
		      
		      # Security headers
		      server_tokens off;
		      add_header X-Frame-Options SAMEORIGIN;
		      add_header X-Content-Type-Options nosniff;
		      add_header X-XSS-Protection "1; mode=block";
		      
		      include /etc/nginx/conf.d/*.conf;
		  }
		  ```
		- ```ini
		  # /etc/nginx/conf.d/mysite.conf
		  server {
		      listen 80;
		      server_name example.com www.example.com;
		      root /var/www/html;
		      index index.html;
		      
		      location / {
		          try_files $uri $uri/ =404;
		      }
		      
		      # Proxy to backend app
		      location /api/ {
		          proxy_pass http://127.0.0.1:3000/;
		          proxy_set_header Host $host;
		          proxy_set_header X-Real-IP $remote_addr;
		      }
		  }
		  ```
	- ## Web Server — Caddy (Auto HTTPS)
		- ```bash
		  # Install Caddy (automatic HTTPS via Let's Encrypt)
		  apk add caddy
		  rc-update add caddy default
		  rc-service caddy start
		  ```
		- ```ini
		  # /etc/caddy/Caddyfile
		  example.com {
		      root * /var/www/html
		      file_server
		      encode gzip
		      
		      # Automatic HTTPS — Caddy handles Let's Encrypt
		      # No certbot needed!
		  }
		  
		  api.example.com {
		      reverse_proxy localhost:3000
		  }
		  ```
	- ## Let's Encrypt with certbot + nginx
		- ```bash
		  # Install certbot
		  apk add certbot certbot-nginx
		  
		  # Obtain certificate
		  certbot --nginx -d example.com -d www.example.com
		  
		  # Test renewal
		  certbot renew --dry-run
		  
		  # Auto-renew via cron
		  crontab -e
		  # Add: 0 3 * * * certbot renew --quiet && rc-service nginx reload
		  ```
	- ## Database — PostgreSQL
		- ```bash
		  # Install PostgreSQL
		  apk add postgresql postgresql-client
		  
		  # Initialize database cluster
		  mkdir -p /var/lib/postgresql/data
		  chown postgres:postgres /var/lib/postgresql/data
		  su - postgres -c "initdb -D /var/lib/postgresql/data"
		  
		  # Enable and start
		  rc-update add postgresql default
		  rc-service postgresql start
		  
		  # Connect as postgres user
		  su - postgres
		  psql
		  
		  # Create database and user
		  psql -c "CREATE USER myuser WITH PASSWORD 'mypassword';"
		  psql -c "CREATE DATABASE mydb OWNER myuser;"
		  psql -c "GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;"
		  ```
		- ```ini
		  # /var/lib/postgresql/data/postgresql.conf — key settings
		  listen_addresses = 'localhost'
		  port = 5432
		  max_connections = 100
		  shared_buffers = 128MB
		  effective_cache_size = 512MB
		  log_destination = 'stderr'
		  logging_collector = on
		  log_directory = '/var/log/postgresql'
		  ```
	- ## Database — MariaDB
		- ```bash
		  # Install MariaDB
		  apk add mariadb mariadb-client
		  
		  # Initialize
		  mysql_install_db --user=mysql --datadir=/var/lib/mysql
		  
		  # Enable and start
		  rc-update add mariadb default
		  rc-service mariadb start
		  
		  # Secure installation
		  mysql_secure_installation
		  
		  # Connect
		  mysql -u root -p
		  
		  # Create database and user
		  CREATE DATABASE mydb;
		  CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'mypassword';
		  GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'localhost';
		  FLUSH PRIVILEGES;
		  ```
	- ## Production Hardening for Alpine Servers
		- ```bash
		  # 1. Keep system updated
		  apk update && apk upgrade
		  
		  # 2. Minimal package install — only what you need
		  # Don't install: compilers, debuggers, dev tools on production
		  
		  # 3. Disable unused services
		  rc-update show default
		  rc-update del <unused-service> default
		  
		  # 4. Configure firewall (nftables)
		  # Allow only necessary ports (22, 80, 443)
		  
		  # 5. Fail2ban for SSH protection
		  apk add fail2ban
		  rc-update add fail2ban default
		  
		  # 6. Log monitoring
		  apk add logwatch
		  
		  # 7. Automatic security updates (optional)
		  # Add to crontab:
		  # 0 4 * * * apk update && apk upgrade -a
		  
		  # 8. Disable IPv6 if not needed
		  echo "net.ipv6.conf.all.disable_ipv6 = 1" >> /etc/sysctl.conf
		  sysctl -p
		  
		  # 9. Set up NTP for accurate time
		  apk add chrony
		  rc-update add chronyd default
		  rc-service chronyd start
		  
		  # 10. Monitor disk and memory
		  apk add htop ncdu
		  df -h          # Disk usage
		  free -m        # Memory usage
		  ```
- # Alpine on Raspberry Pi & Embedded
  collapsed:: true
	- ## Alpine on Raspberry Pi
		- ```bash
		  # Download Alpine for Raspberry Pi
		  # https://alpinelinux.org/downloads/ → Raspberry Pi section
		  
		  # Available images:
		  # alpine-rpi-3.20.0-aarch64.tar.gz  → RPi 3/4/5 (64-bit)
		  # alpine-rpi-3.20.0-armhf.tar.gz    → RPi 2/3 (32-bit)
		  # alpine-rpi-3.20.0-armv7.tar.gz    → RPi 2/3 (ARMv7)
		  
		  # Flash to SD card
		  # 1. Format SD card as FAT32
		  # 2. Extract tar.gz to SD card root
		  tar -xzf alpine-rpi-3.20.0-aarch64.tar.gz -C /media/sdcard/
		  
		  # 3. Boot RPi — login as root (no password)
		  # 4. Run setup-alpine
		  setup-alpine
		  ```
	- ## Diskless Mode — Running from RAM
		- Alpine's killer feature for embedded systems: **diskless mode**.
		- The entire OS runs from RAM. The SD card/disk is only read at boot.
		- Changes are lost on reboot UNLESS saved with `lbu` (Local Backup Utility).
		- ```
		  Diskless Mode Architecture:
		  
		  Boot Media (SD/USB)          RAM
		  ┌─────────────────┐         ┌──────────────────────┐
		  │ /boot/          │ ──────→ │ tmpfs (root /)       │
		  │   vmlinuz       │  copy   │   /etc/              │
		  │   initramfs     │  to RAM │   /var/              │
		  │   alpine.apkovl │ ──────→ │   /home/             │
		  │   (overlay)     │ restore │   all packages       │
		  └─────────────────┘         └──────────────────────┘
		                                        │
		                              Changes in RAM only
		                              (lost on reboot unless lbu commit)
		  ```
		- ```bash
		  # Check if running in diskless mode
		  cat /proc/cmdline | grep -o 'alpine_dev=[^ ]*'
		  
		  # In diskless mode, / is a tmpfs
		  mount | grep "on / "
		  # tmpfs on / type tmpfs ...
		  ```
	- ## lbu — Local Backup Utility
		- `lbu` saves the current state of the system to the boot media so changes survive reboots.
		- ```bash
		  ## ── lbu COMMANDS ──────────────────────────────────────────
		  lbu status                    # Show what files have changed
		  lbu diff                      # Show diff of changed files
		  lbu commit                    # Save changes to boot media
		  lbu commit -d                 # Commit and show diff
		  
		  # lbu saves to an .apkovl file on the boot media
		  # Default: /media/mmcblk0p1/hostname.apkovl.tar.gz
		  
		  # Include extra files/directories in backup
		  lbu include /etc/myapp
		  lbu include /var/lib/myapp
		  
		  # Exclude files from backup
		  lbu exclude /etc/bigfile
		  
		  # List included/excluded paths
		  lbu list
		  lbu list -e                   # Show excluded
		  
		  # Restore from backup (on fresh boot)
		  lbu restore                   # Restore from default location
		  
		  # Backup to specific location
		  lbu commit -d /media/usb/
		  ```
		- > [!tip] lbu Workflow
		  > After making any configuration change on a diskless Alpine system, always run `lbu commit` to persist the changes. Otherwise they'll be lost on next reboot. Think of it like `git commit` for your system config.
	- ## Overlay Filesystem
		- ```bash
		  # Alpine diskless uses overlayfs:
		  # Lower layer: read-only squashfs from boot media
		  # Upper layer: read-write tmpfs in RAM
		  # Merged: appears as normal read-write filesystem
		  
		  # The .apkovl overlay file contains:
		  # - /etc/ changes (config files)
		  # - /var/ changes (service state)
		  # - List of installed packages (world file)
		  
		  # On boot, Alpine:
		  # 1. Mounts boot media
		  # 2. Loads base system into RAM
		  # 3. Installs packages listed in world file
		  # 4. Restores .apkovl overlay (config files)
		  # 5. Starts OpenRC services
		  ```
	- ## Data Disk Setup (data mode)
		- ```bash
		  # In "data" mode: OS in RAM, /var and /home on persistent disk
		  # Useful for: NAS, routers, appliances with persistent data
		  
		  # During setup-alpine, choose "data" install mode
		  # Or manually configure:
		  
		  # 1. Partition data disk
		  fdisk /dev/sda
		  # Create /dev/sda1 for data
		  
		  # 2. Format
		  mkfs.ext4 /dev/sda1
		  
		  # 3. Mount
		  mkdir -p /media/data
		  mount /dev/sda1 /media/data
		  
		  # 4. Move /var to data disk
		  cp -a /var /media/data/
		  mount --bind /media/data/var /var
		  
		  # 5. Add to /etc/fstab (save with lbu)
		  echo "/dev/sda1 /media/data ext4 defaults 0 2" >> /etc/fstab
		  echo "/media/data/var /var none bind 0 0" >> /etc/fstab
		  
		  lbu commit
		  ```
	- ## Alpine as a Router/Firewall
		- ```bash
		  # Enable IP forwarding
		  echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf
		  sysctl -p
		  
		  # Install routing tools
		  apk add iptables ip6tables
		  
		  # NAT masquerade (share internet connection)
		  iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
		  iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
		  iptables -A FORWARD -i eth0 -o eth1 -m state --state ESTABLISHED,RELATED -j ACCEPT
		  
		  # Save rules
		  /etc/init.d/iptables save
		  rc-update add iptables boot
		  
		  # Install dnsmasq for DHCP + DNS
		  apk add dnsmasq
		  rc-update add dnsmasq default
		  ```
	- ## Useful Embedded Packages
		- ```bash
		  # System monitoring
		  apk add htop iotop nethogs
		  
		  # Hardware info
		  apk add lshw pciutils usbutils
		  
		  # GPIO / hardware (Raspberry Pi)
		  apk add raspberrypi-utils
		  apk add i2c-tools
		  
		  # Serial communication
		  apk add minicom picocom
		  
		  # Network tools
		  apk add tcpdump nmap iperf3
		  
		  # Storage
		  apk add smartmontools hdparm
		  
		  # Watchdog (auto-reboot on hang)
		  apk add watchdog
		  rc-update add watchdog boot
		  ```
- # More Learn
	- ## Official Resources
		- [Alpine Linux Official Website](https://alpinelinux.org) — downloads, news, releases
		- [Alpine Linux Wiki](https://wiki.alpinelinux.org) — comprehensive official documentation
		- [Alpine Linux Packages](https://pkgs.alpinelinux.org) — search all available packages
		- [Alpine Linux GitLab](https://gitlab.alpinelinux.org) — source code, APKBUILD files
		- [Alpine Linux Security Advisories](https://alpinelinux.org/releases/) — CVE tracking
		- [Alpine Linux Downloads](https://alpinelinux.org/downloads/) — all ISO/image downloads
	- ## Key Wiki Pages
		- [Installation Guide](https://wiki.alpinelinux.org/wiki/Installation) — official install docs
		- [Alpine Package Keeper (apk)](https://wiki.alpinelinux.org/wiki/Alpine_Package_Keeper) — full apk reference
		- [OpenRC](https://wiki.alpinelinux.org/wiki/OpenRC) — service management guide
		- [Diskless Mode](https://wiki.alpinelinux.org/wiki/Diskless_Mode) — RAM-based operation
		- [Local Backup Utility (lbu)](https://wiki.alpinelinux.org/wiki/Alpine_local_backup) — lbu guide
		- [Setting up a server](https://wiki.alpinelinux.org/wiki/Setting_up_a_server) — server hardening
		- [Docker](https://wiki.alpinelinux.org/wiki/Docker) — Alpine + Docker guide
	- ## YouTube Learning
		- [Alpine Linux in 100 Seconds – Fireship](https://www.youtube.com/watch?v=rvFBMtsGFAw) — quick overview
		- [Alpine Linux Full Course – NetworkChuck](https://www.youtube.com/watch?v=NuEMBW4LHGU) — beginner to intermediate
		- [Docker with Alpine Linux – TechWorld with Nana](https://www.youtube.com/watch?v=3c-iBn73dDE) — containers deep dive
	- ## Related Internal Notes
		- [[Docker]] — containers, Dockerfile, Docker Compose
		- [[Debian]] — Debian Linux, apt, dpkg
		- [[Fedora]] — Fedora Linux, dnf, SELinux
		- [[Linux Advanced]] — advanced Linux concepts, kernel, filesystems