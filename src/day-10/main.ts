import { readFileSync } from "fs";

function solve<T>(inputFile: string, solution: (input: string) => T): T {
    const data = readFileSync(inputFile, "utf-8").trim()
    const solved = solution(data)
    return solved
}

// Domain Concepts
type Elevation = number
type TrailMap = Elevation[][]

// Expressed as row, column
type Location = [number, number]
const TrailHeadElevation = 0;
const PeakElevation = 9;

function findAllAtElevation(elevation: Elevation): (map: TrailMap) => Location[] {
    return (map: TrailMap) => {
        let result: Location[] = []
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] === elevation) {
                    result.push([row, col])
                }
            }
        }
        return result
    }
}

const findAllPeaks = findAllAtElevation(PeakElevation)
const findAllTrailHeads = findAllAtElevation(TrailHeadElevation)

// Parsing
function parseRow(row: string): Elevation[] {
    return row.split("").map(elevation => parseInt(elevation, 10))
}

function parseTrailMap(input: string): TrailMap {
    return input
        .split("\n")
        .map(parseRow)
}

// Logic
function isOutOfBounds(map: TrailMap, location: Location): boolean {
    const [row, col] = location
    return row >= 0 && row < map.length && col >= 0 && col < map[0].length
}

function neighbors(map: TrailMap, location: Location): Location[] {
    return [
        [location[0] + 1, location[1]] as Location,
        [location[0] - 1, location[1]] as Location,
        [location[0], location[1] + 1] as Location,
        [location[0], location[1] - 1] as Location,
    ].filter(n => isOutOfBounds(map, n))
}

function findStepUps(map: TrailMap, location: Location): Location[] {
    const [row, col] = location
    const currentElevation = map[row][col]
    const allNeighbors = neighbors(map, location)
    return allNeighbors.filter(neighborLocation => {
        const elevationForNeighbor = map[neighborLocation[0]][neighborLocation[1]]
        return elevationForNeighbor === currentElevation + 1
    })
}

function isPeak(map: TrailMap, location: Location): boolean {
    const [row, col] = location
    const currentElevation = map[row][col]
    return currentElevation === PeakElevation
}

function sum(total: number, entry: number): number {
    return total + entry
}

function pathTerminatesByStepUp(map: TrailMap, location: Location): Location[] {
    if (isPeak(map, location)) {
        return [location]
    }

    return findStepUps(map, location)
        .map(step => pathTerminatesByStepUp(map, step))
        .reduce((all, steps) => [...all, ...steps], [])
}

function uniqPaths(locations: Location[]): Location[] {
    let result = new Map<string, Location>()
    for (const location of locations) {
        result.set(`${location[0]} - ${location[1]}`, location)
    }
    return [...result.values()]
}

function part1(input: string): number {
    const map = parseTrailMap(input)

    return findAllTrailHeads(map)
        .map(start => {
            return pathTerminatesByStepUp(map, start)
        })
        .map(uniqPaths)
        .map(paths => paths.length)
        .reduce(sum)
}

function part2(input: string): number {
    return 0
}

console.log("sample")
console.log(`Part 1: ${solve("src/day-10/sample-input.txt", part1)} `)
// console.log(`Part 2: ${ solve("src/day-XX/sample-input.txt", part2) } `)

// console.log("final")
// console.log(`Part 1: ${ solve("src/day-XX/input.txt", part1) } `)
// console.log(`Part 2: ${ solve("src/day-XX/input.txt", part2) } `)
