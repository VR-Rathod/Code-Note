---
date: 2026-04-06T11:04:22+05:30
lastmod: 2026-05-18T10:12:55+05:30

seoTitle: Fedora Linux Complete Guide – DNF, Security, Dev & Administration
description: "Comprehensive Fedora Linux reference covering installation, DNF package management, SELinux, Wayland, Flatpak, Podman, Cockpit, Btrfs, networking, hardening, and developer workflows."
keywords: "Fedora Linux, fedora guide, fedora commands, fedora dnf, fedora tutorial, fedora administration, fedora server, fedora workstation, fedora security, SELinux, Wayland, Flatpak, Podman, Cockpit, Btrfs, fedora notes, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Fedora Linux – Complete Guide
enableToc: true
---

- # History
  collapsed:: true
	- ## How
		- Fedora is a **RPM-based** Linux distribution sponsored by **Red Hat** and maintained by the **Fedora Project** community.
		- First released on **November 6, 2003** as "Fedora Core 1", succeeding **Red Hat Linux 9** (discontinued).
		- Follows a **~6-month release cycle** — two releases per year, each supported for ~13 months.
		- Uses a **cutting-edge** model — ships the latest upstream software before it lands in RHEL.
		- Current stable: **Fedora 41** (Workstation, Server, IoT, CoreOS, Silverblue, Kinoite).
	- ## Who
		- Maintained by the **Fedora Project** — a community-driven project sponsored by **Red Hat (IBM)**.
		- Key contributors: Red Hat engineers + global open-source community.
		- **Matthew Miller** — current Fedora Project Leader.
	- ## Why
		- Red Hat Linux was split: **RHEL** (enterprise, paid) and **Fedora** (community, cutting-edge).
		- Goal: be the upstream proving ground for RHEL — new features land in Fedora first, then stabilize into RHEL.
		- Fedora is the distro where **tomorrow's enterprise Linux is built today**.
- # Introduction
  collapsed:: true
	- ## What is Fedora?
		- A general-purpose, cutting-edge Linux OS for desktops, servers, containers, and IoT.
		- Based on **RPM** packages — uses **DNF** (Dandified YUM) package manager.
		- Ships with **GNOME** desktop by default (Workstation). Server edition is CLI-only.
		- Upstream source for **Red Hat Enterprise Linux (RHEL)** and **CentOS Stream**.
	- ## Fedora Editions
		- ```
		  Fedora Workstation   → GNOME desktop, developer-focused
		  Fedora Server        → CLI only, Cockpit web UI, server workloads
		  Fedora IoT           → minimal, for embedded/IoT devices
		  Fedora CoreOS        → immutable, container-optimized, auto-updates
		  Fedora Silverblue    → immutable Workstation (OSTree + Flatpak)
		  Fedora Kinoite       → immutable KDE Plasma variant
		  Fedora Sway Atomic   → immutable Sway WM variant
		  Fedora Spins         → KDE, Xfce, LXDE, MATE, Cinnamon, i3 variants
		  Fedora Labs          → Design Suite, Security Lab, Scientific, Games
		  ```
	- ## Release Naming & Lifecycle
		- ```
		  Format: Fedora <number>  (no codenames)
		  Release cycle: ~6 months (April + October)
		  Support: ~13 months per release (2 releases overlap)
		  EOL: 1 month after the second subsequent release
		  
		  Fedora 39  → released Nov 2023, EOL ~Nov 2024
		  Fedora 40  → released Apr 2024, EOL ~May 2025
		  Fedora 41  → released Oct 2024, EOL ~Nov 2025
		  Fedora 42  → expected Apr 2025
		  ```
	- ## Fedora vs RHEL vs CentOS Stream
		- | Feature | Fedora | CentOS Stream | RHEL |
		  |---------|--------|---------------|------|
		  | Purpose | Cutting-edge upstream | RHEL preview | Enterprise stable |
		  | Release cycle | ~6 months | Rolling (RHEL-tracking) | ~3 years |
		  | Support | ~13 months | ~5 years | 10 years |
		  | Cost | Free | Free | Paid (free ≤16 systems) |
		  | Stability | Bleeding edge | Stable-ish | Very stable |
		  | Package manager | DNF | DNF | DNF |
		  | Target user | Developers, enthusiasts | Servers, CI/CD | Enterprise |
	- ## Advantages
		- Cutting-edge software (latest kernel, GNOME, toolchains), strong SELinux enforcement by default, Wayland-first, Flatpak support, Podman/Buildah (rootless containers), Btrfs default filesystem, excellent developer tooling, free and open-source, strong upstream community, fast path to RHEL skills.
	- ## Disadvantages
		- Shorter support cycle (~13 months), frequent upgrades required, less stable than RHEL/Debian, some proprietary drivers/codecs need extra repos (RPM Fusion), not ideal for long-running production servers, smaller community than Ubuntu.
	- ## Use Cases
		- Developer workstations, upstream testing, learning RHEL/enterprise Linux, container development (Podman), immutable desktop (Silverblue), home servers (Cockpit), security research (Security Lab spin).
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Fedora Workstation (minimum):
		    CPU:   2 GHz dual-core (64-bit)
		    RAM:   2 GB (4 GB recommended)
		    Disk:  15 GB (25 GB recommended)
		    GPU:   1024x768 display
		  
		  Fedora Server (minimum):
		    CPU:   1 GHz 64-bit
		    RAM:   1 GB (2 GB recommended)
		    Disk:  10 GB
		  ```
	- ## Installation Methods
		- Bare metal (Anaconda installer), VirtualBox/VMware, Live USB (`dd` or Fedora Media Writer), WSL2 (limited), Docker (`docker pull fedora`), Cloud (AWS/Azure/GCP official images).
	- ## Creating Bootable USB
		- ```bash
		  # Using Fedora Media Writer (recommended — GUI tool)
		  # Download from: https://fedoraproject.org/workstation/download
		  
		  # Using dd (Linux/macOS)
		  sudo dd if=Fedora-Workstation-Live-x86_64-41.iso of=/dev/sdX bs=4M status=progress
		  sync
		  
		  # Using Ventoy (multi-boot USB)
		  # Just copy the ISO to the Ventoy USB drive
		  ```
	- ## Anaconda Installer Key Steps
		- ```
		  1. Boot from USB → "Install Fedora"
		  2. Language & Keyboard selection
		  3. Installation Destination → select disk
		     - Automatic partitioning (recommended for beginners)
		     - Custom: /boot (1GB), /boot/efi (600MB), swap (2×RAM), / (rest, Btrfs)
		  4. Network & Hostname → configure if needed
		  5. Root Account → disable root login (recommended) or set password
		  6. User Creation → create admin user with sudo
		  7. Begin Installation → wait ~10-20 min
		  8. Reboot → remove USB
		  ```
	- ## First Boot Configuration
		- ```bash
		  # Update system immediately
		  sudo dnf update -y
		  
		  # Enable RPM Fusion (non-free codecs, NVIDIA drivers, etc.)
		  sudo dnf install \
		    https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
		    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
		  
		  # Install multimedia codecs (after RPM Fusion)
		  sudo dnf groupupdate multimedia --setop="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin
		  sudo dnf groupupdate sound-and-video
		  
		  # Install common developer tools
		  sudo dnf groupinstall "Development Tools" "Development Libraries"
		  
		  # Install Flatpak support (usually pre-installed on Workstation)
		  sudo dnf install flatpak
		  flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
		  
		  # Check SELinux status
		  getenforce   # should say "Enforcing"
		  ```
	- ## Default Filesystem Layout (Btrfs)
		- ```
		  Fedora 33+ uses Btrfs by default for the root filesystem.
		  
		  /boot/efi    → EFI System Partition (FAT32, ~600MB)
		  /boot        → ext4 (~1GB, kernel + initramfs)
		  /            → Btrfs (root subvolume @)
		  /home        → Btrfs (home subvolume @home)
		  
		  Btrfs subvolumes:
		    @           → mounted at /
		    @home       → mounted at /home
		  
		  Benefits: snapshots, copy-on-write, transparent compression,
		  checksums, easy rollback with Snapper or Timeshift.
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Fedora Kernel
		- Fedora ships the **latest stable Linux kernel** — often 1-2 versions ahead of Ubuntu LTS.
		- Kernel updates arrive within days of upstream release.
		- Uses **systemd** as init system (PID 1).
		- ```bash
		  uname -r                        # current kernel version
		  rpm -q kernel                   # all installed kernels
		  sudo dnf list installed kernel* # kernel packages
		  # Fedora keeps last 3 kernels by default (configurable in /etc/dnf/dnf.conf)
		  # installonly_limit=3
		  ```
	- ## Boot Process
		- ```
		  Power On
		    → UEFI/BIOS POST
		    → GRUB2 bootloader (/boot/grub2/grub.cfg)
		    → Kernel decompresses (vmlinuz)
		    → initramfs (dracut-generated early root filesystem)
		    → systemd (PID 1) starts
		    → Targets: sysinit → basic → multi-user / graphical
		    → Login prompt (GDM for Workstation, TTY for Server)
		  ```
	- ## Linux File System Hierarchy (FHS)
		- ```
		  /           Root filesystem (Btrfs on Fedora)
		  ├── /bin    → symlink to /usr/bin (merged usr)
		  ├── /boot   Kernel, initramfs, GRUB2
		  ├── /dev    Device files
		  ├── /etc    System configuration files
		  ├── /home   User home directories (Btrfs @home subvolume)
		  ├── /lib    → symlink to /usr/lib
		  ├── /lib64  → symlink to /usr/lib64
		  ├── /media  Auto-mount removable media
		  ├── /mnt    Manual mount point
		  ├── /opt    Optional third-party software
		  ├── /proc   Virtual: process + kernel info
		  ├── /root   Root user home
		  ├── /run    Runtime data (cleared on reboot)
		  ├── /sbin   → symlink to /usr/sbin
		  ├── /srv    Service data
		  ├── /sys    Virtual: hardware/driver info
		  ├── /tmp    Temporary files (tmpfs — in RAM)
		  ├── /usr    All user programs, libraries, docs
		  │   ├── /usr/bin    User commands
		  │   ├── /usr/sbin   Admin commands
		  │   ├── /usr/lib    Libraries
		  │   ├── /usr/lib64  64-bit libraries
		  │   └── /usr/share  Architecture-independent data
		  └── /var    Variable data (logs, databases, spool)
		  
		  Note: Fedora uses "UsrMerge" — /bin, /sbin, /lib, /lib64
		  are all symlinks into /usr (cleaner, container-friendly).
		  ```
	- ## GRUB2 Management
		- ```bash
		  # List GRUB entries
		  sudo grub2-editenv list
		  sudo grubby --info=ALL
		  
		  # Set default kernel
		  sudo grubby --set-default /boot/vmlinuz-<version>
		  
		  # Add kernel parameter (e.g., disable mitigations for testing)
		  sudo grubby --update-kernel=ALL --args="mitigations=off"
		  sudo grubby --update-kernel=ALL --remove-args="mitigations=off"
		  
		  # Regenerate GRUB config (UEFI)
		  sudo grub2-mkconfig -o /boot/grub2/grub.cfg
		  # or on EFI systems:
		  sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
		  ```
