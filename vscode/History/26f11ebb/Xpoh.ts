export interface IConfig {
  port: number;
  nodeEnv: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  cookie: {
    tokenSecret: string;
    tokenName: string;
  };
}
