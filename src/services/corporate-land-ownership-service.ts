import { injectable, inject } from 'inversify'
import { LandOwnershipDataLoader, LandOwnershipService } from '../interfaces'
import { LandOwnershipRecord } from '../land-ownership/land-ownership-record'
import { TYPES } from '../types'
import 'reflect-metadata'

@injectable()
export class CorporateLandOwnershipService implements LandOwnershipService {

    private _landOwnershipDataLoader: LandOwnershipDataLoader

    constructor(
        @inject(TYPES.LandOwnershipDataLoader) landOwnershipDataLoader: LandOwnershipDataLoader
    ) {
        this._landOwnershipDataLoader = landOwnershipDataLoader
    }

    async findRecordById(id: string): Promise<LandOwnershipRecord | null> {
        const {
            _landOwnershipDataLoader
        } = this

        try {
            const landOwnershipData = await _landOwnershipDataLoader.load()

            if(!landOwnershipData) {
                console.error('Unable to load land ownership data')
                return null
            }

            return landOwnershipData.getRecord(id)
        } catch(error) {
            console.error(error)
            return null
        }
    }
}