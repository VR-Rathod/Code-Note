---
date: 2026-04-03T11:02:05+05:30
lastmod: 2026-04-03T11:02:05+05:30

seoTitle: Ubuntu Complete Guide – Commands, Admin & Development
description: "Comprehensive Ubuntu reference covering installation, kernel, shell, APT, networking, user management, security, desktop, server setup, and system administration."
keywords: "Ubuntu, ubuntu guide, ubuntu commands, ubuntu tutorial, ubuntu administration, ubuntu server, ubuntu desktop, apt, bash, linux, ubuntu notes, ubuntu 22.04, ubuntu 24.04, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
  collapsed:: true
	- ## How
		- Ubuntu is a **Debian-based** Linux distribution first released on **October 20, 2004**.
		- Name comes from the Nguni Bantu word meaning **"humanity towards others"** or "I am because we are."
		- Follows a **6-month release cycle** — April (XX.04 LTS or regular) and October (XX.10 regular).
		- **LTS (Long-Term Support)** releases every 2 years — supported for **5 years** (10 years with ESM).
		- Current LTS: **Ubuntu 24.04 LTS "Noble Numbat"** (April 2024).
	- ## Who
		- Founded by **Mark Shuttleworth** (South African entrepreneur) and his company **Canonical Ltd.**
		- Canonical maintains Ubuntu and provides commercial support.
	- ## Why
		- Debian was powerful but hard to install and use for newcomers.
		- Goal: make Linux accessible to everyone — easy installation, regular releases, strong community.
		- Became the most popular Linux distro for desktops, servers, cloud, and containers.
-
- # Introduction
  collapsed:: true
	- ## What is Ubuntu?
	  collapsed:: true
		- A general-purpose Linux OS for desktops, servers, cloud, IoT, and containers.
		- Based on **Debian** — uses the **APT** package manager and `.deb` packages.
		- Ships with **GNOME** desktop by default (Ubuntu Desktop). Server edition is CLI-only.
	- ## Flavours (Official)
	  collapsed:: true
		- ```
		  Ubuntu Desktop      → GNOME desktop (default)
		  Ubuntu Server       → CLI only, optimized for servers
		  Ubuntu Core         → minimal, snap-only, for IoT/embedded
		  Kubuntu             → KDE Plasma desktop
		  Xubuntu             → Xfce desktop (lightweight)
		  Lubuntu             → LXQt desktop (very lightweight)
		  Ubuntu MATE         → MATE desktop (classic feel)
		  Ubuntu Budgie       → Budgie desktop
		  Ubuntu Studio       → multimedia production (audio/video/graphics)
		  Ubuntu Kylin        → Chinese localization
		  ```
	- ## Release Naming Convention
	  collapsed:: true
		- ```
		  Format: YY.MM "Adjective Animal"
		  Examples:
		    22.04 LTS  → "Jammy Jellyfish"   (supported until 2027)
		    23.10      → "Mantic Minotaur"   (9 months support)
		    24.04 LTS  → "Noble Numbat"      (supported until 2029)
		    24.10      → "Oracular Oriole"   (9 months support)
		  LTS = Long-Term Support (every even year April release)
		  ```
	- ## Advantages
	  collapsed:: true
		- Beginner-friendly, huge community, excellent documentation, free, Debian-based stability, 5-year LTS support, snap + apt packages, strong cloud/server presence (AWS/Azure/GCP default), WSL2 support, great hardware compatibility.
	- ## Disadvantages
	  collapsed:: true
		- Snap packages controversial (slower startup, sandboxed), GNOME can be resource-heavy, some proprietary drivers need manual install, 6-month releases can break things, Canonical telemetry (opt-out available).
	- ## Use Cases
	  collapsed:: true
		- Desktop computing, web/app servers, cloud VMs (AWS/Azure/GCP), Docker/Kubernetes hosts, development environments, WSL2 on Windows, Raspberry Pi, CI/CD pipelines.
