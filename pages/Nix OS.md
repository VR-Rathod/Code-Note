---
seoTitle: NixOS Complete Guide – Nix Language, Flakes & Declarative Hardening
description: "Comprehensive NixOS reference covering the Nix expression language, flakes, configuration.nix, garbage collection, and custom packaging workflows."
keywords: "NixOS, Nix, Nix Package Manager, Nix Flakes, configuration.nix, Home Manager, Declarative Linux, Functional Programming, Systems Architecture, Cybersecurity, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: NixOS – Complete Guide
enableToc: true
comments: true
treeTitle: OS - Linux Distros - Nix OS
---

- # History
  collapsed:: true
	- ## The Functional Paradigm Shift (2003)
		- Traditional package managers (such as APT, YUM, or Pacman) treat the operating system as a single global state. When a package is installed or updated, files are written directly to shared system directories (like `/usr/lib` or `/usr/bin`).
		- This stateful approach leads to common problems: dependency conflicts ("dependency hell"), non-reproducible environments, and broken system states after partial updates.
		- In **2003**, **Eelco Dolstra** published his PhD research at Utrecht University proposing a new model: **purely functional package management**.
		- The core idea was to treat packages like values in functional programming languages: once built, they are immutable, and building a package must depend only on declared inputs, preventing side effects.
	- ## The Genesis of Nix and NixOS (2003–2008)
		- Dolstra implemented this model in the **Nix Package Manager** in 2003.
		- To prove that an entire operating system could be managed using functional programming principles, the research team began developing **NixOS** in 2008.
		- Rather than configuring services imperatively (by editing files in `/etc` or running commands), NixOS users wrote a single, declarative Nix expression defining the entire system state.
	- ## Flakes: The Reproducibility Milestone (2020–Present)
		- Historically, Nix builds depended on "channels"—remote package repositories that updated over time. This meant that building the same Nix expression on two different days could yield different package versions, violating strict reproducibility.
		- To solve this, the community introduced **Nix Flakes** (experimental but widely adopted as the standard).
		- Flakes define precise inputs (pinned to specific Git commit hashes) and generate a `flake.lock` file, ensuring that builds remain identical across any machine, indefinitely.
	- ## Release Timeline and Upstream Mapping
		- The release table demonstrates the relation between NixOS versions, release dates, and lifecycle support states:
		- ```
		  NixOS Version   -->   Release Date      -->   Codename          -->   Lifecycle State
		  NixOS 21.05     -->   May 2021          -->   Okapi             -->   End of Life (EOL)
		  NixOS 21.11     -->   November 2021     -->   Porcupine         -->   End of Life (EOL)
		  NixOS 22.05     -->   May 2022          -->   Quokka            -->   End of Life (EOL)
		  NixOS 22.11     -->   November 2022     -->   Raccoon           -->   End of Life (EOL)
		  NixOS 23.05     -->   May 2023          -->   Stoat             -->   End of Life (EOL)
		  NixOS 23.11     -->   November 2023     -->   Tapir             -->   End of Life (EOL)
		  NixOS 24.05     -->   May 2024          -->   Uakari            -->   Active Support (Until Jan 2025)
		  NixOS 24.11     -->   November 2024     -->   Vicugna           -->   Active Support (Until Jul 2025)
		  ```
	- ## NixOS System Architecture Pipeline
		- NixOS builds files and directories via functional inputs evaluation:
		- ```
		                     [ Declarative Configuration Flake ]
		                                      |
		                                      v
		                    [ Nix Expression Parser & Evaluator ]
		                                      |
		                                      v
		                     [ Immutable Derivations (.drv) ]
		                                      |
		                                      v
		                    [ Nix Sandbox Build / Compiler ]
		                                      |
		                                      v
		                      [ Output Store Paths (/nix/store) ]
		                                      |
		                                      v
		                      [ Symlinked System Generations ]
		                       (Atomic Activation & Rollbacks)
		  ```
- # Introduction
  collapsed:: true
	- ## What is NixOS?
		- NixOS is an independent Linux distribution built on top of the Nix package manager. It uses a purely functional and declarative configuration model.
		- The entire operating system—including the kernel, kernel modules, system packages, user profiles, configurations, and systemd services—is defined by a declarative Nix expression file.
	- ## Advantages of NixOS
		- **100% Reproducibility**: The system configuration file builds identical operating system states across different physical machines.
		- **Atomic Upgrades & Rollbacks**: Updates do not overwrite existing active packages. If a system upgrade fails or causes issues, users can roll back to the previous stable state instantly from the bootloader menu.
		- **Isolated Environments**: Packages are stored in isolated paths in the Nix store, preventing conflicts between software versions (e.g. running multiple versions of Node.js or Python concurrently).
		- **Declarative User Profiles**: Home Manager allows administrators to manage user configurations and configurations declaratively alongside system configurations.
	- ## Disadvantages of NixOS
		- **Steep Learning Curve**: Requires learning the functional Nix expression language and understanding functional programming concepts.
		- **FHS Incompatibility**: Does not follow the Filesystem Hierarchy Standard. Pre-compiled binaries downloaded from the internet will fail to run because they cannot resolve dynamic linkers in `/lib` or `/lib64`.
		- **Packaging Overhead**: Developing and debugging custom package derivations is more complex than writing standard PKGBUILDs or spec files.
	- ## Core Use Cases
		- **Reproducible DevOps Deployments**: Building identical server nodes across virtual machines or cloud providers.
		- **Immutable Infrastructure**: Creating hardened servers that resist runtime configuration drift.
		- **Isolated Developer Workspaces**: Using devShells to launch projects with specific, pinned compiler and database versions without global system installations.
	- ## Distribution Comparison: NixOS vs. Debian vs. Arch Linux
		- | Feature | NixOS | Debian | Arch Linux |
		  |---------|-------|--------|------------|
		  | Configuration Model | Purely Declarative (Nix expressions) | Stateful Imperative (manual edits) | Stateful Imperative (manual edits) |
		  | Directory Structure | Non-FHS (isolated Store paths) | FHS Standard | FHS Standard |
		  | Update Mechanism | Atomic Generations (symlink swaps) | Direct Package Replacement | Direct Package Replacement (Rolling) |
		  | Rollback Support | Native (at GRUB/systemd-boot) | Requires manual backups / snapshots | Requires manual cache rollback |
		  | Release Model | Fixed Releases (6-month cycle) | Fixed Releases (Stable cycle) | Rolling Release |
		  | Target Audience | DevOps engineers, advanced users | Enterprise servers, stable nodes | Power users, developers |
- # Installation & Setup
  collapsed:: true
	- ## Hardware Requirements
		- Ensure the system matches the configuration limits prior to installation:
		- ```
		  Metric            -->   Minimum Requirements       -->   Recommended Workstation
		  CPU architecture  -->   x86_64, aarch64, i686      -->   x86_64 Multi-Core (4+ Cores)
		  System RAM        -->   1 GB RAM                   -->   4 GB RAM (8 GB+ preferred for builds)
		  Disk Space        -->   10 GB                      -->   40 GB+ (SSD highly recommended)
		  Network           -->   Required for setup         -->   Broadband Internet (Ethernet preferred)
		  ```
	- ## Manual Installation & Partition Setup
		- While NixOS provides a graphical installer (Calamares) on desktop images, production servers are partitioned and bootstrapped manually using command-line interfaces:
		- ### Partitioning with GPT (UEFI System Example)
			- ```bash
			  # 1. Identify active storage devices
			  sudo fdisk -l
			  
			  # 2. Partition target disk (e.g. /dev/sda) using parted
			  sudo parted /dev/sda -- mklabel gpt
			  sudo parted /dev/sda -- mkpart ESP fat32 1MiB 512MiB
			  sudo parted /dev/sda -- set 1 esp on
			  sudo parted /dev/sda -- mkpart primary ext4 512MiB 100%
			  
			  # 3. Format partitions
			  sudo mkfs.vfat -F 32 -n boot /dev/sda1
			  sudo mkfs.ext4 -L nixos /dev/sda2
			  ```
		- ### Mount Points Mapping
			- Mount the formatted filesystems to prepare the build environment:
			- ```bash
			  # 1. Mount the root filesystem
			  sudo mount /dev/disk/by-label/nixos /mnt
			  
			  # 2. Mount the boot filesystem
			  sudo mkdir -p /mnt/boot
			  sudo mount /dev/disk/by-label/boot /mnt/boot
			  ```
	- ## Configuration Generation
		- Once filesystems are mounted, generate the default NixOS configuration files:
		- ```bash
		  # Generate hardware-configuration.nix and configuration.nix under /mnt/etc/nixos/
		  sudo nixos-generate-config --root /mnt
		  ```
		- This command creates two files:
			- 1. `/mnt/etc/nixos/hardware-configuration.nix`: Contains hardware-specific options (kernel modules, storage UUIDs, file system mount options). This file is automatically generated and should not be modified manually.
			- 2. `/mnt/etc/nixos/configuration.nix`: The primary declarative system configuration file containing user accounts, networking, packages, and systemd services.
	- ## Execution of NixOS Install
		- Once configurations are verified, run the installation compiler:
		- ```bash
		  # Download, compile, and build the system configuration
		  sudo nixos-install
		  
		  # Once installation completes, set the password for the root user when prompted, and reboot
		  sudo reboot
		  ```
