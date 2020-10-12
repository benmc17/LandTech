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

        this.getId = this.getId.bind(this)
        this.getName = this.getName.bind(this)
        this.getLandParcels = this.getLandParcels.bind(this)
        this.getSubCompanies = this.getSubCompanies.bind(this)
        this.addSubCompany = this.addSubCompany.bind(this)
        this.setParent = this.setParent.bind(this)
        this.getParent = this.getParent.bind(this)
        this._queueNodesToRoot = this._queueNodesToRoot.bind(this)
        this._queueChildNodes = this._queueChildNodes.bind(this)
        this._traceNodesToRoot = this._traceNodesToRoot.bind(this)
    }

    processRecordsFromRoot(processNode: (node: LandOwnershipRecord, level: number) => void): void {
        const pathToRoot = this._queueNodesToRoot()
        let node = pathToRoot.shift()

        while(node) {
            processNode(node.record, node.level)
            node = pathToRoot.shift()
        }
    }

    expandRecords(processNode: (node: LandOwnershipRecord, level: number) => void): void {
        const pathToRoot = this._queueExpandedNodes()
        let node = pathToRoot.shift()

        while(node) {
            processNode(node.record, node.level)
            node = pathToRoot.shift()
        }
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

    private _queueNodesToRoot(): { record: LandOwnershipRecord, level: number }[] {
        const stack = this._traceNodesToRoot()

        const queue: { record: LandOwnershipRecord, level: number }[] = []

        const root = stack.pop()

        if(root) {
            queue.push({
                record: root,
                level: 0
            })

            this._queueChildNodes(root, stack, queue, 1)
        }

        return queue
    }

    private _queueChildNodes(parent: LandOwnershipRecord, stack: LandOwnershipRecord[], queue: { record: LandOwnershipRecord, level: number }[], level: number) {
        const child = stack.pop()

        if(!child) return

        const subCompanies = parent?.getSubCompanies() || []

        for(let i = 0; i < subCompanies.length; i++) {
            const node = subCompanies[i]

            queue.push({
                record: node,
                level
            })

            if(node == child) {
                this._queueChildNodes(node, stack, queue, level+1)
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

    private _queueExpandedNodes() {
        const queue: { record: LandOwnershipRecord, level: number }[] = []

        queue.push({ 
            record: this, 
            level: 0 
        })

        this._expandNode(this, queue, 1)

        return queue
    }

    private _expandNode(node: LandOwnershipRecord, queue: { record: LandOwnershipRecord, level: number }[], level: number) {
        const childNodes = node.getSubCompanies()
        
        for(let i = 0; i < childNodes.length; i++) {
            const child = childNodes[i]

            queue.push({ 
                record: child, 
                level 
            })

            this._expandNode(child, queue, level+1)
        }
    }
}