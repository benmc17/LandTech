import { injectable, inject } from 'inversify'
import { UserInterface } from './interfaces'
import 'reflect-metadata'

@injectable()
export default class Cli implements UserInterface {

    async processInputCommand(commands: string[]): Promise<void> {
        console.log(commands)
    }
}