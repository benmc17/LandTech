import { LandOwnershipRecord } from '../land-ownership'

export interface ResponsePrinter {
    printLandOwnershipRecordToRoot(landOwnershipRecord: LandOwnershipRecord): void
    printExpandedLandOwnershipRecord(landOwnershipRecord: LandOwnershipRecord): void
    printHelp(): void
    printError(errorMessage: string): void
}