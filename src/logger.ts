import winston from "winston";

const { File, Console } = winston.transports;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.timestamp(),
  defaultMeta: { service: "user-service" },
  transports: [
    new File({ filename: "./logs/error.log", level: "error", format: winston.format.simple() }),
    new File({ filename: "./logs/combined.log", format: winston.format.simple() }),
    new Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()) }),
  ],
});

export default logger;
