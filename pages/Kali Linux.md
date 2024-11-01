# History
collapsed:: true
	- This is Backtrack replacement
	- Backtrack Was powerfull tool Used for Successful penetration Testing
	- Kali linux is revamp version of Backtrack
	- This Support more than 600 tools
	- Developed By Mati Aharoni and Devon Kearns Of Offensive Security(company)
	-
- # linux Distribuation
  collapsed:: true
	- linux was source code
	- Kali linux was kernel
	- List of Some Distros(Distributions)
		- CentOS
		- ubuntu
		- redhat
		- debian
		- etc....
- # Root Password
	- restart -> click Kali advance -> Press E ->[ Find ro and Change to rw, add init=/bin/bash ] -> press Ctrl + X
	  logseq.order-list-type:: number
	- System will reboot
	  logseq.order-list-type:: number
	- Write [ passwd root ]
	  logseq.order-list-type:: number
	- {write New Password}
	  logseq.order-list-type:: number
	- exec /sbin/init -> press Enter
	  logseq.order-list-type:: number
	-
-
- # Linux Fundamental
	- ### KERNEL
		- The Kernel is a computer Program at The core Of a computer's Operating System With complete control Over everything in the system
		- Facilitates interactions Between Hardware And Software Components
		- It handles peripherals like Keyboards, Monitors , Printers and Speakers
		- Kernel is responsible for deciding Which memory each process Use
		- differant kernals in different OS : -
			- mac - XNU
			- windows - windows Nt kernel 10
			- android - Linux
		- File Locations : -
			- windows - SYSTEM Files(c drive)/ Windows/System32/ntkernel.exe
			- Linux - # cd /boot -> vmlinuz-5.3.0-kali2-amd64
		-
	- ### Types Of KERNEL
		- Monolithic Kernel - Linux => every process controls By kernel
		- Microkernel => User Space(system memory for application) and Kernel Space divide , Small
		- Hybrid Kernel - Windows => mixture Both Kernel
	-
	- ### SHELL
		- Shell and Kernel are Parts of Operating Systems
		- user gives command -> Request will goes to the Shell (user can't directly asses kernel)
		- Shell is like translator convert user language to Kernel language (human lag -> machine lag)
		- Shell provide Environment to run script and command
		- .
		- #### Types Of Shell
			- Borne Shell - Unix => Write in c , /bin/sh is default prompt
			- Bash Shell -linux => advance of Borne Shell , $ is default prompt
			- C shell => Fully Base on C ,% is default promt
	-
	- ### Linux File System hierarchy
		- Filesystem Hierarchy Standard(FHS) started in 1993
		- Goal was to come to consensus on How directories Should be organized and which files should be stored Where.
		- Files Information: -
			- ROOT -> [/bin , /boot , /dev , /etc , /home , /lib , /media , /mnt , /opt , /root , /sbin , /srv , /tmp , /usr , /var]
			- /root =>root User Home directories
			- /bin => all binarys , like exe files
			- /boot => booting imformation , kernel ,
			- /dev => all drivers and all hardwere files
			- /etc => users information/passwords/ groups .... main confiration files
			- /home => User home directories
			- /lib => contains shared lib images needed to boot system and run commands in root
			- /media => mount point for removable media , exra drive , cd , dvd (auto manage by system)
			- /mnt => same as media but temporarily , pen drive , card reader (we can manage manualy)
			- /opt => add-on application pakages
			- /sbin => Utilities used For System administration
			- /srv => site-specific data which is served by this system (apache http server )
			- /tmp => Temp Files
			- usr => user related data / applications and files used by users
			- /var => variable data files , This includes files , administrative and login data and temp files
			- /proc => contains Special Files That represent system and process Information
			- /lost+found => used got recovering files which are not Properly closed or Crashed
			- /run => contains system information data describing the system was booted
	-
	- ### Linux File Types
		- 7 types of File in Linux
			- - : regular file => most comman files (txt , mp4 ...)
			- d : directory => second most command (peripherals (keybord ,mouse)  )
			- c : characher device file => allows to communicate with hardware peripheral devices
			- b : block device file => -------^|^
			- s : local socket file => provide sockets communication between processes
			- p : named pipe => this pipe allow communication between two local processes.
			- i : symbolic link => 1 file redirect to 2 file
		-
		- File permission
			- r , w, x => read , write , exicute (4 , 2 , 1 ) = 7
			- chown {user} {filename} => file assign to user
			- chown : {group name} {filename} => assign New Group
			- chmod a=rwx {file name} => it will change all user permission
			- chmod u+rwx , go+rw {file name} => specifiy permission for user and group
			- strings {file path} => read binary files
	-
	- ### Command Lines
		- Open command line and code
		- Touch Command
		  logseq.order-list-type:: number
			- touch {file name.extenstion } => create singal file
			  logseq.order-list-type:: number
			- touch {file{1..5}.extention} => create multiple files
			  logseq.order-list-type:: number
			- touch -am {file name} => access last modification file time
			  logseq.order-list-type:: number
		- ls => for list
		  logseq.order-list-type:: number
		- ls -l => Show details
		  logseq.order-list-type:: number
		- file {file name } => show type of file
		  logseq.order-list-type:: number
		- rm => delete file
		  logseq.order-list-type:: number
		- cp => copy file
		  logseq.order-list-type:: number
		- mkdir => making file directory
		  logseq.order-list-type:: number
		- cd => for go in directory
		  logseq.order-list-type:: number
		- mv => move file 
		  logseq.order-list-type:: number
		- mv {file name} {rename file name} => rename file
		  logseq.order-list-type:: number
		- cat {file path} => view files
		  logseq.order-list-type:: number
			- head -{lines num} {path} => first specific number of line
			  logseq.order-list-type:: number
			- tail -{lines num} {path} => last specific numbers of line
			  logseq.order-list-type:: number
			- cat > {filename} => create , write file data
			  logseq.order-list-type:: number
			- cat > {filename} <<{stop/ any word} => write {stop/ any word} to close automatically
			  logseq.order-list-type:: number
			- cat echo => see that file
			  logseq.order-list-type:: number
		- clear => clear terminal
		  logseq.order-list-type:: number
		- cd {path} => change location
		  logseq.order-list-type:: number
			- cd ~ => This for User home directory
			  logseq.order-list-type:: number
			- cd .. => back parent dir
			  logseq.order-list-type:: number
		- pwd (print working directory) => show working directory
		  logseq.order-list-type:: number
		- man {command} => see full manual of command
		  logseq.order-list-type:: number
		- echo => show text in command line print
		  logseq.order-list-type:: number
		- echo > {filepath} => write and save path
		  logseq.order-list-type:: number
		- Special Keys Strokets : -
		  logseq.order-list-type:: number
			- Ctrl + A => moves cursor to beginning of the line
			  logseq.order-list-type:: number
			- Ctrl + B => moves cursor backward one character
			  logseq.order-list-type:: number
			- Ctrl + C => cancle current running command
			  logseq.order-list-type:: number
			- Ctrl + D => logs out current session
			  logseq.order-list-type:: number
			- Ctrl + E => move cursor and to the line
			  logseq.order-list-type:: number
			- Ctrl + F => Move cursor forward one character
			  logseq.order-list-type:: number
			- Ctrl + H => Erase one character/ backspace
			  logseq.order-list-type:: number
			- Ctrl + P => paste previous line
			  logseq.order-list-type:: number
			- Ctrl + R => Allows to search previously used command
			  logseq.order-list-type:: number
			- Ctrl + S => Stops all output on-screen
			  logseq.order-list-type:: number
			- Ctrl + Q => loses and application window
			  logseq.order-list-type:: number
			- Ctrl + U => Erases the complete line
			  logseq.order-list-type:: number
			- Ctrl + W => deletes The last word typed
			  logseq.order-list-type:: number
		-
		- #### Control opraters
			- ;    => This multiple command in ones
			- &   => it's run in background
			- && => it's check command was right or Not
			- hash/pung ( # ) => comments
			- history => show past cmd lines
			-
		- #### I/O Redirection
			- echo >> => this will not do over write in file
		- #### Filter and Pipes
			- | => pipe symbol used to 2 combine 2 cmd
			- grep => used to grep/ perticuler thing find
	- ## Vi - vim
	  collapsed:: true
		- This is basic text editer in kali
		- vim {name}.sh => sh for shell scripting
		- i => for insert in script
	-
	- ps => show all process
	- kill {process id} => terminate process id
	- kill -9 {p id} => kill forcefully
	-
	-
	- ## User / groups management
		- ### account types
			- root => all permission / super user
			- Service => for installation packages
			- User => normal for user
			- Group => manage multiple account
			- adduser => cmd for make user (fill all details)
			- useradd => also create user but Not Profile
			- userdel {username} => user will delete but not dir
			- userdel -rf {username} => This is delete forcefully
			-
			- 4 type of diretory
				- /etc/passwd => all user ac and pass info
				- /etc/shadow => encrypted password of the corresponding account
				- /etc/group => contains group info for each account
				- /etc/gshadow => secure group ac info (password)
			-
		-
		- ### Group
			- All info can see in => /etc/group | tail -n 2
			- 2 types of group
				- primary - autocreate when make new user
				  logseq.order-list-type:: number
				- secondary - This group manually manage
				  logseq.order-list-type:: number
			- groupadd {group name} => cmd for make new Group
			- usermod -g {group name} {username} => add user in 1 group
			- usermod -G {group number1} , {gn2} .... {username} => add 1 user in multiple Group
			-
	-
	-
- # Kali Tools
	- ### john
	  logseq.order-list-type:: number
		- This will unlock hash password
		  logseq.order-list-type:: number
		- used different strings patterns
		  logseq.order-list-type:: number
		- Faster in simple password
		  logseq.order-list-type:: number
	- HTT Track - EDU Only
	  logseq.order-list-type:: number
		- Download form Browser
		  logseq.order-list-type:: number
		- install
		  logseq.order-list-type:: number
		- This Will clone Internet website
		  logseq.order-list-type:: number
		- path => main drive /my website
		  logseq.order-list-type:: number