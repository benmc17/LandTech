/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off", @typescript-eslint/no-unused-vars: "off" */
import 'mocha'
import { IMock, It, Mock } from 'typemoq'
import { CsvReader, DataFactory } from '../../src/interfaces'
import { LandOwnershipCsvDataLoader, LandOwnershipRecord, LandOwnershipData } from '../../src/land-ownership'
import { expect } from 'chai'

describe('The Land Ownership CSV Data Loader should', () => {

    let subjectOfTest: LandOwnershipCsvDataLoader

    let mockCsvReader: IMock<CsvReader>

    let mockDataFactory: IMock<DataFactory<LandOwnershipData>>

    let mockLandOwnershipData: IMock<LandOwnershipData>

    beforeEach(() => {
        mockCsvReader = Mock.ofType<CsvReader>(class MockCsvReader {
            async read(): Promise<void> { return }
        })
        mockDataFactory = Mock.ofType<DataFactory<LandOwnershipData>>(class MockTreeFactory {
            create(): LandOwnershipData { return {} as any }
        })
        mockLandOwnershipData = Mock.ofType<LandOwnershipData>(LandOwnershipData)

        subjectOfTest = new LandOwnershipCsvDataLoader(mockCsvReader.object, mockDataFactory.object)
    })

    it('use data from the company_relations CSV file to build company relations trees', async () => {
        const companyRelationsRow1 = {
            company_id: 'C123456',
            name: 'Child Company 1',
            parent: 'R987654'
        }

        const landOwnershipRow1 = {
            land_id: 'L12345',
            company_id: 'R987688'
        }

        mockDataFactory
            .setup((m: DataFactory<LandOwnershipData>) => m.create())
            .returns(() => mockLandOwnershipData.object)
            .verifiable()
        
        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/company_relations.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(companyRelationsRow1)
            })
            .verifiable()

        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/land_ownership.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(landOwnershipRow1)
            })

        mockLandOwnershipData
            .setup((m: LandOwnershipData) => m.addRecord(It.isAny(), It.isAny()))
            .returns(() => true)
        
        const tree = await subjectOfTest.load()

        expect(tree).to.not.be.null

        mockDataFactory.verifyAll()
        mockCsvReader.verifyAll()
    })

    it('create nodes on the tree collection for the loaded company records', async () => {
        const companyRelationsRow1 = {
            company_id: 'C123456',
            name: 'Child Company 1',
            parent: 'R987654'
        }
        const companyRelationsRow2 = {
            company_id: 'R987654',
            name: 'Parent Company'
        }
        const companyRelationsRow3 = {
            company_id: 'R987688',
            name: 'Child Company 2',
            parent: 'R987654'
        }

        const landOwnershipRow1 = {
            land_id: 'L12345',
            company_id: 'R987688'
        }
        const landOwnershipRow2 = {
            land_id: 'L12346',
            company_id: 'R987654'
        }
        const actualRecords: { [companyId: string]: LandOwnershipRecord } = {}

        mockDataFactory
            .setup((m: DataFactory<LandOwnershipData>) => m.create())
            .returns(() => mockLandOwnershipData.object)
        
        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/company_relations.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(companyRelationsRow1)
                processRow(companyRelationsRow2)
                processRow(companyRelationsRow3)
            })

        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/land_ownership.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(landOwnershipRow1)
                processRow(landOwnershipRow2)
            })

        mockLandOwnershipData
            .setup((m: LandOwnershipData) => m.addRecord(It.isAny(), It.isAny()))
            .callback((record: LandOwnershipRecord, _?: string) => {
                actualRecords[record.getId()] = record
            })
            .returns(() => true)
        
        const tree = await subjectOfTest.load()

        expect(tree).to.not.be.null

        const actualRecord1 = actualRecords[companyRelationsRow1.company_id]
        const actualRecord2 = actualRecords[companyRelationsRow2.company_id]
        const actualRecord3 = actualRecords[companyRelationsRow3.company_id]

        expect(actualRecord1).not.to.be.undefined
        expect(actualRecord2).not.to.be.undefined
        expect(actualRecord3).not.to.be.undefined

        expect(actualRecord1.getId()).to.equal(companyRelationsRow1.company_id)
        expect(actualRecord2.getId()).to.equal(companyRelationsRow2.company_id)
        expect(actualRecord3.getId()).to.equal(companyRelationsRow3.company_id)

        expect(actualRecord1.getName()).to.equal(companyRelationsRow1.name)
        expect(actualRecord2.getName()).to.equal(companyRelationsRow2.name)
        expect(actualRecord3.getName()).to.equal(companyRelationsRow3.name)
    })

    it('use data from the land_ownership CSV files to populate the land parcel records for each company', async () => {
        const companyRelationsRow1 = {
            company_id: 'C123456',
            name: 'Child Company 1',
            parent: 'R987654'
        }

        const landOwnershipRow1 = {
            land_id: 'L12345',
            company_id: 'C123456'
        }

        const landOwnershipRow2 = {
            land_id: 'L12346',
            company_id: 'C123456'
        }

        const actualRecords: LandOwnershipRecord[] = []

        mockDataFactory
            .setup((m: DataFactory<LandOwnershipData>) => m.create())
            .returns(() => mockLandOwnershipData.object)
        
        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/company_relations.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(companyRelationsRow1)
            })

        mockCsvReader
            .setup((m: CsvReader) => m.read('./data/land_ownership.csv', It.isAny()))
            .callback((_: string, processRow: (row: { [column: string]: string }) => void) => {
                processRow(landOwnershipRow1)
                processRow(landOwnershipRow2)
            })
            .verifiable()

        mockLandOwnershipData
            .setup((m: LandOwnershipData) => m.addRecord(It.isAny(), It.isAny()))
            .callback((record: LandOwnershipRecord, _?: string) => {
                actualRecords.push(record)
            })
            .returns(() => true)
        
        const tree = await subjectOfTest.load()

        expect(tree).to.not.be.null
        expect(actualRecords[0]).not.to.be.undefined

        expect(actualRecords[0].getLandParcels()).to.contain(landOwnershipRow1.land_id)
        expect(actualRecords[0].getLandParcels()).to.contain(landOwnershipRow2.land_id)
    })
})