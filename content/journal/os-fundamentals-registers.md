+++
title = "[OS Dev] Fundamentals - Registers"
date = 2026-01-03
+++

# Registers

## What is a register?
A register is a dedicated _hardware_ component. It is located inside the CPU and typically one word (any processor design's natural unit of data, typically 32 or 64 bits) wide.

They can store things such as:
* Data
* Addresses
* Instructions
* Control State

## What should I know about registers on a hardware level?
It is made of many flip-flops (latches). The number of flip-flops is equivalent to the system's word size (e.g. 64 in a 64 bit system). These flip-flops for a register are all written and read in parallel via coordination (not electrical/hardware chaining) through the same shared clock and same write-enable signal.

You should think of them as a **CPU's internal state in a single instant in time**

### How the coordination works
At the active clock edge:
* If `WE = 1`:
  * Each flip-flop samples its own data input bit
  * All bits update simultaneously
* If `WE = 0`:
  * Flip-flops all hold their existing state

_Note: `WE` is Write Enable_

## How are they organized?

Registers are in a Register File, which is a _hardware_ structure with:
1. An array of registers
2. 1+ write ports
2. 2+ read ports

The Register File has additional components such as:
* Read decoders - select which register to read
* Multiplexers - route register's bits to output ports
* Write decoders - select which register to write
* Write enable logic - ensure only one register updates on a clock edge

In summary, there are 3 layers:
1. Flip-flop - stores 1 bit
2. Register - stores 1 word via shared control
3. Register File - enables indexed, parallel access to many registers