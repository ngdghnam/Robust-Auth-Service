import winston from "winston";
import path from "path";
import fs from "fs";
import process from "process";

// Create logs directory if it doesn't exist
const logDir = path.resolve(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    // Console transport with colorized output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} ${level}: ${message}${
            Object.keys(meta).length ? " " + JSON.stringify(meta) : ""
          }`;
        })
      ),
      level: "debug",
    }),

    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // File transport for combined logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "exceptions.log"),
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, "rejections.log"),
    }),
  ],
});

// Remove console transport in production
if (process.env.NODE_ENV === "production") {
  logger.remove(winston.transports.Console);
}

export default logger;
