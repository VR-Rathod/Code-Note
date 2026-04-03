---
seoTitle: Cybersecurity Complete Guide – Concepts, Architecture & Defense
description: "Comprehensive cybersecurity reference covering networking, cryptography, threat models, attack types, defense strategies, ethical hacking concepts, tools, and security architecture."
keywords: "cybersecurity, ethical hacking, network security, cryptography, penetration testing concepts, OWASP, threat modeling, security architecture, information security, cyber defense, security tools, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Cybersecurity – Complete Concepts & Architecture Guide
enableToc: true
---

> [!danger] Legal Disclaimer
> This page is created **strictly for educational purposes**.
> All concepts, tools, and techniques described here are intended to help learners understand how systems work and how to **defend** them.
> **Never** apply any technique on systems, networks, or accounts you do not own or have **explicit written permission** to test.
> Unauthorized access to computer systems is **illegal** in most countries and can result in criminal prosecution.
> Practice only in **legal environments**: your own lab, CTF platforms (HackTheBox, TryHackMe), or with signed authorization.

---

- # History
  collapsed:: true
	- ## How
		- Cybersecurity emerged as a discipline in the **1970s–1980s** as networked computing grew.
		- The **Morris Worm (1988)** — first major internet worm — infected ~6,000 machines and triggered the creation of the first **CERT (Computer Emergency Response Team)**.
		- The **1990s** saw the rise of the web, firewalls, antivirus software, and SSL/TLS encryption.
		- The **2000s** brought large-scale data breaches, botnets, and formalization of ethical hacking certifications (CEH, OSCP).
		- The **2010s–present**: nation-state attacks, ransomware epidemics (WannaCry, NotPetya), cloud security, zero-day markets, and AI-driven threats.
	- ## Who
		- **Whitfield Diffie & Martin Hellman** — invented public-key cryptography (1976).
		- **Ron Rivest, Adi Shamir, Leonard Adleman** — created RSA encryption (1977).
		- **Bruce Schneier** — cryptographer, security author (*Applied Cryptography*).
		- **Kevin Mitnick** — famous social engineer turned security consultant.
		- **Organizations**: NSA, CISA, NIST, OWASP, SANS Institute, Offensive Security.
	- ## Why
		- Protect sensitive data (personal, financial, national security).
		- Ensure trust in digital systems (banking, healthcare, government).
		- Defend critical infrastructure (power grids, hospitals, water systems).
		- Combat evolving threats: malware, ransomware, phishing, APTs, insider threats.
-
- # Core Concepts & Terminology
  collapsed:: true
	- ## The CIA Triad
	  
	  ```mermaid
	  graph LR
	     CIA["🔐 CIA Triad"]
	     C["Confidentiality\nOnly authorized access\nEncryption · ACL · Auth"]
	     I["Integrity\nData is accurate & unaltered\nHashing · Signatures · Checksums"]
	     A["Availability\nSystems accessible when needed\nRedundancy · DDoS Protection · Backups"]
	     CIA --> C
	     CIA --> I
	     CIA --> A
	  ```
	- ## AAA Framework
		- ```
		  Authentication  → verify WHO you are     (password, MFA, biometrics)
		  Authorization   → verify WHAT you can do  (RBAC, ACLs, permissions)
		  Accounting      → track WHAT you did       (audit logs, SIEM)
		  ```
	- ## Key Security Terms
		- | Term | Definition |
		  |------|-----------|
		  | Vulnerability | A weakness in a system that can be exploited |
		  | Threat | A potential event that could cause harm |
		  | Risk | Likelihood × Impact of a threat exploiting a vulnerability |
		  | Exploit | Code or technique that takes advantage of a vulnerability |
		  | Zero-Day | Vulnerability unknown to the vendor — no patch exists |
		  | CVE | Common Vulnerabilities and Exposures (public database) |
		  | CVSS | Vulnerability severity score (0.0 – 10.0) |
		  | IOC | Indicator of Compromise — evidence of a breach |
		  | TTPs | Tactics, Techniques, and Procedures — attacker behavior |
		  | Attack Surface | All possible entry points into a system |
	- ## Defense Principles
	  > [!tip] Core Defense Principles
	  > - **Defense in Depth** — multiple layers of security controls
	  > - **Least Privilege** — give only the access needed, nothing more
	  > - **Zero Trust** — "never trust, always verify" — no implicit trust
	  > - **Separation of Duties** — no single person controls a critical process end-to-end
	  > - **Security by Design** — build security in from the start, not as an afterthought
	  > - **Fail Secure** — on failure, default to a locked/safe state
	- ## Hacker Classifications
		- | Type | Description |
		  |------|-------------|
		  | White Hat | Ethical hackers, authorized security testers |
		  | Black Hat | Malicious hackers, criminal intent |
		  | Grey Hat | Find vulnerabilities without permission, no harm intended |
		  | Script Kiddie | Uses pre-made tools without understanding them |
		  | Hacktivist | Hacks for political/social causes |
		  | Nation-State | Government-sponsored APT groups |
		  | Insider Threat | Malicious or negligent employee with internal access |
