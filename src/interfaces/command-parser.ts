export interface CommandParser {
    parse(commands: string[]): { command: string, options: { [option: string]: string } }
}