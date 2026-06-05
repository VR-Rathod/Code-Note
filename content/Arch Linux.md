---
seoTitle: Arch Linux Complete Guide – pacman, AUR, Installation & Administration
description: "Comprehensive Arch Linux reference covering installation, pacman, AUR, systemd, kernel management, desktop environments, security hardening, and system maintenance."
keywords: "Arch Linux, arch linux guide, arch linux tutorial, pacman, AUR, arch linux installation, arch linux commands, arch linux notes, arch linux administration, arch linux security, yay, paru, PKGBUILD, arch linux kernel, arch linux desktop, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Arch Linux – Complete Guide
treeTitle: OS - Linux Distros - Arch Linux
enableToc: true
---

- # History
  collapsed:: true
	- ## Origin
		- Arch Linux was created by **Judd Vinet**, a Canadian programmer, and first released on **March 11, 2002**.
		- Inspired by **CRUX** — a lightweight, x86-optimized Linux distribution — Judd wanted something simpler and more elegant.
		- The name "Arch" comes from the word *architecture* — reflecting the goal of a clean, well-structured system.
		- Arch was designed around the **KISS principle** — "Keep It Simple, Stupid" — meaning the system should be simple in design, not necessarily simple to use.
	- ## The KISS Philosophy
		- ```
		  KISS = Keep It Simple, Stupid
		  
		  Arch's interpretation:
		    - No GUI installers (historically)
		    - No auto-configuration tools
		    - No unnecessary abstractions
		    - User builds the system from scratch
		    - Every component is chosen deliberately
		    - Documentation over automation
		  ```
		- This philosophy makes Arch powerful for those who understand it — and intimidating for those who don't.
	- ## Leadership Transition
		- In **2007**, Judd Vinet stepped down and handed the project to **Aaron Griffin** (aka phrakture).
		- Aaron led the project through major growth — the AUR expanded, the community grew, and Arch became a reference distro.
		- In **2020**, **Levente Polyak** (aka anthraxx) became the current project lead.
		- Arch is maintained by a small team of **Trusted Users (TUs)** and **developers** — entirely volunteer-driven.
	- ## Key Milestones
		- ```
		  2002  → First release by Judd Vinet
		  2006  → pacman 3.0 released (major rewrite)
		  2007  → Aaron Griffin takes over
		  2012  → systemd adopted as init system
		  2017  → x86_64 only (dropped i686 support)
		  2020  → Levente Polyak becomes lead; zsh becomes default shell
		  2021  → archinstall guided installer added to ISO
		  2022  → 20th anniversary; linux-zen added to official repos
		  2024  → Arch continues as the gold standard rolling-release distro
		  ```
-
- # Introduction
  collapsed:: true
	- ## What is Arch Linux?
		- Arch Linux is a **rolling-release**, **x86_64** Linux distribution built around simplicity, minimalism, and user control.
		- Unlike Ubuntu or Fedora, Arch ships **no desktop environment, no GUI tools, no pre-configured services** — you build exactly what you want.
		- Uses **pacman** as its package manager and the **AUR (Arch User Repository)** for community packages.
		- Rolling release means there are **no version numbers** — you install once and update forever.
		- The **Arch Wiki** is considered the best Linux documentation resource on the internet — used by users of all distros.
	- ## The Arch Way
		- ```
		  The Arch Way (core principles):
		  
		  1. Simplicity
		     - Avoid unnecessary additions or modifications
		     - Ship software as upstream intended
		     - Minimal default configuration
		  
		  2. Modernity
		     - Latest stable software versions
		     - Rolling release — always current
		     - Embraces modern Linux features (systemd, Wayland, etc.)
		  
		  3. Pragmatism
		     - Principles serve users, not ideology
		     - Both free and non-free software available
		     - Practical solutions over dogma
		  
		  4. User-Centricity
		     - Designed for the user who wants control
		     - Requires reading documentation
		     - "Do It Yourself" — you configure everything
		  
		  5. Versatility
		     - General-purpose: desktop, server, embedded
		     - No forced defaults — every choice is yours
		  ```
	- ## Arch vs Ubuntu vs Fedora vs Debian
		- | Feature | Arch Linux | Ubuntu | Fedora | Debian |
		  |---------|-----------|--------|--------|--------|
		  | Release model | Rolling | Fixed (LTS + interim) | Fixed (~6 months) | Fixed (stable/testing/sid) |
		  | Package manager | pacman + AUR | apt + Snap | dnf + Flatpak | apt |
		  | Default DE | None | GNOME | GNOME | None (or GNOME) |
		  | Install difficulty | Hard (manual) | Easy (GUI) | Easy (GUI) | Medium |
		  | Stability | Cutting-edge | Stable (LTS) | Cutting-edge | Very stable |
		  | Package freshness | Latest | Older (LTS) | Recent | Older (stable) |
		  | Init system | systemd | systemd | systemd | systemd |
		  | Target user | Advanced users | Beginners/general | Developers | Servers/stability |
		  | Documentation | Arch Wiki (best) | Ubuntu Docs | Fedora Docs | Debian Handbook |
		  | Community packages | AUR (huge) | PPAs | COPR | Backports |
		  | Base install size | ~800 MB | ~2.5 GB | ~2 GB | ~1 GB |
		  | Related pages | — | [[Ubuntu]] | [[Fedora]] | [[Debian]] |
	- ## Advantages
		- Latest software always available, complete control over every component, AUR gives access to virtually any Linux software, rolling release means no major version upgrades, minimal bloat (you install only what you need), excellent documentation (Arch Wiki), deep learning experience, pacman is fast and simple, strong community, Arch-based distros (Manjaro, EndeavourOS, Garuda) inherit these benefits.
	- ## Disadvantages
		- Steep learning curve, time-consuming initial setup, rolling release can occasionally break things, no official GUI installer (historically), requires regular maintenance and attention, not suitable for production servers without extra care, partial upgrades can break the system.
	- > [!warning]
	  > Arch Linux is **not for beginners**. It requires comfort with the command line, reading documentation, and troubleshooting. If you want an Arch-like experience with guardrails, consider [[Garuda Linux]] or EndeavourOS first.
	- ## Use Cases
		- Power user desktops, development workstations, learning Linux internals deeply, custom minimal servers, penetration testing base (BlackArch), tiling WM setups (i3, Sway, Hyprland), home lab environments.
	- ## Arch-Based Distributions
		- | Distro | Focus | Installer | Extra |
		  |--------|-------|-----------|-------|
		  | Manjaro | Beginner-friendly Arch | GUI (Calamares) | Delayed packages, own repos |
		  | EndeavourOS | Near-vanilla Arch | GUI (Calamares) | Minimal additions, community-focused |
		  | [[Garuda Linux]] | Gaming + performance | GUI (Calamares) | linux-zen, Btrfs snapshots, Chaotic-AUR |
		  | BlackArch | Penetration testing | Manual/script | 2800+ security tools |
		  | ArcoLinux | Learning Arch | GUI | Educational focus |
		  | CachyOS | Performance-optimized | GUI | Custom kernel, BORE scheduler |
		  | Parabola | 100% free software | Manual | FSF-endorsed |
