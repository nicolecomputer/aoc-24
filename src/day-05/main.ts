import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

type Page = number
type Rule = {
    first: Page,
    second: Page
}
type ParsedInput = {
    rules: Rule[],
    pages: Array<Page[]>
}


// Parsing Logic

function parsePage(input: string): Page[] {
    return input.split(",").map(i => parseInt(i, 10))
}

function parseRule(input: string): Rule {
    const [first, second] = input.split("|").map(i => parseInt(i, 10))
    return {
        first,
        second
    }
}

function parse(input: string): ParsedInput {
    const [rawRules, rawPages] = input.split("\n\n")
    return {
        rules: rawRules.split("\n").map(parseRule),
        pages: rawPages.split("\n").map(parsePage)
    }
}

function part1(input: string): number {
    const { rules, pages } = parse(input)
    rules //?
    pages //?
    return 0
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-05/sample-input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-05/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-XX/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
