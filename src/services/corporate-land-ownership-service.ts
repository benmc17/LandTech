import { injectable, inject } from 'inversify'
import { LandOwnershipTreeLoader, LandOwnershipService } from '../interfaces'
import { LandOwnershipRecord } from '../land-ownership/land-ownership-record'
import { TYPES } from '../types'

@injectable()
export class CorporateLandOwnershipService implements LandOwnershipService {

    private _landOwnershipTreeLoader: LandOwnershipTreeLoader

    constructor(
        @inject(TYPES.LandOwnershipTreeLoader) landOwnershipTreeLoader: LandOwnershipTreeLoader
    ) {
        this._landOwnershipTreeLoader = landOwnershipTreeLoader
    }

    async findRecordById(id: string): Promise<LandOwnershipRecord | null> {
        const {
            _landOwnershipTreeLoader
        } = this

        try {
            const landOwnershipTree = await _landOwnershipTreeLoader.load()

            if(!landOwnershipTree) {
                console.error('Unable to load land ownership tree')
                return null
            }

            return landOwnershipTree.getRecord(id)
        } catch(error) {
            console.error(error)
            return null
        }
    }
}