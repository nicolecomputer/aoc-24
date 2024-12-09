import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}


type Freespace = {
    type: 'freespace',
    length: number
}

type File = {
    type: 'file',
    length: number,
    id: number
}

type DiskMapItem = File | Freespace;
type DiskMap = DiskMapItem[];

function parseDiskMap(input: string): DiskMap {
    let isFile = true
    let map: DiskMap = [];
    let fileId = 0;

    for (const item of input.split("")) {
        const length = parseInt(item, 10)
        if (isFile) {
            map.push({
                type: 'file',
                length,
                id: fileId
            })
            fileId += 1
        } else {
            map.push({
                type: 'freespace',
                length
            })
        }
        isFile = !isFile
    }
    return map
}

function repeat(s: string, length: number): string {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += s
    }
    return result
}

function visualizeFreespace(i: Freespace): string {
    return repeat(".", i.length)
}

function visualizeFile(i: File): string {
    return repeat(i.id.toString(), i.length)
}

function visualizeMapItem(item: DiskMapItem): string {
    if (item.type === "file") {
        return visualizeFile(item)
    } else if (item.type === "freespace") {
        return visualizeFreespace(item)
    }

    throw new Error("unknown type")
}

function visualizeFileMap(map: DiskMap): string {
    return map.map(visualizeMapItem).join("")
}

function part1(input: string): number {
    const diskmap = parseDiskMap(input) //?
    visualizeFileMap(diskmap) //?
    return 0
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-09/sample-input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/sample-input.txt", part2)}`)

// console.log("final")
// console.log(`Part 1: ${solve("src/day-XX/input.txt", part1)}`)
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)
