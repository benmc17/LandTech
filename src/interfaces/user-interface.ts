export interface UserInterface {
    processInputCommand(commands: string[]): Promise<void>
}