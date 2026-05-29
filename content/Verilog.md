---
seoTitle: Verilog Reference – Hardware Description Language Syntax Guide
description: "Comprehensive Verilog HDL reference covering modules, ports, registers, wires, gates, assign statements, always blocks, FSM design, SystemVerilog extensions, and simulation testbenches."
keywords: "Verilog, HDL, hardware description, registers, wires, modules, always block, FPGA, ASIC, testbench, digital design, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: Verilog
---

- # History
	- **How**:
		- **Verilog** was designed by **Phil Moorby** and **Prabhu Goel** at Gateway Design Automation in **1984** as a proprietary hardware simulation language.
		- Gateway was acquired by Cadence Design Systems in 1990, which eventually opened Verilog to the public domain to counter the rising popularity of VHDL.
		- Standardized by the IEEE in 1995 as **IEEE 1364** (Verilog-95), and later updated to Verilog-2001 and Verilog-2005. It subsequently laid the foundation for **SystemVerilog**, which extends Verilog with verification capabilities.
	-
	- **Who**:
		- **Phil Moorby** (creator) and Cadence / IEEE committee.
	-
	- **Why**:
		- Developed to provide a concise, readable, C-like hardware description and simulation language for modeling electronic circuits and logic gates.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **C-like Syntax** — Easy to learn for programmers already familiar with C/C++ style control flow.
		- **Concise & Less Verbose** — Requires much less boilerplate code than VHDL (no separate entities/architectures or component declarations needed).
		- **Fast Simulation** — Simple event-driven semantic rules allow rapid simulation of complex circuits.
		- **System Tasks** — Standard system functions like `$display`, `$readmemh`, and `$finish` built directly into the language for debugging.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Weak Type Safety** — Weak compiler type checks allow implicit scaling or assignments between incompatible vectors without throwing errors.
		- **Unintended Latch Generation** — Forgetting to define an `else` branch or a default `case` in combinational code automatically synthesizes transparent latches, causing timing problems.
		- **Race Conditions** — Mixing blocking and non-blocking assignments incorrectly can produce simulation/synthesis mismatches.
	-
	- ## Remember Points
	  collapsed:: true
		- **Blocking (=) vs. Non-blocking (<=)** — Use blocking assignments for combinational logic. Use non-blocking assignments for sequential registers.
		- **Wires vs. Regs** — A `wire` represents physical copper connections (updated via `assign`). A `reg` represents a data holding variable (updated inside procedural blocks like `always`).
-
- # Basics
	- ## Module Declaration
		- ```verilog
		  // Modules are the primary building blocks in Verilog.
		  module and_gate (
		    input  a, // Input ports
		    input  b,
		    output y  // Output port
		  );
		  
		    // Continuous assignment (concurrent)
		    assign y = a & b;
		  
		  endmodule
		  ```
	-
	- ## Comment Syntax
		- ```verilog
		  // This is a single-line comment.
		  
		  /* This is a
		     multi-line comment block. */
		  ```
	-
	- ## Numeric Representation
		- ```verilog
		  // Format: [size]'[base][value]
		  // bases: b (binary), o (octal), d (decimal), h (hexadecimal)
		  
		  my_reg = 8'b1100_1010; // 8-bit binary (underscores allowed for readability)
		  my_reg = 8'hCA;        // 8-bit hex
		  my_reg = 32'd1000;     // 32-bit decimal
		  my_reg = 4'd5;         // 4-bit representation of 5 (0101)
		  ```
-
- # Data Types & Logic States
	- ## Four-Value Logic States
	  collapsed:: true
		- ```
		  State       Description
		  0           Logic low / False / Ground
		  1           Logic high / True / VCC
		  x or X      Unknown / Uninitialized logic value
		  z or Z      High-impedance / Open circuit / Tri-state
		  ```
	-
	- ## Nets and Variables
	  collapsed:: true
		- ```verilog
		  // 1. Wires (Net types) - physical connections, do not hold values
		  wire s1;
		  wire [7:0] bus; // 8-bit vector
		  
		  // 2. Registers (Variables) - hold values assigned in procedural blocks
		  reg clk;
		  reg [15:0] data_reg; // 16-bit register vector
		  
		  // 3. Integers - 32-bit signed helper variables (commonly loop counters)
		  integer i;
		  ```
