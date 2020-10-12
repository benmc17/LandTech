import { CsvReader } from '../interfaces'
import fs from 'fs'
import csv from 'csv-parser'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class CsvFileReader implements CsvReader {
    read(file: string, processRow: (row: { [column: string]: string; }) => void): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.createReadStream(file)
                .pipe(csv())
                .on('data', (row: { [column: string]: string; }) => {
                    processRow(row)
                })
                .on('end', () => {
                    resolve()
                })
                .on('error', () => {
                    reject('error reading csv file')
                })
        })
    }   
}