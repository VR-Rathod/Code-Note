---
seoTitle: VHDL Reference – Hardware Description Language Syntax Guide
description: "VHDL reference covering entities, architectures, signals, processes, concurrent statements, testbenches, and FPGA synthesis for digital circuit design."
keywords: "VHDL, hardware description language, entity, architecture, signals, processes, testbench, FPGA, digital design, synthesis, concurrent statements, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: VHDL
---

- # History
	- **How**:
		- VHDL (VHSIC Hardware Description Language) is a hardware description language that was developed in the 1980s as part of the **VHSIC** (Very High-Speed Integrated Circuit) program initiated by the **U.S. Department of Defense**. The goal was to standardize the design process of digital systems and to provide a way to describe the structure and behavior of digital systems at a high level of abstraction.
		- VHDL was standardized by IEEE in 1987 (IEEE 1076-1987) and revised multiple times: VHDL-93, VHDL-2002, VHDL-2008, VHDL-2019.
		- Unlike standard software languages, VHDL describes concurrent operations mapping directly to hardware structures like logic gates, multiplexers, and flip-flops.
	-
	- **Who**:
		- Developed under the U.S. Department of Defense, standardized by the IEEE.
	-
	- **Why**:
		- VHDL was created to model digital systems and provide a standard for electronic design automation (EDA).
		- To verify the functionality of hardware designs before actual silicon implementation, saving millions in design cycles.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Highly Concurrent** — Naturally models parallel executions occurring in physical silicon hardware.
		- **Strong Typing** — Prevents design defects early with strict compile-time type validation (e.g. preventing adding boolean to std_logic_vector without conversion).
		- **High Reusability** — Easily parameterizes hardware bit-widths and architectures using **Generics**.
		- **Vendor Independent** — Standard hardware description runs across any target hardware (Xilinx/AMD, Intel/Altera, Microchip) and compilers.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Verbosity** — Requires extensive boilerplate statements for declarations (Entity, Component, Signal declaration, Port Maps), leading to very long source files.
		- **Steep Learning Curve** — Requires a paradigm shift: thinking in parallel hardware logic gates instead of sequential CPU cycles.
		- **Strict Syntax Pitfalls** — Type mismatching and signal assignment scheduling are often confusing for software programmers.
	-
	- ## Remember Points
	  collapsed:: true
		- **Concurrent vs. Sequential** — Statements outside a `process` block execute concurrently. Statements inside a `process` block execute sequentially.
		- **Signals vs. Variables** — Signals update at the end of simulation cycles. Variables update immediately.
-
- # Basics
	- ## Library Declarations
		- ```vhdl
		  -- Standard library package declarations (required for standard logic types)
		  library IEEE;
		  use IEEE.STD_LOGIC_1164.ALL;
		  use IEEE.NUMERIC_STD.ALL; -- Recommended for arithmetic operations
		  ```
	-
	- ## Design Units: Entity & Architecture
		- ```vhdl
		  -- 1. Entity: Defines the external interface (I/O pins) of the component
		  entity AND_Gate is
		    port (
		      A : in  std_logic;
		      B : in  std_logic;
		      Y : out std_logic
		    );
		  end AND_Gate;
		  
		  -- 2. Architecture: Defines the internal implementation logic of the component
		  architecture Behavioral of AND_Gate is
		  begin
		    Y <= A and B; -- Concurrent signal assignment
		  end Behavioral;
		  ```
	-
	- ## Comments
		- ```vhdl
		  -- This is a single-line comment in VHDL.
		  -- VHDL does not support native multi-line comment blocks.
		  ```