-
- # Concurrent Statements
	- ## Continuous Assignment (`assign`)
	  collapsed:: true
		- ```verilog
		  //assign runs concurrently, instantly updating whenever RHS signals change
		  assign sum = a ^ b;
		  assign carry = a & b;
		  
		  // Conditional assignment (Mux)
		  assign out = (sel == 1'b1) ? in1 : in0;
		  ```
	-
	- ## Built-in Gate Primitives
	  collapsed:: true
		- ```verilog
		  // Verilog contains built-in primitives: and, or, xor, nand, nor, xnor, not, buf
		  // Syntax: gate_type instance_name (output, input1, input2, ...);
		  
		  and u1 (y, a, b); // Instantiates an AND gate
		  not u2 (inv_a, a); // Instantiates an inverter
		  ```
-
- # Gate-Level Modeling & Delays
	- ## Gate Propagation Delays
	  collapsed:: true
		- ```verilog
		  // Rise, Fall, and Turn-off delays can be specified for primitive gates
		  // Format: #(rise_delay, fall_delay, turn_off_delay)
		  
		  // Single delay value applies to all transitions
		  and #5 a1 (y_simple, a, b); -- 5 time units delay
		  
		  // Distinct rise and fall delays
		  or #(3, 4) o1 (y_diff, a, b); -- rise=3, fall=4
		  
		  // Distinct rise, fall, and decay/turn-off delays
		  bufif0 #(2, 3, 4) b1 (out_tri, in, control);
		  ```
	-
	- ## Net Delays
	  collapsed:: true
		- ```verilog
		  // Delays can also be associated with net declarations
		  wire #3 wire_delayed;
		  assign wire_delayed = input_signal; -- Updates after 3 time units
		  ```
-
- # User-Defined Primitives (UDP)
	- ## Combinational UDPs
	  collapsed:: true
		- ```verilog
		  // UDPs are defined outside module blocks, establishing truth tables
		  primitive multiplexer_udp (out, control, in0, in1);
		    output out;
		    input control, in0, in1;
		    
		    table
		      // ctrl  in0  in1 : out
		         0      0    ?  :  0;
		         0      1    ?  :  1;
		         1      ?    0  :  0;
		         1      ?    1  :  1;
		         x      0    0  :  0;
		         x      1    1  :  1;
		    endtable
		  endprimitive
		  ```
	-
	- ## Sequential UDPs
	  collapsed:: true
		- ```verilog
		  // Sequential UDPs can model flip-flops and latches (require internal state column)
		  primitive d_flip_flop_udp (q, clk, d, rst);
		    output q;
		    reg q; -- Needs to be declared as register
		    input clk, d, rst;
		    
		    initialize
		      q = 0; -- Initial state
		      
		    table
		      // clk    d   rst : current_state : next_state
		          ?     ?    1  :       ?       :     0;     -- Async reset
		         (01)   0    0  :       ?       :     0;     -- Rising edge D=0
		         (01)   1    0  :       ?       :     1;     -- Rising edge D=1
		         (1?)   ?    0  :       ?       :     -;     -- Falling edge / no change
		          ?     ?    0  :       ?       :     -;     -- Clock stable / no change
		    endtable
		  endprimitive
		  ```
-
- # Generate Blocks (Verilog-2001)
	- ## Loop Generate
	  collapsed:: true
		- ```verilog
		  // Used to instantiate parameterized arrays of hardware elements
		  module vector_adder #(parameter SIZE = 8) (
		    input  [SIZE-1:0] a, b,
		    output [SIZE-1:0] sum
		  );
		    
		    genvar i; -- Generate loop index variable (compile-time only)
		    
		    generate
		      for (i = 0; i < SIZE; i = i + 1) begin : add_loop
		        // Instantiates gates dynamically
		        xor u_xor (sum[i], a[i], b[i]);
		      end
		    endgenerate
		  
		  endmodule
		  ```
	-
	- ## Conditional Generate
	  collapsed:: true
		- ```verilog
		  // Generates alternative architectures depending on parameter settings
		  module multiplier_selector #(parameter USE_FAST = 1) (
		    input  [7:0] a, b,
		    output [15:0] prod
		  );
		  
		    generate
		      if (USE_FAST == 1) begin : fast_mult
		        assign prod = a * b; -- Hardware multipliers
		      end else begin : slow_mult
		        // Serial / shift-add logic component instantiation
		        serial_multiplier sm1 (.x(a), .y(b), .z(prod));
		      end
		    endgenerate
		  
		  endmodule
		  ```
