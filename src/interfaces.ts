import { LandOwnershipRecord, LandOwnershipTrees } from './land-ownership'

export interface CommandParser {
    parse(inputStrings: string[]): { command: string, options: { [option: string]: string } }
}

export interface CsvReader {
    read(file: string, processRow: (row: { [column: string]: string }) => void): Promise<void>
}

export interface LandOwnershipService {
    findRecordById(id: string): Promise<LandOwnershipRecord | null>
}

export interface LandOwnershipTreeLoader {
    load(): Promise<LandOwnershipTrees | null>
}

export interface ResponsePrinter {
    printLandOwnershipRecordToRoot(landOwnershipRecord: LandOwnershipRecord): void
    printExpandedLandOwnershipRecord(landOwnershipRecord: LandOwnershipRecord): void
    printHelp(): void
    printError(errorMessage: string): void
}

export interface TreeFactory<T> {
    create(): T
}

export interface UserInterface {
    processInputCommands(commands: string[]): Promise<void>
}