-
- # Installation
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum:
		    CPU:   x86_64 (64-bit only — i686 dropped in 2017)
		    RAM:   512 MB (2 GB recommended for desktop)
		    Disk:  2 GB minimum (20 GB+ recommended)
		    Boot:  UEFI or BIOS/Legacy
		    Net:   Required during installation
		  
		  Recommended for Desktop:
		    CPU:   Multi-core 64-bit
		    RAM:   8 GB+
		    Disk:  SSD 50 GB+
		  ```
	- ## Creating Bootable USB
		- ```bash
		  # Download ISO from: https://archlinux.org/download/
		  # Verify signature (important!)
		  gpg --keyserver-options auto-key-retrieve --verify archlinux-*.iso.sig
		  
		  # Linux — using dd
		  sudo dd if=archlinux-*.iso of=/dev/sdX bs=4M status=progress oflag=sync
		  
		  # Using Ventoy (multi-boot, recommended)
		  # Just copy the ISO to the Ventoy USB
		  
		  # Windows — use Rufus in DD mode (NOT ISO mode)
		  ```
	- ## Two Installation Paths
		- ```
		  Option A: archinstall (guided script) — easier, added in 2021
		    - Interactive menu-driven installer
		    - Handles partitioning, locale, bootloader, DE
		    - Good for learning without full manual pain
		  
		  Option B: Manual installation — the traditional Arch way
		    - Full control over every step
		    - Teaches you exactly how Linux works
		    - Required reading: wiki.archlinux.org/title/Installation_guide
		  ```
	- ## archinstall (Guided Script)
		- ```bash
		  # Boot the Arch ISO, then:
		  archinstall
		  
		  # Interactive menu covers:
		  #   - Mirror region
		  #   - Locale & keyboard
		  #   - Disk layout (auto or manual)
		  #   - Filesystem (ext4, Btrfs, XFS)
		  #   - Bootloader (GRUB or systemd-boot)
		  #   - Hostname
		  #   - Root password
		  #   - User account
		  #   - Desktop environment (optional)
		  #   - Audio server (PipeWire/PulseAudio)
		  #   - Network manager
		  #   - Additional packages
		  ```
	- ## Manual Installation — Step by Step
		- ### Step 1: Boot & Connect to Internet
			- ```bash
			  # Verify boot mode (UEFI vs BIOS)
			  ls /sys/firmware/efi/efivars   # exists = UEFI boot
			  
			  # Connect to WiFi (if needed)
			  iwctl
			  # Inside iwctl:
			  device list
			  station wlan0 scan
			  station wlan0 get-networks
			  station wlan0 connect "SSID"
			  exit
			  
			  # Verify internet
			  ping -c 3 archlinux.org
			  
			  # Update system clock
			  timedatectl set-ntp true
			  timedatectl status
			  ```
		- ### Step 2: Partition the Disk
			- ```bash
			  # List disks
			  lsblk
			  fdisk -l
			  
			  # Partition with fdisk (BIOS/MBR) or gdisk (UEFI/GPT)
			  # For UEFI (recommended):
			  gdisk /dev/sda
			  # or
			  fdisk /dev/sda
			  
			  # Recommended UEFI partition layout:
			  # /dev/sda1  → EFI System Partition  512MB   type: EFI System (ef00)
			  # /dev/sda2  → swap                  2-8GB   type: Linux swap (8200)
			  # /dev/sda3  → root /                rest    type: Linux filesystem (8300)
			  
			  # Recommended BIOS/MBR layout:
			  # /dev/sda1  → /boot                 512MB   bootable flag
			  # /dev/sda2  → swap                  2-8GB
			  # /dev/sda3  → root /                rest
			  
			  # Using cfdisk (easier TUI):
			  cfdisk /dev/sda
			  ```
		- ### Step 3: Format Partitions
			- ```bash
			  # Format EFI partition (UEFI only)
			  mkfs.fat -F32 /dev/sda1
			  
			  # Format swap
			  mkswap /dev/sda2
			  swapon /dev/sda2
			  
			  # Format root — choose filesystem:
			  mkfs.ext4 /dev/sda3          # ext4 (traditional, stable)
			  # OR
			  mkfs.btrfs /dev/sda3         # Btrfs (snapshots, CoW)
			  # OR
			  mkfs.xfs /dev/sda3           # XFS (high performance)
			  ```
		- ### Step 4: Mount Partitions
			- ```bash
			  # Mount root
			  mount /dev/sda3 /mnt
			  
			  # Create and mount EFI (UEFI systems)
			  mkdir -p /mnt/boot/efi
			  mount /dev/sda1 /mnt/boot/efi
			  
			  # Verify mounts
			  lsblk
			  ```
		- ### Step 5: Install Base System
			- ```bash
			  # Install base packages (pacstrap)
			  pacstrap -K /mnt base linux linux-firmware
			  
			  # Recommended extras to include:
			  pacstrap -K /mnt base linux linux-firmware \
			    linux-headers \
			    base-devel \
			    networkmanager \
			    grub \
			    efibootmgr \
			    vim \
			    nano \
			    git \
			    sudo \
			    man-db \
			    man-pages \
			    texinfo
			  
			  # base        → minimal Arch system
			  # linux       → kernel
			  # linux-firmware → hardware firmware blobs
			  # base-devel  → build tools (gcc, make, etc.) — needed for AUR
			  ```
		- ### Step 6: Generate fstab
			- ```bash
			  # Generate filesystem table
			  genfstab -U /mnt >> /mnt/etc/fstab
			  
			  # Verify it looks correct
			  cat /mnt/etc/fstab
			  # Should show UUID-based entries for /, /boot/efi, swap
			  ```
		- ### Step 7: Chroot into New System
			- ```bash
			  # Change root into the new system
			  arch-chroot /mnt
			  
			  # You are now inside your new Arch installation
			  # Prompt changes to [root@archiso /]#
			  ```
		- ### Step 8: Timezone & Locale
			- ```bash
			  # Set timezone
			  ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime
			  # Replace Asia/Kolkata with your zone: America/New_York, Europe/London, etc.
			  
			  # Sync hardware clock
			  hwclock --systohc
			  
			  # Set locale — edit /etc/locale.gen
			  nano /etc/locale.gen
			  # Uncomment your locale, e.g.:
			  # en_US.UTF-8 UTF-8
			  
			  # Generate locales
			  locale-gen
			  
			  # Set default locale
			  echo "LANG=en_US.UTF-8" > /etc/locale.conf
			  
			  # Set keyboard layout (if changed during install)
			  echo "KEYMAP=us" > /etc/vconsole.conf
			  ```
		- ### Step 9: Hostname & Hosts
			- ```bash
			  # Set hostname
			  echo "myarchbox" > /etc/hostname
			  
			  # Configure /etc/hosts
			  cat >> /etc/hosts << EOF
			  127.0.0.1   localhost
			  ::1         localhost
			  127.0.1.1   myarchbox.localdomain myarchbox
			  EOF
			  ```
		- ### Step 10: Root Password & User
			- ```bash
			  # Set root password
			  passwd
			  
			  # Create a regular user
			  useradd -m -G wheel -s /bin/bash username
			  passwd username
			  
			  # Enable sudo for wheel group
			  EDITOR=nano visudo
			  # Uncomment: %wheel ALL=(ALL:ALL) ALL
			  ```
		- ### Step 11: Install Bootloader
			- ```bash
			  # === GRUB (UEFI) ===
			  pacman -S grub efibootmgr
			  grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ARCH
			  grub-mkconfig -o /boot/grub/grub.cfg
			  
			  # === GRUB (BIOS/MBR) ===
			  pacman -S grub
			  grub-install --target=i386-pc /dev/sda
			  grub-mkconfig -o /boot/grub/grub.cfg
			  
			  # === systemd-boot (UEFI only — simpler alternative) ===
			  bootctl install
			  # Create /boot/loader/loader.conf:
			  cat > /boot/loader/loader.conf << EOF
			  default arch.conf
			  timeout 3
			  console-mode max
			  editor no
			  EOF
			  # Create /boot/loader/entries/arch.conf:
			  cat > /boot/loader/entries/arch.conf << EOF
			  title   Arch Linux
			  linux   /vmlinuz-linux
			  initrd  /initramfs-linux.img
			  options root=UUID=$(blkid -s UUID -o value /dev/sda3) rw quiet
			  EOF
			  ```
		- ### Step 12: Enable NetworkManager & Reboot
			- ```bash
			  # Enable NetworkManager to start on boot
			  systemctl enable NetworkManager
			  
			  # Exit chroot
			  exit
			  
			  # Unmount all partitions
			  umount -R /mnt
			  
			  # Reboot
			  reboot
			  # Remove USB when screen goes blank
			  ```
	- ## Post-Install Essentials
		- ```bash
		  # After first boot, login as your user
		  
		  # Connect to WiFi
		  nmcli device wifi list
		  nmcli device wifi connect "SSID" password "password"
		  
		  # Full system update
		  sudo pacman -Syu
		  
		  # Install yay (AUR helper) — see AUR section
		  sudo pacman -S --needed git base-devel
		  git clone https://aur.archlinux.org/yay.git
		  cd yay && makepkg -si
		  
		  # Install a desktop environment (optional — see DE section)
		  sudo pacman -S gnome gnome-extra gdm
		  sudo systemctl enable gdm
		  ```
-
- # Kernel & Architecture
  collapsed:: true
	- ## Available Kernels
		- ```bash
		  # Official kernels in Arch repos:
		  linux           → latest stable kernel (default)
		  linux-lts       → long-term support kernel (more stable)
		  linux-zen       → optimized for desktop/gaming (lower latency)
		  linux-hardened  → security-hardened kernel (stricter)
		  
		  # Install multiple kernels (recommended — fallback safety)
		  sudo pacman -S linux linux-lts linux-headers linux-lts-headers
		  
		  # Check current kernel
		  uname -r
		  uname -a
		  
		  # List installed kernels
		  ls /boot/vmlinuz*
		  pacman -Q linux linux-lts linux-zen
		  ```
	- ## Kernel Comparison
		- | Kernel | Use Case | Latency | Stability | Notes |
		  |--------|----------|---------|-----------|-------|
		  | linux | General use | Normal | Good | Always latest upstream |
		  | linux-lts | Servers, stability | Normal | Best | Longer support cycle |
		  | linux-zen | Desktop, gaming | Low | Good | BORE scheduler, responsiveness |
		  | linux-hardened | Security-focused | Higher | Good | Stricter security policies |
	- ## Boot Process
		- ```mermaid
		  flowchart TD
		      A[Power On] --> B[UEFI/BIOS POST]
		      B --> C{Boot Mode}
		      C -->|UEFI| D[EFI System Partition\n/boot/efi]
		      C -->|BIOS| E[MBR on disk]
		      D --> F[GRUB2 or systemd-boot]
		      E --> F
		      F --> G[Load vmlinuz kernel\n+ initramfs]
		      G --> H[Kernel decompresses\nand initializes hardware]
		      H --> I[mkinitcpio initramfs\nmounts early root]
		      I --> J[systemd PID 1 starts]
		      J --> K[sysinit.target]
		      K --> L[basic.target]
		      L --> M{Boot target}
		      M -->|CLI| N[multi-user.target\nTTY login]
		      M -->|GUI| O[graphical.target\nDisplay Manager]
		      O --> P[GDM / SDDM / LightDM]
		      P --> Q[Desktop Environment\nor Window Manager]
		  ```
	- ## mkinitcpio
		- ```bash
		  # mkinitcpio generates the initial RAM filesystem (initramfs)
		  # Config: /etc/mkinitcpio.conf
		  
		  # Key sections in mkinitcpio.conf:
		  MODULES=(btrfs)          # kernel modules to include early
		  BINARIES=()              # extra binaries
		  FILES=()                 # extra files
		  HOOKS=(base udev autodetect modconf kms keyboard keymap consolefont
		         block filesystems fsck)
		  
		  # Regenerate initramfs after kernel or config changes
		  sudo mkinitcpio -P          # regenerate for ALL installed kernels
		  sudo mkinitcpio -p linux    # regenerate for linux kernel only
		  sudo mkinitcpio -p linux-lts
		  
		  # List presets
		  ls /etc/mkinitcpio.d/
		  ```
	- ## Linux File System Hierarchy (FHS)
		- ```
		  /           Root filesystem
		  ├── /bin    → symlink to /usr/bin (UsrMerge)
		  ├── /boot   Kernel (vmlinuz), initramfs, bootloader
		  │   └── /boot/efi   EFI System Partition (UEFI)
		  ├── /dev    Device files (block, char, pseudo)
		  ├── /etc    System-wide configuration files
		  ├── /home   User home directories (/home/username)
		  ├── /lib    → symlink to /usr/lib
		  ├── /lib64  → symlink to /usr/lib
		  ├── /media  Auto-mount removable media (USB, CD)
		  ├── /mnt    Temporary manual mount point
		  ├── /opt    Optional/third-party software
		  ├── /proc   Virtual FS: process and kernel info
		  ├── /root   Root user's home directory
		  ├── /run    Runtime data (cleared on reboot, tmpfs)
		  ├── /sbin   → symlink to /usr/bin
		  ├── /srv    Data served by system services
		  ├── /sys    Virtual FS: hardware/driver/kernel info
		  ├── /tmp    Temporary files (tmpfs — in RAM)
		  ├── /usr    All user programs, libraries, docs
		  │   ├── /usr/bin    User + admin commands
		  │   ├── /usr/lib    Shared libraries
		  │   ├── /usr/local  Locally compiled software
		  │   ├── /usr/share  Architecture-independent data
		  │   └── /usr/src    Kernel source (if installed)
		  └── /var    Variable data
		      ├── /var/cache/pacman   pacman package cache
		      ├── /var/log            System logs
		      └── /var/lib            Persistent app data
		  ```
	- ## GRUB2 Management
		- ```bash
		  # Regenerate GRUB config (after kernel update or config change)
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # Edit GRUB defaults
		  sudo nano /etc/default/grub
		  # Key options:
		  # GRUB_DEFAULT=0                  → default entry (0=first)
		  # GRUB_TIMEOUT=5                  → seconds to show menu
		  # GRUB_CMDLINE_LINUX_DEFAULT="quiet loglevel=3"
		  # GRUB_CMDLINE_LINUX=""           → extra kernel params
		  
		  # After editing /etc/default/grub, regenerate:
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # Install GRUB to disk (only needed once or after reinstall)
		  sudo grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ARCH
		  
		  # os-prober (detect other OSes like Windows)
		  sudo pacman -S os-prober
		  # Enable in /etc/default/grub:
		  # GRUB_DISABLE_OS_PROBER=false
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  ```
-
- # Pacman Package Manager
  collapsed:: true
	- ## What is pacman?
		- **pacman** is Arch Linux's native package manager — fast, simple, and powerful.
		- Manages packages from the **official repositories**: core, extra, multilib.
		- Config: `/etc/pacman.conf` | Mirror list: `/etc/pacman.d/mirrorlist`
		- Package format: `.pkg.tar.zst` (zstd-compressed tarballs)
	- ## pacman Flow Diagram
		- ```mermaid
		  flowchart LR
		      A[User runs\npacman -S pkg] --> B[Read /etc/pacman.conf]
		      B --> C[Check mirrorlist\n/etc/pacman.d/mirrorlist]
		      C --> D[Download package DB\n*.db files]
		      D --> E{Package found?}
		      E -->|No| F[Error: package not found]
		      E -->|Yes| G[Resolve dependencies]
		      G --> H[Download .pkg.tar.zst\nfrom mirror]
		      H --> I[Verify GPG signature]
		      I --> J{Signature valid?}
		      J -->|No| K[Error: signature invalid]
		      J -->|Yes| L[Extract & install\nto filesystem]
		      L --> M[Run pacman hooks\n/usr/share/libalpm/hooks/]
		      M --> N[Update package DB\n/var/lib/pacman/]
		      N --> O[Done ✓]
		  ```
	- ## Essential pacman Commands
		- ```bash
		  # ── SYNC / UPDATE ──────────────────────────────────────────
		  sudo pacman -Sy              # sync package databases only
		  sudo pacman -Syu             # sync + upgrade all packages (DO THIS REGULARLY)
		  sudo pacman -Syuu            # force downgrade if mirror is behind
		  
		  # ── INSTALL ────────────────────────────────────────────────
		  sudo pacman -S package           # install package
		  sudo pacman -S pkg1 pkg2 pkg3    # install multiple packages
		  sudo pacman -S extra/package     # install from specific repo
		  sudo pacman -U /path/to/pkg.tar.zst  # install local package file
		  sudo pacman -S --needed package  # skip if already installed
		  sudo pacman -S --noconfirm pkg   # skip confirmation (scripts)
		  
		  # ── REMOVE ─────────────────────────────────────────────────
		  sudo pacman -R package           # remove package only
		  sudo pacman -Rs package          # remove + unused dependencies
		  sudo pacman -Rns package         # remove + deps + config files
		  sudo pacman -Rdd package         # remove ignoring dependencies (dangerous!)
		  
		  # ── SEARCH ─────────────────────────────────────────────────
		  pacman -Ss keyword               # search repos for keyword
		  pacman -Si package               # show package info (remote)
		  pacman -Qi package               # show package info (installed)
		  pacman -Ql package               # list files owned by package
		  pacman -Qo /path/to/file         # which package owns this file
		  pacman -F filename               # find which package provides a file
		  
		  # ── LIST PACKAGES ──────────────────────────────────────────
		  pacman -Q                        # list all installed packages
		  pacman -Qe                       # list explicitly installed packages
		  pacman -Qd                       # list packages installed as deps
		  pacman -Qdt                      # list orphan packages (no longer needed)
		  pacman -Qn                       # list packages from official repos
		  pacman -Qm                       # list foreign packages (AUR, local)
		  
		  # ── DATABASE ───────────────────────────────────────────────
		  sudo pacman -Fy                  # sync file database
		  sudo pacman -Dk                  # check database consistency
		  sudo pacman -Qkk                 # verify installed package files
		  
		  # ── CACHE ──────────────────────────────────────────────────
		  sudo pacman -Sc                  # remove old cached packages
		  sudo pacman -Scc                 # remove ALL cached packages
		  # Better: use paccache (see Maintenance section)
		  ```
	- ## pacman.conf
		- ```ini
		  # /etc/pacman.conf — main pacman configuration
		  
		  [options]
		  HoldPkg     = pacman glibc
		  Architecture = auto
		  
		  # Misc options (uncomment to enable)
		  Color                    # colored output
		  ILoveCandy               # Pac-Man progress bar (fun!)
		  CheckSpace               # check disk space before install
		  VerbosePkgLists          # show old/new versions on upgrade
		  ParallelDownloads = 5    # download multiple packages simultaneously
		  
		  # Signature verification
		  SigLevel    = Required DatabaseOptional
		  LocalFileSigLevel = Optional
		  
		  # Official repositories
		  [core]
		  Include = /etc/pacman.d/mirrorlist
		  
		  [extra]
		  Include = /etc/pacman.d/mirrorlist
		  
		  # Multilib (32-bit support — needed for Steam, Wine)
		  [multilib]
		  Include = /etc/pacman.d/mirrorlist
		  
		  # To enable multilib, uncomment the [multilib] section above
		  # Then: sudo pacman -Syu
		  ```
	- ## Mirrorlist & Reflector
		- ```bash
		  # /etc/pacman.d/mirrorlist — list of download mirrors
		  # Faster mirrors = faster downloads
		  
		  # Install reflector (auto-selects fastest mirrors)
		  sudo pacman -S reflector
		  
		  # Generate optimized mirrorlist
		  sudo reflector \
		    --country India,Singapore,Japan \
		    --age 12 \
		    --protocol https \
		    --sort rate \
		    --save /etc/pacman.d/mirrorlist
		  
		  # Auto-update mirrors on boot (systemd service)
		  sudo systemctl enable reflector.service
		  
		  # Or use reflector timer (weekly update)
		  sudo systemctl enable reflector.timer
		  
		  # Configure reflector options
		  sudo nano /etc/xdg/reflector/reflector.conf
		  # --country India,Singapore
		  # --age 12
		  # --protocol https
		  # --sort rate
		  # --save /etc/pacman.d/mirrorlist
		  
		  # Manual mirrorlist entry format:
		  # Server = https://mirror.example.com/archlinux/$repo/os/$arch
		  ```
	- ## pacman Hooks
		- ```bash
		  # Hooks run automatically after pacman transactions
		  # System hooks: /usr/share/libalpm/hooks/
		  # Custom hooks: /etc/pacman.d/hooks/
		  
		  # Example: auto-regenerate GRUB after kernel update
		  # /etc/pacman.d/hooks/grub-update.hook
		  cat > /etc/pacman.d/hooks/grub-update.hook << 'EOF'
		  [Trigger]
		  Operation = Upgrade
		  Type = Package
		  Target = linux
		  Target = linux-lts
		  
		  [Action]
		  Description = Updating GRUB config...
		  When = PostTransaction
		  Exec = /usr/bin/grub-mkconfig -o /boot/grub/grub.cfg
		  EOF
		  
		  # Example: clear orphan packages hook reminder
		  # Hooks are .hook files in /etc/pacman.d/hooks/
		  ```
	- ## pacman Cache Management
		- ```bash
		  # Install paccache (from pacman-contrib)
		  sudo pacman -S pacman-contrib
		  
		  # Keep only last 3 versions of each package
		  sudo paccache -r
		  
		  # Keep only last 1 version
		  sudo paccache -rk1
		  
		  # Remove all cached versions of uninstalled packages
		  sudo paccache -ruk0
		  
		  # Enable paccache timer (weekly cleanup)
		  sudo systemctl enable paccache.timer
		  
		  # Check cache size
		  du -sh /var/cache/pacman/pkg/
		  
		  # Nuclear option — remove ALL cache (not recommended)
		  sudo pacman -Scc
		  ```
	- ## Official Repositories
		- ```
		  core      → essential packages (kernel, glibc, bash, systemd)
		  extra     → everything else (DEs, browsers, dev tools)
		  multilib  → 32-bit libraries (Steam, Wine, cross-compilation)
		  
		  Testing repos (unstable — not for daily use):
		  core-testing
		  extra-testing
		  multilib-testing
		  ```
-
- # AUR (Arch User Repository)
  collapsed:: true
	- ## What is the AUR?
		- The **AUR (Arch User Repository)** is a community-driven repository of **PKGBUILDs** — build scripts that compile and install software not in the official repos.
		- Contains **90,000+** packages — virtually any Linux software you can think of.
		- AUR packages are **not officially supported** — they are user-submitted and user-maintained.
		- You don't install from AUR directly — you download a PKGBUILD, build the package locally, then install with pacman.
	- > [!warning]
	  > Always **read the PKGBUILD** before building an AUR package. Anyone can submit to the AUR — malicious PKGBUILDs exist. Never blindly run AUR helpers without reviewing what they build.
	- ## AUR Flow Diagram
		- ```mermaid
		  flowchart TD
		      A[User wants AUR package] --> B[Search AUR\naur.archlinux.org]
		      B --> C[Find PKGBUILD]
		      C --> D{Use AUR helper\nor manual?}
		      D -->|Manual| E[git clone AUR URL]
		      D -->|yay/paru| F[AUR helper clones\nautomatically]
		      E --> G[Read PKGBUILD\n⚠️ ALWAYS do this]
		      F --> G
		      G --> H{PKGBUILD safe?}
		      H -->|No| I[Abort — do not install]
		      H -->|Yes| J[makepkg -si\nbuild + install]
		      J --> K[Download sources\nfrom upstream]
		      K --> L[Verify checksums]
		      L --> M[Compile / prepare package]
		      M --> N[Create .pkg.tar.zst]
		      N --> O[pacman -U installs it]
		      O --> P[Package installed ✓]
		  ```
	- ## Manual AUR Installation
		- ```bash
		  # Install prerequisites
		  sudo pacman -S --needed git base-devel
		  
		  # Clone the AUR package
		  git clone https://aur.archlinux.org/package-name.git
		  cd package-name
		  
		  # READ THE PKGBUILD (important!)
		  cat PKGBUILD
		  
		  # Build and install
		  makepkg -si
		  # -s = install missing dependencies
		  # -i = install after building
		  # -c = clean up build files after
		  # -r = remove make dependencies after install
		  
		  # Full clean build:
		  makepkg -sirc
		  
		  # Update AUR package (pull latest, rebuild)
		  git pull
		  makepkg -si
		  ```
	- ## PKGBUILD Explained
		- ```bash
		  # PKGBUILD is a bash script that defines how to build a package
		  # Example PKGBUILD structure:
		  
		  # Maintainer: Your Name <email>
		  pkgname=mypackage           # package name
		  pkgver=1.2.3                # version
		  pkgrel=1                    # package release number
		  epoch=0                     # force version ordering (rarely used)
		  pkgdesc="A short description"
		  arch=('x86_64')             # supported architectures
		  url="https://example.com"
		  license=('MIT')
		  depends=('glibc' 'gtk3')    # runtime dependencies
		  makedepends=('cmake' 'git') # build-only dependencies
		  optdepends=('ffmpeg: video support')
		  provides=('mypackage')
		  conflicts=('mypackage-git')
		  source=("https://example.com/mypackage-${pkgver}.tar.gz")
		  sha256sums=('abc123...')    # checksum for source verification
		  
		  prepare() {
		    cd "$pkgname-$pkgver"
		    patch -p1 < ../fix.patch  # apply patches if needed
		  }
		  
		  build() {
		    cd "$pkgname-$pkgver"
		    cmake -B build -S . \
		      -DCMAKE_BUILD_TYPE=Release \
		      -DCMAKE_INSTALL_PREFIX=/usr
		    cmake --build build
		  }
		  
		  check() {
		    cd "$pkgname-$pkgver"
		    cmake --build build --target test  # run tests
		  }
		  
		  package() {
		    cd "$pkgname-$pkgver"
		    DESTDIR="$pkgdir" cmake --install build
		    install -Dm644 LICENSE "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
		  }
		  ```
	- ## yay — AUR Helper
		- ```bash
		  # Install yay
		  sudo pacman -S --needed git base-devel
		  git clone https://aur.archlinux.org/yay.git
		  cd yay && makepkg -si
		  
		  # yay commands (mirrors pacman syntax + AUR support)
		  yay -Syu              # update system + AUR packages
		  yay -S package        # install from repos or AUR
		  yay -Ss keyword       # search repos + AUR
		  yay -Si package       # show package info
		  yay -R package        # remove package
		  yay -Qm               # list AUR/foreign packages
		  yay -Yc               # remove unneeded AUR dependencies
		  yay --devel -Syu      # update VCS packages (git, svn, etc.)
		  
		  # yay config
		  yay --save --answerclean None --answerdiff None  # skip prompts
		  yay --gendb           # generate development package DB
		  ```
	- ## paru — AUR Helper (Rust-based)
		- ```bash
		  # Install paru (written in Rust — faster than yay)
		  sudo pacman -S --needed git base-devel
		  git clone https://aur.archlinux.org/paru.git
		  cd paru && makepkg -si
		  
		  # paru commands
		  paru -Syu             # update system + AUR
		  paru -S package       # install package
		  paru -Ss keyword      # search
		  paru -Si package      # info
		  paru -R package       # remove
		  paru -Gc package      # show PKGBUILD comments from AUR
		  paru --fm bat         # use bat to view PKGBUILDs (pretty)
		  
		  # paru config: /etc/paru.conf or ~/.config/paru/paru.conf
		  # BottomUp = true     → show results bottom-up (newest first)
		  # SudoLoop = true     → keep sudo alive during long builds
		  # CleanAfter = true   → clean build files after install
		  ```
	- ## AUR Helpers Comparison
		- | Helper | Language | Speed | Features | Notes |
		  |--------|----------|-------|----------|-------|
		  | yay | Go | Fast | Full-featured | Most popular |
		  | paru | Rust | Fastest | Full-featured + PKGBUILD review | Recommended |
		  | trizen | Perl | Medium | Lightweight | Less maintained |
		  | aurman | Python | Medium | Advanced | Discontinued |
		  | pikaur | Python | Medium | Parallel builds | Good alternative |
		  | aura | Haskell | Fast | Multi-backend | Unique design |
	- > [!info]
	  > **paru** is generally recommended over yay for new installs — it's faster (Rust), shows PKGBUILD diffs by default, and has better security defaults.
-
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell
		- Since **2020**, Arch Linux's default shell for new users is **zsh** (Z Shell).
		- The root shell remains **bash** for compatibility.
		- ```bash
		  # Check current shell
		  echo $SHELL
		  chsh -l              # list available shells
		  chsh -s /bin/zsh     # change shell to zsh
		  chsh -s /bin/bash    # change back to bash
		  
		  # Install shells
		  sudo pacman -S zsh fish bash
		  
		  # zsh config file: ~/.zshrc
		  # bash config file: ~/.bashrc or ~/.bash_profile
		  ```
	- ## Essential Commands
		- ```bash
		  # ── NAVIGATION ─────────────────────────────────────────────
		  pwd                  # print working directory
		  ls                   # list files
		  ls -la               # list all files with details
		  ls -lh               # human-readable sizes
		  cd /path/to/dir      # change directory
		  cd ~                 # go to home directory
		  cd -                 # go to previous directory
		  
		  # ── FILE OPERATIONS ────────────────────────────────────────
		  touch file.txt       # create empty file
		  mkdir -p dir/subdir  # create directory (with parents)
		  cp src dest          # copy file
		  cp -r src/ dest/     # copy directory recursively
		  mv src dest          # move or rename
		  rm file              # remove file
		  rm -rf dir/          # remove directory recursively (careful!)
		  ln -s target link    # create symbolic link
		  
		  # ── VIEW FILES ─────────────────────────────────────────────
		  cat file             # print file contents
		  less file            # paginated view (q to quit)
		  head -n 20 file      # first 20 lines
		  tail -n 20 file      # last 20 lines
		  tail -f /var/log/syslog  # follow log in real-time
		  
		  # ── SEARCH ─────────────────────────────────────────────────
		  find /path -name "*.conf"          # find files by name
		  find /path -type f -size +100M     # find files > 100MB
		  grep -r "pattern" /path/           # search text in files
		  grep -n "pattern" file             # show line numbers
		  grep -i "pattern" file             # case-insensitive
		  
		  # ── SYSTEM INFO ────────────────────────────────────────────
		  uname -a             # kernel + system info
		  lscpu                # CPU info
		  lsmem                # memory info
		  lsblk                # block devices
		  lspci                # PCI devices
		  lsusb                # USB devices
		  df -h                # disk usage (human-readable)
		  du -sh /path/        # directory size
		  free -h              # RAM usage
		  top / htop           # process monitor
		  ps aux               # list all processes
		  
		  # ── PROCESS MANAGEMENT ─────────────────────────────────────
		  kill PID             # send SIGTERM to process
		  kill -9 PID          # force kill (SIGKILL)
		  killall processname  # kill by name
		  pkill -f pattern     # kill by pattern
		  bg                   # send to background
		  fg                   # bring to foreground
		  jobs                 # list background jobs
		  nohup command &      # run immune to hangup
		  ```
	- ## File Permissions
		- ```bash
		  # Permission format: [type][owner][group][others]
		  # Example: -rwxr-xr--
		  #   -    = regular file (d=dir, l=symlink)
		  #   rwx  = owner: read, write, execute
		  #   r-x  = group: read, execute
		  #   r--  = others: read only
		  
		  # Numeric (octal) permissions:
		  # r=4, w=2, x=1
		  # 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--, 0 = ---
		  
		  chmod 755 file       # rwxr-xr-x
		  chmod 644 file       # rw-r--r--
		  chmod 600 file       # rw------- (private key files)
		  chmod +x script.sh   # add execute permission
		  chmod -R 755 dir/    # recursive
		  
		  chown user file      # change owner
		  chown user:group file # change owner and group
		  chown -R user:group dir/  # recursive
		  
		  # Special permissions
		  chmod u+s file       # setuid — run as file owner
		  chmod g+s dir/       # setgid — new files inherit group
		  chmod +t dir/        # sticky bit — only owner can delete
		  
		  # View permissions
		  ls -la file
		  stat file
		  ```
	- ## I/O Redirection & Pipes
		- ```bash
		  # Redirection
		  command > file       # stdout to file (overwrite)
		  command >> file      # stdout to file (append)
		  command < file       # stdin from file
		  command 2> error.log # stderr to file
		  command 2>&1         # redirect stderr to stdout
		  command &> file      # both stdout and stderr to file
		  command > /dev/null  # discard output
		  
		  # Pipes — chain commands
		  ls -la | grep ".conf"          # filter ls output
		  cat file | sort | uniq         # sort and deduplicate
		  ps aux | grep firefox          # find process
		  journalctl | tail -50          # last 50 log lines
		  
		  # Process substitution
		  diff <(ls dir1) <(ls dir2)     # compare directory listings
		  
		  # Here document
		  cat << EOF > file.txt
		  line 1
		  line 2
		  EOF
		  ```
	- ## Shell Scripting Basics
		- ```bash
		  #!/bin/bash
		  # Shebang line — specifies interpreter
		  
		  # Variables
		  NAME="Arch"
		  echo "Hello, $NAME"
		  echo "Hello, ${NAME}Linux"   # use braces for clarity
		  
		  # User input
		  read -p "Enter name: " USER_NAME
		  
		  # Conditionals
		  if [ "$NAME" = "Arch" ]; then
		    echo "It's Arch!"
		  elif [ "$NAME" = "Ubuntu" ]; then
		    echo "It's Ubuntu"
		  else
		    echo "Unknown distro"
		  fi
		  
		  # File tests
		  if [ -f "/etc/pacman.conf" ]; then echo "File exists"; fi
		  if [ -d "/home" ]; then echo "Directory exists"; fi
		  if [ -x "/usr/bin/pacman" ]; then echo "Executable"; fi
		  
		  # Loops
		  for pkg in vim git curl wget; do
		    sudo pacman -S --noconfirm "$pkg"
		  done
		  
		  while read line; do
		    echo "Line: $line"
		  done < file.txt
		  
		  # Functions
		  update_system() {
		    echo "Updating system..."
		    sudo pacman -Syu --noconfirm
		    echo "Done!"
		  }
		  update_system
		  
		  # Exit codes
		  command && echo "Success" || echo "Failed"
		  
		  # Arrays
		  PKGS=("vim" "git" "curl")
		  for pkg in "${PKGS[@]}"; do
		    echo "Installing $pkg"
		  done
		  ```
	- ## Useful Terminal Tools
		- ```bash
		  # Install essential terminal tools
		  sudo pacman -S \
		    bat \          # better cat (syntax highlighting)
		    eza \          # better ls (colors, icons)
		    fd \           # better find
		    ripgrep \      # better grep (rg)
		    fzf \          # fuzzy finder
		    zoxide \       # smarter cd
		    tmux \         # terminal multiplexer
		    neovim \       # modern vim
		    htop \         # interactive process viewer
		    btop \         # beautiful resource monitor
		    ncdu           # disk usage analyzer (TUI)
		  
		  # zsh plugins (oh-my-zsh or manual)
		  sudo pacman -S zsh-autosuggestions zsh-syntax-highlighting
		  # Add to ~/.zshrc:
		  # source /usr/share/zsh/plugins/zsh-autosuggestions/zsh-autosuggestions.zsh
		  # source /usr/share/zsh/plugins/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
		  ```
-
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- ```
		  root     → superuser, UID 0, full system access
		  regular  → normal user, limited permissions
		  system   → service accounts (no login), UID < 1000
		  ```
	- ## User Commands
		- ```bash
		  # Create user
		  useradd -m username              # create user with home dir
		  useradd -m -G wheel,audio,video,storage username  # with groups
		  useradd -m -s /bin/zsh username  # with specific shell
		  useradd -m -u 1001 username      # with specific UID
		  
		  # Set/change password
		  passwd username                  # set password for user
		  passwd                           # change your own password
		  
		  # Modify user
		  usermod -aG wheel username       # add to wheel group
		  usermod -aG audio,video username # add to multiple groups
		  usermod -s /bin/zsh username     # change shell
		  usermod -l newname oldname       # rename user
		  usermod -d /new/home username    # change home directory
		  usermod -L username              # lock account
		  usermod -U username              # unlock account
		  
		  # Delete user
		  userdel username                 # delete user (keep home)
		  userdel -r username              # delete user + home dir
		  
		  # View user info
		  id username                      # UID, GID, groups
		  whoami                           # current user
		  who                              # logged-in users
		  w                                # who + what they're doing
		  last                             # login history
		  cat /etc/passwd                  # all users
		  ```
	- ## Group Commands
		- ```bash
		  # Create group
		  groupadd groupname
		  groupadd -g 1500 groupname       # with specific GID
		  
		  # Modify group
		  groupmod -n newname oldname      # rename group
		  gpasswd -a username groupname    # add user to group
		  gpasswd -d username groupname    # remove user from group
		  
		  # Delete group
		  groupdel groupname
		  
		  # View groups
		  groups username                  # groups for user
		  cat /etc/group                   # all groups
		  getent group groupname           # group info
		  
		  # Important groups on Arch:
		  # wheel    → sudo access
		  # audio    → audio devices
		  # video    → video devices
		  # storage  → storage devices (USB, etc.)
		  # optical  → optical drives
		  # network  → network management
		  # docker   → Docker daemon access
		  # libvirt  → virtualization
		  ```
	- ## wheel Group & sudo
		- ```bash
		  # The wheel group is Arch's admin group (like sudo group on Ubuntu)
		  
		  # Add user to wheel
		  usermod -aG wheel username
		  
		  # Configure sudo via visudo (ALWAYS use visudo, never edit directly)
		  EDITOR=nano visudo
		  # or
		  EDITOR=vim visudo
		  
		  # In /etc/sudoers, uncomment:
		  %wheel ALL=(ALL:ALL) ALL          # full sudo with password
		  # OR for passwordless sudo (less secure):
		  %wheel ALL=(ALL:ALL) NOPASSWD: ALL
		  
		  # Allow specific command without password:
		  username ALL=(ALL) NOPASSWD: /usr/bin/pacman
		  
		  # Sudo timeout (default 5 min)
		  Defaults timestamp_timeout=15    # 15 minutes
		  Defaults timestamp_timeout=0     # always ask password
		  Defaults timestamp_timeout=-1    # never expire
		  ```
	- ## polkit
		- ```bash
		  # polkit (PolicyKit) — fine-grained privilege management for GUI apps
		  # Allows non-root users to perform privileged actions via rules
		  
		  sudo pacman -S polkit
		  
		  # polkit rules: /etc/polkit-1/rules.d/
		  # Example: allow wheel group to manage systemd without password
		  cat > /etc/polkit-1/rules.d/49-nopasswd-wheel.rules << 'EOF'
		  polkit.addRule(function(action, subject) {
		    if (subject.isInGroup("wheel")) {
		      return polkit.Result.YES;
		    }
		  });
		  EOF
		  
		  # Check polkit actions
		  pkaction --verbose --action-id org.freedesktop.systemd1.manage-units
		  ```
-
- # System & Service Management
  collapsed:: true
	- ## systemctl — Service Control
		- ```bash
		  # ── SERVICE MANAGEMENT ─────────────────────────────────────
		  sudo systemctl start service      # start service now
		  sudo systemctl stop service       # stop service
		  sudo systemctl restart service    # stop + start
		  sudo systemctl reload service     # reload config (no restart)
		  sudo systemctl enable service     # enable at boot
		  sudo systemctl disable service    # disable at boot
		  sudo systemctl enable --now service  # enable + start immediately
		  sudo systemctl disable --now service # disable + stop immediately
		  sudo systemctl mask service       # completely prevent starting
		  sudo systemctl unmask service     # undo mask
		  
		  # ── STATUS & INFO ──────────────────────────────────────────
		  systemctl status service          # service status + recent logs
		  systemctl is-active service       # active/inactive
		  systemctl is-enabled service      # enabled/disabled
		  systemctl is-failed service       # failed/not-failed
		  systemctl list-units              # all active units
		  systemctl list-units --failed     # failed units
		  systemctl list-unit-files         # all unit files + state
		  systemctl list-units --type=service  # services only
		  systemctl list-timers             # all timers
		  
		  # ── SYSTEM STATE ───────────────────────────────────────────
		  sudo systemctl reboot             # reboot
		  sudo systemctl poweroff           # shutdown
		  sudo systemctl suspend            # suspend to RAM
		  sudo systemctl hibernate          # suspend to disk
		  sudo systemctl rescue             # single-user rescue mode
		  sudo systemctl emergency          # emergency mode
		  
		  # ── TARGETS (runlevels) ────────────────────────────────────
		  systemctl get-default             # current default target
		  sudo systemctl set-default multi-user.target   # CLI boot
		  sudo systemctl set-default graphical.target    # GUI boot
		  sudo systemctl isolate multi-user.target       # switch now
		  
		  # Common targets:
		  # poweroff.target   → shutdown
		  # rescue.target     → single user
		  # multi-user.target → CLI (runlevel 3)
		  # graphical.target  → GUI (runlevel 5)
		  # reboot.target     → reboot
		  ```
	- ## journalctl — Log Viewer
		- ```bash
		  # View all logs
		  journalctl                        # all logs (oldest first)
		  journalctl -r                     # reverse (newest first)
		  journalctl -f                     # follow (like tail -f)
		  journalctl -n 50                  # last 50 lines
		  
		  # Filter by service
		  journalctl -u nginx               # logs for nginx
		  journalctl -u nginx -f            # follow nginx logs
		  journalctl -u nginx --since today # today's nginx logs
		  
		  # Filter by time
		  journalctl --since "2024-01-01"
		  journalctl --since "1 hour ago"
		  journalctl --since "09:00" --until "10:00"
		  journalctl --since yesterday
		  
		  # Filter by priority
		  journalctl -p err                 # errors only
		  journalctl -p warning             # warnings and above
		  # Priorities: emerg, alert, crit, err, warning, notice, info, debug
		  
		  # Filter by boot
		  journalctl -b                     # current boot
		  journalctl -b -1                  # previous boot
		  journalctl --list-boots           # list all boots
		  
		  # Kernel messages
		  journalctl -k                     # kernel messages (dmesg)
		  dmesg                             # kernel ring buffer
		  dmesg -T                          # with human-readable timestamps
		  dmesg -l err,warn                 # errors and warnings only
		  
		  # Disk usage
		  journalctl --disk-usage
		  sudo journalctl --vacuum-size=500M   # keep only 500MB of logs
		  sudo journalctl --vacuum-time=2weeks # keep only 2 weeks of logs
		  ```
	- ## Custom systemd Units
		- ```ini
		  # Create a custom service: /etc/systemd/system/myapp.service
		  
		  [Unit]
		  Description=My Custom Application
		  After=network.target
		  Wants=network.target
		  
		  [Service]
		  Type=simple
		  User=myuser
		  Group=mygroup
		  WorkingDirectory=/opt/myapp
		  ExecStart=/opt/myapp/myapp --config /etc/myapp/config.yaml
		  ExecReload=/bin/kill -HUP $MAINPID
		  Restart=on-failure
		  RestartSec=5s
		  StandardOutput=journal
		  StandardError=journal
		  
		  # Security hardening
		  NoNewPrivileges=true
		  ProtectSystem=strict
		  ProtectHome=true
		  PrivateTmp=true
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  # After creating the unit file:
		  sudo systemctl daemon-reload       # reload systemd config
		  sudo systemctl enable --now myapp  # enable and start
		  systemctl status myapp             # verify it's running
		  ```
	- ## systemd Timers (cron replacement)
		- ```ini
		  # /etc/systemd/system/backup.timer
		  [Unit]
		  Description=Daily Backup Timer
		  
		  [Timer]
		  OnCalendar=daily
		  Persistent=true          # run if missed (e.g., system was off)
		  
		  [Install]
		  WantedBy=timers.target
		  ```
		- ```ini
		  # /etc/systemd/system/backup.service
		  [Unit]
		  Description=Daily Backup
		  
		  [Service]
		  Type=oneshot
		  ExecStart=/usr/local/bin/backup.sh
		  ```
		- ```bash
		  sudo systemctl enable --now backup.timer
		  systemctl list-timers --all
		  ```
-
- # Networking
  collapsed:: true
	- ## Network Tools
		- ```bash
		  # Install essential network tools
		  sudo pacman -S iproute2 net-tools bind-tools wget curl
		  
		  # ── IP COMMANDS (modern) ────────────────────────────────────
		  ip addr                           # show IP addresses
		  ip addr show eth0                 # specific interface
		  ip link                           # show network interfaces
		  ip link set eth0 up               # bring interface up
		  ip link set eth0 down             # bring interface down
		  ip route                          # show routing table
		  ip route add default via 192.168.1.1  # add default gateway
		  ip neigh                          # ARP table
		  
		  # ── SS (socket statistics — replaces netstat) ───────────────
		  ss -tuln                          # listening TCP/UDP ports
		  ss -tulnp                         # with process names
		  ss -s                             # summary statistics
		  ss -tp                            # established TCP connections
		  
		  # ── DNS ────────────────────────────────────────────────────
		  dig archlinux.org                 # DNS lookup
		  dig +short archlinux.org          # just the IP
		  nslookup archlinux.org            # alternative DNS lookup
		  host archlinux.org                # simple lookup
		  
		  # ── CONNECTIVITY ───────────────────────────────────────────
		  ping -c 4 archlinux.org           # test connectivity
		  traceroute archlinux.org          # trace route
		  mtr archlinux.org                 # combined ping + traceroute
		  curl -I https://archlinux.org     # HTTP headers
		  wget -q -O- https://example.com   # download to stdout
		  ```
	- ## NetworkManager & nmcli
		- ```bash
		  # NetworkManager is the standard network manager on Arch desktops
		  sudo pacman -S networkmanager
		  sudo systemctl enable --now NetworkManager
		  
		  # ── nmcli (CLI for NetworkManager) ─────────────────────────
		  nmcli device status               # show all devices
		  nmcli connection show             # show all connections
		  nmcli connection show --active    # active connections only
		  
		  # WiFi
		  nmcli device wifi list            # scan for WiFi networks
		  nmcli device wifi connect "SSID" password "password"
		  nmcli device wifi connect "SSID" password "pass" ifname wlan0
		  
		  # Manage connections
		  nmcli connection up "connection-name"
		  nmcli connection down "connection-name"
		  nmcli connection delete "connection-name"
		  nmcli connection modify "conn" ipv4.dns "8.8.8.8 1.1.1.1"
		  
		  # Static IP
		  nmcli connection modify "conn" \
		    ipv4.method manual \
		    ipv4.addresses "192.168.1.100/24" \
		    ipv4.gateway "192.168.1.1" \
		    ipv4.dns "1.1.1.1 8.8.8.8"
		  nmcli connection up "conn"
		  
		  # nmtui — text UI for NetworkManager
		  nmtui
		  ```
	- ## iwd (iNet Wireless Daemon)
		- ```bash
		  # iwd is a lightweight alternative to wpa_supplicant for WiFi
		  sudo pacman -S iwd
		  sudo systemctl enable --now iwd
		  
		  # Interactive mode
		  iwctl
		  # Inside iwctl:
		  device list                       # list wireless devices
		  station wlan0 scan                # scan for networks
		  station wlan0 get-networks        # show scan results
		  station wlan0 connect "SSID"      # connect (prompts for password)
		  station wlan0 show                # connection status
		  known-networks list               # saved networks
		  known-networks "SSID" forget      # remove saved network
		  exit
		  
		  # Use iwd with NetworkManager (recommended combo)
		  # In /etc/NetworkManager/conf.d/wifi_backend.conf:
		  # [device]
		  # wifi.backend=iwd
		  ```
	- ## Firewall — nftables / ufw
		- ```bash
		  # ── nftables (modern, default on Arch) ─────────────────────
		  sudo pacman -S nftables
		  sudo systemctl enable --now nftables
		  
		  # Config: /etc/nftables.conf
		  # Basic ruleset example:
		  cat > /etc/nftables.conf << 'EOF'
		  #!/usr/sbin/nft -f
		  flush ruleset
		  
		  table inet filter {
		    chain input {
		      type filter hook input priority 0; policy drop;
		      ct state established,related accept
		      iif lo accept
		      ip protocol icmp accept
		      tcp dport 22 accept    # SSH
		      tcp dport 80 accept    # HTTP
		      tcp dport 443 accept   # HTTPS
		    }
		    chain forward {
		      type filter hook forward priority 0; policy drop;
		    }
		    chain output {
		      type filter hook output priority 0; policy accept;
		    }
		  }
		  EOF
		  sudo nft -f /etc/nftables.conf
		  sudo nft list ruleset                # view current rules
		  
		  # ── ufw (simpler alternative) ───────────────────────────────
		  sudo pacman -S ufw
		  sudo systemctl enable --now ufw
		  sudo ufw enable
		  sudo ufw default deny incoming
		  sudo ufw default allow outgoing
		  sudo ufw allow ssh
		  sudo ufw allow 80/tcp
		  sudo ufw allow 443/tcp
		  sudo ufw status verbose
		  sudo ufw delete allow 80/tcp
		  ```
	- ## SSH
		- ```bash
		  # Install OpenSSH
		  sudo pacman -S openssh
		  
		  # Start/enable SSH server
		  sudo systemctl enable --now sshd
		  
		  # Connect to remote host
		  ssh user@hostname
		  ssh user@192.168.1.100
		  ssh -p 2222 user@hostname          # custom port
		  ssh -i ~/.ssh/id_rsa user@host     # specific key
		  
		  # Generate SSH key pair
		  ssh-keygen -t ed25519 -C "your@email.com"   # modern (recommended)
		  ssh-keygen -t rsa -b 4096 -C "your@email.com"  # RSA
		  
		  # Copy public key to remote host
		  ssh-copy-id user@hostname
		  # or manually:
		  cat ~/.ssh/id_ed25519.pub | ssh user@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
		  
		  # SSH config file (~/.ssh/config)
		  cat >> ~/.ssh/config << 'EOF'
		  Host myserver
		    HostName 192.168.1.100
		    User myuser
		    Port 22
		    IdentityFile ~/.ssh/id_ed25519
		  EOF
		  ssh myserver   # now just use alias
		  
		  # Harden SSH server (/etc/ssh/sshd_config)
		  # PermitRootLogin no
		  # PasswordAuthentication no
		  # PubkeyAuthentication yes
		  # Port 2222
		  # AllowUsers myuser
		  sudo systemctl restart sshd
		  
		  # SSH tunneling
		  ssh -L 8080:localhost:80 user@host   # local port forward
		  ssh -R 8080:localhost:80 user@host   # remote port forward
		  ssh -D 1080 user@host                # SOCKS proxy
		  ```
-
- # Desktop Environments
  collapsed:: true
	- ## Installing a Desktop Environment
		- > [!info]
		  > Arch ships with **no desktop environment** by default. You choose and install exactly what you want. This is one of Arch's greatest strengths — and one of its steepest learning curves.
		- ```bash
		  # Always install Xorg or Wayland base first
		  sudo pacman -S xorg-server xorg-xinit   # X11
		  # Wayland is included with most modern DEs
		  
		  # GPU drivers (install BEFORE the DE)
		  # Intel:
		  sudo pacman -S mesa intel-media-driver
		  # AMD:
		  sudo pacman -S mesa xf86-video-amdgpu vulkan-radeon
		  # NVIDIA (proprietary):
		  sudo pacman -S nvidia nvidia-utils nvidia-settings
		  # NVIDIA (open-source nouveau):
		  sudo pacman -S xf86-video-nouveau
		  ```
	- ## GNOME
		- ```bash
		  # Install GNOME
		  sudo pacman -S gnome gnome-extra
		  sudo systemctl enable gdm          # enable GDM display manager
		  sudo systemctl start gdm           # start now
		  
		  # Minimal GNOME (without extras)
		  sudo pacman -S gnome-shell gnome-control-center gnome-terminal \
		    nautilus gdm
		  
		  # GNOME tweaks and extensions
		  sudo pacman -S gnome-tweaks gnome-browser-connector
		  # Install extensions from: extensions.gnome.org
		  
		  # GNOME runs on Wayland by default (Arch)
		  # Force X11: set WaylandEnable=false in /etc/gdm/custom.conf
		  ```
	- ## KDE Plasma
		- ```bash
		  # Install KDE Plasma
		  sudo pacman -S plasma plasma-wayland-session kde-applications
		  sudo systemctl enable sddm         # enable SDDM display manager
		  
		  # Minimal KDE
		  sudo pacman -S plasma-desktop sddm konsole dolphin
		  
		  # KDE apps
		  sudo pacman -S kde-applications    # full suite
		  sudo pacman -S dolphin konsole kate okular gwenview  # selective
		  ```
	- ## Xfce
		- ```bash
		  # Install Xfce (lightweight, stable)
		  sudo pacman -S xfce4 xfce4-goodies
		  sudo pacman -S lightdm lightdm-gtk-greeter
		  sudo systemctl enable lightdm
		  
		  # Start Xfce manually (without DM)
		  echo "exec startxfce4" > ~/.xinitrc
		  startx
		  ```
	- ## i3 (Tiling Window Manager)
		- ```bash
		  # Install i3
		  sudo pacman -S i3-wm i3status i3blocks dmenu
		  sudo pacman -S xorg-server xorg-xinit xterm
		  
		  # Start i3
		  echo "exec i3" > ~/.xinitrc
		  startx
		  
		  # Config: ~/.config/i3/config
		  # Key bindings: $mod = Super (Windows key)
		  # $mod+Enter  → terminal
		  # $mod+d      → dmenu launcher
		  # $mod+Shift+q → close window
		  # $mod+1-9    → switch workspace
		  
		  # Recommended i3 extras
		  sudo pacman -S picom rofi polybar feh dunst
		  # picom    → compositor (transparency, shadows)
		  # rofi     → better app launcher
		  # polybar  → status bar
		  # feh      → wallpaper setter
		  # dunst    → notification daemon
		  ```
	- ## Sway (Wayland i3)
		- ```bash
		  # Sway = i3 for Wayland
		  sudo pacman -S sway swaybar swaybg swaylock swayidle
		  sudo pacman -S waybar wofi mako grim slurp  # extras
		  
		  # Start Sway
		  sway
		  # or add to ~/.bash_profile / ~/.zprofile:
		  # if [ -z "$WAYLAND_DISPLAY" ] && [ "$XDG_VTNR" = "1" ]; then
		  #   exec sway
		  # fi
		  
		  # Config: ~/.config/sway/config (copy from /etc/sway/config)
		  cp /etc/sway/config ~/.config/sway/config
		  ```
	- ## Display Managers Comparison
		- | DM | DE | Protocol | Weight | Notes |
		  |----|-----|----------|--------|-------|
		  | GDM | GNOME | Wayland + X11 | Heavy | Best with GNOME |
		  | SDDM | KDE | Wayland + X11 | Medium | Best with KDE |
		  | LightDM | Any | X11 (Wayland limited) | Light | Universal, GTK/Qt greeters |
		  | ly | Any | X11 + Wayland | Minimal | TUI display manager |
		  | greetd | Any | Wayland + X11 | Minimal | Flexible, config-based |
	- ## Wayland vs X11
		- | Feature | Wayland | X11 |
		  |---------|---------|-----|
		  | Architecture | Modern, compositor-based | Legacy, X server |
		  | Security | Better (app isolation) | Weaker (keylogging possible) |
		  | Performance | Better (less overhead) | Mature, well-tested |
		  | HiDPI | Native support | Problematic |
		  | Screen sharing | Improving (pipewire) | Works well |
		  | NVIDIA | Improving | Better support |
		  | Compatibility | Some apps need XWayland | Universal |
		  | Status | Default on GNOME/KDE | Fallback option |
		- ```bash
		  # Check if running Wayland or X11
		  echo $XDG_SESSION_TYPE    # wayland or x11
		  echo $WAYLAND_DISPLAY     # set if Wayland
		  echo $DISPLAY             # set if X11
		  
		  # XWayland — run X11 apps on Wayland
		  sudo pacman -S xorg-xwayland
		  # Most Wayland compositors include XWayland support automatically
		  ```
-
- # Security
  collapsed:: true
	- ## Security Overview
		- > [!warning]
		  > Arch Linux ships with **minimal security hardening** by default. Unlike Fedora (SELinux enforcing) or Ubuntu (AppArmor enabled), Arch leaves security configuration entirely to the user. This is intentional — but means you must actively harden your system.
	- ## AppArmor on Arch
		- ```bash
		  # Install AppArmor
		  sudo pacman -S apparmor
		  
		  # Enable AppArmor in kernel (add to GRUB cmdline)
		  sudo nano /etc/default/grub
		  # GRUB_CMDLINE_LINUX_DEFAULT="quiet lsm=landlock,lockdown,yama,integrity,apparmor,bpf"
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # Enable AppArmor service
		  sudo systemctl enable --now apparmor
		  
		  # Check status
		  sudo aa-status
		  
		  # AppArmor modes
		  sudo aa-enforce /etc/apparmor.d/usr.bin.firefox   # enforce profile
		  sudo aa-complain /etc/apparmor.d/usr.bin.firefox  # complain mode (log only)
		  sudo aa-disable /etc/apparmor.d/usr.bin.firefox   # disable profile
		  
		  # Install profiles
		  sudo pacman -S apparmor-profiles
		  ```
	- ## Firewall Setup
		- ```bash
		  # ufw (simple)
		  sudo pacman -S ufw
		  sudo systemctl enable --now ufw
		  sudo ufw default deny incoming
		  sudo ufw default allow outgoing
		  sudo ufw allow ssh
		  sudo ufw enable
		  sudo ufw status numbered
		  
		  # nftables (advanced — see Networking section)
		  
		  # firewalld (zone-based, like Fedora)
		  sudo pacman -S firewalld
		  sudo systemctl enable --now firewalld
		  sudo firewall-cmd --state
		  sudo firewall-cmd --get-active-zones
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --reload
		  ```
	- ## fail2ban
		- ```bash
		  # Install fail2ban (brute-force protection)
		  sudo pacman -S fail2ban
		  sudo systemctl enable --now fail2ban
		  
		  # Config: /etc/fail2ban/jail.local (copy from jail.conf)
		  sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
		  sudo nano /etc/fail2ban/jail.local
		  
		  # Key settings in jail.local:
		  # [DEFAULT]
		  # bantime  = 1h
		  # findtime = 10m
		  # maxretry = 5
		  # backend  = systemd
		  
		  # [sshd]
		  # enabled = true
		  # port    = ssh
		  # logpath = %(sshd_log)s
		  
		  sudo systemctl restart fail2ban
		  
		  # Check banned IPs
		  sudo fail2ban-client status
		  sudo fail2ban-client status sshd
		  sudo fail2ban-client set sshd unbanip 1.2.3.4  # unban IP
		  ```
	- ## auditd
		- ```bash
		  # Install audit daemon
		  sudo pacman -S audit
		  sudo systemctl enable --now auditd
		  
		  # View audit logs
		  sudo ausearch -m avc                    # SELinux/AppArmor denials
		  sudo ausearch -m USER_LOGIN             # login events
		  sudo ausearch -f /etc/passwd            # access to passwd file
		  sudo aureport --summary                 # summary report
		  sudo aureport --auth                    # authentication report
		  sudo aureport --failed                  # failed events
		  
		  # Add audit rules
		  sudo auditctl -w /etc/passwd -p wa -k passwd-changes
		  sudo auditctl -w /etc/sudoers -p wa -k sudoers-changes
		  
		  # Persistent rules: /etc/audit/rules.d/audit.rules
		  ```
	- ## Lynis Security Audit
		- ```bash
		  # Install Lynis
		  sudo pacman -S lynis
		  
		  # Run full system audit
		  sudo lynis audit system
		  
		  # Quick scan
		  sudo lynis audit system --quick
		  
		  # View report
		  cat /var/log/lynis-report.dat
		  
		  # Lynis gives a hardening index score (0-100)
		  # Follow suggestions to improve score
		  ```
	- ## General Security Hardening
		- ```bash
		  # Disable root SSH login
		  sudo nano /etc/ssh/sshd_config
		  # PermitRootLogin no
		  # PasswordAuthentication no
		  sudo systemctl restart sshd
		  
		  # Kernel hardening via sysctl
		  sudo nano /etc/sysctl.d/99-security.conf
		  ```
		- ```ini
		  # /etc/sysctl.d/99-security.conf
		  # Disable IP forwarding (unless router/VPN)
		  net.ipv4.ip_forward = 0
		  
		  # Prevent SYN flood attacks
		  net.ipv4.tcp_syncookies = 1
		  
		  # Disable ICMP redirects
		  net.ipv4.conf.all.accept_redirects = 0
		  net.ipv6.conf.all.accept_redirects = 0
		  
		  # Ignore broadcast pings
		  net.ipv4.icmp_echo_ignore_broadcasts = 1
		  
		  # Restrict dmesg to root
		  kernel.dmesg_restrict = 1
		  
		  # Restrict ptrace
		  kernel.yama.ptrace_scope = 1
		  
		  # Hide kernel pointers
		  kernel.kptr_restrict = 2
		  ```
		- ```bash
		  # Apply sysctl settings
		  sudo sysctl --system
		  
		  # Check for SUID/SGID files (potential privesc)
		  find / -perm /4000 -type f 2>/dev/null   # SUID files
		  find / -perm /2000 -type f 2>/dev/null   # SGID files
		  
		  # Check world-writable files
		  find / -perm -o+w -type f 2>/dev/null | grep -v /proc
		  
		  # Check listening ports
		  ss -tulnp
		  
		  # Update regularly (most important security practice)
		  sudo pacman -Syu
		  ```
-
- # System Maintenance
  collapsed:: true
	- ## The Golden Rule
		- > [!warning]
		  > **Never do a partial upgrade on Arch Linux.** Always run `sudo pacman -Syu` (sync + upgrade all) — never `pacman -Sy package` alone. Partial upgrades break shared libraries and cause system instability. Arch is a rolling release — keep it fully updated.
	- ## Regular Maintenance Checklist
		- ```bash
		  # ── WEEKLY TASKS ───────────────────────────────────────────
		  
		  # 1. Full system update
		  sudo pacman -Syu
		  # or with AUR:
		  yay -Syu
		  paru -Syu
		  
		  # 2. Check for failed services
		  systemctl --failed
		  
		  # 3. Check journal for errors
		  journalctl -p err -b
		  
		  # 4. Check disk space
		  df -h
		  du -sh /var/cache/pacman/pkg/
		  
		  # ── MONTHLY TASKS ──────────────────────────────────────────
		  
		  # 5. Clean package cache (keep last 3 versions)
		  sudo paccache -r
		  
		  # 6. Remove orphan packages
		  sudo pacman -Rns $(pacman -Qtdq)
		  # If no orphans: pacman -Qtdq returns nothing, command is safe
		  
		  # 7. Update mirrorlist
		  sudo reflector --country India,Singapore --age 12 \
		    --protocol https --sort rate --save /etc/pacman.d/mirrorlist
		  
		  # 8. Check pacnew/pacsave files
		  sudo find /etc -name "*.pacnew" -o -name "*.pacsave" 2>/dev/null
		  # Review and merge these files manually
		  sudo pacdiff   # interactive diff tool (from pacman-contrib)
		  ```
	- ## Orphan Package Removal
		- ```bash
		  # List orphan packages (installed as deps, no longer needed)
		  pacman -Qtdq
		  
		  # Remove all orphans
		  sudo pacman -Rns $(pacman -Qtdq)
		  
		  # If the above fails (no orphans), it's safe — just means none exist
		  # Safer version:
		  orphans=$(pacman -Qtdq)
		  [ -n "$orphans" ] && sudo pacman -Rns $orphans || echo "No orphans"
		  ```
	- ## Cache Cleaning
		- ```bash
		  # Install pacman-contrib (includes paccache)
		  sudo pacman -S pacman-contrib
		  
		  # Keep last 3 versions of each package (default)
		  sudo paccache -r
		  
		  # Keep last 1 version
		  sudo paccache -rk1
		  
		  # Remove all cached versions of uninstalled packages
		  sudo paccache -ruk0
		  
		  # Dry run (see what would be removed)
		  sudo paccache -d
		  sudo paccache -dk1
		  
		  # Enable weekly paccache timer
		  sudo systemctl enable paccache.timer
		  
		  # AUR build cache cleanup (yay)
		  yay -Sc
		  # paru
		  paru -Sc
		  ```
	- ## pacnew & pacsave Files
		- ```bash
		  # When pacman updates a config file you've modified, it creates:
		  # file.conf.pacnew  → new default config (don't overwrite yours)
		  # file.conf.pacsave → backup of your old config
		  
		  # Find all pacnew files
		  sudo find /etc -name "*.pacnew" 2>/dev/null
		  sudo find /etc -name "*.pacsave" 2>/dev/null
		  
		  # Review and merge with pacdiff
		  sudo pacman -S pacman-contrib
		  sudo pacdiff
		  
		  # Or manually diff and merge:
		  diff /etc/ssh/sshd_config /etc/ssh/sshd_config.pacnew
		  # Merge changes, then remove .pacnew:
		  sudo rm /etc/ssh/sshd_config.pacnew
		  ```
	- ## System Backup with rsync
		- ```bash
		  # Install rsync
		  sudo pacman -S rsync
		  
		  # Basic backup (local)
		  sudo rsync -aAXv --exclude={"/dev/*","/proc/*","/sys/*","/tmp/*",\
		  "/run/*","/mnt/*","/media/*","/lost+found"} / /mnt/backup/
		  
		  # Backup to remote server
		  rsync -aAXv --delete /home/user/ user@server:/backup/home/
		  
		  # Incremental backup with hard links (space-efficient)
		  rsync -aAXv --link-dest=/backup/latest / /backup/$(date +%Y-%m-%d)/
		  ln -snf /backup/$(date +%Y-%m-%d) /backup/latest
		  
		  # rsync flags explained:
		  # -a  = archive (recursive + preserve permissions/timestamps/symlinks)
		  # -A  = preserve ACLs
		  # -X  = preserve extended attributes
		  # -v  = verbose
		  # --delete = remove files in dest not in source
		  ```
	- ## Timeshift (Snapshot Backup)
		- ```bash
		  # Install Timeshift (GUI + CLI snapshot tool)
		  sudo pacman -S timeshift
		  # or from AUR:
		  yay -S timeshift
		  
		  # Timeshift supports:
		  # - rsync snapshots (any filesystem)
		  # - Btrfs snapshots (if using Btrfs)
		  
		  # CLI usage
		  sudo timeshift --create --comments "Before major update"
		  sudo timeshift --list
		  sudo timeshift --restore --snapshot "2024-01-01_12-00-00"
		  sudo timeshift --delete --snapshot "2024-01-01_12-00-00"
		  
		  # For Btrfs users — snapper is also excellent:
		  sudo pacman -S snapper snap-pac
		  # snap-pac creates snapshots automatically on every pacman transaction
		  ```
	- ## Reflector Mirror Management
		- ```bash
		  # Install reflector
		  sudo pacman -S reflector
		  
		  # Generate fast mirrorlist
		  sudo reflector \
		    --country India,Singapore,Japan,US \
		    --age 6 \
		    --protocol https \
		    --sort rate \
		    --number 10 \
		    --save /etc/pacman.d/mirrorlist
		  
		  # Configure reflector service
		  sudo nano /etc/xdg/reflector/reflector.conf
		  
		  # Enable automatic weekly mirror updates
		  sudo systemctl enable reflector.timer
		  sudo systemctl start reflector.timer
		  
		  # Check timer status
		  systemctl status reflector.timer
		  ```
	- ## Downgrading Packages
		- ```bash
		  # Install downgrade tool (AUR)
		  yay -S downgrade
		  
		  # Downgrade a package
		  sudo downgrade packagename
		  # Shows list of available versions from cache + archive
		  
		  # Manual downgrade from cache
		  ls /var/cache/pacman/pkg/ | grep packagename
		  sudo pacman -U /var/cache/pacman/pkg/packagename-1.2.3-1-x86_64.pkg.tar.zst
		  
		  # Prevent package from being upgraded (add to IgnorePkg)
		  sudo nano /etc/pacman.conf
		  # IgnorePkg = packagename
		  # IgnorePkg = pkg1 pkg2 pkg3
		  ```
-
- # Arch Wiki
	- ## What is the Arch Wiki?
		- The **Arch Wiki** (`wiki.archlinux.org`) is the most comprehensive Linux documentation resource on the internet.
		- Used by users of **all** Linux distributions — not just Arch users.
		- Community-maintained, constantly updated, covers everything from installation to advanced configuration.
		- > [!tip]
		  > When you have a Linux problem — any distro — search the Arch Wiki first. It's almost always the best resource, even for Ubuntu or Fedora users.
	- ## How to Use the Arch Wiki Effectively
		- ```
		  1. Search directly: wiki.archlinux.org/title/Topic_Name
		     Example: wiki.archlinux.org/title/GRUB
		  
		  2. Use the search bar — fuzzy search works well
		  
		  3. Google trick: "arch wiki topic" — usually top result
		  
		  4. Read the entire page, not just the first section
		     - "Tips and tricks" sections are gold
		     - "Troubleshooting" sections save hours
		  
		  5. Check "See also" links at the bottom
		  
		  6. Check the "Talk" page for known issues
		  
		  7. Note the "Accuracy" or "Out of date" banners
		     - Still useful but verify commands
		  ```
	- ## Most Useful Arch Wiki Pages
		- ```
		  Core:
		    Installation guide          → wiki.archlinux.org/title/Installation_guide
		    General recommendations     → wiki.archlinux.org/title/General_recommendations
		    List of applications        → wiki.archlinux.org/title/List_of_applications
		  
		  Package Management:
		    pacman                      → wiki.archlinux.org/title/Pacman
		    AUR                         → wiki.archlinux.org/title/Arch_User_Repository
		    makepkg                     → wiki.archlinux.org/title/Makepkg
		    PKGBUILD                    → wiki.archlinux.org/title/PKGBUILD
		  
		  System:
		    systemd                     → wiki.archlinux.org/title/Systemd
		    Kernel                      → wiki.archlinux.org/title/Kernel
		    mkinitcpio                  → wiki.archlinux.org/title/Mkinitcpio
		    GRUB                        → wiki.archlinux.org/title/GRUB
		    systemd-boot                → wiki.archlinux.org/title/Systemd-boot
		  
		  Desktop:
		    Desktop environment         → wiki.archlinux.org/title/Desktop_environment
		    Wayland                     → wiki.archlinux.org/title/Wayland
		    GNOME                       → wiki.archlinux.org/title/GNOME
		    KDE                         → wiki.archlinux.org/title/KDE
		    i3                          → wiki.archlinux.org/title/I3
		    Sway                        → wiki.archlinux.org/title/Sway
		  
		  Hardware:
		    NVIDIA                      → wiki.archlinux.org/title/NVIDIA
		    AMD GPU                     → wiki.archlinux.org/title/AMDGPU
		    Laptop                      → wiki.archlinux.org/title/Laptop
		    Power management            → wiki.archlinux.org/title/Power_management
		  
		  Networking:
		    NetworkManager              → wiki.archlinux.org/title/NetworkManager
		    iwd                         → wiki.archlinux.org/title/Iwd
		    SSH                         → wiki.archlinux.org/title/OpenSSH
		    nftables                    → wiki.archlinux.org/title/Nftables
		  
		  Security:
		    Security                    → wiki.archlinux.org/title/Security
		    AppArmor                    → wiki.archlinux.org/title/AppArmor
		    fail2ban                    → wiki.archlinux.org/title/Fail2ban
		    Lynis                       → wiki.archlinux.org/title/Lynis
		  ```
	- ## Arch Wiki Offline
		- ```bash
		  # Install arch-wiki-docs (offline copy)
		  sudo pacman -S arch-wiki-docs
		  # Docs stored at: /usr/share/doc/arch-wiki/html/
		  
		  # Install arch-wiki-lite (text-based)
		  yay -S arch-wiki-lite
		  wiki-search "pacman"
		  ```
-
- # More Learn
	- ## Official Resources
		- [Arch Linux Official Website](https://archlinux.org) — downloads, news, packages
		- [Arch Wiki](https://wiki.archlinux.org) — the best Linux documentation on the internet
		- [Arch Linux Forums](https://bbs.archlinux.org) — community support
		- [AUR (Arch User Repository)](https://aur.archlinux.org) — community packages
		- [Arch Linux GitLab](https://gitlab.archlinux.org) — source code and issue tracking
		- [Arch Linux Security Advisories](https://security.archlinux.org) — CVE tracking
		- [Arch Linux Packages](https://archlinux.org/packages/) — official package search
	- ## Key Wiki Pages to Bookmark
		- [Installation Guide](https://wiki.archlinux.org/title/Installation_guide) — official step-by-step install
		- [General Recommendations](https://wiki.archlinux.org/title/General_recommendations) — post-install must-read
		- [pacman](https://wiki.archlinux.org/title/Pacman) — complete pacman reference
		- [AUR Guide](https://wiki.archlinux.org/title/Arch_User_Repository) — AUR explained
		- [Security Hardening](https://wiki.archlinux.org/title/Security) — comprehensive security guide
		- [List of Applications](https://wiki.archlinux.org/title/List_of_applications) — find software for any task
	- ## YouTube Playlists & Channels
		- [Learn Linux TV — Arch Linux Series](https://www.youtube.com/@LearnLinuxTV) — beginner-friendly Arch tutorials
		- [DistroTube](https://www.youtube.com/@DistroTube) — Arch, tiling WMs, terminal tools
		- [The Linux Cast](https://www.youtube.com/@TheLinuxCast) — Arch tips and workflows
		- [typecraft](https://www.youtube.com/@typecraft_dev) — Neovim, terminal, Arch setup
		- [Dreams of Autonomy](https://www.youtube.com/@dreamsofautonomy) — dotfiles, Hyprland, Arch ricing
	- ## Community & Help
		- [r/archlinux](https://reddit.com/r/archlinux) — Reddit community
		- [Arch Linux IRC](https://wiki.archlinux.org/title/Arch_IRC_channels) — #archlinux on Libera.Chat
		- [Arch Linux Telegram](https://t.me/archlinux) — community Telegram group