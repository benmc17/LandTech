import { Container } from 'inversify'
import { Cli, CliCommandParser } from './cli'
import { CommandParser, LandOwnershipService, LandOwnershipTreeLoader, TreeFactory, UserInterface } from './interfaces'
import { LandOwnershipTrees, LandOwnershipTreesFactory } from './land-ownership'
import { CsvLandOwnershipTreeLoader } from './land-ownership/csv-land-ownership-tree-loader'
import { CorporateLandOwnershipService } from './services/corporate-land-ownership-service'
import { TYPES } from './types'

const container = new Container()

container.bind<UserInterface>(TYPES.UserInterface).to(Cli)
container.bind<LandOwnershipService>(TYPES.LandOwnershipService).to(CorporateLandOwnershipService)
//TODO: Response Printer
container.bind<CommandParser>(TYPES.CommandParser).to(CliCommandParser)
container.bind<LandOwnershipTreeLoader>(TYPES.LandOwnershipTreeLoader).to(CsvLandOwnershipTreeLoader)
container.bind<TreeFactory<LandOwnershipTrees>>(TYPES.TreeFactory).to(LandOwnershipTreesFactory)

export { container }