-
- # Networking Fundamentals for Security
  collapsed:: true
	- ## OSI Model — Security Perspective
	  
	  ```mermaid
	  graph TD
	     L7["Layer 7 — Application\nHTTP · HTTPS · DNS · FTP · SMTP\nAttacks: XSS · SQLi · Phishing · MITM"]
	     L6["Layer 6 — Presentation\nSSL/TLS · Encoding · Encryption\nAttacks: SSL Stripping · Weak Ciphers"]
	     L5["Layer 5 — Session\nSession Management · Cookies\nAttacks: Session Hijacking · Replay"]
	     L4["Layer 4 — Transport\nTCP · UDP · Ports\nAttacks: SYN Flood · Port Scanning"]
	     L3["Layer 3 — Network\nIP · ICMP · Routing\nAttacks: IP Spoofing · Route Poisoning"]
	     L2["Layer 2 — Data Link\nMAC · ARP · Switches\nAttacks: ARP Spoofing · MAC Flooding"]
	     L1["Layer 1 — Physical\nCables · Hardware · Wireless\nAttacks: Wiretapping · Signal Jamming"]
	     L7 --> L6 --> L5 --> L4 --> L3 --> L2 --> L1
	  ```
	- ## Key Protocols & Security Implications
		- | Protocol | Port | Security Note |
		  |----------|------|---------------|
		  | HTTP | 80 | Unencrypted — use HTTPS |
		  | HTTPS | 443 | HTTP over TLS — always use |
		  | FTP | 21 | Unencrypted — use SFTP |
		  | SSH | 22 | Encrypted remote shell — replaces Telnet |
		  | Telnet | 23 | Unencrypted — **never use** |
		  | DNS | 53 | Vulnerable to poisoning — use DNSSEC/DoH |
		  | DHCP | 67/68 | Vulnerable to rogue DHCP server |
		  | SNMP | 161 | v1/v2 insecure — use SNMPv3 |
		  | RDP | 3389 | Common attack target — restrict access |
		  | SMB | 445 | EternalBlue target — patch and restrict |
		  | LDAP | 389 | Use LDAPS (636) for encryption |
	- ## IP Addressing & Subnetting
		- ```
		  Private ranges (RFC 1918 — not routable on internet):
		    10.0.0.0/8        → 10.0.0.0 – 10.255.255.255
		    172.16.0.0/12     → 172.16.0.0 – 172.31.255.255
		    192.168.0.0/16    → 192.168.0.0 – 192.168.255.255
		    127.0.0.0/8       → loopback (localhost)
		    169.254.0.0/16    → APIPA (link-local, no DHCP)
		  
		  CIDR: 192.168.1.0/24 → 256 addresses, 254 usable
		  /24 = 255.255.255.0 | /16 = 255.255.0.0 | /8 = 255.0.0.0
		  ```
	- ## Network Segmentation Architecture
	  
	  ```mermaid
	  graph LR
	     Internet["🌐 Internet\n(Untrusted)"]
	     FW1["🔥 Perimeter Firewall"]
	     DMZ["🟡 DMZ\nWeb · Mail · DNS servers"]
	     FW2["🔥 Internal Firewall"]
	     LAN["🟢 Internal LAN\n(Trusted)"]
	     MGMT["🔒 Management Network\n(Admin only)"]
	     Internet --> FW1 --> DMZ --> FW2 --> LAN
	     FW2 --> MGMT
	  ```
	- ## DNS Record Types
		- | Record | Purpose |
		  |--------|---------|
		  | A | Domain → IPv4 address |
		  | AAAA | Domain → IPv6 address |
		  | CNAME | Alias → another domain |
		  | MX | Mail server for domain |
		  | NS | Authoritative name servers |
		  | TXT | SPF, DKIM, DMARC, verification |
		  | PTR | Reverse DNS (IP → domain) |
		  | SOA | Start of Authority (zone info) |
		  
		  > [!info] DNS Security
		  > - **DNSSEC** — digitally signs DNS records to prevent spoofing
		  > - **DoH** (DNS over HTTPS) — encrypts DNS queries
		  > - **DoT** (DNS over TLS) — encrypts DNS queries
