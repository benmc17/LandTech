export interface UserInterface {
    processInputCommands(commands: string[]): Promise<void>
}