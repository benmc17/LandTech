import { LandOwnershipTree } from "../land-ownership";

export interface LandOwnershipRepository {
    loadTree(): Promise<LandOwnershipTree | null>
}