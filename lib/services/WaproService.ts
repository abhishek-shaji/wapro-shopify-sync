import * as sql from 'mssql';
import { requireEnv } from '~lib/utils/requireEnv';

import { QUERY_PRICE_AND_QUANTITY } from '../constants/query';
import { logger } from '../utils/logger';

export interface WaproProduct {
  barcode: string;
  available: number;
  price: number;
}

class WaproService {
  private connection: sql.ConnectionPool;

  public async initializeConnection() {
    try {
      logger.info('Initializing connection to WAPRO database...');
      this.connection = await sql.connect({
        server: requireEnv('WAPRO_DB_HOST'),
        user: requireEnv('WAPRO_DB_USERNAME'),
        port: 1433,
        database: requireEnv('WAPRO_DB_NAME'),
        password: requireEnv('WAPRO_DB_PASSWORD'),
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
        options: {
          encrypt: true, // for azure
          trustServerCertificate: true, // change to true for local dev / self-signed certs
        },
      });
      logger.info('Connection to WAPRO database successful.');
    } catch (error) {
      logger.danger('Connection to WAPRO database failed. Please check your credentials.');
      process.exit(1);
    }
  }

  private filterInvalidResults(results: WaproProduct[]) {
    if (!results) {
      return [];
    }

    return results.filter((item) => !!item.barcode);
  }

  public async getInventoryData(): Promise<WaproProduct[]> {
    const result = await this.connection.query(QUERY_PRICE_AND_QUANTITY);

    return this.filterInvalidResults(result.recordset);
  }
}

export { WaproService };
