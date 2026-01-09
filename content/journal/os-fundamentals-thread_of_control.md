+++
title = "[OS Dev] Fundamentals - 4 Essential Concepts"
date = 2026-01-04
+++

## Concept 1: Thread of Control
**Thread**: A virtualized execution context that progresses through [instruction cycles](@/journal/os-fundamentals-instruction_cycle.md). It is _executing_ when it is _resident_ on the processor registers

**Resident**: [Registers](@/journal/os-fundamentals-registers.md) hold the root state of the thread:
* PC register, Stack pointer, general-purpose registers, processor attus/flags
* Intermediate values for ongoing computations: integers or pointers to values in memory
* Stack pointer holds the address of the top of the stack
* Rest in memory (stack, heap, TCB)

A process is NOT _resident_ when the processor is pointing at some other thread and the `PC` is not pointing at the next instruction from this thread.

> Question: How is the illusion of multiple processor made?

We multiplex through running multiple virtual cores sequentially.

> Question: Where is the thread?

When its running, its on the core. When its not running, its saved in a chunk of memory called the _Thread Control Block_ (TCB).

**Thread Control Block**: Holds the contents of registers when a thread is not running. It is stored in memory

## Concept 2: Address Space
**Address Space**: Set of accessible addreses + state associated with them. For a 32 bit processor, there are 2<sup>32</sup> addresses and 2<sup>64</sup> for a 64 bit processor (but maybe not are all useable, e.g. only 48 for x86)

There are a few parts to the address space:
* Stack: local variables, recursive function variables
* Heap: linked list, things allocated with malloc, structures, pointers
* Static Data: const, static variables, global variables (not malloc)
* Code Segment: code

Simple Multiprogramming
* All vCPU's share non-CPU resources such as physical address space, I/O devices.
* Each thread can read/write memory, including the data of others
This was used in early days of computing, but its very risky.

> Question: Why is protection important?

First, the OS itself needs to be protected from user programs
* Reliability: Compromised OS means it will probably crash
* Security: Limit what each thread can do
* Privacy: Limit each thread to the data it can access
* Fairness: Each thread has its appropriate share of system resources

The OS also needs to protect user programs from each other
* Noisy Neighbor
* Stealing information

Protection can be accomplished through _Base and Bound_ which defines a section of address space upon which a program can run. Enforcement is done by hardware checks on each memory access rather then software.

**Address Space Translation**: This can be done with a _Paged Virtual Address Space_ which breaks the entire virtual address space into equally sized chunks (pages) with a base for each.

The hardware will translate addresses using a _page table_.
```
Example
<Virtual Address> = <Page #> <Page Offset>

The <Page #> is fed into the Page Table, which gives you the <Frame Addr>. 

* Note the similarity of Frame Addr to "Base" in the Base and Bound concept.

Then, the <Page Offset> gives you the exact location within that page.
```

## Concept 3: Process
**Process**: An address space with 1 or more threads. It is an execution environment with restricted rights. An application program executes as a process. Processes are protected from each other and OS is protected from them.

> Threads encapsulate _concurrency_, and Address Spaces encapsulate _protection_

Processes also ensure reliability (memory isolation), security (can't see others), and to some degree, fairness.

## Concept 4: Dual Mode Operation
Hardware provides at least 2 modes:
1. Kernel Mode
2. User Mode

Certain operations cannot be done on user mode (e.g. change page table pointer, disable interrupts). There are also certain transitions between user mode and kernel mode (e.g. system calls, interrupts, exceptions).

There are 3 types of user -> kernel mode transfers:
1. Syscall: process requests a system service, e.g. exit
2. Interrupt: external asynchronous event triggers a context switch, e.g. timer or I/O device
3. Trap or Exception: internal synchronous event in process which can trigger context switch, e.g. protection violation (segmentation fault), divide by zero...