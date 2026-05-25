---
date: 2026-04-06T11:04:22+05:30
lastmod: 2026-04-17T17:08:18+05:30

seoTitle: Debian Linux Complete Guide – APT, Security, Server & Administration
description: "Comprehensive Debian Linux reference covering installation, APT package management, systemd, networking, security hardening, server setup, and release branches."
keywords: "Debian Linux, debian guide, debian commands, debian apt, debian tutorial, debian administration, debian server, debian stable, debian testing, debian sid, debian security, AppArmor, debian notes, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Debian Linux – Complete Guide
enableToc: true
---

- # History
  collapsed:: true
	- ## How
		- Debian is one of the oldest and most influential Linux distributions, first announced on **August 16, 1993** by **Ian Murdock** on the comp.os.linux.development newsgroup.
		- The name "Debian" is a portmanteau of **Deb**ra (his girlfriend at the time, later wife) and **Ian** Murdock.
		- Version **0.01** was released in September 1993; the first stable release **1.1 "Buzz"** arrived in June 1996.
		- Debian introduced the **Debian Free Software Guidelines (DFSG)** — a set of principles defining what constitutes free software, which later became the basis for the **Open Source Definition**.
		- The **Debian Social Contract** was written in 1997, committing the project to always remain free and to give back to the free software community.
		- Debian releases are named after characters from **Toy Story** — a tradition started because Bruce Perens (second Debian leader) worked at Pixar.
	- ## Who
		- Founded by **Ian Murdock** (1973–2015) — a visionary who wanted a distribution built openly, in the spirit of Linux and GNU.
		- Maintained by the **Debian Project** — a global volunteer organization with no corporate sponsor.
		- Governed by the **Debian Constitution** and led by a democratically elected **Debian Project Leader (DPL)**.
		- Over **1,000 active Debian Developers (DDs)** and **Debian Maintainers (DMs)** worldwide.
		- Key figures: Ian Murdock (founder), Bruce Perens (2nd leader), Wichert Akkerman, Sam Hartman, Jonathan Carter (recent DPL).
	- ## Why
		- Ian Murdock was frustrated with existing distributions that were not developed openly or collaboratively.
		- Goal: create a distribution that would be maintained **openly**, in the spirit of Linux and GNU — a true community project.
		- Debian was designed to be the **universal operating system** — supporting more hardware architectures than any other distro.
		- The DFSG and Social Contract ensure Debian remains committed to freedom, transparency, and quality.
		- Debian's stability and reliability made it the foundation for **hundreds of downstream distributions**, most notably **Ubuntu**, **Kali Linux**, **Linux Mint**, **Raspberry Pi OS**, and **MX Linux**.
