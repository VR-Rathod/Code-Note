---
seoTitle: eBPF – Complete Guide from Beginner to Expert
description: "Comprehensive eBPF reference covering architecture, BPF maps, program types, verifier, helpers, tracing, networking, security, XDP, TC, observability, and real-world production use cases."
keywords: "eBPF, extended Berkeley Packet Filter, BPF maps, XDP, TC filter, BPF verifier, kprobe, tracepoint, BPF CO-RE, libbpf, bpftrace, BCC, cilium, Falco, observability, Linux kernel, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: eBPF – Kernel Superpowers
treeTitle: OS - Linux Distros - eBPF
enableToc: true
---

> [!info] About This Page
> eBPF (extended Berkeley Packet Filter) lets you run sandboxed programs in the Linux kernel without changing kernel source code or loading kernel modules.
> See [[Linux Advanced]] for kernel internals, [[Cybersecurity]] for security context, [[Docker]] and [[Kubernetes]] for orchestration use cases.

- # What is eBPF?
  collapsed:: true
	- eBPF is a revolutionary technology that allows programs to run in a **privileged context inside the Linux kernel** — safely and efficiently — without modifying kernel source code or loading modules.
	- Originally BPF (Berkeley Packet Filter) was for network packet filtering (tcpdump). **eBPF** extended it to a full in-kernel virtual machine for **any kernel event**.
	-
	- ## Why eBPF is Revolutionary
		- | Traditional Approach | eBPF Approach |
		  |---------------------|---------------|
		  | Modify kernel source + recompile | Load program at runtime |
		  | Write kernel module (.ko) | Load verified bytecode |
		  | Risk system stability | Verifier guarantees safety |
		  | Need reboot to apply | Live, hot-load into running kernel |
		  | Generic overhead | Targeted, minimal overhead |
		- > [!tip] The Superpower
		  > eBPF gives you kernel-level visibility and control with **user-space safety guarantees**. This is why all major cloud providers, observability platforms (Datadog, New Relic), and security tools (Falco, Cilium) use it.
	-
	- ## eBPF Architecture Overview
		- ```mermaid
		  graph TD
		      User[\"👤 User Space\\neBPF Program (C/Rust)\"]
		      Compile[\"🔧 LLVM/Clang\\nCompile to BPF bytecode\"]
		      Load[\"📦 syscall: bpf()\\nLoad bytecode into kernel\"]
		      Verify[\"✅ BPF Verifier\\nSafety + correctness check\"]
		      JIT[\"⚡ JIT Compiler\\nBytecode → native machine code\"]
		      Hook[\"🪝 Attach to Hook\\nkprobe/tracepoint/XDP/TC/socket\"]
		      Trigger[\"🔥 Kernel Event fires\\nProgram executes in-kernel\"]
		      Maps[\"🗺️ BPF Maps\\nShared data: kernel ↔ user\"]
		      User --> Compile --> Load --> Verify --> JIT --> Hook --> Trigger
		      Trigger --> Maps
		      Maps --> User
		  ```
	-
	- ## eBPF vs Kernel Modules
		- | Feature | Kernel Module | eBPF |
		  |---------|--------------|------|
		  | Safety | Can crash kernel | Verifier prevents crashes |
		  | Portability | Kernel version dependent | CO-RE (compile once, run everywhere) |
		  | Load time | Requires insmod + possible reboot | Runtime, no reboot |
		  | Debugging | Difficult | bpftool, bpftrace, perf |
		  | Sandboxed | No | Yes — bounded loops, no memory corruption |
		  | Access | Full kernel access | Controlled via helpers |