- # Nix Expression Language Fundamentals
  collapsed:: true
	- ## Nix Language Overview
		- The Nix expression language is a purely functional, lazy, and dynamically typed domain-specific language used to write package derivations and system configurations.
	- ## Primitive and Complex Data Types
		- Nix supports basic and composite values:
		- ```nix
		  # Primitive Types
		  integer = 42;
		  float = 3.14159;
		  boolean = true;
		  nullValue = null;
		  string = "NixOS Guide";
		  path = /etc/nixos/configuration.nix; # Paths are syntax values, not strings
		  
		  # Complex Types: Lists
		  # Elements are separated by whitespace, not commas
		  listExample = [ 1 2 "three" true /tmp ];
		  
		  # Complex Types: Attribute Sets (Key-Value Maps)
		  attributeSet = {
		    name = "Vaibhav Rathod";
		    uid = 1000;
		    admin = true;
		  };
		  ```
	- ## Let-In Binders (Local Variables)
		- Define temporary values for use inside a specific expression block:
		- ```nix
		  let
		    pkgName = "custom-agent";
		    version = "1.2.0";
		  in
		  {
		    # The values are bound only inside this attribute set
		    name = "${pkgName}-${version}";
		    source = "/src/${pkgName}";
		  }
		  ```
	- ## Functional Syntaxes and Currying
		- Functions in Nix are anonymous and accept a single argument. Multi-argument functions are created by returning functions (**currying**):
		- ```nix
		  # Single argument function:
		  # arg: expression
		  double = x: x * 2;
		  
		  # Curried function (multiple arguments):
		  # x: y: expression
		  multiply = x: y: x * y;
		  # Usage: (multiply 3) 4 -> returns 12
		  
		  # Function using Pattern-Matched Attribute Sets (most common in NixOS configuration files):
		  # { arg1, arg2 }: expression
		  greet = { name, version }: "Hello ${name}, version ${version}";
		  # Usage: greet { name = "NixOS"; version = "24.05"; }
		  
		  # Destructuring arguments with default fallbacks:
		  configure = { pkgs, port ? 8080 }: "Running on port ${toString port}";
		  ```
	- ## Special Language Modifiers
		- ### Inherit
			- Import variables from the parent scope into an attribute set:
			- ```nix
			  let
			    port = 80;
			    hostname = "nixos-srv";
			  in
			  {
			    # Imports variables without re-assigning them manually
			    inherit port hostname;
			    # Equivalent to: port = port; hostname = hostname;
			  }
			  ```
		- ### With
			- Modify search scopes to access attributes directly without namespace qualifiers:
			- ```nix
			  let
			    lib = { add = x: y: x + y; sub = x: y: x - y; };
			  in
			  with lib;
			  {
			    result = add 5 3; # Resolves to lib.add
			  }
			  ```
		- ### Rec (Recursive Attribute Set)
			- Allow attributes inside a set to reference other attributes within the same set:
			- ```nix
			  rec {
			    firstName = "Vaibhav";
			    lastName = "Rathod";
			    fullName = "${firstName} ${lastName}"; # Valid only inside rec sets
			  }
			  ```
	- ## Advanced Operators and Builtins Reference
		- Nix provides robust operators and builtins to manipulate sets, lists, and strings:
		- ### Attribute Set Merging (//)
			- Merges two attribute sets. If keys overlap, the right-hand side set overrides the left-hand side set:
			- ```nix
			  let
			    baseConfig = { port = 80; debug = false; host = "localhost"; };
			    overrideConfig = { port = 8080; debug = true; };
			  in
			  baseConfig // overrideConfig
			  # Output: { port = 8080; debug = true; host = "localhost"; }
			  ```
		- ### Attribute Existence Testing (?)
			- Checks whether an attribute key exists inside a set. Evaluates to a boolean:
			- ```nix
			  let
			    config = { port = 80; };
			  in
			  {
			    hasPort = config ? port;       # Evaluates to true
			    hasSSL = config ? ssl;         # Evaluates to false
			    nestedCheck = config ? a.b.c;  # Safely checks nested structures without throwing errors
			  }
			  ```
		- ### Attribute Selection and Default Fallbacks (or)
			- Selects an attribute from a set, returning a default value if the key does not exist:
			- ```nix
			  let
			    config = { port = 80; };
			  in
			  {
			    selectedPort = config.port;             # Evaluates to 80
			    fallbackSSL = config.ssl or false;       # Evaluates to false
			  }
			  ```
		- ### List Concatenation (++)
			- Concatenates two lists into a single list:
			- ```nix
			  let
			    corePkgs = [ "git" "vim" ];
			    extraPkgs = [ "tmux" "htop" ];
			  in
			  corePkgs ++ extraPkgs
			  # Output: [ "git" "vim" "tmux" "htop" ]
			  ```
		- ### String Interpolation and Multi-line Strings
			- Strings can interpolate Nix expressions using `${}` syntax. Multi-line strings are enclosed in double single quotes `''`:
			- ```nix
			  let
			    username = "developer";
			    script = ''
			      #!/bin/bash
			      echo "Welcome ${username} to your custom shell!"
			      # Escaping interpolation syntax inside multi-line strings is done with double single-quotes:
			      echo "This is a literal ''${VARIABLE} that won't be evaluated by Nix."
			    '';
			  in
			  script
			  ```
		- ### Common Nix Built-ins Reference
			- Built-in functions reside in the `builtins` namespace, which is always in scope:
			- 1. **builtins.map**: Applies a function to all elements in a list.
			  `builtins.map (x: x * x) [ 1 2 3 ] -> [ 1 4 9 ]`
			- 2. **builtins.filter**: Filters a list based on a boolean predicate.
			  `builtins.filter (x: x > 5) [ 2 4 6 8 ] -> [ 6 8 ]`
			- 3. **builtins.elem**: Checks if a value exists within a list.
			  `builtins.elem "git" [ "vim" "git" ] -> true`
			- 4. **builtins.intersectAttrs**: Computes the intersection of keys between two sets.
			  `builtins.intersectAttrs { a = 1; b = 2; } { b = 3; c = 4; } -> { b = 3; }`
			- 5. **builtins.readDir**: Reads directory contents, returning a set of filenames mapped to their type (directory, regular, symlink, unknown).
			- 6. **builtins.toFile**: Writes a string into the Nix store as an immutable file. Useful for config injections.
		- ### The Nix Standard Library (lib)
			- The `nixpkgs` repository provides a `lib` helper set loaded with systems utilities:
			- ```nix
			  # Example usages of lib functions:
			  lib.strings.concatStringsSep ", " [ "a" "b" "c" ] # Evaluates to "a, b, c"
			  lib.lists.unique [ 1 1 2 3 3 ]                  # Evaluates to [ 1 2 3 ]
			  lib.attrsets.mapAttrs (name: val: val + 1) { a = 1; b = 2; } # Evaluates to { a = 2; b = 3; }
			  lib.attrsets.filterAttrs (name: val: name != "secret") { key = 1; secret = 2; } # Evaluates to { key = 1; }
			  ```
