---
seoTitle: Windows 11 Complete Guide – Architecture, Commands & Administration
description: "Comprehensive Windows 11 reference covering installation, TPM, architecture, PowerShell, CMD, registry, networking, security, WSL2, Hyper-V, and system administration."
keywords: "Windows 11, windows 11 guide, windows 11 commands, powershell, cmd, windows 11 administration, windows 11 registry, windows 11 networking, windows 11 security, TPM 2.0, windows 11 tutorial, windows 11 notes, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Windows 11 Complete Guide
---

- # History
  collapsed:: true
	- ## How
		- Windows 11 was officially released by **Microsoft** on **October 5, 2021** as the successor to Windows 10.
		- First major Windows release since Windows 10 in 2015 — breaking the "Windows 10 is the last Windows" promise.
		- Built on the same **Windows NT kernel** as Windows 10 but with a redesigned UI and stricter hardware requirements.
		- Follows the **Windows as a Service (WaaS)** model — one major feature update per year.
		- Introduced **Android app support** via the Amazon Appstore (Windows Subsystem for Android).
	- ## Who
		- **Microsoft Corporation** — developed by the Windows & Devices division.
		- Key figures: **Panos Panay** (Chief Product Officer), **Satya Nadella** (CEO).
	- ## Why
		- Windows 10 UI was aging; Microsoft wanted a modern, centered, macOS-competitive desktop experience.
		- Security improvements: mandatory **TPM 2.0**, **Secure Boot**, and **UEFI** requirements raised the baseline security bar.
		- Better support for hybrid work: Snap Layouts, Teams integration, improved virtual desktops.
		- Optimized for modern hardware: better multi-core scheduling, improved gaming (DirectStorage, Auto HDR).
-
- # Introduction
  collapsed:: true
	- ## What is Windows 11?
		- A general-purpose OS by Microsoft for desktops, laptops, tablets, and 2-in-1 devices.
		- Centered taskbar, rounded corners, new Start Menu, and a redesigned Settings app.
		- Built on the **Windows NT kernel** — same lineage as [[Windows 10]], Windows 8, 7, Vista, XP.
		- Supports only **64-bit (x64 and ARM64)** — 32-bit OS support dropped entirely.
	- ## Editions
		- ```
		  Windows 11 Home        → consumers, basic features, requires Microsoft account on setup
		  Windows 11 Pro         → business, BitLocker, Remote Desktop, Hyper-V, Group Policy
		  Windows 11 Enterprise  → large orgs, advanced security, LTSC available
		  Windows 11 Education   → schools, similar to Enterprise
		  Windows 11 Pro for Workstations → high-end hardware, ReFS, NVMe RAID
		  Windows 11 SE         → education-focused, locked-down (Chromebook competitor)
		  Windows 11 IoT Enterprise → embedded/industrial devices
		  ```
	- ## Windows 11 vs Windows 10 — Key Differences
		- ```
		  Feature                  Windows 10          Windows 11
		  ─────────────────────────────────────────────────────────
		  Taskbar                  Left-aligned        Centered (configurable)
		  Start Menu               Live Tiles          Pinned apps + Recommended
		  Snap Layouts             Basic               Enhanced (6 layouts)
		  Virtual Desktops         Basic               Per-desktop wallpapers
		  Microsoft Teams          Optional            Built-in (Chat)
		  Android Apps             No                  Yes (via Amazon Appstore)
		  DirectStorage            No                  Yes (NVMe GPU streaming)
		  Auto HDR                 No                  Yes
		  TPM Requirement          None                TPM 2.0 mandatory
		  32-bit OS support        Yes                 No (32-bit apps still run)
		  Internet Explorer        Legacy mode         Removed
		  Control Panel            Present             Gradually replaced by Settings
		  Widgets                  News & Interests    Full Widgets board
		  ```
	- ## Advantages
		- Modern UI, better Snap Layouts, improved gaming (DirectStorage, Auto HDR), stronger security baseline (TPM 2.0, Secure Boot), better ARM support, Android app support, improved virtual desktops, better multi-monitor handling.
	- ## Disadvantages
		- Strict hardware requirements (TPM 2.0 locks out older PCs), forced Microsoft account on Home edition, centered taskbar less flexible, some features removed (Live Tiles, drag-to-taskbar), telemetry still present, ads in Start Menu.
	- ## Use Cases
		- Modern desktop/laptop computing, gaming, enterprise workstations, software development (WSL2), hybrid work environments, creative production.
-
- # Installation & Setup
  collapsed:: true
	- ## System Requirements
		- ```
		  Minimum (Official):
		    CPU:     1 GHz or faster, 2+ cores, 64-bit compatible, on approved CPU list
		    RAM:     4 GB
		    Disk:    64 GB
		    TPM:     Trusted Platform Module 2.0 (MANDATORY)
		    Secure Boot: UEFI firmware with Secure Boot capable
		    GPU:     DirectX 12 compatible, WDDM 2.0 driver
		    Display: 720p, 9" diagonal, 8 bits per color channel
		    Internet: Required for Windows 11 Home setup (Microsoft account)
		  
		  Recommended:
		    CPU:     Intel 8th gen+ / AMD Ryzen 2000+ / Qualcomm Snapdragon 7c+
		    RAM:     8–16 GB
		    Disk:    256 GB NVMe SSD
		    GPU:     DirectX 12 Ultimate (for DirectStorage + Auto HDR)
		  ```
	- ## Check TPM & Compatibility
		- ```cmd
		  tpm.msc                        :: open TPM Management console
		  msinfo32                       :: System Information — check Secure Boot, TPM
		  :: Run Microsoft's PC Health Check app for official compatibility check
		  ```
		- ```powershell
		  # Check TPM status
		  Get-Tpm
		  # Check Secure Boot
		  Confirm-SecureBootUEFI
		  ```
	- ## Installation Methods
		- ```
		  1. Windows Update (eligible Windows 10 PCs) — Settings → Update & Security → Windows Update
		  2. Windows 11 Installation Assistant — microsoft.com/software-download/windows11
		  3. Create bootable USB with Media Creation Tool or Rufus (rufus.ie)
		     → Rufus: select ISO → GPT + UEFI → optionally bypass TPM/RAM checks
		  4. Clean install from USB:
		     Boot from USB → Install Now → Custom (clean install) → select partition
		  ```
	- ## Bypass TPM 2.0 Check (Unsupported PCs)
		- ```
		  Method 1 — Rufus: when creating USB, select "Extended Windows 11 Installation"
		             → removes TPM, Secure Boot, RAM, and Microsoft account requirements
		  
		  Method 2 — Registry tweak (during setup):
		    Press Shift+F10 at setup screen → regedit
		    HKEY_LOCAL_MACHINE\SYSTEM\Setup\MoSetup
		    → New DWORD: AllowUpgradesWithUnsupportedTPMOrCPU = 1
		  
		  Method 3 — appraiserres.dll replacement in ISO
		  Note: Unsupported installs won't receive security updates — use at own risk.
		  ```
	- ## First Boot Configuration
		- ```
		  - Home edition forces Microsoft account — workaround:
		    During setup, disconnect internet → "I don't have internet" → "Continue with limited setup"
		    OR: enter a fake email → error → "Sign-in options" → Offline account
		  - Disable telemetry: Settings → Privacy & Security → Diagnostics & feedback → Basic
		  - Run Windows Update: Settings → Windows Update → Check for updates
		  - Install drivers: Device Manager → check for issues
		  - Activate: Settings → System → Activation
		  ```
	- ## Useful Post-Install Tools
		- ```
		  winget          → Windows Package Manager (built-in)
		  Chocolatey      → community package manager (chocolatey.org)
		  Scoop           → developer package manager (scoop.sh)
		  Chris Titus Tech WinUtil → debloat + tweak tool (github.com/ChrisTitusTech/winutil)
		  O&O ShutUp11    → privacy/telemetry control for Windows 11
		  StartAllBack    → restore Windows 10-style taskbar/Start Menu
		  ```
