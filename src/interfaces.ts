import { LandOwnershipRecord, LandOwnershipData } from './land-ownership'

export interface CommandParser {
    parse(inputStrings: string[]): { command: string, options: { [option: string]: string } }
}

export interface CsvReader {
    read(file: string, processRow: (row: { [column: string]: string }) => void): Promise<void>
}

export interface LandOwnershipService {
    findRecordById(id: string): Promise<LandOwnershipRecord | null>
}

export interface LandOwnershipDataLoader {
    load(): Promise<LandOwnershipData | null>
}

export interface ResponsePrinter {
    printLandOwnershipRecord(landOwnershipRecord: LandOwnershipRecord, level: number): void
    printHelp(): void
    printError(errorMessage: string): void
}

export interface DataFactory<T> {
    create(): T
}

export interface UserInterface {
    processInputCommands(commands: string[]): Promise<void>
}