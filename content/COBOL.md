---
seoTitle: COBOL Reference – Mainframe Programming and Business Logic Guide
description: "Comprehensive COBOL reference covering fixed-format layout, divisions, PICTURE clauses, data levels, file handling, PERFORM loops, VSAM/DB2 mainframe integration, and JCL interfaces."
keywords: "COBOL, mainframe, IBM, JCL, VSAM, DB2, CICS, data levels, PICTURE clause, business logic, syntax reference, cheat sheet, VR-Rathod, Code-Note, code note vr, vr book"
displayTitle: COBOL
---

- # History
	- **How**:
		- **COBOL** (Common Business-Oriented Language) was created in **1959** by the **CODASYL** (Conference on Data Systems Languages) committee, heavily inspired by the pioneering work of **Rear Admiral Grace Hopper** (who developed Flow-Matic, the first English-like compiler).
		- The goal was to establish a portable, readable, and standardized programming language tailored specifically for business data processing (accounting, billing, and transactional ledger tracking).
		- Standardized by ANSI in 1968, and subsequently updated across major milestones: COBOL-74, COBOL-85 (which added structured programming like `END-IF`), COBOL-2002 (adding Object-Oriented structures), and COBOL-2014.
		- Today, COBOL remains the engine behind critical financial institutions, managing over 70% of global transaction processing on enterprise mainframes (IBM z/OS).
	-
	- **Who**:
		- **Grace Hopper** (technical advisor) and the **CODASYL** committee.
	-
	- **Why**:
		- Designed to provide a readable, machine-independent, English-like syntax optimized for complex decimal calculations and high-performance sequential file/record processing.
-
- # Introduction
	- ## Advantages
	  collapsed:: true
		- **Decimal Arithmetic Precision** — Avoids floating-point rounding errors (common in C/C++/Java binary floats) by performing exact math using packed decimal (`COMP-3`), which is critical for financial ledger books.
		- **Self-Documenting English-like Syntax** — High readability for non-programmers or business auditors, utilizing explicit keywords like `ADD`, `SUBTRACT`, and `PERFORM`.
		- **Massive Record I/O Throughput** — Designed from the ground up for reading and writing massive flat-file databases (sequential, relative, and indexed) on mainframe channels.
		- **Long-term Backward Compatibility** — Extremely stable; business logic code written in the 1970s runs seamlessly on modern IBM enterprise compilers.
	-
	- ## Disadvantages
	  collapsed:: true
		- **Extreme Verbosity** — Simple operations require multiline declarations across several required divisions.
		- **Fixed-Format Constraints** — Traditional fixed-format demands strict column alignment (historically derived from 80-column punch cards), causing compile failures for minor spacing errors.
		- **Lack of Modern Abstractions** — Missing templates, dynamic reflection, generics, and native pointer arithmetic.
		- **Dwindling Talent Pool** — The developer community is aging, making maintenance of legacy systems expensive.
	-
	- ## Remember Points
	  collapsed:: true
		- **Four Divisions are Required** — Every COBOL program must contain: Identification, Environment, Data, and Procedure divisions in strict order.
		- **Hierarchy Level Numbers** — Structural fields are grouped hierarchically using level numbers from `01` to `49`.
		- **Periods Terminate Units** — Periods (`.`) are critical syntax markers; missing or extra periods can alter control flows or trigger compiler crashes.
-
- # Fixed-Format Layout
	- ## Column Reference Guide
	  collapsed:: true
		- Mainframe compilation historically checks strict column rules (80-column cards format):
		- ```
		  Columns      Area Name        Description
		  1 - 6        Sequence Area    Used for card sequence numbers (frequently ignored by modern compilers)
		  7            Indicator Area   Determines line parsing behavior:
		                                '*' = Comment line
		                                '/' = Form feed (starts new page in printed listings)
		                                '-' = Continuation of previous line string literal
		                                'D' = Debugging line (active only if debugging mode is enabled)
		  8 - 11       Area A           Reserved for start of divisions, sections, paragraphs, and level 01 / 77
		  12 - 72      Area B           Reserved for executable statements, sentences, variables, and nested levels (02-49)
		  73 - 80      Program Name     Identification tags (ignored by compiler)
		  ```
