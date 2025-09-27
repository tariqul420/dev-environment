// src/lib/logger.ts (TypeScript or JS—দুটোতেই চলবে)
import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino(
  isProd
    ? {
        level: "info",
        // Production-এ JSON log (stdout/file)
        // চাইলে 'destination' দিয়ে ফাইলেও পাঠাতে পারো
        // example: destination: "/var/log/app.log"
        // pino docs: https://getpino.io/#/docs/file-logging
      }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "yyyy-mm-dd HH:MM:ss.l",
            ignore: "pid,hostname", // log একটু ক্লিন রাখে
            singleLine: true, // single line log
          },
        },
      },
);

export default logger;
