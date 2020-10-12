/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { LandOwnershipData, LandOwnershipRecord } from '../../src/land-ownership'
import { expect } from 'chai'

describe('The Land Ownership Data object should', () => {

    it('add a record at the correct level in the relvent land ownership record heirarchy', () => {
        const subject = new LandOwnershipData()

        const root = new LandOwnershipRecord('root', 'root', [])
        const level1 = new LandOwnershipRecord('level1', 'level1', [])
        const level2 = new LandOwnershipRecord('level2', 'level2', [])
        const level3 = new LandOwnershipRecord('level3', 'level3', [])

        subject.addRecord(root)
        subject.addRecord(level1, root.getId())
        subject.addRecord(level2, level1.getId())
        subject.addRecord(level3, level2.getId())

        expect(root.getSubCompanies()).to.have.lengthOf(1)
        expect(level1.getSubCompanies()).to.have.lengthOf(1)
        expect(level2.getSubCompanies()).to.have.lengthOf(1)
        expect(level3.getSubCompanies()).to.have.lengthOf(0)

        expect(root.getParent()).to.be.undefined
        expect(level1.getParent()).to.equal(root)
        expect(level2.getParent()).to.equal(level1)
        expect(level3.getParent()).to.equal(level2)
    })

    it('allow insertion of records in any order, even if a child record is inserted before its parent', () => {
        const subject = new LandOwnershipData()

        const root = new LandOwnershipRecord('root', 'root', [])
        const level1 = new LandOwnershipRecord('level1', 'level1', [])
        const level2 = new LandOwnershipRecord('level2', 'level2', [])
        const level3a = new LandOwnershipRecord('level3', 'level3', [])
        const level3b = new LandOwnershipRecord('level3', 'level3', [])

        subject.addRecord(level3a, level2.getId())
        subject.addRecord(level1, root.getId())
        subject.addRecord(root)
        subject.addRecord(level2, level1.getId())
        subject.addRecord(level3b, level2.getId())

        expect(root.getSubCompanies()).to.have.lengthOf(1)
        expect(level1.getSubCompanies()).to.have.lengthOf(1)
        expect(level2.getSubCompanies()).to.have.lengthOf(2)
        expect(level3a.getSubCompanies()).to.have.lengthOf(0)
        expect(level3b.getSubCompanies()).to.have.lengthOf(0)

        expect(root.getParent()).to.be.undefined
        expect(level1.getParent()).to.equal(root)
        expect(level2.getParent()).to.equal(level1)
        expect(level3a.getParent()).to.equal(level2)
        expect(level3b.getParent()).to.equal(level2)
    })
})