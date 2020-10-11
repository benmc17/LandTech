import { LandOwnershipRepository, LandOwnershipService } from "../interfaces";
import { LandOwnershipRecord } from "../land-ownership/land-ownership-record";

export class CorporateLandOwnershipService implements LandOwnershipService {

    private _landOwnershipRepository: LandOwnershipRepository

    constructor(landOwnershipRespository: LandOwnershipRepository) {
        this._landOwnershipRepository = landOwnershipRespository
    }

    async findById(id: string): Promise<LandOwnershipRecord | null> {
        const {
            _landOwnershipRepository
        } = this

        try {
            const landOwnershipTree = await _landOwnershipRepository.loadTree()

            if(!landOwnershipTree) {
                console.error('Unable to load land ownership tree')
                return null
            }

            return landOwnershipTree.traverseToCompanyRecord(id)
        } catch(error) {
            console.error(error)
            return null
        }
    }
}