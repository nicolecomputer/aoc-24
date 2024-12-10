import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

type Elevation = number
type TrailMap = Elevation[][]

function parseRow(row: string): Elevation[] {
    return row.split("").map(elevation => parseInt(elevation, 10))
}
function parseTrailMap(input: string): TrailMap {
    return input
        .split("\n")
        .map(parseRow)
}

function part1(input: string): number {
    const map = parseTrailMap(input)
    map //
    return 0
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-10/sample-input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-XX/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
