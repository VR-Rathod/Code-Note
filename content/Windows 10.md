---
seoTitle: Windows 10 Complete Guide – Architecture, Commands & Administration
description: "Comprehensive Windows 10 reference covering architecture, installation, PowerShell, CMD, registry, networking, user management, security, and system administration."
keywords: "Windows 10, windows commands, powershell, cmd, windows administration, windows registry, windows networking, windows security, windows 10 guide, windows 10 notes, windows 10 tutorial, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
	- ## How
		- Windows 10 was released by **Microsoft** on **July 29, 2015** as the successor to Windows 8.1.
		- Offered as a **free upgrade** for Windows 7 and 8.1 users for the first year.
		- Introduced a **unified platform** across PC, tablet, Xbox, HoloLens, and IoT devices.
		- Follows a **Windows as a Service (WaaS)** model — continuous updates instead of major version releases.
		- Two major update channels: **Semi-Annual Channel** (feature updates) and **Long-Term Servicing Channel (LTSC)**.
		-
	- ## Who
		- **Microsoft Corporation** — developed and maintained by the Windows division.
		- Key figures: **Terry Myerson** (EVP Windows), **Joe Belfiore** (VP OS Group).
	-
	- ## Why
		- Windows 8/8.1 was widely criticized for removing the Start Menu and poor desktop UX.
		- Goal: reunify the Windows ecosystem, restore familiar desktop experience, and modernize the OS.
		- Introduced: Start Menu return, virtual desktops, DirectX 12, Windows Hello, WSL, and Cortana.
-
- # Introduction
  collapsed:: true
	- ## What is Windows 10?
		- A general-purpose OS by Microsoft for desktops, laptops, tablets, and embedded devices.
		- Built on the **Windows NT kernel** — same lineage as Windows XP, Vista, 7, 8.
		- Supports both **32-bit (x86)** and **64-bit (x64)** architectures.
	- ## Editions
		- ```
		  Windows 10 Home        → consumers, basic features
		  Windows 10 Pro         → business, BitLocker, Remote Desktop, Hyper-V
		  Windows 10 Enterprise  → large orgs, advanced security, LTSC available
		  Windows 10 Education   → schools, similar to Enterprise
		  Windows 10 LTSC        → Long-Term Servicing Channel, no feature updates
		  Windows 10 S Mode      → only Microsoft Store apps (locked down)
		  Windows 10 IoT Core    → embedded/IoT devices
		  ```
	- ## Advantages
		- Familiar Start Menu, broad hardware/software compatibility, DirectX 12, WSL2 (Linux subsystem), strong gaming support, enterprise-grade security (BitLocker, Windows Hello, Defender), frequent updates, huge driver ecosystem.
	- ## Disadvantages
		- Telemetry/data collection by default, forced updates can disrupt workflow, bloatware in Home edition, resource-heavy compared to Linux, less transparent than open-source OSes.
	- ## Use Cases
		- General desktop computing, gaming, enterprise workstations, software development (with WSL2), multimedia production, corporate managed environments.
