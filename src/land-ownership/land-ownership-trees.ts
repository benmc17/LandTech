import { LandOwnershipRecord } from '.'

export class LandOwnershipTrees {

    private _companyRelationshipTrees: { [companyId: string]: LandOwnershipRecord }

    private _orphanedSubCompanies: { [parentId: string]: LandOwnershipRecord[] }

    constructor() {
        this._companyRelationshipTrees = {}
        this._orphanedSubCompanies = {}

        this.getRecord = this.getRecord.bind(this)
        this.addRecord = this.addRecord.bind(this)
        this._addToTree = this._addToTree.bind(this)
        this._addToOrphanedList = this._addToOrphanedList.bind(this)
        this._checkOrphanedListForSubCompanies = this._checkOrphanedListForSubCompanies.bind(this)
    }

    getRecord(companyId: string): LandOwnershipRecord {
        return this._companyRelationshipTrees[companyId] || null
    }

    addRecord(child: LandOwnershipRecord, parentId: string): boolean {
        const {
            _companyRelationshipTrees,
            _addToTree,
            _addToOrphanedList,
            _checkOrphanedListForSubCompanies
        } = this

        const companyId = child.getId()

        if(!parentId) {
            _companyRelationshipTrees[companyId] = child
            _checkOrphanedListForSubCompanies(companyId)
            return true
        }

        const parent = _companyRelationshipTrees[parentId]

        if(!parent) {
            _addToOrphanedList(child, parentId)
            return false
        }

        _addToTree(child, parent)
        _checkOrphanedListForSubCompanies(companyId)
        return true
    }

    private _addToTree(child: LandOwnershipRecord, parent: LandOwnershipRecord) {
        child.setParent(parent)
        parent.addSubCompany(child)
        this._companyRelationshipTrees[child.getId()] = child
    }

    private _addToOrphanedList(child: LandOwnershipRecord, parentId: string) {
        const {
            _orphanedSubCompanies
        } = this

        let orphanedForParent = _orphanedSubCompanies[parentId]

        if(!orphanedForParent) {
            orphanedForParent = []
            _orphanedSubCompanies[parentId] = orphanedForParent
        }
        orphanedForParent.push(child)
    }

    private _checkOrphanedListForSubCompanies(companyId: string) {
        const {
            _orphanedSubCompanies,
            addRecord
        } = this

        const orphaned = _orphanedSubCompanies[companyId]

        if(orphaned) {
            orphaned.forEach((orphan: LandOwnershipRecord) => {
                addRecord(orphan, companyId)
            })
            delete _orphanedSubCompanies[companyId]
        }
    }
}