-
- # Program Divisions
	- ## Structural Outline
		- Every program requires the following sequence:
		- ```cobol
		         IDENTIFICATION DIVISION.
		         PROGRAM-ID. HELLO-WORLD.
		         AUTHOR. VR RATHOD.
		  
		         ENVIRONMENT DIVISION.
		         CONFIGURATION SECTION.
		         INPUT-OUTPUT SECTION.
		         FILE-CONTROL.
		  --       (Links physical files on disk to logical descriptors)
		  
		         DATA DIVISION.
		         FILE SECTION.
		  --       (Defines layout of records read from/written to files)
		         WORKING-STORAGE SECTION.
		  --       (Declares program variables and storage constants)
		         LINKAGE SECTION.
		  --       (Declares arguments passed to this program by another calling routine)
		  
		         PROCEDURE DIVISION.
		         MAIN-PROCEDURE.
		             DISPLAY "Hello, Mainframe!".
		             STOP RUN.
		  ```
-
- # Data Representation
	- ## PICTURE (PIC) Clauses
	  collapsed:: true
		- PICTURE clauses define data storage formats using masks:
		- ```cobol
		  -- 9: Numeric character
		  -- A: Alphabetic character (A-Z, a-z)
		  -- X: Alphanumeric character (any symbol)
		  -- V: Implicit decimal point (not stored physically, used for math alignment)
		  -- S: Operational sign (stores + or - state)
		  
		  01  WS-AGE         PIC 9(3).       -- Stores 3-digit integer (e.g. 025)
		  01  WS-NAME        PIC X(20).      -- Stores 20-character string
		  01  WS-BALANCE     PIC S9(5)V99.   -- Stores signed float (+/- 12345.67)
		  ```
	-
	- ## Storage Formats (Usage Clauses)
	  collapsed:: true
		- ```cobol
		  -- DISPLAY (Default) - Stores values as raw ASCII/EBCDIC text (1 byte per char)
		  01  WS-TEXT        PIC 9(4) USAGE DISPLAY. -- Takes 4 bytes
		  
		  -- COMP (Computational) - Stores values as binary integers
		  01  WS-BIN-INT     PIC 9(4) USAGE COMP. -- Takes 2 bytes (16-bit integer)
		  
		  -- COMP-3 (Packed Decimal) - Stores 2 decimal digits per byte (using BCD) with a sign nibble
		  -- Highly recommended for financial balances to prevent decimal point rounding errors!
		  01  WS-CASH        PIC S9(7)V99 USAGE COMP-3. -- Takes 5 bytes
		  ```
	-
	- ## Hierarchy Level Numbers
	  collapsed:: true
		- Level numbers establish structured groupings:
		- ```cobol
		  -- 01: Group header level
		  -- 02 - 49: Nested element fields
		  -- 77: Independent variable (cannot contain subfields)
		  -- 88: Condition Name variable (defines boolean condition test cases)
		  
		  01  WS-USER-RECORD.
		      05  WS-USER-ID       PIC 9(5).
		      05  WS-USER-NAME.
		          10  WS-FIRST-NAME PIC X(10).
		          10  WS-LAST-NAME  PIC X(10).
		      05  WS-USER-STATUS   PIC X(1).
		          88  STATUS-ACTIVE   VALUE "A". -- True if WS-USER-STATUS is "A"
		          88  STATUS-BLOCKED  VALUE "B".
		          
		  77  WS-TEMP-COUNTER      PIC 9(4) VALUE 0.
		  ```
-
- # Control Flow & Subroutines
	- ## Conditionals: IF and EVALUATE
	  collapsed:: true
		- ```cobol
		  -- 1. IF-ELSE Statement (always close with END-IF in modern COBOL)
		  IF WS-AGE >= 18 THEN
		      DISPLAY "ADULT"
		  ELSE
		      DISPLAY "MINOR"
		  END-IF.
		  
		  -- Testing level-88 conditional variables
		  IF STATUS-ACTIVE THEN
		      DISPLAY "User is active"
		  END-IF.
		  
		  -- 2. EVALUATE (Switch-case equivalent)
		  EVALUATE WS-AGE
		      WHEN 0 THRU 12
		          DISPLAY "CHILD"
		      WHEN 13 THRU 19
		          DISPLAY "TEENAGER"
		      WHEN OTHER
		          DISPLAY "ADULT"
		  END-EVALUATE.
		  ```
	-
	- ## Loops & Paragraphs: PERFORM
	  collapsed:: true
		- In COBOL, code is organized into **Paragraphs** (labeled code blocks). `PERFORM` jumps to paragraphs or executes inline loops.
		- ```cobol
		  -- 1. Inline Loop
		  PERFORM VARYING WS-COUNTER FROM 1 BY 1 UNTIL WS-COUNTER > 5
		      DISPLAY "Count: " WS-COUNTER
		  END-PERFORM.
		  
		  -- 2. Out-of-line Paragraph execution
		  PERFORM PROCESS-DATA. -- Executes paragraph, then returns here
		  DISPLAY "Paragraph finished".
		  
		  -- Paragraph Definition (Start at Area A, statement ends with a period)
		  PROCESS-DATA.
		      DISPLAY "Processing ledger record...".
		      ADD 1 TO WS-RECORD-COUNT.
		  ```
