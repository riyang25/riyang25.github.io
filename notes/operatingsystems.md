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
- 