import { UserInterface } from './interfaces'
import { container } from './inversify.config'
import { TYPES } from './types'
import 'reflect-metadata'

const userInterface = container.get<UserInterface>(TYPES.UserInterface)

userInterface.processInputCommand(process.argv)
    .then(() => {

    })
    .catch((error) => {

    })