- # BPF Virtual Machine
  collapsed:: true
	- ## Registers & ISA
		- eBPF has a **RISC-style 64-bit** instruction set.
		- | Register | Purpose |
		  |----------|---------|
		  | r0 | Return value from function calls and BPF program exit |
		  | r1–r5 | Arguments to BPF helper functions |
		  | r6–r9 | Callee-saved registers |
		  | r10 | Read-only frame pointer (stack pointer) |
		  | PC | Program counter (implicit) |
		-
	- ## Instruction Classes
		- | Class | Description |
		  |-------|-------------|
		  | BPF_LD / BPF_LDX | Load instructions |
		  | BPF_ST / BPF_STX | Store instructions |
		  | BPF_ALU / BPF_ALU64 | Arithmetic/logic operations |
		  | BPF_JMP / BPF_JMP32 | Jump instructions |
		  | BPF_CALL | Call BPF helper functions |
		  | BPF_EXIT | Exit program |
		-
	- ## BPF Verifier
		- The verifier is the **safety guardian** — it statically analyzes every program before loading.
		- ```mermaid
		  graph TD
		      Load[\"Load bytecode via bpf() syscall\"]
		      DAG[\"DAG Check\\nNo unreachable code\\nNo infinite loops\"]
		      State[\"State Machine Walk\\nSimulate all possible paths\"]
		      Bounds[\"Bounds Checking\\nNo out-of-bounds memory access\"]
		      Ptr[\"Pointer Tracking\\nNull checks before dereference\"]
		      Types[\"Type Checking\\nContext-specific type safety\"]
		      Accept[\"✅ Program Accepted\"]
		      Reject[\"❌ Program Rejected\"]
		      Load --> DAG --> State --> Bounds --> Ptr --> Types --> Accept
		      Bounds --> Reject
		      Ptr --> Reject
		  ```
		- | Verifier Rule | Why |
		  |--------------|-----|
		  | No unbounded loops (pre-5.3) | Prevents infinite loops |
		  | Bounded loops allowed (5.3+) | With proven termination |
		  | Stack limit: 512 bytes | Prevents stack overflow |
		  | Max instructions: 1M (BPF_COMPLEXITY_LIMIT) | Prevents analysis timeout |
		  | All memory accesses must be bounds-checked | No buffer overflows |
		  | Pointer arithmetic restricted | No kernel memory corruption |
- # BPF Maps
  collapsed:: true
	- BPF Maps are **key-value stores** shared between eBPF programs (kernel) and user space. The primary data channel.
	-
	- ## Map Types Reference
		- | Map Type | Description | Use Case |
		  |----------|-------------|----------|
		  | `BPF_MAP_TYPE_HASH` | Hash table | Counting events, per-IP tracking |
		  | `BPF_MAP_TYPE_ARRAY` | Fixed-size array, indexed by int | Latency histograms, counters |
		  | `BPF_MAP_TYPE_PERCPU_HASH` | Per-CPU hash — lock-free | High-frequency counters |
		  | `BPF_MAP_TYPE_PERCPU_ARRAY` | Per-CPU array — lock-free | Hot path metrics |
		  | `BPF_MAP_TYPE_LRU_HASH` | LRU eviction hash | Connection tracking |
		  | `BPF_MAP_TYPE_RINGBUF` | Ring buffer (recommended for events) | Event streaming to user space |
		  | `BPF_MAP_TYPE_PERF_EVENT_ARRAY` | Perf buffer (older) | Event streaming (legacy) |
		  | `BPF_MAP_TYPE_PROG_ARRAY` | Array of BPF programs | Tail calls / program dispatch |
		  | `BPF_MAP_TYPE_STACK_TRACE` | Stack traces | Profiling |
		  | `BPF_MAP_TYPE_SOCKHASH/SOCKMAP` | Socket maps | TCP redirection |
		  | `BPF_MAP_TYPE_CGROUP_*` | cgroup-based maps | Container-aware policies |
		  | `BPF_MAP_TYPE_BLOOM_FILTER` | Bloom filter | Fast membership testing |
		-
	- ## Map Operations (C API)
		- ```c title="BPF map operations — kernel side (CO-RE)"
		  // In eBPF program (kernel side)
		  struct {
		      __uint(type, BPF_MAP_TYPE_HASH);
		      __uint(max_entries, 10000);
		      __type(key, __u32);       // IPv4 address
		      __type(value, __u64);     // packet count
		  } pkt_count SEC(".maps");
		  
		  // Lookup
		  __u64 *count = bpf_map_lookup_elem(&pkt_count, &src_ip);
		  
		  // Update
		  __u64 new_count = (count ? *count : 0) + 1;
		  bpf_map_update_elem(&pkt_count, &src_ip, &new_count, BPF_ANY);
		  
		  // Delete
		  bpf_map_delete_elem(&pkt_count, &src_ip);
		  
		  // Atomic increment (per-CPU safe)
		  __sync_fetch_and_add(count, 1);
		  ```
		- ```python title="Map access from user space (BCC Python)"
		  from bcc import BPF
		  
		  b = BPF(src_file="program.c")
		  pkt_count = b["pkt_count"]
		  
		  # Read all entries
		  for ip, count in pkt_count.items():
		      print(f"IP: {socket.inet_ntoa(ip)} → {count.value} packets")
		  ```
	-
	- ## Ring Buffer (Recommended for Events)
		- > [!tip] Ring Buffer vs Perf Buffer
		  > Ring Buffer (`BPF_MAP_TYPE_RINGBUF`) is the **modern standard** (kernel 5.8+). It's more efficient — single allocation, variable-length records, no per-CPU overhead.
		- ```c title="Ring buffer usage"
		  struct event {
		      __u32 pid;
		      char comm[16];
		      __u64 bytes;
		  };
		  
		  struct {
		      __uint(type, BPF_MAP_TYPE_RINGBUF);
		      __uint(max_entries, 1 << 24);  // 16MB
		  } events SEC(".maps");
		  
		  // Reserve and submit event
		  struct event *e = bpf_ringbuf_reserve(&events, sizeof(*e), 0);
		  if (!e) return 0;
		  
		  e->pid = bpf_get_current_pid_tgid() >> 32;
		  bpf_get_current_comm(&e->comm, sizeof(e->comm));
		  e->bytes = bytes;
		  
		  bpf_ringbuf_submit(e, 0);
		  ```