-
- # Procedural Blocks
	- ## always Blocks
	  collapsed:: true
		- Procedural blocks trigger when variables in their sensitivity list change:
		- ```verilog
		  // 1. Combinational Always Block (sensitivity list '*' detects any input change)
		  always @(*) begin
		    y = a & b; // Blocking assignment for combinational logic
		  end
		  
		  // 2. Sequential Always Block (triggered by clock edges)
		  always @(posedge clk or posedge rst) begin
		    if (rst) begin
		      q <= 1'b0; // Non-blocking assignment for register reset
		    end else begin
		      q <= d;    // Non-blocking assignment for register state updates
		    end
		  end
		  ```
	-
	- ## initial Blocks
	  collapsed:: true
		- ```verilog
		  // initial blocks execute once at time 0 (used for simulation setups, non-synthesizable)
		  initial begin
		    clk = 0;
		    rst = 1;
		    #20 rst = 0; // wait 20 time units, then clear reset
		  end
		  ```
-
- # Blocking (=) vs. Non-Blocking (<=)
	- ## Execution Semantics
	  collapsed:: true
		- ```verilog
		  // 1. Blocking (=) - Executes sequentially, blocking subsequent lines until evaluated
		  // Used exclusively for combinational logic
		  always @(*) begin
		    temp = a ^ b;
		    sum  = temp ^ c; // temp is updated before sum is evaluated
		  end
		  
		  // 2. Non-Blocking (<=) - Evaluates RHS instantly, schedules LHS updates at end of timestep
		  // Used exclusively for sequential registers (prevents race conditions)
		  always @(posedge clk) begin
		    r1 <= in_data;
		    r2 <= r1; // r2 gets OLD value of r1 before it updates! (proper shift register)
		  end
		  ```
-
- # Conditional Statements
	- ## if-else
	  collapsed:: true
		- ```verilog
		  // Must be placed inside procedural blocks (always/initial)
		  always @(*) begin
		    if (sel == 2'b00)
		      out = in0;
		    else if (sel == 2'b01)
		      out = in1;
		    else
		      out = 1'b0; // Always include final else to prevent latch synthesis!
		  end
		  ```
	-
	- ## Case Statements (case, casez, casex)
	  collapsed:: true
		- ```verilog
		  // case: exact bit matches (0, 1, x, z)
		  // casez: treats 'z'/'?' bits as don't-care values
		  // casex: treats both 'x' and 'z' bits as don't-care values (use with caution)
		  
		  always @(*) begin
		    casez (decoder_input)
		      4'b1??? : out_select = 2'b11; -- matches any 4-bit starting with 1
		      4'b01?? : out_select = 2'b10;
		      4'b001? : out_select = 2'b01;
		      default : out_select = 2'b00;
		    endcase
		  end
		  ```
-
- # Functions & Tasks
	- ## Functions
	  collapsed:: true
		- Functions are combinational helpers inside modules. They return a single value, execute without simulated time delays (no `#` or `@`), and cannot call tasks.
		- ```verilog
		  module calc_mod (
		    input  [7:0] data_in,
		    output [7:0] data_out
		  );
		  
		    // Function definition
		    function [7:0] compute_parity;
		      input [7:0] val;
		      begin
		        compute_parity = val ^ 8'hAA; -- Assignments set the return value
		      end
		    endfunction
		    
		    assign data_out = compute_parity(data_in);
		    
		  endmodule
		  ```
	-
	- ## Tasks
	  collapsed:: true
		- Tasks are procedural blocks that can execute with time delays, handle multiple input/output parameters, and do not return values directly.
		- ```verilog
		  module bus_driver (
		    input      clk,
		    output reg [7:0] bus,
		    output reg write_enable
		  );
		  
		    // Task definition (can contain delays and wait events)
		    task write_byte;
		      input [7:0] data;
		      begin
		        @(posedge clk);
		        write_enable = 1'b1;
		        bus = data;
		        @(posedge clk);
		        write_enable = 1'b0;
		      end
		    endtask
		    
		    initial begin
		      write_enable = 0;
		      bus = 8'h00;
		      #20;
		      write_byte(8'hFF); -- Call task
		    end
		  
		  endmodule
		  ```
