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

function findLastIndex<T>(items: T[], predicate: (item: T) => boolean): number {
    for (let i = items.length - 1; i > 0; i--) {
        if (predicate(items[i])) {
            return i
        }
    }
    return -1
}

function findFirstIndex<T>(items: T[], predicate: (item: T) => boolean): number {
    return items.findIndex(predicate)
}

function isFreeSpace(s: DiskMapItem): boolean {
    return s.type === "freespace"
}

function isCompactedByBit(map: DiskMap): boolean {
    return findFirstIndex(map, isFreeSpace) === findLastIndex(map, isFreeSpace)
}

function compactByBit(map: DiskMap): DiskMap {
    let nextMap = [...map]

    const freeSpotIndex = findFirstIndex(map, s => s.type === "freespace" && s.length > 0)
    const freeSpot = map[freeSpotIndex]

    const fileToMoveIndex = findLastIndex(map, s => s.type === "file" && s.length > 0)
    const fileToMove = map[fileToMoveIndex]

    nextMap[freeSpotIndex] = {
        ...freeSpot,
        length: freeSpot.length - 1
    }
    nextMap[fileToMoveIndex] = {
        ...fileToMove,
        length: fileToMove.length - 1
    }
    nextMap.splice(freeSpotIndex, 0, {
        ...fileToMove,
        length: 1
    })
    nextMap.push({
        type: "freespace",
        length: 1
    })


    // Cleanup
    // - Remove empty blank spots / empty data
    // - Join neighboring data types
    nextMap = removeEmptySpots(nextMap)
    nextMap = joinNeighbors(nextMap)
    return nextMap
}

function isJoinable(a: DiskMapItem, b: DiskMapItem): boolean {
    if (a.type === "freespace" && b.type === "freespace") {
        return true
    }
    if (a.type === "file" && b.type == "file" && a.id == b.id) {
        return true
    }
    return false
}

function joinNeighbors(map: DiskMap): DiskMap {
    let nextMap = [...map]
    for (let i = 1; i < nextMap.length; i++) {
        const a = nextMap[i - 1]
        const b = nextMap[i]
        if (isJoinable(a, b)) {
            nextMap[i] = {
                ...a,
                length: a.length + b.length
            }
            nextMap.splice(i - 1, 1)
            // Step back to make sure we compare this with the next one
            i--;
        }
    }
    return nextMap
}

function removeEmptySpots(map: DiskMap): DiskMap {
    return map.filter(s => s.length > 0)
}

function checksumItem(item: DiskMapItem, index: number): number {
    if (item.type === "freespace") {
        return -1;
    }
    let total = 0;
    for (let i = 0; i < item.length; i++) {
        const componentChecksum = (index + i) * item.id;
        total += componentChecksum
    }
    return total;
}

function checksumDisk(disk: DiskMap): number {
    let index = 0;
    let total = 0;
    for (const item of disk) {
        const itemChecksum = checksumItem(item, index)
        if (itemChecksum > 0) {
            total += itemChecksum
        }
        index += item.length
    }

    return total
}

function compactByFile(map: DiskMap): DiskMap {
    return map
}

function isCompactedByFile(map: DiskMap): boolean {
    return true
}

function sum(total: number, entry: number): number {
    return total + entry
}

function untilDone<T>(
    transformFn: (map: T) => T,
    isDone: (map: T) => boolean
): (diskmap: T) => T {
    return (a: T) => {
        let current = a

        while (!isDone(current)) {
            current = transformFn(current)
        }

        return current
    }
}

const compactUntilDoneByBit = untilDone(compactByBit, isCompactedByBit)
const compactUntilDoneByFile = untilDone(compactByFile, isCompactedByFile)

class Pipeline<T> {
    constructor(private _value: T) { }

    pipe<R>(fn: (value: T) => R): Pipeline<R> {
        return new Pipeline(fn(this.value))
    }

    tap(fn: (value: T) => void): Pipeline<T> {
        fn(this.value)
        return this
    }

    get value(): T {
        return this._value
    }
}


function part1(input: string): number {
    return new Pipeline(input)
        .pipe(parseDiskMap)
        .pipe(compactUntilDoneByBit)
        .tap(diskMap => console.log(visualizeFileMap(diskMap)))
        .pipe(checksumDisk)
        .value
}

function part2(input: string): number {
    const diskmap = parseDiskMap(input)
    const compactedDiskMap = compactUntilDoneByFile(diskmap)

    console.log(visualizeFileMap(compactedDiskMap))
    return checksumDisk(compactedDiskMap)
}

// console.log("sample")
console.log(`Part 1: ${solve("src/day-09/sample-input.txt", part1)}`) //1928
console.log(`Part 2: ${solve("src/day-09/sample-input.txt", part2)}`)

// console.log("final")
//console.log(`Part 1: ${solve("src/day-09/input.txt", part1)}`) //6299243228569
// console.log(`Part 2: ${solve("src/day-XX/input.txt", part2)}`)


// Helpers

