import 'mocha'
import { CliCommandParser } from '../../src/cli'
import { expect } from 'chai'

describe('The CLI Command Parser should', () => {

    const defaultInputCommands: string[] = [
        './node.exe',
        './landtree'
    ]

    let subjectOfTest: CliCommandParser

    beforeEach(() => {
        subjectOfTest = new CliCommandParser()
    })

    const testCases = [
        {
            inputStrings: [
                '--testOption',
                'testOptionValue',
                'test-command'
            ],
            expectedCommand: 'test-command',
            expectedOptions: {
                testOption: 'testOptionValue'
            }
        },
        {
            inputStrings: [
                'test-command'
            ],
            expectedCommand: 'test-command',
            expectedOptions: {}
        },
        {
            inputStrings: [
                '--testOption1',
                'testOptionValue1',
                '--testOption2',
                'testOptionValue2',
                'test-command'
            ],
            expectedCommand: 'test-command',
            expectedOptions: {
                testOption1: 'testOptionValue1',
                testOption2: 'testOptionValue2'
            }
        }
    ]

    testCases.forEach((testCase) => {
        it('correctly return the input command and options', async () => {
            const inputStrings = [
                ...defaultInputCommands,
                ...testCase.inputStrings
            ]
    
            const { command, options } = await subjectOfTest.parse(inputStrings)
    
            expect(command).to.equal(testCase.expectedCommand)
            expect(options).to.deep.equal(testCase.expectedOptions)
        })
    })
})