-
- # Procedural Continuous Assignment
	- ## assign and deassign
	  collapsed:: true
		- ```verilog
		  // Overrides standard procedural assignments on register types
		  initial begin
		    #10 assign my_register = 8'h00; -- overrides any always-block assignments to my_register
		    #50 deassign my_register;       -- releases override control
		  end
		  ```
	-
	- ## force and release
	  collapsed:: true
		- ```verilog
		  // Can override net types (wires) and variables (registers) during simulation
		  initial begin
		    #10 force top_level.u1.wire_connection = 1'b1; -- Forces wire state
		    #50 release top_level.u1.wire_connection;       -- Releases simulation force
		  end
		  ```
-
- # Finite State Machines (FSM)
	- ## Two-Always-Block Design
	  collapsed:: true
		- ```verilog
		  module fsm_controller (
		    input clk, rst, start,
		    output reg ready
		  );
		    // State parameter definitions
		    parameter IDLE  = 2'b00;
		    parameter RUN   = 2'b01;
		    parameter DONE  = 2'b10;
		    
		    reg [1:0] state, next_state;
		    
		    // 1. Sequential Block: Update state registers
		    always @(posedge clk or posedge rst) begin
		      if (rst)
		        state <= IDLE;
		      else
		        state <= next_state;
		    end
		    
		    // 2. Combinational Block: Next state and output logic
		    always @(*) begin
		      next_state = state; // default state hold
		      ready = 1'b0;
		      
		      case (state)
		        IDLE : begin
		          if (start) next_state = RUN;
		        end
		        RUN  : begin
		          next_state = DONE;
		        end
		        DONE : begin
		          ready = 1'b1;
		          next_state = IDLE;
		        end
		        default : next_state = IDLE;
		      endcase
		    end
		  endmodule
		  ```
-
- # Structural Modeling
	- ## Module Instantiation
	  collapsed:: true
		- ```verilog
		  module top_module (
		    input  clk, reset,
		    input  data_in,
		    output data_out
		  );
		  
		    // Instantiation using named port connections (recommended)
		    fsm_controller my_fsm_inst (
		      .clk   (clk),      // .module_port(local_signal)
		      .rst   (reset),
		      .start (data_in),
		      .ready (data_out)
		    );
		  
		  endmodule
		  ```
-
- # Parameters
	- ## Modifiable Constants
	  collapsed:: true
		- ```verilog
		  module counter #(
		    parameter WIDTH = 8 // Default parameter value
		  ) (
		    input clk, rst,
		    output reg [WIDTH-1:0] count
		  );
		    always @(posedge clk or posedge rst) begin
		      if (rst) count <= 0;
		      else count <= count + 1;
		    end
		  endmodule
		  
		  // Overriding parameters in parent module:
		  // counter #(.WIDTH(16)) my_16bit_counter (.clk(clk), .rst(rst), .count(c));
		  ```
-
- # Memory Modeling
	- ## RAM & ROM Arrays
	  collapsed:: true
		- ```verilog
		  // Declaring arrays: reg [data_bits] name [address_range]
		  reg [7:0] ram_memory [0:255]; -- 256 bytes memory depth
		  
		  // Read operations (synchronous or asynchronous)
		  assign read_data = ram_memory[read_address];
		  
		  // Write operations (synchronous)
		  always @(posedge clk) begin
		    if (write_enable)
		      ram_memory[write_address] <= write_data;
		  end
		  ```