-
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum:
		    CPU:  1 GHz or faster, 2+ cores, 64-bit
		    RAM:  4 GB (64-bit)
		    Disk: 64 GB
		    GPU:  DirectX 9 compatible, WDDM 2.0 driver
		    Display: 720p, 9" diagonal, 8 bits per color channel
		  Recommended:
		    CPU:  Multi-core 64-bit (Intel Core i5/i7 or AMD Ryzen)
		    RAM:  8–16 GB
		    Disk: 256 GB SSD
		    GPU:  DirectX 12 compatible
		  ```
	- ## Installation Steps
		- ```
		  1. Download ISO from microsoft.com/software-download/windows10
		  2. Create bootable USB with Rufus (rufus.ie) — GPT + UEFI recommended
		  3. Boot from USB (F2/F12/Del for BIOS/UEFI boot menu)
		  4. Select language, time, keyboard → Install Now
		  5. Enter product key (or skip for later activation)
		  6. Choose: Upgrade (keep files) or Custom (clean install)
		  7. Select partition → Install
		  8. System reboots several times → OOBE setup
		  ```
	- ## First Boot Configuration
		- ```
		  - Create local account (skip Microsoft account: "Offline account" option)
		  - Disable unnecessary privacy settings (telemetry, location, ads)
		  - Run Windows Update: Settings → Update & Security → Check for updates
		  - Install drivers: Device Manager → check for yellow exclamation marks
		  - Activate Windows: Settings → Update & Security → Activation
		  ```
	- ## Useful Post-Install Tools
		- ```
		  winget          → Windows Package Manager (built-in since 2021)
		  Chocolatey      → community package manager (chocolatey.org)
		  Scoop           → developer-focused package manager (scoop.sh)
		  O&O ShutUp10    → privacy/telemetry control tool
		  Rufus           → bootable USB creator
		  ```
-
- # Kernel & Architecture
  collapsed:: true
	- ## Windows NT Kernel
		- Windows 10 runs on the **Windows NT kernel** — a **hybrid kernel** (monolithic + microkernel traits).
		- Kernel file: `C:\Windows\System32\ntoskrnl.exe`
		- ```
		  Kernel Mode (Ring 0)   → full hardware access: HAL, kernel, drivers
		  User Mode   (Ring 3)   → restricted: apps, services, subsystems
		  HAL (Hardware Abstraction Layer) → isolates kernel from hardware differences
		  ```
	- ## Kernel Types Comparison
		- ```
		  Monolithic (Linux)     → all in kernel space, fast, one bug = crash
		  Microkernel (Minix)    → minimal kernel, drivers in user space, stable, slower
		  Hybrid (Windows/macOS) → mix of both — performance + modularity
		  ```
	- ## Windows Boot Process
		- ```
		  Power On
		  → BIOS/UEFI POST (Power-On Self Test)
		  → UEFI firmware loads Windows Boot Manager (bootmgfw.efi)
		  → Boot Manager reads BCD (Boot Configuration Data)
		  → Windows OS Loader (winload.efi) loads kernel + HAL
		  → Kernel initializes → Session Manager (smss.exe)
		  → Windows Subsystem (csrss.exe) + Winlogon (winlogon.exe)
		  → Services Control Manager (services.exe) starts services
		  → Login screen (LogonUI.exe)
		  ```
	- ## Windows File System Hierarchy
		- ```
		  C:\
		  ├── Windows\              → OS core files
		  │   ├── System32\         → 64-bit system DLLs, executables, drivers
		  │   ├── SysWOW64\         → 32-bit compatibility DLLs
		  │   ├── WinSxS\           → component store (side-by-side assemblies)
		  │   ├── Temp\             → system temp files
		  │   └── Logs\             → system logs
		  ├── Program Files\        → 64-bit installed applications
		  ├── Program Files (x86)\  → 32-bit installed applications
		  ├── ProgramData\          → app data shared across users (hidden)
		  ├── Users\
		  │   ├── Public\           → shared between all users
		  │   └── <Username>\
		  │       ├── Desktop\
		  │       ├── Documents\
		  │       ├── Downloads\
		  │       ├── AppData\
		  │       │   ├── Local\    → user-specific app data (large cache)
		  │       │   ├── LocalLow\ → low-integrity app data (browsers)
		  │       │   └── Roaming\  → synced across domain machines
		  │       └── NTUSER.DAT    → user registry hive
		  └── $Recycle.Bin\         → deleted files (hidden)
		  ```
	- ## Important System Files
		- ```
		  ntoskrnl.exe   → Windows kernel
		  hal.dll        → Hardware Abstraction Layer
		  smss.exe       → Session Manager Subsystem (first user-mode process)
		  csrss.exe      → Client/Server Runtime Subsystem
		  winlogon.exe   → handles login/logout/lock
		  lsass.exe      → Local Security Authority (authentication, credentials)
		  services.exe   → Service Control Manager
		  svchost.exe    → host process for Windows services (multiple instances)
		  explorer.exe   → Windows shell (desktop, taskbar, file explorer)
		  ```
-
- # Command Prompt (CMD)
  collapsed:: true
	- ## Navigation & File Operations
		- ```cmd
		  cd C:\Users\Username\Desktop   :: change directory
		  cd ..                          :: go up one level
		  cd /                           :: go to root
		  dir                            :: list files (like ls)
		  dir /a                         :: show hidden files
		  dir /s /b *.txt                :: recursive search for .txt files
		  cls                            :: clear screen
		  mkdir foldername               :: create directory
		  rmdir /s /q foldername         :: delete directory recursively
		  del file.txt                   :: delete file
		  del /f /q file.txt             :: force delete
		  copy source.txt dest.txt       :: copy file
		  xcopy src\ dest\ /e /i         :: copy directory recursively
		  robocopy src\ dest\ /e         :: robust copy (preferred over xcopy)
		  move file.txt C:\dest\         :: move file
		  ren oldname.txt newname.txt    :: rename file
		  type file.txt                  :: print file content (like cat)
		  more file.txt                  :: paginated view
		  echo Hello World               :: print text
		  echo text > file.txt           :: write to file (overwrite)
		  echo text >> file.txt          :: append to file
		  ```
	- ## System Information
		- ```cmd
		  systeminfo                     :: detailed system info
		  hostname                       :: computer name
		  whoami                         :: current user
		  whoami /priv                   :: current user privileges
		  ver                            :: Windows version
		  winver                         :: GUI version dialog
		  wmic os get Caption,Version    :: OS name and version
		  wmic cpu get Name              :: CPU info
		  wmic memorychip get Capacity   :: RAM info
		  wmic diskdrive get Model,Size  :: disk info
		  tasklist                       :: running processes (like ps)
		  tasklist /fi "imagename eq notepad.exe"  :: filter by name
		  taskkill /pid 1234 /f          :: kill process by PID
		  taskkill /im notepad.exe /f    :: kill by name
		  ```
	- ## Network Commands
		- ```cmd
		  ipconfig                       :: IP, subnet, gateway
		  ipconfig /all                  :: full network info (MAC, DNS, DHCP)
		  ipconfig /flushdns             :: flush DNS cache
		  ipconfig /release              :: release DHCP lease
		  ipconfig /renew                :: renew DHCP lease
		  ping google.com                :: test connectivity
		  ping -t google.com             :: continuous ping
		  tracert google.com             :: trace route
		  nslookup google.com            :: DNS lookup
		  netstat -ano                   :: active connections + PIDs
		  netstat -an | findstr :80      :: filter by port
		  arp -a                         :: ARP table (IP → MAC)
		  route print                    :: routing table
		  net use Z: \\server\share      :: map network drive
		  net use Z: /delete             :: disconnect network drive
		  ```
	- ## User & Group Management (CMD)
		- ```cmd
		  net user                       :: list all users
		  net user username              :: user details
		  net user username password /add :: create user
		  net user username /delete      :: delete user
		  net user username newpassword  :: change password
		  net localgroup                 :: list groups
		  net localgroup Administrators  :: list group members
		  net localgroup Administrators username /add  :: add to group
		  net localgroup Administrators username /delete :: remove from group
		  ```
	- ## Useful CMD Tricks
		- ```cmd
		  command | clip                 :: copy output to clipboard
		  command > output.txt           :: redirect output to file
		  command 2>&1                   :: redirect stderr to stdout
		  findstr "pattern" file.txt     :: search in file (like grep)
		  findstr /s /i "pattern" *.txt  :: recursive case-insensitive search
		  for /f "tokens=*" %i in (file.txt) do echo %i  :: loop over file lines
		  start notepad.exe              :: open app
		  shutdown /s /t 0               :: shutdown immediately
		  shutdown /r /t 0               :: restart immediately
		  shutdown /l                    :: logoff
		  sfc /scannow                   :: system file checker (repair)
		  chkdsk C: /f /r                :: check + repair disk
		  ```
-
- # PowerShell
  collapsed:: true
	- ## What is PowerShell?
		- A **command-line shell and scripting language** built on .NET — far more powerful than CMD.
		- Works with **objects** (not just text), making it ideal for automation and administration.
		- PowerShell 5.1 is built into Windows 10. PowerShell 7+ is cross-platform (install separately).
		- ```powershell
		  $PSVersionTable.PSVersion          # check version
		  Get-ExecutionPolicy                # check script policy
		  Set-ExecutionPolicy RemoteSigned   # allow local scripts (run as admin)
		  ```
	- ## Navigation & File Operations
		- ```powershell
		  Get-Location                       # pwd equivalent
		  Set-Location C:\Users\             # cd equivalent
		  Get-ChildItem                      # ls / dir equivalent
		  Get-ChildItem -Hidden              # show hidden files
		  Get-ChildItem -Recurse -Filter *.txt  # recursive search
		  New-Item -ItemType Directory -Path "C:\myfolder"  # mkdir
		  New-Item -ItemType File -Path "file.txt"          # touch
		  Remove-Item file.txt               # delete file
		  Remove-Item -Recurse -Force folder # delete directory
		  Copy-Item source.txt dest.txt      # copy file
		  Copy-Item -Recurse src\ dest\      # copy directory
		  Move-Item file.txt C:\dest\        # move file
		  Rename-Item old.txt new.txt        # rename
		  Get-Content file.txt               # cat equivalent
		  Set-Content file.txt "text"        # write to file
		  Add-Content file.txt "text"        # append to file
		  ```
	- ## Aliases (CMD-like shortcuts)
		- ```powershell
		  ls / dir / gci    → Get-ChildItem
		  cd / sl           → Set-Location
		  pwd / gl          → Get-Location
		  cat / gc          → Get-Content
		  cp / copy         → Copy-Item
		  mv / move         → Move-Item
		  rm / del          → Remove-Item
		  mkdir             → New-Item -ItemType Directory
		  echo / write      → Write-Output
		  cls / clear       → Clear-Host
		  ps                → Get-Process
		  kill              → Stop-Process
		  ```
	- ## Process Management
		- ```powershell
		  Get-Process                        # list all processes
		  Get-Process -Name notepad          # filter by name
		  Stop-Process -Name notepad -Force  # kill by name
		  Stop-Process -Id 1234 -Force       # kill by PID
		  Start-Process notepad.exe          # start process
		  Start-Process cmd -Verb RunAs      # run as admin
		  Get-Service                        # list all services
		  Get-Service -Name wuauserv         # specific service
		  Start-Service -Name wuauserv       # start service
		  Stop-Service -Name wuauserv        # stop service
		  Restart-Service -Name wuauserv     # restart service
		  Set-Service -Name wuauserv -StartupType Automatic  # set startup type
		  ```
	- ## System Information
		- ```powershell
		  Get-ComputerInfo                   # full system info
		  Get-ComputerInfo | Select-Object OsName, OsVersion, CsProcessors
		  $env:COMPUTERNAME                  # hostname
		  $env:USERNAME                      # current user
		  $env:USERPROFILE                   # user home path
		  $env:PATH                          # PATH variable
		  [System.Environment]::OSVersion   # OS version object
		  Get-WmiObject Win32_OperatingSystem | Select Caption, Version
		  Get-WmiObject Win32_Processor | Select Name, NumberOfCores
		  Get-WmiObject Win32_PhysicalMemory | Measure-Object Capacity -Sum
		  ```
	- ## Networking
		- ```powershell
		  Get-NetIPAddress                   # all IP addresses
		  Get-NetIPConfiguration             # full network config
		  Test-Connection google.com         # ping equivalent
		  Test-Connection google.com -Count 4 -Quiet  # returns True/False
		  Resolve-DnsName google.com         # DNS lookup
		  Get-NetTCPConnection               # active TCP connections
		  Get-NetTCPConnection -State Listen # listening ports
		  Get-NetTCPConnection -LocalPort 80 # filter by port
		  New-NetFirewallRule -DisplayName "Allow HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
		  Get-NetFirewallRule | Where-Object Enabled -eq True
		  ```
	- ## PowerShell Scripting
		- ```powershell
		  # Variables
		  $name = "Windows"
		  $number = 42
		  $array = @(1, 2, 3, 4, 5)
		  $hash = @{ Key = "Value"; Name = "Test" }
		  
		  # String interpolation
		  Write-Output "Hello, $name"
		  Write-Output "Array item: $($array[0])"
		  
		  # If / Else
		  if ($number -gt 10) {
		      Write-Output "Greater than 10"
		  } elseif ($number -eq 10) {
		      Write-Output "Equal to 10"
		  } else {
		      Write-Output "Less than 10"
		  }
		  
		  # Comparison operators
		  # -eq  -ne  -gt  -lt  -ge  -le  -like  -match  -contains
		  
		  # Loops
		  foreach ($item in $array) { Write-Output $item }
		  for ($i = 0; $i -lt 5; $i++) { Write-Output $i }
		  while ($number -gt 0) { $number--; Write-Output $number }
		  
		  # Functions
		  function Greet {
		      param([string]$Name = "World")
		      Write-Output "Hello, $Name!"
		  }
		  Greet -Name "Windows"
		  
		  # Error handling
		  try {
		      Get-Item "C:\nonexistent" -ErrorAction Stop
		  } catch {
		      Write-Output "Error: $_"
		  } finally {
		      Write-Output "Always runs"
		  }
		  
		  # Pipeline
		  Get-Process | Where-Object { $_.CPU -gt 10 } | Sort-Object CPU -Descending | Select-Object -First 5
		  ```
	- ## Useful One-Liners
		- ```powershell
		  # Find large files
		  Get-ChildItem C:\ -Recurse -ErrorAction SilentlyContinue | Sort-Object Length -Descending | Select-Object -First 20 FullName, Length
		  
		  # Get installed software
		  Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* | Select DisplayName, DisplayVersion
		  
		  # Check open ports
		  Get-NetTCPConnection -State Listen | Select LocalAddress, LocalPort | Sort-Object LocalPort
		  
		  # Export process list to CSV
		  Get-Process | Export-Csv -Path processes.csv -NoTypeInformation
		  
		  # Download file
		  Invoke-WebRequest -Uri "https://example.com/file.zip" -OutFile "file.zip"
		  
		  # Run command as another user
		  $cred = Get-Credential
		  Start-Process powershell -Credential $cred -ArgumentList "-Command Get-Process"
		  ```
-
- # Windows Registry
  collapsed:: true
	- ## What is the Registry?
		- A hierarchical database storing OS and application configuration settings.
		- Replaces the old `.ini` file system. Edited via `regedit.exe` or PowerShell/CMD.
	- ## Registry Hives
		- ```
		  HKEY_LOCAL_MACHINE  (HKLM)  → system-wide settings (hardware, software, security)
		  HKEY_CURRENT_USER   (HKCU)  → settings for the currently logged-in user
		  HKEY_USERS          (HKU)   → all user profiles on the machine
		  HKEY_CLASSES_ROOT   (HKCR)  → file associations and COM objects
		  HKEY_CURRENT_CONFIG (HKCC)  → current hardware profile
		  ```
	- ## Registry Value Types
		- ```
		  REG_SZ         → plain string
		  REG_EXPAND_SZ  → string with environment variables (%SystemRoot%)
		  REG_DWORD      → 32-bit integer
		  REG_QWORD      → 64-bit integer
		  REG_BINARY     → raw binary data
		  REG_MULTI_SZ   → array of strings
		  ```
	- ## Important Registry Keys
		- ```
		  HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion
		    → ProductName, CurrentVersion, BuildLab, InstallDate
		  
		  HKLM\SYSTEM\CurrentControlSet\Services
		    → all Windows services and drivers
		  
		  HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		    → programs that run at user login (startup)
		  
		  HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		    → programs that run at system startup (all users)
		  
		  HKLM\SYSTEM\CurrentControlSet\Control\ComputerName
		    → computer name
		  
		  HKCU\Control Panel\Desktop
		    → wallpaper, screensaver, display settings
		  
		  HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
		    → login settings, shell, userinit
		  
		  HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation
		    → timezone settings
		  ```
	- ## Registry via CMD & PowerShell
		- ```cmd
		  :: CMD — reg command
		  reg query HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion
		  reg add HKCU\SOFTWARE\MyApp /v Setting /t REG_SZ /d "value"
		  reg delete HKCU\SOFTWARE\MyApp /v Setting /f
		  reg export HKLM\SOFTWARE\MyApp backup.reg
		  reg import backup.reg
		  ```
		- ```powershell
		  # PowerShell — registry as a drive
		  Get-Item "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion"
		  Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" -Name ProductName
		  Set-ItemProperty "HKCU:\SOFTWARE\MyApp" -Name "Setting" -Value "value"
		  New-Item "HKCU:\SOFTWARE\MyApp"
		  Remove-Item "HKCU:\SOFTWARE\MyApp" -Recurse
		  ```
-
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- ```
		  Administrator  → full system control, can install software, change settings
		  Standard User  → limited, cannot install system-wide software or change system settings
		  Guest          → very limited, disabled by default in Windows 10
		  Microsoft Account → online account, syncs settings across devices
		  Local Account  → offline account, no sync
		  ```
	- ## User Management (GUI)
		- ```
		  Settings → Accounts → Family & other users → Add someone else
		  Control Panel → User Accounts → Manage another account
		  Computer Management → Local Users and Groups → Users (Pro/Enterprise only)
		  ```
	- ## User Management (CMD)
		- ```cmd
		  net user                                    :: list users
		  net user username                           :: user details
		  net user username Password123 /add          :: create user
		  net user username /delete                   :: delete user
		  net user username newpassword               :: change password
		  net user username /active:no                :: disable account
		  net user username /active:yes               :: enable account
		  net localgroup Administrators username /add :: make admin
		  net localgroup Administrators username /delete :: remove admin
		  ```
	- ## User Management (PowerShell)
		- ```powershell
		  Get-LocalUser                               # list users
		  New-LocalUser -Name "username" -Password (ConvertTo-SecureString "Pass123!" -AsPlainText -Force)
		  Remove-LocalUser -Name "username"
		  Set-LocalUser -Name "username" -Password (ConvertTo-SecureString "NewPass!" -AsPlainText -Force)
		  Disable-LocalUser -Name "username"
		  Enable-LocalUser -Name "username"
		  Add-LocalGroupMember -Group "Administrators" -Member "username"
		  Remove-LocalGroupMember -Group "Administrators" -Member "username"
		  Get-LocalGroup                              # list groups
		  Get-LocalGroupMember -Group "Administrators"
		  ```
	- ## Important User Files & Paths
		- ```
		  C:\Users\<Username>\                → user profile root
		  C:\Users\<Username>\NTUSER.DAT      → user registry hive
		  C:\Users\<Username>\AppData\Roaming → roaming app data
		  C:\Users\<Username>\AppData\Local   → local app data
		  C:\Windows\System32\config\SAM      → local account password hashes (locked while running)
		  C:\Windows\System32\config\SYSTEM   → system hive
		  C:\Windows\System32\config\SECURITY → security hive
		  ```
-
- # Networking
  collapsed:: true
	- ## Network Info & Diagnostics
		- ```cmd
		  ipconfig /all                  :: full network info
		  ipconfig /flushdns             :: flush DNS cache
		  netstat -ano                   :: connections + PIDs
		  netstat -an | findstr LISTENING :: listening ports only
		  arp -a                         :: ARP table
		  route print                    :: routing table
		  ping -t 8.8.8.8                :: continuous ping
		  tracert google.com             :: trace route
		  pathping google.com            :: combined ping + tracert
		  nslookup google.com            :: DNS lookup
		  nslookup -type=MX google.com   :: MX records
		  ```
	- ## Network Configuration
		- ```cmd
		  :: Set static IP (run as admin)
		  netsh interface ip set address "Ethernet" static 192.168.1.100 255.255.255.0 192.168.1.1
		  :: Set DNS
		  netsh interface ip set dns "Ethernet" static 8.8.8.8
		  :: Back to DHCP
		  netsh interface ip set address "Ethernet" dhcp
		  :: Disable/Enable adapter
		  netsh interface set interface "Ethernet" disable
		  netsh interface set interface "Ethernet" enable
		  :: Reset TCP/IP stack
		  netsh int ip reset
		  netsh winsock reset
		  ```
	- ## Wi-Fi Commands
		- ```cmd
		  netsh wlan show profiles                   :: list saved Wi-Fi profiles
		  netsh wlan show profile name="SSID" key=clear  :: show password
		  netsh wlan connect name="SSID"             :: connect to Wi-Fi
		  netsh wlan disconnect                      :: disconnect
		  netsh wlan show interfaces                 :: Wi-Fi adapter info
		  netsh wlan show networks mode=bssid        :: scan nearby networks
		  ```
	- ## Windows Firewall
		- ```cmd
		  :: Check firewall status
		  netsh advfirewall show allprofiles
		  :: Enable/Disable firewall
		  netsh advfirewall set allprofiles state on
		  netsh advfirewall set allprofiles state off
		  :: Allow app through firewall
		  netsh advfirewall firewall add rule name="MyApp" dir=in action=allow program="C:\app.exe"
		  :: Allow port
		  netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
		  :: Delete rule
		  netsh advfirewall firewall delete rule name="MyApp"
		  :: List rules
		  netsh advfirewall firewall show rule name=all
		  ```
		- ```powershell
		  # PowerShell firewall management
		  Get-NetFirewallProfile
		  Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
		  New-NetFirewallRule -DisplayName "Allow SSH" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
		  Remove-NetFirewallRule -DisplayName "Allow SSH"
		  Get-NetFirewallRule | Where-Object { $_.Enabled -eq "True" -and $_.Direction -eq "Inbound" }
		  ```
	- ## Remote Desktop (RDP)
		- ```
		  Enable RDP:
		    Settings → System → Remote Desktop → Enable
		    OR: SystemPropertiesRemote.exe → Allow remote connections
		  
		  Connect:
		    mstsc.exe                          → open RDP client
		    mstsc /v:192.168.1.10              → connect to IP
		    mstsc /v:hostname:3389             → connect with port
		    mstsc /admin                       → connect to admin session
		  
		  Default port: 3389
		  Change port: HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp → PortNumber
		  ```
	- ## Shared Folders & SMB
		- ```cmd
		  net share                              :: list shared folders
		  net share ShareName=C:\folder          :: create share
		  net share ShareName /delete            :: remove share
		  net use Z: \\server\share              :: map network drive
		  net use Z: \\server\share /user:domain\user password
		  net use Z: /delete                     :: disconnect drive
		  \\server\share                         :: access share in Explorer
		  ```
-
- # Process & Service Management
  collapsed:: true
	- ## Task Manager & Process Tools
		- ```
		  Task Manager shortcuts:
		    Ctrl+Shift+Esc  → open Task Manager directly
		    Ctrl+Alt+Del    → security screen → Task Manager
		  Tabs:
		    Processes  → running apps + background processes + resource usage
		    Performance → CPU, RAM, Disk, Network graphs
		    Startup     → manage startup programs
		    Services    → view/start/stop Windows services
		    Details     → advanced process list with PIDs
		  ```
	- ## Process Commands
		- ```cmd
		  tasklist                               :: list all processes
		  tasklist /svc                          :: processes with services
		  tasklist /fi "status eq running"       :: filter running
		  taskkill /pid 1234 /f                  :: kill by PID
		  taskkill /im chrome.exe /f             :: kill by name
		  taskkill /im chrome.exe /f /t          :: kill process tree
		  wmic process list brief                :: brief process list
		  wmic process where name="notepad.exe" get ProcessId,Name,CommandLine
		  ```
	- ## Service Management
		- ```cmd
		  sc query                               :: list all services
		  sc query type= all state= all          :: all services all states
		  sc start ServiceName                   :: start service
		  sc stop ServiceName                    :: stop service
		  sc config ServiceName start= auto      :: set to auto-start
		  sc config ServiceName start= disabled  :: disable service
		  sc delete ServiceName                  :: delete service
		  services.msc                           :: open Services GUI
		  ```
		- ```powershell
		  Get-Service | Where-Object Status -eq Running
		  Start-Service -Name "wuauserv"
		  Stop-Service -Name "wuauserv" -Force
		  Set-Service -Name "wuauserv" -StartupType Disabled
		  New-Service -Name "MyService" -BinaryPathName "C:\app.exe" -StartupType Automatic
		  ```
	- ## Startup Programs
		- ```
		  Task Manager → Startup tab → right-click → Enable/Disable
		  msconfig → Startup tab (older method)
		  Shell:startup  → %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
		  Shell:common startup → C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup
		  Registry startup keys:
		    HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		    HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		  ```
-
- # Storage & Disk Management
  collapsed:: true
	- ## Disk Management GUI
		- ```
		  diskmgmt.msc               → open Disk Management
		  Actions: Initialize disk, Create/Delete/Format partitions,
		           Extend/Shrink volumes, Change drive letters, Mark as Active
		  ```
	- ## DiskPart (CMD)
		- ```cmd
		  diskpart                   :: launch diskpart
		  list disk                  :: show all disks
		  select disk 1              :: select disk 1
		  list partition             :: show partitions on selected disk
		  select partition 1         :: select partition
		  list volume                :: show all volumes
		  select volume 2            :: select volume
		  create partition primary size=51200  :: create 50GB partition
		  format fs=ntfs quick label="Data"    :: format as NTFS
		  assign letter=D            :: assign drive letter
		  delete partition override  :: delete partition
		  clean                      :: wipe entire disk (DESTRUCTIVE)
		  active                     :: mark partition as active (bootable)
		  extend                     :: extend volume to fill unallocated space
		  shrink desired=10240       :: shrink by 10GB
		  ```
	- ## File Systems
		- ```
		  NTFS    → default Windows FS. Supports: permissions, encryption (EFS),
		            compression, journaling, large files (>4GB), symbolic links.
		  FAT32   → legacy, max 4GB file size, max 32GB partition (Windows format limit),
		            compatible with all OSes. Good for USB drives.
		  exFAT   → extended FAT, no 4GB file limit, good for large USB/SD cards,
		            cross-platform (Windows, macOS, Linux).
		  ReFS    → Resilient File System, for Windows Server/Storage Spaces,
		            self-healing, large volume support.
		  ```
	- ## Storage Spaces
		- ```
		  Settings → System → Storage → Manage Storage Spaces
		  Combines multiple drives into a pool with redundancy (like RAID):
		    Simple    → no redundancy (like RAID 0)
		    Mirror    → 2-way or 3-way mirror (like RAID 1)
		    Parity    → fault tolerance with less overhead (like RAID 5)
		  ```
	- ## Useful Storage Commands
		- ```cmd
		  chkdsk C: /f /r            :: check + fix disk errors (requires reboot for C:)
		  sfc /scannow               :: scan + repair system files
		  DISM /Online /Cleanup-Image /RestoreHealth  :: repair Windows image
		  defrag C: /U /V            :: defragment drive (not needed for SSDs)
		  compact /c /s:C:\folder    :: compress folder (NTFS compression)
		  fsutil volume diskfree C:  :: free space on drive
		  ```
-
- # Security & Windows Defender
  collapsed:: true
	- ## Windows Security Center
		- ```
		  Windows Security app (formerly Windows Defender Security Center):
		    Virus & threat protection  → antivirus scans, threat history
		    Account protection         → Windows Hello, Dynamic Lock
		    Firewall & network protection → firewall profiles
		    App & browser control      → SmartScreen, Exploit protection
		    Device security            → Secure Boot, TPM, Core isolation
		    Device performance & health → health report
		  ```
	- ## Windows Defender (CMD/PowerShell)
		- ```powershell
		  # Quick scan
		  Start-MpScan -ScanType QuickScan
		  # Full scan
		  Start-MpScan -ScanType FullScan
		  # Scan specific path
		  Start-MpScan -ScanType CustomScan -ScanPath "C:\Downloads"
		  # Update definitions
		  Update-MpSignature
		  # Check status
		  Get-MpComputerStatus
		  # Add exclusion
		  Add-MpPreference -ExclusionPath "C:\MyApp"
		  # Remove exclusion
		  Remove-MpPreference -ExclusionPath "C:\MyApp"
		  # Get threat history
		  Get-MpThreatDetection
		  ```
	- ## BitLocker (Drive Encryption)
		- ```
		  Requirements: TPM 1.2+ (recommended TPM 2.0), Windows 10 Pro/Enterprise
		  Enable:
		    Control Panel → BitLocker Drive Encryption → Turn on BitLocker
		    OR: Right-click drive in Explorer → Turn on BitLocker
		  ```
		- ```cmd
		  manage-bde -status                         :: check BitLocker status
		  manage-bde -on C: -RecoveryPassword        :: enable with recovery password
		  manage-bde -off C:                         :: disable BitLocker
		  manage-bde -protectors -get C:             :: get recovery key
		  manage-bde -unlock D: -RecoveryPassword <key>  :: unlock with recovery key
		  ```
	- ## User Account Control (UAC)
		- ```
		  UAC prompts when apps request admin privileges.
		  Levels (Control Panel → User Accounts → Change UAC settings):
		    Always notify     → most secure, prompts for all changes
		    Notify app changes → default, prompts only for app changes
		    Notify (no dim)   → same but no secure desktop
		    Never notify      → UAC disabled (not recommended)
		  ```
	- ## Windows Hello & Authentication
		- ```
		  Settings → Accounts → Sign-in options:
		    Windows Hello Face    → facial recognition (requires IR camera)
		    Windows Hello Fingerprint → fingerprint reader
		    Windows Hello PIN     → PIN (stored locally, not sent to Microsoft)
		    Security Key          → FIDO2 hardware key
		    Password              → traditional password
		    Picture Password      → gestures on a photo
		  ```
	- ## Audit & Event Logs
		- ```
		  Event Viewer: eventvwr.msc
		  Key logs:
		    Windows Logs → Application  → app errors and info
		    Windows Logs → Security     → login events, audit policy
		    Windows Logs → System       → OS events, driver failures
		    Applications and Services Logs → Microsoft → Windows → ...
		  
		  Important Event IDs:
		    4624  → Successful logon
		    4625  → Failed logon
		    4634  → Logoff
		    4648  → Logon with explicit credentials (runas)
		    4720  → User account created
		    4726  → User account deleted
		    4732  → User added to security group
		    7045  → New service installed
		    1102  → Audit log cleared (suspicious!)
		  ```
		- ```powershell
		  # Query event logs
		  Get-EventLog -LogName Security -Newest 50
		  Get-EventLog -LogName Security -InstanceId 4625 -Newest 20  # failed logins
		  Get-WinEvent -LogName Security -MaxEvents 100
		  Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} -MaxEvents 20
		  ```
-
- # Windows Subsystem for Linux (WSL)
  collapsed:: true
	- ## What is WSL?
		- Run a real Linux kernel and distributions natively inside Windows 10 — no VM needed.
		- **WSL 1** — translates Linux syscalls to Windows. Fast file I/O on Windows drives.
		- **WSL 2** — full Linux kernel in a lightweight VM. Better compatibility, faster Linux I/O.
	- ## Installation
		- ```powershell
		  # Enable WSL (PowerShell as Admin)
		  wsl --install                          # installs WSL2 + Ubuntu (Windows 10 2004+)
		  wsl --install -d Debian                # install specific distro
		  wsl --list --online                    # available distros
		  wsl --list --verbose                   # installed distros + WSL version
		  wsl --set-default-version 2            # set WSL2 as default
		  wsl --set-version Ubuntu 2             # convert existing to WSL2
		  ```
	- ## WSL Usage
		- ```powershell
		  wsl                                    # launch default distro
		  wsl -d Ubuntu                          # launch specific distro
		  wsl --shutdown                         # stop all WSL instances
		  wsl --terminate Ubuntu                 # stop specific distro
		  wsl --export Ubuntu ubuntu-backup.tar  # backup distro
		  wsl --import Ubuntu C:\WSL ubuntu-backup.tar  # restore distro
		  wsl --unregister Ubuntu                # remove distro (deletes data!)
		  ```
	- ## File System Access
		- ```bash
		  # Access Windows files from WSL
		  ls /mnt/c/Users/Username/Desktop       # C: drive is at /mnt/c/
		  ls /mnt/d/                             # D: drive at /mnt/d/
		  
		  # Access WSL files from Windows Explorer
		  # Type in Explorer address bar: \\wsl$\Ubuntu\home\username
		  # Or: \\wsl.localhost\Ubuntu\home\username  (WSL2)
		  ```
	- ## WSL Config
		- ```ini
		  # ~/.wslconfig (Windows user home) — global WSL2 settings
		  [wsl2]
		  memory=4GB
		  processors=2
		  swap=2GB
		  localhostForwarding=true
		  
		  # /etc/wsl.conf (inside distro) — per-distro settings
		  [boot]
		  systemd=true          # enable systemd (WSL2 only)
		  [automount]
		  enabled=true
		  root=/mnt/
		  options="metadata,umask=22,fmask=11"
		  [network]
		  hostname=myWSL
		  ```
-
- # Package Management
  collapsed:: true
	- ## winget (Windows Package Manager)
		- ```cmd
		  winget search vscode                   :: search for a package
		  winget install Microsoft.VisualStudioCode  :: install by ID
		  winget install -e --id Git.Git         :: exact match install
		  winget upgrade                         :: list upgradable packages
		  winget upgrade --all                   :: upgrade all packages
		  winget uninstall Microsoft.VisualStudioCode
		  winget list                            :: list installed packages
		  winget show Git.Git                    :: package details
		  winget export -o packages.json         :: export installed list
		  winget import -i packages.json         :: install from list
		  ```
	- ## Chocolatey
		- ```powershell
		  # Install Chocolatey (run PowerShell as Admin)
		  Set-ExecutionPolicy Bypass -Scope Process -Force
		  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
		  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
		  
		  choco install git -y                   # install package
		  choco install vscode nodejs python -y  # install multiple
		  choco upgrade all -y                   # upgrade all
		  choco uninstall git -y                 # uninstall
		  choco list --local-only                # list installed
		  choco search nodejs                    # search packages
		  ```
	- ## Scoop
		- ```powershell
		  # Install Scoop
		  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
		  irm get.scoop.sh | iex
		  
		  scoop install git                      # install package
		  scoop install curl wget jq             # install multiple
		  scoop update *                         # update all
		  scoop uninstall git                    # uninstall
		  scoop list                             # list installed
		  scoop search python                    # search
		  scoop bucket add extras                # add extras bucket
		  scoop bucket add versions              # add versions bucket
		  ```
-
- # Performance & Maintenance
  collapsed:: true
	- ## Performance Tools
		- ```
		  Task Manager (Ctrl+Shift+Esc)  → real-time CPU, RAM, Disk, Network
		  Resource Monitor (resmon.exe)  → detailed per-process resource usage
		  Performance Monitor (perfmon)  → log and graph performance counters
		  Reliability Monitor            → Control Panel → Security and Maintenance → Reliability History
		  Windows Memory Diagnostic      → mdsched.exe → test RAM on reboot
		  ```
	- ## Useful Maintenance Commands
		- ```cmd
		  sfc /scannow                           :: scan + repair system files
		  DISM /Online /Cleanup-Image /CheckHealth    :: check image health
		  DISM /Online /Cleanup-Image /ScanHealth     :: scan for corruption
		  DISM /Online /Cleanup-Image /RestoreHealth  :: repair Windows image
		  chkdsk C: /f /r /x                    :: full disk check (reboot required for C:)
		  cleanmgr                               :: Disk Cleanup GUI
		  defrag C: /U /V                        :: defragment (HDD only)
		  powercfg /batteryreport                :: battery health report (laptops)
		  powercfg /energy                       :: energy efficiency report
		  msconfig                               :: System Configuration (startup, boot options)
		  ```
	- ## Power Plans
		- ```cmd
		  powercfg /list                         :: list power plans
		  powercfg /setactive GUID               :: activate a plan
		  powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c  :: High Performance
		  powercfg /setactive 381b4222-f694-41f0-9685-ff5bb260df2e  :: Balanced
		  powercfg /setactive a1841308-3541-4fab-bc81-f71556f20b4a  :: Power Saver
		  powercfg /duplicatescheme GUID         :: duplicate a plan
		  ```
	- ## Windows Update (PowerShell)
		- ```powershell
		  # Install PSWindowsUpdate module
		  Install-Module PSWindowsUpdate -Force
		  Import-Module PSWindowsUpdate
		  
		  Get-WindowsUpdate                      # list available updates
		  Install-WindowsUpdate -AcceptAll -AutoReboot  # install all + reboot
		  Get-WUHistory                          # update history
		  Hide-WindowsUpdate -KBArticleID KB123456  # hide specific update
		  ```
	- ## Environment Variables
		- ```cmd
		  set                                    :: list all env vars
		  set PATH                               :: show PATH
		  set MYVAR=hello                        :: set temp var (current session only)
		  setx MYVAR "hello"                     :: set permanent user var
		  setx MYVAR "hello" /M                  :: set permanent system var (admin)
		  echo %USERPROFILE%                     :: print var
		  echo %PATH%
		  ```
		- ```powershell
		  $env:PATH                              # show PATH
		  $env:MYVAR = "hello"                   # set temp var
		  [System.Environment]::SetEnvironmentVariable("MYVAR","hello","User")    # permanent user
		  [System.Environment]::SetEnvironmentVariable("MYVAR","hello","Machine") # permanent system
		  [System.Environment]::GetEnvironmentVariable("MYVAR","User")
		  ```
	- ## Common Run Commands (Win+R)
		- ```
		  msconfig       → System Configuration
		  regedit        → Registry Editor
		  services.msc   → Services
		  eventvwr.msc   → Event Viewer
		  diskmgmt.msc   → Disk Management
		  devmgmt.msc    → Device Manager
		  compmgmt.msc   → Computer Management
		  gpedit.msc     → Group Policy Editor (Pro/Enterprise)
		  secpol.msc     → Local Security Policy
		  lusrmgr.msc    → Local Users and Groups
		  perfmon.msc    → Performance Monitor
		  resmon         → Resource Monitor
		  mstsc          → Remote Desktop
		  control        → Control Panel
		  appwiz.cpl     → Programs and Features
		  ncpa.cpl       → Network Connections
		  sysdm.cpl      → System Properties
		  desk.cpl       → Display Settings
		  firewall.cpl   → Windows Firewall
		  inetcpl.cpl    → Internet Options
		  intl.cpl       → Region Settings
		  timedate.cpl   → Date and Time
		  ```
-
- # Hyper-V & Virtualization
  collapsed:: true
	- ## What is Hyper-V?
		- Microsoft's native **Type-1 hypervisor** built into Windows 10 Pro/Enterprise.
		- Runs virtual machines directly on hardware — no third-party software needed.
		- Requires: 64-bit CPU with SLAT, 4GB+ RAM, BIOS virtualization enabled (Intel VT-x / AMD-V).
	- ## Enable Hyper-V
		- ```powershell
		  # Enable via PowerShell (Admin)
		  Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
		  # Or via CMD
		  DISM /Online /Enable-Feature /All /FeatureName:Microsoft-Hyper-V
		  # Or: Control Panel → Programs → Turn Windows features on or off → Hyper-V
		  ```
	- ## Hyper-V Manager
		- ```
		  virtmgmt.msc               → open Hyper-V Manager
		  Actions:
		    New → Virtual Machine    → create VM wizard
		    New → Virtual Hard Disk  → create VHD/VHDX
		    Virtual Switch Manager   → create internal/external/private switches
		  VM States: Running, Saved, Off, Paused
		  Checkpoints: right-click VM → Checkpoint (like snapshots)
		  ```
	- ## Hyper-V PowerShell
		- ```powershell
		  Get-VM                                 # list VMs
		  Start-VM -Name "Ubuntu"                # start VM
		  Stop-VM -Name "Ubuntu" -Force          # stop VM
		  Checkpoint-VM -Name "Ubuntu" -SnapshotName "Clean"  # create checkpoint
		  Restore-VMCheckpoint -Name "Ubuntu" -VMCheckpointName "Clean"
		  New-VM -Name "TestVM" -MemoryStartupBytes 2GB -Generation 2
		  Set-VM -Name "TestVM" -ProcessorCount 2
		  ```
-
- # Task Scheduler & Automation
  collapsed:: true
	- ## Task Scheduler GUI
		- ```
		  taskschd.msc               → open Task Scheduler
		  Create Basic Task          → wizard for simple tasks
		  Create Task                → full control (triggers, actions, conditions)
		  Triggers: At startup, At logon, On schedule (daily/weekly/monthly), On event
		  Actions: Start a program, Send email (deprecated), Display message (deprecated)
		  ```
	- ## schtasks (CMD)
		- ```cmd
		  schtasks /query /fo LIST /v        :: list all tasks verbose
		  schtasks /create /tn "MyTask" /tr "C:\script.bat" /sc daily /st 09:00
		  schtasks /create /tn "MyTask" /tr "powershell.exe -File C:\script.ps1" /sc onlogon /ru SYSTEM
		  schtasks /run /tn "MyTask"         :: run task immediately
		  schtasks /end /tn "MyTask"         :: stop running task
		  schtasks /delete /tn "MyTask" /f   :: delete task
		  schtasks /change /tn "MyTask" /disable  :: disable task
		  schtasks /change /tn "MyTask" /enable   :: enable task
		  ```
	- ## PowerShell Scheduled Tasks
		- ```powershell
		  $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\script.ps1"
		  $trigger = New-ScheduledTaskTrigger -Daily -At "9:00AM"
		  $settings = New-ScheduledTaskSettingsSet -RunOnlyIfNetworkAvailable
		  Register-ScheduledTask -TaskName "MyTask" -Action $action -Trigger $trigger -Settings $settings -RunLevel Highest
		  
		  Get-ScheduledTask                  # list all tasks
		  Get-ScheduledTask -TaskName "MyTask"
		  Start-ScheduledTask -TaskName "MyTask"
		  Unregister-ScheduledTask -TaskName "MyTask" -Confirm:$false
		  ```
-
- # Keyboard Shortcuts
  collapsed:: true
	- ## System Shortcuts
		- ```
		  Win              → open/close Start Menu
		  Win + D          → show/hide Desktop
		  Win + E          → open File Explorer
		  Win + I          → open Settings
		  Win + L          → lock screen
		  Win + R          → open Run dialog
		  Win + S          → open Search
		  Win + X          → open Quick Link menu (Power User Menu)
		  Win + Tab        → Task View (virtual desktops)
		  Win + Ctrl + D   → create new virtual desktop
		  Win + Ctrl + →/← → switch virtual desktops
		  Win + Ctrl + F4  → close current virtual desktop
		  Win + PrtScn     → screenshot saved to Pictures\Screenshots
		  Win + Shift + S  → Snip & Sketch (region screenshot)
		  Win + .          → emoji picker
		  Win + V          → clipboard history
		  Win + +/-        → Magnifier zoom in/out
		  ```
	- ## Window Management
		- ```
		  Win + ↑          → maximize window
		  Win + ↓          → restore/minimize window
		  Win + ←/→        → snap window to left/right half
		  Win + Shift + ←/→ → move window to other monitor
		  Alt + Tab        → switch between open windows
		  Alt + F4         → close active window
		  Ctrl + W         → close tab (in browsers/Explorer)
		  F11              → toggle fullscreen
		  ```
	- ## File Explorer Shortcuts
		- ```
		  Ctrl + N         → new Explorer window
		  Ctrl + W         → close window
		  Alt + ←/→        → back/forward
		  Alt + ↑          → go up one folder
		  F2               → rename selected item
		  F5               → refresh
		  Ctrl + Shift + N → new folder
		  Alt + Enter      → properties of selected item
		  Ctrl + L         → focus address bar
		  Ctrl + F         → open search
		  ```
	- ## General Shortcuts
		- ```
		  Ctrl + Z         → undo
		  Ctrl + Y         → redo
		  Ctrl + C/X/V     → copy/cut/paste
		  Ctrl + A         → select all
		  Ctrl + S         → save
		  Ctrl + P         → print
		  Ctrl + Shift + Esc → Task Manager
		  Ctrl + Alt + Del → security screen
		  PrtScn           → copy screenshot to clipboard
		  Alt + PrtScn     → screenshot of active window
		  ```
-
- # More Learn
	- ## Github & Webs
		- [Microsoft Windows 10 Official Documentation](https://docs.microsoft.com/en-us/windows/windows-10/)
		- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
		- [Windows Command Reference (SS64)](https://ss64.com/nt/)
		- [PowerShell Reference (SS64)](https://ss64.com/ps/)
		- [Windows Sysinternals Tools](https://docs.microsoft.com/en-us/sysinternals/)
		- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
		- [winget Documentation](https://docs.microsoft.com/en-us/windows/package-manager/winget/)
	-
	- ## Master Playlists YouTube
		- [Windows 10 Full Course – NetworkChuck](https://www.youtube.com/results?search_query=windows+10+full+course+networkchuck)
		- [PowerShell for Beginners – Microsoft](https://www.youtube.com/results?search_query=powershell+beginners+microsoft)
		- [Windows Server & Administration – John Savill](https://www.youtube.com/results?search_query=windows+administration+john+savill)