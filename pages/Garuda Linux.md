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
	- ## Package Resolution Pipeline
		- ```mermaid
		  graph TD
		      UserQuery[User runs pacman/yay Command] --> CacheCheck{Is package in local package database cache?}
		      CacheCheck -->|Yes| LocalInstall[Install instantly from local cache /var/cache/pacman/pkg]
		      CacheCheck -->|No| RepoSearch[Search configured repositories in /etc/pacman.conf]
		      RepoSearch --> CoreExtra[1. Search official core & extra repositories]
		      RepoSearch --> ChaoticAUR[2. Search pre-built Chaotic-AUR mirrorlist]
		      RepoSearch --> UserSelect{Is package found in binary repositories?}
		      UserSelect -->|Yes| DownloadBinary[Download pre-compiled ZSTD package]
		      UserSelect -->|No| AURSearch[Search Arch User Repository AUR via yay/paru]
		      AURSearch --> BuildAUR{Found in AUR?}
		      BuildAUR -->|Yes| CloneBuild[Clone PKGBUILD, check dependencies, and build from source code]
		      BuildAUR -->|No| Error([Package not found in any repository])
		      DownloadBinary --> InstallSync[Install package & register in local pacman DB]
		      CloneBuild --> InstallSync
		  ```
	- ## pacman (Core Package Manager)
		- ```bash
		  # Update system
		  sudo pacman -Syu                   # sync + upgrade all packages
		  sudo pacman -Syuu                  # force downgrade if needed (dangerous, use with care)
		  
		  # Install & remove
		  sudo pacman -S package             # install
		  sudo pacman -S package1 package2   # install multiple packages
		  sudo pacman -R package             # remove (leaves dependencies behind)
		  sudo pacman -Rs package            # remove package + its unneeded dependencies
		  sudo pacman -Rns package           # remove package + unneeded deps + configuration files
		  
		  # Search & query
		  pacman -Ss keyword                 # search remote database for keyword
		  pacman -Si package                 # display remote package detailed information
		  pacman -Qi package                 # display locally installed package info
		  pacman -Ql package                 # list all files owned by package
		  pacman -Qo /usr/bin/python         # query package that owns a specific file path
		  pacman -Qs keyword                 # search locally installed packages for keyword
		  pacman -Q                          # list all installed packages
		  pacman -Qe                         # list explicitly installed packages
		  pacman -Qdt                        # list orphaned packages (installed as dependency but no longer needed)
		  
		  # Cache management (Crucial for Btrfs space)
		  sudo pacman -Sc                    # remove uninstalled package archives from cache
		  sudo pacman -Scc                   # remove all cached package archives
		  sudo paccache -r                   # keep only the last 3 versions of active packages
		  sudo paccache -rk 1                # keep only the last 1 version (extreme cleanup)
		  ```
		- ### Advanced Pacman Configuration & Troubleshooting
			- **Optimize Mirror Speeds**:
				- ```bash
				  # Install rate-mirrors (much faster and more accurate than reflector)
				  sudo pacman -S rate-mirrors
				  
				  # Test and update Arch mirrors
				  rate-mirrors arch | sudo tee /etc/pacman.d/mirrorlist
				  
				  # Test and update Chaotic-AUR mirrors
				  rate-mirrors chaotic | sudo tee /etc/pacman.d/chaotic-mirrorlist
				  ```
			- **Creating Custom Pacman Hooks**:
				- Custom hooks let you run scripts automatically before or after package installations. Created in `/etc/pacman.d/hooks/`.
				- *Example Hook*: Auto-clean old package caches after every upgrade transaction (`/etc/pacman.d/hooks/clean_cache.hook`):
				- ```ini
				  [Trigger]
				  Operation = Upgrade
				  Operation = Install
				  Type = Package
				  Target = *
				  
				  [Action]
				  Description = Cleaning old pacman cache...
				  When = PostTransaction
				  Exec = /usr/bin/paccache -r
				  ```
			- **Signature verification errors (Keyring Repair)**:
				- If you receive `invalid or corrupted package (PGP signature)` errors:
				- ```bash
				  # 1. Reset Pacman key database
				  sudo rm -rf /etc/pacman.d/gnupg
				  sudo pacman-key --init
				  sudo pacman-key --populate archlinux garuda
				  
				  # 2. Update keyring packages specifically
				  sudo pacman -Sy archlinux-keyring garuda-keyring
				  
				  # 3. Force sync and update key database
				  sudo pacman-key --refresh-keys
				  sudo pacman -Syu
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
		- ### Translation Stack Architecture
			- ```mermaid
			  graph TD
			      WinApp["Windows Game/Executable (.exe)"] -->|Calls Win32/DirectX APIs| WineTranslation["Wine translation layer / Proton"]
			      
			      subgraph Wine Translation Stack
			          WineTranslation -->|Win32/POSIX API Translation| SystemCalls["Linux System Calls (kernel)"]
			          WineTranslation -->|DirectX 9/10/11 Calls| DXVK["DXVK (Translates DX9/10/11 to Vulkan)"]
			          WineTranslation -->|DirectX 12 Calls| VKD3D["VKD3D-Proton (Translates DX12 to Vulkan)"]
			      end
			      
			      SystemCalls --> Kernel["linux-zen kernel"]
			      DXVK --> VulkanDrivers["Vulkan Driver (Mesa / NVIDIA)"]
			      VKD3D --> VulkanDrivers
			      
			      VulkanDrivers --> GPU["GPU Hardware (AMD / NVIDIA / Intel)"]
			      Kernel --> GraphicServer["Display Server (Wayland via Xwayland / X11)"]
			  ```
			- **Translation Phases**:
				- **1. Win32 API Mapping**: Wine translates Windows API calls (like memory allocation, threading, and window creation) directly into POSIX standards and Linux system calls in real-time, eliminating emulator overhead.
				- **2. DirectX Translation**:
					- **DXVK** intercepts Direct3D 9, 10, and 11 calls and translates them to Vulkan command buffers. This bypasses the old, slower OpenGL translation path.
					- **VKD3D-Proton** maps Direct3D 12 calls to Vulkan. Because D3D12 is structurally similar to Vulkan, this provides low-overhead, high-performance execution.
				- **3. Vulkan Execution**: High-efficiency Vulkan graphics drivers execute the translated rendering pipeline directly on the GPU hardware.
		- ### Core Installation & Configuration
			- ```bash
			  # Wine — run Windows .exe files (Staging has latest experimental fixes)
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
		- ### Advanced Custom Wine Prefix Script
			- Setup a wrapper script to run games under an optimized, isolated Wine prefix with performance environment variables (`run-wine-game.sh`):
			- ```bash
			  #!/usr/bin/env bash
			  # Custom Wine gaming runtime wrapper script
			  
			  # Config directories
			  export WINEPREFIX="${HOME}/.local/share/wineprefixes/gaming_prefix"
			  export WINEARCH="win64"
			  export WINEDEBUG="-all" # Disable debugging for minor performance boost
			  
			  # Performance optimizations
			  export DXVK_HUD="fps,compiler" # Display DXVK FPS and pipeline compile indicators
			  export DXVK_ASYNC=1            # Enable asynchronous pipeline compilation (minimizes stutter)
			  export PROTON_NO_ESYNC=0        # Ensure Eventfd synchronization is allowed
			  export PROTON_NO_FSYNC=0        # Ensure Futex synchronization is allowed (Zen kernel supports fsync)
			  
			  # CPU & GPU Driver optimizations
			  export __GL_THREADED_OPTIMIZATIONS=1 # For NVIDIA cards
			  export mesa_glthread=true            # For AMD/Intel Mesa drivers
			  
			  # Create prefix directory if missing
			  if [ ! -d "$WINEPREFIX" ]; then
			      echo "[*] Initializing gaming Wine prefix at: $WINEPREFIX"
			      mkdir -p "$(dirname "$WINEPREFIX")"
			      wine wineboot --init
			      
			      # Setup DXVK within the new prefix
			      setup_dxvk install
			  fi
			  
			  # Run the targeted game executable
			  if [ -z "$1" ]; then
			      echo "Usage: $0 path/to/game.exe"
			      exit 1
			  fi
			  
			  echo "[*] Executing game under gamemoderun + wine..."
			  gamemoderun wine "$@"
			  ```
		- ### Custom DXVK Configuration File
			- Optimize game behavior by configuring variables in `dxvk.conf` inside the WINEPREFIX or custom path exported via `export DXVK_CONFIG_FILE=/path/to/dxvk.conf`:
			- ```ini
			  # Custom performance overrides for DXVK
			  
			  # Frame Rate & Sync Limits
			  dxgi.tearFree = True
			  dxgi.numBackBuffers = 3
			  d3d9.maxFrameLatency = 1
			  d3d11.maxFrameLatency = 1
			  
			  # VRAM memory management tweaks
			  dxvk.maxChunkSize = 128
			  dxvk.hud = compiler,fps
			  
			  # AMD Smart Access Memory / Resizable BAR cache settings
			  dxgi.deviceMemoryLimit = 0
			  
			  # Game specific optimizations (e.g. override reported GPU)
			  # dxgi.customDeviceId = 0x10de
			  # dxgi.customVendorId = 0x10de
			  ```
		- ### Advanced MangoHud Configurations
			- Create custom tweaks inside `~/.config/MangoHud/MangoHud.conf` to monitor resource bounds in real-time:
			- ```ini
			  # MangoHud configuration
			  
			  # Overlay settings
			  legacy_layout=false
			  horizontal=false
			  position=top-left
			  round_corners=8
			  background_alpha=0.65
			  font_size=20
			  
			  # Metrics
			  fps
			  fps_limit=144
			  toggle_fps_limit=F3
			  
			  # GPU details
			  gpu_stats
			  gpu_temp
			  gpu_core_clock
			  gpu_mem_clock
			  gpu_power
			  
			  # CPU details
			  cpu_stats
			  cpu_temp
			  cpu_mhz
			  cpu_power
			  
			  # Memory details
			  ram
			  vram
			  
			  # Frame details
			  frame_timing
			  frametime
			  
			  # Keybindings
			  toggle_hud=F12
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
		- ### Resource Management & Scheduling Flow
			- ```mermaid
			  graph TD
			      SystemLoad["User Session / Active Gaming"] -->|Triggers performance profile| GameModeDaemon["GameMode Daemon (gamemoded)"]
			      
			      subgraph Resource Allocation Stack
			          GameModeDaemon -->|Configures governor| CPUPower["cpupower (Sets Governor to 'performance')"]
			          GameModeDaemon -->|Applies nice/ioprio| ZenScheduler["Zen Scheduler (BORE / PDS - Prioritizes game execution thread)"]
			          GameModeDaemon -->|Disables temporarily| KernelMitigations["CPU Security Mitigations (via sysctl or reboot)"]
			          GameModeDaemon -->|Optimizes virtual memory| VMManagement["VM / Swap Optimization (ZRAM, Swappiness=10)"]
			      end
			      
			      CPUPower --> CPUCores["High Frequency CPU Cores"]
			      ZenScheduler --> ExecutionPriority["Low Latency Thread Execution"]
			      KernelMitigations --> PerformanceGain["Reduced Kernel-Space CPU Overhead"]
			      VMManagement --> RAMAlloc["Compressed Swap in RAM (No Disk Bottlenecks)"]
			  ```
			- **Resource Allocation Architecture**:
				- **1. CPU Scheduling**: The `linux-zen` kernel utilizes the **BORE (Burst-Oriented Response Enhancer)** scheduler (or similar low-latency schedulers like **PDS** or **BMQ** in custom kernels). It prioritizes interactive tasks (games, audio, user interface) over background services, ensuring zero frame drops even under high background load.
				- **2. Dynamic Power Management**: The kernel works with `cpupower` and `gamemoded` to ramp up CPU core frequencies instantly when a process requests performance execution, overriding standard conservative scaling limits.
				- **3. Compressed Swap (ZRAM)**: Swap requests are handled directly in RAM using compressed ZSTD algorithms, preventing any swap-to-disk disk-access latency.
		- ### Kernel Selection & Installation
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
			  
			  # Check kernel scheduler details:
			  cat /sys/kernel/debug/sched/features
			  ```
		- ### Custom Gaming Sysctl Tuning
			- Configure custom system control parameters in `/etc/sysctl.d/99-gaming.conf` (linked here: [99-gaming.conf](file:///etc/sysctl.d/99-gaming.conf)) to optimize virtual memory, network backlogs, and hardware watchdogs:
			- ```ini
			  # /etc/sysctl.d/99-gaming.conf
			  
			  # Virtual Memory Management
			  vm.swappiness = 10                  # Minimize swapping to disk (use ZRAM)
			  vm.vfs_cache_pressure = 50          # Keep directory and inode caches longer
			  vm.dirty_bytes = 268435456          # Prevent massive disk write operations from freezing UI (256MB)
			  vm.dirty_background_bytes = 67108864 # Flush dirty data earlier (64MB)
			  
			  # Process Scheduling
			  kernel.sched_autogroup_enabled = 0  # Disable autogroup to allow direct thread renicing
			  kernel.nmi_watchdog = 0             # Disable hardware watchdog (frees up CPU execution cycles)
			  
			  # Networking Buffer Limits
			  net.core.netdev_max_backlog = 16384 # Allow larger packet backlog (prevents network drops)
			  net.ipv4.tcp_fastopen = 3           # Enable TCP Fast Open for faster server handshake
			  
			  # File Descriptors
			  fs.file-max = 2097152               # Increase file descriptor limit for heavy modded games
			  ```
			- Apply changes immediately:
				- `sudo sysctl -p /etc/sysctl.d/99-gaming.conf`
		- ### Laptop Power Limits & Energy Profiles
			- Tune thermal and power management on laptops running Garuda to prevent thermal throttling while gaming:
			- ```bash
			  # 1. Install power-profiles-daemon (default for KDE/GNOME interfaces)
			  sudo pacman -S power-profiles-daemon
			  sudo systemctl enable --now power-profiles-daemon
			  
			  # Set execution profile to performance
			  powerprofilesctl set performance
			  powerprofilesctl list
			  
			  # 2. Advanced TLP battery management (alternative to power-profiles-daemon)
			  sudo pacman -S tlp tlp-rdw
			  sudo systemctl enable --now tlp
			  
			  # Configure /etc/tlp.conf settings when plugged in:
			  # CPU_SCALING_GOVERNOR_ON_AC="performance"
			  # CPU_ENERGY_PERF_POLICY_ON_AC="performance"
			  # INTEL_GPU_MIN_FREQ_ON_AC=350
			  # INTEL_GPU_MAX_FREQ_ON_AC=1100
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
		- ```mermaid
		  graph TD
		      PacmanCmd["User executes pacman -Syu / upgrade"] --> LibalpmHook["libalpm triggers pre-transaction hook"]
		      LibalpmHook --> SnapPre["Snapper creates Read-Only pre-snapshot"]
		      SnapPre --> PacmanUpgrade["Pacman performs upgrade modifications on target files"]
		      PacmanUpgrade --> LibalpmPost["libalpm triggers post-transaction hook"]
		      LibalpmPost --> SnapPost["Snapper creates Read-Only post-snapshot"]
		      SnapPost --> GRUBUpdate["systemd unit updates grub-btrfs menu entries"]
		      
		      subgraph "Recovery Options"
		          BootSnap["1. Boot directly from Read-Only pre-snapshot via GRUB"]
		          BootSnap --> VerifySystem["2. System starts in volatile overlay filesystem"]
		          VerifySystem --> CliRollback["3. Run: snapper rollback [snapshot-id]"]
		          CliRollback --> DefaultSubvol["4. Recreates root subvolume pointing to snapshot state"]
		          CliRollback --> Reboot["5. Reboot into recovered system"]
		      end
		  ```
		- ### Snapper & Snapshot Management Commands
			- **List Snapshots**:
				- ```bash
				  # List all snapper-managed snapshots
				  sudo snapper -c root list
				  
				  # List low-level Btrfs subvolumes on /
				  sudo btrfs subvolume list /
				  ```
			- **Create Manual Snapshots**:
				- ```bash
				  # Create manual snapshot with a custom comment
				  sudo snapper -c root create --description "Before testing custom graphic drivers" --userdata "type=manual"
				  ```
			- **Delete Snapshots**:
				- ```bash
				  # Delete single snapshot by ID
				  sudo snapper -c root delete 102
				  
				  # Delete a range of snapshots to free up space
				  sudo snapper -c root delete 105-120
				  ```
			- **System Rollback Workflows**:
				- **Scenario A: Soft Rollback (Undo file modifications from run-time)**:
					- ```bash
					  # Compares files between snapshot 50 and current active filesystem, then replaces modified files
					  sudo snapper -c root undochange 50..0
					  ```
				- **Scenario B: Hard Rollback (System doesn't boot correctly)**:
					- 1. Reboot PC and enter **GRUB Bootloader Menu**.
					- 2. Select **Garuda Linux snapshots** sub-menu and choose the desired pre-update snapshot.
					- 3. The system boots into a read-only overlay layout. Log in, open a terminal, and run:
						- `sudo snapper rollback` (This updates the Btrfs default subvolume symlinks to point to this snapshot as the new active root subvolume).
					- 4. Reboot your system normally.
			- **Customize Retained Snapshot Limits**:
				- Configure snapshots retention limits inside `/etc/snapper/configs/root`:
				- ```ini
				  # Hourly, daily, weekly, monthly, and yearly limits
				  TIMELINE_LIMIT_HOURLY="5"
				  TIMELINE_LIMIT_DAILY="7"
				  TIMELINE_LIMIT_WEEKLY="0"
				  TIMELINE_LIMIT_MONTHLY="0"
				  TIMELINE_LIMIT_YEARLY="0"
				  ```
		- ### Btrfs Filesystem Maintenance
			- **Check Space Allocation**:
				- ```bash
				  # Show detailed space allocation (Metadata, Data, System chunks)
				  sudo btrfs filesystem df /
				  
				  # Show human-readable device space usage
				  sudo btrfs filesystem usage /
				  ```
			- **Filesystem Defragmentation**:
				- ```bash
				  # Recursively defragment files and directories on Btrfs filesystem
				  sudo btrfs filesystem defragment -r -v -czstd /
				  ```
			- **Filesystem Scrub (Data Corruption Check)**:
				- ```bash
				  # Start scrubbing in the background to verify checksums and repair corrupted blocks
				  sudo btrfs scrub start /
				  
				  # Check scrubbing status
				  sudo btrfs scrub status /
				  ```
			- **Filesystem Balance (Chunk Re-allocation)**:
				- ```bash
				  # Rebalance chunks to optimize disk space allocation (reclaims empty chunks)
				  # Only balance chunks that are less than 50% utilized to prevent heavy SSD load
				  sudo btrfs balance start -dusage=50 -musage=50 /
				  
				  # Check balancing status
				  sudo btrfs balance status /
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
		- ```mermaid
		  graph TD
		      PowerOn([Power On]) --> UEFI[UEFI / BIOS POST]
		      UEFI --> GRUB[GRUB 2 Bootloader]
		      GRUB -->|Optional| SnapBoot[Boot into Btrfs Snapshot - Read-Only]
		      GRUB -->|Default| ZenKernel[linux-zen Kernel Loaded]
		      ZenKernel --> Initramfs[initramfs / mkinitcpio]
		      Initramfs --> Systemd[systemd PID 1]
		      Systemd --> Subvolumes[Mount Btrfs Subvolumes: @, @home, @cache, @log]
		      Subvolumes --> Services[Start Services: zram-generator, snapper, NetworkManager]
		      Services --> DisplayManager[SDDM Display Manager]
		      DisplayManager --> KDE[KDE Plasma Dr460nized Desktop]
		  ```
		- ### Step-by-Step Boot Phases
			- **1. UEFI POST**: System hardware verification. UEFI reads NVRAM to locate the bootloader binary (usually `/boot/EFI/BOOT/BOOTX64.EFI` or `/boot/EFI/Garuda/grubx64.efi`).
			- **2. GRUB 2**: The GRUB configuration file `/boot/grub/grub.cfg` is executed. Garuda uses `grub-btrfs` to parse the snapper snapshot subvolumes and generate bootable read-only kernel entries dynamically.
			- **3. Zen Kernel & initramfs**: The system loads `vmlinuz-linux-zen` and the RAM disk image `initramfs-linux-zen.img`. The kernel decompresses, runs hooks defined in `/etc/mkinitcpio.conf` (e.g., keyboard, udev, btrfs), and boots.
			- **4. systemd & Btrfs Mounts**: Control shifts to systemd (PID 1). It mounts Btrfs subvolumes from `/etc/fstab` using specific mount options:
				- `compress=zstd:3` (enables transparent ZSTD compression to save disk space and SSD wear).
				- `noatime` (prevents updating file access times to eliminate constant disk writes).
				- `ssd` (activates SSD-specific performance block allocations).
				- `discard=async` (asynchronously releases unused blocks to keep the SSD fast).
			- **5. SDDM & Desktop**: The display manager SDDM launches the graphical environment, executing the fish shell environment wrappers and starting KDE Plasma Dr460nized.
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
	- ## Dev Environment Bootstrapping Scripts
		- Setup an automated, reproducible script to configure compilers, runtimes, docker access permissions, and workspaces (`bootstrap_dev.sh`):
		- ```bash
		  #!/usr/bin/env bash
		  # Automated Developer Environment Bootstrap Script for Arch/Garuda
		  
		  set -euo pipefail
		  
		  echo "=========================================="
		  echo "   Garuda Dev Environment Bootstrapper    "
		  echo "=========================================="
		  
		  # 1. System Update
		  echo "[*] Syncing repositories and upgrading packages..."
		  sudo pacman -Syu --noconfirm
		  
		  # 2. Base Development Tools
		  echo "[*] Installing build-essential toolchain (gcc, make, patch)..."
		  sudo pacman -S --needed --noconfirm base-devel git curl wget rsync cmake
		  
		  # 3. Docker Installation and Permissions Setup
		  echo "[*] Installing Docker engine and compose utilities..."
		  sudo pacman -S --needed --noconfirm docker docker-compose
		  sudo systemctl enable --now docker.service
		  sudo usermod -aG docker "$USER"
		  echo "[+] Docker setup completed. (Please log out and log back in to apply group privileges)"
		  
		  # 4. Programming Runtimes (Python, Node.js, Rust, Go)
		  echo "[*] Configuring runtime libraries and environments..."
		  sudo pacman -S --needed --noconfirm python python-pip python-virtualenv nodejs npm go
		  
		  # Setup Rust using rustup
		  if ! command -v rustup &> /dev/null; then
		      sudo pacman -S --needed --noconfirm rustup
		      rustup default stable
		  fi
		  
		  # 5. Dev Directory Creation
		  echo "[*] Creating workspace folders..."
		  mkdir -p "${HOME}/Projects" "${HOME}/.local/bin"
		  
		  echo "=========================================="
		  echo "  Bootstrap Completed successfully!       "
		  echo "  Note: Run 'newgrp docker' or reboot to  "
		  echo "  use Docker without sudo.                "
		  echo "=========================================="
		  ```
	- ## Custom Fish Shell Functions
		- Add modular, automated shell routines inside `~/.config/fish/functions/` to boost terminal efficiency:
		- **Python Virtualenv Activator** (`venv.fish`):
			- ```fish
			  # ~/.config/fish/functions/venv.fish
			  function venv --description "Create or activate a Python virtual environment"
			      if test -d .venv
			          source .venv/bin/activate.fish
			          echo "Active Python Virtualenv: "(python -V)
			      else if test -d venv
			          source venv/bin/activate.fish
			          echo "Active Python Virtualenv: "(python -V)
			      else
			          echo "No virtualenv found (.venv/ or venv/). Creating one..."
			          python3 -m venv .venv
			          source .venv/bin/activate.fish
			          pip install --upgrade pip
			      end
			  end
			  ```
		- **Network Port Monitor** (`ports.fish`):
			- ```fish
			  # ~/.config/fish/functions/ports.fish
			  function ports --description "List open and listening ports with process info"
			      sudo ss -tulnp
			  end
			  ```
		- **System Cleaner Hook** (`sysclean.fish`):
			- ```fish
			  # ~/.config/fish/functions/sysclean.fish
			  function sysclean --description "Clean pacman cache, orphaned packages, and snapper history"
			      echo "=========================================="
			      echo "       Running System Cleanup             "
			      echo "=========================================="
			      echo "[*] Removing orphaned packages..."
			      sudo pacman -Rns (pacman -Qdtq) 2>/dev/null; or echo "No orphan packages to remove."
			      
			      echo "[*] Pruning old pacman cached archives..."
			      sudo paccache -r
			      
			      echo "[*] Cleaning user cache..."
			      rm -rf ~/.cache/*
			      
			      echo "=========================================="
			      echo "            Cleanup Complete              "
			      echo "=========================================="
			  end
			  ```
- # Troubleshooting
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