-
- # Cryptography
  collapsed:: true
	-
	- ## Symmetric vs Asymmetric Encryption
	  
	  ```mermaid
	  graph LR
	     subgraph Symmetric["🔑 Symmetric Encryption"]
	         SK["Same Key\nEncrypt + Decrypt"]
	         AES["AES-256 ✅\nChaCha20 ✅\nDES ❌ BROKEN\n3DES ❌ Deprecated"]
	     end
	     subgraph Asymmetric["🗝️ Asymmetric Encryption"]
	         PK["Public Key → Encrypt\nPrivate Key → Decrypt"]
	         RSA["RSA-2048/4096 ✅\nECC / ECDH ✅\nDSA (sign only) ✅"]
	     end
	  ```
	-
	- ## Symmetric Encryption
		- ```
		  AES (Advanced Encryption Standard)
		    → 128/192/256-bit keys, block cipher, current gold standard
		    → Modes: ECB (weak ❌) | CBC | CTR | GCM (authenticated ✅)
		  ChaCha20 → stream cipher, fast on mobile, used in TLS 1.3
		  DES      → 56-bit, BROKEN ❌ — do not use
		  3DES     → deprecated, slow ❌
		  ```
	-
	- ## Asymmetric Encryption
		- ```
		  RSA   → 2048/4096-bit, based on prime factorization
		  ECC   → Elliptic Curve, smaller keys, same security as RSA
		  ECDSA → EC Digital Signature Algorithm
		  ECDH  → EC Diffie-Hellman key exchange (used in TLS 1.3)
		  DH    → Diffie-Hellman key agreement (not encryption)
		  ```
	-
	- ## Hashing Algorithms
		- | Algorithm | Output | Status |
		  |-----------|--------|--------|
		  | MD5 | 128-bit | ❌ BROKEN — checksums only |
		  | SHA-1 | 160-bit | ❌ BROKEN — deprecated |
		  | SHA-256 | 256-bit | ✅ Secure — widely used |
		  | SHA-512 | 512-bit | ✅ More secure, slower |
		  | SHA-3 | Variable | ✅ Keccak-based, different design |
		  | bcrypt | Variable | ✅ Password hashing with salt |
		  | Argon2 | Variable | ✅ Best for passwords (PHC winner) |
		  | HMAC-SHA256 | 256-bit | ✅ Integrity + authenticity |
		  
		  > [!warning] Password Storage
		  > Never store passwords as plain MD5 or SHA-1 hashes.
		  > Always use **bcrypt**, **scrypt**, or **Argon2** with a unique salt per user.
		  > Rainbow table attacks are defeated by salting.
	-
	- ## TLS Handshake Flow
	  
	  ```mermaid
	  sequenceDiagram
	     participant C as 🖥️ Client
	     participant S as 🌐 Server
	     C->>S: ClientHello (TLS version + cipher suites)
	     S->>C: ServerHello (chosen cipher + Certificate)
	     C->>C: Verify certificate (CA chain, expiry, domain)
	     C->>S: Key Exchange (ECDH public key)
	     S->>C: Key Exchange (ECDH public key)
	     Note over C,S: Both derive same session keys
	     C->>S: Finished (encrypted)
	     S->>C: Finished (encrypted)
	     Note over C,S: 🔒 Encrypted communication begins
	  ```
	-
	- ## Common Cryptographic Attacks
		- | Attack | Description | Defense |
		  |--------|-------------|---------|
		  | Brute Force | Try all possible keys/passwords | Long keys, rate limiting |
		  | Dictionary | Try common passwords from wordlist | Strong passwords, MFA |
		  | Rainbow Table | Precomputed hash lookup | Salt passwords |
		  | Birthday Attack | Find two inputs with same hash | Use SHA-256+ |
		  | MITM | Intercept + modify communication | TLS, certificate pinning |
		  | Padding Oracle | Exploit CBC padding to decrypt | Use AES-GCM |
		  | Timing Attack | Measure execution time to infer secrets | Constant-time comparison |
		  | Replay Attack | Re-send captured auth messages | Nonces, timestamps |
-
- # Threat Landscape & Attack Types
  collapsed:: true
	- ## Malware Categories
		- | Type | Description |
		  |------|-------------|
		  | Virus | Attaches to files, spreads when executed |
		  | Worm | Self-replicates across networks without user action |
		  | Trojan | Disguised as legitimate software, opens backdoor |
		  | Ransomware | Encrypts files, demands payment for decryption key |
		  | Spyware | Secretly monitors user activity, steals data |
		  | Rootkit | Hides deep in OS (kernel level), hard to detect |
		  | Bootkit | Infects MBR/bootloader, loads before OS |
		  | Keylogger | Records keystrokes to steal passwords |
		  | RAT | Remote Access Trojan — full remote control |
		  | Fileless | Lives in memory only, no file on disk, evades AV |
		  | Botnet | Network of infected machines (C2 server controlled) |
		  | Cryptominer | Uses victim's CPU/GPU to mine cryptocurrency |
	- ## Social Engineering Attacks
	  > [!example] Social Engineering Types
	  > - **Phishing** — mass email impersonating trusted entity
	  > - **Spear Phishing** — targeted phishing at specific individual
	  > - **Whaling** — spear phishing targeting executives (CEO, CFO)
	  > - **Vishing** — voice phishing (phone calls)
	  > - **Smishing** — SMS phishing
	  > - **Pretexting** — fabricated scenario to manipulate victim
	  > - **Baiting** — infected USB drives left for victims to find
	  > - **Tailgating** — physically following authorized person through secure door
	  > - **Watering Hole** — compromise website visited by target group
	- ## OWASP Top 10 (2021)
	  
	  ```mermaid
	  graph TD
	     A01["A01 — Broken Access Control\nUser accesses unauthorized resources"]
	     A02["A02 — Cryptographic Failures\nWeak/missing encryption"]
	     A03["A03 — Injection\nSQL · Command · LDAP · XPath"]
	     A04["A04 — Insecure Design\nMissing security in design phase"]
	     A05["A05 — Security Misconfiguration\nDefault creds · Open storage · Verbose errors"]
	     A06["A06 — Vulnerable Components\nOutdated libraries with known CVEs"]
	     A07["A07 — Auth Failures\nWeak passwords · No MFA · Session issues"]
	     A08["A08 — Integrity Failures\nInsecure deserialization · CI/CD attacks"]
	     A09["A09 — Logging Failures\nNo monitoring · No alerting"]
	     A10["A10 — SSRF\nServer fetches internal resources for attacker"]
	  ```
	- ## Injection Attacks Deep Dive
	  > [!bug] SQL Injection
	  > Attacker inserts SQL code into input fields to manipulate database queries.
	  > **Types**: Classic · Blind Boolean · Time-based · Union-based · Error-based
	  > **Impact**: Data theft · Auth bypass · Data deletion · Remote Code Execution
	  > **Defense**: Parameterized queries · ORM · Input validation · WAF
	  
	  > [!bug] Cross-Site Scripting (XSS)
	  > Attacker injects malicious JavaScript into web pages viewed by other users.
	  > **Types**: Reflected · Stored · DOM-based
	  > **Impact**: Session hijacking · Credential theft · Malware delivery
	  > **Defense**: Output encoding · Content Security Policy (CSP) · HttpOnly cookies
	  
	  > [!bug] Command Injection
	  > Attacker injects OS commands into application input.
	  > **Impact**: Full server compromise · Data exfiltration · Lateral movement
	  > **Defense**: Avoid shell calls · Use safe APIs · Input validation
	- ## Password Attack Types
		- | Attack | Method | Defense |
		  |--------|--------|---------|
		  | Brute Force | Try every combination | Long passwords, rate limiting |
		  | Dictionary | Try wordlist (rockyou.txt = 14M) | Strong unique passwords |
		  | Credential Stuffing | Use leaked username:password pairs | MFA, breach monitoring |
		  | Password Spraying | One common password → many accounts | Account lockout policies |
		  | Rainbow Table | Precomputed hash lookup | Salt passwords |
		  | Pass-the-Hash | Use NTLM hash directly | Credential Guard, MFA |
		  | Kerberoasting | Request + crack service tickets offline | Strong service account passwords |
		  | AS-REP Roasting | Attack accounts without pre-auth | Enable Kerberos pre-auth |
