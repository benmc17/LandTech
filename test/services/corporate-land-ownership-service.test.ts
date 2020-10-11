/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { IMock, Mock } from 'typemoq'
import { LandOwnershipTreeLoader } from '../../src/interfaces'
import { LandOwnershipRecord, LandOwnershipTrees } from '../../src/land-ownership'
import { CorporateLandOwnershipService } from '../../src/services'
import { expect } from 'chai'

describe('The Corporate Land Ownership Service should', () => {

    let subjectOfTest: CorporateLandOwnershipService

    let mockLandOwnershipTreeLoader: IMock<LandOwnershipTreeLoader>

    let mockLandOwnershipTree: IMock<LandOwnershipTrees>

    beforeEach(() => {
        mockLandOwnershipTreeLoader = Mock.ofType<LandOwnershipTreeLoader>(class MockLandOwnershipTreeLoader {
            async load(): Promise<LandOwnershipTrees | null> { return {} as any }
        })

        mockLandOwnershipTree = Mock.ofType<LandOwnershipTrees>(LandOwnershipTrees)

        subjectOfTest = new CorporateLandOwnershipService(mockLandOwnershipTreeLoader.object)
    })

    it('retrieve the land ownership tree from the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipTreeLoader
            .setup((m: LandOwnershipTreeLoader) => m.load())
            .returns(() => Promise.resolve(mockLandOwnershipTree.object))
            .verifiable()

        await subjectOfTest.findRecordById(companyId)

        mockLandOwnershipTreeLoader.verifyAll()
    })

    it('attempt to find the land ownership record for the given company id', async () => {
        const companyId = 'C1234567890'
        const expectedLandOwnershipRecord = new LandOwnershipRecord('R12345', 'Test Company')

        mockLandOwnershipTreeLoader
            .setup((m: LandOwnershipTreeLoader) => m.load())
            .returns(() => Promise.resolve(mockLandOwnershipTree.object))

        mockLandOwnershipTree
            .setup((m: LandOwnershipTrees) => m.getRecord(companyId))
            .returns(() => expectedLandOwnershipRecord)
            .verifiable()

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        mockLandOwnershipTree.verifyAll()
        expect(actualLandOwnershipRecord).to.equal(expectedLandOwnershipRecord)
    })

    it('return null if the tree does not exist in the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipTreeLoader
            .setup((m: LandOwnershipTreeLoader) => m.load())
            .returns(() => Promise.resolve(null))

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })

    it('return null if an unexpected error occurs', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipTreeLoader
            .setup((m: LandOwnershipTreeLoader) => m.load())
            .throws(new Error('Unexpected Error'))

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })
})