- # Kernel & Boot Architecture
  collapsed:: true
	- ## Linux Kernel Customization
		- NixOS allows declarative kernel management. Configure the active kernel package and load drivers directly inside the configuration files:
		- ```nix
		  # configuration.nix
		  { pkgs, ... }:
		  {
		    # 1. Enforce the latest stable kernel packages (default is LTS)
		    boot.kernelPackages = pkgs.linuxPackages_latest;
		  
		    # 2. Declaratively load specific kernel module drivers at boot
		    boot.kernelModules = [ "kvm-intel" "wireguard" ];
		  
		    # 3. Modify kernel runtime parameters (sysctl variables)
		    boot.kernel.sysctl = {
		      "vm.swappiness" = 10;
		      "net.ipv4.ip_forward" = 1;
		      "net.ipv4.conf.all.rp_filter" = 1; # Enable IP spoofing protection
		    };
		  }
		  ```
	- ## Bootloader Configurations
		- NixOS supports both modern systemd-boot and GRUB engines, compiling bootloader menus to reflect system generations:
		- ### UEFI systemd-boot Configuration
			- ```nix
			  # configuration.nix
			  {
			    boot.loader.systemd-boot.enable = true;
			    boot.loader.efi.canTouchEfiVariables = true;
			    boot.loader.systemd-boot.configurationLimit = 10; # Restrict generation menu entries
			  }
			  ```
		- ### GRUB UEFI Configuration
			- ```nix
			  # configuration.nix
			  {
			    boot.loader.grub = {
			      enable = true;
			      device = "nodev"; # Used for UEFI boot paths
			      efiSupport = true;
			      useOSProber = true;
			    };
			    boot.loader.efi.canTouchEfiVariables = true;
			  }
			  ```
	- ## Advanced Initrd and Boot Settings
		- The initial ramdisk (initrd) handles mounting the root file system during early boot phases:
		- ### Available Kernel Modules in Initrd
			- Tell the initrd which drivers to load for hardware storage controllers:
			- ```nix
			  # configuration.nix
			  {
			    boot.initrd.availableKernelModules = [ "ahci" "xhci_pci" "nvme" "usb_storage" "sd_mod" ];
			    boot.initrd.kernelModules = [ "dm-snapshot" "dm-crypt" ];
			  }
			  ```
		- ### Kernel Blacklisting and Module Options
			- Disable driver modules declaratively to prevent loading unwanted hardware layers (useful for security or GPU debugging):
			- ```nix
			  # configuration.nix
			  {
			    # Blacklist modules to prevent kernel loads
			    boot.blacklistedKernelModules = [ "nouveau" "nvidia" "pcspkr" ];
			    
			    # Configure modprobe options for modules
			    boot.extraModprobeConfig = ''
			      options wireguard port=51820
			      options kvm_intel nested=1
			    '';
			  }
			  ```
		- ### Declarative CPU Microcode Updates
			- Keep CPU instruction sets updated against security vulnerabilities (Spectre/Meltdown):
			- ```nix
			  # configuration.nix
			  { config, ... }:
			  {
			    hardware.cpu.intel.updateMicrocode = true;
			    # Or for AMD systems:
			    # hardware.cpu.amd.updateMicrocode = true;
			  }
			  ```
		- ### Custom Kernel Compiling with Patches
			- Compile custom kernels with kernel configuration flags and source patches:
			- ```nix
			  # configuration.nix
			  { pkgs, ... }:
			  {
			    boot.kernelPatches = [
			      {
			        name = "custom-security-patch";
			        patch = ./patches/security-patch.patch;
			      }
			      {
			        name = "enable-rt-scheduling";
			        patch = null; # Apply config options without source code patches
			        extraConfig = ''
			          PREEMPT_RT y
			          HZ_1000 y
			        '';
			      }
			    ];
			  }
			  ```
	- ## Non-FHS Directory Layout
		- Traditional Linux distributions structure paths according to the Filesystem Hierarchy Standard (FHS).
		- Dynamic linkers search `/lib64/ld-linux-x86-64.so.2` and applications depend on `/bin/bash` or `/usr/bin/python`.
		- NixOS breaks this layout entirely to prevent global conflicts.
		- The root directory contains only a few symlinks:
			- `/nix/store`: The global directory containing all immutable package outputs.
			- `/run/current-system`: A symlink pointing to the active system generation.
			- `/bin/sh`: A symlink pointing to bash in the Nix store (provided for POSIX script compatibility).
			- `/etc`: A directory containing symlinks pointing to active configurations in `/nix/store`.
		- ### Package Store Path Format
			- Every path in `/nix/store` follows a strict pattern:
			- `/nix/store/` + `[Cryptographic Hash of Inputs]` + `-` + `[Package Name]` + `-` + `[Version]`
			- Example: `/nix/store/3h5j17nyp899xchwzndr6h1987n4w8j3-nginx-1.24.0/`
			- Changing any source code file, compilation compiler flag, or dependency library hash generates a completely new store path, preventing upgrades from overwriting older binaries used by other processes.
		- ### Patchelf and dynamic linkers
			- Because pre-compiled binaries expect `/lib64/ld-linux-x86-64.so.2` to load libraries, they will crash with a "No such file or directory" error on NixOS.
			- Administrators modify pre-compiled binary link paths using `patchelf`:
			- ```bash
			  # 1. Update the dynamic interpreter pointer to use the Nix store glibc
			  patchelf --set-interpreter /nix/store/*-glibc-*/lib/ld-linux-x86-64.so.2 /usr/local/bin/agent
			  
			  # 2. Modify the library search paths (RPATH)
			  patchelf --set-rpath /nix/store/*-glibc-*/lib:/nix/store/*-openssl-*/lib /usr/local/bin/agent
			  ```
- # System Configuration (`configuration.nix`)
  collapsed:: true
	- ## Production-Hardened configuration.nix File
		- Below is a complete, production-grade `/etc/nixos/configuration.nix` file outlining declarative system administration, security hardening, user creations, and firewall rules:
		- ```nix
		  # ==============================================================================
		  # File: /etc/nixos/configuration.nix
		  # Description: Production configuration.nix specifying secure base states.
		  # Author: VR-Rathod
		  # ==============================================================================
		  
		  { config, pkgs, ... }:
		  
		  {
		    imports =
		      [ # Include the results of the hardware scan.
		        ./hardware-configuration.nix
		      ];
		  
		    # Use the systemd-boot EFI boot loader.
		    boot.loader.systemd-boot.enable = true;
		    boot.loader.systemd-boot.configurationLimit = 15;
		    boot.loader.efi.canTouchEfiVariables = true;
		  
		    # Networking configuration
		    networking.hostName = "nixos-prod-node";
		    networking.networkmanager.enable = true;
		  
		    # Set time zone and locales
		    time.timeZone = "UTC";
		    i18n.defaultLocale = "en_US.UTF-8";
		  
		    # Declarative Packages List
		    environment.systemPackages = with pkgs; [
		      vim
		      wget
		      curl
		      git
		      htop
		      tmux
		      sysstat
		      iptables
		      tcpdump
		    ];
		  
		    # User Account Configuration
		    users.users.developer = {
		      isNormalUser = true;
		      description = "Lead Systems Developer";
		      extraGroups = [ "wheel" "networkmanager" ]; # 'wheel' grants password-sudo access
		      hashedPassword = "$6$SecureSalt$6h5n8dj17n8s9d18hj19dh18nS9d18hj18sh10d8hj17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h"; # Pre-generated password hash
		      openssh.authorizedKeys.keys = [
		        "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJKN8j17n8s9d18hj19dh18nS9d18hj18sh10d8hj17s root@admin"
		      ];
		    };
		  
		    # System services configurations
		    services.openssh = {
		      enable = true;
		      settings = {
		        PermitRootLogin = "no";
		        PasswordAuthentication = false;
		        KexAlgorithms = [ "curve25519-sha256" "curve25519-sha256@libssh.org" ];
		      };
		      ports = [ 2200 ]; # Hardened SSH port
		    };
		  
		    # Nginx Web Server configuration
		    services.nginx = {
		      enable = true;
		      virtualHosts."app.nixos.local" = {
		        root = "/var/www/nixos_app";
		        locations."/" = {
		          index = "index.html";
		        };
		      };
		    };
		  
		    # Firewall configurations
		    networking.firewall = {
		      enable = true;
		      allowedTCPPorts = [ 80 443 2200 ];
		      allowedUDPPorts = [ ];
		    };
		  
		    # Hardening kernel configurations
		    security.protectKernelImage = true;
		    security.forcePageTableIsolation = true;
		  
		    # Automatic Garbage Collection (System Cleanliness)
		    nix.gc = {
		      automatic = true;
		      dates = "weekly";
		      options = "--delete-older-than 14d";
		    };
		  
		    # Enforce Nix Flakes configuration standard
		    nix.settings.experimental-features = [ "nix-command" "flakes" ];
		  
		    # NixOS System Release Version (Do not modify this value)
		    system.stateVersion = "24.05";
		  }
		  ```
		- Rebuild and activate system configurations:
		- ```bash
		  # Apply configurations rebuild switch
		  sudo nixos-rebuild switch
		  ```
	- ## System Containerization and Declarative Containers
		- NixOS allows running isolated container namespaces natively using `systemd-nspawn` declaratively:
		- ```nix
		  # configuration.nix
		  { config, pkgs, ... }:
		  {
		    # Configure a declarative systemd container web-server node
		    containers.web-app = {
		      autoStart = true;
		      privateNetwork = true;
		      hostAddress = "192.168.100.10";
		      localAddress = "192.168.100.11";
		      
		      # Define the declarative settings for inside the container
		      config = { config, pkgs, ... }: {
		        services.nginx.enable = true;
		        services.nginx.virtualHosts."localhost".root = "/var/www";
		        
		        # Define packages and state version inside the container sandbox
		        environment.systemPackages = [ pkgs.curl pkgs.git ];
		        system.stateVersion = "24.05";
		        
		        networking.firewall.allowedTCPPorts = [ 80 ];
		      };
		    };
		  }
		  ```
	- ## Binary Caches and Substituters Configuration
		- Speed up compilation speeds by fetching pre-compiled binaries from trusted cache endpoints:
		- ```nix
		  # configuration.nix
		  { config, ... }:
		  {
		    nix.settings.substituters = [
		      "https://cache.nixos.org"
		      "https://nix-community.cachix.org"
		    ];
		    
		    nix.settings.trusted-public-keys = [
		      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
		      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
		    ];
		  }
		  ```