-
- # Kernel & Architecture
  collapsed:: true
	- ## Windows NT Kernel (Hybrid)
		- Windows 11 runs on the **Windows NT kernel** — a **hybrid kernel** combining monolithic performance with microkernel modularity.
		- Kernel file: `C:\Windows\System32\ntoskrnl.exe`
		- ```
		  Kernel Mode (Ring 0)   → full hardware access: HAL, kernel, drivers, NTFS
		  User Mode   (Ring 3)   → restricted: apps, Win32 subsystem, services
		  HAL (Hardware Abstraction Layer) → isolates kernel from hardware specifics
		  VBS (Virtualization-Based Security) → NEW in Win11: isolates security processes
		                                         in a Hyper-V hypervisor partition
		  ```
	- ## New Security Architecture in Windows 11
		- ```
		  TPM 2.0          → stores cryptographic keys, enables BitLocker, Windows Hello
		  Secure Boot      → UEFI verifies bootloader signature — blocks bootkits
		  VBS              → Virtualization-Based Security — isolates LSASS in secure world
		  HVCI             → Hypervisor-Protected Code Integrity — prevents kernel exploits
		  Credential Guard → protects NTLM hashes and Kerberos tickets in VBS enclave
		  ```
	- ## Windows 11 Boot Process
		- ```
		  Power On
		  → UEFI firmware POST
		  → Secure Boot verifies bootloader signature (bootmgfw.efi)
		  → Windows Boot Manager reads BCD (Boot Configuration Data)
		  → winload.efi loads kernel (ntoskrnl.exe) + HAL (hal.dll)
		  → VBS/Hyper-V initializes (if enabled) → Secure World created
		  → Kernel initializes → smss.exe (Session Manager)
		  → csrss.exe + winlogon.exe start
		  → services.exe starts services
		  → LogonUI.exe → login screen
		  ```
	- ## Windows 11 File System Hierarchy
		- ```
		  C:\
		  ├── Windows\
		  │   ├── System32\         → 64-bit system DLLs, executables, drivers
		  │   ├── SysWOW64\         → 32-bit compatibility layer DLLs
		  │   ├── WinSxS\           → component store (side-by-side assemblies)
		  │   ├── SystemApps\       → built-in UWP apps (Start, Search, etc.)
		  │   ├── ImmersiveControlPanel\ → Settings app files
		  │   └── Logs\             → system logs
		  ├── Program Files\        → 64-bit installed applications
		  ├── Program Files (x86)\  → 32-bit installed applications
		  ├── ProgramData\          → shared app data (hidden)
		  ├── Users\
		  │   ├── Public\           → shared between all users
		  │   └── <Username>\
		  │       ├── Desktop\
		  │       ├── Documents\
		  │       ├── Downloads\
		  │       ├── AppData\
		  │       │   ├── Local\    → local app data + cache
		  │       │   ├── LocalLow\ → low-integrity app data
		  │       │   └── Roaming\  → synced across domain machines
		  │       └── NTUSER.DAT    → user registry hive
		  └── $Recycle.Bin\         → deleted files (hidden)
		  ```
	- ## Important System Processes
		- ```
		  ntoskrnl.exe   → Windows NT kernel
		  hal.dll        → Hardware Abstraction Layer
		  smss.exe       → Session Manager (first user-mode process, PID ~)
		  csrss.exe      → Client/Server Runtime Subsystem
		  winlogon.exe   → login/logout/lock screen handler
		  lsass.exe      → Local Security Authority — credentials, authentication
		  lsaiso.exe     → LSA Isolated (NEW Win11) — runs in VBS secure world
		  services.exe   → Service Control Manager
		  svchost.exe    → host for Windows services (many instances)
		  explorer.exe   → Windows shell (desktop, taskbar, File Explorer)
		  dwm.exe        → Desktop Window Manager — compositing, rounded corners
		  ```