-
- # Arithmetic Operations
	- ## Math Verbs vs COMPUTE
	  collapsed:: true
		- ```cobol
		  -- 1. Traditional Math Verbs
		  ADD 10 TO WS-TOTAL.
		  SUBTRACT WS-TAX FROM WS-SUBTOTAL GIVING WS-FINAL.
		  MULTIPLY WS-QTY BY WS-PRICE GIVING WS-RAW-TOTAL.
		  DIVIDE WS-SUM BY 5 GIVING WS-AVERAGE ROUNDED.
		  
		  -- 2. COMPUTE Statement (Supports algebraic formulas)
		  COMPUTE WS-FINAL = (WS-SUBTOTAL * (1 - WS-DISCOUNT)) + WS-TAX.
		  ```
-
- # File I/O Handling
	- ## Declaring and Processing Flat Files
	  collapsed:: true
		- ```cobol
		  ENVIRONMENT DIVISION.
		  INPUT-OUTPUT SECTION.
		  FILE-CONTROL.
		      -- Links logical file descriptors to physical disk dataset routes
		      SELECT CLIENT-FILE ASSIGN TO "clients.dat"
		      ORGANIZATION IS LINE SEQUENTIAL. -- Text file line separation
		  
		  DATA DIVISION.
		  FILE SECTION.
		  -- File Descriptor (FD) details record structures
		  FD  CLIENT-FILE.
		  01  CLIENT-RECORD.
		      05  CLIENT-ID       PIC 9(5).
		      05  CLIENT-NAME     PIC X(20).
		      05  CLIENT-BALANCE  PIC 9(5)V99.
		  
		  WORKING-STORAGE SECTION.
		  77  WS-EOF-FLAG         PIC X(1) VALUE "N".
		      88  END-OF-FILE                  VALUE "Y".
		  
		  PROCEDURE DIVISION.
		  MAIN-RUN.
		      OPEN INPUT CLIENT-FILE.
		      
		      -- Read loop
		      PERFORM UNTIL END-OF-FILE
		          READ CLIENT-FILE INTO CLIENT-RECORD
		              AT END
		                  MOVE "Y" TO WS-EOF-FLAG
		              NOT AT END
		                  DISPLAY "Client: " CLIENT-NAME " Bal: " CLIENT-BALANCE
		          END-READ
		      END-PERFORM.
		      
		      CLOSE CLIENT-FILE.
		      STOP RUN.
		  ```
-
- # Subprograms & Linkage
	- ## Passing Data Between Programs
	  collapsed:: true
		- Subprograms read parameters using the `LINKAGE SECTION`.
		- ```cobol
		  -- CALLED-SUB.cbl (Subprogram)
		  IDENTIFICATION DIVISION.
		  PROGRAM-ID. CALLED-SUB.
		  
		  DATA DIVISION.
		  LINKAGE SECTION.
		  -- Maps to memory location passed by calling program
		  01  LK-PARAMS.
		      05  LK-NUM1       PIC 9(2).
		      05  LK-NUM2       PIC 9(2).
		      05  LK-RESULT     PIC 9(4).
		  
		  PROCEDURE DIVISION USING LK-PARAMS.
		      COMPUTE LK-RESULT = LK-NUM1 * LK-NUM2.
		      EXIT PROGRAM. -- Returns control back to caller
		  ```
		- Caller invocation:
		- ```cobol
		  -- Calling program execution
		  WORKING-STORAGE SECTION.
		  01  WS-MATH-BLOCK.
		      05  WS-X          PIC 9(2) VALUE 12.
		      05  WS-Y          PIC 9(2) VALUE 05.
		      05  WS-ANS        PIC 9(4).
		  ...
		  PROCEDURE DIVISION.
		      CALL "CALLED-SUB" USING WS-MATH-BLOCK.
		      DISPLAY "Answer: " WS-ANS. -- Prints 60
		  ```