-
- # Security Architecture
  collapsed:: true
	- ## Defense in Depth
	  
	  ```mermaid
	  graph TD
	     L8["Layer 8 — Monitoring & Response\nSIEM · SOC · Incident Response · Threat Hunting"]
	     L7["Layer 7 — Identity & Access\nMFA · Least Privilege · PAM · SSO"]
	     L6["Layer 6 — Data Security\nEncryption at Rest/Transit · DLP · Backups"]
	     L5["Layer 5 — Application Security\nWAF · Secure Coding · SAST/DAST · Auth"]
	     L4["Layer 4 — Endpoint Security\nEDR · Host Firewall · Disk Encryption · Patching"]
	     L3["Layer 3 — Network Segmentation\nVLANs · Micro-segmentation · Zero Trust"]
	     L2["Layer 2 — Network Perimeter\nFirewall · IDS/IPS · DMZ · VPN · DDoS Protection"]
	     L1["Layer 1 — Physical Security\nLocked Rooms · Badge Access · CCTV · Cable Locks"]
	     L8 --> L7 --> L6 --> L5 --> L4 --> L3 --> L2 --> L1
	  ```
	- ## Zero Trust Architecture
	  > [!info] Zero Trust Principle
	  > **"Never trust, always verify"** — no implicit trust based on network location.
	  > Being inside the network does NOT mean you are trusted.
		- ```
		  Pillars:
		    Identity   → verify every user with strong auth (MFA, passwordless)
		    Device     → verify device health before granting access
		    Network    → micro-segment, encrypt all traffic
		    Application → per-app access control, not network-level
		    Data       → classify + protect data regardless of location
		  
		  Key Technologies:
		    IAM  → Identity & Access Management
		    MFA  → Multi-Factor Authentication
		    PAM  → Privileged Access Management
		    ZTNA → Zero Trust Network Access (replaces VPN)
		    CASB → Cloud Access Security Broker
		    EDR  → Endpoint Detection & Response
		  ```
	- ## Security Frameworks
	  
	  ```mermaid
	  graph LR
	     NIST["NIST CSF\nIdentify → Protect\nDetect → Respond → Recover"]
	     ISO["ISO/IEC 27001\nISMS Standard\nRisk · Controls · Audits"]
	     CIS["CIS Controls v8\n18 Prioritized Controls\nIG1 → IG2 → IG3"]
	     MITRE["MITRE ATT&CK\nAdversary TTPs\nRecon → Impact"]
	     OWASP["OWASP\nTop 10 · ASVS\nTesting Guide · SAMM"]
	  ```
	- ## MITRE ATT&CK Tactics (Kill Chain)
		- | Tactic | Description |
		  |--------|-------------|
		  | Reconnaissance | Gather info about target |
		  | Resource Development | Acquire infrastructure, tools |
		  | Initial Access | Get into the target environment |
		  | Execution | Run malicious code |
		  | Persistence | Maintain foothold after reboot |
		  | Privilege Escalation | Gain higher permissions |
		  | Defense Evasion | Avoid detection |
		  | Credential Access | Steal credentials |
		  | Discovery | Explore the environment |
		  | Lateral Movement | Move to other systems |
		  | Collection | Gather data of interest |
		  | Command & Control | Communicate with compromised systems |
		  | Exfiltration | Steal data out of the environment |
		  | Impact | Disrupt, destroy, or ransom |
	- ## SOC (Security Operations Center)
		- | Tier | Role | Responsibilities |
		  |------|------|-----------------|
		  | Tier 1 | Alert Triage | Monitor SIEM, classify alerts, escalate |
		  | Tier 2 | Incident Handler | Investigate escalated alerts, contain threats |
		  | Tier 3 | Threat Hunter | Proactively hunt for hidden threats |
		  | Tier 4 | SOC Manager | Strategy, reporting, team management |
		  
		  > [!note] Key SOC Tools
		  > - **SIEM** — Splunk · IBM QRadar · Microsoft Sentinel · Elastic SIEM
		  > - **SOAR** — Palo Alto XSOAR · Splunk SOAR (automate playbooks)
		  > - **EDR** — CrowdStrike Falcon · SentinelOne · Microsoft Defender for Endpoint
		  > - **Threat Intel** — MISP · ThreatConnect · Recorded Future
