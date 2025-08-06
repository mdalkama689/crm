import { format } from "winston";

export const logFormat = format.combine(
    format.timestamp(),
    format.printf(({ level , message, timestamp, stack}) => {
        return `${timestamp} [${level.toLowerCase()}]: ${stack || message}`
    })
)

