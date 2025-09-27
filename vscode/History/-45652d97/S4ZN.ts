import pino from "pino";

const isProd = process.env.NODE_ENV === "production";

const logger = pino();