- # eBPF Program Types
  collapsed:: true
	- ## Hook Points Overview
		- ```mermaid
		  graph LR
		      subgraph Tracing
		          KP[\"kprobe/kretprobe\\nKernel function entry/exit\"]
		          TP[\"tracepoint\\nStable kernel trace points\"]
		          UP[\"uprobe/uretprobe\\nUser space function tracing\"]
		          PERF[\"perf_event\\nHardware performance counters\"]
		          RAW[\"raw_tracepoint\\nLow-overhead tracepoints\"]
		      end
		      subgraph Networking
		          XDP[\"XDP\\nEarliest packet processing point\"]
		          TC[\"TC (Traffic Control)\\nIngress + Egress\"]
		          SOCK[\"Socket filter\\nPer-socket packet filter\"]
		          CGROUP[\"cgroup/skb\\nPer-cgroup network policy\"]
		          LWT[\"LWT\\nLightweight tunnel\"]
		          SK[\"sk_msg / sk_skb\\nSocket message redirect\"]
		      end
		      subgraph Security
		          LSM[\"LSM hooks\\nMandatory Access Control\"]
		          SECCOMP[\"seccomp-bpf\\nSyscall filtering\"]
		      end
		  ```
	-
	- ## Tracing Programs
		- ### kprobe / kretprobe
			- Attach to **any kernel function** at entry (kprobe) or exit (kretprobe).
			- ```c title="kprobe — trace sys_execve"
			  SEC("kprobe/do_sys_openat2")
			  int BPF_KPROBE(trace_openat, int dfd, const char __user *filename, 
			                 struct open_how *how)
			  {
			      char fname[256];
			      bpf_probe_read_user_str(fname, sizeof(fname), filename);
			      
			      bpf_printk("openat: %s\n", fname);
			      return 0;
			  }
			  ```
			- > [!warning] Stability
			  > kprobes are NOT stable — kernel function names can change between versions. Use tracepoints for stability.
		-
		- ### Tracepoints (Stable)
			- Tracepoints are **stable, versioned** trace points defined in kernel source.
			- ```bash title="List available tracepoints"
			  ls /sys/kernel/debug/tracing/events/syscalls/
			  ls /sys/kernel/debug/tracing/events/sched/
			  ls /sys/kernel/debug/tracing/events/net/
			  ```
			- ```c title="Tracepoint — trace process scheduling"
			  SEC("tp/sched/sched_process_exec")
			  int trace_exec(struct trace_event_raw_sched_process_exec *ctx)
			  {
			      char comm[16];
			      bpf_probe_read_kernel_str(comm, sizeof(comm), ctx->filename);
			      
			      __u32 pid = bpf_get_current_pid_tgid() >> 32;
			      bpf_printk("exec: pid=%d file=%s\n", pid, comm);
			      return 0;
			  }
			  ```
		-
		- ### uprobe — User Space Tracing
			- Attach to **user space functions** (application code, libraries).
			- ```c title="uprobe — trace SSL_read in OpenSSL"
			  SEC("uprobe//usr/lib/libssl.so:SSL_read")
			  int BPF_UPROBE(trace_ssl_read, void *ssl, void *buf, int num)
			  {
			      char data[256];
			      bpf_probe_read_user(data, sizeof(data), buf);
			      bpf_printk("SSL_read: %s\n", data);
			      return 0;
			  }
			  ```
			- > [!tip] Zero-Instrumentation Visibility
			  > With uprobes + OpenSSL tracing, you can capture plaintext TLS data **without** modifying the application. This is how tools like `ssldump` and Pixie work.
	-
	- ## XDP — eXpress Data Path
		- XDP runs at the **absolute earliest point** in the network stack — on the NIC driver, before `sk_buff` allocation. This enables line-rate packet processing.
		- ```mermaid
		  graph LR
		      NIC[\"🌐 NIC receives packet\"]
		      XDP[\"⚡ XDP Program runs\\n(before SKB allocation)\"]
		      PASS[\"XDP_PASS → Normal kernel stack\"]
		      DROP[\"XDP_DROP → Discard (0 overhead)\"]
		      TX[\"XDP_TX → Retransmit out same NIC\"]
		      REDIR[\"XDP_REDIRECT → Send to another NIC/CPU\"]
		      ABORTED[\"XDP_ABORTED → Bug, drop with error\"]
		      NIC --> XDP
		      XDP --> PASS
		      XDP --> DROP
		      XDP --> TX
		      XDP --> REDIR
		      XDP --> ABORTED
		  ```
		- ```c title="XDP — drop packets from blacklisted IPs"
		  SEC("xdp")
		  int xdp_firewall(struct xdp_md *ctx)
		  {
		      void *data     = (void *)(long)ctx->data;
		      void *data_end = (void *)(long)ctx->data_end;
		      
		      struct ethhdr *eth = data;
		      if ((void *)(eth + 1) > data_end) return XDP_PASS;
		      if (eth->h_proto != bpf_htons(ETH_P_IP)) return XDP_PASS;
		      
		      struct iphdr *ip = (void *)(eth + 1);
		      if ((void *)(ip + 1) > data_end) return XDP_PASS;
		      
		      // Check blacklist map
		      __u32 src = ip->saddr;
		      __u32 *blocked = bpf_map_lookup_elem(&blacklist, &src);
		      if (blocked) return XDP_DROP;  // Line-rate drop!
		      
		      return XDP_PASS;
		  }
		  ```
		- | XDP Mode | Description | Performance |
		  |----------|-------------|-------------|
		  | Native (driver) | Runs in NIC driver NAPI poll | Fastest — pre-SKB |
		  | Offloaded | Runs on NIC SmartNIC firmware | Ultra-fast, requires smart NIC |
		  | Generic (skb) | Runs after SKB allocation | Slowest, works on all drivers |
		-
	- ## TC — Traffic Control
		- TC (Traffic Control) runs **after** the network stack — it can read and modify `sk_buff`, giving access to more context than XDP.
		- ```c title="TC — add latency label to outgoing packets"
		  SEC("tc")
		  int tc_egress(struct __sk_buff *skb)
		  {
		      void *data     = (void *)(long)skb->data;
		      void *data_end = (void *)(long)skb->data_end;
		      
		      struct iphdr *ip = data + sizeof(struct ethhdr);
		      if ((void *)(ip + 1) > data_end) return TC_ACT_OK;
		      
		      // Mark packet for DSCP QoS
		      ip->tos = (ip->tos & 0x03) | (46 << 2);  // EF PHB
		      return TC_ACT_OK;
		  }
		  ```
