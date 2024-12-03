import { readFileSync } from "fs";
import { parse } from "path";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

function sum(total: number, entry: number): number {
    return total + entry
}

// Problem:

type MulInstruction = {
    type: 'mul'
    left: number
    right: number
}

type DoInstruction = {
    type: 'do'
}

type DontInstruction = {
    type: 'dont'
}

type Instruction = MulInstruction | DoInstruction | DontInstruction

function parseMulInstruction(input: string): MulInstruction {
    const match = input.match(/(\d*),(\d*)/);
    if (!match) {
        throw new Error('Invalid MulInstruction format');
    }
    const [_, first, second] = match

    return {
        type: 'mul',
        left: parseInt(first),
        right: parseInt(second)
    }
}

function parseInstruction(instruction: string): Instruction {
    if (instruction.startsWith("mul")) {
        return parseMulInstruction(instruction)
    } else if (instruction.startsWith("don't")) {
        return {
            type: 'dont'
        }
    } else if (instruction.startsWith('do')) {
        return {
            type: 'do'
        }
    }
    throw new Error(`unknown instruction ${instruction}`)
}

function parseInstructions(input: string): Instruction[] {
    const regex = /mul\(\d+,\d+\)|don['']t\(\)|do\(\)/g;

    return [...input.matchAll(regex)]
        .map(match => match[0])
        .map(parseInstruction)
}

type MachineState = {
    shouldEval: boolean
    total: number
}

const defaultMachineState: MachineState = {
    shouldEval: true,
    total: 0
}

function evaluateMulInstruction(instruction: MulInstruction): number {
    return instruction.left * instruction.right
}

function evaluate(state: MachineState, instruction: Instruction): MachineState {
    switch (instruction.type) {
        case 'do':
            return {
                ...state,
                shouldEval: true
            }
        case 'dont':
            return {
                ...state,
                shouldEval: false
            }
        case "mul":
            const result = evaluateMulInstruction(instruction)
            const nextTotal = result + state.total
            return {
                ...state,
                total: state.shouldEval ? nextTotal : state.total
            }
    }
}

function part1(input: string): number {
    return parseInstructions(input)
        .filter(i => i.type == "mul")
        .map(evaluateMulInstruction)
        .reduce(sum)
}

function part2(input: string): number {
    return parseInstructions(input)
        .reduce(evaluate, defaultMachineState).total
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-03/sample-input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-03/sample-input2.txt", part2)}`)

console.log("final")
console.log(`Part 1: ${solve("src/day-03/input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-03/input.txt", part2)}`)
