# Operating Systems
## Week 1
Concepts that will be repeatedly mentioned in the future

### Generic Computer Architecture

- CPU: processor for computation
    - Registers: fastest storage in computer
    - ALU: arithmetic logic unit: does arithmetic computations
    - PC/stack pointers
    - Instruction register + instruction decode
- I/O devices: terminal, disks, video board, printer, etc.
- Memory: RAM containing data and programs for CPU

### Architectural Features Motivated by OS Services

- Protection: kernel, protected instructions, base/limit registers
- Interrupts: interrupt vectors
- System calls: Trap instructions and trap vectors
- I/O: interrupts and memory mapping
- Scheduling, error recovery, accounting: timer
- synchronization: atomic instructions
- Virtual memory: translation look-aside buffers

### Protection

- kernel mode vs user mode: to protect the system from aberrations, certain instructions restricted for use
    - users can’t address I/O directly
    - users can’t manipulate state of memory
    - can’t set mode bits that determine user/kernel mode ;)
    - disable/enable interrupts
    - halt machine
- Only kernel mode can do those things

### System calls

- privileged instructions
- causes trap, which vectors (jumps) to trap handler in kernel
- uses parameter to jump to appropriate handler
- handler saves caller’s state before executing
- think of system calls as API for the kernel
- examples: fork, waitpid, execve, open, close, read, write

### Memory protection

- protect user programs from each other
- protect the OS from user programs
- base and limit registers loaded by OS before running program; these are the bounds of allocated memory for program
- when running program, check each user reference to make sure it falls in between base and limit registers

Programs shouldn’t be able to access memory of other programs

### Memory Hierarchy

- higher = small, fast, more costly, lower latency
- lower = large, slow, less expensive, higher latency
- registers: 1 cycle, L1: 2 cycles, L2: 7 cycles, RAM: 100 cycles, DIsk: 40,000,000 cycles, Network: 200 million+ cycles
- Note: cycle is one iteration of CPU; for example, 1 GHz CPU is a billion cycles per second
- L1 and L2 are within each core; often there is a L3 cache on the CPU as well
- when you want to load data:
    - look in L1; if isn’t there, go to lower level
    - as seen above, getting data takes longer and longer, so important to minimize cache misses
- Why are disks so slow? Physical form of hard storage, distance from CPU

### Process Layout in Memory

When a program is running, it becomes a process. The OS creates a region of memory for that process that can't be touched by other programs.

Components:
- Stack
- Gap
- Data
- Text

- After running a program, the assembly code is stored at addresses x0000 and up.
- Stack stores function parameters, function calls, serves as temporary storage; grows downward from 0xFFF...
- Data: variables stored by the program

To implement this, there are three special registers: stack pointer, frame pointer, program counter

What if you run multiple programs at once? Current state of registers is saved; context switch

### Caches
The cache policy decides what units of memory are stored in the caches.
Commonly, entire lines are moved into cache; this is because of spatial locality.
What is spatial locality? Very often we are accessing units of memory close by (like consecutive elements of array)

### Traps

- Special conditions detected by architecture
  - ex: page fault, write to read only, overflow, system call
- After detecting a trap, hardware
  - saves state of process
  - transfers control to the handling process for trap
    - CPU indexes the memory-mapped trap vector with the trap number
    - jumps to address given in the vector,
    - executes at that address.
    - After, resumes execution of process
- Traps are performance optimization; naive solution would be to insert extra instructions where special condition could arise

### I/O

- Every I/O device has processor to run autonomously
- CPU issues commands to I/O devices
- When I/O device completes command, it issues interrupt
- CPU stops and responds to interrupt (with traps)
- Two methods: synchronous, asynchronous
  - Synchronous: while hardware handling command, CPU is stuck waiting
  - Asynchronous: CPU can keep on running cycles while hardware handles request
- Memory mapped I/O:
  - enables direct access (vs moving I/O code and data into memory)

## Week 2
When you run an exe file, OS creates process, or a running program
- OS timeshares CPU across multiple processes: virtualizes CPU
  - Number of runnning processes -> number of physical cores
  - programs can respond even while CPU is doing other tasks
- OS has scheduler that picks a process to execute

### What is a process?
- Unique identifier (PID)
- memory image: code and data (static), stack and heap (dynamic)
- CPU context: registers, program counter, current operands, stack pointer
- File descriptors: pointers to open files and devices: STDOUT, STDIN, STDERR
  - often, STDOUT is your screen

## State of a process
- Running: currently executing
- Ready: waiting to be scheduled
- Blocked: suspended, not ready to run
  - Could be waiting for some event
  - Disk will issue an interrupt when data is ready
- New: being created, yet to run
- Dead: terminated

Process state transitions:
- From running to ready: descheduled
- from running to blocked: input/output initiates
- from blocked to running: input/output done

## OS data structures
OS maintains a data structure (e.g. a linked list) of all active processes
information about process stored in process control block (PCB)
- Process identifier
- Process state
- pointers to related processes
- CPU context of process (saved while suspended)
- pointers to memory locations
- pointers to open files

In Linux, you can see process information in directory `proc/<pid>`

### Process APIs
- API: Application Programming Interface
  - functions available to write user programs
- API provided by OS is set of system calls

Should we rewrite programs for each OS?
- POSIX API: standard set of system calls that OS must implement
  - Portable Operating System Interface
  - Programs written to POSIX API can run on any POSIX compliant OS
  - most OSes are POSIX compliant
  - ensures proram portability
- Program language libraries: hide the details of invoking system calls
  - `printf()` function in C library calls the write system call to `write()` to screen
  - User programs usually don't need to worry about system calls

Process related system calls (UNIX):
- `fork()` creates new child process
  - All processes created by forking from a parent
  - New process created by copy of parent's memory image
  - new process added to process list, scheduled
  - parent and child modify memory independently
  - On success, PID of child process returned to parent
  - child returns 0 to parent
  - On failure, no child created, returns -1 to parent
  - Which runs first?
    - Determined by scheduling policy
    - Upon creation of child, it is in ready state
    - up to OS to decide which one to run first
  - Process termination scenarios
  - `wait()`: blocks parent process until child process finishes
  - What happens during exec?
    - Both parent and child running same code; not very useful!
    - Process can run  `exec()` 
