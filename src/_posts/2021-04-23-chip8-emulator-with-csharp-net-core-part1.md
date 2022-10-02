---
description: >
  Learn how to emulate a CHIP-8 with C# .NET Core and Blazor!
id: 8007
title: 'CHIP-8 emulation with C# and Blazor - part 1'
date: 2021-04-23T10:00:07-05:00
author: David Guida
layout: post
guid: https://www.davidguida.net/?p=8007
permalink: /chip8-emulator-csharp-net-core-blazor-part1/
image: /assets/uploads/2021/04/chip8-emulator-csharp-net-core-blazor-part1.jpg
tags:
  - .NET Core
  - ASP.NET Core
  - Blazor
  - Emulation
  - Retrogaming
  - Gamedev
---
I have always been a fan of emulators and retrogaming in general. I even started writing my own <a href="/back-to-the-74-with-a-8080-emulator-part-1/" target="_blank">8080 emulator</a>, but I haven't managed to complete it (yet).

Emulating a complete system is no easy task, as you have to replicate all the inner complexities and micro-instructions.

Being the curious type I am, I decided to take a step back and find the easiest system possible to emulate. And after a bit of research (mostly on StackOverflow and Wikipedia), I stumbled on the **CHIP-8**!

Honestly, I had no idea it existed, but apparently, it had a quite active community in the late 70s. At its heart, it's not really a physical machine, but rather an 

> "interpreted programming language, running on a virtual machine. It was made to allow video games to be more easily programmed" (<a href="https://en.wikipedia.org/wiki/CHIP-8" target="_blank">Wikipedia</a>)

The specs are quite easy: 
- 4k total memory
- 16 8-bit data registers, called V (from 0 to F)
- a 16-bit address register, called I
- a stack (size might vary in each implementation, usually it's 48 bytes)
- a keyboard with 16 keys
- a monochrome 64x32 display

That's it! These can be quickly reproduced in a C# class like this:

```csharp
public class Cpu
{
	private readonly byte[] _memory = new byte[0x1000];        
  private readonly byte[] _v = new byte[16];
  private ushort  _i  =  0;
  private readonly ushort[] _stack = new ushort[16];

	private const int SCREEN_WIDTH = 64;
  private const int SCREEN_HEIGHT = 32;
  private readonly bool[,] _screen = new bool[SCREEN_WIDTH, SCREEN_HEIGHT];
}
```

In addition to those, we also need two more fields to track the  Program Counter and the current Stack position:

```csharp
private ushort _pc = 0;
private byte _sp = 0;
```

This is already a good start. The next step is to implement each Opcode. <a href="https://en.wikipedia.org/wiki/CHIP-8#Opcode_table" target="_blank">Wikipedia</a> still tells us that:
> CHIP-8 has 35 opcodes, which are all two bytes long and stored big-endian.

There's a nice table on that Wikipedia article with the entire list so I'm not going to replicate it here. 
In order to emulate these opcodes, I am using a struct to represent its data
```csharp
public readonly struct OpCode
{
  public ushort Data { get; }
  public byte Set { get; }
  public ushort NNN { get; }
  public byte NN { get; }
  public byte N { get; }
  public byte X { get; }
  public byte Y { get; }
}
```
... and a `Dictionary<byte, Action<OpCode>>` to link it to the function to execute.

So, for, example the `0xFX1E` instruction, which simply adds the content of the memory at location VX to the I register, simply translates into this:

```csharp
private void AddVRegToI(OpCode opCode){
	_i += _v[opCode.X];
}
```

At this point, once we have read the ROM file into the `_memory` array, we can start processing the opcodes:

```csharp
public void Tick()
{
    ushort data = (ushort)(_memory[_pc++] << 8 | _memory[_pc++]);
    var opCode = new OpCode(data);

    if (_instructions.TryGetValue(opCode.Set, out var instruction))
        instruction(opCode);
}
```

That's it for today! I've pushed all the source on <a href="https://github.com/mizrael/chip8-emulator/" target="_blank">GitHub</a>, so feel free to take a look.

The <a href="/chip8-emulator-csharp-net-core-blazor-part2/" target="_blank">next time</a> we'll see how we can run the emulator in a Blazor WASM application. Ciao!