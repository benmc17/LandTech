import { Container } from 'inversify'
import Cli from './cli'
import { UserInterface } from './interfaces'
import { TYPES } from './types'

const container = new Container()

container.bind<UserInterface>(TYPES.UserInterface).to(Cli)

export { container }