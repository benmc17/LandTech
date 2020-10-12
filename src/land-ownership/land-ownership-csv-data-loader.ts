import { injectable, inject } from 'inversify'
import { CsvReader, LandOwnershipDataLoader, DataFactory } from '../interfaces'
import { TYPES } from '../types'
import { LandOwnershipRecord } from './land-ownership-record'
import { LandOwnershipData } from './land-ownership-data'
import 'reflect-metadata'

@injectable()
export class LandOwnershipCsvDataLoader implements LandOwnershipDataLoader {

    private static readonly CompanyRelationsCsvFile = './data/company_relations.csv'

    private static readonly LandOwnershipCsvFile = './data/land_ownership.csv'

    private _csvReader: CsvReader

    private _dataFactory: DataFactory<LandOwnershipData>

    constructor(
        @inject(TYPES.CsvReader) csvReader: CsvReader,
        @inject(TYPES.DataFactory) dataFactory: DataFactory<LandOwnershipData>
    ) {
        this._csvReader = csvReader
        this._dataFactory = dataFactory

        this._readLandOwnership = this._readLandOwnership.bind(this)
        this._readCompanyRelationsAndBuildTrees = this._readCompanyRelationsAndBuildTrees.bind(this)
    }

    async load(): Promise<LandOwnershipData | null> {
        const {
            _readLandOwnership,
            _readCompanyRelationsAndBuildTrees
        } = this

        const landOwnership = await _readLandOwnership()
        const landOwnershipTrees = await _readCompanyRelationsAndBuildTrees(landOwnership)

        return landOwnershipTrees
    }

    private async _readLandOwnership(): Promise<{ [companyId: string]: string[] }> {
        const landOwnership: { [companyId: string]: string[] } = {}

        await this._csvReader.read(
            LandOwnershipCsvDataLoader.LandOwnershipCsvFile,
            (row: { [column: string]: string } ): void => {
                const companyId = row.company_id
                const landId = row.land_id

                let companyLand = landOwnership[companyId]

                if(!companyLand) {
                    companyLand = []
                    landOwnership[companyId] = companyLand
                }
                companyLand.push(landId)
            }
        )

        return landOwnership
    }

    private async _readCompanyRelationsAndBuildTrees(landOwnership: { [companyId: string]: string[] }): Promise<LandOwnershipData> {
        const {
            _dataFactory,
            _csvReader
        } = this

        const landOwnershipTrees = _dataFactory.create()
        
        await _csvReader.read(
            LandOwnershipCsvDataLoader.CompanyRelationsCsvFile,
            (row: { [column: string]: string } ): void => {
                const landParcels = landOwnership[row.company_id]
                const record = new LandOwnershipRecord(row.company_id, row.name, landParcels)
                landOwnershipTrees.addRecord(record, row.parent)
            }
        )

        return landOwnershipTrees
    }
}