/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { LandOwnershipRecord } from '../../src/land-ownership'
import { expect } from 'chai'

describe('The Land Ownership Record should', () => {

    it('process each node in the land ownership tree from the root', () => {
        const subject = new LandOwnershipRecord('subject', 'subject', [])

        const root = new LandOwnershipRecord('root', 'root', [])
        const level1 = new LandOwnershipRecord('level1', 'level1', [])
        const level2 = new LandOwnershipRecord('level2', 'level2', [])
        const level3 = new LandOwnershipRecord('level3', 'level3', [])

        root.addSubCompany(level1)
        level1.addSubCompany(level2)
        level2.addSubCompany(level3)
        level3.addSubCompany(subject)

        subject.setParent(level3)
        level3.setParent(level2)
        level2.setParent(level1)
        level1.setParent(root)

        const stack: LandOwnershipRecord[] = []

        subject.processFromRoot((node: LandOwnershipRecord) => {
            stack.push(node)
        })

        expect(stack.pop()).to.equal(subject)
        expect(stack.pop()).to.equal(level3)
        expect(stack.pop()).to.equal(level2)
        expect(stack.pop()).to.equal(level1)
        expect(stack.pop()).to.equal(root)
        expect(stack).to.be.empty
    })

    it('also output siblings inline with the current node excluding any child nodes', () => {
        const subject = new LandOwnershipRecord('subject', 'subject', [])

        const root = new LandOwnershipRecord('root', 'root', [])
        const child = new LandOwnershipRecord('child', 'child', [])
        const sibling1 = new LandOwnershipRecord('sibling1', 'sibling1', [])
        const sibling2 = new LandOwnershipRecord('sibling2', 'sibling2', [])
        const sibling3 = new LandOwnershipRecord('sibling3', 'sibling3', [])

        root.addSubCompany(sibling1)
        root.addSubCompany(sibling2)
        root.addSubCompany(subject)
        root.addSubCompany(sibling3)

        sibling2.addSubCompany(child)

        subject.setParent(root)
        sibling1.setParent(root)
        sibling2.setParent(root)
        sibling3.setParent(root)

        child.setParent(sibling2)

        const stack: LandOwnershipRecord[] = []

        subject.processFromRoot((node: LandOwnershipRecord) => {
            stack.push(node)
        })

        expect(stack.pop()).to.equal(sibling3)
        expect(stack.pop()).to.equal(subject)
        expect(stack.pop()).to.equal(sibling2)
        expect(stack.pop()).to.equal(sibling1)
        expect(stack.pop()).to.equal(root)
        expect(stack).to.be.empty
    })

    it('return without processing any nodes if the given node is the root', () => {
        const subject = new LandOwnershipRecord('subject', 'subject', [])

        const stack: LandOwnershipRecord[] = []

        subject.processFromRoot((node: LandOwnershipRecord) => {
            stack.push(node)
        })

        expect(stack.pop()).to.equal(subject)
        expect(stack).to.be.empty
    })

    it('expand the given subtree into a queue', () => {
        const subject = new LandOwnershipRecord('subject', 'subject', [])

        const child1 = new LandOwnershipRecord('child1', 'child1', [])
        const child2 = new LandOwnershipRecord('child2', 'child2', [])
        const child3 = new LandOwnershipRecord('child3', 'child3', [])
        const child21 = new LandOwnershipRecord('child21', 'child21', [])
        const child22 = new LandOwnershipRecord('child22', 'child22', [])

        subject.addSubCompany(child1)
        subject.addSubCompany(child2)
        subject.addSubCompany(child3)

        child1.setParent(subject)
        child2.setParent(subject)
        child3.setParent(subject)

        child2.addSubCompany(child21)
        child2.addSubCompany(child22)

        child21.setParent(child2)
        child22.setParent(child2)

        const stack: LandOwnershipRecord[] = []

        subject.expand((node: LandOwnershipRecord) => {
            stack.push(node)
        })

        expect(stack.pop()).to.equal(child3)
        expect(stack.pop()).to.equal(child22)
        expect(stack.pop()).to.equal(child21)
        expect(stack.pop()).to.equal(child2)
        expect(stack.pop()).to.equal(child1)
        expect(stack.pop()).to.equal(subject)
        expect(stack).to.be.empty
    })
})