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

        this.processFromRoot = this.processFromRoot.bind(this)
        this.expand = this.expand.bind(this)
        this.getId = this.getId.bind(this)
        this.getName = this.getName.bind(this)
        this.getLandParcels = this.getLandParcels.bind(this)
        this.getSubCompanies = this.getSubCompanies.bind(this)
        this.addSubCompany = this.addSubCompany.bind(this)
        this.setParent = this.setParent.bind(this)
        this.getParent = this.getParent.bind(this)
        this._processChildNodes = this._processChildNodes.bind(this)
        this._traceNodesToRoot = this._traceNodesToRoot.bind(this)
        this._expandNode = this._expandNode.bind(this)
    }

    processFromRoot(forEachNode: (node: LandOwnershipRecord, level: number) => void): void {
        const stack = this._traceNodesToRoot()
        const root = stack.pop()

        if(root) {
            forEachNode(root, 0)
            this._processChildNodes(forEachNode, root, stack, 1)
        }
    }

    expand(forEachNode: (node: LandOwnershipRecord, level: number) => void): void {
        forEachNode(this, 0)
        this._expandNode(forEachNode, this, 1)
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

    private _processChildNodes(forEachNode: (node: LandOwnershipRecord, level: number) => void, parent: LandOwnershipRecord, stack: LandOwnershipRecord[], level: number) {
        const child = stack.pop()

        if(!child) return

        const subCompanies = parent?.getSubCompanies() || []

        for(let i = 0; i < subCompanies.length; i++) {
            const node = subCompanies[i]

            forEachNode(node, level)

            if(node == child) {
                this._processChildNodes(forEachNode, node, stack, level+1)
            }
        }
    }

    private _traceNodesToRoot() {
        const stack = []
        stack.push(this)
        let parent = this._parent

        while(parent) {
            stack.push(parent)
            parent = parent.getParent()
        }

        return stack
    }

    private _expandNode(forEachNode: (node: LandOwnershipRecord, level: number) => void, node: LandOwnershipRecord, level: number) {
        const childNodes = node.getSubCompanies()
        
        for(let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i]
            forEachNode(child, level)
            this._expandNode(forEachNode, child, level+1)
        }
    }
}