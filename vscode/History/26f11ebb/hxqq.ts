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
    expiresIn: number | '1h' | '2h' | '1d' | '7d' | '30d';
  };
  db: {
    provider: string;
    url: string;
  };
}
