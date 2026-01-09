+++
title = "[OS Dev] Fundamentals - Instruction Cycle"
date = 2026-01-03
+++

# Instruction Cycle - Fetch/Decode/Execute

This is the fundamental process a CPU follows in order to run programs. It includes:
1. Fetch Cycle
2. Decode Cycle
3. Execute Cycle

As part of the cycle, there are a few key [registers](@/journal/os-fundamentals-registers.md):
1. Program Counter: Holds the address of the next instruction to be executed; it increments after fetching an instruction
2. Instruction Register: Holds the address of the currently-being-executed instruction
3. Memory Address Register (opt): Holds the address of the memory location being accessed
4. Memory Data Register (opt): Holds the data read from or written to memory

## Fetch Cycle
```
Example

PC = 100 where in the memory address of 100 sits the instruction: LOAD 500

1. The address in the PC is transferred to MAR
2. Control Unit sends a read signal to memory and the contents of the address (LOAD 500) are loaded into MDR
3. The instruction is then transfered to IR (IR <- MDR[100])
4. The PC is incremented (PC <- PC + 1)

```
## Decode Cycle
The Control Unit checks the opcode (e.g. LOAD) part of the instruction from IR and determines what to perform. It also identifies the registers involved.

```
Example

IR = LOAD 500
Opcode = LOAD
Operand = 500
```
## Execute Cycle
```
Example

For LOAD 500
1. The Operand (500) will be transferred to MAR (MAR <- 500)
2. The contents at the MAR (500) will be put into the MDR (MDR <- Memory[500]). Let's say the value is 2.
3. The contents of the MDR are then placed into the Accumulator

```

## ADD 11 as Next instruction
Following on the previous cycle, we now operate on `PC=101`
```
At Memory[101], let's say we have the instruction ADD 11

=== Fetch Cycle ===
1. MAR <- 101
2. MDR <- ADD 11
3. IR <- ADD 11
4. PC <- 102
=== Decode Cycle ===
5. Control Unit now has ADD 11
=== Execute Cycle ===
6. ALU now has ADD instruction along with the contents from the Accumulator (2, which was placed there from the previous cycle)
7. MAR <- 11
8. MDR <- 3 (assuming Memory[11] = 3)
9. 3 goes to the Accumulator
10. ALU adds the 3 to the existing 2 and places the 5 back in the Accumulator
```

# References
1. https://www.youtube.com/watch?v=jFDMZpkUWCw&t=198s
2. https://www.geeksforgeeks.org/computer-organization-architecture/different-instruction-cycles/