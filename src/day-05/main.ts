import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

// Types

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

// Validation
function isValid(pages: Page[], rule: Rule): boolean {
    const firstIndex = pages.indexOf(rule.first)
    const secondIndex = pages.indexOf(rule.second)
    if (firstIndex == -1 || secondIndex == -1) {
        return true
    }
    return firstIndex < secondIndex
}

function isValidForAllRules(pages: Page[], rules: Rule[]): boolean {
    for (const rule of rules) {
        if (!isValid(pages, rule)) {
            return false
        }
    }
    return true
}

function ruleAppliesToPages(pages: Page[], rule: Rule): boolean {
    const firstIndex = pages.indexOf(rule.first)
    const secondIndex = pages.indexOf(rule.second)
    if (firstIndex == -1 || secondIndex == -1) {
        return false
    }

    return true
}

function swap<T>(items: T[], index1: number, index2: number): T[] {
    const next = [...items]
    next[index1] = items[index2]
    next[index2] = items[index1]
    return next
}

function orderCorrectly(pages: Page[], rules: Rule[]): Page[] {
    const rulesThatApply = rules.filter(rule => ruleAppliesToPages(pages, rule))

    let nextPages = [...pages]
    let nextPagesOrderedCorrectly = false

    while (!nextPagesOrderedCorrectly) {
        for (const rule of rulesThatApply) {
            if (!isValid(nextPages, rule)) {
                const firstIndex = pages.indexOf(rule.first)
                const secondIndex = pages.indexOf(rule.second)
                nextPages = swap(nextPages, firstIndex, secondIndex)
            }
        }
        nextPages //?
        nextPagesOrderedCorrectly = isValidForAllRules(nextPages, rules)
    }

    nextPages
    return nextPages
}


// helper
function middle<T>(items: T[]): T {
    return items[Math.floor(items.length / 2)]
}

function sum(total: number, entry: number): number {
    return total + entry
}

function part1(input: string): number {
    const { rules, pages } = parse(input)

    const isCorrectlyOrdered = (pages: Page[]) => isValidForAllRules(pages, rules)

    return pages
        .filter(isCorrectlyOrdered)
        .map(middle)
        .reduce(sum)
}

function part2(input: string): number {
    const { rules, pages } = parse(input)

    const incorrectlyOrdered = (pages: Page[]) => !isValidForAllRules(pages, rules)

    return pages
        .filter(incorrectlyOrdered)
        .map(pages => orderCorrectly(pages, rules)) //?
        .map(middle)
        .reduce(sum)
    return 100
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-05/sample-input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-05/sample-input.txt", part2)}`)

// console.log("final")
console.log(`Part 1: ${solve("src/day-05/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