- # Introduction
  collapsed:: true
	- ## What is Debian?
		- Debian GNU/Linux is a **free, community-driven, universal operating system** built entirely on free software.
		- Uses **DEB** packages managed by **APT (Advanced Package Tool)** — one of the most mature package management systems in Linux.
		- Supports **13+ CPU architectures**: amd64, arm64, armel, armhf, i386, mips64el, mipsel, ppc64el, s390x, and more.
		- Available in three main flavors: **Desktop** (GNOME, KDE, Xfce, LXDE, MATE, Cinnamon), **Server** (minimal CLI), and **Live** (try without installing).
		- Debian is the **upstream source** for [[Ubuntu]], [[Kali Linux]], and hundreds of other distributions.
	- ## Debian Editions
		- ```
		  Debian Desktop     → Full desktop environment (GNOME default, others available)
		  Debian Server      → Minimal CLI install, no GUI, ideal for servers
		  Debian Live        → Try Debian without installing (boots from USB/DVD)
		  Debian Netinstall  → Minimal ISO (~400MB), downloads packages during install
		  Debian Cloud       → Official images for AWS, Azure, GCP, OpenStack
		  Debian Embedded    → For embedded/IoT devices (arm, mips)
		  ```
	- ## Release Branches
		- | Branch | Codename Example | Description | Use Case |
		  |--------|-----------------|-------------|----------|
		  | Stable | bookworm (12) | Thoroughly tested, infrequent updates | Production servers, desktops |
		  | Oldstable | bullseye (11) | Previous stable, still supported | Legacy systems |
		  | Testing | trixie | Next stable in preparation, rolling-ish | Advanced users, developers |
		  | Unstable (Sid) | sid | Always "sid", bleeding edge, no freeze | Developers, packagers |
		  | Experimental | experimental | Highly unstable, pre-upload testing | Package developers only |
		- > [!info] Codename History
		  > buzz → rex → bo → hamm → slink → potato → woody → sarge → etch → lenny → squeeze → wheezy → jessie → stretch → buster → bullseye → bookworm → trixie (next)
	- ## Debian vs Ubuntu vs Arch
		- | Feature | Debian | [[Ubuntu]] | [[Arch Linux]] |
		  |---------|--------|--------|-----------|
		  | Base | Independent | Debian-based | Independent |
		  | Release model | Stable/Testing/Sid | LTS + interim | Rolling release |
		  | Package manager | APT + dpkg | APT + dpkg + snap | pacman |
		  | Default desktop | GNOME | GNOME | None (DIY) |
		  | Stability | Very stable (Stable branch) | Stable | Bleeding edge |
		  | Ease of use | Moderate | Beginner-friendly | Advanced |
		  | Systemd | Yes | Yes | Yes |
		  | Free software only | Yes (main) | No (includes non-free) | No |
		  | Support cycle | ~5 years (LTS) | 5yr LTS / 9mo interim | Rolling |
		  | Community | Volunteer-only | Canonical + community | Community |
		  | Target user | Servers, advanced users | Beginners, desktops | Power users |
	- ## Advantages
		- Exceptional stability (Stable branch), massive package repository (59,000+ packages), supports more architectures than any other distro, strong commitment to free software, no corporate control, excellent security track record, long support cycles, rock-solid APT dependency resolution, foundation for hundreds of distros, highly customizable, great for servers and embedded systems.
	- ## Disadvantages
		- Stable branch has older packages (by design), no sudo by default (must configure manually), installer is less user-friendly than Ubuntu, non-free firmware not included by default (improving in Debian 12+), slower to adopt new features, smaller desktop market share than Ubuntu, less beginner-friendly out of the box.
	- ## Use Cases
		- Production servers (web, database, mail), Raspberry Pi and embedded systems, security research base (Kali Linux is Debian-based), long-running stable desktops, CI/CD build environments, Docker base images (`debian:bookworm-slim`), cloud infrastructure, NAS/home lab servers, academic and research computing.
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Debian 12 (Bookworm) — Minimum Requirements:
		    CPU:   1 GHz 64-bit (amd64) or 32-bit (i386)
		    RAM:   512 MB minimum (2 GB recommended for desktop)
		    Disk:  10 GB minimum (20 GB recommended)
		    GPU:   VGA-compatible (800x600 minimum)
		  
		  Recommended for Desktop:
		    CPU:   2 GHz dual-core 64-bit
		    RAM:   4 GB
		    Disk:  25 GB SSD
		    GPU:   1920x1080 display
		  
		  Recommended for Server:
		    CPU:   1 GHz 64-bit
		    RAM:   1 GB (2 GB for LAMP stack)
		    Disk:  10 GB (more for data)
		  ```
	- ## Netinstall vs Live ISO
		- | ISO Type | Size | Internet Required | Best For |
		  |----------|------|-------------------|----------|
		  | netinstall | ~400 MB | Yes (downloads packages) | Servers, minimal installs |
		  | Live (GNOME) | ~3 GB | No | Desktop, trying Debian |
		  | Live (Xfce) | ~2.5 GB | No | Lightweight desktop |
		  | DVD-1 | ~3.7 GB | No | Offline full install |
		  | Cloud image | ~300 MB | Yes | VMs, cloud instances |
		- > [!tip] Debian 12+ includes non-free firmware
		  > Starting with Debian 12 Bookworm, the official installer ISOs include non-free firmware (Wi-Fi, GPU drivers) by default. No more separate firmware ISO needed.
	- ## Creating Bootable USB
		- ```bash
		  # Using dd (Linux/macOS)
		  sudo dd if=debian-12.x.x-amd64-netinst.iso of=/dev/sdX bs=4M status=progress
		  sync
		  
		  # Using Ventoy (multi-boot USB)
		  # Just copy the ISO to the Ventoy USB drive
		  
		  # Using Balena Etcher (GUI, cross-platform)
		  # Download from: https://etcher.balena.io
		  ```
	- ## Debian Installer Steps
		- ```
		  1. Boot from USB → "Graphical Install" (recommended) or "Install" (text)
		  2. Language → Country → Keyboard layout
		  3. Hostname (e.g., debian-server) → Domain name (optional)
		  4. Root password → Create non-root user + password
		  5. Partition disks:
		     - Guided (entire disk) → recommended for beginners
		     - Manual: /boot/efi (512MB, EFI), /boot (1GB, ext4),
		               swap (2×RAM or 4GB), / (rest, ext4 or btrfs)
		  6. Configure package manager:
		     - Select mirror country → choose mirror (deb.debian.org recommended)
		     - HTTP proxy (leave blank if none)
		  7. Popularity contest → optional (helps Debian stats)
		  8. Software selection:
		     - [*] Debian desktop environment
		     - [*] GNOME (or KDE, Xfce, etc.)
		     - [*] SSH server (for servers)
		     - [*] Standard system utilities
		  9. Install GRUB → select disk (/dev/sda or /dev/nvme0n1)
		  10. Reboot → remove USB
		  ```
	- ## First Boot Configuration
		- ```bash
		  # Switch to root (Debian doesn't add your user to sudo by default!)
		  su -
		  
		  # Install sudo and add your user
		  apt install sudo
		  usermod -aG sudo yourusername
		  # Log out and back in for group change to take effect
		  
		  # Update package lists and upgrade
		  sudo apt update && sudo apt upgrade -y
		  
		  # Enable contrib and non-free repos (for firmware, codecs, etc.)
		  sudo nano /etc/apt/sources.list
		  # Change:
		  # deb http://deb.debian.org/debian bookworm main
		  # To:
		  # deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
		  
		  sudo apt update
		  
		  # Install common tools
		  sudo apt install -y curl wget git vim htop net-tools build-essential
		  
		  # Install firmware (if needed)
		  sudo apt install -y firmware-linux firmware-linux-nonfree
		  
		  # Check system info
		  uname -r          # kernel version
		  lsb_release -a    # Debian version info
		  hostnamectl       # hostname and OS info
		  ```
	- ## Default Filesystem Layout
		- ```
		  Debian default partition layout (ext4):
		  
		  /boot/efi    → EFI System Partition (FAT32, ~512MB) — UEFI only
		  /boot        → Kernel + initrd (ext4, ~1GB)
		  swap         → Swap partition (2×RAM recommended)
		  /            → Root filesystem (ext4, rest of disk)
		  
		  Optional separate partitions (server best practice):
		  /home        → User data (separate for easy reinstall)
		  /var         → Logs, databases (prevents root fill-up)
		  /tmp         → Temporary files (can be tmpfs)
		  /srv         → Service data
		  
		  Key directories:
		  /etc         → All system configuration
		  /var/log     → System logs
		  /var/cache/apt → APT package cache
		  /usr         → Programs and libraries
		  /opt         → Third-party software
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Linux Kernel on Debian
		- Debian Stable ships a **Long-Term Support (LTS)** kernel — stable and well-tested, not bleeding edge.
		- Debian 12 (Bookworm) ships **Linux 6.1 LTS**.
		- Debian Testing/Sid ships newer kernels, closer to upstream.
		- Kernel packages: `linux-image-amd64` (meta-package, always latest for your arch).
		- ```bash
		  # Check current kernel
		  uname -r                          # e.g., 6.1.0-21-amd64
		  uname -a                          # full info
		  cat /proc/version                 # kernel + compiler info
		  
		  # List installed kernels
		  dpkg -l | grep linux-image
		  ls /boot/vmlinuz*
		  
		  # Install a specific kernel
		  sudo apt install linux-image-6.1.0-21-amd64
		  
		  # Install latest kernel meta-package
		  sudo apt install linux-image-amd64
		  
		  # Install kernel headers (needed for building modules)
		  sudo apt install linux-headers-$(uname -r)
		  sudo apt install linux-headers-amd64
		  
		  # Remove old kernels (apt autoremove handles this)
		  sudo apt autoremove
		  
		  # Kernel messages
		  dmesg | head -50
		  dmesg -T | grep -i error
		  journalctl -k                     # kernel log via systemd
		  ```
	- ## Boot Process
		- ```mermaid
		  graph TD
		    A["🔌 Power On"] --> B["UEFI/BIOS POST\nHardware initialization"]
		    B --> C["GRUB2 Bootloader\n/boot/grub/grub.cfg"]
		    C --> D["Kernel loads\nvmlinuz-6.1.0-amd64"]
		    D --> E["initramfs mounts\nearly root filesystem\n(initrd.img)"]
		    E --> F["Kernel detects hardware\nloads essential drivers"]
		    F --> G["systemd starts\nPID 1"]
		    G --> H["sysinit.target\nmount filesystems, udev"]
		    H --> I["basic.target\nlogging, sockets"]
		    I --> J{Boot target?}
		    J -->|Server| K["multi-user.target\nCLI login prompt"]
		    J -->|Desktop| L["graphical.target\nGDM/LightDM login"]
		  ```
	- ## Linux FHS Layout on Debian
		- ```
		  /                Root filesystem (ext4 default on Debian)
		  ├── /bin       → symlink to /usr/bin (UsrMerge in Debian 12+)
		  ├── /boot        Kernel (vmlinuz), initrd, GRUB2 files
		  │   └── /boot/efi  EFI partition (UEFI systems)
		  ├── /dev         Device files (managed by udev)
		  ├── /etc         System-wide configuration files
		  │   ├── /etc/apt       APT configuration + sources.list
		  │   ├── /etc/network   Network interfaces (ifupdown)
		  │   ├── /etc/systemd   Systemd unit files
		  │   └── /etc/ssh       SSH server config
		  ├── /home        User home directories
		  ├── /lib       → symlink to /usr/lib
		  ├── /lib64     → symlink to /usr/lib64
		  ├── /media       Auto-mounted removable media
		  ├── /mnt         Manual mount points
		  ├── /opt         Optional third-party software
		  ├── /proc        Virtual: process + kernel info (procfs)
		  ├── /root        Root user's home directory
		  ├── /run         Runtime data (cleared on reboot, tmpfs)
		  ├── /sbin      → symlink to /usr/sbin
		  ├── /srv         Service data (web, ftp)
		  ├── /sys         Virtual: hardware/driver info (sysfs)
		  ├── /tmp         Temporary files (tmpfs or ext4)
		  ├── /usr         All user programs, libraries, docs
		  │   ├── /usr/bin     User commands
		  │   ├── /usr/sbin    Admin commands
		  │   ├── /usr/lib     Shared libraries
		  │   ├── /usr/share   Architecture-independent data, man pages
		  │   └── /usr/local   Locally installed software (not from apt)
		  └── /var         Variable data
		      ├── /var/log     System logs
		      ├── /var/cache   Package cache (/var/cache/apt)
		      ├── /var/lib     Application state data
		      └── /var/spool   Mail, print queues
		  ```
	- ## GRUB2 Management
		- ```bash
		  # View current GRUB config
		  cat /boot/grub/grub.cfg
		  
		  # Edit GRUB defaults
		  sudo nano /etc/default/grub
		  # Key options:
		  # GRUB_DEFAULT=0                  # default boot entry (0 = first)
		  # GRUB_TIMEOUT=5                  # seconds to show menu
		  # GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"  # kernel params
		  # GRUB_CMDLINE_LINUX=""           # always-applied params
		  
		  # Regenerate GRUB config after changes
		  sudo update-grub
		  # or explicitly:
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # Reinstall GRUB to MBR (if bootloader is broken)
		  sudo grub-install /dev/sda
		  
		  # Reinstall GRUB for UEFI
		  sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi
		  sudo update-grub
		  
		  # List GRUB entries
		  grep -E "^menuentry|^submenu" /boot/grub/grub.cfg
		  ```
