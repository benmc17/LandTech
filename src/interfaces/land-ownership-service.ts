import { LandOwnershipRecord } from '../land-ownership'

export interface LandOwnershipService {
    findById(id: string): Promise<LandOwnershipRecord | null>
}