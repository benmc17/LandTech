import { DataFactory } from '../interfaces'
import { LandOwnershipData } from './land-ownership-data'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class LandOwnershipDataFactory implements DataFactory<LandOwnershipData> {
    create(): LandOwnershipData {
        return new LandOwnershipData()
    }
}