- # APT Package Management
  collapsed:: true
	- ## What is APT?
		- **APT (Advanced Package Tool)** is Debian's high-level package management system, introduced in 1998.
		- Works on top of **dpkg** (the low-level package tool) — APT handles dependency resolution, dpkg handles actual installation.
		- Config: `/etc/apt/apt.conf.d/` | Sources: `/etc/apt/sources.list` + `/etc/apt/sources.list.d/`
		- Package cache: `/var/cache/apt/archives/`
	- ## APT Flow Diagram
		- ```mermaid
		  graph TD
		    U["👤 User runs apt install pkg"] --> A["APT reads sources.list"]
		    A --> B["Downloads package index\n/var/lib/apt/lists/"]
		    B --> C["Resolves dependencies\n(recursive)"]
		    C --> D{All deps available?}
		    D -->|No| E["❌ Dependency error\nshow conflict"]
		    D -->|Yes| F["Downloads .deb files\n/var/cache/apt/archives/"]
		    F --> G["Calls dpkg\nto install each .deb"]
		    G --> H["dpkg unpacks\nconfigures package"]
		    H --> I["Runs maintainer scripts\npreinst, postinst"]
		    I --> J["✅ Package installed\n/var/lib/dpkg/status updated"]
		  ```
	- ## Essential APT Commands
		- ```bash
		  # ── Update & Upgrade ──────────────────────────────────────────
		  sudo apt update                    # refresh package index (always run first)
		  sudo apt upgrade -y                # upgrade all upgradable packages
		  sudo apt full-upgrade -y           # upgrade + handle dependency changes (dist-upgrade)
		  sudo apt dist-upgrade -y           # same as full-upgrade (older alias)
		  
		  # ── Install & Remove ──────────────────────────────────────────
		  sudo apt install package           # install a package
		  sudo apt install pkg1 pkg2 pkg3    # install multiple packages
		  sudo apt install ./local.deb       # install local .deb file
		  sudo apt install package=1.2.3     # install specific version
		  sudo apt remove package            # remove package (keep config files)
		  sudo apt purge package             # remove package + config files
		  sudo apt autoremove                # remove unused dependencies
		  sudo apt autoremove --purge        # remove unused deps + their configs
		  
		  # ── Search & Info ─────────────────────────────────────────────
		  apt search keyword                 # search packages by name/description
		  apt show package                   # show package details
		  apt list --installed               # list all installed packages
		  apt list --upgradable              # list upgradable packages
		  apt list --all-versions package    # list all available versions
		  
		  # ── Cache Management ──────────────────────────────────────────
		  sudo apt clean                     # remove all cached .deb files
		  sudo apt autoclean                 # remove only outdated cached .debs
		  du -sh /var/cache/apt/archives/    # check cache size
		  
		  # ── Fix Broken Packages ───────────────────────────────────────
		  sudo apt install -f                # fix broken dependencies
		  sudo apt --fix-broken install      # same as above
		  sudo dpkg --configure -a           # configure any unconfigured packages
		  ```
	- ## APT-Cache Commands
		- ```bash
		  apt-cache search keyword           # search package names + descriptions
		  apt-cache show package             # detailed package info
		  apt-cache showpkg package          # show dependencies + reverse deps
		  apt-cache depends package          # show what package depends on
		  apt-cache rdepends package         # show what depends on package
		  apt-cache policy package           # show installed vs candidate version
		  apt-cache stats                    # overall cache statistics
		  apt-cache pkgnames                 # list all known package names
		  apt-cache pkgnames | grep nginx    # find packages matching pattern
		  ```
	- ## APT-Mark Commands
		- ```bash
		  sudo apt-mark hold package         # prevent package from being upgraded
		  sudo apt-mark unhold package       # allow package to be upgraded again
		  sudo apt-mark auto package         # mark as auto-installed (autoremovable)
		  sudo apt-mark manual package       # mark as manually installed (keep)
		  apt-mark showhold                  # list held packages
		  apt-mark showauto                  # list auto-installed packages
		  apt-mark showmanual                # list manually installed packages
		  ```
	- ## dpkg Commands
		- ```bash
		  # ── Install / Remove ──────────────────────────────────────────
		  sudo dpkg -i package.deb           # install a .deb file
		  sudo dpkg -r package               # remove package (keep configs)
		  sudo dpkg -P package               # purge package + configs
		  sudo dpkg --configure -a           # configure all unconfigured packages
		  
		  # ── Query ─────────────────────────────────────────────────────
		  dpkg -l                            # list all installed packages
		  dpkg -l | grep nginx               # filter installed packages
		  dpkg -l package                    # status of specific package
		  dpkg -s package                    # show package status + info
		  dpkg -L package                    # list files installed by package
		  dpkg -S /path/to/file              # which package owns this file
		  dpkg --get-selections              # list all packages with status
		  dpkg --print-architecture          # show system architecture
		  
		  # ── Verify ────────────────────────────────────────────────────
		  dpkg -V package                    # verify package file integrity
		  dpkg -V                            # verify all installed packages
		  ```
	- ## sources.list Explained
		- ```ini
		  # /etc/apt/sources.list format:
		  # deb [options] URI suite component1 component2 ...
		  
		  # ── Debian 12 Bookworm (full recommended) ────────────────────
		  deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
		  deb-src http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
		  
		  # Security updates (critical — always include)
		  deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
		  deb-src http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
		  
		  # Stable updates (bug fixes, not security)
		  deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
		  deb-src http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
		  
		  # Components explained:
		  # main          → Free software (DFSG-compliant), officially supported
		  # contrib       → Free software that depends on non-free packages
		  # non-free      → Non-free software (proprietary)
		  # non-free-firmware → Firmware blobs (Wi-Fi, GPU) — new in Debian 12
		  ```
	- ## Adding Third-Party Repositories
		- ```bash
		  # Method 1: Add GPG key + repo (modern way — signed-by)
		  # Example: Docker
		  sudo apt install ca-certificates curl gnupg
		  sudo install -m 0755 -d /etc/apt/keyrings
		  curl -fsSL https://download.docker.com/linux/debian/gpg | \
		    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
		  sudo chmod a+r /etc/apt/keyrings/docker.gpg
		  
		  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
		    https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
		    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
		  
		  sudo apt update
		  sudo apt install docker-ce docker-ce-cli containerd.io
		  
		  # Method 2: add-apt-repository (install software-properties-common first)
		  sudo apt install software-properties-common
		  sudo add-apt-repository "deb http://repo.example.com/debian bookworm main"
		  
		  # List all configured repos
		  apt-cache policy
		  grep -r "^deb" /etc/apt/sources.list /etc/apt/sources.list.d/
		  ```
	- ## Backports
		- ```bash
		  # Backports provide newer package versions for Debian Stable
		  # Add bookworm-backports to sources.list
		  echo "deb http://deb.debian.org/debian bookworm-backports main contrib non-free" | \
		    sudo tee /etc/apt/sources.list.d/backports.list
		  
		  sudo apt update
		  
		  # Install from backports (must specify -t)
		  sudo apt install -t bookworm-backports package-name
		  
		  # Example: install newer kernel from backports
		  sudo apt install -t bookworm-backports linux-image-amd64
		  
		  # Check what's available in backports
		  apt-cache policy package-name
		  ```
	- ## APT Pinning
		- ```ini
		  # /etc/apt/preferences.d/pinning
		  # Pin priorities: 1000=force, 990=installed, 500=default, 100=auto, -1=never
		  
		  # Example: prefer stable, allow specific package from backports
		  Package: *
		  Pin: release a=bookworm
		  Pin-Priority: 900
		  
		  Package: *
		  Pin: release a=bookworm-backports
		  Pin-Priority: 400
		  
		  # Force a specific package from backports
		  Package: nginx
		  Pin: release a=bookworm-backports
		  Pin-Priority: 1001
		  
		  # Never install a package
		  Package: package-to-block
		  Pin: release *
		  Pin-Priority: -1
		  ```
		- ```bash
		  # Check pin priorities
		  apt-cache policy
		  apt-cache policy package-name
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell
		- Debian uses **bash** (Bourne Again Shell) as the default login shell for users.
		- `/bin/sh` on Debian points to **dash** (not bash) — a POSIX-compliant, faster shell used for system scripts.
		- Other available shells: `zsh`, `fish`, `tcsh`, `ksh` — install via apt.
		- ```bash
		  echo $SHELL                        # current shell
		  cat /etc/shells                    # all available shells
		  chsh -s /bin/zsh                   # change default shell (re-login required)
		  ls -la /bin/sh                     # shows sh → dash on Debian
		  ```
	- ## Essential Commands
		- ```bash
		  # ── Navigation ────────────────────────────────────────────────
		  pwd                                # print working directory
		  ls -la                             # list files (long format, hidden)
		  ls -lh                             # human-readable sizes
		  cd /path/to/dir                    # change directory
		  cd ~                               # go to home directory
		  cd -                               # go to previous directory
		  
		  # ── File Operations ───────────────────────────────────────────
		  touch file.txt                     # create empty file / update timestamp
		  cp source dest                     # copy file
		  cp -r source/ dest/                # copy directory recursively
		  mv source dest                     # move / rename
		  rm file.txt                        # delete file
		  rm -rf directory/                  # delete directory recursively (careful!)
		  mkdir -p /path/to/new/dir          # create directory + parents
		  
		  # ── View Files ────────────────────────────────────────────────
		  cat file.txt                       # print file contents
		  less file.txt                      # paginated view (q to quit)
		  head -n 20 file.txt                # first 20 lines
		  tail -n 20 file.txt                # last 20 lines
		  tail -f /var/log/syslog            # follow log in real-time
		  
		  # ── Search ────────────────────────────────────────────────────
		  grep "pattern" file.txt            # search in file
		  grep -r "pattern" /etc/            # recursive search
		  grep -i "pattern" file.txt         # case-insensitive
		  find / -name "*.conf" 2>/dev/null  # find files by name
		  find /var -size +100M              # find files larger than 100MB
		  locate filename                    # fast search (needs updatedb)
		  which command                      # find command location
		  
		  # ── System Info ───────────────────────────────────────────────
		  uname -a                           # kernel + system info
		  lsb_release -a                     # Debian version
		  hostnamectl                        # hostname + OS info
		  uptime                             # system uptime + load
		  free -h                            # memory usage
		  df -h                              # disk usage
		  du -sh /var/log/                   # directory size
		  lscpu                              # CPU info
		  lsblk                              # block devices
		  lspci                              # PCI devices
		  lsusb                              # USB devices
		  
		  # ── Process Management ────────────────────────────────────────
		  ps aux                             # all running processes
		  ps aux | grep nginx                # find specific process
		  top                                # interactive process viewer
		  htop                               # better interactive viewer (install: apt install htop)
		  kill PID                           # send SIGTERM to process
		  kill -9 PID                        # send SIGKILL (force kill)
		  killall nginx                      # kill all processes named nginx
		  pkill -f "pattern"                 # kill by pattern match
		  nice -n 10 command                 # run with lower priority
		  renice -n 5 -p PID                 # change priority of running process
		  
		  # ── Disk & Filesystem ─────────────────────────────────────────
		  mount /dev/sdb1 /mnt               # mount device
		  umount /mnt                        # unmount
		  fdisk -l                           # list partitions
		  lsblk -f                           # list block devices + filesystems
		  blkid                              # show UUIDs of block devices
		  ```
	- ## File Permissions
		- ```bash
		  # Permission format: [type][owner][group][others]
		  # Example: -rwxr-xr-- 1 alice devs 4096 Jan 1 12:00 script.sh
		  #           d = directory, - = file, l = symlink
		  #           r=4, w=2, x=1
		  
		  chmod 755 script.sh                # rwxr-xr-x (owner: rwx, group: rx, others: rx)
		  chmod 644 file.txt                 # rw-r--r-- (owner: rw, group: r, others: r)
		  chmod 600 ~/.ssh/id_rsa            # rw------- (private key — must be 600)
		  chmod +x script.sh                 # add execute for all
		  chmod -R 755 /var/www/html/        # recursive
		  
		  chown user:group file.txt          # change owner + group
		  chown -R www-data:www-data /var/www/html/
		  chgrp devs project/                # change group only
		  
		  # Special permissions
		  chmod u+s /usr/bin/program         # setuid — runs as file owner
		  chmod g+s /shared/dir/             # setgid — new files inherit group
		  chmod +t /tmp/                     # sticky bit — only owner can delete
		  
		  # View permissions
		  ls -la file.txt
		  stat file.txt                      # detailed file info including permissions
		  
		  # umask — default permission mask
		  umask                              # show current umask (e.g., 0022)
		  umask 027                          # set umask (files: 640, dirs: 750)
		  ```
	- ## I/O Redirection
		- ```bash
		  command > file.txt                 # redirect stdout to file (overwrite)
		  command >> file.txt                # redirect stdout to file (append)
		  command 2> error.log               # redirect stderr to file
		  command 2>&1                       # redirect stderr to stdout
		  command > output.txt 2>&1          # redirect both stdout + stderr
		  command &> output.txt              # same (bash shorthand)
		  command < input.txt                # redirect stdin from file
		  command1 | command2                # pipe stdout of cmd1 to stdin of cmd2
		  command | tee file.txt             # pipe + write to file simultaneously
		  command > /dev/null 2>&1           # discard all output
		  
		  # Here document
		  cat << EOF > config.txt
		  line 1
		  line 2
		  EOF
		  
		  # Process substitution
		  diff <(ls dir1) <(ls dir2)         # compare outputs of two commands
		  ```
	- ## Shell Scripting Basics
		- ```bash
		  #!/bin/bash
		  # Shebang line — always first line of script
		  
		  # Variables
		  NAME="Debian"
		  VERSION=12
		  echo "Welcome to $NAME $VERSION"
		  
		  # Command substitution
		  KERNEL=$(uname -r)
		  echo "Kernel: $KERNEL"
		  
		  # Conditionals
		  if [ -f /etc/debian_version ]; then
		    echo "This is Debian"
		  elif [ -f /etc/fedora-release ]; then
		    echo "This is Fedora"
		  else
		    echo "Unknown distro"
		  fi
		  
		  # Loops
		  for pkg in curl wget git vim; do
		    sudo apt install -y "$pkg"
		  done
		  
		  # While loop
		  COUNT=0
		  while [ $COUNT -lt 5 ]; do
		    echo "Count: $COUNT"
		    ((COUNT++))
		  done
		  
		  # Functions
		  install_pkg() {
		    local pkg="$1"
		    if dpkg -l "$pkg" &>/dev/null; then
		      echo "$pkg already installed"
		    else
		      sudo apt install -y "$pkg"
		    fi
		  }
		  install_pkg nginx
		  
		  # Exit codes
		  command && echo "success" || echo "failed"
		  exit 0   # success
		  exit 1   # failure
		  ```
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- ```
		  root        → UID 0, superuser, full system access
		  System users → UID 1-999, for services (www-data, mysql, nobody)
		  Regular users → UID 1000+, human users
		  ```
	- ## useradd vs adduser
		- > [!info] Debian-specific: useradd vs adduser
		  > Debian provides two commands: `useradd` (low-level, from shadow-utils, no home dir by default) and `adduser` (high-level Perl script, interactive, creates home dir + sets up skeleton). On Debian, **always prefer `adduser`** for creating human users.
		- ```bash
		  # adduser — Debian's friendly user creation tool
		  sudo adduser alice                 # interactive: prompts for password, name, etc.
		  sudo adduser alice sudo            # add alice to sudo group
		  sudo adduser alice www-data        # add alice to www-data group
		  
		  # useradd — low-level, non-interactive
		  sudo useradd -m -s /bin/bash -c "Alice Smith" alice   # -m=home, -s=shell
		  sudo useradd -r -s /usr/sbin/nologin serviceuser      # system user, no login
		  sudo passwd alice                  # set password separately
		  
		  # Modify user
		  sudo usermod -aG sudo alice        # add to group (append, don't replace)
		  sudo usermod -s /bin/zsh alice     # change shell
		  sudo usermod -l newname oldname    # rename user
		  sudo usermod -L alice              # lock account
		  sudo usermod -U alice              # unlock account
		  sudo usermod -e 2025-12-31 alice   # set account expiry
		  
		  # Delete user
		  sudo deluser alice                 # remove user (keep home dir)
		  sudo deluser --remove-home alice   # remove user + home dir
		  sudo userdel -r alice              # low-level equivalent
		  
		  # User info
		  id alice                           # UID, GID, groups
		  whoami                             # current user
		  who                                # logged-in users
		  w                                  # logged-in users + activity
		  last                               # login history
		  finger alice                       # user info (install: apt install finger)
		  cat /etc/passwd                    # all user accounts
		  getent passwd alice                # user entry from passwd database
		  ```
	- ## sudo Setup on Debian
		- > [!tip] Critical Debian Difference
		  > Unlike Ubuntu, **Debian does NOT add your user to the sudo group during installation** (unless you leave the root password blank). You must manually add your user to sudo after install. This is a common gotcha for Ubuntu users switching to Debian.
		- ```bash
		  # Step 1: Switch to root
		  su -
		  
		  # Step 2: Install sudo (may not be installed)
		  apt install sudo
		  
		  # Step 3: Add user to sudo group
		  usermod -aG sudo yourusername
		  # OR edit sudoers directly:
		  adduser yourusername sudo
		  
		  # Step 4: Log out and back in (or use newgrp)
		  newgrp sudo
		  
		  # Verify
		  groups yourusername               # should show sudo in list
		  sudo whoami                       # should return "root"
		  ```
	- ## /etc/sudoers Configuration
		- ```bash
		  # Always edit sudoers with visudo (validates syntax before saving)
		  sudo visudo
		  
		  # /etc/sudoers format:
		  # user  host=(runas)  commands
		  
		  # Allow alice to run all commands as root
		  alice ALL=(ALL:ALL) ALL
		  
		  # Allow alice to run all commands without password
		  alice ALL=(ALL:ALL) NOPASSWD: ALL
		  
		  # Allow alice to run only specific commands
		  alice ALL=(ALL) /usr/bin/apt, /usr/bin/systemctl
		  
		  # Allow group sudo to run all commands (default Debian config)
		  %sudo ALL=(ALL:ALL) ALL
		  
		  # Drop-in files (preferred over editing sudoers directly)
		  sudo visudo -f /etc/sudoers.d/alice
		  # Contents:
		  alice ALL=(ALL:ALL) NOPASSWD: /usr/bin/apt update, /usr/bin/apt upgrade
		  ```
	- ## Group Management
		- ```bash
		  # Create / delete groups
		  sudo groupadd developers           # create group
		  sudo groupdel developers           # delete group
		  sudo groupmod -n devs developers   # rename group
		  
		  # Add / remove users from groups
		  sudo usermod -aG developers alice  # add alice to developers (-a = append!)
		  sudo gpasswd -d alice developers   # remove alice from developers
		  sudo gpasswd -A alice developers   # make alice group admin
		  
		  # View groups
		  groups                             # current user's groups
		  groups alice                       # alice's groups
		  cat /etc/group                     # all groups
		  getent group developers            # group entry
		  
		  # Important system groups on Debian:
		  # sudo      → sudo access
		  # www-data  → web server (Apache/Nginx)
		  # docker    → Docker access (no sudo needed)
		  # adm       → read system logs
		  # dialout   → serial ports
		  # plugdev   → USB/removable media
		  ```
	- ## Password & Account Policies
		- ```bash
		  # Password management
		  passwd                             # change own password
		  sudo passwd alice                  # change alice's password
		  sudo passwd -l alice               # lock alice's password
		  sudo passwd -u alice               # unlock alice's password
		  sudo passwd -e alice               # expire password (force change on next login)
		  
		  # Password aging (chage)
		  sudo chage -l alice                # show password aging info
		  sudo chage -M 90 alice             # max 90 days before password expires
		  sudo chage -m 7 alice              # min 7 days between changes
		  sudo chage -W 14 alice             # warn 14 days before expiry
		  sudo chage -E 2025-12-31 alice     # account expires on date
		  
		  # /etc/login.defs — system-wide defaults
		  grep -E "^PASS_MAX_DAYS|^PASS_MIN_DAYS|^PASS_WARN_AGE" /etc/login.defs
		  ```
- # Systemd & Service Management
  collapsed:: true
	- ## systemctl Commands
		- ```bash
		  # ── Service Control ───────────────────────────────────────────
		  sudo systemctl start nginx         # start service
		  sudo systemctl stop nginx          # stop service
		  sudo systemctl restart nginx       # stop + start
		  sudo systemctl reload nginx        # reload config (no downtime)
		  sudo systemctl enable nginx        # enable at boot
		  sudo systemctl disable nginx       # disable at boot
		  sudo systemctl enable --now nginx  # enable + start immediately
		  sudo systemctl disable --now nginx # disable + stop immediately
		  
		  # ── Status & Info ─────────────────────────────────────────────
		  systemctl status nginx             # service status + recent logs
		  systemctl is-active nginx          # active / inactive
		  systemctl is-enabled nginx         # enabled / disabled
		  systemctl is-failed nginx          # failed / not-failed
		  systemctl list-units               # all active units
		  systemctl list-units --type=service # all active services
		  systemctl list-units --state=failed # all failed units
		  systemctl list-unit-files          # all installed unit files + state
		  systemctl list-unit-files --type=service
		  
		  # ── System State ──────────────────────────────────────────────
		  sudo systemctl reboot              # reboot system
		  sudo systemctl poweroff            # shut down
		  sudo systemctl halt                # halt (no power off)
		  sudo systemctl suspend             # suspend to RAM
		  sudo systemctl hibernate           # suspend to disk
		  
		  # ── Targets (runlevels) ───────────────────────────────────────
		  systemctl get-default              # current default target
		  sudo systemctl set-default multi-user.target   # set default to CLI
		  sudo systemctl set-default graphical.target    # set default to GUI
		  sudo systemctl isolate rescue.target            # switch to rescue mode
		  
		  # ── Daemon reload ─────────────────────────────────────────────
		  sudo systemctl daemon-reload       # reload unit files after editing
		  ```
	- ## journalctl Commands
		- ```bash
		  # ── View Logs ─────────────────────────────────────────────────
		  journalctl                         # all logs (oldest first)
		  journalctl -r                      # reverse (newest first)
		  journalctl -f                      # follow (like tail -f)
		  journalctl -n 50                   # last 50 lines
		  journalctl -b                      # logs since last boot
		  journalctl -b -1                   # logs from previous boot
		  journalctl --since "2024-01-01"    # logs since date
		  journalctl --since "1 hour ago"    # logs from last hour
		  journalctl --until "2024-01-02 12:00"
		  
		  # ── Filter by Unit ────────────────────────────────────────────
		  journalctl -u nginx                # logs for nginx service
		  journalctl -u nginx -f             # follow nginx logs
		  journalctl -u nginx --since today  # nginx logs today
		  journalctl -u ssh -u nginx         # multiple units
		  
		  # ── Filter by Priority ────────────────────────────────────────
		  journalctl -p err                  # errors only
		  journalctl -p warning              # warnings + above
		  journalctl -p 0..3                 # emerg, alert, crit, err
		  # Priorities: 0=emerg, 1=alert, 2=crit, 3=err, 4=warning, 5=notice, 6=info, 7=debug
		  
		  # ── Kernel Logs ───────────────────────────────────────────────
		  journalctl -k                      # kernel messages only
		  journalctl -k -b                   # kernel messages this boot
		  
		  # ── Disk Usage ────────────────────────────────────────────────
		  journalctl --disk-usage            # journal disk usage
		  sudo journalctl --vacuum-size=500M # keep only 500MB of logs
		  sudo journalctl --vacuum-time=30d  # keep only last 30 days
		  ```
	- ## Important Log Files
		- ```bash
		  # Traditional syslog files (still present on Debian alongside journald)
		  /var/log/syslog          # general system messages
		  /var/log/auth.log        # authentication, sudo, SSH logins
		  /var/log/kern.log        # kernel messages
		  /var/log/daemon.log      # background service messages
		  /var/log/dpkg.log        # package install/remove history
		  /var/log/apt/history.log # apt command history
		  /var/log/apt/term.log    # apt terminal output
		  /var/log/nginx/          # Nginx access + error logs
		  /var/log/apache2/        # Apache access + error logs
		  /var/log/mysql/          # MySQL error log
		  /var/log/fail2ban.log    # fail2ban actions
		  /var/log/ufw.log         # UFW firewall log
		  
		  # Useful log commands
		  tail -f /var/log/syslog                    # follow syslog
		  grep "Failed password" /var/log/auth.log   # failed SSH logins
		  grep "sudo" /var/log/auth.log              # sudo usage
		  zcat /var/log/syslog.2.gz | grep error     # read compressed log
		  ```
	- ## Custom Systemd Service Unit
		- ```ini
		  # /etc/systemd/system/myapp.service
		  [Unit]
		  Description=My Custom Application
		  Documentation=https://example.com/docs
		  After=network.target
		  Wants=network.target
		  
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
		  NoNewPrivileges=true
		  PrivateTmp=true
		  ProtectSystem=strict
		  ProtectHome=true
		  ReadWritePaths=/var/lib/myapp /var/log/myapp
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  # Enable and start the service
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now myapp
		  sudo systemctl status myapp
		  journalctl -u myapp -f
		  ```
- # Networking
  collapsed:: true
	- ## Network Stack Diagram
		- ```mermaid
		  graph TD
		    APP["Application Layer\ncurl, ssh, nginx, browser"]
		    SOCK["Socket API\nsocket(), bind(), connect()"]
		    TCP["Transport Layer\nTCP / UDP"]
		    IP["Network Layer\nIP routing, iptables/nftables"]
		    ETH["Data Link Layer\nEthernet, Wi-Fi (802.11)"]
		    HW["Physical Layer\nNIC, Cable, Wi-Fi adapter"]
		    
		    APP --> SOCK
		    SOCK --> TCP
		    TCP --> IP
		    IP --> ETH
		    ETH --> HW
		    
		    NM["NetworkManager\nor systemd-networkd"] -.->|configures| ETH
		    FW["nftables / iptables / ufw"] -.->|filters| IP
		  ```
	- ## ip & ss Commands
		- ```bash
		  # ── Interface Management (ip) ─────────────────────────────────
		  ip addr                            # show all interfaces + IPs
		  ip addr show eth0                  # show specific interface
		  ip link                            # show link state
		  ip link set eth0 up                # bring interface up
		  ip link set eth0 down              # bring interface down
		  
		  # Add/remove IP address
		  sudo ip addr add 192.168.1.100/24 dev eth0
		  sudo ip addr del 192.168.1.100/24 dev eth0
		  
		  # ── Routing ───────────────────────────────────────────────────
		  ip route                           # show routing table
		  ip route show                      # same
		  sudo ip route add default via 192.168.1.1    # add default gateway
		  sudo ip route add 10.0.0.0/8 via 192.168.1.1 # add static route
		  sudo ip route del 10.0.0.0/8                 # delete route
		  
		  # ── Socket Statistics (ss) ────────────────────────────────────
		  ss -tuln                           # TCP+UDP listening ports (numeric)
		  ss -tulnp                          # + process names
		  ss -s                              # summary statistics
		  ss -ta                             # all TCP connections
		  ss -ua                             # all UDP connections
		  ss -tp                             # TCP + process info
		  ss -o state established            # established connections only
		  
		  # ── DNS ───────────────────────────────────────────────────────
		  cat /etc/resolv.conf               # DNS servers
		  cat /etc/hosts                     # local hostname resolution
		  host google.com                    # DNS lookup
		  nslookup google.com                # DNS lookup (interactive)
		  dig google.com                     # detailed DNS query
		  dig google.com MX                  # MX records
		  dig @8.8.8.8 google.com            # query specific DNS server
		  
		  # ── Connectivity ──────────────────────────────────────────────
		  ping -c 4 8.8.8.8                  # ICMP ping (4 packets)
		  traceroute google.com              # trace route (install: apt install traceroute)
		  mtr google.com                     # combined ping + traceroute (apt install mtr)
		  curl -I https://example.com        # HTTP headers
		  wget -q -O /dev/null https://example.com  # test download
		  nc -zv 192.168.1.1 22              # test TCP port connectivity
		  
		  # ── Legacy (net-tools — install separately) ───────────────────
		  sudo apt install net-tools
		  ifconfig                           # old interface info (use ip addr instead)
		  netstat -tuln                      # old socket info (use ss instead)
		  route -n                           # old routing table (use ip route instead)
		  ```
	- ## NetworkManager vs systemd-networkd
		- | Feature | NetworkManager | systemd-networkd |
		  |---------|---------------|-----------------|
		  | Best for | Desktops, laptops, Wi-Fi | Servers, containers, static configs |
		  | Config files | `/etc/NetworkManager/` | `/etc/systemd/network/*.network` |
		  | CLI tool | `nmcli` | `networkctl` |
		  | GUI | `nm-applet`, GNOME | None |
		  | Wi-Fi support | Excellent | Limited |
		  | DHCP | Built-in | systemd-networkd + systemd-resolved |
		  | Default on | Debian Desktop | Debian Server (minimal) |
		- ```bash
		  # NetworkManager CLI (nmcli)
		  nmcli device status                # show all devices
		  nmcli connection show              # show all connections
		  nmcli connection up "Wired connection 1"
		  nmcli connection down "Wired connection 1"
		  nmcli device wifi list             # list Wi-Fi networks
		  nmcli device wifi connect "SSID" password "password"
		  nmcli connection add type ethernet ifname eth0 con-name myconn \
		    ipv4.addresses 192.168.1.100/24 ipv4.gateway 192.168.1.1 \
		    ipv4.dns "8.8.8.8 8.8.4.4" ipv4.method manual
		  ```
	- ## Static IP with systemd-networkd
		- ```ini
		  # /etc/systemd/network/10-eth0.network
		  [Match]
		  Name=eth0
		  
		  [Network]
		  Address=192.168.1.100/24
		  Gateway=192.168.1.1
		  DNS=8.8.8.8
		  DNS=8.8.4.4
		  ```
		- ```bash
		  sudo systemctl enable --now systemd-networkd
		  sudo systemctl enable --now systemd-resolved
		  sudo networkctl status
		  ```
	- ## Static IP with /etc/network/interfaces (ifupdown — Debian classic)
		- ```ini
		  # /etc/network/interfaces
		  # The loopback network interface
		  auto lo
		  iface lo inet loopback
		  
		  # DHCP
		  auto eth0
		  iface eth0 inet dhcp
		  
		  # Static IP
		  auto eth0
		  iface eth0 inet static
		    address 192.168.1.100
		    netmask 255.255.255.0
		    gateway 192.168.1.1
		    dns-nameservers 8.8.8.8 8.8.4.4
		  ```
		- ```bash
		  sudo ifdown eth0 && sudo ifup eth0  # apply changes
		  sudo systemctl restart networking   # restart networking service
		  ```
	- ## Firewall — nftables / iptables / UFW
		- ```bash
		  # ── UFW (Uncomplicated Firewall) — easiest ────────────────────
		  sudo apt install ufw
		  sudo ufw enable                    # enable firewall
		  sudo ufw disable                   # disable firewall
		  sudo ufw status verbose            # show rules
		  sudo ufw allow 22/tcp              # allow SSH
		  sudo ufw allow 80/tcp              # allow HTTP
		  sudo ufw allow 443/tcp             # allow HTTPS
		  sudo ufw allow from 192.168.1.0/24 # allow subnet
		  sudo ufw deny 23/tcp               # deny telnet
		  sudo ufw delete allow 80/tcp       # remove rule
		  sudo ufw reset                     # reset all rules
		  sudo ufw logging on                # enable logging
		  
		  # ── nftables (modern, Debian 10+) ─────────────────────────────
		  sudo apt install nftables
		  sudo systemctl enable --now nftables
		  sudo nft list ruleset              # show all rules
		  sudo nft list tables               # list tables
		  
		  # Basic nftables config: /etc/nftables.conf
		  ```
		- ```bash
		  # /etc/nftables.conf — basic server firewall
		  #!/usr/sbin/nft -f
		  flush ruleset
		  
		  table inet filter {
		    chain input {
		      type filter hook input priority 0; policy drop;
		      iif lo accept                  # allow loopback
		      ct state established,related accept  # allow established
		      tcp dport 22 accept            # SSH
		      tcp dport 80 accept            # HTTP
		      tcp dport 443 accept           # HTTPS
		      icmp type echo-request accept  # ping
		    }
		    chain forward {
		      type filter hook forward priority 0; policy drop;
		    }
		    chain output {
		      type filter hook output priority 0; policy accept;
		    }
		  }
		  ```
	- ## SSH Setup and Hardening
		- ```bash
		  # Install OpenSSH server
		  sudo apt install openssh-server
		  sudo systemctl enable --now ssh
		  
		  # Generate SSH key pair (on client)
		  ssh-keygen -t ed25519 -C "your@email.com"
		  ssh-keygen -t rsa -b 4096 -C "your@email.com"  # RSA alternative
		  
		  # Copy public key to server
		  ssh-copy-id user@server-ip
		  # Or manually:
		  cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
		  chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
		  
		  # Connect
		  ssh user@server-ip
		  ssh -p 2222 user@server-ip         # custom port
		  ssh -i ~/.ssh/mykey user@server-ip # specific key
		  ```
		- ```ini
		  # /etc/ssh/sshd_config — hardened configuration
		  Port 2222                          # change default port
		  AddressFamily inet                 # IPv4 only (or inet6 for IPv6)
		  ListenAddress 0.0.0.0
		  
		  # Authentication
		  PermitRootLogin no                 # never allow root login
		  PasswordAuthentication no          # key-only auth (after copying key!)
		  PubkeyAuthentication yes
		  AuthorizedKeysFile .ssh/authorized_keys
		  PermitEmptyPasswords no
		  MaxAuthTries 3
		  
		  # Session
		  ClientAliveInterval 300            # disconnect idle after 5 min
		  ClientAliveCountMax 2
		  LoginGraceTime 30
		  MaxSessions 5
		  
		  # Features to disable
		  X11Forwarding no
		  AllowAgentForwarding no
		  AllowTcpForwarding no
		  ```
		- ```bash
		  # Apply SSH config changes
		  sudo sshd -t                       # test config syntax
		  sudo systemctl reload ssh          # reload (don't restart — keep sessions)
		  ```
- # Security Hardening
  collapsed:: true
	- ## AppArmor (Debian Default)
		- > [!info] AppArmor vs SELinux
		  > Debian uses **AppArmor** by default (not SELinux like Fedora/RHEL). AppArmor is profile-based — it restricts programs to specific files and capabilities. It's easier to configure than SELinux but slightly less granular.
		- ```bash
		  # Check AppArmor status
		  sudo apparmor_status
		  sudo aa-status                     # same
		  
		  # AppArmor modes per profile:
		  # enforce  → violations are blocked + logged
		  # complain → violations are logged only (learning mode)
		  # disabled → profile not loaded
		  
		  # Install AppArmor tools
		  sudo apt install apparmor apparmor-utils apparmor-profiles apparmor-profiles-extra
		  
		  # Enable AppArmor (should be enabled by default on Debian 10+)
		  sudo systemctl enable --now apparmor
		  
		  # Profile management
		  sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx    # enforce profile
		  sudo aa-complain /etc/apparmor.d/usr.sbin.nginx   # set to complain
		  sudo aa-disable /etc/apparmor.d/usr.sbin.nginx    # disable profile
		  sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx  # reload profile
		  
		  # Generate profile for a program (learning mode)
		  sudo aa-genprof /usr/bin/myapp     # interactive profile generator
		  sudo aa-logprof                    # update profiles from logs
		  
		  # View AppArmor logs
		  sudo journalctl -k | grep apparmor
		  sudo grep apparmor /var/log/kern.log
		  ```
	- ## unattended-upgrades
		- ```bash
		  # Install
		  sudo apt install unattended-upgrades apt-listchanges
		  
		  # Enable
		  sudo dpkg-reconfigure -plow unattended-upgrades
		  # Or manually:
		  sudo systemctl enable --now unattended-upgrades
		  ```
		- ```ini
		  # /etc/apt/apt.conf.d/50unattended-upgrades
		  Unattended-Upgrade::Allowed-Origins {
		    "${distro_id}:${distro_codename}";
		    "${distro_id}:${distro_codename}-security";
		    "${distro_id}ESMApps:${distro_codename}-apps-security";
		    "${distro_id}ESM:${distro_codename}-infra-security";
		  };
		  
		  // Auto-remove unused dependencies
		  Unattended-Upgrade::Remove-Unused-Dependencies "true";
		  
		  // Automatically reboot if needed (e.g., kernel update)
		  Unattended-Upgrade::Automatic-Reboot "false";
		  Unattended-Upgrade::Automatic-Reboot-Time "02:00";
		  
		  // Email notifications
		  Unattended-Upgrade::Mail "admin@example.com";
		  Unattended-Upgrade::MailReport "on-change";
		  ```
		- ```bash
		  # Test unattended-upgrades (dry run)
		  sudo unattended-upgrade --dry-run --debug
		  
		  # Check logs
		  cat /var/log/unattended-upgrades/unattended-upgrades.log
		  ```
	- ## fail2ban
		- ```bash
		  # Install
		  sudo apt install fail2ban
		  sudo systemctl enable --now fail2ban
		  
		  # Create local config (never edit jail.conf directly)
		  sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
		  sudo nano /etc/fail2ban/jail.local
		  ```
		- ```ini
		  # /etc/fail2ban/jail.local — key settings
		  [DEFAULT]
		  bantime  = 1h          # ban duration
		  findtime = 10m         # window to count failures
		  maxretry = 5           # failures before ban
		  backend  = systemd     # use journald on Debian
		  
		  [sshd]
		  enabled  = true
		  port     = 2222        # match your SSH port
		  logpath  = %(sshd_log)s
		  maxretry = 3
		  bantime  = 24h
		  
		  [nginx-http-auth]
		  enabled  = true
		  
		  [apache-auth]
		  enabled  = true
		  ```
		- ```bash
		  # fail2ban management
		  sudo fail2ban-client status            # overall status
		  sudo fail2ban-client status sshd       # SSH jail status
		  sudo fail2ban-client set sshd unbanip 1.2.3.4  # unban IP
		  sudo fail2ban-client banned            # list all banned IPs
		  sudo fail2ban-client reload            # reload config
		  
		  # View logs
		  sudo tail -f /var/log/fail2ban.log
		  ```
	- ## auditd
		- ```bash
		  # Install
		  sudo apt install auditd audispd-plugins
		  sudo systemctl enable --now auditd
		  
		  # Add audit rules
		  sudo auditctl -w /etc/passwd -p wa -k passwd_changes    # watch passwd file
		  sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes  # watch sudoers
		  sudo auditctl -w /var/log/auth.log -p wa -k auth_log    # watch auth log
		  sudo auditctl -a always,exit -F arch=b64 -S execve -k exec_commands  # log all exec
		  
		  # Persistent rules: /etc/audit/rules.d/audit.rules
		  sudo nano /etc/audit/rules.d/audit.rules
		  
		  # Search audit logs
		  sudo ausearch -k passwd_changes     # search by key
		  sudo ausearch -m USER_LOGIN         # search by message type
		  sudo ausearch -ui 1000              # search by UID
		  sudo aureport --summary             # summary report
		  sudo aureport --auth                # authentication report
		  sudo aureport --login               # login report
		  ```
	- ## AIDE (File Integrity Monitoring)
		- ```bash
		  # Install
		  sudo apt install aide aide-common
		  
		  # Initialize database (takes a few minutes)
		  sudo aideinit
		  sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
		  
		  # Run integrity check
		  sudo aide --check
		  
		  # Update database after legitimate changes
		  sudo aide --update
		  sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db
		  
		  # Automate with cron
		  echo "0 3 * * * root /usr/bin/aide --check | mail -s 'AIDE Report' admin@example.com" | \
		    sudo tee /etc/cron.d/aide-check
		  ```
	- ## Lynis Security Audit
		- ```bash
		  # Install
		  sudo apt install lynis
		  
		  # Run full system audit
		  sudo lynis audit system
		  
		  # Run specific tests
		  sudo lynis audit system --tests-from-group authentication
		  sudo lynis audit system --tests-from-group networking
		  
		  # View report
		  cat /var/log/lynis.log
		  cat /var/log/lynis-report.dat
		  
		  # Lynis hardening index: aim for 80+
		  grep "hardening_index" /var/log/lynis-report.dat
		  ```
	- ## Privilege Escalation Checks
		- ```bash
		  # Find SUID/SGID binaries (potential escalation vectors)
		  find / -perm -4000 -type f 2>/dev/null   # SUID files
		  find / -perm -2000 -type f 2>/dev/null   # SGID files
		  find / -perm -6000 -type f 2>/dev/null   # SUID + SGID
		  
		  # Find world-writable files
		  find / -perm -0002 -type f 2>/dev/null
		  find / -perm -0002 -type d 2>/dev/null   # world-writable dirs
		  
		  # Check sudo permissions
		  sudo -l                            # what can current user sudo?
		  
		  # Check cron jobs
		  crontab -l                         # current user's cron
		  sudo crontab -l                    # root's cron
		  ls -la /etc/cron*                  # system cron jobs
		  cat /etc/crontab
		  
		  # Check running services
		  systemctl list-units --type=service --state=running
		  
		  # Check open ports
		  ss -tulnp
		  
		  # Check for unpatched packages
		  sudo apt list --upgradable 2>/dev/null | grep -i security
		  ```
- # Debian Server Setup
  collapsed:: true
	- ## LAMP Stack (Apache + MySQL + PHP)
		- ```bash
		  # ── Apache ────────────────────────────────────────────────────
		  sudo apt install apache2
		  sudo systemctl enable --now apache2
		  
		  # Apache management
		  sudo a2ensite mysite.conf          # enable virtual host
		  sudo a2dissite 000-default.conf    # disable default site
		  sudo a2enmod rewrite               # enable mod_rewrite
		  sudo a2enmod ssl                   # enable SSL module
		  sudo a2dismod status               # disable status module
		  sudo apache2ctl configtest         # test config syntax
		  sudo systemctl reload apache2      # reload after config changes
		  
		  # ── MySQL / MariaDB ───────────────────────────────────────────
		  sudo apt install mariadb-server mariadb-client
		  sudo systemctl enable --now mariadb
		  sudo mysql_secure_installation     # secure the installation (run this!)
		  
		  # MySQL basics
		  sudo mysql -u root -p              # login as root
		  mysql -u dbuser -p mydb           # login as user
		  
		  # Inside MySQL:
		  # CREATE DATABASE myapp;
		  # CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'password';
		  # GRANT ALL PRIVILEGES ON myapp.* TO 'myuser'@'localhost';
		  # FLUSH PRIVILEGES;
		  # SHOW DATABASES;
		  # EXIT;
		  
		  # ── PHP ───────────────────────────────────────────────────────
		  sudo apt install php php-mysql php-cli php-curl php-gd php-mbstring \
		    php-xml php-zip php-bcmath php-json libapache2-mod-php
		  
		  # Check PHP version
		  php -v
		  php -m                             # list loaded modules
		  
		  # PHP config
		  sudo nano /etc/php/8.2/apache2/php.ini
		  # Key settings:
		  # upload_max_filesize = 64M
		  # post_max_size = 64M
		  # memory_limit = 256M
		  # max_execution_time = 300
		  
		  sudo systemctl restart apache2
		  ```
	- ## Apache Virtual Host
		- ```ini
		  # /etc/apache2/sites-available/example.com.conf
		  <VirtualHost *:80>
		    ServerName example.com
		    ServerAlias www.example.com
		    DocumentRoot /var/www/example.com/public
		    
		    <Directory /var/www/example.com/public>
		      AllowOverride All
		      Require all granted
		    </Directory>
		    
		    ErrorLog ${APACHE_LOG_DIR}/example.com-error.log
		    CustomLog ${APACHE_LOG_DIR}/example.com-access.log combined
		  </VirtualHost>
		  ```
		- ```bash
		  sudo mkdir -p /var/www/example.com/public
		  sudo chown -R www-data:www-data /var/www/example.com/
		  sudo a2ensite example.com.conf
		  sudo apache2ctl configtest
		  sudo systemctl reload apache2
		  ```
	- ## Nginx Setup
		- ```bash
		  sudo apt install nginx
		  sudo systemctl enable --now nginx
		  
		  # Nginx management
		  sudo nginx -t                      # test config
		  sudo nginx -s reload               # reload config
		  sudo systemctl reload nginx        # same via systemd
		  ```
		- ```ini
		  # /etc/nginx/sites-available/example.com
		  server {
		    listen 80;
		    server_name example.com www.example.com;
		    root /var/www/example.com/public;
		    index index.html index.php;
		    
		    access_log /var/log/nginx/example.com-access.log;
		    error_log  /var/log/nginx/example.com-error.log;
		    
		    location / {
		      try_files $uri $uri/ /index.php?$query_string;
		    }
		    
		    location ~ \.php$ {
		      include snippets/fastcgi-php.conf;
		      fastcgi_pass unix:/run/php/php8.2-fpm.sock;
		    }
		    
		    location ~ /\.ht {
		      deny all;
		    }
		  }
		  ```
		- ```bash
		  sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
		  sudo nginx -t
		  sudo systemctl reload nginx
		  ```
	- ## PostgreSQL
		- ```bash
		  sudo apt install postgresql postgresql-contrib
		  sudo systemctl enable --now postgresql
		  
		  # Switch to postgres user
		  sudo -u postgres psql              # open psql shell
		  
		  # Inside psql:
		  # CREATE DATABASE myapp;
		  # CREATE USER myuser WITH ENCRYPTED PASSWORD 'password';
		  # GRANT ALL PRIVILEGES ON DATABASE myapp TO myuser;
		  # \l    → list databases
		  # \du   → list users
		  # \q    → quit
		  
		  # Connect as specific user
		  psql -U myuser -d myapp -h localhost
		  
		  # PostgreSQL config files
		  # /etc/postgresql/15/main/postgresql.conf  → main config
		  # /etc/postgresql/15/main/pg_hba.conf      → client auth
		  ```
	- ## Let's Encrypt (Certbot)
		- ```bash
		  # Install certbot
		  sudo apt install certbot
		  
		  # For Apache
		  sudo apt install python3-certbot-apache
		  sudo certbot --apache -d example.com -d www.example.com
		  
		  # For Nginx
		  sudo apt install python3-certbot-nginx
		  sudo certbot --nginx -d example.com -d www.example.com
		  
		  # Standalone (no web server running)
		  sudo certbot certonly --standalone -d example.com
		  
		  # Test renewal
		  sudo certbot renew --dry-run
		  
		  # Certificates stored at:
		  # /etc/letsencrypt/live/example.com/fullchain.pem
		  # /etc/letsencrypt/live/example.com/privkey.pem
		  
		  # Auto-renewal (certbot installs a systemd timer automatically)
		  sudo systemctl status certbot.timer
		  sudo systemctl list-timers | grep certbot
		  ```
	- ## Nginx HTTPS Virtual Host (after certbot)
		- ```ini
		  # /etc/nginx/sites-available/example.com (HTTPS)
		  server {
		    listen 80;
		    server_name example.com www.example.com;
		    return 301 https://$host$request_uri;  # redirect HTTP → HTTPS
		  }
		  
		  server {
		    listen 443 ssl http2;
		    server_name example.com www.example.com;
		    root /var/www/example.com/public;
		    
		    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
		    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
		    ssl_protocols       TLSv1.2 TLSv1.3;
		    ssl_ciphers         HIGH:!aNULL:!MD5;
		    
		    # Security headers
		    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
		    add_header X-Frame-Options DENY;
		    add_header X-Content-Type-Options nosniff;
		    add_header X-XSS-Protection "1; mode=block";
		    
		    location / {
		      try_files $uri $uri/ /index.php?$query_string;
		    }
		  }
		  ```
- # Debian Stable vs Testing vs Sid
  collapsed:: true
	- ## Release Flow Diagram
		- ```mermaid
		  graph LR
		    EXP["🧪 Experimental\nHighly unstable\npre-upload testing"]
		    SID["🔴 Unstable (Sid)\nAlways 'sid'\nNew packages land here\nNo freeze ever"]
		    TEST["🟡 Testing (trixie)\nMigrates from Sid\nafter 10 days + no RC bugs\nFreezes before release"]
		    STABLE["🟢 Stable (bookworm)\nFrozen, thoroughly tested\nSecurity updates only\n~2 year release cycle"]
		    OLDSTABLE["📦 Oldstable (bullseye)\nPrevious stable\nLTS security support\n~1 year after new stable"]
		    ARCHIVE["🗄️ Archive\nEnd of Life\ndeb.debian.org/debian-archive"]
		    
		    EXP -->|"developer uploads"| SID
		    SID -->|"10 days + RC bug free"| TEST
		    TEST -->|"freeze → full release"| STABLE
		    STABLE -->|"next release"| OLDSTABLE
		    OLDSTABLE -->|"EOL"| ARCHIVE
		  ```
	- ## When to Use Each Branch
		- | Branch | Stability | Package Age | Use Case | Risk |
		  |--------|-----------|-------------|----------|------|
		  | Stable | ★★★★★ | 1-2 years old | Production servers, critical systems | Very low |
		  | Oldstable | ★★★★★ | 2-3 years old | Legacy systems, extended support | Very low |
		  | Testing | ★★★☆☆ | Weeks-months old | Developer workstations, pre-production | Medium |
		  | Unstable (Sid) | ★★☆☆☆ | Days-weeks old | Package development, bleeding edge | High |
		  | Experimental | ★☆☆☆☆ | Hours-days old | Package developers only | Very high |
	- ## Stable Branch
		- ```bash
		  # /etc/apt/sources.list for Stable (Bookworm)
		  deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
		  deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
		  deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
		  
		  # Pros: rock-solid, security patches, predictable
		  # Cons: older packages (e.g., PHP 8.2, Python 3.11, Node 18 in bookworm)
		  # Solution for newer packages: use backports or Docker containers
		  ```
	- ## Testing Branch
		- ```bash
		  # /etc/apt/sources.list for Testing (Trixie)
		  deb http://deb.debian.org/debian trixie main contrib non-free non-free-firmware
		  deb http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
		  deb http://deb.debian.org/debian trixie-updates main contrib non-free non-free-firmware
		  
		  # Pros: newer packages, still reasonably stable
		  # Cons: occasional breakage, especially during freeze transitions
		  # Note: during freeze, Testing gets very stable (good time to use it)
		  ```
	- ## Unstable (Sid)
		- ```bash
		  # /etc/apt/sources.list for Sid
		  deb http://deb.debian.org/debian sid main contrib non-free non-free-firmware
		  
		  # Pros: latest packages, same as what Debian developers use
		  # Cons: can break at any time, no security team support (packages updated directly)
		  # Note: "Sid" = "Still In Development" — named after the destructive kid in Toy Story
		  ```
	- ## Mixing Branches with Pinning
		- > [!tip] Safe Mixing Strategy
		  > The safest way to get newer packages on Stable is to use **backports**, not to mix Testing/Sid directly. If you must mix, use APT pinning to keep Stable as the default and only pull specific packages from Testing/Sid.
		- ```ini
		  # /etc/apt/sources.list — Stable + Testing mix (use with caution)
		  deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
		  deb http://security.debian.org/debian-security bookworm-security main
		  deb http://deb.debian.org/debian bookworm-updates main
		  deb http://deb.debian.org/debian trixie main contrib non-free non-free-firmware
		  ```
		- ```ini
		  # /etc/apt/preferences.d/stable-priority
		  # Keep Stable as default (high priority)
		  Package: *
		  Pin: release a=bookworm
		  Pin-Priority: 900
		  
		  # Testing is low priority (only install explicitly)
		  Package: *
		  Pin: release a=trixie
		  Pin-Priority: 100
		  ```
		- ```bash
		  # Install specific package from Testing
		  sudo apt install -t trixie package-name
		  
		  # Check which version would be installed
		  apt-cache policy package-name
		  ```
	- ## Upgrading Between Releases
		- ```bash
		  # Upgrade from Bullseye (11) to Bookworm (12)
		  
		  # Step 1: Fully update current system
		  sudo apt update && sudo apt upgrade -y && sudo apt full-upgrade -y
		  
		  # Step 2: Update sources.list
		  sudo sed -i 's/bullseye/bookworm/g' /etc/apt/sources.list
		  sudo sed -i 's/bullseye/bookworm/g' /etc/apt/sources.list.d/*.list 2>/dev/null
		  
		  # Step 3: Update and do the upgrade
		  sudo apt update
		  sudo apt upgrade -y
		  sudo apt full-upgrade -y
		  
		  # Step 4: Clean up
		  sudo apt autoremove --purge
		  sudo apt clean
		  
		  # Step 5: Reboot
		  sudo reboot
		  
		  # Verify
		  lsb_release -a
		  uname -r
		  ```
- # More Learn
	- ## Official Documentation
		- [Debian Official Website](https://www.debian.org) — downloads, news, project info
		- [Debian Wiki](https://wiki.debian.org) — comprehensive community wiki, best reference for Debian-specific topics
		- [Debian Administrator's Handbook](https://debian-handbook.info) — free online book, covers everything from install to advanced admin
		- [Debian Reference Manual](https://www.debian.org/doc/manuals/debian-reference/) — official reference for Debian users
		- [Debian Installation Guide](https://www.debian.org/releases/stable/installmanual) — official step-by-step installation guide
		- [Debian Security Advisories (DSA)](https://www.debian.org/security/) — official security announcements
		- [Debian Packages Search](https://packages.debian.org) — search all Debian packages
		- [Debian Bug Tracker](https://bugs.debian.org) — report and track bugs
		- [Debian Release Notes](https://www.debian.org/releases/stable/releasenotes) — what changed between releases
	- ## YouTube Playlists
		- [Learn Linux TV — Debian Linux](https://www.youtube.com/@LearnLinuxTV) — practical Debian tutorials for beginners and admins
		- [NetworkChuck — Linux for Hackers](https://www.youtube.com/@NetworkChuck) — Linux fundamentals with Debian/Ubuntu focus
		- [Chris Titus Tech — Linux](https://www.youtube.com/@ChrisTitusTech) — Debian, server setup, and Linux tips
		- [The Linux Experiment](https://www.youtube.com/@TheLinuxExperiment) — Debian desktop and distro comparisons
	- ## Community & Forums
		- [Debian Forums](https://forums.debian.net) — official community forums
		- [r/debian](https://www.reddit.com/r/debian/) — Reddit community
		- [Debian Mailing Lists](https://lists.debian.org) — official mailing lists (debian-user, debian-security, etc.)
		- [IRC: #debian on Libera.Chat](https://www.debian.org/support) — real-time community support
	- ## Useful Tools & References
		- [Debian Backports](https://backports.debian.org) — newer packages for Debian Stable
		- [Debian Security Tracker](https://security-tracker.debian.org) — CVE tracking for Debian packages
		- [Repology](https://repology.org) — compare package versions across distros
		- [DistroWatch — Debian](https://distrowatch.com/debian) — release history and news