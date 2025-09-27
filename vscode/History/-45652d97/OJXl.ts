// src/lib/logger.ts (TypeScript or JS—দুটোতেই চলবে)
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino(
  isProd
    ? {
        level: "info",
      }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname",
            singleLine: true,
          },
        },
      },
);

export default logger;