-
- # Ethical Hacking & Penetration Testing
  collapsed:: true
	- ## What is Ethical Hacking?
	  > [!success] Ethical Hacking Definition
	  > Authorized simulation of real-world attacks to find vulnerabilities **before** malicious actors do.
	  > Also called: Penetration Testing · Red Teaming · Security Assessment.
	  > **Always requires written authorization** — a signed Rules of Engagement (RoE) document.
	  > Legal frameworks: CFAA (US) · Computer Misuse Act (UK) · IT Act 2000 (India).
	- ## Penetration Testing Phases
	  
	  ```mermaid
	  graph LR
	     P1["1️⃣ Planning & Scoping\nDefine scope · Get written auth\nRules of Engagement"]
	     P2["2️⃣ Reconnaissance\nPassive: OSINT · DNS · WHOIS\nActive: Port scan · Enum"]
	     P3["3️⃣ Scanning & Enumeration\nOpen ports · Services · Versions\nUsers · Shares · Subdomains"]
	     P4["4️⃣ Vulnerability Analysis\nMap CVEs · Nessus/OpenVAS\nManual analysis"]
	     P5["5️⃣ Exploitation\nAuthorized only\nDocument every action"]
	     P6["6️⃣ Post-Exploitation\nPrivilege escalation\nLateral movement · Impact"]
	     P7["7️⃣ Reporting\nExecutive summary\nTechnical findings · Remediation"]
	     P1 --> P2 --> P3 --> P4 --> P5 --> P6 --> P7
	  ```
	- ## Test Types
		- | Type | Knowledge | Simulates |
		  |------|-----------|-----------|
		  | Black Box | None | External attacker |
		  | White Box | Full (source, arch, creds) | Internal audit |
		  | Grey Box | Partial | Compromised account / insider |
		  | Red Team | None | Full adversary simulation |
		  | Purple Team | Shared | Red + Blue collaboration |
	- ## OSINT (Open Source Intelligence)
	  > [!info] OSINT is fully legal — no system access required.
	  > Gathering information from publicly available sources only.
		- ```
		  Sources:
		    Google Dorks       → site:example.com filetype:pdf
		                         intitle:"index of" "password"
		    WHOIS              → domain registration info
		    DNS Records        → A, MX, NS, TXT reveal infrastructure
		    Shodan             → search engine for internet-connected devices
		    Censys             → certificate + banner data
		    crt.sh             → find subdomains via SSL certificate logs
		    GitHub             → accidentally committed secrets, API keys
		    LinkedIn           → employee names, job titles, tech stack
		    Wayback Machine    → archived website versions
		  
		  OSINT Tools:
		    theHarvester  → emails, subdomains, IPs from public sources
		    Maltego       → visual relationship mapping
		    Recon-ng      → modular web reconnaissance framework
		    SpiderFoot    → automated OSINT collection
		    Amass         → subdomain enumeration
		  ```
-
- # Security Tools Overview
  collapsed:: true
	- ## Network Analysis
	  
	  > [!note] Wireshark
	  > GUI network protocol analyzer. Captures and inspects packets on a network interface.
	  > **Legal use**: analyze your own network traffic or authorized lab environments.
	  > Key filters: `ip.addr==x.x.x.x` · `tcp.port==80` · `http` · `dns`
	  
	  ```bash title="tcpdump — CLI packet capture"
	  tcpdump -i eth0 -w capture.pcap          # capture to file
	  tcpdump -r capture.pcap port 80          # read + filter
	  tcpdump -i eth0 'tcp and host 10.0.0.1'  # filter by host
	  ```
	- ## Port & Service Scanning
	  
	  > [!note] Nmap — Network Mapper
	  > Industry-standard network discovery and security auditing tool.
	  > **Legal use**: scan your own systems or with written authorization only.
	  
	  ```bash title="Nmap common usage"
	  nmap -sV -O target          # service version + OS detection
	  nmap -sS -T4 target         # SYN scan, aggressive timing
	  nmap -p- target             # all 65535 ports
	  nmap -sC -sV target         # default scripts + version
	  nmap -A target              # aggressive: OS + version + scripts + traceroute
	  nmap --script=safe target   # run safe NSE scripts only
	  nmap -oA output target      # save all output formats
	  ```
	- ## Vulnerability Scanners
		- | Tool | Type | Notes |
		  |------|------|-------|
		  | Nessus | Commercial | Industry standard, CVE + compliance |
		  | OpenVAS / Greenbone | Open Source | Free Nessus alternative |
		  | Nikto | Web Server | Checks misconfigs, outdated software |
		  | Nuclei | Template-based | Fast, community CVE templates |
	- ## Web Application Testing
	  
	  > [!note] Burp Suite — Web Security Testing Platform
	  > Most popular web app security testing tool. Acts as HTTP/HTTPS proxy.
	  > **Legal use**: test your own web apps or with written authorization.
		- | Module | Purpose |
		  |--------|---------|
		  | Proxy | Intercept and modify HTTP/HTTPS requests |
		  | Repeater | Manually resend and modify requests |
		  | Intruder | Automated fuzzing and parameter testing |
		  | Scanner | Automated vulnerability detection (Pro) |
		  | Decoder | Encode/decode Base64, URL, HTML, hex |
		  | Comparer | Diff two requests or responses |
	- ## Password Analysis
	  
	  > [!warning] Legal Use Only
	  > Password cracking tools are for **authorized security audits** and **recovering your own passwords** only.
	  > Using these tools against accounts you don't own is illegal.
	  
	  ```bash title="Hashcat — GPU password hash analysis"
	  # -m hash type: 0=MD5 | 100=SHA1 | 1000=NTLM | 3200=bcrypt
	  hashcat -m 0 hash.txt wordlist.txt           # dictionary attack
	  hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a      # brute force mask
	  hashcat -m 1000 hash.txt wordlist.txt -r best64.rule  # with rules
	  hashcat -m 0 hash.txt --show                 # show cracked
	  ```
	- ## Forensics & Reverse Engineering Tools
		- | Tool | Purpose |
		  |------|---------|
		  | Autopsy / Sleuth Kit | Disk forensics, deleted file recovery |
		  | Volatility | Memory forensics — analyze RAM dumps |
		  | Ghidra | NSA's open-source reverse engineering framework |
		  | IDA Pro | Industry-standard disassembler (commercial) |
		  | Binwalk | Firmware analysis and extraction |
		  | Wireshark | Network packet analysis |
		  | FTK Imager | Disk imaging and forensic acquisition |
