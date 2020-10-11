export interface CommandParser {
    parse(inputStrings: string[]): { command: string, options: { [option: string]: string } }
}