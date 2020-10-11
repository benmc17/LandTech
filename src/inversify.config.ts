import { Container } from 'inversify'
import { Cli, CliCommandParser } from './cli'
import { LandOwnershipService, UserInterface } from './interfaces'
import { CommandParser } from './interfaces/command-parser'
import { CorporateLandOwnershipService } from './services/corporate-land-ownership-service'
import { TYPES } from './types'

const container = new Container()

container.bind<UserInterface>(TYPES.UserInterface).to(Cli)
container.bind<LandOwnershipService>(TYPES.LandOwnershipService).to(CorporateLandOwnershipService)
//TODO: Response Printer
container.bind<CommandParser>(TYPES.CommandParser).to(CliCommandParser)

export { container }