-
- # Identity & Access Management (IAM)
  collapsed:: true
	- ## Authentication Methods
		- | Factor | Type | Examples |
		  |--------|------|---------|
		  | Something you KNOW | Knowledge | Password, PIN, security question |
		  | Something you HAVE | Possession | OTP token, smart card, YubiKey |
		  | Something you ARE | Inherence | Fingerprint, face, iris, voice |
		  | Somewhere you ARE | Location | Geolocation, IP-based access |
		  
		  > [!tip] MFA Best Practices
		  > Always require 2+ factors from **different categories**.
		  > Prefer: **FIDO2/WebAuthn hardware keys** > **TOTP apps** > **Push notifications** > **SMS** (weakest).
		  > SMS OTP is vulnerable to SIM swapping attacks.
	- ## Authorization Models
		- | Model | Description | Use Case |
		  |-------|-------------|---------|
		  | DAC | Owner controls access | Linux file permissions, Windows ACLs |
		  | MAC | System enforces labels (Top Secret, etc.) | Military, government (SELinux) |
		  | RBAC | Access based on job role | Enterprise apps (admin, editor, viewer) |
		  | ABAC | Access based on attributes (dept, time, device) | Cloud IAM (AWS policies) |
		  | ReBAC | Access based on relationships | Google Zanzibar, modern SaaS |
	- ## SSO & Federation Protocols
		- | Protocol | Type | Use Case |
		  |----------|------|---------|
		  | SAML 2.0 | XML-based | Enterprise SSO (Okta, ADFS) |
		  | OAuth 2.0 | Authorization framework | "Login with Google/GitHub" |
		  | OpenID Connect | Identity layer on OAuth 2.0 | Returns JWT with user info |
		  | Kerberos | Ticket-based | Windows Active Directory |
	- ## Active Directory Security
	  
	  ```mermaid
	  graph TD
	     DC["🏛️ Domain Controller\nAuthentication · AD Database\nKerberos KDC"]
	     T0["Tier 0 — Domain Controllers\nHighest privilege — most protected"]
	     T1["Tier 1 — Servers\nApp servers, databases"]
	     T2["Tier 2 — Workstations\nUser endpoints"]
	     DC --> T0 --> T1 --> T2
	  ```
	  
	  > [!warning] Common AD Attack Concepts (for defenders)
	  > Understanding these helps you **detect and prevent** them:
	  > - **Pass-the-Hash** — use NTLM hash without knowing plaintext
	  > - **Kerberoasting** — request service tickets, crack offline
	  > - **DCSync** — simulate DC replication to dump all hashes
	  > - **Golden Ticket** — forge Kerberos TGT using krbtgt hash
	  > - **BloodHound** — graph-based AD attack path analysis
	  
	  > [!success] AD Hardening Checklist
	  > - Enable **Protected Users** security group for privileged accounts
	  > - Deploy **LAPS** (Local Admin Password Solution)
	  > - Use **Privileged Access Workstations (PAW)** for admin tasks
	  > - Disable NTLM where possible, enforce Kerberos
	  > - Monitor for DCSync, Kerberoasting, lateral movement in SIEM
	  > - Implement **Credential Guard** (VBS-based LSASS protection)
-
- # Cloud Security
  collapsed:: true
	- ## Shared Responsibility Model
	  
	  ```mermaid
	  graph LR
	     subgraph Provider["☁️ Cloud Provider Responsible"]
	         P1["Physical data center security"]
	         P2["Hypervisor + host OS"]
	         P3["Network infrastructure"]
	         P4["Managed service patching"]
	     end
	     subgraph Customer["👤 Customer Responsible"]
	         C1["Data classification + encryption"]
	         C2["IAM — identity and access"]
	         C3["OS + app patching (IaaS)"]
	         C4["Network config (security groups)"]
	         C5["Monitoring and logging"]
	     end
	  ```
	- ## Common Cloud Misconfigurations
	  > [!danger] Top Cloud Security Mistakes
	  > - **Public S3 Buckets** — sensitive data exposed to internet
	  > - **Overly Permissive IAM** — roles with `AdministratorAccess` or `*` permissions
	  > - **Exposed Metadata Service** — SSRF can reach `169.254.169.254` to steal IAM credentials
	  > - **Security Groups open to `0.0.0.0/0`** — SSH/RDP exposed to entire internet
	  > - **No MFA on Root/Admin** — single credential = full account takeover
	  > - **Unencrypted Storage** — data at rest not encrypted
	  > - **Disabled Audit Logging** — no visibility into API calls
	- ## Cloud Security Services
		- | Platform | Service | Purpose |
		  |----------|---------|---------|
		  | AWS | GuardDuty | ML-based threat detection |
		  | AWS | Security Hub | Centralized security findings |
		  | AWS | Inspector | Vulnerability assessment |
		  | AWS | Macie | Sensitive data discovery in S3 |
		  | AWS | CloudTrail | API call logging |
		  | Azure | Defender for Cloud | CSPM + workload protection |
		  | Azure | Sentinel | Cloud-native SIEM |
		  | GCP | Security Command Center | Threat detection + compliance |
		  | Multi | Wiz / Prisma Cloud | CSPM across clouds |