-
- # Mainframe Enterprise Concepts
	- ## JCL (Job Control Language)
	  collapsed:: true
		- JCL controls mainframe job submission, telling the OS which programs to run and linking files:
		- ```jcl
		  //COMPJOB  JOB (ACCT),'RUN COBOL',CLASS=A,MSGCLASS=X
		  //STEP1    EXEC PGM=CLIENTPRG
		  //STEPLIB  DD DSN=MYAPP.LOADLIB,DISP=SHR
		  //CLIENTS  DD DSN=MAINFRAME.CLIENT.DATASET,DISP=SHR
		  //SYSOUT   DD SYSOUT=*
		  ```
	-
	- ## VSAM (Virtual Storage Access Method)
	  collapsed:: true
		- VSAM is a high-performance database file storage method on IBM mainframes:
			- **KSDS (Key Sequenced Dataset)**: Record lookup by key (e.g. index on Client-ID).
			- **ESDS (Entry Sequenced Dataset)**: Records appended sequentially.
			- **RRDS (Relative Record Dataset)**: Lookup by relative record index number.
	-
	- ## DB2 Database Integration (EXEC SQL)
	  collapsed:: true
		- Mainframe databases use embedded DB2 relational SQL engines:
		- ```cobol
		  WORKING-STORAGE SECTION.
		  -- Declare SQL variables
		  EXEC SQL INCLUDE SQLCA END-EXEC.
		  
		  EXEC SQL BEGIN DECLARE SECTION END-EXEC.
		  77  DB-CLIENT-ID     PIC S9(9) COMP.
		  77  DB-CLIENT-NAME   PIC X(20).
		  EXEC SQL END DECLARE SECTION END-EXEC.
		  
		  PROCEDURE DIVISION.
		      MOVE 1001 TO DB-CLIENT-ID.
		      
		      -- Query database
		      EXEC SQL
		          SELECT NAME INTO :DB-CLIENT-NAME
		          FROM CLIENTS
		          WHERE ID = :DB-CLIENT-ID
		      END-EXEC.
		      
		      IF SQLCODE = 0 THEN
		          DISPLAY "DB Record: " DB-CLIENT-NAME
		      END-IF.
		  ```
	-
	- ## CICS Transaction Monitors (EXEC CICS)
	  collapsed:: true
		- CICS runs real-time terminal banking transactions:
		- ```cobol
		  PROCEDURE DIVISION.
		      -- Reads input from terminal screen buffer
		      EXEC CICS RECEIVE
		          MAP('CLIENTMAP')
		          MAPSET('CLIENTSET')
		          INTO(WS-SCREEN-DATA)
		      END-EXEC.
		      
		      -- Write response back to terminal screen
		      EXEC CICS SEND
		          TEXT FROM("Transaction Success")
		          LENGTH(19)
		          ERASE
		      END-EXEC.
		      
		      EXEC CICS RETURN END-EXEC.
		  ```
-
- # Compilation & Execution
	- ## Mainframe vs. Open-Source Compilers
		- **IBM Enterprise COBOL**: Standard compiler for mainframes.
		- **GnuCOBOL (open-source)**: Excellent free compiler translating COBOL to intermediate C code.
		- ```bash
		  # Compile COBOL file using GnuCOBOL
		  cobc -x program.cbl -o program.exe
		  
		  # Run executable
		  ./program.exe
		  ```
-
- # More Learn
	- Explore valuable resources for COBOL:
		-
		- [GnuCOBOL Guides (SourceForge)](https://gnucobol.sourceforge.io/)
		- [Open Mainframe Project (Mainframe tools)](https://www.openmainframeproject.org/)
		- [IBM Enterprise COBOL Documentation](https://www.ibm.com/support/knowledgecenter/SS6SG3)
		- [Mainframe Refresher (TutorialsPoint)](https://www.tutorialspoint.com/cobol/index.htm)