- # Nix Flakes and Inputs
  collapsed:: true
	- ## What are Flakes?
		- Nix Flakes are a system for organizing Nix configurations, packaging parameters, and dependencies with strict reproducibility.
		- Flakes define dependencies in a `flake.nix` file using explicit **inputs** and declare the built targets inside the **outputs** functions.
	- ## Flake Input Pinning (`flake.lock`)
		- When a flake is evaluated, Nix downloads the dependencies declared under `inputs` and records their exact Git commit hashes inside `flake.lock`.
		- Any subsequent builds use this lockfile to pull identical code, ensuring that your server builds remain consistent over time.
	- ## Flake Code Example (`flake.nix`)
		- Below is a complete production-ready `flake.nix` that configures a system host using nixpkgs inputs:
		- ```nix
		  # File: flake.nix
		  {
		    description = "Production NixOS Systems Deployment Flake";
		  
		    inputs = {
		      # Pin target package repositories input channel
		      nixpkgs.url = "github:nixos/nixpkgs/nixos-24.05";
		    };
		  
		    outputs = { self, nixpkgs, ... }@inputs: {
		      # System target configurations mapping
		      nixosConfigurations."nixos-prod-node" = nixpkgs.lib.nixosSystem {
		        system = "x86_64-linux";
		        modules = [
		          ./configuration.nix # Include the primary system layout
		        ];
		      };
		    };
		  }
		  ```
		- To rebuild a system using the Flake setup:
		- ```bash
		  # Rebuild the system pointing to the current directory containing flake.nix
		  sudo nixos-rebuild switch --flake .#nixos-prod-node
		  ```
