export const WAPRO_CONFIG = {
  server: 'localhost',
  user: 'sa',
  port: 1433,
  database: 'WAPRO',
  password: 'Wapro3000',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};
