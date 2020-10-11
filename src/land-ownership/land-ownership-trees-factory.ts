import { TreeFactory as TreesFactory } from '../interfaces'
import { LandOwnershipTrees } from './land-ownership-trees'
import { injectable } from 'inversify'

@injectable()
export class LandOwnershipTreesFactory implements TreesFactory<LandOwnershipTrees> {
    create(): LandOwnershipTrees {
        return new LandOwnershipTrees()
    }
}