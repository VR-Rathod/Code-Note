---
seoTitle: Garuda Linux Complete Guide – Gaming, Performance & Arch-Based
description: "Comprehensive Garuda Linux reference covering installation, Garuda Gamer tools, Btrfs snapshots, ZRAM, gaming optimizations, GameMode, MangoHud, Proton, Chaotic-AUR, KDE Dr460nized, and system tuning."
keywords: "Garuda Linux, garuda linux guide, garuda gaming, garuda linux tutorial, arch linux gaming, garuda gamer, btrfs snapshots, chaotic aur, gamemode, mangohud, proton, wine, garuda dr460nized, garuda linux notes, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Garuda Linux – Gaming & Performance Guide
enableToc: true
---

- # History
  collapsed:: true
	- ## How
		- Garuda Linux is an **Arch-based** rolling-release Linux distribution focused on **gaming, performance, and aesthetics**.
		- First released in **March 2020** by the Garuda Linux team — a community project based in India.
		- Built on top of **Arch Linux** — uses the same pacman package manager and AUR ecosystem.
		- Ships with the **linux-zen** kernel by default — optimized for desktop responsiveness and gaming.
		- Uses **Btrfs** with **automatic Snapper snapshots** — every pacman transaction creates a snapshot.
	- ## Who
		- Founded by **dr460nf1r3 (Nico)**, **TNE**, **Librewish (Shrinivas Kumbhar)**, and other community contributors.
		- Maintained by the **Garuda Linux Team** — fully community-driven, no corporate backing.
		- Based in **India** — one of the few major distros with Indian roots.
	- ## Why
		- Arch Linux is powerful but requires manual setup for gaming and performance tuning.
		- Goal: deliver a **ready-to-game Arch experience** out of the box — no manual tweaking needed.
		- Combines Arch's cutting-edge packages with automated performance optimizations, beautiful theming, and safety nets (Btrfs snapshots).
