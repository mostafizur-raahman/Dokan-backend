import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels and colors
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "blue",
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
);

// Define transports (where logs go)
const transports = [
    // Console output for development
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple(),
        ),
        level: "debug",
    }),

    // Error logs file
    new winston.transports.File({
        filename: path.join(__dirname, "../../logs/error.log"),
        level: "error",
        format,
    }),

    // All logs file
    new winston.transports.File({
        filename: path.join(__dirname, "../../logs/all.log"),
        format,
    }),
];

// Optional: Daily rotating files (uncomment if you installed winston-daily-rotate-file)
/*
import DailyRotateFile from 'winston-daily-rotate-file';

transports.push(
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '14d', // keep logs for 14 days
    format,
  }),
  new DailyRotateFile({
    filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    format,
  })
);
*/

// Create logger instance
const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    levels,
    format,
    transports,
    exitOnError: false, // Don't exit on error logs
});

// Stream object for Morgan integration
logger.stream = {
    write: (message) => logger.http(message.trim()),
};

export default logger;