- # BPF CO-RE (Compile Once, Run Everywhere)
  collapsed:: true
	- > [!info] The Portability Problem
	  > Kernel data structure layouts differ between versions. CO-RE solves this — compile once, relocate at load time.
	-
	- ## CO-RE Architecture
		- ```mermaid
		  graph LR
		      Src[\"eBPF Source (C)\"]
		      BTF_H[\"vmlinux.h\\n(all kernel types)\"]
		      LLVM[\"Clang + LLVM\\nCompile with BTF info\"]
		      OBJ[\"BPF object (.o)\\n+ BTF relocation records\"]
		      libbpf[\"libbpf loader\\nRelocates based on runtime BTF\"]
		      Kernel[\"Running kernel BTF\"]
		      Kernel --> libbpf
		      Src --> LLVM
		      BTF_H --> LLVM
		      LLVM --> OBJ --> libbpf
		  ```
		- ```bash title="Generate vmlinux.h (BTF type headers)"
		  # On target machine
		  bpftool btf dump file /sys/kernel/btf/vmlinux format c > vmlinux.h
		  ```
		- ```c title="CO-RE access to kernel struct fields"
		  // Safe CO-RE field access — handles struct layout differences
		  #include "vmlinux.h"
		  #include <bpf/bpf_core_read.h>
		  
		  SEC("kprobe/tcp_v4_connect")
		  int trace_connect(struct pt_regs *ctx)
		  {
		      struct sock *sk = (struct sock *)PT_REGS_PARM1(ctx);
		      
		      // CO-RE safe read — works across kernel versions
		      __u16 dport = BPF_CORE_READ(sk, __sk_common.skc_dport);
		      __u32 daddr = BPF_CORE_READ(sk, __sk_common.skc_daddr);
		      
		      bpf_printk("tcp_connect: %x:%d\n", daddr, bpf_ntohs(dport));
		      return 0;
		  }
		  ```
