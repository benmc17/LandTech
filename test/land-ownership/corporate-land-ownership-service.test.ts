/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { IMock, Mock } from 'typemoq'
import { LandOwnershipRepository } from '../../src/interfaces'
import { LandOwnershipRecord, LandOwnershipTree } from '../../src/land-ownership'
import { CorporateLandOwnershipService } from '../../src/services'
import { expect } from 'chai'

describe('The Corporate Land Ownership Service should', () => {

    let subjectOfTest: CorporateLandOwnershipService

    let mockLandOwnershipRepository: IMock<LandOwnershipRepository>

    let mockLandOwnershipTree: IMock<LandOwnershipTree>

    beforeEach(() => {
        mockLandOwnershipRepository = Mock.ofType<LandOwnershipRepository>(class MockLandOwnershipRepository {
            async loadTree(): Promise<LandOwnershipTree | null> { return {} as any }
        })

        mockLandOwnershipTree = Mock.ofType<LandOwnershipTree>(class MockLandOwnershipTree {
            traverseToCompanyRecord(): LandOwnershipRecord { return {} }
        })

        subjectOfTest = new CorporateLandOwnershipService(mockLandOwnershipRepository.object)
    })

    it('retrieve the land ownership tree from the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipRepository
            .setup((m: LandOwnershipRepository) => m.loadTree())
            .returns(() => Promise.resolve(mockLandOwnershipTree.object))
            .verifiable()

        await subjectOfTest.findById(companyId)

        mockLandOwnershipRepository.verifyAll()
    })

    it('attempt to find the land ownership record for the given company id', async () => {
        const companyId = 'C1234567890'
        const expectedLandOwnershipRecord = new LandOwnershipRecord()

        mockLandOwnershipRepository
            .setup((m: LandOwnershipRepository) => m.loadTree())
            .returns(() => Promise.resolve(mockLandOwnershipTree.object))

        mockLandOwnershipTree
            .setup((m: LandOwnershipTree) => m.traverseToCompanyRecord(companyId))
            .returns(() => expectedLandOwnershipRecord)
            .verifiable()

        const actualLandOwnershipRecord = await subjectOfTest.findById(companyId)

        mockLandOwnershipTree.verifyAll()
        expect(actualLandOwnershipRecord).to.equal(expectedLandOwnershipRecord)
    })

    it('return null if the tree does not exist in the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipRepository
            .setup((m: LandOwnershipRepository) => m.loadTree())
            .returns(() => Promise.resolve(null))

        const actualLandOwnershipRecord = await subjectOfTest.findById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })

    it('return null if an unexpected error occurs', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipRepository
            .setup((m: LandOwnershipRepository) => m.loadTree())
            .throws(new Error('Unexpected Error'))

        const actualLandOwnershipRecord = await subjectOfTest.findById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })
})