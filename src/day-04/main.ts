import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

type Crossword = string[][]

function parse(input: string): Crossword {
    return input.split("\n").map(line => line.split(""))
}

type WordsParams = {
    crossword: Crossword
    length: number,
    startingAt: [number, number]
}

function forwardWord({ crossword, length, startingAt }: WordsParams): string | null {
    const word = crossword[startingAt[0]]
        .slice(startingAt[1], startingAt[1] + length)
        .join("")
    return word.length == length ? word : null
}

function backwardWord({ crossword, length, startingAt }: WordsParams): string | null {
    const word = crossword[startingAt[0]]
        .slice(startingAt[1] - length + 1, startingAt[1] + 1)
        .reverse()
        .join("")
    return word.length == length ? word : null
}

function forwardDiagonalWord({ crossword, length, startingAt }: WordsParams): string | null {
    let word = [];

    if (startingAt[0] + length > crossword.length - 1) {
        return null
    }

    for (let offset = 0; offset < length; offset++) {
        let row = startingAt[0] + offset
        let column = startingAt[1] + offset

        if (crossword[row][column] !== undefined) {
            word.push(crossword[row][column])
        }
    }

    return word.length == length ? word.join("") : null
}

function backwardDiagonalWord({ crossword, length, startingAt }: WordsParams): string | null {
    let word = [];

    if (startingAt[0] - length < 0) {
        return null
    }
    for (let offset = 0; offset < length; offset++) {
        let row = startingAt[0] - offset
        let column = startingAt[1] - offset

        if (crossword[row][column] !== undefined) {
            word.push(crossword[row][column])
        }
    }

    return word.length == length ? word.join("") : null
}

function wordsInCrossWord(params: WordsParams): string[] {
    return [forwardWord, backwardWord, backwardDiagonalWord, forwardDiagonalWord]
        .map(fn => fn(params))
        .filter(w => w !== null)
}

function wordCount(targetWord: string, params: WordsParams): number {
    return wordsInCrossWord(params).filter(a => a == targetWord).length
}


function part1(input: string): number {
    const crossword = parse(input)
    const targetWord = "XMAS"

    let count = 0;
    for (let row = 0; row < crossword.length; row++) {
        for (let col = 0; col < crossword[row].length; col++) {
            count += wordCount(targetWord, { crossword, length: targetWord.length, startingAt: [row, col] })
        }
    }

    return count
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-04/sample-input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-XX/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
