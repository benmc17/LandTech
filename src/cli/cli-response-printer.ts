import { ResponsePrinter } from '../interfaces'
import { LandOwnershipRecord } from '../land-ownership'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class CliResponsePrinter implements ResponsePrinter {

    constructor() {
        this.printLandOwnershipRecordToRoot = this.printLandOwnershipRecordToRoot.bind(this)
        this.printExpandedLandOwnershipRecord = this.printExpandedLandOwnershipRecord.bind(this)
        this.printHelp = this.printHelp.bind(this)
        this.printError = this.printError.bind(this)
        this._processRecord = this._processRecord.bind(this)
        this._getTreeMarkingForLevel = this._getTreeMarkingForLevel.bind(this)
    }

    printLandOwnershipRecordToRoot(landOwnershipRecord: LandOwnershipRecord): void {
        landOwnershipRecord.processRecordsFromRoot(this._processRecord)
    }

    printExpandedLandOwnershipRecord(landOwnershipRecord: LandOwnershipRecord): void {
        landOwnershipRecord.expandRecords(this._processRecord)
    }

    printHelp(): void {
        console.log('Usage:')
        console.log('\tlandtree <company id> (the mode will default to from_root)')
        console.log('\tlandtree --mode from_root <company id>')
        console.log('\tlandtree --mode expand <company id>')
        console.log('\tlandtree help')
    }

    printError(errorMessage: string): void {
        console.log(errorMessage)
        this.printHelp()
    }

    private _processRecord(node: LandOwnershipRecord, level: number) {
        const treeMarking = this._getTreeMarkingForLevel(level)
        const row = `${treeMarking} ${node.getId()}; ${node.getName()}; owner of ${node.getLandParcels().length} land parcels`
        console.log(row)
    }

    private _getTreeMarkingForLevel(level: number) {
        let treeMarking = ''

        if(level > 0) {
            treeMarking = ' | '.repeat(level)
            treeMarking += ' - '
        }

        return treeMarking
    }
}