-
- # Compiler Directives
	- ## Directives & timescale
	  collapsed:: true
		- ```verilog
		  `timescale 1ns / 1ps // Time unit / precision
		  
		  `define WIDTH 8 // Macro definition
		  
		  `ifdef SIMULATION
		    // Code compiled only for simulation tests
		  `else
		    // Code compiled for synthesis hardware
		  `endif
		  
		  `include "my_defines.v" // File inclusion
		  ```
-
- # Synthesis Guidelines & Common Pitfalls
	- ## Unintended Latches
	  collapsed:: true
		- Latches are generated when a combinational path does not define updates for all possible conditions.
		- ```verilog
		  // LATCH GENERATED (BAD PRACTICE):
		  always @(*) begin
		    if (enable)
		      out = data;
		    // Missing else branch! out retains value, generating a latch
		  end
		  
		  // CORRECT SYNTAX (NO LATCHES):
		  always @(*) begin
		    out = 1'b0; -- Default assignment
		    if (enable)
		      out = data;
		  end
		  ```
	-
	- ## Simulation vs. Synthesis Mismatch
	  collapsed:: true
		- Avoid writing non-synthesizable commands in production module logic:
		- ```verilog
		  // Non-synthesizable constructs:
		  // #delay, initial blocks, fork-join, $display, $time, event triggering (->)
		  
		  // Synthesis tools ignore delays:
		  #5 out = data; -- Synthesizes exactly like: out = data;
		  ```
-
- # SystemVerilog Extensions Overview
	- ## Key Upgrades from Classic Verilog
	  collapsed:: true
		- SystemVerilog solves Verilog's weak typing and loose structure restrictions:
		- ```
		  Verilog Construct      SystemVerilog Extension   Description
		  wire / reg             logic                     Unified type (automates wire/reg decision)
		  always @(*)            always_comb               Enforces combinational logic checking
		  always @(posedge clk)  always_ff @(posedge clk)  Enforces register execution logic check
		  parameter              localparam / const        Strong const declarations
		  No native structs      struct packed { ... }     Enables custom C-like packed struct data
		  No interfaces          interface                 Groups bus lines to simplify wiring
		  ```
-
- # Testbenches & Simulation
	- ## Testbench Template
	  collapsed:: true
		- ```verilog
		  `timescale 1ns/1ps
		  
		  module tb_counter;
		    // 1. local test signals
		    reg clk;
		    reg rst;
		    wire [7:0] count;
		    
		    // 2. Instantiate Unit Under Test (UUT)
		    counter #(.WIDTH(8)) uut (
		      .clk(clk),
		      .rst(rst),
		      .count(count)
		    );
		    
		    // 3. Clock generator (toggles every 5ns -> 100MHz clock)
		    always #5 clk = ~clk;
		    
		    // 4. Stimulus process
		    initial begin
		      clk = 0;
		      rst = 1;
		      #15 rst = 0; // Clear reset
		      
		      #200; // run simulation for 200ns
		      
		      // System Tasks
		      $display("Final Counter Value: %d", count);
		      $finish; // End simulation
		    end
		    
		    // 5. Monitoring values in console
		    initial begin
		      $monitor("Time=%d ns, Reset=%b, Count=%d", $time, rst, count);
		    end
		  endmodule
		  ```
-
- # Useful System Tasks
	- ## Debugging functions
		- ```
		  System Task           Description
		  $display(...)         Prints string output once to console (similar to printf)
		  $monitor(...)         Prints string whenever any parameter value changes
		  $write(...)           Similar to $display but without trailing newline
		  $time                 Returns current simulation time
		  $random               Generates a random 32-bit signed integer
		  $readmemb("f.txt", m) Loads binary data from text file into memory array 'm'
		  $readmemh("f.txt", m) Loads hex data from text file into memory array 'm'
		  $finish               Stops simulator and exits execution
		  $stop                 Suspends simulator, opening interactive prompt
		  ```
-
- # More Learn
	- Explore valuable resources for Verilog:
		-
		- [ASIC-World (Comprehensive Verilog guides)](http://www.asic-world.com/)
		- [EDA Playground (Simulate Verilog online)](https://www.edaplayground.com/)
		- [IEEE 1364-2005 Standard Specs](https://ieeexplore.ieee.org/document/1620780)
		- [Verilog Roadmap](https://github.com/a-will/hardware-roadmap)
