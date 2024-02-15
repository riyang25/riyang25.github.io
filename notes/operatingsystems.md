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

### State of a process
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

### OS data structures
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
  - On success, the PID of child process returned to parent
  - On failure, no child created, returns -1 to parent
  - Which runs first?
    - Determined by scheduling policy
    - Upon creation of child, it is in ready state
    - up to OS to decide which one to run first
  - Process termination scenarios
  - `wait()`: blocks parent process until child process finishes
  - What happens during exec?
    - Both parent and child running same code; not very useful!
    - Process can run  `exec()` to load other executable to its memory image
      - child  can run different program from parent
  - in basic OS, init process created after initialization of hardware
    - init spawns a shell like `bash`
    - shell reads user command, `fork`s a child, `exec`s the command, `wait`s, then reads next command
    - common commands like `ls` are executables that are `exec`'ed by shell

Example:
```
int main() {
  pid = fork();
  if (pid < 0) printf("Error"); // child process failed to be created
  else if (pid == 0) printf("this is child process"); // in the child process, fork() returns 0
  else printf("this is parent process); // in the parent process, fork() will return PID of child process
}
```

### Process Execution Mechanism
How are processes executed by CPU?

### Function call vs System call
- Function call translates to jump instruction
- new stack frame pushed to stack, stack pointer updated
- old value of PC saved
- in user memory space

How is system call different?
- CPU has multiple privilege levels
- Kernel does not trust user stack; uses separate kernel stack
- kernel does not trust user provided addresses to jump to
  - sets up interrupt descriptor table (IDT) at boot time
  - IDT has addresses of kernel functions for system calls and other events

### Mechanism of system call
Trap instructions
- usually hidden from user
- Execution:
  - move CPU to higher privilege level
  - switch to kernel stack
  - save context on kernel stack (so know where to return)
  - look up address in IDT and jump to trap handler
- IDT has many addresses, which to use?
  - System calls/interrupts store number in CPU register before calling trap, to identify which entry to use

Return from trap
- when OS done handling syscall or interrupt, calls special instruction: return from trap
  - restore context of CPU 
  - change privilege back to user mode
- User process unaware of being suspended

Possible for CPU to not return to same process
- sometimes impossible to return: process has exited, segfault, blocking system call
- sometimes OS does not want to return back: runtime is too long, must timeshare CPU
- OS performs context switch to switch to another process

### OS Scheduler
How the OS decides what processes to run at any time

Two types of schedulers: non preemptive, preemptive
- non preemptive schedules switch only if blocked or terminated process
- preemptive schedulers can switch even when process is ready to continue

Example of context switch:
- todo

### Scheduling Policies
What are we trying to optimize?
- maximize utilization: fraction of time that CPU is used
- minimize average turnaround time: time between arrival and completion of process
- minimize average response time: time between arrival and first scheduling
- fairness: all processes must be treated equally
- minimize overhead: run process long enough to amortize cost of context switch

Policies:
- FIFO: first in first out (queue)
  -  issue: convoy effect, high turnaround time
- SJF: shortest job first
  - optimal when all processes arrive together
  - non preemptive; short jobs can still be stuck behind long ones if they arrive later
- STCF: shortest time to completion first
  - preemptive scheduler
  - preempts running task if time left is more than than that of new arrival
- Round Robin
  - every process executes for fixed quantum slice
  - slices large enough to amortize cost of context switch
  - preemptive
  - good in response time and fairness
  - bad turnaround time
- Real schedulres are more complex
  - Multi level feedback queue:
    - many queues with different priority
    - process from highest priority queue scheduled first
    - within same priority, any algorithm like RR
    - priority of process decays with age; job in top queue can get switched to lower queue

## Week 4
### Virtual Memory
Why virtualize memory?
- real memory is messy
- multiple active processes timeshare CPU
  - memory of many processes must be in memory
- Hide complexity from user

Virtual address space:
- every process assumes it has access to memory from 0 to MAX
- program code, heap (grows positively), stack (grows negatively)
- CPU issues loads and stores to virtual addresses

How to translate between real and virtual memory addresses?

### MMU
Memory management unit
- OS divides virtual address space into fixed size pages
- pages mapped to physical frames
- page table stores mappings from virtual to physical
- MMU has access to page table and uses it to translate
- Context switch: CPU gives MMU pointer to new page table

### Design Goals
- Transparency: hide details from user
- Efficiency: minimize overhead and wastage in memory and time
- isolation, projection: user processes should not be able to access outside address space

Memory Allocation
- Malloc (C library)
- heap: libc uses brk/sbrk system call
- can also allocate page sized memory using mmap()

### Mechanism of Address Translation
Base and bound registers
- place entire memory image in one chunk
- physical address = virtual address + base

Segmentation

Paging

typical size of page table

### Demand Paging
Not neccessary for pages of active processes to always be in main memory;
OS uses part of disk (swap space) to store pages not in active use

Page fault
- Present bit: indicates if page in memory or not
- MMU reads present bit; if page present, directly access, if not, page fault

Page fault handling
- CPU to kernel mode
- OS fetches disk address of page, issues read to disk
- OS context switches to other process
- when read complete, OS updates page table, marks it as ready
- when process scheduled again, OS restarts instruction that caused page fault

Summary
- CPU issues load instruction to virtual address for code or data
  - check CPU cache first; go to main memory in case of cache miss
  - caches return raw data (no address associated)
- MMU looks up translation lookaside buffer for virtual address
  - if TLB hit, obtain physical address, fetch memory location and return to CPU
  - if TLB miss, MMU accesses memory, walks page table, obtains page table entry
    - if present bit in PTE, access memory
    - if not present but valid, page fault
    - if invalid, trap to OS for illegal access

More in page faulting
- when servicing page fault, what if OS finds there is no free page to swap in faulting page?
- Inefficient to swap out existing and then swap in faulting page
- OS proactively swap out pages to keep list of free pages
- Page replacement policy

Page replacement policy
- optimal: replace page not needed for longest time in future (but OS doesn't know that)
- FIFO
  - not good because popular pages get swapped in and out over and over
- LRU: not frequently used in past will be swapped out
  - works well due to locality of references
- 