-
- # Command Prompt (CMD)
  collapsed:: true
	- ## Navigation & File Operations
		- ```cmd
		  cd C:\Users\Username\Desktop   :: change directory
		  cd ..                          :: go up one level
		  cd /                           :: go to root (C:\)
		  dir                            :: list files
		  dir /a                         :: show hidden + system files
		  dir /s /b *.txt                :: recursive search for .txt files
		  cls                            :: clear screen
		  mkdir foldername               :: create directory
		  rmdir /s /q foldername         :: delete directory recursively
		  del file.txt                   :: delete file
		  del /f /q file.txt             :: force delete (no prompt)
		  copy source.txt dest.txt       :: copy file
		  robocopy src\ dest\ /e /z /mt  :: robust copy (preferred)
		  move file.txt C:\dest\         :: move file
		  ren oldname.txt newname.txt    :: rename
		  type file.txt                  :: print file (like cat)
		  more file.txt                  :: paginated view
		  echo text > file.txt           :: write to file (overwrite)
		  echo text >> file.txt          :: append to file
		  ```
	- ## System Information
		- ```cmd
		  systeminfo                     :: full system info (OS, RAM, hotfixes)
		  hostname                       :: computer name
		  whoami                         :: current user
		  whoami /priv                   :: current privileges
		  whoami /groups                 :: current group memberships
		  ver                            :: Windows version string
		  winver                         :: GUI version dialog
		  wmic os get Caption,Version,BuildNumber
		  wmic cpu get Name,NumberOfCores,MaxClockSpeed
		  wmic memorychip get Capacity,Speed
		  wmic diskdrive get Model,Size,MediaType
		  tasklist                       :: running processes
		  taskkill /pid 1234 /f          :: kill by PID
		  taskkill /im notepad.exe /f /t :: kill process + children
		  ```
	- ## Network Commands
		- ```cmd
		  ipconfig /all                  :: full network info
		  ipconfig /flushdns             :: flush DNS cache
		  ipconfig /release && ipconfig /renew  :: renew DHCP
		  ping -n 4 google.com           :: ping 4 times
		  ping -t 8.8.8.8                :: continuous ping (Ctrl+C to stop)
		  tracert google.com             :: trace route
		  pathping google.com            :: combined ping + tracert
		  nslookup google.com            :: DNS lookup
		  nslookup -type=MX google.com   :: MX records
		  netstat -ano                   :: connections + PIDs
		  netstat -an | findstr LISTENING :: listening ports
		  arp -a                         :: ARP table
		  route print                    :: routing table
		  ```
	- ## Useful CMD Tricks
		- ```cmd
		  command | clip                 :: copy output to clipboard
		  command > out.txt 2>&1         :: redirect stdout + stderr to file
		  findstr /s /i "pattern" *.txt  :: recursive case-insensitive search
		  shutdown /s /t 0               :: shutdown immediately
		  shutdown /r /t 0               :: restart immediately
		  shutdown /h                    :: hibernate
		  sfc /scannow                   :: system file checker
		  DISM /Online /Cleanup-Image /RestoreHealth  :: repair Windows image
		  chkdsk C: /f /r                :: check + repair disk (reboot needed)
		  start ms-settings:             :: open Settings app
		  start ms-settings:windowsupdate :: open Windows Update
		  ```
-
- # PowerShell
  collapsed:: true
	- ## What is PowerShell?
		- A **command-line shell and scripting language** built on .NET — works with objects, not just text.
		- Windows 11 ships with **PowerShell 5.1** (built-in). **PowerShell 7+** (cross-platform) can be installed separately.
		- ```powershell
		  $PSVersionTable.PSVersion          # check version
		  winget install Microsoft.PowerShell # install PowerShell 7+
		  Get-ExecutionPolicy                # check script execution policy
		  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser  # allow local scripts
		  ```
	- ## Navigation & File Operations
		- ```powershell
		  Get-Location                       # pwd
		  Set-Location C:\Users\             # cd
		  Get-ChildItem                      # ls / dir
		  Get-ChildItem -Hidden -Force       # show hidden files
		  Get-ChildItem -Recurse -Filter *.log  # recursive filter
		  New-Item -ItemType Directory "C:\myfolder"
		  New-Item -ItemType File "file.txt"
		  Remove-Item file.txt -Force
		  Remove-Item -Recurse -Force folder\
		  Copy-Item source.txt dest.txt
		  Copy-Item -Recurse src\ dest\
		  Move-Item file.txt C:\dest\
		  Rename-Item old.txt new.txt
		  Get-Content file.txt               # cat
		  Set-Content file.txt "text"        # write
		  Add-Content file.txt "text"        # append
		  ```
	- ## Process & Service Management
		- ```powershell
		  Get-Process                        # list processes
		  Get-Process | Sort-Object CPU -Descending | Select -First 10
		  Stop-Process -Name notepad -Force
		  Stop-Process -Id 1234 -Force
		  Start-Process notepad.exe
		  Start-Process powershell -Verb RunAs  # run as admin
		  
		  Get-Service                        # list services
		  Get-Service | Where-Object Status -eq Running
		  Start-Service wuauserv
		  Stop-Service wuauserv -Force
		  Restart-Service wuauserv
		  Set-Service wuauserv -StartupType Disabled
		  ```
	- ## System Information
		- ```powershell
		  Get-ComputerInfo                   # full system info
		  Get-ComputerInfo | Select OsName, OsVersion, CsProcessors, OsTotalVisibleMemorySize
		  $env:COMPUTERNAME                  # hostname
		  $env:USERNAME                      # current user
		  $env:USERPROFILE                   # user home path
		  Get-WmiObject Win32_OperatingSystem | Select Caption, Version, BuildNumber
		  Get-WmiObject Win32_Processor | Select Name, NumberOfCores, MaxClockSpeed
		  Get-WmiObject Win32_PhysicalMemory | Measure-Object Capacity -Sum
		  Get-WmiObject Win32_DiskDrive | Select Model, Size, MediaType
		  # Check TPM
		  Get-Tpm
		  # Check Secure Boot
		  Confirm-SecureBootUEFI
		  # Check VBS / HVCI status
		  Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard
		  ```
	- ## Networking
		- ```powershell
		  Get-NetIPAddress                   # all IPs
		  Get-NetIPConfiguration             # full config per adapter
		  Test-Connection google.com -Count 4
		  Test-NetConnection google.com -Port 443  # test specific port
		  Resolve-DnsName google.com
		  Resolve-DnsName google.com -Type MX
		  Get-NetTCPConnection -State Listen | Sort LocalPort
		  Get-NetAdapter                     # list network adapters
		  Get-NetAdapter | Where-Object Status -eq Up
		  Disable-NetAdapter -Name "Ethernet" -Confirm:$false
		  Enable-NetAdapter -Name "Ethernet"
		  Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses "8.8.8.8","8.8.4.4"
		  ```
	- ## PowerShell Scripting
		- ```powershell
		  # Variables & types
		  [string]$name   = "Windows 11"
		  [int]$version   = 11
		  [bool]$isNew    = $true
		  [array]$items   = @(1, 2, 3)
		  [hashtable]$map = @{ Key = "Value" }
		  
		  # String interpolation
		  Write-Output "OS: $name version $version"
		  Write-Output "Item: $($items[0])"
		  
		  # Conditionals
		  if ($version -ge 11) { "Modern Windows" }
		  elseif ($version -eq 10) { "Windows 10" }
		  else { "Legacy" }
		  
		  # Switch
		  switch ($version) {
		      11 { "Windows 11" }
		      10 { "Windows 10" }
		      default { "Unknown" }
		  }
		  
		  # Loops
		  foreach ($item in $items) { Write-Output $item }
		  1..10 | ForEach-Object { Write-Output "Item: $_" }
		  while ($version -gt 0) { $version-- }
		  
		  # Functions with parameters
		  function Get-Greeting {
		      param(
		          [string]$Name = "User",
		          [switch]$Formal
		      )
		      if ($Formal) { "Good day, $Name." } else { "Hey $Name!" }
		  }
		  Get-Greeting -Name "Alice" -Formal
		  
		  # Error handling
		  try {
		      Get-Item "C:\nonexistent" -ErrorAction Stop
		  } catch [System.IO.FileNotFoundException] {
		      Write-Warning "File not found: $_"
		  } catch {
		      Write-Error "Unexpected error: $_"
		  } finally {
		      Write-Output "Cleanup done"
		  }
		  
		  # Pipeline power
		  Get-Process |
		      Where-Object { $_.WorkingSet -gt 100MB } |
		      Sort-Object WorkingSet -Descending |
		      Select-Object Name, @{N="RAM(MB)";E={[math]::Round($_.WorkingSet/1MB,1)}} |
		      Format-Table -AutoSize
		  ```
	- ## Useful One-Liners
		- ```powershell
		  # Find files larger than 100MB
		  Get-ChildItem C:\ -Recurse -ErrorAction SilentlyContinue |
		      Where-Object { $_.Length -gt 100MB } |
		      Sort-Object Length -Descending |
		      Select-Object FullName, @{N="Size(MB)";E={[math]::Round($_.Length/1MB,1)}}
		  
		  # List installed apps (winget-style)
		  Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
		                   "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*" |
		      Select DisplayName, DisplayVersion | Where-Object DisplayName | Sort DisplayName
		  
		  # Export running services to CSV
		  Get-Service | Where-Object Status -eq Running | Export-Csv services.csv -NoTypeInformation
		  
		  # Download file
		  Invoke-WebRequest -Uri "https://example.com/file.zip" -OutFile "file.zip"
		  
		  # Check listening ports with process names
		  Get-NetTCPConnection -State Listen |
		      Select LocalPort, @{N="Process";E={(Get-Process -Id $_.OwningProcess).Name}} |
		      Sort LocalPort
		  ```
