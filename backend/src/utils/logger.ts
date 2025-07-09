import winston from "winston";
import { config } from "../config/config";

const formats = {
  development: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...rest }) => {
      return `${timestamp} ${level}: ${message} ${Object.keys(rest).length ? JSON.stringify(rest) : ""}`;
    })
  ),
  production: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
};

export const logger = winston.createLogger({
  level: config.logLevel,
  format:
    formats[config.nodeEnv === "production" ? "production" : "development"],
  transports: [new winston.transports.Console()],
});