-
- # Data Types
	- ## Standard Logic & Vector Types
	  collapsed:: true
		- ```vhdl
		  -- std_logic: 9-value logic type defined in IEEE 1164:
		  -- 'U' (Uninitialized), 'X' (Forced Unknown), '0' (Forced Low), '1' (Forced High)
		  -- 'Z' (High Impedance), 'W' (Weak Unknown), 'L' (Weak Low), 'H' (Weak High), '-' (Don't care)
		  
		  signal clk : std_logic := '0'; -- single bit
		  signal bus_data : std_logic_vector(7 downto 0); -- 8-bit bus (MSB to LSB order)
		  ```
	-
	- ## Numeric Types
	  collapsed:: true
		- ```vhdl
		  -- signed and unsigned types from numeric_std (support arithmetic)
		  signal count_uns : unsigned(3 downto 0) := "0000";
		  signal temp_sig  : signed(7 downto 0);
		  
		  -- integer (holds standard 32-bit integer range)
		  signal count_int : integer range 0 to 15 := 0;
		  ```
-
- # Signals, Variables & Constants
	- ## Execution context
	  collapsed:: true
		- ```vhdl
		  -- Signals: Hold values over time, updated after delta-delays (at process boundary/suspension)
		  -- Variables: Used only inside PROCESS blocks, updated instantly (sequential context)
		  
		  architecture Dev of Test is
		    signal sig_a : integer := 0; -- Signal declared in architecture body
		  begin
		    process(clk)
		      variable var_b : integer := 0; -- Variable declared inside process
		    begin
		      if rising_edge(clk) then
		        var_b := var_b + 1; -- Assignment := updates var_b immediately
		        sig_a <= var_b;     -- Assignment <= schedules sig_a to update at end of process
		      end if;
		    end process;
		  end Dev;
		  ```
-
- # Concurrent Statements
	- ## Conditional Assignments (when-else)
	  collapsed:: true
		- ```vhdl
		  -- outside process: concurrent conditional signal assignment
		  Y <= A when (sel = '1') else B;
		  ```
	-
	- ## Selected Assignments (with-select)
	  collapsed:: true
		- ```vhdl
		  -- outside process: selected signal assignment
		  with sel select
		    Y <= A when "00",
		         B when "01",
		         C when others; -- default fallback (highly recommended to cover all 9 std_logic states)
		  ```
-
- # Sequential Statements
	- ## Processes & Sensitivity Lists
	  collapsed:: true
		- ```vhdl
		  -- Processes execute sequentially.
		  -- The sensitivity list controls when the process triggers.
		  process(A, B, sel) -- triggers if A, B, or sel changes
		  begin
		    if sel = '1' then
		      Y <= A;
		    else
		      Y <= B;
		    end if;
		  end process;
		  ```
	-
	- ## Case Statements
	  collapsed:: true
		- ```vhdl
		  process(sel)
		  begin
		    case sel is
		      when "00" => Y <= A;
		      when "01" => Y <= B;
		      when others => Y <= '0';
		    end case;
		  end process;
		  ```
	-
	- ## Sequential Loops
	  collapsed:: true
		- ```vhdl
		  -- For loops inside processes (unrolled by synthesis tools)
		  process(bus_data)
		    variable parity : std_logic := '0';
		  begin
		    parity := '0';
		    for i in 0 to 7 loop
		      parity := parity xor bus_data(i);
		    end loop;
		    y_parity <= parity;
		  end process;
		  ```
-
- # Finite State Machines (FSM)
	- ## Two-Process FSM Implementation
	  collapsed:: true
		- ```vhdl
		  architecture FSM_Arch of My_FSM is
		    type state_type is (IDLE, READ_STATE, WRITE_STATE);
		    signal current_state, next_state : state_type;
		  begin
		    -- 1. Sequential Process: State register updates on clock
		    state_reg: process(clk, reset)
		    begin
		      if reset = '1' then
		        current_state <= IDLE;
		      elsif rising_edge(clk) then
		        current_state <= next_state;
		      end if;
		    end process;
		    
		    -- 2. Combinational Process: Next state logic and outputs
		    comb_logic: process(current_state, start_btn)
		    begin
		      case current_state is
		        when IDLE =>
		          if start_btn = '1' then
		            next_state <= READ_STATE;
		          else
		            next_state <= IDLE;
		          end if;
		        when READ_STATE =>
		          next_state <= WRITE_STATE;
		        when WRITE_STATE =>
		          next_state <= IDLE;
		        when others =>
		          next_state <= IDLE;
		      end case;
		    end process;
		  end FSM_Arch;
		  ```
