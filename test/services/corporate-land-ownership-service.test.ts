/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { IMock, Mock } from 'typemoq'
import { LandOwnershipDataLoader } from '../../src/interfaces'
import { LandOwnershipRecord, LandOwnershipData } from '../../src/land-ownership'
import { CorporateLandOwnershipService } from '../../src/services'
import { expect } from 'chai'

describe('The Corporate Land Ownership Service should', () => {

    let subjectOfTest: CorporateLandOwnershipService

    let mockLandOwnershipDataLoader: IMock<LandOwnershipDataLoader>

    let mockLandOwnershipData: IMock<LandOwnershipData>

    beforeEach(() => {
        mockLandOwnershipDataLoader = Mock.ofType<LandOwnershipDataLoader>(class MockLandOwnershipTreeLoader {
            async load(): Promise<LandOwnershipData | null> { return {} as any }
        })

        mockLandOwnershipData = Mock.ofType<LandOwnershipData>(LandOwnershipData)

        subjectOfTest = new CorporateLandOwnershipService(mockLandOwnershipDataLoader.object)
    })

    it('retrieve the land ownership data from the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipDataLoader
            .setup((m: LandOwnershipDataLoader) => m.load())
            .returns(() => Promise.resolve(mockLandOwnershipData.object))
            .verifiable()

        await subjectOfTest.findRecordById(companyId)

        mockLandOwnershipDataLoader.verifyAll()
    })

    it('attempt to find the land ownership record for the given company id', async () => {
        const companyId = 'C1234567890'
        const expectedLandOwnershipRecord = new LandOwnershipRecord('R12345', 'Test Company')

        mockLandOwnershipDataLoader
            .setup((m: LandOwnershipDataLoader) => m.load())
            .returns(() => Promise.resolve(mockLandOwnershipData.object))

        mockLandOwnershipData
            .setup((m: LandOwnershipData) => m.getRecord(companyId))
            .returns(() => expectedLandOwnershipRecord)
            .verifiable()

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        mockLandOwnershipData.verifyAll()
        expect(actualLandOwnershipRecord).to.equal(expectedLandOwnershipRecord)
    })

    it('return null if the company does not exist in the repository', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipDataLoader
            .setup((m: LandOwnershipDataLoader) => m.load())
            .returns(() => Promise.resolve(null))

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })

    it('return null if an unexpected error occurs', async () => {
        const companyId = 'C1234567890'

        mockLandOwnershipDataLoader
            .setup((m: LandOwnershipDataLoader) => m.load())
            .throws(new Error('Unexpected Error'))

        const actualLandOwnershipRecord = await subjectOfTest.findRecordById(companyId)

        expect(actualLandOwnershipRecord).to.be.null
    })
})