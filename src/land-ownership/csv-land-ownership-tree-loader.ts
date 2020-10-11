import { injectable, inject } from 'inversify'
import { CsvReader, LandOwnershipTreeLoader, TreeFactory } from '../interfaces'
import { TYPES } from '../types'
import { LandOwnershipRecord } from './land-ownership-record'
import { LandOwnershipTrees } from './land-ownership-trees'

@injectable()
export class CsvLandOwnershipTreeLoader implements LandOwnershipTreeLoader {

    private static readonly CompanyRelationsCsvFile = './data/company_relations.csv'

    private static readonly LandOwnershipCsvFile = './data/land_ownership.csv'

    private _csvReader: CsvReader

    private _treeFactory: TreeFactory<LandOwnershipTrees>

    constructor(
        @inject(TYPES.CsvReader) csvReader: CsvReader,
        @inject(TYPES.TreeFactory) treeFactory: TreeFactory<LandOwnershipTrees>
    ) {
        this._csvReader = csvReader
        this._treeFactory = treeFactory

        this._readLandOwnership = this._readLandOwnership.bind(this)
        this._readCompanyRelationsAndBuildTree = this._readCompanyRelationsAndBuildTree.bind(this)
    }

    async load(): Promise<LandOwnershipTrees | null> {
        const {
            _readLandOwnership,
            _readCompanyRelationsAndBuildTree
        } = this

        const landOwnership = await _readLandOwnership()
        const tree = await _readCompanyRelationsAndBuildTree(landOwnership)

        return tree
    }

    private async _readLandOwnership(): Promise<{ [companyId: string]: string[] }> {
        const landOwnership: { [companyId: string]: string[] } = {}

        await this._csvReader.read(
            CsvLandOwnershipTreeLoader.LandOwnershipCsvFile,
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

    private async _readCompanyRelationsAndBuildTree(landOwnership: { [companyId: string]: string[] }): Promise<LandOwnershipTrees> {
        const {
            _treeFactory,
            _csvReader
        } = this

        const tree = _treeFactory.create()
        
        await _csvReader.read(
            CsvLandOwnershipTreeLoader.CompanyRelationsCsvFile,
            (row: { [column: string]: string } ): void => {
                const landParcels = landOwnership[row.company_id]
                const record = new LandOwnershipRecord(row.company_id, row.name, landParcels)
                tree.addRecord(record, row.parent)
            }
        )

        return tree
    }
}