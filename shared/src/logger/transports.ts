import {transports} from 'winston'

export const transportList = [
new transports.Console(),
new transports.File({ filename: 'logs/error.log', level: "error"}),
new transports.File({ filename: 'logs/combined.log'})
]