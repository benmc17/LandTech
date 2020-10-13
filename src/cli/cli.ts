import { injectable, inject } from 'inversify'
import { CommandParser, LandOwnershipService, ResponsePrinter, UserInterface } from '../interfaces'
import 'reflect-metadata'
import { LandOwnershipRecord } from '../land-ownership'
import { TYPES } from '../types'

export const Mode = {
    FROM_ROOT: 'from_root',
    EXPAND: 'expand'
}

export const Command = {
    HELP: 'help'
}

@injectable()
export class Cli implements UserInterface {

    private static readonly DefaultMode = Mode.FROM_ROOT

    private _landOwnershipService: LandOwnershipService

    private _cliResponsePrinter: ResponsePrinter

    private _cliCommandParser: CommandParser

    constructor(
        @inject(TYPES.LandOwnershipService) landOwnershipService: LandOwnershipService,
        @inject(TYPES.ResponsePrinter) cliResponsePrinter: ResponsePrinter,
        @inject(TYPES.CommandParser) cliCommandParser: CommandParser
    ) {
        this._landOwnershipService = landOwnershipService
        this._cliResponsePrinter = cliResponsePrinter
        this._cliCommandParser = cliCommandParser

        this._processCommand = this._processCommand.bind(this)
        this._processHelpCommand = this._processHelpCommand.bind(this)
        this._processCompanyId = this._processCompanyId.bind(this)
        this._performAction = this._performAction.bind(this)
        this._isValidCompanyId = this._isValidCompanyId.bind(this)
        this._isValidMode = this._isValidMode.bind(this)
    }

    async processInputCommands(commands: string[]): Promise<void> {
        const {
            _cliCommandParser,
            _processCommand
        } = this

        const { command, options } = _cliCommandParser.parse(commands)

        _processCommand(command, options)
    }

    private async _processCommand(command: string, options: { [option: string]: string }): Promise<void> {
        const {
            _processHelpCommand,
            _processCompanyId
        } = this
        
        switch(command) {
            case Command.HELP:
                _processHelpCommand()
                break
            default:
                await _processCompanyId(command, options.mode)
                break
        }
    }

    private _processHelpCommand(): void {
        const {
            _cliResponsePrinter
        } = this

        _cliResponsePrinter.printHelp()
    }

    private async _processCompanyId(companyId: string, mode?: string): Promise<void> {
        if(!mode) mode = Cli.DefaultMode

        const {
            _landOwnershipService,
            _cliResponsePrinter,
            _isValidCompanyId,
            _isValidMode,
            _performAction
        } = this

        if(!_isValidCompanyId(companyId)) {
            _cliResponsePrinter.printError(`Invalid company id: ${companyId}`)
            return
        }

        if(!_isValidMode(mode)) {
            _cliResponsePrinter.printError(`Invalid mode: ${mode}`)
            return
        }

        const landOwnershipRecord = await _landOwnershipService.findRecordById(companyId)

        if(!landOwnershipRecord) {
            _cliResponsePrinter.printError(`Unable to find land ownership record for company with id: ${companyId}`)
            return
        }

        _performAction(landOwnershipRecord, mode)
    }

    private _performAction(landOwnershipRecord: LandOwnershipRecord, mode: string) {
        const {
            _cliResponsePrinter
        } = this
        
        switch(mode) {
            case Mode.FROM_ROOT:
                landOwnershipRecord.processFromRoot(_cliResponsePrinter.printLandOwnershipRecord)
                break
            case Mode.EXPAND:
                landOwnershipRecord.expand(_cliResponsePrinter.printLandOwnershipRecord)
                break
        }
    }

    private _isValidCompanyId(companyId: string) {
        return companyId && 
               typeof(companyId) === 'string' && 
               companyId.match(/^([A-Z0-9]+)$/)
    }

    private _isValidMode(mode?: string) {
        return mode === Mode.EXPAND || 
               mode === Mode.FROM_ROOT
    }
} 