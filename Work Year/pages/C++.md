status:: later
priority:: A
category:: programming
started:: 2026-01-01

- ## 📘 Roadmap
	- REF - [C ++ Notes](https://github.com/VR-Rathod/Code-Note/blob/Admin/pages/C%2B%2B.md)
		- TODO Basics
			- ```C++
			  #include<iostream>
			  using namespace std;
			  int main(){
			      int num = 15; //Decimal
			      int num2 = 017; //octomal
			      int num3 = 0x0f; // Hexical
			      int num4 = 0b00001111; //Binary
			      
			      cout << "num :" << num << endl;
			      cout << "num 2: " << num2 <<endl;
			      cout << "num3 : " << num3 << endl;
			      cout << "num 4 : " << num4 <<endl;
			      return 0;
			  }
			  ```
			- ```c++ bytes
			  //short and long
			      short short_var {-32768} ; //  2 Bytes 
			      short int short_int {455} ; // 
			      signed short signed_short {122}; //
			      signed short int signed_short_int {-456}; // 
			      unsigned short int unsigned_short_int {456};
			      
			      int int_var {55} ; // 4 bytes
			      signed signed_var {66};//
			      signed int signed_int {77};//
			      unsigned int unsigned_int{77};
			      
			      long long_var {88}; // 4 OR 8 Bytes
			      long int long_int {33};
			      signed long signed_long {44};
			      signed long int signed_long_int {44};
			      unsigned long int unsigned_long_int{44};
			  
			      long long long_long {888};// 8 Bytes
			      long long int long_long_int {999};
			      signed long long signed_long_long {444};
			      signed long long int signed_long_long_int{1234};
			      unsigned long long int unsigned_long_long_int{1234};
			  
			  // Double Will Dvide
			  	double num {10}
			  	double num2 {}
			  
			  	res = { num / num2 } //will not give error, return (-/+ infinity)
			  	res = {num2 / num2 } // will give NaN
			  ```
		- TODO OOP
		- TODO STL
		- TODO Projects
		  id:: 695d0488-643b-43d5-be92-755d0892469e
		- TODO DSA
-
- ## 🧠 Notes
	-
		-
-
- ## ⏱ Time Spent
  id:: 695d0488-ebee-4e83-bfd8-00732faa2483
	- [[Jan 12th, 2026]] - 1: 30 Hour
		- Literal - Directly Stored in memory no need for variable
		- const - read Only, you can assign data to it (Not In memory level only c++/compiler level)
		- constexpr - That has potential to be evaluated in compile time
		-
	- [[Jan 13th, 2026]] - 1:30 Hour
	  id:: 6965dc49-2d73-49b7-a09b-aec0b4b266dc
		- Explicit Data Conversions -> convert Data [ int -> double, double -> int  ] [C++ Demo](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/07.ConversionsOverflowAndUnderflow/7.3ExplicitDataConversions)
		- Overflow and Underflow [C++ Demo](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/07.ConversionsOverflowAndUnderflow/7.4OverflowAndUnderflow)
		- Binary - [Print In Binary](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/08.BitwiseOperators/8.2PrintingIntegersInBinary)
		- Shift Operators - [Shift Ope](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/08.BitwiseOperators/8.3ShiftOperators)
			- value 0xff0u -> means F => 4(1) , F=> 4(1) , 0 => 4(0)
		- Mask - [Mask Bit](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/08.BitwiseOperators/8.6Masks)
		- Packing Color Information Using Mask - [Color Mask](- https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/08.BitwiseOperators/8.8PackingColorInformation)
		-
	- [[Jan 15th, 2026]] - 1:30 Hour
		- Variable Scope & Life TIme - [Demo](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/09.VariableLifetimeAndScope/9.2VariableScope)
		- Conditional Programing - If/Switch Concept
		- Short Circuit - [If 1 False Then not Compute next](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.5ShortCircuitEvaluation) (save compute Time)
		- Integral Logic Conditions - [Int -> Bool](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.6IntegralLogicConditions)
		- Ternary Operator - [Ternary Operators](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.7TernaryOperators)
		- ifConstexpr - [Allow This run at Compiletime](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.8IfConstexpr)
		- If With Initializer - [If With Initializer](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.9IfWithInitializer)
		- Switch With Initializer - [Initializer With switch](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.10SwitchWithInitializer)
		- VariableScopeRevisited - [If var not in else scope](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.11VariableScopeRevisited)
		- Switch Scope - [Show Scope In switch](https://github.com/rutura/The-C-20-Masterclass-Source-Code/tree/main/10.FlowControl/10.12SwitchScope)
		-
-
- # ⚜DSA
	- [[Problem Slove]] - Leet Code Problem Sloveing
	-