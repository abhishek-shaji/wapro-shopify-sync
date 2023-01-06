import * as sql from 'mssql';

import { WAPRO_CONFIG } from '../constants/config';
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
      this.connection = await sql.connect(WAPRO_CONFIG);
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
