import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

function part1(input: string): number {
    return 0
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-03/sample-input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-03/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-02/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-02/input.txt", part2)}`)