- # Introduction
  collapsed:: true
	- ## What is Garuda Linux?
		- A rolling-release, Arch-based Linux distro designed for **gaming, performance, and daily desktop use**.
		- Ships with the **linux-zen** kernel, **Btrfs + auto-snapshots**, **ZRAM**, and gaming tools pre-configured.
		- Default desktop: **Dr460nized KDE Plasma** — a heavily customized, visually stunning KDE setup.
		- Uses **pacman + Chaotic-AUR** — access to all Arch packages plus thousands of pre-built AUR packages.
	- ## Garuda Editions
		- ```
		  Garuda Dr460nized       → KDE Plasma (default, most popular, gaming-focused)
		  Garuda Dr460nized Gaming → Dr460nized + full gaming suite pre-installed
		  Garuda GNOME            → GNOME desktop variant
		  Garuda Xfce             → lightweight Xfce desktop
		  Garuda Cinnamon         → Cinnamon desktop (familiar for Mint users)
		  Garuda MATE             → MATE desktop
		  Garuda LXQt-kwin        → ultra-lightweight LXQt
		  Garuda Wayfire          → Wayland compositor (experimental/advanced)
		  Garuda Sway             → tiling Wayland WM
		  Garuda i3               → tiling X11 WM
		  ```
	- ## Garuda vs Other Gaming Distros
		- | Feature | Garuda Linux | Pop!_OS | Nobara | SteamOS |
		  |---------|-------------|---------|--------|---------|
		  | Base | Arch (rolling) | Ubuntu LTS | Fedora (rolling) | Arch (immutable) |
		  | Kernel | linux-zen | linux-generic | linux-fsync | linux-neptune |
		  | Gaming tools | Pre-installed | Partial | Pre-installed | Steam-focused |
		  | Snapshots | Btrfs auto | No | No | No |
		  | AUR access | Yes (Chaotic-AUR) | No | No | Limited |
		  | Target | Gaming + general | Gaming + creative | Gaming + general | Steam Deck only |
	- ## Advantages
		- Ready-to-game out of the box, linux-zen kernel for low latency, Btrfs auto-snapshots (safe to experiment), Chaotic-AUR (pre-built AUR packages — no compile time), ZRAM enabled by default, beautiful Dr460nized KDE theme, full Arch ecosystem access, rolling release (always latest), Garuda Assistant GUI for system management.
	- ## Disadvantages
		- Rolling release can occasionally break, heavier than vanilla Arch (more pre-installed software), Btrfs snapshots consume disk space over time, not ideal for servers, requires more RAM than lightweight distros (~4GB minimum for Dr460nized), less documentation than Ubuntu/Fedora.
	- ## Use Cases
		- PC gaming (Steam, Lutris, Heroic), daily desktop use, content creation, development workstation, learning Arch Linux with safety nets, performance-critical workloads.
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum (Dr460nized KDE):
		    CPU:   x86_64 dual-core
		    RAM:   4 GB (8 GB recommended)
		    Disk:  30 GB (50 GB recommended for snapshots)
		    GPU:   Any (NVIDIA, AMD, Intel supported)
		  
		  Recommended for Gaming:
		    CPU:   Multi-core 64-bit (Intel/AMD)
		    RAM:   16 GB
		    Disk:  SSD 100 GB+
		    GPU:   NVIDIA GTX 1060+ or AMD RX 580+
		  ```
	- ## Creating Bootable USB
		- ```bash
		  # Download ISO from: https://garudalinux.org/downloads
		  
		  # Using Ventoy (recommended — multi-boot)
		  # Just copy the ISO to the Ventoy USB drive
		  
		  # Using dd (Linux)
		  sudo dd if=Garuda-dr460nized-linux-zen-*.iso of=/dev/sdX bs=4M status=progress
		  sync
		  
		  # Using Rufus (Windows) — select DD mode, not ISO mode
		  ```
	- ## Installation (Calamares Installer)
		- ```
		  1. Boot from USB → "Boot with open source drivers" (AMD/Intel)
		     or "Boot with proprietary drivers" (NVIDIA)
		  2. Try or Install Garuda Linux
		  3. Language & Keyboard
		  4. Partitioning:
		     - Erase disk (recommended — sets up Btrfs automatically)
		     - Manual: /boot/efi (512MB FAT32), / (rest, Btrfs)
		     - Swap: use ZRAM instead (Garuda default — no swap partition needed)
		  5. User creation
		  6. Install → ~10-15 min
		  7. Reboot → remove USB
		  ```
	- ## First Boot Setup
		- ```bash
		  # Garuda Welcome app opens automatically
		  # Run system update first (critical on fresh install)
		  sudo pacman -Syu
		  
		  # Or use Garuda Assistant → System Maintenance → Update System
		  
		  # Install Chaotic-AUR (usually pre-configured, verify):
		  sudo pacman-key --recv-key 3056513887B78AEB --keyserver keyserver.ubuntu.com
		  sudo pacman-key --lsign-key 3056513887B78AEB
		  sudo pacman -U 'https://cdn-mirror.chaotic.cx/chaotic-aur/chaotic-keyring.pkg.tar.zst'
		  sudo pacman -U 'https://cdn-mirror.chaotic.cx/chaotic-aur/chaotic-mirrorlist.pkg.tar.zst'
		  # Add to /etc/pacman.conf:
		  # [chaotic-aur]
		  # Include = /etc/pacman.d/chaotic-mirrorlist
		  
		  # Enable multilib (for 32-bit gaming libraries)
		  # Uncomment in /etc/pacman.conf:
		  # [multilib]
		  # Include = /etc/pacman.d/mirrorlist
		  sudo pacman -Syu
		  ```
	- ## NVIDIA Driver Setup
		- ```bash
		  # Garuda includes nvidia-installer-dkms for easy NVIDIA setup
		  sudo nvidia-installer-dkms
		  # Reboot after installation
		  
		  # Or manually:
		  sudo pacman -S nvidia-dkms nvidia-utils lib32-nvidia-utils nvidia-settings
		  
		  # Check NVIDIA driver is loaded
		  nvidia-smi
		  lsmod | grep nvidia
		  
		  # For older cards (Kepler/Maxwell):
		  sudo pacman -S nvidia-470xx-dkms  # from AUR/Chaotic-AUR
		  ```
- # Package Management
  collapsed:: true
	- ## pacman (Core Package Manager)
		- ```bash
		  # Update system
		  sudo pacman -Syu                   # sync + upgrade all packages
		  sudo pacman -Syuu                  # force downgrade if needed
		  
		  # Install & remove
		  sudo pacman -S package             # install
		  sudo pacman -S package1 package2   # install multiple
		  sudo pacman -R package             # remove (keep deps)
		  sudo pacman -Rs package            # remove + unused deps
		  sudo pacman -Rns package           # remove + deps + config files
		  
		  # Search & info
		  pacman -Ss keyword                 # search repos
		  pacman -Si package                 # package info (remote)
		  pacman -Qi package                 # package info (installed)
		  pacman -Ql package                 # list files in package
		  pacman -Qo /usr/bin/python         # which package owns file
		  pacman -Qs keyword                 # search installed packages
		  pacman -Q                          # list all installed
		  pacman -Qe                         # explicitly installed
		  pacman -Qdt                        # orphaned packages
		  
		  # Cache management
		  sudo pacman -Sc                    # remove old cached packages
		  sudo pacman -Scc                   # remove all cached packages
		  paccache -r                        # keep last 3 versions (pacman-contrib)
		  ```
	- ## Chaotic-AUR (Pre-built AUR Packages)
		- ```bash
		  # Chaotic-AUR is pre-configured on Garuda
		  # It provides pre-compiled AUR packages — no need to compile from source
		  
		  # Search Chaotic-AUR packages
		  pacman -Ss package                 # searches all repos including chaotic-aur
		  
		  # Popular packages available in Chaotic-AUR:
		  sudo pacman -S visual-studio-code-bin
		  sudo pacman -S google-chrome
		  sudo pacman -S spotify
		  sudo pacman -S discord
		  sudo pacman -S heroic-games-launcher
		  sudo pacman -S proton-ge-custom-bin
		  sudo pacman -S mangohud
		  sudo pacman -S gamemode
		  sudo pacman -S bottles
		  ```
	- ## yay / paru (AUR Helpers)
		- ```bash
		  # yay is pre-installed on Garuda
		  yay -Syu                           # update system + AUR packages
		  yay -S package                     # install from AUR
		  yay -Ss keyword                    # search AUR
		  yay -R package                     # remove
		  yay -Yc                            # remove unneeded deps
		  
		  # paru (Rust-based, more features)
		  sudo pacman -S paru                # install paru (from Chaotic-AUR)
		  paru -Syu                          # update all
		  paru -S package                    # install from AUR
		  paru -Ss keyword                   # search
		  paru -c                            # clean orphans
		  ```
	- ## Flatpak
		- ```bash
		  # Flatpak is pre-installed on Garuda
		  flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
		  
		  flatpak install flathub org.gimp.GIMP
		  flatpak update                     # update all Flatpaks
		  flatpak list
		  flatpak uninstall org.gimp.GIMP
		  flatpak run org.gimp.GIMP
		  ```
- # Gaming Setup & Tools
  collapsed:: true
	- ## Steam
		- ```bash
		  # Install Steam (from Chaotic-AUR or multilib)
		  sudo pacman -S steam
		  
		  # Enable Steam Play (Proton) for Windows games
		  # Steam → Settings → Steam Play → Enable Steam Play for all titles
		  # Select Proton version (Proton Experimental or Proton-GE recommended)
		  
		  # Install Proton-GE (better compatibility than official Proton)
		  sudo pacman -S proton-ge-custom-bin   # from Chaotic-AUR
		  # Or use ProtonUp-Qt to manage Proton versions:
		  sudo pacman -S protonup-qt
		  
		  # Steam native runtime libraries
		  sudo pacman -S lib32-mesa lib32-vulkan-icd-loader
		  # For NVIDIA:
		  sudo pacman -S lib32-nvidia-utils
		  # For AMD:
		  sudo pacman -S lib32-vulkan-radeon lib32-amdvlk
		  ```
	- ## Lutris (Multi-Platform Game Manager)
		- ```bash
		  sudo pacman -S lutris
		  
		  # Lutris manages: Steam, GOG, Epic, Battle.net, Origin, emulators
		  # Install Wine dependencies for Lutris:
		  sudo pacman -S wine-staging winetricks
		  sudo pacman -S lib32-gnutls lib32-libldap lib32-libgpg-error
		  sudo pacman -S lib32-sqlite lib32-libpulse
		  
		  # Lutris runners: Wine, DXVK, VKD3D-Proton, DOSBox, ScummVM, emulators
		  # Install DXVK (DirectX → Vulkan translation):
		  sudo pacman -S dxvk-bin            # from Chaotic-AUR
		  ```
	- ## Heroic Games Launcher (Epic + GOG + Amazon)
		- ```bash
		  sudo pacman -S heroic-games-launcher   # from Chaotic-AUR
		  
		  # Heroic supports:
		  # - Epic Games Store (free games, AAA titles)
		  # - GOG Galaxy (DRM-free games)
		  # - Amazon Prime Gaming
		  # Uses Wine/Proton under the hood for Windows games
		  ```
	- ## GameMode (CPU/GPU Performance Boost)
		- ```bash
		  # GameMode is pre-installed on Garuda Gaming edition
		  sudo pacman -S gamemode lib32-gamemode
		  
		  # Enable GameMode service
		  systemctl --user enable --now gamemoded
		  
		  # Run a game with GameMode:
		  gamemoderun ./game
		  gamemoderun steam steam://rungameid/APPID
		  
		  # In Steam: add launch option:
		  # gamemoderun %command%
		  
		  # What GameMode does:
		  # - Sets CPU governor to "performance"
		  # - Applies GPU performance tweaks (NVIDIA/AMD)
		  # - Disables CPU mitigations temporarily
		  # - Renice game process for priority
		  # - Inhibits screensaver/sleep
		  
		  # Check GameMode status:
		  gamemoded -s
		  ```
	- ## MangoHud (In-Game Performance Overlay)
		- ```bash
		  sudo pacman -S mangohud lib32-mangohud
		  
		  # Run with MangoHud:
		  mangohud ./game
		  mangohud steam steam://rungameid/APPID
		  
		  # In Steam launch options:
		  # mangohud %command%
		  
		  # MangoHud shows: FPS, frametime, CPU/GPU usage, temps, VRAM, RAM
		  
		  # Config file: ~/.config/MangoHud/MangoHud.conf
		  # Example config:
		  # fps
		  # cpu_stats
		  # gpu_stats
		  # ram
		  # vram
		  # cpu_temp
		  # gpu_temp
		  # frametime
		  # position=top-left
		  # font_size=24
		  
		  # GOverlay — GUI for MangoHud config:
		  sudo pacman -S goverlay
		  ```
	- ## Wine & DXVK (Windows Games without Steam)
		- ```bash
		  # Wine — run Windows .exe files
		  sudo pacman -S wine-staging winetricks
		  
		  # Create a Wine prefix (isolated Windows environment)
		  WINEPREFIX=~/.wine32 WINEARCH=win32 wine wineboot
		  WINEPREFIX=~/.wine64 wine wineboot
		  
		  # Install DirectX, Visual C++ runtimes via winetricks
		  winetricks d3dx9 d3dx11 vcrun2019 dotnet48
		  
		  # DXVK — DirectX 9/10/11 → Vulkan (much better performance)
		  sudo pacman -S dxvk-bin
		  WINEPREFIX=~/.wine64 setup_dxvk install
		  
		  # VKD3D-Proton — DirectX 12 → Vulkan
		  sudo pacman -S vkd3d-proton-bin   # from Chaotic-AUR
		  
		  # Bottles — GUI Wine manager (easier than raw Wine)
		  sudo pacman -S bottles
		  ```
	- ## Emulation
		- ```bash
		  # RetroArch (multi-system emulator frontend)
		  sudo pacman -S retroarch retroarch-assets-xmb
		  
		  # Individual emulators
		  sudo pacman -S dolphin-emu          # GameCube / Wii
		  sudo pacman -S rpcs3               # PlayStation 3 (from Chaotic-AUR)
		  sudo pacman -S yuzu                # Nintendo Switch (from Chaotic-AUR)
		  sudo pacman -S pcsx2               # PlayStation 2
		  sudo pacman -S ppsspp              # PSP
		  sudo pacman -S desmume             # Nintendo DS
		  sudo pacman -S mgba                # Game Boy Advance
		  sudo pacman -S cemu               # Wii U (from Chaotic-AUR)
		  
		  # Emulation Station DE (frontend for all emulators)
		  sudo pacman -S emulationstation-de
		  ```
- # Performance Tuning
  collapsed:: true
	- ## linux-zen Kernel
		- ```bash
		  # Garuda ships linux-zen by default — optimized for desktop/gaming
		  uname -r                           # check current kernel
		  # Should show: x.x.x-zen1-x-zen
		  
		  # Available kernels (install via pacman):
		  # linux-zen      → low-latency, desktop/gaming (Garuda default)
		  # linux-tkg-pds  → TKG patchset, best for gaming (from Chaotic-AUR)
		  # linux-tkg-bmq  → BMQ scheduler variant
		  # linux-cachyos  → CachyOS optimized kernel (from Chaotic-AUR)
		  # linux-xanmod   → XanMod kernel with extra patches
		  # linux           → vanilla Arch kernel
		  # linux-lts       → long-term support kernel (most stable)
		  
		  # Install alternative kernel:
		  sudo pacman -S linux-tkg-pds linux-tkg-pds-headers
		  # Select at GRUB boot menu
		  
		  # Check kernel scheduler:
		  cat /sys/kernel/debug/sched/features
		  ```
	- ## ZRAM (Compressed RAM Swap)
		- ```bash
		  # ZRAM is enabled by default on Garuda — no swap partition needed
		  # ZRAM creates a compressed block device in RAM for swap
		  # Much faster than disk swap, reduces I/O
		  
		  # Check ZRAM status:
		  zramctl
		  swapon --show
		  free -h
		  
		  # ZRAM config: /etc/systemd/zram-generator.conf
		  # [zram0]
		  # zram-size = ram / 2        # use half of RAM
		  # compression-algorithm = zstd
		  
		  # Garuda default: zram-size = min(ram, 8192)
		  # Compression: lz4 (fast) or zstd (better ratio)
		  ```
	- ## CPU Governor & Power Management
		- ```bash
		  # Check current CPU governor
		  cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
		  
		  # Available governors:
		  # performance   → max frequency always (best for gaming)
		  # schedutil     → kernel scheduler-based (Garuda default)
		  # powersave     → minimum frequency (battery saving)
		  # ondemand      → scales with load
		  
		  # Set performance governor (temporary):
		  echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
		  
		  # Permanent via cpupower:
		  sudo pacman -S cpupower
		  sudo cpupower frequency-set -g performance
		  sudo systemctl enable --now cpupower
		  # Edit /etc/default/cpupower: governor='performance'
		  
		  # Garuda uses auto-cpufreq for laptop battery management:
		  sudo pacman -S auto-cpufreq
		  sudo systemctl enable --now auto-cpufreq
		  ```
	- ## GPU Performance
		- ```bash
		  # AMD GPU — enable performance mode
		  echo high | sudo tee /sys/class/drm/card0/device/power_dpm_force_performance_level
		  # Permanent: add to /etc/udev/rules.d/30-amdgpu-pm.rules:
		  # ACTION=="add", KERNEL=="card0", SUBSYSTEM=="drm", DRIVERS=="amdgpu", \
		  # ATTR{device/power_dpm_force_performance_level}="high"
		  
		  # AMD GPU — check info
		  sudo pacman -S radeontop          # GPU usage monitor
		  radeontop
		  
		  # NVIDIA GPU — performance mode
		  sudo nvidia-settings -a "[gpu:0]/GpuPowerMizerMode=1"   # prefer max performance
		  nvidia-smi -q -d PERFORMANCE      # check performance state
		  
		  # Check GPU info
		  lspci | grep -i vga
		  glxinfo | grep "OpenGL renderer"
		  vulkaninfo | grep "GPU id"
		  ```
	- ## Btrfs Snapshots & System Safety
		- ```bash
		  # Garuda auto-creates Btrfs snapshots before every pacman transaction
		  # If an update breaks your system → boot from snapshot in GRUB
		  
		  # List snapshots:
		  sudo snapper -c root list
		  sudo btrfs subvolume list /
		  
		  # Create manual snapshot (before risky changes):
		  sudo snapper -c root create --description "before nvidia driver install"
		  
		  # Rollback to snapshot:
		  sudo snapper -c root undochange 1..0   # undo changes from snapshot 1 to now
		  # Or: boot from snapshot in GRUB → Garuda Linux snapshots menu
		  
		  # Delete old snapshots (free disk space):
		  sudo snapper -c root delete 3
		  sudo snapper -c root delete 1-5        # delete range
		  
		  # Snapper config: /etc/snapper/configs/root
		  # TIMELINE_LIMIT_HOURLY="5"
		  # TIMELINE_LIMIT_DAILY="7"
		  # TIMELINE_LIMIT_WEEKLY="0"
		  # TIMELINE_LIMIT_MONTHLY="0"
		  # TIMELINE_LIMIT_YEARLY="0"
		  
		  # Check Btrfs filesystem usage:
		  sudo btrfs filesystem usage /
		  sudo btrfs filesystem df /
		  ```
	- ## Kernel Parameters for Gaming
		- ```bash
		  # /etc/default/grub — add to GRUB_CMDLINE_LINUX_DEFAULT:
		  # mitigations=off          → disable CPU security mitigations (5-15% perf gain, security risk)
		  # nowatchdog               → disable watchdog timer
		  # nmi_watchdog=0           → disable NMI watchdog
		  # quiet splash             → clean boot
		  # threadirqs               → thread IRQs for lower latency
		  
		  # Garuda Gaming default cmdline:
		  # quiet splash rd.udev.log_priority=3 vt.global_cursor_default=0
		  # loglevel=3 ibt=off
		  
		  # After editing /etc/default/grub:
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # Sysctl tweaks for gaming (/etc/sysctl.d/99-gaming.conf):
		  # vm.swappiness = 10
		  # vm.vfs_cache_pressure = 50
		  # kernel.nmi_watchdog = 0
		  # net.core.netdev_max_backlog = 16384
		  sudo sysctl -p /etc/sysctl.d/99-gaming.conf
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Boot Process
		- ```
		  Power On
		    → UEFI/BIOS POST
		    → GRUB2 bootloader (with Btrfs snapshot entries)
		    → linux-zen kernel decompresses
		    → initramfs (mkinitcpio-generated)
		    → systemd (PID 1)
		    → Targets: sysinit → basic → graphical
		    → SDDM display manager → Dr460nized KDE Plasma
		  ```
	- ## Linux File System Hierarchy (FHS)
		- ```
		  /           Root filesystem (Btrfs @ subvolume)
		  ├── /boot   Kernel, initramfs, GRUB2
		  ├── /dev    Device files
		  ├── /etc    System configuration
		  ├── /home   User home dirs (Btrfs @home subvolume)
		  ├── /opt    Optional software (Steam, games)
		  ├── /proc   Virtual: process + kernel info
		  ├── /root   Root user home
		  ├── /run    Runtime data
		  ├── /srv    Service data
		  ├── /sys    Virtual: hardware info
		  ├── /tmp    Temporary files (tmpfs — RAM)
		  ├── /usr    Programs, libraries, docs
		  │   ├── /usr/bin    User commands
		  │   ├── /usr/lib    Libraries
		  │   └── /usr/share  Shared data
		  └── /var    Variable data (logs, cache, pacman db)
		  
		  Garuda Btrfs subvolumes (default layout):
		    @           → mounted at /
		    @home       → mounted at /home
		    @cache      → mounted at /var/cache
		    @log        → mounted at /var/log
		    @snapshots  → Snapper snapshot storage
		  ```
	- ## GRUB & Snapshot Boot
		- ```bash
		  # Garuda installs grub-btrfs — GRUB shows Btrfs snapshots as boot entries
		  # If system breaks after update:
		  # 1. Reboot → GRUB menu → "Garuda Linux snapshots"
		  # 2. Select a snapshot from before the problem
		  # 3. Boot into it (read-only snapshot)
		  # 4. From inside snapshot, run: sudo garuda-update (or pacman rollback)
		  # 5. Or: sudo snapper rollback <number>
		  
		  # Update GRUB snapshot list:
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  
		  # grub-btrfs auto-updates on snapshot creation (systemd path unit)
		  systemctl status grub-btrfsd
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell & Terminal
		- ```bash
		  # Garuda Dr460nized uses fish shell by default
		  echo $SHELL                        # /usr/bin/fish
		  
		  # fish features: auto-suggestions, syntax highlighting, tab completion
		  # No need to source config — fish auto-loads ~/.config/fish/config.fish
		  
		  # Switch to bash/zsh if preferred:
		  chsh -s /bin/bash
		  chsh -s /bin/zsh
		  sudo pacman -S zsh zsh-autosuggestions zsh-syntax-highlighting
		  
		  # Default terminal: Konsole (KDE) or Alacritty (GPU-accelerated)
		  sudo pacman -S alacritty          # fast GPU terminal
		  sudo pacman -S kitty              # another GPU terminal
		  ```
	- ## Essential Commands
		- ```bash
		  # File operations
		  ls -la / exa -la / lsd -la        # list files (exa/lsd are modern ls replacements)
		  sudo pacman -S exa lsd bat        # install modern CLI tools
		  bat file.txt                      # cat with syntax highlighting
		  fd pattern                        # modern find replacement
		  rg pattern                        # ripgrep — fast grep
		  
		  # System info
		  neofetch                          # system info + ASCII art (pre-installed)
		  fastfetch                         # faster neofetch alternative
		  btop                              # modern htop (pre-installed on Garuda)
		  
		  # Disk usage
		  df -hT                            # disk space + filesystem type
		  dust                              # modern du replacement
		  sudo pacman -S dust ncdu
		  
		  # Process management
		  btop / htop / top                 # process monitor
		  kill PID / killall name           # kill process
		  ```
	- ## fish Shell Basics
		- ```fish
		  # fish config: ~/.config/fish/config.fish
		  
		  # Variables
		  set name "Garuda"
		  echo $name
		  
		  # Functions
		  function greet
		      echo "Hello, $argv[1]"
		  end
		  greet "World"
		  
		  # Aliases (fish calls them abbreviations)
		  abbr -a update 'sudo pacman -Syu'
		  abbr -a install 'sudo pacman -S'
		  
		  # Conditionals
		  if test $status -eq 0
		      echo "Success"
		  else
		      echo "Failed"
		  end
		  
		  # Loops
		  for i in (seq 1 5)
		      echo $i
		  end
		  ```
- # Garuda Tools & GUI Apps
  collapsed:: true
	- ## Garuda Assistant
		- ```
		  Launch: Garuda Assistant (system tray or app menu)
		  
		  Tabs:
		  - Maintenance  → update system, clear cache, fix pacman db, remove orphans
		  - Settings     → enable/disable services, swap, ZRAM
		  - Tweaks       → apply performance tweaks, gaming mode
		  - Diagnostics  → system info, logs, hardware report
		  
		  # CLI equivalent of common Garuda Assistant tasks:
		  sudo pacman -Syu                   # update system
		  sudo pacman -Rns $(pacman -Qdtq)   # remove orphans
		  sudo pacman -Sc                    # clear package cache
		  sudo pacman-db-upgrade             # upgrade pacman database
		  ```
	- ## Garuda Gamer
		- ```bash
		  # Garuda Gamer is a GUI tool for installing gaming software
		  # Launch: Garuda Gamer (app menu)
		  
		  # Categories in Garuda Gamer:
		  # - Game Launchers: Steam, Lutris, Heroic, Bottles, GameHub
		  # - Wine/Proton: Wine-staging, Proton-GE, DXVK, VKD3D
		  # - Emulators: RetroArch, Dolphin, RPCS3, Yuzu, PCSX2
		  # - Tools: MangoHud, GameMode, GOverlay, ProtonUp-Qt
		  # - Streaming: OBS, Sunshine (game streaming server)
		  
		  # Install Garuda Gamer if not present:
		  sudo pacman -S garuda-gamer
		  ```
	- ## Garuda Boot Options (GRUB)
		- ```
		  GRUB menu entries on Garuda:
		  - Garuda Linux          → normal boot (linux-zen)
		  - Garuda Linux (fallback) → fallback initramfs
		  - Garuda Linux snapshots → boot from Btrfs snapshot
		  - UEFI Firmware Settings → BIOS/UEFI setup
		  
		  # Edit GRUB timeout:
		  sudo nano /etc/default/grub
		  # GRUB_TIMEOUT=5
		  sudo grub-mkconfig -o /boot/grub/grub.cfg
		  ```
	- ## System Maintenance
		- ```bash
		  # Full system update (pacman + AUR):
		  garuda-update                      # Garuda's update wrapper (recommended)
		  # or:
		  sudo pacman -Syu && yay -Syu
		  
		  # Remove orphaned packages:
		  sudo pacman -Rns $(pacman -Qdtq)
		  
		  # Clear package cache (keep last 3 versions):
		  paccache -r
		  
		  # Fix broken pacman database:
		  sudo pacman-db-upgrade
		  sudo pacman -Fy                    # sync file database
		  
		  # Fix pacman lock (if pacman crashed):
		  sudo rm /var/lib/pacman/db.lck
		  
		  # Reinstall all packages (nuclear option):
		  sudo pacman -Qqn | sudo pacman -S -
		  
		  # Check for failed systemd services:
		  systemctl --failed
		  
		  # Disk usage analysis:
		  sudo ncdu /
		  sudo btrfs filesystem usage /
		  ```
- # Networking
  collapsed:: true
	- ## Network Management
		- ```bash
		  # Garuda uses NetworkManager (same as most desktop distros)
		  nmcli device status                # show all devices
		  nmcli connection show              # all connections
		  
		  # Wi-Fi
		  nmcli device wifi list             # scan networks
		  nmcli device wifi connect "SSID" password "password"
		  
		  # Static IP
		  nmcli connection modify "Wired connection 1" \
		    ipv4.method manual \
		    ipv4.addresses "192.168.1.100/24" \
		    ipv4.gateway "192.168.1.1" \
		    ipv4.dns "8.8.8.8"
		  nmcli connection up "Wired connection 1"
		  
		  # Network info
		  ip a                               # interfaces + IPs
		  ip route                           # routing table
		  ss -tulnp                          # listening ports
		  ```
	- ## Firewall
		- ```bash
		  # Garuda uses firewalld (same as Fedora)
		  sudo systemctl enable --now firewalld
		  sudo firewall-cmd --list-all
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --permanent --add-port=25565/tcp   # Minecraft server
		  sudo firewall-cmd --reload
		  
		  # Or use UFW (simpler):
		  sudo pacman -S ufw
		  sudo ufw enable
		  sudo ufw allow ssh
		  sudo ufw allow 80/tcp
		  sudo ufw status
		  ```
	- ## SSH
		- ```bash
		  sudo pacman -S openssh
		  sudo systemctl enable --now sshd
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --reload
		  
		  ssh-keygen -t ed25519 -C "your@email.com"
		  ssh-copy-id user@host
		  ssh user@host
		  ```
- # User & Group Management
  collapsed:: true
	- ## User Commands
		- ```bash
		  sudo useradd -m -s /bin/fish username
		  sudo passwd username
		  sudo usermod -aG wheel username    # add to wheel (sudo) group
		  sudo usermod -aG gamemode username # add to gamemode group
		  sudo userdel -r username
		  id username
		  groups username
		  ```
	- ## sudo Configuration
		- ```bash
		  # Garuda uses the "wheel" group for sudo (same as Arch/Fedora)
		  sudo visudo
		  # Uncomment: %wheel ALL=(ALL:ALL) ALL
		  
		  # Passwordless sudo (for gaming/automation — less secure):
		  # %wheel ALL=(ALL:ALL) NOPASSWD: ALL
		  ```
- # Systemd & Services
  collapsed:: true
	- ## systemctl
		- ```bash
		  systemctl status servicename
		  sudo systemctl start|stop|restart servicename
		  sudo systemctl enable|disable servicename
		  systemctl list-units --type=service --state=running
		  systemctl --failed                 # show failed services
		  sudo systemctl daemon-reload
		  ```
	- ## Gaming-Related Services
		- ```bash
		  # GameMode daemon
		  systemctl --user status gamemoded
		  systemctl --user enable --now gamemoded
		  
		  # Sunshine (game streaming server — GeForce NOW alternative)
		  sudo pacman -S sunshine
		  sudo systemctl enable --now sunshine
		  # Web UI: https://localhost:47990
		  
		  # Pipewire (audio — pre-installed, replaces PulseAudio)
		  systemctl --user status pipewire
		  systemctl --user status wireplumber
		  pactl info                         # audio server info
		  ```
- # Dr460nized KDE Desktop
  collapsed:: true
	- ## KDE Plasma Basics
		- ```
		  Super key          → Application launcher (KRunner)
		  Super + Tab        → Switch windows
		  Alt + Tab          → Switch windows (classic)
		  Super + D          → Show desktop
		  Super + E          → File manager (Dolphin)
		  Super + L          → Lock screen
		  Ctrl + Alt + T     → Terminal
		  Super + PrtSc      → Screenshot (Spectacle)
		  Super + Shift + S  → Screenshot region
		  ```
	- ## KDE Customization
		- ```bash
		  # KDE System Settings → Appearance → Global Theme
		  # Garuda Dr460nized uses: Sweet theme + Latte Dock + custom icons
		  
		  # Install additional themes:
		  sudo pacman -S kvantum-qt5         # Kvantum theme engine
		  sudo pacman -S latte-dock          # macOS-style dock
		  
		  # KDE Plasma widgets (right-click desktop → Add Widgets)
		  # Useful widgets: System Monitor, Weather, Clipboard, Notes
		  
		  # Virtual desktops
		  # System Settings → Workspace → Virtual Desktops
		  # Ctrl + F1/F2/F3/F4 → switch desktops
		  # Meta + Ctrl + Left/Right → switch desktops
		  ```
	- ## Display & HiDPI
		- ```bash
		  # KDE Wayland session (recommended for HiDPI):
		  # Select "Plasma (Wayland)" at SDDM login screen
		  
		  echo $WAYLAND_DISPLAY              # check if Wayland active
		  echo $XDG_SESSION_TYPE             # "wayland" or "x11"
		  
		  # HiDPI scaling: System Settings → Display → Global Scale
		  # Fractional scaling supported natively on Wayland
		  
		  # Multi-monitor: System Settings → Display → Arrangement
		  ```
- # Developer Setup
  collapsed:: true
	- ## Programming Languages
		- ```bash
		  # Python
		  sudo pacman -S python python-pip
		  python -m venv myenv && source myenv/bin/activate
		  
		  # Node.js
		  sudo pacman -S nodejs npm
		  # or via nvm:
		  yay -S nvm
		  nvm install --lts
		  
		  # Rust
		  sudo pacman -S rustup
		  rustup default stable
		  
		  # Go
		  sudo pacman -S go
		  
		  # Java
		  sudo pacman -S jdk-openjdk
		  
		  # C/C++
		  sudo pacman -S base-devel gcc cmake gdb
		  ```
	- ## IDEs & Editors
		- ```bash
		  # VS Code
		  sudo pacman -S visual-studio-code-bin   # from Chaotic-AUR
		  # or:
		  flatpak install flathub com.visualstudio.code
		  
		  # JetBrains Toolbox
		  yay -S jetbrains-toolbox
		  
		  # Neovim
		  sudo pacman -S neovim
		  
		  # Vim
		  sudo pacman -S vim
		  ```
	- ## Git
		- ```bash
		  sudo pacman -S git
		  git config --global user.name "Your Name"
		  git config --global user.email "you@example.com"
		  git config --global init.defaultBranch main
		  ssh-keygen -t ed25519 -C "you@example.com"
		  cat ~/.ssh/id_ed25519.pub          # copy to GitHub
		  ```
	- ## Containers (Docker / Podman)
		- ```bash
		  # Docker
		  sudo pacman -S docker docker-compose
		  sudo systemctl enable --now docker
		  sudo usermod -aG docker $USER
		  
		  # Podman (rootless, Docker-compatible)
		  sudo pacman -S podman podman-compose
		  podman run -it fedora:latest bash
		  ```
- # Troubleshooting
  collapsed:: true
	- ## System Won't Boot After Update
		- ```
		  1. Reboot → GRUB menu → "Garuda Linux snapshots"
		  2. Select snapshot from before the update
		  3. Boot into it
		  4. Open terminal → run: sudo snapper rollback <snapshot-number>
		     or: sudo pacman -U /var/cache/pacman/pkg/package-old-version.pkg.tar.zst
		  5. Reboot normally
		  ```
	- ## Pacman Errors
		- ```bash
		  # Error: failed to synchronize databases
		  sudo pacman -Syy                   # force refresh all databases
		  
		  # Error: signature is unknown trust
		  sudo pacman-key --refresh-keys
		  sudo pacman -S archlinux-keyring garuda-keyring
		  
		  # Error: database is locked
		  sudo rm /var/lib/pacman/db.lck
		  
		  # Partial upgrade issues (never do pacman -Sy without -u)
		  sudo pacman -Syu                   # always full upgrade
		  
		  # Reinstall broken package:
		  sudo pacman -S --overwrite '*' package
		  ```
	- ## NVIDIA Issues
		- ```bash
		  # Black screen after NVIDIA install:
		  # Boot from snapshot → reinstall drivers
		  sudo pacman -S nvidia-dkms nvidia-utils
		  
		  # Check NVIDIA is working:
		  nvidia-smi
		  glxinfo | grep "OpenGL renderer"
		  
		  # Force NVIDIA for specific app (Optimus laptops):
		  __NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia app
		  # Or use prime-run:
		  sudo pacman -S nvidia-prime
		  prime-run game
		  ```
	- ## Audio Issues
		- ```bash
		  # Check Pipewire status:
		  systemctl --user status pipewire wireplumber
		  
		  # Restart audio:
		  systemctl --user restart pipewire wireplumber
		  
		  # Check audio devices:
		  pactl list sinks short
		  pactl list sources short
		  
		  # Set default output:
		  pactl set-default-sink sink-name
		  
		  # Install PulseAudio compatibility (if app needs it):
		  sudo pacman -S pipewire-pulse
		  ```
	- ## Gaming Performance Issues
		- ```bash
		  # Check if GameMode is active:
		  gamemoded -s
		  
		  # Check CPU governor:
		  cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
		  
		  # Check GPU usage:
		  radeontop                          # AMD
		  nvidia-smi dmon                    # NVIDIA
		  
		  # Check for thermal throttling:
		  watch -n 1 "cat /sys/class/thermal/thermal_zone*/temp"
		  
		  # Enable fsync (better than esync for Wine/Proton):
		  # Use linux-tkg kernel which has fsync built-in
		  # Or check: ulimit -Hn (should be > 524288)
		  # Add to /etc/security/limits.conf:
		  # * hard nofile 524288
		  ```
- # More Learn
	- ## Github & Webs
		- [Garuda Linux Official Website](https://garudalinux.org/)
		- [Garuda Linux Documentation](https://wiki.garudalinux.org/)
		- [Garuda Linux Forum](https://forum.garudalinux.org/)
		- [Arch Linux Wiki](https://wiki.archlinux.org/) — the best Linux wiki, applies to Garuda
		- [ProtonDB — Game Compatibility Reports](https://www.protondb.com/)
		- [Lutris Game Database](https://lutris.net/games)
		- [Heroic Games Launcher](https://heroicgameslauncher.com/)
		- [MangoHud GitHub](https://github.com/flightlessmango/MangoHud)
		- [GameMode GitHub](https://github.com/FeralInteractive/gamemode)
		- [Chaotic-AUR](https://aur.chaotic.cx/)
		- [Snapper Documentation](http://snapper.io/documentation.html)
		- [[Arch Linux]] — Garuda is built on Arch — all Arch knowledge applies
		- [[Kali Linux]] — security tools available on Garuda via AUR
		- [[Linux Advanced]] — kernel internals, performance tuning, hardening
		- [[Game Development]] — game engine and development notes
	- ## Master Playlists YouTube
		- [Garuda Linux Gaming Setup Guide](https://www.youtube.com/results?search_query=garuda+linux+gaming+setup)
		- [Linux Gaming with Proton and Steam](https://www.youtube.com/results?search_query=linux+gaming+proton+steam+tutorial)
		- [MangoHud and GameMode Tutorial](https://www.youtube.com/results?search_query=mangohud+gamemode+linux+tutorial)
		- [Arch Linux Btrfs Snapshots Guide](https://www.youtube.com/results?search_query=arch+linux+btrfs+snapper+snapshots)
		- [Wine and DXVK Linux Gaming](https://www.youtube.com/results?search_query=wine+dxvk+linux+gaming+tutorial)
		- [Lutris Linux Game Manager](https://www.youtube.com/results?search_query=lutris+linux+game+manager+tutorial)