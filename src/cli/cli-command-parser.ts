import { injectable } from 'inversify'
import { CommandParser } from '../interfaces'

@injectable()
export class CliCommandParser implements CommandParser {

    parse(inputStrings: string[]): { command: string; options: { [option: string]: string; }; } {
        const command = inputStrings[inputStrings.length - 1]
        const options: { [option: string]: string } = {}
        let currentOption

        for(let i = 2; i < inputStrings.length; i++) {
            const inputString = inputStrings[i]

            if(typeof(inputString) !== 'string') break

            if(inputString.startsWith('--')) {
                currentOption = inputString.substring(2)
            } else if(currentOption) {
                options[currentOption] = inputString
                currentOption = null
            }
        }
        return { command, options }
    }
}