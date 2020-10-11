export class LandOwnershipRecord {

    private _id: string

    private _name: string

    private _landParcels: string[]

    private _subCompanies: LandOwnershipRecord[]

    private _parent?: LandOwnershipRecord

    constructor(id: string, name: string, landParcels?: string[]) {
        this._id = id
        this._name = name
        this._landParcels = landParcels || []
        this._subCompanies = []
    }

    getId(): string {
        return this._id
    }

    getName(): string {
        return this._name
    }

    getLandParcels(): string[] {
        return this._landParcels
    }

    getSubCompanies(): LandOwnershipRecord[] {
        return this._subCompanies
    }

    addSubCompany(company: LandOwnershipRecord): void {
        this._subCompanies.push(company)
    }

    setParent(parent: LandOwnershipRecord): void {
        this._parent = parent
    }

    getParent(): LandOwnershipRecord | undefined {
        return this._parent
    }
}