-
- # Structural Modeling
	- ## Component Declaration & Instantiation
	  collapsed:: true
		- ```vhdl
		  architecture Structural of TopLevel is
		    -- Declare sub-component interface
		    component AND_Gate is
		      port (
		        A, B : in  std_logic;
		        Y    : out std_logic
		      );
		    end component;
		    
		    signal s1, s2 : std_logic;
		  begin
		    -- Instantiate sub-component (named port mapping)
		    U1 : AND_Gate
		      port map (
		        A => s1,
		        B => s2,
		        Y => out_pin
		      );
		  end Structural;
		  ```
-
- # Generics
	- ## Parameterized Bit Widths
	  collapsed:: true
		- ```vhdl
		  -- Generics parameterize design sizes (compiled before logic instantiation)
		  entity N_Bit_Register is
		    generic (
		      N : integer := 8 -- Default width is 8-bit
		    );
		    port (
		      clk  : in  std_logic;
		      d_in : in  std_logic_vector(N-1 downto 0);
		      q_out: out std_logic_vector(N-1 downto 0)
		    );
		  end N_Bit_Register;
		  
		  -- Instantiating parameterized components:
		  -- U_Reg : N_Bit_Register generic map(N => 16) port map(clk, d, q);
		  ```
-
- # Testbenches
	- ## Simulation Structure
	  collapsed:: true
		- ```vhdl
		  -- Testbenches have no external ports (empty entity)
		  entity tb_AND_Gate is
		  end tb_AND_Gate;
		  
		  architecture Simulation of tb_AND_Gate is
		    -- 1. Component declaration
		    component AND_Gate is
		      port (A, B : in std_logic; Y : out std_logic);
		    end component;
		    
		    -- 2. Signal declarations
		    signal tb_A, tb_B, tb_Y : std_logic := '0';
		  begin
		    -- 3. Unit Under Test (UUT) instantiation
		    UUT: AND_Gate port map (A => tb_A, B => tb_B, Y => tb_Y);
		    
		    -- 4. Stimulus process
		    stim_proc: process
		    begin
		      tb_A <= '0'; tb_B <= '0'; wait for 10 ns;
		      assert tb_Y = '0' report "Error: 00 failed" severity error;
		      
		      tb_A <= '1'; tb_B <= '1'; wait for 10 ns;
		      assert tb_Y = '1' report "Error: 11 failed" severity failure;
		      
		      wait; -- Suspends process indefinitely (stops simulation)
		    end process;
		  end Simulation;
		  ```
-
- # Useful Packages & Functions
	- ## Type Conversions
	  collapsed:: true
		- ```vhdl
		  -- Std_logic_vector to unsigned
		  signal u_val : unsigned(7 downto 0);
		  u_val <= unsigned(bus_data);
		  
		  -- Unsigned to integer
		  signal int_val : integer;
		  int_val <= to_integer(u_val);
		  
		  -- Integer to unsigned/signed (requires output width size argument)
		  u_val <= to_unsigned(15, 8); -- converts integer 15 to 8-bit unsigned vector
		  ```
-
- # More Learn
	- Explore valuable resources for VHDL:
		-
		- [Sigasi VHDL Tutorials](https://sigasi.com/tutorials/)
		- [EDA Playground (Free Web Simulation)](https://www.edaplayground.com/)
		- [GHDL (Open Source VHDL Simulator)](https://ghdl.github.io/ghdl/)
		- [VHDL Handbook](https://www.sandia.gov/app/uploads/sites/139/2021/04/vhdl_handbook.pdf)