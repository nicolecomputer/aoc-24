import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

type Stone = number;
type Rule = {
    evaluation: (stone: Stone) => boolean
    result: (stone: Stone) => Stone[]
}

// parse
function parseStone(input: string): Stone[] {
    return input.split(" ").map(i => parseInt(i, 10))
}

function hasEvenNumberOfDigits(stone: Stone): boolean {
    return numberOfDigits(stone) % 2 === 0
}

// Rule Evaluation
function isZero(stone: Stone): boolean {
    return stone === 0;
}

function numberOfDigits(n: number): number {
    return Math.floor(Math.log10(n)) + 1;
}

function alwaysTrue(stone: Stone): boolean {
    return true
}

// Rule Result
function replaceWithOne(stone: Stone): Stone[] {
    return [1]
}

function splitByDigits(stone: Stone): Stone[] {
    const asString = stone.toString()
    const first = parseInt(asString.slice(0, asString.length / 2), 10)
    const second = parseInt(asString.slice(asString.length / 2), 10)
    return [first, second]
}

function multiplyBy2024(stone: Stone): Stone[] {
    return [stone * 2024]
}

// Rules
function applyRules(rules: Rule[], defaultRule: Rule, stone: Stone): Stone[] {
    const rule = rules.find(rule => rule.evaluation(stone)) ?? defaultRule

    if (rule) {
        return rule.result(stone)
    }

    return [stone]
}

function blink(stones: Stone[], rules: Rule[], defaultRule: Rule): Stone[] {
    return stones.flatMap(stone => applyRules(rules, defaultRule, stone))
}

function inclusiveRange(start: number, end: number): number[] {
    const result = [];
    for (let i = start; i <= end; i += 1) {
        result.push(i);
    }
    return result;
}

const rules: Array<Rule> = [
    {
        evaluation: isZero,
        result: replaceWithOne
    },
    {
        evaluation: hasEvenNumberOfDigits,
        result: splitByDigits
    }
]

const defaultRule: Rule = {
    evaluation: alwaysTrue,
    result: multiplyBy2024
}

function part1(input: string): number {
    let stones = parseStone(input)

    return inclusiveRange(1, 25)
        .reduce((stones, _) => {
            return blink(stones, rules, defaultRule)
        }, stones)
        .length
}

function part2(input: string): number {
    let stones = parseStone(input)

    return inclusiveRange(1, 75)
        .reduce((stones, _) => {
            return blink(stones, rules, defaultRule)
        }, stones)
        .length
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-11/sample-input.txt", part1)}`)
console.log(`Part 2: ${solve("src/day-11/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-11/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