-
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Ubuntu Desktop (minimum):
		    CPU:   2 GHz dual-core
		    RAM:   4 GB (8 GB recommended)
		    Disk:  25 GB
		    GPU:   1024x768 display
		  
		  Ubuntu Server (minimum):
		    CPU:   1 GHz
		    RAM:   512 MB (1 GB recommended)
		    Disk:  2.5 GB
		  ```
	- ## Installation Steps
		- ```
		  1. Download ISO: ubuntu.com/download
		  2. Create bootable USB: Rufus (Windows) or dd (Linux/macOS)
		     dd if=ubuntu.iso of=/dev/sdX bs=4M status=progress && sync
		  3. Boot from USB (F2/F12/Del for boot menu)
		  4. Try Ubuntu (live) or Install Ubuntu
		  5. Choose: Normal / Minimal installation
		  6. Partition: Erase disk (simple) or Manual (dual-boot)
		  7. Set timezone, username, password
		  8. Install → reboot → remove USB
		  ```
	- ## First Boot Configuration
		- ```bash
		  sudo apt update && sudo apt upgrade -y    # update everything
		  sudo apt install build-essential curl wget git vim -y  # essentials
		  sudo apt install ubuntu-restricted-extras -y  # codecs, fonts
		  # Install proprietary drivers (NVIDIA etc.)
		  sudo ubuntu-drivers autoinstall
		  # Or manually: Software & Updates → Additional Drivers
		  ```
	- ## Ubuntu on WSL2 (Windows)
		- ```powershell
		  wsl --install                  # installs Ubuntu by default
		  wsl --install -d Ubuntu-24.04  # specific version
		  ```
	- ## Ubuntu on Cloud
		- ```bash
		  # AWS: search "Ubuntu" in AMI marketplace — official Canonical AMIs
		  # Azure: az vm create --image Ubuntu2204 ...
		  # GCP: gcloud compute instances create ... --image-family ubuntu-2404-lts
		  # DigitalOcean, Linode, Vultr: Ubuntu available as default droplet/instance image
		  ```
-
- # Kernel & Architecture
  collapsed:: true
	- ## Linux Kernel
		- Ubuntu runs the **Linux kernel** — a **monolithic kernel** with loadable modules.
		- Kernel file: `/boot/vmlinuz-<version>`
		- Ubuntu ships with the **HWE (Hardware Enablement)** kernel on LTS for newer hardware support.
		- ```bash
		  uname -r                       # current kernel version
		  uname -a                       # full kernel + system info
		  cat /proc/version              # kernel version + compiler
		  ls /boot/vmlinuz*              # installed kernels
		  sudo apt install linux-generic-hwe-22.04  # install HWE kernel
		  ```
	- ## Boot Process
		- ```
		  Power On
		  → BIOS/UEFI POST
		  → GRUB2 bootloader (/boot/grub/grub.cfg)
		  → Kernel decompresses → mounts initramfs (early root filesystem)
		  → Kernel initializes hardware → mounts real root filesystem
		  → systemd (PID 1) starts
		  → systemd targets: sysinit → basic → multi-user / graphical
		  → Login prompt (TTY or GDM display manager)
		  ```
	- ## Linux File System Hierarchy (FHS)
		- ```
		  /           Root of entire filesystem
		  ├── /bin    → Essential user binaries (ls, cp, cat) — symlink to /usr/bin in Ubuntu 20+
		  ├── /boot   → Kernel, initramfs, GRUB files
		  ├── /dev    → Device files (hardware as files)
		  ├── /etc    → System-wide configuration files
		  ├── /home   → User home directories (/home/username)
		  ├── /lib    → Shared libraries — symlink to /usr/lib in Ubuntu 20+
		  ├── /media  → Auto-mounted removable media (USB, CD)
		  ├── /mnt    → Manual temporary mount point
		  ├── /opt    → Optional/third-party software
		  ├── /proc   → Virtual fs: process & kernel info (not on disk)
		  ├── /root   → Root user home directory
		  ├── /run    → Runtime data (PIDs, sockets) — cleared on reboot
		  ├── /sbin   → System admin binaries — symlink to /usr/sbin in Ubuntu 20+
		  ├── /snap   → Snap package mount points (Ubuntu-specific)
		  ├── /srv    → Data served by system (web/FTP files)
		  ├── /sys    → Virtual fs: hardware/driver info (not on disk)
		  ├── /tmp    → Temporary files (cleared on reboot)
		  ├── /usr    → User programs, libraries, docs
		  │   ├── /usr/bin    Most user commands
		  │   ├── /usr/lib    Libraries
		  │   ├── /usr/local  Locally compiled software
		  │   └── /usr/share  Architecture-independent data
		  └── /var    → Variable data
		      ├── /var/log    System and app logs
		      ├── /var/cache  Package and app caches
		      └── /var/www    Web server document root
		  ```
	- ## File Types
		- ```
		  -  Regular file
		  d  Directory
		  l  Symbolic link
		  c  Character device (keyboard, terminal)
		  b  Block device (hard drives, USB)
		  s  Socket (IPC)
		  p  Named pipe (FIFO)
		  ```
-
- # Shell & Terminal
  collapsed:: true
	- ## Shell Types
		- ```
		  bash   Bourne Again Shell  → default Ubuntu shell, $ prompt
		  zsh    Z Shell             → popular alternative, % prompt
		  fish   Friendly Shell      → user-friendly, auto-suggestions
		  sh     Bourne Shell        → POSIX-compliant minimal shell
		  dash   Debian Almquist     → Ubuntu's /bin/sh, fast, minimal
		  ```
		- ```bash
		  echo $SHELL                    # current shell
		  cat /etc/shells                # available shells
		  chsh -s /bin/zsh               # change default shell
		  ```
	- ## File & Directory Commands
		- ```bash
		  pwd                            # print working directory
		  ls                             # list files
		  ls -la                         # detailed + hidden files
		  ls -lh                         # human-readable sizes
		  ls -lt                         # sort by modification time
		  cd /path  cd ~  cd ..  cd -    # navigate
		  touch file.txt                 # create file / update timestamp
		  touch file{1..5}.txt           # create file1.txt through file5.txt
		  mkdir dirname                  # create directory
		  mkdir -p a/b/c                 # create nested directories
		  cp source dest                 # copy file
		  cp -r src/ dest/               # copy directory recursively
		  cp -p source dest              # preserve permissions + timestamps
		  mv source dest                 # move or rename
		  rm file.txt                    # delete file
		  rm -rf dirname/                # delete directory (careful!)
		  ln -s target linkname          # create symbolic link
		  ln target hardlink             # create hard link
		  cat file.txt                   # print file
		  less file.txt                  # paginated view (q to quit)
		  head -n 20 file.txt            # first 20 lines
		  tail -n 20 file.txt            # last 20 lines
		  tail -f /var/log/syslog        # follow log live
		  file filename                  # show file type
		  wc -l file.txt                 # count lines
		  stat file.txt                  # detailed file info (size, inode, times)
		  ```
	- ## Search & Find
		- ```bash
		  find / -name "*.conf"          # find by name
		  find /home -type f -size +1M   # files > 1MB
		  find . -mtime -7               # modified in last 7 days
		  find . -perm 777               # files with 777 permissions
		  find . -name "*.log" -delete   # find and delete
		  locate filename                # fast search (uses updatedb database)
		  sudo updatedb                  # update locate database
		  which python3                  # find executable location
		  whereis nginx                  # find binary + man page + source
		  type ls                        # show if alias/builtin/file
		  ```
	- ## File Permissions
		- ```
		  Format: -rwxrwxrwx  (type | owner | group | others)
		  r=4  w=2  x=1   →  7=rwx  6=rw-  5=r-x  4=r--  0=---
		  
		  chmod 755 script.sh    # owner:rwx group:r-x others:r-x
		  chmod 644 file.txt     # owner:rw- group:r-- others:r--
		  chmod 600 ~/.ssh/id_rsa # owner:rw- only (SSH private key)
		  chmod +x script.sh     # add execute for all
		  chmod u+x script.sh    # add execute for owner only
		  chmod go-w file        # remove write from group+others
		  chmod -R 755 dir/      # recursive
		  
		  chown user file.txt           # change owner
		  chown user:group file.txt     # change owner and group
		  chown -R user:group dir/      # recursive
		  
		  # Special bits
		  chmod u+s binary       # SUID: run as file owner (e.g. passwd)
		  chmod g+s dir/         # SGID: new files inherit group
		  chmod +t /tmp          # Sticky bit: only owner can delete
		  
		  # ACL (fine-grained permissions)
		  getfacl file.txt              # view ACL
		  setfacl -m u:username:rw file.txt  # grant user rw
		  setfacl -x u:username file.txt     # remove user ACL
		  ```
	- ## I/O Redirection & Pipes
		- ```bash
		  command > file.txt     # stdout to file (overwrite)
		  command >> file.txt    # stdout to file (append)
		  command 2> error.txt   # stderr to file
		  command 2>&1           # stderr → stdout
		  command &> file.txt    # both stdout + stderr
		  command < file.txt     # file as stdin
		  cmd1 | cmd2            # pipe stdout of cmd1 to cmd2
		  cmd1 |& cmd2           # pipe stdout + stderr
		  
		  # Text processing
		  grep "pattern" file            # search pattern
		  grep -r "pattern" dir/         # recursive
		  grep -i -v -n "pattern" file   # case-insensitive / invert / line numbers
		  grep -E "regex" file           # extended regex
		  awk '{print $1}' file          # print first column
		  awk -F: '{print $1}' /etc/passwd  # custom delimiter
		  sed 's/old/new/g' file         # replace all occurrences
		  sed -i 's/old/new/g' file      # in-place edit
		  cut -d: -f1 /etc/passwd        # cut field 1 with : delimiter
		  sort file                      # sort alphabetically
		  sort -n file                   # sort numerically
		  sort -rn file                  # reverse numeric sort
		  uniq                           # remove adjacent duplicates
		  sort file | uniq -c | sort -rn # count occurrences
		  tr 'a-z' 'A-Z'                 # translate characters
		  tee file.txt                   # write to file AND stdout
		  xargs                          # build commands from stdin
		  ```
	- ## Text Editors
		- ```bash
		  nano file.txt          # beginner-friendly
		  # Ctrl+O → save  Ctrl+X → exit  Ctrl+W → search  Ctrl+K → cut line
		  
		  vim file.txt           # powerful modal editor
		  # Modes: Normal (default) | Insert (i) | Visual (v) | Command (:)
		  # :w save  :q quit  :wq save+quit  :q! force quit
		  # dd delete line  yy copy  p paste  /word search  n next match
		  # :%s/old/new/g  replace all
		  
		  nano ~/.bashrc         # edit bash config
		  source ~/.bashrc       # reload without restarting terminal
		  ```
	- ## Shell Scripting
		- ```bash
		  #!/bin/bash
		  # Variables
		  name="Ubuntu"
		  version=24
		  readonly PI=3.14       # constant
		  
		  # String operations
		  echo "Hello, $name"
		  echo "Length: ${#name}"
		  echo "Upper: ${name^^}"
		  echo "Slice: ${name:0:3}"
		  
		  # Conditionals
		  if [ "$version" -ge 22 ]; then
		      echo "Modern Ubuntu"
		  elif [ "$version" -eq 20 ]; then
		      echo "Ubuntu 20"
		  else
		      echo "Older Ubuntu"
		  fi
		  
		  # File tests
		  [ -f file.txt ] && echo "file exists"
		  [ -d /etc ]     && echo "directory exists"
		  [ -r file.txt ] && echo "readable"
		  [ -x script.sh ] && echo "executable"
		  
		  # Loops
		  for i in {1..5}; do echo "Item $i"; done
		  for file in *.txt; do echo "$file"; done
		  while read line; do echo "$line"; done < file.txt
		  
		  # Functions
		  greet() {
		      local name="$1"
		      echo "Hello, ${name:-World}!"
		  }
		  greet "Ubuntu"
		  
		  # Arrays
		  fruits=("apple" "banana" "cherry")
		  echo "${fruits[0]}"           # first element
		  echo "${fruits[@]}"           # all elements
		  echo "${#fruits[@]}"          # array length
		  
		  # Exit codes
		  command && echo "success" || echo "failed"
		  command; echo "exit code: $?"
		  ```
	- ## Keyboard Shortcuts (Terminal)
		- ```
		  Ctrl+A/E   → start/end of line
		  Ctrl+W     → delete word before cursor
		  Ctrl+U/K   → delete to start/end of line
		  Ctrl+R     → reverse history search
		  Ctrl+C     → cancel command
		  Ctrl+Z     → suspend (fg to resume, bg to background)
		  Ctrl+L     → clear screen
		  Ctrl+D     → logout / EOF
		  Tab        → autocomplete
		  !!         → repeat last command
		  !string    → repeat last command starting with string
		  Alt+.      → insert last argument of previous command
		  ```
-
- # Process Management
  collapsed:: true
	- ## Viewing Processes
		- ```bash
		  ps aux                         # all running processes
		  ps aux | grep nginx            # filter by name
		  ps -ef --forest                # process tree with parent info
		  top                            # real-time monitor (q to quit)
		  htop                           # improved top (sudo apt install htop)
		  pgrep nginx                    # get PID by name
		  pstree                         # visual process tree
		  pstree -p                      # with PIDs
		  ```
	- ## Controlling Processes
		- ```bash
		  kill PID                       # SIGTERM — graceful stop
		  kill -9 PID                    # SIGKILL — force kill
		  kill -HUP PID                  # SIGHUP — reload config
		  killall nginx                  # kill all by name
		  pkill -f "python script.py"    # kill by pattern
		  command &                      # run in background
		  Ctrl+Z → bg                    # suspend then background
		  fg                             # bring to foreground
		  fg %2                          # bring job 2 to foreground
		  jobs                           # list background jobs
		  nohup command &                # survive logout
		  disown %1                      # detach job from shell
		  ```
	- ## System Information
		- ```bash
		  uname -a                       # kernel + system info
		  hostname                       # system hostname
		  hostname -I                    # all IP addresses
		  whoami                         # current user
		  id                             # UID, GID, groups
		  uptime                         # uptime + load average
		  w                              # who is logged in + what they're doing
		  last                           # login history
		  df -h                          # disk space usage
		  df -hT                         # with filesystem type
		  du -sh /path                   # directory size
		  du -sh /* 2>/dev/null | sort -rh | head -20  # top 20 largest dirs
		  free -h                        # RAM + swap usage
		  lscpu                          # CPU info
		  lsblk                          # block devices
		  lsblk -f                       # with filesystem types
		  lsusb                          # USB devices
		  lspci                          # PCI devices
		  lshw -short                    # hardware summary
		  cat /proc/cpuinfo              # detailed CPU info
		  cat /proc/meminfo              # detailed memory info
		  cat /etc/os-release            # Ubuntu version info
		  lsb_release -a                 # Ubuntu release details
		  ```
-
- # Systemd & Service Management
  collapsed:: true
	- ## systemctl
		- ```bash
		  systemctl start nginx          # start service
		  systemctl stop nginx           # stop service
		  systemctl restart nginx        # restart service
		  systemctl reload nginx         # reload config (no downtime)
		  systemctl enable nginx         # start on boot
		  systemctl disable nginx        # don't start on boot
		  systemctl status nginx         # status + recent logs
		  systemctl is-active nginx      # active / inactive
		  systemctl is-enabled nginx     # enabled / disabled
		  systemctl list-units --type=service --state=running
		  systemctl list-units --type=service --state=failed
		  systemctl daemon-reload        # reload after editing unit files
		  systemctl reboot               # reboot system
		  systemctl poweroff             # shutdown
		  ```
	- ## Creating a Custom Service
		- ```bash
		  sudo nano /etc/systemd/system/myapp.service
		  ```
		- ```ini
		  [Unit]
		  Description=My Application
		  After=network.target
		  
		  [Service]
		  Type=simple
		  User=www-data
		  WorkingDirectory=/opt/myapp
		  ExecStart=/usr/bin/python3 /opt/myapp/app.py
		  Restart=on-failure
		  RestartSec=5
		  
		  [Install]
		  WantedBy=multi-user.target
		  ```
		- ```bash
		  sudo systemctl daemon-reload
		  sudo systemctl enable --now myapp
		  ```
	- ## journalctl — Logs
		- ```bash
		  journalctl -f                  # follow live (like tail -f)
		  journalctl -u nginx            # logs for specific service
		  journalctl -u nginx -f         # follow service logs
		  journalctl -b                  # since last boot
		  journalctl -b -1               # previous boot
		  journalctl -p err              # errors only
		  journalctl -p warning          # warnings and above
		  journalctl --since "1 hour ago"
		  journalctl --since "2024-01-01" --until "2024-01-02"
		  journalctl -n 50               # last 50 lines
		  journalctl --disk-usage        # log disk usage
		  journalctl --vacuum-time=7d    # delete logs older than 7 days
		  ```
	- ## Important Log Files
		- ```
		  /var/log/syslog        → general system messages
		  /var/log/auth.log      → SSH logins, sudo, authentication
		  /var/log/kern.log      → kernel messages
		  /var/log/dpkg.log      → package install/remove history
		  /var/log/apt/          → apt operation logs
		  /var/log/nginx/        → nginx access + error logs
		  /var/log/apache2/      → apache access + error logs
		  /var/log/mysql/        → MySQL logs
		  /var/log/ufw.log       → UFW firewall logs
		  /var/log/fail2ban.log  → fail2ban blocked IPs
		  
		  # Useful log commands
		  tail -f /var/log/syslog
		  grep "Failed password" /var/log/auth.log
		  grep "Accepted" /var/log/auth.log
		  lastb                          # failed login attempts
		  lastlog                        # last login for all users
		  ```
-
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- ```
		  root          → superuser, UID 0, full system control
		  sudo user     → regular user with sudo privileges (Ubuntu default)
		  system user   → no login shell, used by services (www-data, mysql, etc.)
		  regular user  → normal login user
		  ```
	- ## User Commands
		- ```bash
		  adduser username               # interactive: creates home dir + sets password
		  useradd -m -s /bin/bash user   # manual: -m=home dir, -s=shell
		  passwd username                # set/change password
		  passwd -l username             # lock account
		  passwd -u username             # unlock account
		  usermod -aG sudo username      # add to sudo group (grant sudo)
		  usermod -aG docker username    # add to docker group
		  usermod -s /bin/zsh username   # change shell
		  usermod -d /new/home username  # change home directory
		  userdel username               # delete user (keep home dir)
		  userdel -r username            # delete user + home dir
		  su - username                  # switch user (load their environment)
		  sudo -i                        # root shell
		  sudo -u username command       # run command as another user
		  id username                    # show UID, GID, groups
		  who                            # who is logged in
		  w                              # who + what they're doing
		  last                           # login history
		  ```
	- ## Important User Files
		- ```
		  /etc/passwd   → username:x:UID:GID:comment:home:shell
		  /etc/shadow   → hashed passwords (root only)
		  /etc/group    → group definitions
		  /etc/sudoers  → sudo permissions (ALWAYS edit with: sudo visudo)
		  ~/.bashrc     → user bash config (aliases, env vars)
		  ~/.bash_profile / ~/.profile → login shell config
		  ~/.ssh/       → SSH keys
		  ~/.ssh/authorized_keys → public keys for SSH login
		  ```
	- ## sudo Configuration
		- ```bash
		  sudo visudo                    # safely edit /etc/sudoers
		  # Add user to sudoers file:
		  username ALL=(ALL:ALL) ALL
		  # Allow without password:
		  username ALL=(ALL) NOPASSWD: ALL
		  # Allow specific command only:
		  username ALL=(ALL) NOPASSWD: /usr/bin/apt
		  ```
	- ## Group Commands
		- ```bash
		  groupadd groupname             # create group
		  groupdel groupname             # delete group
		  groupmod -n newname oldname    # rename group
		  usermod -aG group1,group2 user # add user to groups
		  gpasswd -a user group          # add user to group
		  gpasswd -d user group          # remove user from group
		  groups username                # show user's groups
		  getent group groupname         # group details
		  newgrp groupname               # switch active group (current session)
		  ```
-
- # Package Management
  collapsed:: true
	- ## APT (Advanced Package Tool)
		- ```bash
		  sudo apt update                        # refresh package lists
		  sudo apt upgrade -y                    # upgrade installed packages
		  sudo apt full-upgrade -y               # upgrade + handle dependency changes
		  sudo apt install package               # install package
		  sudo apt install package1 package2     # install multiple
		  sudo apt install ./local.deb           # install local .deb file
		  sudo apt remove package                # remove (keep config files)
		  sudo apt purge package                 # remove + config files
		  sudo apt autoremove                    # remove unused dependencies
		  sudo apt autoclean                     # clean old downloaded packages
		  sudo apt clean                         # clear entire package cache
		  apt search keyword                     # search packages
		  apt show package                       # package details
		  apt list --installed                   # list installed packages
		  apt list --upgradable                  # list upgradable packages
		  dpkg -l | grep package                 # check if installed
		  dpkg -l                                # list all installed packages
		  dpkg -i package.deb                    # install .deb directly
		  dpkg -r package                        # remove package
		  dpkg --get-selections                  # list all installed
		  ```
	- ## APT Sources & PPAs
		- ```bash
		  cat /etc/apt/sources.list              # main package sources
		  ls /etc/apt/sources.list.d/            # additional sources
		  
		  # Add PPA (Personal Package Archive)
		  sudo add-apt-repository ppa:user/ppa-name
		  sudo apt update && sudo apt install package
		  
		  # Remove PPA
		  sudo add-apt-repository --remove ppa:user/ppa-name
		  
		  # Add third-party repo (example: Docker)
		  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
		  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
		  sudo apt update && sudo apt install docker-ce
		  ```
	- ## Snap Packages
		- ```bash
		  snap find package              # search snap store
		  sudo snap install package      # install snap
		  sudo snap install code --classic  # install with classic confinement
		  sudo snap remove package       # remove snap
		  snap list                      # list installed snaps
		  sudo snap refresh              # update all snaps
		  sudo snap refresh package      # update specific snap
		  snap info package              # package details + versions
		  snap connections package       # snap interfaces/permissions
		  ```
	- ## Flatpak (Optional)
		- ```bash
		  sudo apt install flatpak -y
		  flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
		  flatpak install flathub org.gimp.GIMP
		  flatpak run org.gimp.GIMP
		  flatpak update
		  flatpak list
		  flatpak uninstall org.gimp.GIMP
		  ```
-
- # Networking
  collapsed:: true
	- ## Network Info
		- ```bash
		  ip a                           # all interfaces + IPs
		  ip addr show eth0              # specific interface
		  ip route                       # routing table
		  ip route show default          # default gateway
		  hostname -I                    # all IP addresses
		  cat /etc/hosts                 # local DNS overrides
		  cat /etc/resolv.conf           # DNS servers
		  ss -tulnp                      # listening ports + processes
		  ss -tulnp | grep :80           # filter by port
		  lsof -i :80                    # what uses port 80
		  netstat -tulnp                 # (older, needs net-tools)
		  ```
	- ## Network Testing
		- ```bash
		  ping -c 4 google.com           # ping 4 times
		  ping -i 0.2 google.com         # fast ping
		  traceroute google.com          # trace route
		  mtr google.com                 # real-time traceroute (sudo apt install mtr)
		  dig google.com                 # DNS lookup
		  dig google.com MX              # MX records
		  dig google.com ANY             # all records
		  nslookup google.com            # simple DNS lookup
		  curl -I https://example.com    # HTTP headers only
		  curl -L https://example.com    # follow redirects
		  wget https://example.com/file  # download file
		  wget -r -np https://site.com   # recursive download
		  nc -zv host 80                 # test TCP port connectivity
		  nc -zvu host 53                # test UDP port
		  ```
	- ## Network Configuration (Netplan — Ubuntu 18.04+)
		- ```bash
		  ls /etc/netplan/               # netplan config files
		  sudo nano /etc/netplan/01-netcfg.yaml
		  ```
		- ```yaml
		  # Static IP example
		  network:
		    version: 2
		    renderer: networkd
		    ethernets:
		      eth0:
		        addresses:
		          - 192.168.1.100/24
		        routes:
		          - to: default
		            via: 192.168.1.1
		        nameservers:
		          addresses: [8.8.8.8, 8.8.4.4]
		        dhcp4: false
		  
		  # DHCP example
		  network:
		    version: 2
		    ethernets:
		      eth0:
		        dhcp4: true
		  ```
		- ```bash
		  sudo netplan try               # test config (auto-reverts if no confirm)
		  sudo netplan apply             # apply config
		  sudo netplan generate          # generate backend config
		  ```
	- ## SSH
		- ```bash
		  ssh user@host                  # connect
		  ssh user@host -p 2222          # custom port
		  ssh -i ~/.ssh/id_rsa user@host # with private key
		  ssh-keygen -t ed25519 -C "email@example.com"  # generate key (recommended)
		  ssh-keygen -t rsa -b 4096      # RSA 4096-bit key
		  ssh-copy-id user@host          # copy public key to remote host
		  ssh -L 8080:localhost:80 user@host   # local port forward
		  ssh -R 8080:localhost:80 user@host   # remote port forward
		  ssh -D 1080 user@host               # SOCKS5 proxy
		  ssh -N -f user@host -L 8080:localhost:80  # background tunnel
		  
		  # SSH server
		  sudo apt install openssh-server
		  sudo systemctl enable --now ssh
		  sudo nano /etc/ssh/sshd_config
		  # Key settings:
		  #   Port 22
		  #   PermitRootLogin no
		  #   PasswordAuthentication no   (after setting up key auth)
		  #   PubkeyAuthentication yes
		  sudo systemctl restart ssh
		  ```
	- ## UFW Firewall
		- ```bash
		  sudo ufw status                # check status
		  sudo ufw status verbose        # detailed status with rules
		  sudo ufw enable                # enable firewall
		  sudo ufw disable               # disable firewall
		  sudo ufw allow 22              # allow SSH
		  sudo ufw allow 80/tcp          # allow HTTP
		  sudo ufw allow 443/tcp         # allow HTTPS
		  sudo ufw allow 8080            # allow custom port
		  sudo ufw deny 23               # deny telnet
		  sudo ufw allow from 192.168.1.0/24  # allow subnet
		  sudo ufw allow from 192.168.1.10 to any port 22  # specific IP + port
		  sudo ufw delete allow 80/tcp   # delete rule
		  sudo ufw reset                 # reset all rules
		  sudo ufw logging on            # enable logging → /var/log/ufw.log
		  # Default policies
		  sudo ufw default deny incoming
		  sudo ufw default allow outgoing
		  ```
	- ## Fail2Ban
		- ```bash
		  sudo apt install fail2ban -y
		  sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
		  sudo nano /etc/fail2ban/jail.local
		  # Key settings:
		  #   [sshd]
		  #   enabled = true
		  #   maxretry = 3
		  #   bantime = 3600
		  #   findtime = 600
		  sudo systemctl enable --now fail2ban
		  sudo fail2ban-client status        # overall status
		  sudo fail2ban-client status sshd   # SSH jail status
		  sudo fail2ban-client set sshd unbanip 1.2.3.4  # unban IP
		  ```
-
- # Disk & Storage Management
  collapsed:: true
	- ## Disk Info
		- ```bash
		  lsblk                          # list block devices
		  lsblk -f                       # with filesystem types + UUIDs
		  fdisk -l                       # all disks and partitions (sudo)
		  df -h                          # disk space usage
		  df -hT                         # with filesystem type
		  du -sh /path                   # directory size
		  du -sh /* 2>/dev/null | sort -rh | head -20  # top 20 largest dirs
		  blkid                          # UUIDs and filesystem types
		  ```
	- ## Partitioning
		- ```bash
		  sudo fdisk /dev/sdb            # partition disk (MBR/GPT)
		  sudo parted /dev/sdb           # partition disk (GPT preferred)
		  sudo parted /dev/sdb mklabel gpt
		  sudo parted /dev/sdb mkpart primary ext4 0% 100%
		  sudo mkfs.ext4 /dev/sdb1       # format as ext4
		  sudo mkfs.xfs /dev/sdb1        # format as XFS
		  sudo mkfs.vfat /dev/sdb1       # format as FAT32
		  ```
	- ## Mounting
		- ```bash
		  sudo mount /dev/sdb1 /mnt      # mount partition
		  sudo mount -o ro /dev/sdb1 /mnt  # read-only
		  sudo mount -t ext4 /dev/sdb1 /mnt
		  sudo umount /mnt               # unmount
		  
		  # Permanent mount — add to /etc/fstab
		  sudo blkid /dev/sdb1           # get UUID
		  sudo nano /etc/fstab
		  # UUID=xxxx-xxxx  /mnt/data  ext4  defaults  0  2
		  sudo mount -a                  # test fstab without reboot
		  ```
	- ## Swap
		- ```bash
		  swapon --show                  # show swap
		  free -h                        # RAM + swap usage
		  # Create swap file
		  sudo fallocate -l 4G /swapfile
		  sudo chmod 600 /swapfile
		  sudo mkswap /swapfile
		  sudo swapon /swapfile
		  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
		  # Adjust swappiness (0-100, default 60)
		  sudo sysctl vm.swappiness=10
		  echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
		  ```
	- ## LVM (Logical Volume Manager)
		- ```bash
		  # Physical Volumes
		  sudo pvcreate /dev/sdb         # create PV
		  sudo pvdisplay                 # show PVs
		  # Volume Groups
		  sudo vgcreate myvg /dev/sdb    # create VG
		  sudo vgdisplay                 # show VGs
		  sudo vgextend myvg /dev/sdc    # add disk to VG
		  # Logical Volumes
		  sudo lvcreate -L 20G -n mylv myvg   # create 20GB LV
		  sudo lvcreate -l 100%FREE -n mylv myvg  # use all free space
		  sudo lvdisplay                 # show LVs
		  sudo mkfs.ext4 /dev/myvg/mylv  # format LV
		  sudo lvextend -L +10G /dev/myvg/mylv  # extend LV
		  sudo resize2fs /dev/myvg/mylv  # resize filesystem after extend
		  ```
-
- # Ubuntu Desktop (GNOME)
  collapsed:: true
	- ## GNOME Basics
		- ```
		  Super key          → Activities overview (search + app grid)
		  Super + A          → App grid
		  Super + Tab        → switch apps
		  Alt + Tab          → switch windows of same app
		  Super + D          → show desktop
		  Super + L          → lock screen
		  Super + ←/→        → snap window left/right
		  Super + ↑          → maximize
		  Super + ↓          → restore
		  Ctrl + Alt + T     → open terminal
		  Ctrl + Alt + ←/→   → switch workspaces
		  Super + Shift + ←/→ → move window to workspace
		  PrtScn             → screenshot tool
		  ```
	- ## GNOME Tweaks & Extensions
		- ```bash
		  sudo apt install gnome-tweaks -y       # GNOME Tweaks tool
		  sudo apt install gnome-shell-extensions -y
		  # Install extensions from: extensions.gnome.org
		  # Popular extensions:
		  #   Dash to Dock     → macOS-style dock
		  #   AppIndicator     → system tray icons
		  #   Blur my Shell    → blur effects
		  #   GSConnect        → KDE Connect for GNOME (phone integration)
		  ```
	- ## Display & Resolution
		- ```bash
		  xrandr                         # list displays + resolutions
		  xrandr --output HDMI-1 --mode 1920x1080 --rate 60  # set resolution
		  xrandr --output HDMI-1 --off   # disable display
		  # Wayland (Ubuntu 22.04+ default):
		  # Settings → Displays → Resolution / Refresh Rate
		  echo $XDG_SESSION_TYPE         # check: x11 or wayland
		  ```
	- ## Themes & Appearance
		- ```bash
		  # GNOME Tweaks → Appearance → Shell / Applications / Icons
		  # Popular themes:
		  sudo apt install yaru-theme-gtk yaru-theme-icon  # Ubuntu default Yaru
		  # Papirus icons:
		  sudo add-apt-repository ppa:papirus/papirus
		  sudo apt install papirus-icon-theme
		  ```
	- ## Startup Applications
		- ```
		  GNOME Tweaks → Startup Applications → Add
		  OR: gnome-session-properties (older)
		  OR: create .desktop file in ~/.config/autostart/
		  ```
		- ```bash
		  # Create autostart entry
		  nano ~/.config/autostart/myapp.desktop
		  ```
		- ```ini
		  [Desktop Entry]
		  Type=Application
		  Name=MyApp
		  Exec=/usr/bin/myapp
		  Hidden=false
		  NoDisplay=false
		  X-GNOME-Autostart-enabled=true
		  ```
-
- # Ubuntu Server Setup
  collapsed:: true
	- ## Initial Server Hardening
		- ```bash
		  # Update system
		  sudo apt update && sudo apt upgrade -y
		  # Create non-root sudo user
		  adduser deploy
		  usermod -aG sudo deploy
		  # Set up SSH key auth
		  mkdir -p /home/deploy/.ssh
		  nano /home/deploy/.ssh/authorized_keys  # paste public key
		  chmod 700 /home/deploy/.ssh
		  chmod 600 /home/deploy/.ssh/authorized_keys
		  chown -R deploy:deploy /home/deploy/.ssh
		  # Harden SSH
		  sudo nano /etc/ssh/sshd_config
		  # Set: PermitRootLogin no, PasswordAuthentication no, Port 2222
		  sudo systemctl restart ssh
		  # Enable firewall
		  sudo ufw allow 2222/tcp && sudo ufw enable
		  ```
	- ## LAMP Stack (Linux + Apache + MySQL + PHP)
		- ```bash
		  sudo apt install apache2 -y
		  sudo systemctl enable --now apache2
		  sudo ufw allow 'Apache Full'
		  
		  sudo apt install mysql-server -y
		  sudo mysql_secure_installation    # secure MySQL setup
		  sudo mysql -u root -p             # connect to MySQL
		  
		  sudo apt install php libapache2-mod-php php-mysql -y
		  sudo systemctl restart apache2
		  # Test: create /var/www/html/info.php with <?php phpinfo(); ?>
		  ```
	- ## LEMP Stack (Linux + Nginx + MySQL + PHP)
		- ```bash
		  sudo apt install nginx -y
		  sudo systemctl enable --now nginx
		  sudo ufw allow 'Nginx Full'
		  
		  sudo apt install mysql-server -y
		  sudo mysql_secure_installation
		  
		  sudo apt install php-fpm php-mysql -y
		  # Configure Nginx to use PHP-FPM:
		  sudo nano /etc/nginx/sites-available/default
		  # Add: location ~ \.php$ { include snippets/fastcgi-php.conf; fastcgi_pass unix:/run/php/php8.1-fpm.sock; }
		  sudo nginx -t && sudo systemctl reload nginx
		  ```
	- ## Nginx Configuration
		- ```bash
		  sudo nano /etc/nginx/sites-available/mysite
		  ```
		- ```nginx
		  server {
		      listen 80;
		      server_name example.com www.example.com;
		      root /var/www/mysite;
		      index index.html index.php;
		  
		      location / {
		          try_files $uri $uri/ =404;
		      }
		  
		      location ~ \.php$ {
		          include snippets/fastcgi-php.conf;
		          fastcgi_pass unix:/run/php/php8.1-fpm.sock;
		      }
		  
		      # Redirect HTTP to HTTPS
		      return 301 https://$host$request_uri;
		  }
		  ```
		- ```bash
		  sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/
		  sudo nginx -t                  # test config
		  sudo systemctl reload nginx    # apply
		  ```
	- ## SSL with Let's Encrypt (Certbot)
		- ```bash
		  sudo apt install certbot python3-certbot-nginx -y
		  sudo certbot --nginx -d example.com -d www.example.com
		  sudo certbot renew --dry-run   # test auto-renewal
		  # Auto-renewal is set up automatically via systemd timer
		  systemctl status certbot.timer
		  ```
	- ## Unattended Upgrades (Auto Security Updates)
		- ```bash
		  sudo apt install unattended-upgrades -y
		  sudo dpkg-reconfigure --priority=low unattended-upgrades
		  sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
		  # Enable: Unattended-Upgrade::Automatic-Reboot "true";
		  sudo unattended-upgrades --dry-run  # test
		  ```
-
- # Security
  collapsed:: true
	- ## AppArmor
		- ```bash
		  sudo aa-status                 # show AppArmor status + profiles
		  sudo aa-enforce /etc/apparmor.d/usr.sbin.nginx  # enforce profile
		  sudo aa-complain /etc/apparmor.d/usr.sbin.nginx # complain mode (log only)
		  sudo aa-disable /etc/apparmor.d/usr.sbin.nginx  # disable profile
		  sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx  # reload profile
		  ```
	- ## File Integrity & Auditing
		- ```bash
		  # AIDE — file integrity monitoring
		  sudo apt install aide -y
		  sudo aideinit                  # initialize database
		  sudo aide --check              # check for changes
		  
		  # auditd — system call auditing
		  sudo apt install auditd -y
		  sudo systemctl enable --now auditd
		  sudo auditctl -l               # list audit rules
		  sudo ausearch -k passwd        # search audit logs
		  sudo aureport --summary        # audit summary report
		  ```
	- ## Lynis — Security Audit
		- ```bash
		  sudo apt install lynis -y
		  sudo lynis audit system        # full system security audit
		  # Generates hardening suggestions + score
		  ```
	- ## ClamAV — Antivirus
		- ```bash
		  sudo apt install clamav clamav-daemon -y
		  sudo freshclam                 # update virus definitions
		  sudo clamscan -r /home         # scan home directory
		  sudo clamscan -r --remove /tmp # scan + remove infected files
		  sudo systemctl enable --now clamav-daemon
		  ```
	- ## Automatic Security Updates
		- ```bash
		  sudo apt install unattended-upgrades -y
		  sudo dpkg-reconfigure --priority=low unattended-upgrades
		  ```
-
- # Performance & Monitoring
  collapsed:: true
	- ## System Monitoring Tools
		- ```bash
		  top                            # real-time process monitor
		  htop                           # improved top (sudo apt install htop)
		  btop                           # modern resource monitor (sudo apt install btop)
		  glances                        # all-in-one monitor (sudo apt install glances)
		  iotop                          # disk I/O per process (sudo apt install iotop)
		  nethogs                        # network usage per process (sudo apt install nethogs)
		  iftop                          # network bandwidth monitor (sudo apt install iftop)
		  vmstat 1                       # virtual memory stats every 1 second
		  iostat -x 1                    # disk I/O stats (sudo apt install sysstat)
		  sar -u 1 5                     # CPU usage 5 times every 1 second
		  ```
	- ## Performance Tuning
		- ```bash
		  # Check CPU governor
		  cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor
		  # Set to performance mode
		  sudo apt install cpufrequtils -y
		  sudo cpufreq-set -g performance
		  
		  # Disable unnecessary services
		  systemctl list-units --type=service --state=running
		  sudo systemctl disable bluetooth  # if not needed
		  
		  # Adjust swappiness
		  sudo sysctl vm.swappiness=10
		  echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
		  
		  # Increase file descriptor limits
		  echo '* soft nofile 65536' | sudo tee -a /etc/security/limits.conf
		  echo '* hard nofile 65536' | sudo tee -a /etc/security/limits.conf
		  ```
	- ## Cron Jobs
		- ```bash
		  crontab -e                     # edit current user's crontab
		  crontab -l                     # list current user's crontab
		  sudo crontab -e                # edit root's crontab
		  crontab -r                     # remove crontab
		  
		  # Cron syntax: minute hour day month weekday command
		  # *  *  *  *  *  command
		  # ┬  ┬  ┬  ┬  ┬
		  # │  │  │  │  └── weekday (0-7, 0=Sun)
		  # │  │  │  └───── month (1-12)
		  # │  │  └──────── day (1-31)
		  # │  └─────────── hour (0-23)
		  # └────────────── minute (0-59)
		  
		  # Examples:
		  0 2 * * *  /usr/bin/backup.sh          # daily at 2:00 AM
		  */15 * * * * /usr/bin/check.sh         # every 15 minutes
		  0 0 * * 0   /usr/bin/weekly.sh         # every Sunday midnight
		  @reboot     /usr/bin/startup.sh        # on every reboot
		  @daily      /usr/bin/daily.sh          # once a day
		  
		  # System-wide cron directories
		  ls /etc/cron.daily/
		  ls /etc/cron.weekly/
		  ls /etc/cron.monthly/
		  ls /etc/cron.d/
		  ```
-
- # Development Environment Setup
  collapsed:: true
	- ## Common Dev Tools
		- ```bash
		  sudo apt install build-essential git curl wget vim -y
		  sudo apt install python3 python3-pip python3-venv -y
		  sudo apt install nodejs npm -y
		  # Or use nvm for Node.js version management:
		  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
		  nvm install --lts
		  nvm use --lts
		  ```
	- ## Docker on Ubuntu
		- ```bash
		  # Install Docker
		  sudo apt install ca-certificates curl gnupg -y
		  sudo install -m 0755 -d /etc/apt/keyrings
		  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
		  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
		  sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin -y
		  sudo usermod -aG docker $USER   # run docker without sudo (re-login required)
		  docker run hello-world          # test
		  ```
	- ## Git Configuration
		- ```bash
		  git config --global user.name "Your Name"
		  git config --global user.email "email@example.com"
		  git config --global core.editor vim
		  git config --global init.defaultBranch main
		  git config --list               # view all config
		  # Generate SSH key for GitHub/GitLab
		  ssh-keygen -t ed25519 -C "email@example.com"
		  cat ~/.ssh/id_ed25519.pub       # copy this to GitHub SSH keys
		  ```
	- ## Python Virtual Environments
		- ```bash
		  python3 -m venv myenv           # create virtual environment
		  source myenv/bin/activate       # activate
		  deactivate                      # deactivate
		  pip install package             # install in venv
		  pip freeze > requirements.txt   # export dependencies
		  pip install -r requirements.txt # install from file
		  ```
	- ## Environment Variables
		- ```bash
		  export MYVAR="hello"            # set for current session
		  echo $MYVAR                     # print variable
		  printenv                        # list all env vars
		  unset MYVAR                     # remove variable
		  
		  # Permanent — add to ~/.bashrc or ~/.profile
		  echo 'export MYVAR="hello"' >> ~/.bashrc
		  source ~/.bashrc
		  
		  # System-wide — add to /etc/environment
		  sudo nano /etc/environment
		  # MYVAR="hello"
		  ```
-
- # More Learn
	- ## Github & Webs
		- [Ubuntu Official Documentation](https://ubuntu.com/server/docs)
		- [Ubuntu Desktop Guide](https://help.ubuntu.com)
		- [Ubuntu Community Help Wiki](https://help.ubuntu.com/community)
		- [Ask Ubuntu (Q&A)](https://askubuntu.com)
		- [Netplan Documentation](https://netplan.io/reference)
		- [Ubuntu Security Notices](https://ubuntu.com/security/notices)
	- ## Master Playlists YouTube
		- [Ubuntu Linux Full Course – freeCodeCamp](https://www.youtube.com/results?search_query=ubuntu+linux+full+course+freecodecamp)
		- [Linux for Beginners – NetworkChuck](https://www.youtube.com/results?search_query=linux+beginners+networkchuck)
		- [Ubuntu Server Setup – TechWorld with Nana](https://www.youtube.com/results?search_query=ubuntu+server+setup+techworld+nana)