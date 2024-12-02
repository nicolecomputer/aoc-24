import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

type Report = number[]
type Direction = "INCREASING" | "DECREASING"

const safeChangeAmount = [1, 3]

function parseReport(input: string): Report {
    return input.split(" ").map(i => parseInt(i));
}

function safeChange(previousLevel: number, currentLevel: number, direction: Direction): boolean {
    if ((direction == "INCREASING" && currentLevel < previousLevel) ||
        (direction == "DECREASING" && currentLevel > previousLevel)) {
        return false
    }

    const change = Math.abs(currentLevel - previousLevel)
    if (change < safeChangeAmount[0] || change > safeChangeAmount[1]) {
        return false
    }

    return true
}

function levelDirection(report: Report): Direction {
    return report[1] > report[0] ? "INCREASING" : "DECREASING"
}

function isSafe(report: Report): boolean {
    const direction = levelDirection(report)

    for (let i = 1; i < report.length; i++) {
        if (!safeChange(report[i - 1], report[i], direction)) {
            return false
        }
    }

    return true
}

function isSafeWithDapener(report: Report): boolean {
    const direction = levelDirection(report)
    let skipUsed = false;

    for (let i = 1; i < report.length; i++) {
        if (!safeChange(report[i - 1], report[i], direction) && safeChange(report[i - 1], report[i + 1], direction)) {
            if (skipUsed) {
                return false
            }
            skipUsed = true
            i += 1
        } else if (!safeChange(report[i - 1], report[i], direction)) {
            return false
        }
    }

    return true
}

function part1(input: string): number {
    return input.split("\n").map(parseReport).filter(isSafe).length
}

function part2(input: string): number {
    return input.split("\n").map(parseReport).filter(isSafeWithDapener).length
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-02/sample-input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-02/sample-input.txt", part2)}`)

console.log("final")
console.log(`Part 1: ${solve("src/day-02/input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-02/input.txt", part2)}`)

// It's not 338