-
- # Windows Registry
  collapsed:: true
	- ## What is the Registry?
		- A hierarchical database storing OS and application configuration. Edited via `regedit.exe`, CMD `reg`, or PowerShell.
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
		  REG_MULTI_SZ   → array of strings (null-separated)
		  ```
	- ## Important Registry Keys (Windows 11 Specific)
		- ```
		  HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion
		    → ProductName, CurrentBuild, DisplayVersion (e.g. "23H2"), UBR
		  
		  HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		    → user startup programs
		  
		  HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
		    → system startup programs (all users)
		  
		  HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced
		    → TaskbarAl = 0 (left-align taskbar), ShowTaskViewButton, etc.
		  
		  HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize
		    → AppsUseLightTheme = 0 (dark mode apps)
		    → SystemUsesLightTheme = 0 (dark mode system)
		  
		  HKLM\SYSTEM\Setup\MoSetup
		    → AllowUpgradesWithUnsupportedTPMOrCPU = 1 (bypass TPM check)
		  
		  HKLM\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU
		    → NoAutoUpdate, AUOptions (Windows Update policy)
		  
		  HKLM\SYSTEM\CurrentControlSet\Services
		    → all Windows services and drivers
		  ```
	- ## Registry via CMD & PowerShell
		- ```cmd
		  reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion" /v ProductName
		  reg add "HKCU\SOFTWARE\MyApp" /v Setting /t REG_SZ /d "value" /f
		  reg delete "HKCU\SOFTWARE\MyApp" /v Setting /f
		  reg export "HKCU\SOFTWARE\MyApp" backup.reg
		  reg import backup.reg
		  ```
		- ```powershell
		  Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion" | Select ProductName, CurrentBuild, DisplayVersion
		  Set-ItemProperty "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced" -Name "TaskbarAl" -Value 0
		  New-Item "HKCU:\SOFTWARE\MyApp" -Force
		  Remove-Item "HKCU:\SOFTWARE\MyApp" -Recurse -Force
		  ```
	- ## Useful Windows 11 Registry Tweaks
		- ```
		  Left-align taskbar:
		    HKCU\...\Explorer\Advanced → TaskbarAl = 0
		  
		  Show seconds in taskbar clock:
		    HKCU\...\Explorer\Advanced → ShowSecondsInSystemClock = 1
		  
		  Disable Bing search in Start Menu:
		    HKCU\SOFTWARE\Policies\Microsoft\Windows\Explorer → DisableSearchBoxSuggestions = 1
		  
		  Enable classic right-click context menu (Win10 style):
		    HKCU\SOFTWARE\CLASSES\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32
		    → (Default) = "" (empty string)
		  
		  Disable Windows 11 widgets:
		    HKLM\SOFTWARE\Policies\Microsoft\Dsh → AllowNewsAndInterests = 0
		  ```
-
- # User & Group Management
  collapsed:: true
	- ## Account Types
		- ```
		  Microsoft Account  → online account, syncs settings, OneDrive, required for Home setup
		  Local Account      → offline, no sync — recommended for privacy
		  Administrator      → full system control
		  Standard User      → limited, cannot install system-wide software
		  Guest              → disabled by default
		  ```
	- ## Create Local Account (Bypass Microsoft Account)
		- ```
		  During OOBE setup (Home edition):
		    Method 1: Disconnect internet before setup → "I don't have internet" → "Continue with limited setup"
		    Method 2: Enter fake email (e.g. a@a.com) → wrong password → "Sign-in options" → Offline account
		    Method 3: Shift+F10 → cmd → oobe\bypassnro → system reboots → "I don't have internet"
		  
		  After setup:
		    Settings → Accounts → Your info → Sign in with a local account instead
		  ```
	- ## User Management (CMD)
		- ```cmd
		  net user                                    :: list users
		  net user username Password123! /add         :: create user
		  net user username /delete                   :: delete user
		  net user username newpassword               :: change password
		  net user username /active:no                :: disable account
		  net localgroup Administrators username /add :: make admin
		  net localgroup Administrators username /delete :: remove admin
		  ```
	- ## User Management (PowerShell)
		- ```powershell
		  Get-LocalUser
		  New-LocalUser -Name "username" -Password (ConvertTo-SecureString "Pass123!" -AsPlainText -Force) -FullName "Full Name"
		  Remove-LocalUser -Name "username"
		  Disable-LocalUser -Name "username"
		  Enable-LocalUser -Name "username"
		  Add-LocalGroupMember -Group "Administrators" -Member "username"
		  Remove-LocalGroupMember -Group "Administrators" -Member "username"
		  Get-LocalGroupMember -Group "Administrators"
		  ```
	- ## Important User Paths
		- ```
		  C:\Users\<Username>\                → user profile root
		  C:\Users\<Username>\NTUSER.DAT      → user registry hive
		  C:\Users\<Username>\AppData\Roaming → roaming app data
		  C:\Users\<Username>\AppData\Local   → local app data + cache
		  C:\Windows\System32\config\SAM      → local password hashes (locked while running)
		  ```
-
- # Networking
  collapsed:: true
	- ## Network Info & Diagnostics
		- ```cmd
		  ipconfig /all                  :: full network info (IP, MAC, DNS, DHCP)
		  ipconfig /flushdns             :: flush DNS cache
		  netstat -ano                   :: active connections + PIDs
		  netstat -an | findstr LISTENING :: listening ports
		  arp -a                         :: ARP table (IP → MAC)
		  route print                    :: routing table
		  ping -t 8.8.8.8                :: continuous ping
		  tracert google.com             :: trace route
		  pathping google.com            :: combined ping + tracert
		  nslookup google.com            :: DNS lookup
		  ```
	- ## Network Configuration (netsh)
		- ```cmd
		  :: Set static IP
		  netsh interface ip set address "Ethernet" static 192.168.1.100 255.255.255.0 192.168.1.1
		  :: Set DNS
		  netsh interface ip set dns "Ethernet" static 8.8.8.8
		  netsh interface ip add dns "Ethernet" 8.8.4.4 index=2
		  :: Back to DHCP
		  netsh interface ip set address "Ethernet" dhcp
		  :: Reset TCP/IP + Winsock
		  netsh int ip reset && netsh winsock reset
		  :: Disable/Enable adapter
		  netsh interface set interface "Ethernet" disable
		  netsh interface set interface "Ethernet" enable
		  ```
	- ## Wi-Fi Commands
		- ```cmd
		  netsh wlan show profiles                        :: saved Wi-Fi profiles
		  netsh wlan show profile name="SSID" key=clear  :: show saved password
		  netsh wlan connect name="SSID"                 :: connect
		  netsh wlan disconnect                          :: disconnect
		  netsh wlan show interfaces                     :: adapter info + signal
		  netsh wlan show networks mode=bssid            :: scan nearby networks
		  netsh wlan export profile folder=C:\           :: export profiles to XML
		  ```
	- ## Windows Firewall
		- ```cmd
		  netsh advfirewall show allprofiles             :: firewall status
		  netsh advfirewall set allprofiles state on/off :: enable/disable
		  netsh advfirewall firewall add rule name="HTTP" dir=in action=allow protocol=TCP localport=80
		  netsh advfirewall firewall delete rule name="HTTP"
		  netsh advfirewall firewall show rule name=all
		  ```
		- ```powershell
		  Get-NetFirewallProfile | Select Name, Enabled
		  New-NetFirewallRule -DisplayName "Allow SSH" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow
		  Remove-NetFirewallRule -DisplayName "Allow SSH"
		  Get-NetFirewallRule | Where-Object { $_.Enabled -eq "True" -and $_.Direction -eq "Inbound" } | Select DisplayName, LocalPort
		  ```
	- ## Remote Desktop (RDP)
		- ```
		  Enable:
		    Settings → System → Remote Desktop → Enable Remote Desktop
		    OR: SystemPropertiesRemote.exe → Allow remote connections
		  
		  Connect:
		    mstsc.exe                          → open RDP client
		    mstsc /v:192.168.1.10              → connect to IP
		    mstsc /v:hostname:3389             → with port
		    mstsc /admin                       → admin session
		  
		  Default port: 3389
		  Change port: HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp → PortNumber (DWORD)
		  ```
	- ## Shared Folders & SMB
		- ```cmd
		  net share                              :: list shares
		  net share ShareName=C:\folder /grant:Everyone,READ  :: create share
		  net share ShareName /delete            :: remove share
		  net use Z: \\server\share /user:domain\user password
		  net use Z: /delete                     :: disconnect
		  ```
-
- # Security
  collapsed:: true
	- ## Windows Security App
		- ```
		  Windows Security (windefend):
		    Virus & threat protection  → Defender AV, scan history, ransomware protection
		    Account protection         → Windows Hello, Dynamic Lock, Microsoft account
		    Firewall & network         → Domain / Private / Public firewall profiles
		    App & browser control      → SmartScreen, Exploit protection settings
		    Device security            → Core isolation (HVCI), Secure Boot, TPM status
		    Device performance & health → health report
		    Family options             → parental controls
		  ```
	- ## TPM 2.0 Management
		- ```powershell
		  Get-Tpm                                # TPM status, version, ready state
		  Initialize-Tpm                         # initialize TPM
		  Clear-Tpm                              # clear TPM (WARNING: loses BitLocker keys)
		  Get-TpmSupportedFeature                # supported features
		  ```
		- ```cmd
		  tpm.msc                                :: TPM Management console (GUI)
		  ```
	- ## Windows Defender (PowerShell)
		- ```powershell
		  Start-MpScan -ScanType QuickScan
		  Start-MpScan -ScanType FullScan
		  Start-MpScan -ScanType CustomScan -ScanPath "C:\Downloads"
		  Update-MpSignature                     # update virus definitions
		  Get-MpComputerStatus                   # protection status
		  Get-MpThreatDetection                  # threat history
		  Add-MpPreference -ExclusionPath "C:\MyApp"
		  Remove-MpPreference -ExclusionPath "C:\MyApp"
		  Set-MpPreference -DisableRealtimeMonitoring $false  # ensure real-time on
		  ```
	- ## BitLocker
		- ```
		  Requirements: TPM 2.0 (Windows 11 has it by default), Pro/Enterprise edition
		  Enable:
		    Settings → Privacy & Security → Device encryption (Home)
		    Control Panel → BitLocker Drive Encryption → Turn on BitLocker (Pro)
		  ```
		- ```cmd
		  manage-bde -status                         :: BitLocker status all drives
		  manage-bde -on C: -RecoveryPassword        :: enable with recovery password
		  manage-bde -off C:                         :: disable + decrypt
		  manage-bde -protectors -get C:             :: get recovery key ID
		  manage-bde -unlock D: -RecoveryPassword <48-digit-key>
		  ```
	- ## Credential Guard & VBS
		- ```
		  Check status:
		    msinfo32 → System Summary → Virtualization-based security
		    OR: Get-CimInstance -ClassName Win32_DeviceGuard -Namespace root\Microsoft\Windows\DeviceGuard
		  
		  Enable HVCI (Memory Integrity):
		    Settings → Privacy & Security → Windows Security → Device Security
		    → Core isolation → Memory integrity → On
		  
		  Enable via Group Policy:
		    gpedit.msc → Computer Configuration → Administrative Templates
		    → System → Device Guard → Turn On Virtualization Based Security
		  ```
	- ## Windows Hello
		- ```
		  Settings → Accounts → Sign-in options:
		    Windows Hello Face        → IR camera required
		    Windows Hello Fingerprint → fingerprint reader required
		    Windows Hello PIN         → local PIN (not sent to Microsoft)
		    Security Key              → FIDO2 hardware key (YubiKey etc.)
		    Password                  → traditional (least secure)
		  ```
	- ## Audit & Event Logs
		- ```
		  eventvwr.msc → Event Viewer
		  Key logs:
		    Windows Logs → Security     → logins, privilege use, policy changes
		    Windows Logs → System       → OS events, driver failures, crashes
		    Windows Logs → Application  → app errors and warnings
		  
		  Critical Event IDs:
		    4624  → Successful logon
		    4625  → Failed logon attempt
		    4634  → Account logoff
		    4648  → Logon with explicit credentials (runas)
		    4720  → User account created
		    4726  → User account deleted
		    4732  → Member added to security group
		    4756  → Member added to universal security group
		    7045  → New service installed (malware indicator)
		    1102  → Security audit log cleared (suspicious!)
		    4698  → Scheduled task created
		    4702  → Scheduled task updated
		  ```
		- ```powershell
		  Get-WinEvent -LogName Security -MaxEvents 50
		  Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 20  # failed logins
		  Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624; StartTime=(Get-Date).AddHours(-1)}
		  Get-EventLog -LogName System -EntryType Error -Newest 20
		  ```
-
- # Windows Subsystem for Linux (WSL2)
  collapsed:: true
	- ## What is WSL2?
		- Run a full Linux kernel inside Windows 11 — no VM overhead, native performance.
		- WSL2 is the default in Windows 11 — uses a real Linux kernel in a lightweight Hyper-V VM.
		- Full syscall compatibility, better I/O on Linux filesystem, supports systemd natively.
	- ## Installation
		- ```powershell
		  wsl --install                          # install WSL2 + Ubuntu (default)
		  wsl --install -d Debian                # install specific distro
		  wsl --install -d kali-linux            # install Kali Linux
		  wsl --list --online                    # available distros
		  wsl --list --verbose                   # installed distros + WSL version
		  wsl --set-default-version 2            # ensure WSL2 is default
		  wsl --update                           # update WSL kernel
		  ```
	- ## WSL Usage
		- ```powershell
		  wsl                                    # launch default distro
		  wsl -d Ubuntu                          # launch specific distro
		  wsl -u root                            # launch as root
		  wsl --shutdown                         # stop all WSL instances
		  wsl --terminate Ubuntu                 # stop specific distro
		  wsl --export Ubuntu ubuntu.tar         # backup
		  wsl --import Ubuntu C:\WSL ubuntu.tar  # restore
		  wsl --unregister Ubuntu                # remove (deletes data!)
		  wsl hostname -I                        # get WSL IP address
		  ```
	- ## File System Access
		- ```bash
		  # From WSL — access Windows drives
		  ls /mnt/c/Users/Username/Desktop
		  ls /mnt/d/
		  
		  # From Windows Explorer — access WSL files
		  # Address bar: \\wsl.localhost\Ubuntu\home\username
		  # Or: \\wsl$\Ubuntu\home\username
		  ```
	- ## WSL Config
		- ```ini
		  # %USERPROFILE%\.wslconfig — global WSL2 settings (Windows side)
		  [wsl2]
		  memory=8GB
		  processors=4
		  swap=2GB
		  localhostForwarding=true
		  kernelCommandLine=vsyscall=emulate
		  
		  # /etc/wsl.conf — per-distro settings (Linux side)
		  [boot]
		  systemd=true              # enable systemd (WSL2 Windows 11 22H2+)
		  command="service cron start"  # run command on start
		  
		  [automount]
		  enabled=true
		  root=/mnt/
		  options="metadata,umask=22,fmask=11"
		  
		  [network]
		  hostname=myWSL
		  generateResolvConf=true
		  
		  [interop]
		  enabled=true
		  appendWindowsPath=true
		  ```
	- ## WSL Networking Tips
		- ```bash
		  # Get Windows host IP from WSL
		  cat /etc/resolv.conf | grep nameserver
		  
		  # Access WSL service from Windows (WSL2 auto-forwards localhost)
		  # Start a server in WSL on port 8080 → access via localhost:8080 in Windows
		  
		  # Access WSL from another machine on LAN (requires port proxy)
		  # In PowerShell (Admin):
		  # netsh interface portproxy add v4tov4 listenport=8080 listenaddress=0.0.0.0 connectport=8080 connectaddress=$(wsl hostname -I)
		  ```
-
- # Package Management
  collapsed:: true
	- ## winget (Windows Package Manager)
		- ```cmd
		  winget search vscode
		  winget install Microsoft.VisualStudioCode
		  winget install -e --id Git.Git
		  winget install -e --id Python.Python.3.12
		  winget upgrade                         :: list upgradable
		  winget upgrade --all                   :: upgrade everything
		  winget uninstall Microsoft.VisualStudioCode
		  winget list                            :: installed packages
		  winget export -o packages.json         :: export list
		  winget import -i packages.json         :: bulk install from list
		  ```
	- ## Chocolatey
		- ```powershell
		  # Install (Admin PowerShell)
		  Set-ExecutionPolicy Bypass -Scope Process -Force
		  [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
		  iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
		  
		  choco install git -y
		  choco install vscode nodejs python git -y
		  choco upgrade all -y
		  choco uninstall git -y
		  choco list --local-only
		  ```
	- ## Scoop
		- ```powershell
		  # Install
		  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
		  irm get.scoop.sh | iex
		  
		  scoop install git curl wget jq
		  scoop update *
		  scoop uninstall git
		  scoop bucket add extras
		  scoop bucket add versions
		  scoop search python
		  ```
-
- # Storage & Disk Management
  collapsed:: true
	- ## Disk Management GUI
		- ```
		  diskmgmt.msc               → Disk Management
		  Actions: Initialize, Create/Delete/Format partitions,
		           Extend/Shrink volumes, Change drive letters
		  ```
	- ## DiskPart
		- ```cmd
		  diskpart
		  list disk
		  select disk 1
		  list partition
		  create partition primary size=51200
		  format fs=ntfs quick label="Data"
		  assign letter=D
		  delete partition override
		  clean                      :: wipe entire disk (DESTRUCTIVE)
		  extend                     :: fill unallocated space
		  shrink desired=10240       :: shrink by 10GB
		  ```
	- ## File Systems
		- ```
		  NTFS    → default Windows FS. Permissions, EFS encryption, journaling,
		            compression, large files, symbolic links, ACLs.
		  FAT32   → legacy, max 4GB file size, cross-platform USB drives.
		  exFAT   → no 4GB limit, cross-platform (Windows/macOS/Linux), good for SD/USB.
		  ReFS    → Resilient FS, self-healing, large volumes, Windows Server/Storage Spaces.
		  ```
	- ## Useful Storage Commands
		- ```cmd
		  sfc /scannow                           :: repair system files
		  DISM /Online /Cleanup-Image /RestoreHealth  :: repair Windows image
		  chkdsk C: /f /r /x                    :: full disk check (reboot for C:)
		  cleanmgr                               :: Disk Cleanup GUI
		  compact /c /s:C:\folder                :: NTFS compress folder
		  fsutil volume diskfree C:              :: free space info
		  ```
-
- # Windows 11 Specific Features
  collapsed:: true
	- ## Snap Layouts & Snap Groups
		- ```
		  Hover over maximize button → choose layout (2, 3, or 4 zones)
		  Win + Z                    → open Snap Layouts picker
		  Win + ←/→/↑/↓             → snap window to side/corner
		  Snap Groups: hover taskbar icon → see grouped snapped windows
		  ```
	- ## Virtual Desktops
		- ```
		  Win + Tab                  → Task View
		  Win + Ctrl + D             → new virtual desktop
		  Win + Ctrl + →/←           → switch desktops
		  Win + Ctrl + F4            → close current desktop
		  Each desktop can have its own wallpaper (right-click desktop → Personalize)
		  Move window to another desktop: Task View → drag window to desktop
		  ```
	- ## Widgets
		- ```
		  Win + W                    → open Widgets board
		  Content: News, Weather, Calendar, To Do, Sports, Finance, Traffic
		  Disable Widgets:
		    Settings → Personalization → Taskbar → Widgets → Off
		    OR: Registry → HKLM\SOFTWARE\Policies\Microsoft\Dsh → AllowNewsAndInterests = 0
		  ```
	- ## Windows Subsystem for Android (WSA)
		- ```
		  Requirements: Windows 11 22H2+, 8GB RAM, SSD, virtualization enabled
		  Install: Microsoft Store → Amazon Appstore → install WSA
		  Sideload APKs (developer mode):
		    1. Enable Developer Mode in WSA settings
		    2. adb connect 127.0.0.1:58526
		    3. adb install app.apk
		  ```
	- ## DirectStorage
		- ```
		  Requires: NVMe SSD + DirectX 12 Ultimate GPU + game support
		  Benefit: GPU loads game assets directly from NVMe, bypassing CPU bottleneck
		  Result: Faster load times, higher quality texture streaming
		  Check: Settings → System → Storage → Advanced storage settings → Drives
		  ```
	- ## Auto HDR
		- ```
		  Requires: HDR-capable display
		  Enable: Settings → System → Display → HDR → Auto HDR → On
		  Works with: DirectX 11 games (automatically adds HDR tone mapping)
		  ```
	- ## Focus Sessions (Clock App)
		- ```
		  Clock app → Focus Sessions
		  Pomodoro-style work timer integrated with To Do and Spotify
		  ```
	- ## Taskbar Customization
		- ```
		  Settings → Personalization → Taskbar:
		    Taskbar items: Search, Task View, Widgets, Chat (Teams)
		    Taskbar behaviors: alignment (Left/Center), auto-hide, badge count
		    System tray: which icons appear in corner overflow
		  
		  Left-align taskbar (registry):
		    HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced
		    → TaskbarAl = 0 (left) / 1 (center, default)
		  ```
	- ## Context Menu (Right-Click)
		- ```
		  Windows 11 default: simplified context menu (Show more options → full menu)
		  Restore classic full context menu:
		    reg add "HKCU\SOFTWARE\CLASSES\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve
		    → restart Explorer: taskkill /f /im explorer.exe && start explorer.exe
		  ```
-
- # Hyper-V & Virtualization
  collapsed:: true
	- ## What is Hyper-V?
		- Microsoft's native **Type-1 hypervisor** built into Windows 11 Pro/Enterprise.
		- Requires: 64-bit CPU with SLAT, 4GB+ RAM, BIOS/UEFI virtualization enabled (Intel VT-x / AMD-V).
		- Note: Enabling Hyper-V affects performance of other hypervisors (VMware, VirtualBox) — they run in Hyper-V guest mode.
	- ## Enable Hyper-V
		- ```powershell
		  Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
		  # Or: Control Panel → Programs → Turn Windows features on or off → Hyper-V
		  ```
	- ## Hyper-V PowerShell
		- ```powershell
		  Get-VM                                 # list VMs
		  Start-VM -Name "Ubuntu"
		  Stop-VM -Name "Ubuntu" -Force
		  Suspend-VM -Name "Ubuntu"              # pause VM
		  Checkpoint-VM -Name "Ubuntu" -SnapshotName "Clean State"
		  Restore-VMCheckpoint -Name "Ubuntu" -VMCheckpointName "Clean State"
		  Remove-VMCheckpoint -Name "Ubuntu" -VMCheckpointName "Clean State"
		  New-VM -Name "TestVM" -MemoryStartupBytes 4GB -Generation 2 -NewVHDPath "C:\VMs\test.vhdx" -NewVHDSizeBytes 60GB
		  Set-VM -Name "TestVM" -ProcessorCount 4 -DynamicMemory -MemoryMinimumBytes 2GB -MemoryMaximumBytes 8GB
		  Get-VMSwitch                           # list virtual switches
		  New-VMSwitch -Name "External" -NetAdapterName "Ethernet" -AllowManagementOS $true
		  ```
-
- # Performance & Maintenance
  collapsed:: true
	- ## Performance Tools
		- ```
		  Task Manager (Ctrl+Shift+Esc)  → CPU, RAM, Disk, Network, GPU per process
		  Resource Monitor (resmon.exe)  → detailed per-process breakdown
		  Performance Monitor (perfmon)  → log + graph performance counters
		  Windows Memory Diagnostic      → mdsched.exe → RAM test on reboot
		  Reliability Monitor            → Control Panel → Security and Maintenance → Reliability History
		  ```
	- ## Maintenance Commands
		- ```cmd
		  sfc /scannow                           :: repair system files
		  DISM /Online /Cleanup-Image /CheckHealth
		  DISM /Online /Cleanup-Image /ScanHealth
		  DISM /Online /Cleanup-Image /RestoreHealth
		  chkdsk C: /f /r /x                    :: full disk check
		  cleanmgr                               :: Disk Cleanup
		  powercfg /batteryreport                :: battery health (laptops)
		  powercfg /energy                       :: energy efficiency report
		  msconfig                               :: startup + boot options
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
		  tpm.msc        → TPM Management
		  virtmgmt.msc   → Hyper-V Manager
		  control        → Control Panel
		  ms-settings:   → Settings app (start ms-settings: in Run)
		  appwiz.cpl     → Programs and Features
		  ncpa.cpl       → Network Connections
		  sysdm.cpl      → System Properties
		  desk.cpl       → Display Settings
		  firewall.cpl   → Windows Firewall
		  ```
-
- # Keyboard Shortcuts
  collapsed:: true
	- ## System Shortcuts
		- ```
		  Win              → open/close Start Menu
		  Win + A          → Quick Settings (Action Center)
		  Win + N          → Notification Center
		  Win + W          → Widgets board
		  Win + D          → show/hide Desktop
		  Win + E          → File Explorer
		  Win + I          → Settings
		  Win + L          → lock screen
		  Win + R          → Run dialog
		  Win + S          → Search
		  Win + X          → Quick Link menu (Power User Menu)
		  Win + Z          → Snap Layouts picker (NEW in Win11)
		  Win + Tab        → Task View
		  Win + Ctrl + D   → new virtual desktop
		  Win + Ctrl + →/← → switch virtual desktops
		  Win + Ctrl + F4  → close current virtual desktop
		  Win + PrtScn     → screenshot → Pictures\Screenshots
		  Win + Shift + S  → Snip & Sketch (region screenshot)
		  Win + .          → emoji + GIF picker
		  Win + V          → clipboard history
		  Win + K          → Cast (connect to wireless display)
		  Win + H          → voice typing
		  Win + +/-        → Magnifier zoom
		  ```
	- ## Window Management
		- ```
		  Win + ↑          → maximize
		  Win + ↓          → restore / minimize
		  Win + ←/→        → snap to left/right half
		  Win + Shift + ←/→ → move to other monitor
		  Win + Z          → Snap Layouts (choose zone)
		  Alt + Tab        → switch windows
		  Alt + F4         → close window
		  F11              → fullscreen toggle
		  ```
	- ## File Explorer Shortcuts
		- ```
		  Ctrl + N         → new Explorer window
		  Ctrl + W         → close window
		  Alt + ←/→        → back/forward
		  Alt + ↑          → go up one folder
		  F2               → rename
		  F5               → refresh
		  Ctrl + Shift + N → new folder
		  Alt + Enter      → properties
		  Ctrl + L         → focus address bar
		  ```
	- ## General Shortcuts
		- ```
		  Ctrl + Z/Y       → undo/redo
		  Ctrl + C/X/V     → copy/cut/paste
		  Ctrl + A         → select all
		  Ctrl + S         → save
		  Ctrl + Shift + Esc → Task Manager
		  Ctrl + Alt + Del → security screen
		  PrtScn           → screenshot to clipboard
		  Alt + PrtScn     → active window screenshot
		  ```
-
- # More Learn
	- ## Github & Webs
		- [Windows 11 Official Documentation](https://docs.microsoft.com/en-us/windows/whats-new/windows-11-overview)
		- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)
		- [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/)
		- [Windows Command Reference (SS64)](https://ss64.com/nt/)
		- [PowerShell Reference (SS64)](https://ss64.com/ps/)
		- [Windows Sysinternals Tools](https://docs.microsoft.com/en-us/sysinternals/)
		- [winget Documentation](https://docs.microsoft.com/en-us/windows/package-manager/winget/)
		- [Chris Titus WinUtil – Debloat & Tweaks](https://github.com/ChrisTitusTech/winutil)
		-
	- ## Master Playlists YouTube
		- [Windows 11 Tips & Tricks – NetworkChuck](https://www.youtube.com/results?search_query=windows+11+tips+networkchuck)
		- [PowerShell Full Course – freeCodeCamp](https://www.youtube.com/results?search_query=powershell+full+course+freecodecamp)
		- [WSL2 Development Setup – Fireship](https://www.youtube.com/results?search_query=wsl2+development+setup+fireship)