- # BPF Helpers
  collapsed:: true
	- BPF programs can't call arbitrary kernel functions — only **approved BPF helpers**.
	-
	- ## Essential Helpers Reference
		- | Helper | Description |
		  |--------|-------------|
		  | `bpf_map_lookup_elem` | Look up key in map |
		  | `bpf_map_update_elem` | Update/insert key in map |
		  | `bpf_map_delete_elem` | Delete key from map |
		  | `bpf_probe_read_kernel` | Safe kernel memory read |
		  | `bpf_probe_read_user` | Safe user memory read |
		  | `bpf_probe_read_user_str` | Safe user string read |
		  | `bpf_get_current_pid_tgid` | Get current PID and TGID |
		  | `bpf_get_current_uid_gid` | Get current UID and GID |
		  | `bpf_get_current_comm` | Get current process name |
		  | `bpf_ktime_get_ns` | Get monotonic clock nanoseconds |
		  | `bpf_printk` | Debug print (→ /sys/kernel/debug/tracing/trace) |
		  | `bpf_tail_call` | Jump to another BPF program |
		  | `bpf_send_signal` | Send signal to current process |
		  | `bpf_override_return` | Override kprobe return value |
		  | `bpf_ringbuf_reserve` | Reserve ring buffer space |
		  | `bpf_ringbuf_submit` | Submit ring buffer record |
		  | `bpf_sk_redirect_map` | Redirect socket to sockmap |
		  | `bpf_xdp_adjust_head` | Adjust XDP packet head |
		  | `bpf_get_stackid` | Get current stack trace |
		  | `bpf_perf_event_output` | Output to perf buffer |