-
- # Incident Response
  collapsed:: true
	- ## IR Lifecycle (NIST SP 800-61)
	  
	  ```mermaid
	  graph LR
	     P["1️⃣ Preparation\nIR plan · Playbooks\nTools · Training · SIEM"]
	     D["2️⃣ Detection & Analysis\nIdentify IOCs · Triage\nScope + Severity · Preserve evidence"]
	     C["3️⃣ Containment\nIsolate systems\nNetwork quarantine"]
	     E["4️⃣ Eradication\nRemove malware\nPatch · Reset credentials"]
	     R["5️⃣ Recovery\nRestore from backups\nMonitor closely"]
	     L["6️⃣ Lessons Learned\nRoot cause analysis\nUpdate IR plan + detections"]
	     P --> D --> C --> E --> R --> L --> P
	  ```
	- ## Common IOCs (Indicators of Compromise)
	  > [!warning] Network IOCs
	  > - Unusual outbound connections to unknown IPs
	  > - DNS queries to newly registered or DGA domains
	  > - Large data transfers at unusual hours
	  > - Port scanning activity from internal hosts
	  
	  > [!warning] Host IOCs
	  > - New scheduled tasks or services created
	  > - Unusual processes running from temp directories
	  > - Modified system files (file integrity monitoring)
	  > - New user accounts created unexpectedly
	  > - Disabled security tools (AV, logging)
	  > - Encoded PowerShell commands executed
	- ## Critical Windows Event IDs
		- | Event ID | Description | Significance |
		  |----------|-------------|-------------|
		  | 4624 | Successful logon | Baseline |
		  | 4625 | Failed logon | Brute force indicator |
		  | 4648 | Logon with explicit credentials | Lateral movement |
		  | 4720 | User account created | Persistence |
		  | 4732 | Member added to security group | Privilege escalation |
		  | 7045 | New service installed | Malware persistence |
		  | 1102 | Audit log cleared | **Critical — attacker covering tracks** |
		  | 4698 | Scheduled task created | Persistence |
		  | 4776 | NTLM auth attempt | Pass-the-Hash indicator |
	- ## Digital Forensics — Order of Volatility
	  > [!info] Collect most volatile evidence FIRST
	  > 1. CPU registers + cache
	  > 2. RAM (memory dump)
	  > 3. Network connections + routing tables
	  > 4. Running processes
	  > 5. Disk (files, logs)
	  > 6. Remote logging / monitoring data
	  > 7. Physical configuration + network topology
-
- # Secure Development (DevSecOps)
  collapsed:: true
	- ## Secure SDLC — Shift Left
	  
	  ```mermaid
	  graph LR
	     R["Requirements\nSecurity requirements\nThreat modeling\nCompliance needs"]
	     D["Design\nSTRIDE threat model\nSecurity architecture\nData flow diagrams"]
	     DEV["Development\nSecure coding standards\nSAST · SCA\nNo hardcoded secrets"]
	     T["Testing\nDAST · IAST\nPenetration testing\nDependency scanning"]
	     DEP["Deployment\nSecrets management\nContainer image scanning\nIaC security scan"]
	     OPS["Operations\nRuntime protection\nSIEM monitoring\nPatch management"]
	     R --> D --> DEV --> T --> DEP --> OPS
	  ```
	- ## STRIDE Threat Modeling
		- | Letter | Threat | Example | Defense |
		  |--------|--------|---------|---------|
		  | S | Spoofing | Impersonating another user | Strong authentication |
		  | T | Tampering | Modifying data in transit | Integrity checks, TLS |
		  | R | Repudiation | Denying an action occurred | Audit logging, signatures |
		  | I | Info Disclosure | Exposing sensitive data | Encryption, access control |
		  | D | Denial of Service | Making system unavailable | Rate limiting, redundancy |
		  | E | Elevation of Privilege | Gaining higher access | Least privilege, RBAC |
	- ## Secrets Management
	  > [!danger] Never Hardcode Secrets
	  > API keys, passwords, and tokens committed to Git are a **critical security risk**.
	  > Attackers actively scan GitHub for exposed credentials.
	  
	  ```bash title="Scan for accidentally committed secrets"
	  # truffleHog — scan git history for secrets
	  trufflehog git https://github.com/org/repo
	  
	  # git-secrets — prevent committing secrets
	  git secrets --install
	  git secrets --register-aws
	  ```
		- | Solution | Use Case |
		  |----------|---------|
		  | `.env` files + `.gitignore` | Local development |
		  | Environment variables | Basic deployment |
		  | HashiCorp Vault | Enterprise secrets management |
		  | AWS Secrets Manager | AWS workloads |
		  | Azure Key Vault | Azure workloads |
		  | GCP Secret Manager | GCP workloads |
	- ## Container Security Best Practices
	  > [!tip] Docker Security Checklist
	  > - Use official/minimal base images (`alpine`, `distroless`)
	  > - Run containers as **non-root** user
	  > - Scan images for CVEs (Trivy, Snyk, Docker Scout)
	  > - Use read-only filesystems where possible
	  > - Limit capabilities (`--cap-drop ALL`)
	  > - Never use ENV for sensitive data — use secrets management
	  > - Sign images (Docker Content Trust / Cosign)