- # DNF Package Management
  collapsed:: true
	- ## What is DNF?
		- **DNF (Dandified YUM)** — the default package manager for Fedora, RHEL, and CentOS.
		- Manages **RPM** packages. Successor to YUM with better dependency resolution and performance.
		- Config: `/etc/dnf/dnf.conf` | Repos: `/etc/yum.repos.d/*.repo`
	- ## Essential DNF Commands
		- ```bash
		  # Update & upgrade
		  sudo dnf check-update              # check for updates (no install)
		  sudo dnf update -y                 # update all packages
		  sudo dnf upgrade -y                # same as update (alias)
		  sudo dnf distro-sync               # sync to repo versions (useful after version upgrade)
		  
		  # Install & remove
		  sudo dnf install package           # install package
		  sudo dnf install package1 package2 # install multiple
		  sudo dnf install ./local.rpm       # install local RPM file
		  sudo dnf remove package            # remove package
		  sudo dnf autoremove                # remove unused dependencies
		  
		  # Search & info
		  dnf search keyword                 # search packages
		  dnf info package                   # package details
		  dnf list installed                 # all installed packages
		  dnf list available                 # all available packages
		  dnf list installed | grep package  # check if installed
		  dnf provides /usr/bin/python3      # which package owns a file
		  dnf repoquery --list package       # list files in package
		  
		  # Groups
		  dnf grouplist                      # list package groups
		  sudo dnf groupinstall "Development Tools"
		  sudo dnf groupremove "Development Tools"
		  dnf groupinfo "Development Tools"
		  
		  # History & rollback
		  dnf history                        # transaction history
		  dnf history info 5                 # details of transaction 5
		  sudo dnf history undo 5            # undo transaction 5
		  sudo dnf history rollback 3        # rollback to transaction 3
		  
		  # Cache management
		  sudo dnf clean all                 # clean all cached data
		  sudo dnf makecache                 # rebuild metadata cache
		  ```
	- ## Repository Management
		- ```bash
		  # List repos
		  dnf repolist                       # enabled repos
		  dnf repolist all                   # all repos (enabled + disabled)
		  
		  # Enable/disable repos
		  sudo dnf config-manager --enable repo-name
		  sudo dnf config-manager --disable repo-name
		  
		  # Add a repo
		  sudo dnf config-manager --add-repo https://example.com/repo.repo
		  
		  # RPM Fusion (most important third-party repo)
		  sudo dnf install \
		    https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm \
		    https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
		  
		  # COPR (Community OPeR — like PPA for Fedora)
		  sudo dnf copr enable username/project
		  sudo dnf copr disable username/project
		  dnf copr list                      # list enabled COPR repos
		  ```
	- ## RPM Commands (Low-Level)
		- ```bash
		  rpm -qa                            # list all installed RPMs
		  rpm -qi package                    # package info
		  rpm -ql package                    # list files in package
		  rpm -qf /usr/bin/python3           # which package owns file
		  rpm -ivh package.rpm               # install RPM (verbose)
		  rpm -Uvh package.rpm               # upgrade RPM
		  rpm -e package                     # erase/remove RPM
		  rpm --verify package               # verify package integrity
		  rpm -K package.rpm                 # verify RPM signature
		  rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-41-x86_64
		  ```
	- ## Flatpak (Universal Packages)
		- ```bash
		  # Flatpak is pre-installed on Fedora Workstation
		  flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
		  
		  flatpak install flathub org.gimp.GIMP
		  flatpak install flathub com.spotify.Client
		  flatpak update                     # update all Flatpaks
		  flatpak list                       # list installed
		  flatpak uninstall org.gimp.GIMP
		  flatpak run org.gimp.GIMP          # run app
		  flatpak search gimp                # search Flathub
		  flatpak override --user --env=VARIABLE=value org.app.Name  # set env var
		  ```
	- ## System Upgrade (Major Version)
		- ```bash
		  # Upgrade Fedora 40 → 41 (official method)
		  sudo dnf upgrade --refresh -y
		  sudo dnf install dnf-plugin-system-upgrade
		  sudo dnf system-upgrade download --releasever=41
		  sudo dnf system-upgrade reboot
		  # System reboots and performs upgrade automatically (~20-40 min)
		  # After reboot, check: cat /etc/fedora-release
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell
		- Fedora Workstation uses **bash** by default. Zsh, fish, and others are available via DNF.
		- ```bash
		  echo $SHELL                        # current shell
		  cat /etc/shells                    # available shells
		  chsh -s /bin/zsh                   # change shell (re-login required)
		  sudo dnf install zsh fish          # install alternative shells
		  ```
	- ## Essential File & Directory Commands
		- ```bash
		  pwd                                # print working directory
		  ls / ls -la / ls -lh               # list / detailed / human sizes
		  cd /path  cd ~  cd ..  cd -        # navigate
		  touch file.txt                     # create file
		  mkdir -p a/b/c                     # create nested directories
		  cp -r src/ dest/                   # copy directory
		  mv source dest                     # move or rename
		  rm -rf dirname/                    # delete directory (careful!)
		  ln -s target link                  # symbolic link
		  cat / less / head / tail           # view file content
		  tail -f /var/log/messages          # follow log live
		  find / -name "*.conf" 2>/dev/null  # find by name
		  locate filename                    # fast search (updatedb first)
		  which python3                      # find executable
		  ```
	- ## File Permissions
		- ```bash
		  # Format: -rwxrwxrwx (owner group others)
		  # r=4  w=2  x=1
		  chmod 755 script.sh                # rwxr-xr-x
		  chmod 644 file.txt                 # rw-r--r--
		  chmod 600 ~/.ssh/id_rsa            # rw------- (SSH key)
		  chmod +x script.sh                 # add execute
		  chown user:group file.txt          # change owner + group
		  chown -R user:group dir/           # recursive
		  # Special bits
		  chmod u+s binary                   # SUID
		  chmod g+s dir/                     # SGID
		  chmod +t /tmp                      # Sticky bit
		  ```
	- ## I/O Redirection & Pipes
		- ```bash
		  command > file.txt                 # stdout to file (overwrite)
		  command >> file.txt                # stdout to file (append)
		  command 2> error.txt               # stderr to file
		  command &> file.txt                # stdout + stderr
		  cmd1 | cmd2                        # pipe
		  grep "pattern" file                # search
		  grep -r "pattern" dir/             # recursive search
		  awk '{print $1}' file              # print first column
		  sed 's/old/new/g' file             # replace all
		  sort / sort -n / sort -rh          # sort
		  uniq / uniq -c                     # unique / count
		  tee file.txt                       # write to file AND stdout
		  ```
	- ## Shell Scripting Basics
		- ```bash
		  #!/bin/bash
		  # Variables
		  name="Fedora"
		  echo "Hello, $name"
		  
		  # Conditionals
		  if [ "$1" == "start" ]; then
		      echo "Starting..."
		  elif [ "$1" == "stop" ]; then
		      echo "Stopping..."
		  else
		      echo "Usage: $0 start|stop"
		  fi
		  
		  # Loops
		  for pkg in vim git curl wget; do
		      sudo dnf install -y "$pkg"
		  done
		  
		  # While loop
		  count=0
		  while [ $count -lt 5 ]; do
		      echo "Count: $count"
		      ((count++))
		  done
		  
		  # Functions
		  install_pkg() {
		      sudo dnf install -y "$1" && echo "$1 installed" || echo "Failed: $1"
		  }
		  install_pkg vim
		  
		  # Exit codes
		  command && echo "Success" || echo "Failed"
		  echo "Exit code: $?"
		  ```
- # User & Group Management
  collapsed:: true
	- ## User Commands
		- ```bash
		  # Create user
		  sudo useradd -m -s /bin/bash username     # create with home + bash
		  sudo adduser username                      # interactive (Fedora uses useradd)
		  sudo passwd username                       # set password
		  
		  # Modify user
		  sudo usermod -aG wheel username            # add to wheel (sudo) group
		  sudo usermod -aG docker username           # add to docker group
		  sudo usermod -s /bin/zsh username          # change shell
		  sudo usermod -l newname oldname            # rename user
		  
		  # Delete user
		  sudo userdel -r username                   # delete user + home dir
		  
		  # Switch user
		  su - username                              # switch user (load env)
		  sudo -i                                    # root shell
		  sudo -u username command                   # run as another user
		  
		  # Info
		  id username                                # UID, GID, groups
		  who / w / last / lastb                     # login info
		  finger username                            # user info (if installed)
		  ```
	- ## Important User Files
		- ```
		  /etc/passwd    → username:x:UID:GID:comment:home:shell
		  /etc/shadow    → hashed passwords (root only)
		  /etc/group     → group definitions
		  /etc/sudoers   → sudo permissions (edit with: visudo)
		  /etc/login.defs → default UID/GID ranges, password policy
		  ~/.bashrc      → user bash config
		  ~/.bash_profile → login shell config
		  ~/.ssh/        → SSH keys
		  ```
	- ## Sudo Configuration
		- ```bash
		  # Fedora uses the "wheel" group for sudo (not "sudo" like Ubuntu)
		  sudo visudo                                # safely edit /etc/sudoers
		  
		  # Add user to wheel group
		  sudo usermod -aG wheel username
		  
		  # /etc/sudoers.d/ — drop-in files (preferred)
		  echo "username ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/username
		  
		  # Verify sudo access
		  sudo -l -U username
		  ```
	- ## Group Commands
		- ```bash
		  sudo groupadd groupname                    # create group
		  sudo groupdel groupname                    # delete group
		  sudo gpasswd -a user group                 # add user to group
		  sudo gpasswd -d user group                 # remove from group
		  groups username                            # show user's groups
		  getent group groupname                     # group info
		  ```
- # Systemd & Service Management
  collapsed:: true
	- ## systemctl
		- ```bash
		  # Service control
		  sudo systemctl start nginx
		  sudo systemctl stop nginx
		  sudo systemctl restart nginx
		  sudo systemctl reload nginx            # reload config without restart
		  sudo systemctl status nginx            # status + recent logs
		  
		  # Boot behavior
		  sudo systemctl enable nginx            # start on boot
		  sudo systemctl disable nginx           # don't start on boot
		  sudo systemctl enable --now nginx      # enable + start immediately
		  sudo systemctl disable --now nginx     # disable + stop immediately
		  
		  # Inspect
		  systemctl list-units --type=service --state=running
		  systemctl list-units --type=service --state=failed
		  systemctl list-unit-files --type=service
		  systemctl is-active nginx
		  systemctl is-enabled nginx
		  
		  # System targets (runlevels)
		  systemctl get-default                  # current default target
		  sudo systemctl set-default multi-user.target   # server (no GUI)
		  sudo systemctl set-default graphical.target    # desktop
		  sudo systemctl isolate rescue.target   # rescue mode
		  
		  # Reload after editing unit files
		  sudo systemctl daemon-reload
		  ```
	- ## journalctl — Logs
		- ```bash
		  journalctl -f                          # follow live
		  journalctl -u nginx                    # service logs
		  journalctl -u nginx -f                 # follow service logs
		  journalctl -b                          # since last boot
		  journalctl -b -1                       # previous boot
		  journalctl -p err                      # errors only
		  journalctl -p warning..err             # warning to error
		  journalctl --since "2024-01-01 00:00"
		  journalctl --since "1 hour ago"
		  journalctl -n 50                       # last 50 lines
		  journalctl --disk-usage                # log disk usage
		  sudo journalctl --vacuum-time=7d       # delete logs older than 7 days
		  sudo journalctl --vacuum-size=500M     # keep only 500MB of logs
		  ```
	- ## Important Log Files
		- ```
		  /var/log/messages      → general system messages (Fedora default)
		  /var/log/secure        → SSH logins, sudo, authentication
		  /var/log/audit/audit.log → SELinux + auditd events
		  /var/log/dnf.log       → DNF package manager log
		  /var/log/dnf.rpm.log   → RPM transaction log
		  /var/log/boot.log      → boot messages
		  /var/log/firewalld     → firewall log
		  /var/log/httpd/        → Apache web server logs
		  /var/log/nginx/        → Nginx logs (if installed)
		  
		  # Useful log commands
		  sudo tail -f /var/log/messages
		  sudo grep "Failed password" /var/log/secure
		  sudo grep "Accepted" /var/log/secure
		  last                                   # login history
		  lastb                                  # failed login attempts
		  lastlog                                # last login all users
		  ```
	- ## Creating Custom systemd Services
		- ```ini
		  # /etc/systemd/system/myapp.service
		  [Unit]
		  Description=My Application
		  After=network.target
		  Wants=network-online.target
		  
		  [Service]
		  Type=simple
		  User=myuser
		  WorkingDirectory=/opt/myapp
		  ExecStart=/opt/myapp/myapp --config /etc/myapp/config.yaml
		  ExecReload=/bin/kill -HUP $MAINPID
		  Restart=on-failure
		  RestartSec=5
		  StandardOutput=journal
		  StandardError=journal
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now myapp
		  ```
- # Networking
  collapsed:: true
	- ## Network Info
		- ```bash
		  ip a                               # all interfaces + IPs
		  ip route                           # routing table
		  ip neigh                           # ARP table
		  hostname -I                        # all IP addresses
		  cat /etc/hosts                     # local DNS
		  cat /etc/resolv.conf               # DNS servers
		  ss -tulnp                          # listening ports + processes
		  lsof -i :80                        # what uses port 80
		  nmcli device status                # NetworkManager device status
		  nmcli connection show              # all connections
		  ```
	- ## NetworkManager (nmcli)
		- ```bash
		  # Fedora uses NetworkManager by default
		  nmcli device status                # show all devices
		  nmcli device show eth0             # detailed device info
		  nmcli connection show              # all connections
		  nmcli connection show "Wired connection 1"
		  
		  # Connect/disconnect
		  nmcli device connect eth0
		  nmcli device disconnect eth0
		  
		  # Wi-Fi
		  nmcli device wifi list             # scan for networks
		  nmcli device wifi connect "SSID" password "password"
		  nmcli device wifi hotspot ifname wlan0 ssid "MyHotspot" password "pass123"
		  
		  # Static IP
		  nmcli connection modify "Wired connection 1" \
		    ipv4.method manual \
		    ipv4.addresses "192.168.1.100/24" \
		    ipv4.gateway "192.168.1.1" \
		    ipv4.dns "8.8.8.8,8.8.4.4"
		  nmcli connection up "Wired connection 1"
		  
		  # DNS
		  nmcli connection modify "Wired connection 1" ipv4.dns "1.1.1.1 8.8.8.8"
		  sudo systemctl restart NetworkManager
		  ```
	- ## Network Testing
		- ```bash
		  ping -c 4 8.8.8.8
		  traceroute google.com
		  mtr google.com                     # real-time traceroute
		  dig domain.com                     # DNS lookup
		  dig domain.com MX                  # MX records
		  nslookup domain.com                # DNS lookup (simple)
		  curl -I https://example.com        # HTTP headers
		  wget URL                           # download file
		  nc -zv host 80                     # test TCP port
		  nmap -sV host                      # port + service scan
		  ```
	- ## Firewalld (Fedora Default Firewall)
		- ```bash
		  # Fedora uses firewalld (zone-based firewall) — NOT iptables directly
		  sudo systemctl status firewalld
		  sudo systemctl enable --now firewalld
		  
		  # Zones (default: public)
		  firewall-cmd --get-default-zone
		  firewall-cmd --get-active-zones
		  firewall-cmd --list-all                    # show current zone rules
		  firewall-cmd --list-all --zone=public
		  
		  # Allow services
		  sudo firewall-cmd --permanent --add-service=http
		  sudo firewall-cmd --permanent --add-service=https
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --permanent --add-service=cockpit
		  
		  # Allow ports
		  sudo firewall-cmd --permanent --add-port=8080/tcp
		  sudo firewall-cmd --permanent --add-port=5000-5010/tcp
		  
		  # Remove rules
		  sudo firewall-cmd --permanent --remove-service=http
		  sudo firewall-cmd --permanent --remove-port=8080/tcp
		  
		  # Apply changes (reload required after --permanent)
		  sudo firewall-cmd --reload
		  
		  # Rich rules (advanced)
		  sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept'
		  
		  # Port forwarding
		  sudo firewall-cmd --permanent --add-forward-port=port=80:proto=tcp:toport=8080
		  
		  # Panic mode (block all traffic)
		  sudo firewall-cmd --panic-on
		  sudo firewall-cmd --panic-off
		  
		  # List available services
		  firewall-cmd --get-services
		  ```
	- ## SSH
		- ```bash
		  # Connect
		  ssh user@host
		  ssh user@host -p 2222              # custom port
		  ssh -i ~/.ssh/id_ed25519 user@host # with key
		  
		  # Generate key (ed25519 recommended)
		  ssh-keygen -t ed25519 -C "your_email@example.com"
		  ssh-copy-id user@host              # copy public key to host
		  
		  # SSH server (Fedora)
		  sudo dnf install openssh-server
		  sudo systemctl enable --now sshd
		  sudo firewall-cmd --permanent --add-service=ssh
		  sudo firewall-cmd --reload
		  
		  # Port forwarding
		  ssh -L 8080:localhost:80 user@host       # local forward
		  ssh -R 8080:localhost:80 user@host       # remote forward
		  ssh -D 1080 user@host                    # SOCKS proxy
		  ```
- # SELinux (Security-Enhanced Linux)
  collapsed:: true
	- ## What is SELinux?
		- **SELinux** is a **Mandatory Access Control (MAC)** system built into the Linux kernel.
		- Developed by the **NSA** and Red Hat. Fedora ships with SELinux **Enforcing** by default.
		- Every process and file has a **security context** (label). Policy defines what labels can access what.
		- Even root cannot bypass SELinux policy (unlike DAC/chmod).
		  
		  ```mermaid
		  graph TD
		    PROC["Process\ncontext: unconfined_u:unconfined_r:httpd_t:s0"]
		    FILE["File\ncontext: system_u:object_r:httpd_sys_content_t:s0"]
		    POLICY["SELinux Policy\nDoes httpd_t have access to httpd_sys_content_t?"]
		    ALLOW["✅ Allow"]
		    DENY["❌ Deny + AVC log"]
		    PROC --> POLICY
		    FILE --> POLICY
		    POLICY -->|Yes| ALLOW
		    POLICY -->|No| DENY
		  ```
	- ## SELinux Modes
		- | Mode | Behavior |
		  |------|---------|
		  | Enforcing | Policy enforced — violations blocked + logged |
		  | Permissive | Policy NOT enforced — violations logged only (debug mode) |
		  | Disabled | SELinux completely off (requires reboot, not recommended) |
		- ```bash
		  getenforce                         # Enforcing / Permissive / Disabled
		  sestatus                           # detailed status
		  sudo setenforce 1                  # set Enforcing (temp, no reboot)
		  sudo setenforce 0                  # set Permissive (temp, for debugging)
		  # Permanent: edit /etc/selinux/config
		  # SELINUX=enforcing   (or permissive / disabled)
		  # Requires reboot to take effect
		  ```
	- ## SELinux Contexts
		- ```bash
		  # View contexts
		  ls -Z file.txt                     # file context
		  ls -Z /var/www/html/               # directory context
		  ps -eZ | grep httpd                # process context
		  id -Z                              # current user context
		  
		  # Context format: user:role:type:level
		  # Example: system_u:object_r:httpd_sys_content_t:s0
		  #   user  = system_u (SELinux user)
		  #   role  = object_r (for files)
		  #   type  = httpd_sys_content_t (the important part)
		  #   level = s0 (MLS sensitivity level)
		  
		  # Change context
		  sudo chcon -t httpd_sys_content_t /var/www/html/myfile.html
		  sudo chcon -R -t httpd_sys_content_t /var/www/html/
		  
		  # Restore default context (from policy)
		  sudo restorecon -v /var/www/html/myfile.html
		  sudo restorecon -Rv /var/www/html/   # recursive
		  
		  # Set persistent context (survives restorecon)
		  sudo semanage fcontext -a -t httpd_sys_content_t "/myapp(/.*)?"
		  sudo restorecon -Rv /myapp/
		  ```
	- ## SELinux Booleans
		- ```bash
		  # Booleans are on/off switches for policy behavior
		  getsebool -a                       # list all booleans
		  getsebool httpd_can_network_connect # check specific boolean
		  
		  # Common booleans
		  sudo setsebool -P httpd_can_network_connect on    # allow httpd to connect to network
		  sudo setsebool -P httpd_can_network_connect_db on # allow httpd to connect to DB
		  sudo setsebool -P httpd_enable_homedirs on        # allow httpd to serve ~/public_html
		  sudo setsebool -P allow_user_exec_content on      # allow users to exec in home
		  sudo setsebool -P container_manage_cgroup on      # for Podman/Docker
		  # -P = permanent (survives reboot)
		  
		  # List booleans related to httpd
		  semanage boolean -l | grep httpd
		  ```
	- ## SELinux Troubleshooting
		- ```bash
		  # View AVC (Access Vector Cache) denials
		  sudo ausearch -m avc -ts recent    # recent denials
		  sudo ausearch -m avc -ts today     # today's denials
		  sudo ausearch -m avc -c httpd      # denials for httpd
		  
		  # Explain why something was denied
		  sudo audit2why < /var/log/audit/audit.log
		  sudo ausearch -m avc -ts recent | audit2why
		  
		  # Generate policy module from denials (use carefully)
		  sudo ausearch -m avc -ts recent | audit2allow -M mypolicy
		  sudo semodule -i mypolicy.pp       # install policy module
		  sudo semodule -l | grep mypolicy   # verify installed
		  sudo semodule -r mypolicy          # remove module
		  
		  # Install SELinux troubleshooting tools
		  sudo dnf install setroubleshoot-server setools-console
		  sudo sealert -a /var/log/audit/audit.log   # human-readable analysis
		  ```
	- ## Common SELinux Scenarios
		- | Scenario | Fix |
		  |---------|-----|
		  | Web server can't read files in custom dir | `semanage fcontext -a -t httpd_sys_content_t "/mydir(/.*)?"` + `restorecon` |
		  | httpd can't connect to database | `setsebool -P httpd_can_network_connect_db on` |
		  | SSH on non-standard port | `semanage port -a -t ssh_port_t -p tcp 2222` |
		  | Nginx can't bind to port 8080 | `semanage port -a -t http_port_t -p tcp 8080` |
		  | Container can't access host files | `chcon -Rt svirt_sandbox_file_t /path` |
- # Btrfs Filesystem
  collapsed:: true
	- ## Why Btrfs on Fedora?
		- Fedora 33+ uses **Btrfs** as the default root filesystem.
		- Key features: **copy-on-write (CoW)**, **snapshots**, **checksums**, **transparent compression**, **subvolumes**, **RAID support**.
	- ## Btrfs Subvolumes
		- ```bash
		  # List subvolumes
		  sudo btrfs subvolume list /
		  
		  # Create subvolume
		  sudo btrfs subvolume create /data/mysubvol
		  
		  # Delete subvolume
		  sudo btrfs subvolume delete /data/mysubvol
		  
		  # Show subvolume info
		  sudo btrfs subvolume show /
		  ```
	- ## Snapshots
		- ```bash
		  # Create read-only snapshot (for backup)
		  sudo btrfs subvolume snapshot -r / /snapshots/root-$(date +%Y%m%d)
		  
		  # Create read-write snapshot
		  sudo btrfs subvolume snapshot / /snapshots/root-rw
		  
		  # List snapshots
		  sudo btrfs subvolume list / | grep snapshots
		  
		  # Delete snapshot
		  sudo btrfs subvolume delete /snapshots/root-20240101
		  
		  # Rollback (boot from snapshot via GRUB)
		  # 1. Boot into snapshot from GRUB
		  # 2. Or use Snapper for automated snapshot management
		  ```
	- ## Snapper (Snapshot Manager)
		- ```bash
		  sudo dnf install snapper
		  
		  # Create config for root
		  sudo snapper -c root create-config /
		  
		  # Create manual snapshot
		  sudo snapper -c root create --description "before update"
		  
		  # List snapshots
		  sudo snapper -c root list
		  
		  # Compare snapshots
		  sudo snapper -c root diff 1..2
		  
		  # Rollback to snapshot
		  sudo snapper -c root undochange 1..0
		  
		  # Delete snapshot
		  sudo snapper -c root delete 3
		  ```
	- ## Btrfs Maintenance
		- ```bash
		  # Check filesystem usage
		  sudo btrfs filesystem usage /
		  sudo btrfs filesystem df /
		  
		  # Balance (redistribute data across devices)
		  sudo btrfs balance start /
		  sudo btrfs balance status /
		  
		  # Scrub (verify checksums, detect corruption)
		  sudo btrfs scrub start /
		  sudo btrfs scrub status /
		  
		  # Compression
		  # Enable compression in /etc/fstab:
		  # UUID=xxx / btrfs compress=zstd:1,subvol=@ 0 0
		  # zstd = best balance of speed/ratio (Fedora default)
		  # lzo  = fastest
		  # zlib = best compression ratio
		  
		  # Check compression ratio
		  sudo compsize /
		  ```
- # Podman & Containers
  collapsed:: true
	- ## What is Podman?
		- **Podman** is Fedora's default container engine — a **daemonless, rootless** Docker-compatible tool.
		- No root daemon required — containers run as your user (more secure).
		- Drop-in replacement for Docker: `alias docker=podman` works for most use cases.
		- Supports **Pods** (like Kubernetes pods) natively.
	- ## Podman vs Docker
		- | Feature | Podman | Docker |
		  |---------|--------|--------|
		  | Daemon | No daemon (daemonless) | Requires dockerd daemon |
		  | Root | Rootless by default | Requires root (or docker group) |
		  | Security | Better (no privileged daemon) | Root daemon = attack surface |
		  | Pods | Native pod support | No native pods |
		  | Compose | podman-compose / docker-compose | docker-compose |
		  | Compatibility | Docker CLI compatible | — |
		  | Systemd | Native integration | Workaround needed |
	- ## Podman Commands
		- ```bash
		  sudo dnf install podman podman-compose
		  
		  # Images
		  podman pull nginx                          # pull image
		  podman images                              # list images
		  podman rmi nginx                           # remove image
		  podman search nginx                        # search registry
		  
		  # Containers
		  podman run -d -p 8080:80 --name webserver nginx
		  podman run -it --rm fedora:latest bash     # interactive, auto-remove
		  podman ps                                  # running containers
		  podman ps -a                               # all containers
		  podman stop webserver
		  podman start webserver
		  podman restart webserver
		  podman rm webserver                        # remove container
		  podman rm -f webserver                     # force remove
		  
		  # Exec & logs
		  podman exec -it webserver bash             # shell into container
		  podman logs webserver                      # container logs
		  podman logs -f webserver                   # follow logs
		  podman inspect webserver                   # detailed info
		  podman stats                               # resource usage
		  
		  # Volumes
		  podman volume create mydata
		  podman run -v mydata:/data nginx
		  podman run -v /host/path:/container/path nginx
		  podman volume ls / podman volume rm mydata
		  
		  # Build image
		  podman build -t myapp:latest .             # build from Dockerfile
		  podman tag myapp:latest registry/myapp:v1
		  podman push registry/myapp:v1
		  
		  # Pods
		  podman pod create --name mypod -p 8080:80
		  podman run -d --pod mypod nginx
		  podman pod ps
		  podman pod stop mypod
		  podman pod rm mypod
		  ```
	- ## Podman as systemd Service
		- ```bash
		  # Generate systemd unit from running container
		  podman generate systemd --name webserver --files --new
		  
		  # Copy to systemd user directory (rootless)
		  mkdir -p ~/.config/systemd/user/
		  cp container-webserver.service ~/.config/systemd/user/
		  systemctl --user enable --now container-webserver
		  systemctl --user status container-webserver
		  
		  # Enable lingering (keep running after logout)
		  loginctl enable-linger $USER
		  ```
	- ## Buildah (Build OCI Images)
		- ```bash
		  sudo dnf install buildah
		  
		  # Build from Dockerfile
		  buildah bud -t myapp:latest .
		  
		  # Build without Dockerfile (scripted)
		  container=$(buildah from fedora:latest)
		  buildah run $container -- dnf install -y nginx
		  buildah config --cmd "/usr/sbin/nginx -g 'daemon off;'" $container
		  buildah commit $container mynginx:latest
		  buildah rm $container
		  ```
- # Cockpit (Web Admin UI)
  collapsed:: true
	- ## What is Cockpit?
		- **Cockpit** is a web-based server administration interface — manage Fedora Server from a browser.
		- Monitor CPU, memory, disk, network in real-time. Manage services, users, storage, containers, updates.
		- Installed by default on **Fedora Server**. Available for Workstation too.
	- ## Setup & Access
		- ```bash
		  # Install (if not present)
		  sudo dnf install cockpit cockpit-podman cockpit-storaged cockpit-networkmanager
		  
		  # Enable and start
		  sudo systemctl enable --now cockpit.socket
		  
		  # Allow through firewall
		  sudo firewall-cmd --permanent --add-service=cockpit
		  sudo firewall-cmd --reload
		  
		  # Access in browser
		  # https://localhost:9090
		  # https://your-server-ip:9090
		  # Login with your system username + password
		  ```
	- ## Cockpit Modules
		- | Module | Package | Capability |
		  |--------|---------|-----------|
		  | Overview | cockpit | CPU, memory, disk, network dashboard |
		  | Logs | cockpit | journald log viewer |
		  | Storage | cockpit-storaged | Disk, RAID, LVM, Btrfs management |
		  | Networking | cockpit-networkmanager | Network interface config |
		  | Accounts | cockpit | User management |
		  | Services | cockpit | systemd service control |
		  | Software Updates | cockpit-packagekit | DNF updates via UI |
		  | Containers | cockpit-podman | Podman container management |
		  | Virtual Machines | cockpit-machines | libvirt/KVM VM management |
		  | SELinux | cockpit-selinux | SELinux status + troubleshoot |
- # Wayland & Desktop (Workstation)
  collapsed:: true
	- ## Wayland on Fedora
		- Fedora Workstation uses **Wayland** as the default display protocol since Fedora 25.
		- Wayland replaces X11 — better security (apps can't spy on each other), better HiDPI, smoother.
		- GNOME on Wayland is the default session. X11 fallback available at login screen.
		- ```bash
		  echo $WAYLAND_DISPLAY                # check if running Wayland (wayland-0)
		  echo $XDG_SESSION_TYPE               # "wayland" or "x11"
		  loginctl show-session $(loginctl | grep $(whoami) | awk '{print $1}') -p Type
		  ```
	- ## GNOME Shell Basics
		- ```
		  Super key          → Activities overview (app launcher + workspace switcher)
		  Super + A          → App grid
		  Super + Tab        → Switch applications
		  Alt + Tab          → Switch windows
		  Super + H          → Hide window
		  Super + Up/Down    → Maximize / restore window
		  Super + Left/Right → Snap window to half screen
		  Ctrl + Alt + T     → Open terminal (if configured)
		  Super + L          → Lock screen
		  ```
	- ## GNOME Extensions
		- ```bash
		  # Install GNOME Extensions app
		  sudo dnf install gnome-extensions-app gnome-tweaks
		  
		  # Popular extensions (install from extensions.gnome.org or via app)
		  # - Dash to Dock / Dash to Panel
		  # - AppIndicator (system tray icons)
		  # - Blur my Shell
		  # - GSConnect (KDE Connect for GNOME)
		  # - Caffeine (prevent screen lock)
		  
		  # CLI management
		  gnome-extensions list
		  gnome-extensions enable extension-name@domain
		  gnome-extensions disable extension-name@domain
		  ```
	- ## Display & HiDPI
		- ```bash
		  # Check display info
		  xrandr                             # X11 display info
		  wlr-randr                          # Wayland display info (wlroots)
		  
		  # GNOME scaling (Wayland)
		  gsettings set org.gnome.desktop.interface scaling-factor 2   # 2x scaling
		  gsettings set org.gnome.desktop.interface text-scaling-factor 1.25
		  
		  # Fractional scaling (experimental)
		  gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"
		  # Then set in Settings → Displays
		  ```
	- ## Fedora Workstation Developer Tools
		- ```bash
		  # GNOME Builder (IDE)
		  sudo dnf install gnome-builder
		  # or via Flatpak (recommended — latest version)
		  flatpak install flathub org.gnome.Builder
		  
		  # VS Code
		  sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc
		  sudo sh -c 'echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/vscode.repo'
		  sudo dnf install code
		  # or Flatpak:
		  flatpak install flathub com.visualstudio.code
		  
		  # Toolbox (isolated dev environments)
		  sudo dnf install toolbox
		  toolbox create                     # create Fedora toolbox container
		  toolbox enter                      # enter toolbox
		  toolbox list                       # list toolboxes
		  # Inside toolbox: install anything without affecting host
		  ```
- # Security Hardening
  collapsed:: true
	- ## Fedora Security Defaults
		- Fedora ships with strong security defaults out of the box:
		- | Feature | Default State |
		  |---------|--------------|
		  | SELinux | Enforcing |
		  | Firewalld | Enabled |
		  | SSH root login | Disabled |
		  | ASLR | Enabled (level 2) |
		  | Stack canaries | Enabled (compiler) |
		  | NX/XD bit | Enabled |
		  | Secure boot | Supported |
		  | Crypto policies | System-wide policy |
	- ## System-Wide Crypto Policies
		- ```bash
		  # Fedora has a unified crypto policy system
		  update-crypto-policies --show          # current policy
		  
		  # Available policies:
		  # DEFAULT  → balanced security + compatibility
		  # FUTURE   → stricter (TLS 1.2+, SHA-256+, RSA 3072+)
		  # LEGACY   → maximum compatibility (TLS 1.0+, SHA-1)
		  # FIPS     → FIPS 140-2 compliance
		  
		  sudo update-crypto-policies --set FUTURE   # stricter policy
		  sudo update-crypto-policies --set DEFAULT  # restore default
		  sudo update-crypto-policies --set FIPS     # FIPS mode
		  # Requires reboot to fully apply
		  ```
	- ## SSH Hardening
		- ```ini
		  # /etc/ssh/sshd_config — recommended hardening
		  Port 2222                              # change default port
		  Protocol 2
		  PermitRootLogin no
		  PasswordAuthentication no              # key-based only
		  PubkeyAuthentication yes
		  MaxAuthTries 3
		  LoginGraceTime 30
		  ClientAliveInterval 300
		  ClientAliveCountMax 2
		  AllowUsers yourusername
		  X11Forwarding no
		  Banner /etc/ssh/banner
		  ```
		- ```bash
		  sudo systemctl restart sshd
		  # Update firewall for new port
		  sudo semanage port -a -t ssh_port_t -p tcp 2222   # SELinux
		  sudo firewall-cmd --permanent --remove-service=ssh
		  sudo firewall-cmd --permanent --add-port=2222/tcp
		  sudo firewall-cmd --reload
		  ```
	- ## Fail2ban
		- ```bash
		  sudo dnf install fail2ban
		  sudo systemctl enable --now fail2ban
		  
		  # /etc/fail2ban/jail.local
		  # [DEFAULT]
		  # bantime  = 3600
		  # findtime = 600
		  # maxretry = 5
		  
		  # [sshd]
		  # enabled = true
		  # port    = 2222
		  
		  sudo fail2ban-client status            # overall status
		  sudo fail2ban-client status sshd       # SSH jail status
		  sudo fail2ban-client set sshd unbanip 1.2.3.4  # unban IP
		  ```
	- ## auditd — System Auditing
		- ```bash
		  sudo systemctl enable --now auditd
		  
		  # Add audit rules
		  sudo auditctl -w /etc/passwd -p wa -k passwd_changes
		  sudo auditctl -w /etc/sudoers -p wa -k sudoers_changes
		  sudo auditctl -a always,exit -F arch=b64 -S execve -k exec_commands
		  
		  # Persistent rules: /etc/audit/rules.d/audit.rules
		  
		  # Search audit logs
		  sudo ausearch -k passwd_changes
		  sudo ausearch -m USER_LOGIN -ts today
		  sudo aureport --summary
		  sudo aureport --auth --failed
		  ```
	- ## Lynis Security Audit
		- ```bash
		  sudo dnf install lynis
		  sudo lynis audit system               # full audit
		  # Results: /var/log/lynis.log
		  # Hardening index score + recommendations
		  ```
	- ## AIDE (File Integrity Monitoring)
		- ```bash
		  sudo dnf install aide
		  sudo aide --init                      # initialize database
		  sudo cp /var/lib/aide/aide.db.new.gz /var/lib/aide/aide.db.gz
		  sudo aide --check                     # check for changes
		  sudo aide --update                    # update after approved changes
		  ```
	- ## Privilege Escalation Prevention
		- ```bash
		  # Check SUID binaries
		  find / -perm -u=s -type f 2>/dev/null
		  
		  # Check world-writable files
		  find / -perm -o+w -type f 2>/dev/null | grep -v /proc
		  
		  # Check sudo permissions
		  sudo -l
		  
		  # Check capabilities
		  getcap -r / 2>/dev/null
		  
		  # Check cron jobs
		  ls -la /etc/cron* /var/spool/cron/
		  
		  # Check for unowned files
		  find / -nouser -o -nogroup 2>/dev/null
		  ```
- # Developer Workflows
  collapsed:: true
	- ## Programming Language Setup
		- ```bash
		  # Python
		  sudo dnf install python3 python3-pip python3-venv
		  python3 -m venv myenv && source myenv/bin/activate
		  pip install requests flask django
		  
		  # Node.js (via nvm — recommended)
		  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
		  nvm install --lts
		  nvm use --lts
		  node --version && npm --version
		  
		  # Or via DNF (older version)
		  sudo dnf install nodejs npm
		  
		  # Go
		  sudo dnf install golang
		  go version
		  export GOPATH=$HOME/go
		  
		  # Rust
		  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
		  source $HOME/.cargo/env
		  rustc --version && cargo --version
		  
		  # Java
		  sudo dnf install java-21-openjdk java-21-openjdk-devel
		  java -version
		  sudo alternatives --config java    # switch Java version
		  
		  # C/C++
		  sudo dnf groupinstall "Development Tools"
		  sudo dnf install gcc gcc-c++ cmake make gdb valgrind
		  
		  # PHP
		  sudo dnf install php php-cli php-fpm php-mysqlnd php-xml php-mbstring
		  ```
	- ## Git Setup
		- ```bash
		  sudo dnf install git
		  git config --global user.name "Your Name"
		  git config --global user.email "you@example.com"
		  git config --global core.editor vim
		  git config --global init.defaultBranch main
		  
		  # SSH key for GitHub/GitLab
		  ssh-keygen -t ed25519 -C "you@example.com"
		  cat ~/.ssh/id_ed25519.pub          # copy to GitHub Settings → SSH Keys
		  ssh -T git@github.com              # test connection
		  ```
	- ## Web Server Setup (Nginx)
		- ```bash
		  sudo dnf install nginx
		  sudo systemctl enable --now nginx
		  sudo firewall-cmd --permanent --add-service=http --add-service=https
		  sudo firewall-cmd --reload
		  
		  # SELinux: allow nginx to serve files from custom dir
		  sudo semanage fcontext -a -t httpd_sys_content_t "/mywebsite(/.*)?"
		  sudo restorecon -Rv /mywebsite/
		  
		  # SELinux: allow nginx to connect to backend (reverse proxy)
		  sudo setsebool -P httpd_can_network_connect on
		  
		  # Config: /etc/nginx/nginx.conf
		  # Virtual hosts: /etc/nginx/conf.d/*.conf
		  ```
	- ## Web Server Setup (Apache httpd)
		- ```bash
		  sudo dnf install httpd mod_ssl
		  sudo systemctl enable --now httpd
		  sudo firewall-cmd --permanent --add-service=http --add-service=https
		  sudo firewall-cmd --reload
		  
		  # SELinux for custom document root
		  sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/mysite(/.*)?"
		  sudo restorecon -Rv /var/www/mysite/
		  
		  # Config: /etc/httpd/conf/httpd.conf
		  # Virtual hosts: /etc/httpd/conf.d/*.conf
		  # Logs: /var/log/httpd/
		  ```
	- ## Database Setup
		- ```bash
		  # MariaDB (MySQL-compatible)
		  sudo dnf install mariadb-server mariadb
		  sudo systemctl enable --now mariadb
		  sudo mysql_secure_installation        # secure setup
		  mysql -u root -p                      # connect
		  
		  # PostgreSQL
		  sudo dnf install postgresql-server postgresql
		  sudo postgresql-setup --initdb
		  sudo systemctl enable --now postgresql
		  sudo -u postgres psql                 # connect
		  
		  # SQLite
		  sudo dnf install sqlite sqlite-devel
		  sqlite3 mydb.db
		  ```
	- ## Toolbox (Isolated Dev Environments)
		- ```bash
		  # Toolbox creates Fedora containers for development
		  # Host system stays clean — install anything inside toolbox
		  sudo dnf install toolbox
		  
		  toolbox create                         # create default Fedora toolbox
		  toolbox create --distro ubuntu --release 22.04 myubuntu  # Ubuntu toolbox
		  toolbox enter                          # enter default toolbox
		  toolbox enter myubuntu                 # enter specific toolbox
		  toolbox list                           # list all toolboxes
		  toolbox rm myubuntu                    # remove toolbox
		  
		  # Inside toolbox: full dnf/apt access, no SELinux restrictions
		  # Files in $HOME are shared with host
		  ```
- # Fedora Silverblue (Immutable Desktop)
  collapsed:: true
	- ## What is Silverblue?
		- **Fedora Silverblue** is an **immutable** variant of Fedora Workstation.
		- The OS root filesystem is **read-only** — you can't accidentally break it.
		- Updates are **atomic** — applied as a whole, easy to rollback.
		- Apps installed via **Flatpak** (GUI apps) or **Toolbox** (CLI dev tools).
		- Based on **OSTree** — like git for the OS filesystem.
	- ## OSTree Commands
		- ```bash
		  # Check current deployment
		  rpm-ostree status
		  
		  # Update (downloads in background, applies on reboot)
		  rpm-ostree upgrade
		  rpm-ostree upgrade --check          # check only
		  
		  # Rollback to previous deployment
		  rpm-ostree rollback
		  
		  # Layer RPM packages (persists across updates)
		  rpm-ostree install vim git htop
		  rpm-ostree uninstall vim
		  
		  # Override packages (replace base packages)
		  rpm-ostree override replace package.rpm
		  rpm-ostree override reset package
		  
		  # Pin a deployment (prevent garbage collection)
		  ostree admin pin 0                  # pin current (index 0)
		  ostree admin pin 1                  # pin previous (index 1)
		  
		  # List deployments
		  rpm-ostree status -v
		  ```
	- ## Silverblue Workflow
		- ```
		  GUI Apps    → Flatpak (from Flathub or Fedora Flatpaks)
		  CLI Tools   → Toolbox (isolated Fedora containers)
		  System RPMs → rpm-ostree install (layered, survives updates)
		  Dev Envs    → Toolbox or Distrobox (any distro)
		  ```
	- ## Distrobox (Any Distro in a Container)
		- ```bash
		  sudo dnf install distrobox
		  # or on Silverblue:
		  rpm-ostree install distrobox
		  
		  distrobox create --name ubuntu22 --image ubuntu:22.04
		  distrobox create --name arch --image archlinux:latest
		  distrobox enter ubuntu22
		  distrobox list
		  distrobox rm ubuntu22
		  
		  # Export app from distrobox to host
		  distrobox-export --app firefox      # inside distrobox
		  ```
- # Performance & System Tuning
  collapsed:: true
	- ## System Monitoring
		- ```bash
		  # CPU
		  top / htop / btop              # real-time process monitor
		  mpstat -P ALL 1                # per-CPU stats
		  lscpu                          # CPU info
		  cat /proc/cpuinfo              # detailed CPU
		  
		  # Memory
		  free -h                        # RAM + swap
		  vmstat 1 5                     # virtual memory stats
		  cat /proc/meminfo              # detailed memory
		  
		  # Disk
		  df -hT                         # disk usage + filesystem type
		  du -sh /* 2>/dev/null | sort -rh | head -20
		  iostat -x 1                    # disk I/O stats
		  iotop -o                       # per-process I/O
		  
		  # Network
		  ss -tulnp                      # listening ports
		  nethogs                        # per-process bandwidth
		  iftop -i eth0                  # per-connection bandwidth
		  
		  # Overall
		  dstat                          # combined stats (install: dnf install dstat)
		  glances                        # all-in-one monitor (dnf install glances)
		  ```
	- ## tuned (Performance Profiles)
		- ```bash
		  # tuned is Fedora's system tuning daemon
		  sudo dnf install tuned
		  sudo systemctl enable --now tuned
		  
		  tuned-adm list                 # list available profiles
		  tuned-adm active               # current profile
		  
		  # Common profiles:
		  sudo tuned-adm profile balanced          # default (balanced)
		  sudo tuned-adm profile throughput-performance  # server throughput
		  sudo tuned-adm profile latency-performance     # low latency
		  sudo tuned-adm profile powersave               # laptop battery
		  sudo tuned-adm profile virtual-guest           # VM guest
		  sudo tuned-adm profile desktop                 # desktop responsiveness
		  
		  tuned-adm recommend            # recommended profile for your hardware
		  ```
	- ## Kernel Parameters for Performance
		- ```bash
		  # /etc/sysctl.d/99-performance.conf
		  # Network
		  net.core.somaxconn = 65535
		  net.ipv4.tcp_max_syn_backlog = 65535
		  net.ipv4.tcp_fin_timeout = 15
		  net.ipv4.tcp_tw_reuse = 1
		  net.core.rmem_max = 134217728
		  net.core.wmem_max = 134217728
		  
		  # Memory
		  vm.swappiness = 10             # reduce swap usage (SSD)
		  vm.dirty_ratio = 15
		  vm.dirty_background_ratio = 5
		  
		  # File descriptors
		  fs.file-max = 2097152
		  
		  # Security
		  net.ipv4.tcp_syncookies = 1
		  kernel.randomize_va_space = 2
		  net.ipv4.conf.all.rp_filter = 1
		  ```
		- ```bash
		  sudo sysctl -p /etc/sysctl.d/99-performance.conf
		  ```
- # Fedora Security Lab & Cybersecurity Tools
  collapsed:: true
	- ## Fedora Security Lab Spin
		- Fedora has a dedicated **Security Lab** spin — a live ISO with pre-installed security tools.
		- Download: [https://labs.fedoraproject.org/security/](https://labs.fedoraproject.org/security/)
		- Lighter than Kali but uses the same Fedora base — great for learning on a stable platform.
	- ## Installing Security Tools on Fedora
		- ```bash
		  # Network scanning
		  sudo dnf install nmap wireshark tcpdump netcat ncat
		  
		  # Vulnerability scanning
		  sudo dnf install nikto openvas
		  
		  # Password tools
		  sudo dnf install john hashcat hydra
		  
		  # Web testing
		  sudo dnf install sqlmap dirb gobuster
		  
		  # Forensics
		  sudo dnf install sleuthkit autopsy foremost scalpel
		  
		  # Packet analysis
		  sudo dnf install wireshark-cli tshark
		  
		  # Exploitation framework
		  sudo dnf install metasploit
		  # or via RPM Fusion:
		  sudo dnf install metasploit-framework
		  
		  # Wireless
		  sudo dnf install aircrack-ng kismet
		  
		  # OSINT
		  sudo dnf install theharvester maltego
		  
		  # Reverse engineering
		  sudo dnf install radare2 ghidra
		  flatpak install flathub org.ghidra_sre.Ghidra
		  ```
	- ## Nmap on Fedora
		- ```bash
		  sudo dnf install nmap
		  
		  nmap 192.168.1.0/24                    # scan subnet
		  nmap -p- host                          # all 65535 ports
		  nmap -sS host                          # SYN scan (stealth)
		  nmap -sV -O host                       # service version + OS
		  nmap -A host                           # aggressive scan
		  nmap --script=vuln host                # vulnerability scripts
		  nmap -oA output host                   # save all formats
		  
		  # SELinux note: nmap works fine under SELinux Enforcing
		  # Raw socket scans may need: sudo nmap (or cap_net_raw capability)
		  ```
	- ## Wireshark on Fedora
		- ```bash
		  sudo dnf install wireshark
		  
		  # Add user to wireshark group (capture without root)
		  sudo usermod -aG wireshark $USER
		  # Re-login required
		  
		  # CLI capture
		  sudo tshark -i eth0 -w capture.pcap
		  sudo tshark -i eth0 -f "port 80"
		  sudo tshark -r capture.pcap
		  
		  # SELinux: Wireshark works fine under Enforcing
		  ```
	- ## Firewalld for Security Testing
		- ```bash
		  # Create isolated zone for testing
		  sudo firewall-cmd --permanent --new-zone=pentest
		  sudo firewall-cmd --permanent --zone=pentest --add-interface=eth1
		  sudo firewall-cmd --permanent --zone=pentest --set-target=ACCEPT
		  sudo firewall-cmd --reload
		  
		  # Block all outbound except specific (egress filtering)
		  sudo firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 0 -p tcp --dport 443 -j ACCEPT
		  sudo firewall-cmd --permanent --direct --add-rule ipv4 filter OUTPUT 1 -j DROP
		  sudo firewall-cmd --reload
		  ```
	- ## SELinux in Security Context
		- ```bash
		  # SELinux provides defense-in-depth — even if an app is exploited,
		  # SELinux confines what the attacker can do.
		  
		  # Check if a process is confined
		  ps -eZ | grep httpd                    # confined: httpd_t
		  ps -eZ | grep unconfined               # unconfined: less secure
		  
		  # Audit what a process is allowed to do
		  sesearch --allow --source httpd_t | head -20
		  
		  # Check port labeling
		  semanage port -l | grep http           # http ports
		  semanage port -l | grep ssh            # ssh ports
		  ```
- # Disk & Storage Management
  collapsed:: true
	- ## Disk Info & Partitioning
		- ```bash
		  lsblk / lsblk -f                   # list block devices / with filesystems
		  fdisk -l                            # all disks and partitions
		  df -hT                              # disk space + filesystem type
		  du -sh /* 2>/dev/null | sort -rh | head -20
		  blkid                               # UUIDs and filesystem types
		  
		  # Partitioning
		  sudo fdisk /dev/sdb                 # MBR partitioning
		  sudo parted /dev/sdb                # GPT + MBR
		  sudo gdisk /dev/sdb                 # GPT only
		  
		  # Format
		  sudo mkfs.btrfs /dev/sdb1           # Btrfs (Fedora default)
		  sudo mkfs.ext4 /dev/sdb1            # ext4
		  sudo mkfs.xfs /dev/sdb1             # XFS
		  sudo mkfs.vfat /dev/sdb1            # FAT32 (USB/EFI)
		  ```
	- ## LVM (Logical Volume Manager)
		- ```bash
		  # Fedora Server often uses LVM
		  # Physical Volume → Volume Group → Logical Volume
		  
		  sudo pvcreate /dev/sdb              # create PV
		  sudo vgcreate myvg /dev/sdb         # create VG
		  sudo lvcreate -L 20G -n mylv myvg   # create 20GB LV
		  sudo mkfs.ext4 /dev/myvg/mylv       # format LV
		  sudo mount /dev/myvg/mylv /mnt/data
		  
		  # Extend LV
		  sudo lvextend -L +10G /dev/myvg/mylv
		  sudo resize2fs /dev/myvg/mylv       # resize ext4
		  sudo xfs_growfs /mnt/data           # resize XFS
		  
		  # Info
		  sudo pvs / sudo vgs / sudo lvs      # quick summary
		  sudo pvdisplay / vgdisplay / lvdisplay  # detailed
		  ```
	- ## Mounting & /etc/fstab
		- ```bash
		  sudo mount /dev/sdb1 /mnt           # mount
		  sudo mount -o ro /dev/sdb1 /mnt     # read-only
		  sudo umount /mnt                    # unmount
		  
		  # /etc/fstab entry (persistent mount)
		  # UUID=xxxx  /mnt/data  btrfs  defaults,compress=zstd  0  0
		  # UUID=xxxx  /mnt/data  ext4   defaults                 0  2
		  
		  # Get UUID
		  blkid /dev/sdb1
		  sudo mount -a                       # test fstab (mount all)
		  ```
- # Virtualization (KVM/QEMU)
  collapsed:: true
	- ## KVM Setup on Fedora
		- ```bash
		  # Check hardware virtualization support
		  egrep -c '(vmx|svm)' /proc/cpuinfo   # >0 means supported
		  
		  # Install KVM + QEMU + libvirt + Virt-Manager
		  sudo dnf install @virtualization
		  # or individually:
		  sudo dnf install qemu-kvm libvirt libvirt-devel virt-install virt-manager virt-viewer
		  
		  # Start and enable libvirtd
		  sudo systemctl enable --now libvirtd
		  
		  # Add user to libvirt group
		  sudo usermod -aG libvirt $USER
		  # Re-login required
		  
		  # Verify KVM is loaded
		  lsmod | grep kvm
		  virsh list --all                     # list VMs
		  ```
	- ## virsh Commands
		- ```bash
		  virsh list --all                     # list all VMs
		  virsh start vmname                   # start VM
		  virsh shutdown vmname                # graceful shutdown
		  virsh destroy vmname                 # force stop
		  virsh suspend vmname                 # pause VM
		  virsh resume vmname                  # resume VM
		  virsh reboot vmname                  # reboot VM
		  virsh dominfo vmname                 # VM info
		  virsh console vmname                 # serial console
		  virsh snapshot-create-as vmname snap1 "before update"
		  virsh snapshot-list vmname
		  virsh snapshot-revert vmname snap1
		  ```
	- ## virt-install (CLI VM Creation)
		- ```bash
		  sudo virt-install \
		    --name fedora41 \
		    --ram 2048 \
		    --vcpus 2 \
		    --disk path=/var/lib/libvirt/images/fedora41.qcow2,size=20 \
		    --os-variant fedora41 \
		    --network bridge=virbr0 \
		    --graphics vnc \
		    --cdrom /path/to/Fedora-41.iso
		  ```
- # Fedora CoreOS & Server
  collapsed:: true
	- ## Fedora Server
		- ```bash
		  # Fedora Server is a minimal CLI-based server OS
		  # Comes with Cockpit pre-installed
		  # Uses same DNF + SELinux + firewalld as Workstation
		  
		  # Initial server setup checklist:
		  sudo dnf update -y
		  sudo systemctl enable --now cockpit.socket
		  sudo firewall-cmd --permanent --add-service=cockpit
		  sudo firewall-cmd --reload
		  # Access: https://server-ip:9090
		  ```
	- ## Fedora CoreOS
		- ```bash
		  # Fedora CoreOS = immutable, container-optimized, auto-updating OS
		  # Designed for running containers at scale (Kubernetes nodes, etc.)
		  # Provisioned via Ignition config (JSON/YAML)
		  
		  # Check CoreOS version
		  rpm-ostree status
		  
		  # CoreOS auto-updates (zincati daemon)
		  systemctl status zincati
		  
		  # Manual update
		  sudo rpm-ostree upgrade
		  sudo systemctl reboot
		  
		  # Rollback
		  sudo rpm-ostree rollback
		  ```
	- ## Ignition Config (CoreOS Provisioning)
		- ```yaml
		  # ignition.yaml — provision CoreOS on first boot
		  variant: fcos
		  version: 1.5.0
		  passwd:
		    users:
		      - name: core
		        ssh_authorized_keys:
		          - ssh-ed25519 AAAA... your-key
		        groups:
		          - wheel
		          - sudo
		  storage:
		    files:
		      - path: /etc/hostname
		        mode: 0644
		        contents:
		          inline: myserver
		  systemd:
		    units:
		      - name: nginx.service
		        enabled: true
		  ```
		- ```bash
		  # Convert YAML to Ignition JSON
		  butane --pretty --strict ignition.yaml > ignition.ign
		  ```
- # Process Management
  collapsed:: true
	- ## Viewing & Controlling Processes
		- ```bash
		  ps aux                             # all running processes
		  ps aux | grep nginx                # find specific process
		  top / htop / btop                  # real-time monitor
		  pgrep nginx                        # get PID by name
		  pstree -p                          # process tree with PIDs
		  
		  # Kill processes
		  kill PID                           # SIGTERM (graceful)
		  kill -9 PID                        # SIGKILL (force)
		  killall nginx                      # kill all by name
		  pkill -f "python"                  # kill by pattern
		  
		  # Background jobs
		  command &                          # start in background
		  Ctrl+Z → bg                        # suspend then background
		  fg                                 # bring to foreground
		  jobs                               # list background jobs
		  nohup command &                    # survive logout
		  disown %1                          # detach from shell
		  ```
	- ## System Information
		- ```bash
		  uname -a                           # kernel + system info
		  hostnamectl                        # hostname + OS info (systemd)
		  cat /etc/fedora-release            # Fedora version
		  cat /etc/os-release                # detailed OS info
		  whoami / id                        # current user
		  uptime                             # system uptime + load
		  df -hT                             # disk space
		  free -h                            # RAM + swap
		  lscpu                              # CPU info
		  lsblk                              # block devices
		  lsusb / lspci                      # USB / PCI devices
		  dmidecode                          # hardware info from BIOS
		  inxi -Fxz                          # full system info (dnf install inxi)
		  ```
- # Contributing to This Note
  collapsed:: true
	- ## How to Contribute
		- This note follows the **Code-Note contribution guidelines**. See [[CONTRIBUTING]] for full details.
		- Fork the repository → create/edit `pages/Fedora.md` → submit a Pull Request.
		- PR title format: `Add: Fedora` or `Update: Fedora – <section name>`
	- ## What to Add
		- Missing Fedora-specific tools or workflows
		- New Fedora release features (update version numbers, new defaults)
		- Additional security hardening techniques
		- More Podman/container examples
		- Fedora Atomic/Silverblue/CoreOS deep dives
		- Real-world server setup examples (LAMP, LEMP, Docker Compose stacks)
		- Ansible playbooks for Fedora automation
	- ## Contribution Rules (Summary)
		- Follow the **OS Page Format** from CONTRIBUTING.md
		- Use `collapsed:: true` on all top-level sections except `# More Learn`
		- Use Logseq bullet syntax (`- ` prefix)
		- Use fenced code blocks with language tags (` ```bash `, ` ```ini `, etc.)
		- Internal links use `[[Page Name]]` syntax
		- End `keywords` frontmatter with `, VR-Rathod, Code-Note, code note vr, vr book`
		- No broken links — only link to pages that exist in `/pages/`
		- Depth is valued — bigger, more detailed notes are better
- # More Learn
	- ## Github & Webs
		- [Fedora Official Documentation](https://docs.fedoraproject.org/)
		- [Fedora Project Website](https://fedoraproject.org/)
		- [Fedora Magazine](https://fedoramagazine.org/)
		- [RPM Fusion Repository](https://rpmfusion.org/)
		- [Flathub – Flatpak App Store](https://flathub.org/)
		- [Fedora CoreOS Documentation](https://docs.fedoraproject.org/en-US/fedora-coreos/)
		- [Fedora Silverblue Documentation](https://docs.fedoraproject.org/en-US/fedora-silverblue/)
		- [Podman Documentation](https://docs.podman.io/)
		- [SELinux User's and Administrator's Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/using_selinux/)
		- [Firewalld Documentation](https://firewalld.org/documentation/)
		- [Btrfs Wiki](https://btrfs.wiki.kernel.org/)
		- [Cockpit Project](https://cockpit-project.org/)
		- [Fedora Discussion Forum](https://discussion.fedoraproject.org/)
		- [Ask Fedora](https://ask.fedoraproject.org/)
		- [[Cybersecurity Architecture]] — enterprise security design
		- [[Kali Linux]] — penetration testing tools
		- [[Linux Advanced]] — kernel internals and hardening
		- [[Cybersecurity]] — foundational security concepts
		- [[Ubuntu]] — Debian-based Linux comparison
	- ## Master Playlists YouTube
		- [Fedora Linux Tutorial for Beginners](https://www.youtube.com/results?search_query=fedora+linux+tutorial+beginners)
		- [SELinux Tutorial – Red Hat](https://www.youtube.com/results?search_query=selinux+tutorial+red+hat)
		- [Podman Tutorial – Rootless Containers](https://www.youtube.com/results?search_query=podman+tutorial+rootless+containers)
		- [Fedora Silverblue Guide](https://www.youtube.com/results?search_query=fedora+silverblue+guide)
		- [Linux Security Hardening](https://www.youtube.com/results?search_query=linux+security+hardening+tutorial)
		- [Btrfs Filesystem Tutorial](https://www.youtube.com/results?search_query=btrfs+filesystem+tutorial+linux)
		- [Cockpit Web Console Tutorial](https://www.youtube.com/results?search_query=cockpit+web+console+linux+tutorial)