- # Development Toolchains
  collapsed:: true
	- ## libbpf + BPF Skeleton (Modern)
		- ```bash title="Project structure — libbpf skeleton"
		  project/
		  ├── vmlinux.h          # auto-generated kernel types
		  ├── program.bpf.c      # eBPF kernel-side code
		  ├── program.c          # user-space loader + consumer
		  └── Makefile
		  ```
		- ```bash title="Build and load"
		  # Install dependencies
		  sudo apt install clang llvm libbpf-dev linux-headers-$(uname -r)
		  
		  # Compile eBPF program
		  clang -g -O2 -target bpf -D__TARGET_ARCH_x86 \
		        -I/usr/include/x86_64-linux-gnu \
		        -c program.bpf.c -o program.bpf.o
		  
		  # Generate skeleton header
		  bpftool gen skeleton program.bpf.o > program.skel.h
		  
		  # Compile user space
		  gcc -o program program.c -lbpf
		  ```
	-
	- ## BCC (BPF Compiler Collection)
		- BCC is a **Python + C** framework — great for rapid prototyping and one-liners.
		- ```python title="BCC Python — trace process executions"
		  from bcc import BPF
		  
		  prog = r"""
		  #include <uapi/linux/ptrace.h>
		  #include <linux/sched.h>
		  
		  BPF_PERF_OUTPUT(events);
		  
		  struct data_t {
		      u32  pid;
		      char comm[TASK_COMM_LEN];
		      char filename[256];
		  };
		  
		  TRACEPOINT_PROBE(syscalls, sys_enter_execve) {
		      struct data_t data = {};
		      data.pid = bpf_get_current_pid_tgid() >> 32;
		      bpf_get_current_comm(&data.comm, sizeof(data.comm));
		      bpf_probe_read_user_str(data.filename, sizeof(data.filename), args->filename);
		      events.perf_submit(args, &data, sizeof(data));
		      return 0;
		  }
		  """
		  
		  b = BPF(text=prog)
		  
		  def print_event(cpu, data, size):
		      event = b["events"].event(data)
		      print(f"[{event.pid:6}] {event.comm.decode():20} exec: {event.filename.decode()}")
		  
		  b["events"].open_perf_buffer(print_event)
		  
		  print("Tracing execve... Ctrl+C to stop.")
		  while True:
		      b.perf_buffer_poll()
		  ```
	-
	- ## bpftrace — eBPF One-Liners
		- bpftrace is an **AWK/DTrace-like language** for quick eBPF exploration.
		- ```bash title="bpftrace one-liners"
		  # Trace all execve syscalls
		  bpftrace -e 'tracepoint:syscalls:sys_enter_execve { printf("%s execve %s\n", comm, str(args->filename)); }'
		  
		  # Count syscalls per process
		  bpftrace -e 'tracepoint:raw_syscalls:sys_enter { @[comm] = count(); }'
		  
		  # Histogram of read() sizes
		  bpftrace -e 'tracepoint:syscalls:sys_exit_read /retval > 0/ { @bytes = hist(retval); }'
		  
		  # Disk I/O latency histogram
		  bpftrace -e 'kprobe:blk_account_io_start { @start[arg0] = nsecs; }
		  kprobe:blk_account_io_done /@start[arg0]/ {
		      @lat = hist((nsecs - @start[arg0]) / 1000);
		      delete(@start[arg0]);
		  }'
		  
		  # CPU profiling — stack traces every 99Hz
		  bpftrace -e 'profile:hz:99 { @[kstack] = count(); }'
		  
		  # TCP connection tracking
		  bpftrace -e 'kprobe:tcp_v4_connect { printf("connect: %s → %s\n", comm, ntop(arg1)); }'
		  
		  # Trace SSL/TLS plaintext (no app modification)
		  bpftrace -e 'uprobe:/usr/lib/libssl.so:SSL_write { printf("SSL write: %s\n", str(arg1)); }'
		  
		  # Memory allocation tracking
		  bpftrace -e 'uprobe:/usr/lib/libc.so:malloc { @allocs[comm] = sum(arg0); }'
		  ```
- # Observability Use Cases
  collapsed:: true
	- ## CPU Profiling with BPF
		- ```bash title="Flame graph generation"
		  # Install FlameGraph tools
		  git clone https://github.com/brendangregg/FlameGraph
		  
		  # Profile for 30 seconds
		  bpftrace -e 'profile:hz:99 { @[kstack, ustack] = count(); }' \
		      --no-warnings > /tmp/out.txt 30
		  
		  # Or use perf with BPF backend
		  perf record -F 99 -a -g -- sleep 30
		  perf script | stackcollapse-perf.pl | flamegraph.pl > flame.svg
		  ```
	-
	- ## Network Observability
		- ```bash title="Network one-liners"
		  # TCP connections with latency
		  bpftrace -e '
		  kprobe:tcp_v4_connect { @start[tid] = nsecs; }
		  kretprobe:tcp_v4_connect /@start[tid]/ {
		      printf("tcp_connect latency: %d us\n", (nsecs - @start[tid]) / 1000);
		      delete(@start[tid]);
		  }'
		  
		  # Top TCP talkers by bytes
		  bpftrace -e '
		  kprobe:tcp_sendmsg { @bytes[comm] += arg2; }
		  interval:s:5 { print(@bytes); clear(@bytes); }'
		  ```
	-
	- ## Production Tools Built on eBPF
		- | Tool | Purpose | eBPF Use |
		  |------|---------|---------|
		  | **Cilium** | Kubernetes CNI + security | XDP + TC for network policy |
		  | **Falco** | Runtime security | kprobe/tracepoint for syscall monitoring |
		  | **Pixie** | K8s observability | uprobes for zero-instrumentation tracing |
		  | **bcc/tools** | Linux perf tools | All hook types |
		  | **Katran** | Facebook L4 load balancer | XDP for line-rate LB |
		  | **Tetragon** | Security observability | Tracing + LSM |
		  | **Datadog Agent** | APM + infra monitoring | kprobes + uprobes |
		  | **Sysdig** | Container security | Syscall monitoring via tracepoints |