-
- # Wireless & Physical Security
  collapsed:: true
	- ## Wi-Fi Security Protocols
		- | Protocol | Year | Encryption | Status |
		  |----------|------|-----------|--------|
		  | WEP | 1997 | RC4 (weak IV) | ❌ BROKEN — never use |
		  | WPA | 2003 | TKIP | ❌ Deprecated |
		  | WPA2-Personal | 2004 | AES-CCMP | ✅ Current standard |
		  | WPA2-Enterprise | 2004 | AES + 802.1X/RADIUS | ✅ Best for organizations |
		  | WPA3 | 2018 | SAE + AES | ✅ Most secure — use if supported |
		  
		  > [!tip] Wi-Fi Security Best Practices
		  > - Use **WPA3** if supported, otherwise **WPA2-AES**
		  > - Use strong, unique Wi-Fi passwords (20+ characters)
		  > - **Disable WPS** — vulnerable to brute force attacks
		  > - Separate IoT devices on a **guest VLAN**
		  > - Use **802.1X/RADIUS** for enterprise environments
	- ## Physical Security Controls
		- | Category | Controls |
		  |----------|---------|
		  | Preventive | Locked server rooms · Badge access · Biometrics · Cable locks · Clean desk policy |
		  | Detective | CCTV cameras · Motion sensors · Access logs · Security guards |
		  | Physical Attacks | Tailgating · Shoulder surfing · Dumpster diving · USB drop · Evil maid |
-
- # Certifications & Career Paths
  collapsed:: true
	- ## Certification Roadmap
	  
	  ```mermaid
	  graph TD
	     B["🟢 Beginner\nCompTIA Network+\nCompTIA Security+\nISC2 CC (free)\nGoogle Cybersecurity Cert"]
	     I["🟡 Intermediate\nCEH · CompTIA CySA+\nCompTIA PenTest+\neJPT (practical)"]
	     A["🔴 Advanced\nOSCP (hands-on pentest)\nCISSP (management)\nGPEN / GWAPT\nCRTO (Red Team)"]
	     C["☁️ Cloud Security\nAWS Security Specialty\nAZ-500 (Azure)\nCCSP"]
	     B --> I --> A
	     I --> C
	  ```
	- ## Career Paths
		- | Path | Roles |
		  |------|-------|
		  | 🔵 Blue Team (Defense) | SOC Analyst · Incident Responder · Threat Hunter · Security Engineer · Cloud Security |
		  | 🔴 Red Team (Offense) | Penetration Tester · Red Team Operator · Bug Bounty Hunter · Malware Analyst |
		  | 🟣 Purple Team | Security Researcher · Detection Engineer · Threat Intelligence Analyst |
		  | ⚙️ Management | CISO · Security Architect · GRC Analyst · Security Manager |
	- ## Legal Practice Environments
	  > [!success] Practice Legally — These platforms are 100% legal
	  > - **HackTheBox** (hackthebox.com) — realistic machines, active community
	  > - **TryHackMe** (tryhackme.com) — guided learning paths, beginner-friendly
	  > - **PicoCTF** (picoctf.org) — beginner CTF by Carnegie Mellon
	  > - **OverTheWire** (overthewire.org) — Linux + security wargames
	  > - **VulnHub** (vulnhub.com) — downloadable vulnerable VMs
	  > - **DVWA** — Damn Vulnerable Web App (run locally)
	  > - **PortSwigger Web Security Academy** — free web security labs
	  > - **CTFtime** (ctftime.org) — CTF competition calendar
-
- # More Learn
  collapsed:: true
	- ## Github & Webs
	  collapsed:: true
		- [OWASP Foundation](https://owasp.org)
		- [MITRE ATT&CK Framework](https://attack.mitre.org)
		- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
		- [CVE / NVD Database](https://nvd.nist.gov)
		- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)
		- [PortSwigger Web Security Academy (Free)](https://portswigger.net/web-security)
		- [HackTheBox](https://www.hackthebox.com)
		- [TryHackMe](https://tryhackme.com)
		- [Cybersecurity Roadmap – GitHub](https://github.com/thatstraw/Cybersecurity-Roadmap)
		- [SANS Reading Room](https://www.sans.org/reading-room/)
		- [Exploit Database](https://www.exploit-db.com)
	-
	- ## Master Playlists YouTube
		- [Cybersecurity Full Course – freeCodeCamp](https://www.youtube.com/results?search_query=cybersecurity+full+course+freecodecamp)
		- [Ethical Hacking Full Course – NetworkChuck](https://www.youtube.com/results?search_query=ethical+hacking+full+course+networkchuck)
		- [CompTIA Security+ – Professor Messer](https://www.youtube.com/results?search_query=security+plus+professor+messer)
		- [OSCP Preparation – TCM Security](https://www.youtube.com/results?search_query=oscp+preparation+tcm+security)