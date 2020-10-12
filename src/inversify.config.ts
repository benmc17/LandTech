import { Container } from 'inversify'
import { TYPES } from './types'
import { CommandParser, CsvReader, DataFactory, LandOwnershipDataLoader, LandOwnershipService, ResponsePrinter, UserInterface } from './interfaces'
import { LandOwnershipData } from './land-ownership'
// Inversify only allows direct imports for some strange reason
import { Cli } from './cli/cli'
import { CorporateLandOwnershipService } from './services/corporate-land-ownership-service'
import { CliResponsePrinter } from './cli/cli-response-printer'
import { CliCommandParser } from './cli/cli-command-parser'
import { LandOwnershipCsvDataLoader } from './land-ownership/land-ownership-csv-data-loader'
import { LandOwnershipDataFactory } from './land-ownership/land-ownership-data-factory'
import { CsvFileReader } from './utils/csv-file-reader'

const container = new Container()

container.bind<UserInterface>(TYPES.UserInterface).to(Cli)
container.bind<LandOwnershipService>(TYPES.LandOwnershipService).to(CorporateLandOwnershipService)
container.bind<ResponsePrinter>(TYPES.ResponsePrinter).to(CliResponsePrinter)
container.bind<CommandParser>(TYPES.CommandParser).to(CliCommandParser)
container.bind<LandOwnershipDataLoader>(TYPES.LandOwnershipDataLoader).to(LandOwnershipCsvDataLoader)
container.bind<DataFactory<LandOwnershipData>>(TYPES.DataFactory).to(LandOwnershipDataFactory)
container.bind<CsvReader>(TYPES.CsvReader).to(CsvFileReader)

export { container }