- # Security with eBPF
  collapsed:: true
	- ## LSM BPF — Linux Security Modules
		- eBPF programs can attach to **LSM hooks** to enforce fine-grained security policies.
		- ```c title="LSM BPF — block file writes from specific processes"
		  SEC("lsm/file_open")
		  int BPF_PROG(restrict_file_open, struct file *file)
		  {
		      char comm[16];
		      bpf_get_current_comm(comm, sizeof(comm));
		      
		      // Block "bad_proc" from opening /etc/passwd
		      if (__builtin_memcmp(comm, "bad_proc", 8) == 0) {
		          char filename[64];
		          bpf_probe_read_kernel_str(filename, sizeof(filename),
		                                   file->f_path.dentry->d_name.name);
		          if (__builtin_memcmp(filename, "passwd", 6) == 0)
		              return -EPERM;  // Deny access
		      }
		      return 0;
		  }
		  ```
	-
	- ## seccomp-bpf — Syscall Filtering
		- seccomp-bpf uses BPF (classic BPF) to filter syscalls per process.
		- ```c title="seccomp-bpf — allow only specific syscalls"
		  #include <linux/seccomp.h>
		  #include <linux/filter.h>
		  #include <sys/prctl.h>
		  
		  struct sock_filter filter[] = {
		      // Load syscall number
		      BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)),
		      // Allow read, write, exit
		      BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_read,  2, 0),
		      BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_write, 1, 0),
		      // Kill process on anything else
		      BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL),
		      BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
		  };
		  
		  prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog);
		  ```
		- > [!tip] Container Use
		  > Docker, containerd, and Kubernetes all use seccomp-bpf profiles to restrict container syscall access.
- # bpftool — eBPF Swiss Army Knife
  collapsed:: true
	- ```bash title="bpftool — inspect and manage eBPF objects"
	  # List loaded BPF programs
	  bpftool prog list
	  bpftool prog show id 42
	  
	  # Dump BPF program bytecode
	  bpftool prog dump xlated id 42
	  bpftool prog dump jited id 42      # JIT-compiled native code
	  
	  # List all BPF maps
	  bpftool map list
	  bpftool map show id 10
	  bpftool map dump id 10             # dump all map entries
	  
	  # Lookup map entry
	  bpftool map lookup id 10 key 01 00 00 00
	  
	  # Update map entry
	  bpftool map update id 10 key 01 00 00 00 value 01 00 00 00
	  
	  # Show BTF types
	  bpftool btf list
	  bpftool btf dump id 1
	  
	  # Pin/unpin programs to filesystem
	  bpftool prog pin id 42 /sys/fs/bpf/my_program
	  
	  # Generate skeleton
	  bpftool gen skeleton program.bpf.o > program.skel.h
	  
	  # Show BPF network attachments
	  bpftool net list
	  
	  # Profile BPF program performance
	  bpftool prog profile id 42 duration 5 cycles instructions l1dcache-misses
	  ```
- # More Learn
	- ## Docs & Books
		- [BPF Performance Tools — Brendan Gregg](https://www.brendangregg.com/bpf-performance-tools-book.html) — The bible of eBPF observability.
		- [Linux Kernel BPF Documentation](https://www.kernel.org/doc/html/latest/bpf/) — Official kernel docs.
		- [libbpf-bootstrap](https://github.com/libbpf/libbpf-bootstrap) — Modern CO-RE project templates.
		- [The eBPF Book — Liz Rice](https://isovalent.com/ebpf/) — Free from Isovalent/Cilium team.
	-
	- ## Key Projects & Tools
		- [bcc/tools](https://github.com/iovisor/bcc/tree/master/tools) — 80+ ready-to-use eBPF tools.
		- [bpftrace](https://github.com/iovisor/bpftrace) — High-level tracing language.
		- [Cilium](https://cilium.io/) — eBPF-based Kubernetes networking + security.
		- [Falco](https://falco.org/) — eBPF-based runtime security.
		- [Tetragon](https://tetragon.io/) — eBPF security observability.
		-
	- ## Related Notes
		- [[Linux Advanced]] — Kernel internals, perf, system calls
		- [[Cybersecurity]] — Security context and use cases
		- [[Docker]] — Container security (seccomp profiles)
		- [[Kubernetes]] — Cilium CNI, network policies