- # Shell & Terminal
  collapsed:: true
	- ## Nix-Specific Command CLI Tools
		- NixOS replaces traditional package commands with specialized Nix shell environments:
		- **nix-shell**: Launches an interactive shell containing temporary packages. Once exited, the packages are unlinked from search paths.
		- **nix shell**: The modern flakes-compatible command to run applications without installing them.
		- **nix develop**: Launches a development environment containing compilers, dependencies, and build variables specified in a local `flake.nix`.
	- ## Essential Commands Directory (75+ Commands)
		- ### Nix Package Manager Operations
			- ```bash
			  nixos-rebuild switch       # Build and apply active system configuration (creates a new system generation)
			  nixos-rebuild boot         # Build configuration and set as default boot menu generator without switching immediately
			  nixos-rebuild test         # Build and apply configurations temporarily without saving to bootloader generation list
			  nix-env -qaP '*nginx*'     # Query available packages matching term in channels
			  nix-env -iA nixos.nginx    # Install package into active user profile env path (imperative, not recommended)
			  nix-env -e nginx           # Uninstall package from active user profile env path
			  nix-env -list-generations  # List all user profile generation stages
			  nix-env --rollback         # Roll back user profile env to previous stage
			  nix-shell -p git tmux      # Launch temporary interactive shell containing git and tmux
			  nix shell nixpkgs#htop     # Launch htop from nixpkgs without installing it globally
			  nix develop --command bash # Launch developer environment and spawn shell
			  nix-collect-garbage -d     # Delete all old system generations and unreferenced store files immediately
			  nix-store --gc             # Run standard Nix garbage collection routines
			  nix-store --optimise       # Hard-link identical store files to save disk blocks
			  nix-store --verify --check-contents # Verify filesystem integrity of store paths
			  nix-store -qR $(which tmux)# Query all runtime store path dependencies for tmux binary
			  nix log nixpkgs#nginx      # Retrieve compilation build logs for nginx package
			  nix flake update           # Update all input commit hashes inside flake.lock
			  nix flake show             # Display output targets structure of a local flake
			  nix flake check            # Verify syntax and formatting of a flake
			  ```
		- ### General File Operations & Inspection
			- ```bash
			  pwd                        # Print active directory path
			  ls -la                     # List files in verbose table showing hidden entries
			  cd /etc/nixos/             # Change directory location
			  mkdir -p /var/www/site/    # Create nested directories
			  touch /tmp/agent.lock      # Create empty file or update timestamp
			  cp -a source/ backup/      # Copy directory recursively, preserving permissions
			  mv old.txt new.txt         # Move or rename file
			  rm -rf /tmp/scratch/       # Delete files and folders recursively
			  ln -s target link_name     # Create symbolic link
			  find . -name "*.nix"       # Search recursively for files matching pattern
			  cat /etc/hostname          # Display file content
			  head -n 20 /etc/passwd     # Output first 20 lines of a file
			  tail -f /var/log/nginx/access.log # Monitor new lines in real-time
			  grep -rn "experimental" .  # Search recursively for string pattern
			  wc -l configuration.nix    # Count lines in a file
			  file /run/current-system/sw/bin/bash # Display file type descriptors
			  stat /etc/nixos/flake.nix  # Read file timestamps and permissions
			  diff old.nix new.nix       # Compare file modifications
			  ```
		- ### Process Management & System Diagnostics
			- ```bash
			  ps aux                     # Display all running system processes
			  top -b -n 1                # Print resource usage statistics in batch mode
			  htop                       # Launch interactive process monitoring console
			  pgrep -u root nginx        # Print PIDs of nginx processes owned by root
			  kill -15 1024              # Terminate process gracefully
			  kill -9 1024               # Terminate process immediately
			  pkill -u visitor           # Kill all processes owned by user account
			  killall httpd              # Kill all instances of httpd
			  jobs                       # List background jobs
			  bg %1                      # Resume suspended job in background
			  fg %1                      # Bring background job to foreground
			  nohup node server.js &     # Run process in background, ignoring hangup signals
			  ulimit -a                  # Display session resource limit parameters
			  nice -n 10 build.sh        # Start process with lower priority level
			  renice +5 -p 2045          # Modify priority level of active PID 2045
			  systemctl list-units       # List active systemd service units
			  systemctl status nginx     # Check status of Nginx daemon service
			  journalctl -u nginx -n 50  # View last 50 log entries for Nginx service
			  ```
		- ### Networking & Hardware Information
			- ```bash
			  ip addr show               # Display active IP configuration
			  ping -c 3 google.com       # Send ICMP packets to verify remote host
			  ss -tulnp                  # Show active listening TCP and UDP sockets with PIDs
			  traceroute 8.8.8.8         # Display hop paths to destination
			  curl -I https://nixos.org  # Fetch HTTP headers of target site
			  wget https://site.com/file # Download file
			  dig nixos.org              # Perform DNS record queries
			  nslookup nixos.org         # Query internet name servers
			  hostnamectl                # Display active hostnames and kernel versions
			  ip route show              # Print active system routing paths
			  ip neigh show              # Display ARP mapping tables
			  uname -a                   # Output kernel release and OS details
			  lscpu                      # View CPU cores and architecture details
			  lsblk                      # Display disk partitions and UUID layouts
			  free -h                    # Show RAM and swap metrics
			  uptime                     # Print system running time and CPU load averages
			  dmesg | grep -i error      # Print kernel ring buffer messages filtered by term
			  lsmod                      # List loaded kernel modules
			  ```
	- ## File Permissions & Special Flags
		- System permissions are managed via standard Owner, Group, and Others octal bits.
		- However, on NixOS, permissions for files in `/nix/store` are strictly read-only for all users (including root) to preserve reproducibility.
		- ### Special Flags
			- SUID, SGID, and Sticky Bits are managed declaratively using wrappers, because `/nix/store` binaries cannot be modified directly:
			- ```nix
			  # configuration.nix
			  security.wrappers.custom_helper = {
			    source = "${pkgs.custom_helper}/bin/custom_helper";
			    owner = "root";
			    group = "root";
			    setuid = true; # Enforce SUID wrapper in /run/wrappers/bin/
			  };
			  ```
	- ## Production Shell Automation Scripts
		- ### Script 1: System State and Garbage Collector Alert Daemon
			- Save as `/usr/local/bin/nix_gc_monitor.sh`. Checks store space and cleans generations when thresholds are exceeded.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: nix_gc_monitor.sh
			  # Description: Monitors Nix store disk usage and triggers garbage collection.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  STORE_LIMIT=85 # Max disk usage percent
			  LOG_FILE="/var/log/nix_gc_monitor.log"
			  
			  log_write() {
			      echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] - $2" >> "$LOG_FILE"
			  }
			  
			  # Get current disk utilization of the Nix store partition
			  USAGE=$(df /nix | tail -n 1 | awk '{print $5}' | sed 's/%//')
			  
			  if [ "$USAGE" -gt "$STORE_LIMIT" ]; then
			      log_write "WARNING" "Nix store utilization is at $USAGE%. Starting garbage collection..."
			      # Delete system generations older than 14 days
			      nix-collect-garbage --delete-older-than 14d >> "$LOG_FILE" 2>&1
			      # Optimise the store to reclaim identical duplicate files space
			      nix-store --optimise >> "$LOG_FILE" 2>&1
			      log_write "INFO" "Garbage collection completed."
			  else
			      log_write "INFO" "Nix store utilization stable at $USAGE%."
			  fi
			  
			  exit 0
			  ```
		- ### Script 2: Auto Backup Nix Configuration Flake
			- Save as `/usr/local/bin/nix_backup.sh`. Backs up configurations to a remote repository or directory.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: nix_backup.sh
			  # Description: Copies NixOS config flakes to a secure backup staging location.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  CONFIG_DIR="/etc/nixos"
			  BACKUP_STAGE="/var/backups/nixos_flake"
			  
			  mkdir -p "$BACKUP_STAGE"
			  
			  if [ -d "$CONFIG_DIR" ]; then
			      # Copy configuration files and lockfiles, ignoring build directories
			      tar -czf "$BACKUP_STAGE/nixos_config_$(date '+%Y%m%d_%H%M%S').tar.gz" \
			          -C "$CONFIG_DIR" --exclude=".git" .
			      echo "NixOS configuration flake backed up successfully."
			  else
			      echo "Error: Configuration folder not found."
			      exit 1
			  fi
			  
			  exit 0
			  ```
		- ### Script 3: Flake Input Updater Cron Manager
			- Save as `/usr/local/bin/flake_updater.sh`. Automatically updates inputs and locks parameters.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: flake_updater.sh
			  # Description: Updates local NixOS flake input channels and tests build states.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  CONFIG_DIR="/etc/nixos"
			  LOG_FILE="/var/log/nixos_updater.log"
			  
			  log_event() {
			      echo "[$(date '+%Y-%m-%d %H:%M:%S')] - $1" >> "$LOG_FILE"
			  }
			  
			  cd "$CONFIG_DIR" || exit 1
			  
			  log_event "Starting scheduled NixOS flake inputs update check..."
			  
			  # Update inputs in flake.lock
			  nix flake update --commit-lock-file >> "$LOG_FILE" 2>&1
			  
			  # Dry-run system build to verify configurations compile correctly
			  if nixos-rebuild dry-build --flake .#default >> "$LOG_FILE" 2>&1; then
			      log_event "Success: Flake inputs updated and verified (compiles successfully)."
			  else
			      log_event "ERROR: Compilation dry-build failed after update! Rolling back lockfile..."
			      git checkout flake.lock
			  fi
			  
			  exit 0
			  ```
		- ### Script 4: Nix devShell Launcher Selector
			- Save as `/usr/local/bin/devshell_select.sh`. Interactive menu to load custom workspaces.
			- ```bash
			  #!/bin/bash
			  # ==============================================================================
			  # Script: devshell_select.sh
			  # Description: Interactive launcher to launch specific development shells.
			  # Author: VR-Rathod
			  # ==============================================================================
			  
			  echo "=== NIX DEVELOPMENT ENVIRONMENT LAUNCHER ==="
			  echo "1) Python Data Science (pandas, numpy, jupyter)"
			  echo "2) Go Backend Development (go compiler, gopls)"
			  echo "3) Rust Systems Programming (rustc, cargo, rust-analyzer)"
			  read -r -p "Select environment profile (1-3): " choice
			  
			  case "$choice" in
			      1)
			          echo "Launching Python devShell..."
			          nix-shell -p python3 python3Packages.pandas python3Packages.numpy python3Packages.jupyter
			          ;;
			      2)
			          echo "Launching Go devShell..."
			          nix-shell -p go gopls
			          ;;
			      3)
			          echo "Launching Rust devShell..."
			          nix-shell -p rustc cargo rust-analyzer
			          ;;
			      *)
			          echo "Invalid selection."
			          exit 1
			          ;;
			  esac
			  
			  exit 0
			  ```
- # User & Home Manager Configurations
  collapsed:: true
	- ## Declarative User Configurations
		- System users are created declaratively inside `/etc/nixos/configuration.nix`.
		- The system automatically creates home folders, hashes passwords, and registers access groups during rebuild switches:
		- ```nix
		  # configuration.nix
		  users.users.lead_dev = {
		    isNormalUser = true;
		    description = "Lead Software Engineer";
		    extraGroups = [ "wheel" "networkmanager" "docker" "libvirtd" ];
		    uid = 1001;
		    # Detailed settings for subUids and subGids to enable rootless container engines like Podman
		    subUidRanges = [{ startUid = 100000; count = 65536; }];
		    subGidRanges = [{ startGid = 100000; count = 65536; }];
		    # Declarative setting of default shell for the user
		    shell = pkgs.zsh;
		  };
		  ```
	- ## Home Manager Integration
		- **Home Manager** is a Nix utility used to manage user configuration files and directories declaratively.
		- Configure git profiles, shell configs, and editor variables using Nix expressions:
		- ```nix
		  # File: home.nix
		  { config, pkgs, ... }:
		  
		  {
		    home.username = "lead_dev";
		    home.homeDirectory = "/home/lead_dev";
		  
		    # Install user-specific packages
		    home.packages = with pkgs; [
		      fzf
		      ripgrep
		      neovim
		      tmux
		      bat
		      eza
		      htop
		      git-crypt
		      gnupg
		    ];
		  
		    # Declarative Git configurations
		    programs.git = {
		      enable = true;
		      userName = "Vaibhav Rathod";
		      userEmail = "vr@code-note.com";
		      aliases = {
		        co = "checkout";
		        st = "status";
		        br = "branch";
		        ci = "commit";
		        lg = "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit";
		      };
		      extraConfig = {
		        init.defaultBranch = "main";
		        core.editor = "nvim";
		        pull.rebase = true;
		        commit.gpgsign = true;
		        gpg.program = "gpg2";
		      };
		    };
		  
		    # Declarative Zsh configuration with auto-suggestions and highlighting
		    programs.zsh = {
		      enable = true;
		      enableAutosuggestions = true;
		      enableCompletion = true;
		      syntaxHighlighting.enable = true;
		      shellAliases = {
		        ll = "eza -lh --grid --git";
		        la = "eza -lah --grid --git";
		        gc = "nix-store --gc";
		        nrs = "sudo nixos-rebuild switch --flake /etc/nixos/#default";
		        update-sys = "sudo nixos-rebuild switch --upgrade-all --flake /etc/nixos/#default";
		      };
		      history = {
		        size = 10000;
		        save = 10000;
		        share = true;
		        path = "${config.home.homeDirectory}/.zsh_history";
		      };
		      initExtra = ''
		        # Custom interactive commands
		        export PATH=$PATH:$HOME/.local/bin
		        
		        # Autostart tmux in interactive shells if not already inside it
		        if [ -z "$TMUX" ] && [ "$SSH_CONNECTION" != "" ]; then
		            tmux attach-session -t default || tmux new-session -s default
		        fi
		      '';
		    };
		  
		    # Declarative Neovim Configuration with plugins and settings
		    programs.neovim = {
		      enable = true;
		      viAlias = true;
		      vimAlias = true;
		      coc.enable = false; # Prefer native LSP configurations
		      plugins = with pkgs.vimPlugins; [
		        vim-nix
		        nvim-treesitter.withAllGrammars
		        telescope-nvim
		        gruvbox-nvim
		        lualine-nvim
		        nvim-cmp
		        cmp-nvim-lsp
		        nvim-lspconfig
		      ];
		      extraConfig = ''
		        " General Vim configurations
		        set number relativenumber
		        set tabstop=4 shiftwidth=4 expandtab
		        set smartindent
		        set cursorline
		        set termguicolors
		        colorscheme gruvbox
		        syntax on
		        
		        lua << EOF
		        require('lualine').setup {
		          options = { theme = 'gruvbox' }
		        }
		        -- Configure treesitter
		        require'nvim-treesitter.configs'.setup {
		          highlight = { enable = true },
		          indent = { enable = true }
		        }
		        EOF
		      '';
		    };
		  
		    # Declarative Window Manager (i3) configuration via Home Manager
		    xsession.windowManager.i3 = {
		      enable = true;
		      config = {
		        modifier = "Mod4"; # Super key
		        terminal = "alacritty";
		        gaps = {
		          inner = 8;
		          outer = 4;
		        };
		        keybindings = lib.mkOptionDefault {
		          "Mod4+d" = "exec rofi -show run";
		          "Mod4+Shift+x" = "exec i3lock -c 000000";
		        };
		      };
		    };
		  
		    # Custom systemd user service to run an agent daemon background checker
		    systemd.user.services.agent-checker = {
		      Unit = {
		        Description = "User space agent security status checker";
		        After = [ "graphical-session-pre.target" ];
		      };
		      Service = {
		        Type = "simple";
		        ExecStart = "${pkgs.bash}/bin/bash -c 'while true; do echo \"User Security Agent Running OK\" >> %h/.agent-checker.log; sleep 300; done'";
		        Restart = "always";
		      };
		      Install = {
		        WantedBy = [ "default.target" ];
		      };
		    };
		  
		    # Home Manager state version
		    home.stateVersion = "24.05";
		  }
		  ```
- # Custom Packaging & Derivations
  collapsed:: true
	- ## Derivations Concept
		- In Nix, a package description is called a **derivation**.
		- When evaluated, a derivation is translated into a low-level build instruction file (with a `.drv` extension) stored in the Nix store.
		- The Nix builder executes this `.drv` inside a sandboxed environment (lacking network access and global directories), ensuring that the build output depends only on the declared inputs.
	- ## Nix Build Phases Walkthrough
		- The Nix `stdenv` builder runs the compilation through highly organized phases, which can be custom overridden:
		- 1. **prePhases / unpackPhase**: Copies the source code from remote tarballs or local paths into the temporary sandbox build folder.
		- 2. **patchPhase**: Applies any declarative custom patch files using the `patches` parameter array.
		- 3. **configurePhase**: Executes configurations scripts like `./configure --prefix=$out` or setup tasks.
		- 4. **buildPhase**: Runs build processes (like `make` or custom compilation commands).
		- 5. **checkPhase**: Runs unit tests (`make check` or `cargo test`). Requires `doCheck = true;`.
		- 6. **installPhase**: Copies compiled outputs, binaries, assets, and libraries to the target `$out` Nix store path.
		- 7. **fixupPhase**: Post-processing step that rewrites dynamic links using `patchelf`, strips debug symbols, and cleans up path directories.
	- ## Custom Overrides: override vs overrideAttrs
		- Nix provides two separate mechanisms to customize existing packages:
		- `override`: Used to change the *arguments* passed to the package function (e.g. enabling features, dependencies).
		- `overrideAttrs`: Used to change the *attributes* of the underlying derivation (e.g. version, src, patches, postInstall).
		- ### Using override Example
			- ```nix
			  # Change build options for curl to enable HTTP/3 support
			  myCurl = pkgs.curl.override {
			    http3Support = true;
			    gnutlsSupport = false;
			  };
			  ```
		- ### Using overrideAttrs Example
			- ```nix
			  # Update a package source and version locally
			  myNginx = pkgs.nginx.overrideAttrs (oldAttrs: rec {
			    version = "1.25.3";
			    src = pkgs.fetchurl {
			      url = "https://nginx.org/download/nginx-${version}.tar.gz";
			      sha256 = "sha256-11d8hj17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h";
			    };
			  });
			  ```
	- ## Custom C application Derivation (`stdenv.mkDerivation`)
		- Below is a custom derivation file configuration that packages a custom C application with patching and custom make flags:
		- ```nix
		  # File: default.nix
		  { stdenv, fetchFromGitHub }:
		  
		  stdenv.mkDerivation rec {
		    pname = "enterprise-auditor";
		    version = "1.0.0";
		  
		    # Fetch source from a GitHub repository
		    src = fetchFromGitHub {
		      owner = "VR-Rathod";
		      repo = "enterprise-auditor";
		      rev = "v${version}";
		      sha256 = "1h5n8dj17n8s9d18hj19dh18nS9d18hj18sh10d8hj17sn89d18j"; # Verify source hash integrity
		    };
		  
		    # Apply a local patch file before building
		    patches = [ ./fix-config-paths.patch ];
		  
		    # Custom make flags to inject prefix and options
		    makeFlags = [ "PREFIX=$(out)" "ENABLE_HARDENING=1" ];
		  
		    # Custom build phase overrides
		    buildPhase = ''
		      runHook preBuild
		      gcc -O3 -Wall -o auditor main.c
		      runHook postBuild
		    '';
		  
		    # Install phase: copy binary file output to store path bin directory
		    installPhase = ''
		      runHook preInstall
		      mkdir -p $out/bin
		      cp auditor $out/bin/enterprise-auditor
		      runHook postInstall
		    '';
		  
		    meta = {
		      description = "Custom enterprise system auditor binary for NixOS.";
		      homepage = "https://github.com/VR-Rathod/enterprise-auditor";
		      license = stdenv.lib.licenses.gpl3;
		    };
		  }
		  ```
	- ## Custom Rust Application Derivation (`buildRustPackage`)
		- Nixpkgs provides a specialized helper that handles fetching cargo registry caches:
		- ```nix
		  { lib, rustPlatform, fetchFromGitHub, pkg-config, openssl }:
		  
		  rustPlatform.buildRustPackage rec {
		    pname = "rust-agent-service";
		    version = "2.1.0";
		  
		    src = fetchFromGitHub {
		      owner = "VR-Rathod";
		      repo = "rust-agent-service";
		      rev = "v${version}";
		      sha256 = "17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h0000000";
		    };
		  
		    # SHA256 checksum of the cargo dependency tree lockfile state
		    cargoHash = "sha256-aB1c2D3e4F5g6H7i8J9k0L1m2N3o4P5q6R7s8T9u0Vw=";
		  
		    # Native build inputs are required during build time (e.g. compilers, pkg-config)
		    nativeBuildInputs = [ pkg-config ];
		  
		    # Build inputs are runtime dependencies linked into the binary
		    buildInputs = [ openssl ];
		  
		    meta = with lib; {
		      description = "Hardened background agent monitoring service written in Rust.";
		      license = licenses.mit;
		      maintainers = [ "VR-Rathod" ];
		    };
		  }
		  ```
	- ## Custom Go Application Derivation (`buildGoModule`)
		- Packages Go applications using modules vendor tree hashing verification:
		- ```nix
		  { lib, buildGoModule, fetchFromGitHub }:
		  
		  buildGoModule rec {
		    pname = "go-api-gateway";
		    version = "1.5.2";
		  
		    src = fetchFromGitHub {
		      owner = "VR-Rathod";
		      repo = "go-api-gateway";
		      rev = "v${version}";
		      sha256 = "11d8hj17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h";
		    };
		  
		    # Checksum of vendor dependencies (set to empty if vendors are included in repo)
		    vendorHash = "sha256-0h1s2d3f4g5h6j7k8l9m0n1p2q3r4s5t6u7v8w9x0y1=";
		  
		    # Build flags to inject binary configurations
		    ldflags = [
		      "-s" "-w"
		      "-X main.Version=${version}"
		      "-X main.Environment=production"
		    ];
		  
		    meta = with lib; {
		      description = "Declarative API gateway and load balancer written in Go.";
		      license = licenses.asl20;
		    };
		  }
		  ```
	- ## Custom Python Application Derivation (`buildPythonApplication`)
		- Packaging python command line scripts and modules with package dependencies:
		- ```nix
		  { lib, python3Packages, fetchFromGitHub }:
		  
		  python3Packages.buildPythonApplication rec {
		    pname = "python-sec-scanner";
		    version = "3.0.1";
		  
		    src = fetchFromGitHub {
		      owner = "VR-Rathod";
		      repo = "python-sec-scanner";
		      rev = "v${version}";
		      sha256 = "09dh18nS9d18hj18sh10d8hj17sn89d18jS0d19hj17sh82n19hj8";
		    };
		  
		    # Propagated runtime dependencies (injected into python sys.path automatically)
		    propagatedBuildInputs = with python3Packages; [
		      requests
		      beautifulsoup4
		      cryptography
		    ];
		  
		    # Disable execution of tests inside packaging check phase
		    doCheck = false;
		  
		    meta = with lib; {
		      description = "Declarative web penetration testing scanner written in Python.";
		      license = licenses.gpl3Only;
		    };
		  }
		  ```
	- ## Custom Node.js Derivation (`buildNpmPackage`)
		- Packaging Node applications using standard npm package caching engines:
		- ```nix
		  { lib, buildNpmPackage, fetchFromGitHub }:
		  
		  buildNpmPackage rec {
		    pname = "node-web-dashboard";
		    version = "4.2.0";
		  
		    src = fetchFromGitHub {
		      owner = "VR-Rathod";
		      repo = "node-web-dashboard";
		      rev = "v${version}";
		      sha256 = "sha256-11d8hj17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h";
		    };
		  
		    # SHA256 checksum of the package-lock.json dependency tree
		    npmDepsHash = "sha256-00d8hj17sn89d18jS0d19hj17sh82n19hj81n19sh82h281hs82h=";
		  
		    # Commands to run before running the build
		    preBuild = ''
		      echo "Setting Node environment to production"
		      export NODE_ENV=production
		    '';
		  
		    meta = with lib; {
		      description = "System resource and metrics monitoring dashboard written in Node.js.";
		      license = licenses.mit;
		    };
		  }
		  ```
- # DSA & System Design in NixOS Packages
  collapsed:: true
	- ## Dependency Graphs & Directed Acyclic Graphs (DAG)
		- The Nix package manager resolves builds and dependencies by representing packages as nodes inside a **Directed Acyclic Graph (DAG)**.
		- If package `A` depends on package `B`, a directed edge is drawn: `A -> B`.
		- The dependency graph cannot contain loops (cycles). If `A -> B -> C -> A` occurred, the compilation loop would prevent the build from completing.
		- Nix resolves dependency graphs by running a **Topological Sort** (such as Kahn's algorithm) to determine the exact sequential build order (e.g. building `C`, then `B`, then `A`).
		- ```
		  Package Dependency DAG representation:
		               [ Glibc (Build priority 1) ]
		                /                        \
		    [ OpenSSL (Priority 2) ]          [ LibXML (Priority 2) ]
		                \                        /
		               [ Curl Package (Priority 3) ]
		                /                        \
		    [ Git Package (Priority 4) ]       [ Nginx Package (Priority 4) ]
		  ```
	- ## Kahn's Topological Sort Algorithm Steps
		- Kahn's algorithm resolves build orders by tracking the in-degree of all packages in the DAG:
		- 1. **Compute In-Degrees**: Iterate through the graph and count the number of incoming dependency arrows for each package (in-degree).
		- 2. **Initialize Queue**: Find all packages with an in-degree of `0` (meaning they have zero uncompiled dependencies) and push them into a processing queue.
		- 3. **Process Nodes**:
			- Dequeue a package `P` from the queue.
			- Append `P` to the resolved build order array.
			- For each parent package `U` that depends on `P`, decrement `U`'s in-degree count by `1`.
			- If `U`'s in-degree drops to `0`, enqueue `U` immediately.
		- 4. **Detect Cycles**: If the size of the resolved build order array is less than the total number of packages, the graph contains a cyclic dependency cycle (loop), and compilation is aborted.
	- ## Cycle Detection using DFS and Recursion Stacks
		- To verify that a dependency tree contains no loops, Nix uses Depth First Search (DFS) traversal:
		- 1. Maintain a `visited` set to track processed nodes, and a `recStack` (recursion stack) set to track nodes in the current DFS path.
		- 2. For each node in the graph, if it has not been visited, invoke DFS recursively.
		- 3. In the DFS function, mark the current node as visited and add it to `recStack`.
		- 4. Traverse all adjacent edges. If an adjacent node is already in `recStack`, a cyclic back-edge has been found (a loop exists), so return true.
		- 5. After traversing all outgoing edges, remove the current node from `recStack`.
	- ## Database Internals and Reference Engine (db.sqlite)
		- Nix tracks the validity and relationships of store paths inside a local SQLite database located at `/nix/var/nix/db/db.sqlite`.
		- This database acts as the source of truth for the Nix garbage collector and store queries.
		- ### Database Schema Outline
			- ```
			  +--------------------+             +------------------+
			  |     ValidPaths     |             |       Refs       |
			  +--------------------+             +------------------+
			  | id (INTEGER PK)    |<-----+      | referrer (INT FK)|
			  | path (TEXT UNIQUE) |      +-----o| reference(INT FK)|
			  | hash (TEXT)        |             +------------------+
			  | registrationTime   |
			  | deriver (TEXT)     |
			  | narSize (INTEGER)  |
			  +--------------------+
			  ```
			- **ValidPaths**: Stores every directory path currently registered as valid within `/nix/store`.
			- **Refs**: Tracks references (edges) between paths. If `/nix/store/...-nginx` references `/nix/store/...-glibc`, this relationship is stored as an ID-pair row. The garbage collector reads this table to build a reference tree starting from system roots (like `/run/current-system`). Any store path not reachable from root nodes is considered dead and is deleted during GC runs.
	- ## Nix Garbage Collection Graph Search (Mark-and-Sweep)
		- Garbage collection runs in two phases:
		- 1. **Identify Roots**: Scan filesystems for GC roots. These are stored under `/nix/var/nix/gcroots/` and include symlinks from active user profiles, system generations, and development shells.
		- 2. **Recursive Traversal (Mark)**: Start DFS traverses from each identified GC root. Read `db.sqlite`'s `Refs` table to recursively follow references, marking all reached `/nix/store` paths as "alive".
		- 3. **Reclaim Space (Sweep)**: Compare the set of all physically present store paths in `/nix/store` with the marked alive set. Unmarked folders are physically removed from disk, freeing storage blocks.
	- ## Purely Functional System Storage Design Trade-offs
		- NixOS uses isolated, content-addressed paths instead of traditional stateful storage layers:
		- | Storage Architecture | File System Isolation | Upgrades Safety | Disk Space Overhead | Deployment Strategy |
		  |----------------------|-----------------------|-----------------|---------------------|---------------------|
		  | **Nix Store Layout** | Complete (isolated hash store paths) | 100% Safe (generations symlinks) | High (multiple version libraries kept) | Purely functional declarations |
		  | **Traditional Linux**| None (shared global libraries) | Low (overwrites active libs) | Minimal | Imperative updates (stateful) |
		  | **Container (Docker)**| Complete (namespaces namespaces) | Medium (image rebuilds) | Medium | Layered images cache (imperative base) |
	- ## Dependency Graph Topological Sort Simulation (C Program)
		- The program below simulates an advanced package builder resolving complex build order constraints.
		- It constructs a Directed Acyclic Graph (DAG) representing packages, performs a Depth First Search (DFS) to detect cyclic loops, and executes **Kahn's Topological Sort** algorithm using an explicit queue to determine compile order:
		- ```c
		  #include <stdio.h>
		  #include <stdlib.h>
		  #include <stdbool.h>
		  #include <string.h>
		  
		  #define MAX_PACKAGES 8
		  
		  // Node structure representing a dependency edge link in adjacency list
		  struct dep_node {
		      int package_id;
		      struct dep_node *next;
		  };
		  
		  // Graph structure tracking package relations
		  struct package_graph {
		      int num_packages;
		      struct dep_node *adj_list[MAX_PACKAGES];
		      int in_degree[MAX_PACKAGES]; // Count of incoming dependency arrows
		  };
		  
		  // Initialize package graph
		  struct package_graph *create_graph(int num) {
		      struct package_graph *g = (struct package_graph *)malloc(sizeof(struct package_graph));
		      g->num_packages = num;
		      for (int i = 0; i < num; i++) {
		          g->adj_list[i] = NULL;
		          g->in_degree[i] = 0;
		      }
		      return g;
		  }
		  
		  // Add a dependency: parent depends on child (child must compile first)
		  void add_dependency(struct package_graph *g, int parent, int child) {
		      struct dep_node *node = (struct dep_node *)malloc(sizeof(struct dep_node));
		      node->package_id = parent;
		      node->next = g->adj_list[child];
		      g->adj_list[child] = node;
		      g->in_degree[parent]++; // Parent has one more dependency block
		  }
		  
		  // Recursive utility to detect cycles using DFS
		  bool has_cycle_util(struct package_graph *g, int curr, bool visited[], bool rec_stack[]) {
		      if (!visited[curr]) {
		          visited[curr] = true;
		          rec_stack[curr] = true;
		          
		          struct dep_node *temp = g->adj_list[curr];
		          while (temp != NULL) {
		              int parent = temp->package_id;
		              if (!visited[parent] && has_cycle_util(g, parent, visited, rec_stack)) {
		                  return true;
		              } else if (rec_stack[parent]) {
		                  return true;
		              }
		              temp = temp->next;
		          }
		      }
		      rec_stack[curr] = false;
		      return false;
		  }
		  
		  // Check if graph has cyclic package loops
		  bool detect_cycle(struct package_graph *g) {
		      bool visited[MAX_PACKAGES];
		      bool rec_stack[MAX_PACKAGES];
		      for (int i = 0; i < g->num_packages; i++) {
		          visited[i] = false;
		          rec_stack[i] = false;
		      }
		      
		      for (int i = 0; i < g->num_packages; i++) {
		          if (has_cycle_util(g, i, visited, rec_stack)) {
		              return true;
		          }
		      }
		      return false;
		  }
		  
		  // Resolve compilation order using Kahn's Topological Sort algorithm
		  void resolve_build_order(struct package_graph *g, const char *names[]) {
		      int queue[MAX_PACKAGES];
		      int front = 0, rear = 0;
		      int build_order[MAX_PACKAGES];
		      int count = 0;
		      
		      printf("[INFO] Executing cycle checking routine...\n");
		      if (detect_cycle(g)) {
		          printf("[FATAL ERROR] Cyclic dependency loop detected in the Nix store configurations! Build aborted.\n");
		          return;
		      }
		      printf("[INFO] No cycle detected. Commencing Kahn's Topological Sort build order solver...\n");
		      
		      // 1. Find packages with zero dependencies (in-degree 0) and enqueue them
		      for (int i = 0; i < g->num_packages; i++) {
		          if (g->in_degree[i] == 0) {
		              queue[rear++] = i;
		          }
		      }
		      
		      // 2. Process queue: remove node, add to compile list, decrement children
		      while (front < rear) {
		          int curr = queue[front++];
		          build_order[count++] = curr;
		          
		          // Decrement in-degree for all parent packages depending on this compiled package
		          struct dep_node *temp = g->adj_list[curr];
		          while (temp != NULL) {
		              int parent = temp->package_id;
		              g->in_degree[parent]--;
		              
		              // If all dependencies are compiled (in-degree becomes 0), enqueue it
		              if (g->in_degree[parent] == 0) {
		                  queue[rear++] = parent;
		              }
		              temp = temp->next;
		          }
		      }
		      
		      // 3. Print the valid topological compile sequence
		      printf("\n=== RESOLVED SYSTEM BUILD ORDER ===\n");
		      for (int i = 0; i < count; i++) {
		          int idx = build_order[i];
		          if (idx >= 0 && idx < g->num_packages) {
		              printf("Stage %d: Compile and Register [ %s ] -> /nix/store/\n", i + 1, names[idx]);
		          }
		      }
		      printf("=== BUILD COMPLETED SUCCESSFULLY ===\n");
		  }
		  
		  // Free graph allocations
		  void free_graph(struct package_graph *g) {
		      for (int i = 0; i < g->num_packages; i++) {
		          struct dep_node *curr = g->adj_list[i];
		          while (curr != NULL) {
		              struct dep_node *temp = curr;
		              curr = curr->next;
		              free(temp);
		          }
		      }
		      free(g);
		  }
		  
		  int main() {
		      printf("=== NIX MULTI-TARGET DEPENDENCY RESOLUTION COMPILER ===\n");
		      
		      // Package names mapping
		      const char *packages[] = { "Glibc", "OpenSSL", "LibXML", "Curl", "Git", "Nginx", "Python", "App-Scanner" };
		      struct package_graph *g = create_graph(8);
		      
		      // Add dependency relationships:
		      // OpenSSL and LibXML depend on Glibc
		      add_dependency(g, 1, 0); // OpenSSL -> Glibc
		      add_dependency(g, 2, 0); // LibXML -> Glibc
		      
		      // Curl depends on OpenSSL and LibXML
		      add_dependency(g, 3, 1); // Curl -> OpenSSL
		      add_dependency(g, 3, 2); // Curl -> LibXML
		      
		      // Git and Nginx depend on Curl
		      add_dependency(g, 4, 3); // Git -> Curl
		      add_dependency(g, 5, 3); // Nginx -> Curl
		      
		      // Python depends on Glibc and OpenSSL
		      add_dependency(g, 6, 0); // Python -> Glibc
		      add_dependency(g, 6, 1); // Python -> OpenSSL
		      
		      // App-Scanner depends on Python and Git
		      add_dependency(g, 7, 6); // App-Scanner -> Python
		      add_dependency(g, 7, 4); // App-Scanner -> Git
		      
		      // Execute topological resolve
		      resolve_build_order(g, packages);
		      
		      free_graph(g);
		      return 0;
		  }
		  ```
- # More Learn
	- ## Github & Webs
		- [Official NixOS Project Page](https://nixos.org/) - Official downloads, security mirrors, news.
		- [NixOS Manual & Documentation](https://nixos.org/manual/nixos/stable/) - Comprehensive user and administrator configuration guides.
		- [NixOS Search Package Index](https://search.nixos.org/packages) - Database of over 100,000 package names and options.
		- [NixOS Official GitHub Repository](https://github.com/NixOS) - Nix codebase, Nixpkgs package tree.
		- [NixOS Community Wiki Portal](https://nixos.wiki/) - Community guides for hardware setups and Home Manager config structures.
		- [Zero to Nix Guide](https://zero-to-nix.com/) - A friendly entry point to learning Nix and Flakes step-by-step.
		- [Nix Pills Series](https://nixos.org/guides/nix-pills/) - The official low-level deep dive into Nix package manager internals.
	- ## Master Playlists YouTube
		- [NixOS Full Setup and Configuration Tutorials - Wil T](https://www.youtube.com/playlist?list=PL-sa24Y4qO1_wLwF8Vwex1r29v25wB2V1) - Video guides for configuring and using NixOS.
		- [NixOS Flakes and Functional Package Management - Libre Phoenix](https://www.youtube.com/@LibrePhoenix) - Deep dives into flakes structures, devShells, and Home Manager integrations.
		- [Functional Systems Configuration and Packaging - NixCon Lectures](https://www.youtube.com/@NixCon) - Masterclass lectures on NixOS internals and package dependency structures.
		- [Nix Expression Language Tutorial and Derivations - Jon Ringer](https://www.youtube.com/@jonringer) - Videos covering packaging recipes and compiling custom packages in Nix.