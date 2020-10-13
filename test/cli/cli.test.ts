/* eslint @typescript-eslint/no-empty-function: "off", @typescript-eslint/no-explicit-any: "off" */
import 'mocha'
import { IMock, It, Mock, Times } from 'typemoq'
import { Cli } from '../../src/cli/cli'
import { LandOwnershipService, ResponsePrinter } from '../../src/interfaces'
import { CommandParser } from '../../src/interfaces'
import { LandOwnershipRecord } from '../../src/land-ownership'

describe('The CLI should', () => {

    const validCompanyIds: string[] = [
        'C12345',
        'R1234567890123',
        'CR123457789012',
        'S2432543436666'
    ]

    const invalidCompanyIds: any[] = [
        '',
        123456,
        'THIS-IS-A-TEST',
        'THIS_IS_A_TEST',
        true,
        '{}',
        '""',
        '~',
        'a12345',
        'abcd'
    ]

    let subjectOfTest: Cli

    let mockLandOwnershipService: IMock<LandOwnershipService>

    let mockResponsePrinter: IMock<ResponsePrinter>

    let mockCommandParser: IMock<CommandParser>

    beforeEach(() => {
        mockLandOwnershipService = Mock.ofType<LandOwnershipService>(class MockLandOwnershipService {
            async findRecordById(): Promise<LandOwnershipRecord> { return {} as any }
        })

        mockResponsePrinter = Mock.ofType<ResponsePrinter>(class MockResponsePrinter {
            printLandOwnershipRecord(): void {}
            printHelp(): void {}
            printError(): void {}
        })

        mockCommandParser = Mock.ofType<CommandParser>(class MockCommandParser {
            parse(): { command: string; options: { [option: string]: string; }; } { 
                return {
                    command: '', options: {}
                } 
            }
        })

        subjectOfTest = new Cli(mockLandOwnershipService.object, mockResponsePrinter.object, mockCommandParser.object)
    })
    
    validCompanyIds.forEach(companyId => { 
        it(`accept a valid company id as an input parameter: ${companyId}`, async () => {
            const inputCommands = ['test']
            const responseRecord: LandOwnershipRecord | null = new LandOwnershipRecord('R12345', 'Test Company')

            mockCommandParser
                .setup((m: CommandParser) => m.parse(inputCommands))
                .returns(() => ({ command: companyId, options: {} }))

            mockLandOwnershipService
                .setup((m: LandOwnershipService) => m.findRecordById(companyId))
                .returns(() => Promise.resolve(responseRecord))
                .verifiable()

            await subjectOfTest.processInputCommands(inputCommands)

            mockLandOwnershipService.verifyAll()
        })
    })

    invalidCompanyIds.forEach(companyId => { 
        it(`reject an invalid company id as an input parameter: ${companyId}`, async () => {
            const inputCommands = ['test']

            mockCommandParser
                .setup((m: CommandParser) => m.parse(inputCommands))
                .returns(() => ({ command: companyId, options: {} }))

            mockLandOwnershipService
                .setup((m: LandOwnershipService) => m.findRecordById(companyId))
                .verifiable(Times.never())

            await subjectOfTest.processInputCommands(inputCommands)

            mockLandOwnershipService.verifyAll()
        })
    })

    it('output the land ownership record to the screen', async () => {
        const inputCommands = ['test']
        const responseRecord: LandOwnershipRecord | null = new LandOwnershipRecord('R12345', 'Test Company')

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: 'C12345', options: {} }))

        mockLandOwnershipService
            .setup((m: LandOwnershipService) => m.findRecordById(It.isAnyString()))
            .returns(() => Promise.resolve(responseRecord))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printLandOwnershipRecord(responseRecord, 0))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output the help options to the screen', async () => {
        const inputCommands = ['test']

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: 'help', options: {} }))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printHelp())
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output an error to the screen if a land ownership record is not found', async () => {
        const companyId = 'C12345'
        const inputCommands = ['test']
        const expectedError = `Unable to find land ownership record for company with id: ${companyId}`

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: companyId, options: {} }))

        mockLandOwnershipService
            .setup((m: LandOwnershipService) => m.findRecordById(It.isAnyString()))
            .returns(() => Promise.resolve(null))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printError(expectedError))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output an error to the screen if the company id is invalid', async () => {
        const invalidCompanyId = 'invalid-company-id'
        const inputCommands = ['test']
        const expectedError = `Invalid company id: ${invalidCompanyId}`

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: invalidCompanyId, options: {} }))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printError(expectedError))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output the land ownership record to the screen: mode => from_root', async () => {
        const inputCommands = ['test']
        const responseRecord: LandOwnershipRecord | null = new LandOwnershipRecord('R12345', 'Test Company')

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: 'C12345', options: { mode: 'from_root' } }))

        mockLandOwnershipService
            .setup((m: LandOwnershipService) => m.findRecordById(It.isAnyString()))
            .returns(() => Promise.resolve(responseRecord))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printLandOwnershipRecord(responseRecord, 0))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output the land ownership record to the screen: mode => expand', async () => {
        const inputCommands = ['test']
        const responseRecord: LandOwnershipRecord | null = new LandOwnershipRecord('R12345', 'Test Company')

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: 'C12345', options: { mode: 'expand' } }))

        mockLandOwnershipService
            .setup((m: LandOwnershipService) => m.findRecordById(It.isAnyString()))
            .returns(() => Promise.resolve(responseRecord))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printLandOwnershipRecord(responseRecord, 0))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })

    it('output an error to the screen if the mode is invalid', async () => {
        const invalidMode = 'invalid-mode'
        const inputCommands = ['test']
        const expectedError = `Invalid mode: ${invalidMode}`

        mockCommandParser
            .setup((m: CommandParser) => m.parse(inputCommands))
            .returns(() => ({ command: 'C12345', options: { mode: invalidMode } }))

        mockResponsePrinter
            .setup((m: ResponsePrinter) => m.printError(expectedError))
            .verifiable()

        await subjectOfTest.processInputCommands(inputCommands)

        mockResponsePrinter.verifyAll()
    })
})