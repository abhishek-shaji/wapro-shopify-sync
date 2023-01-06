import * as dotenv from 'dotenv';
import cron from 'node-cron';

import { WELCOME_ASCII_ART } from './constants/asciiArt';
import { CRON_EXPRESSIONS } from './constants/cron';
import { ShopifyService } from './services/ShopifyService';
import { WaproService } from './services/WaproService';
import { logger } from './utils/logger';
import { sleep } from './utils/sleep';

dotenv.config();

(async () => {
  logger.info(WELCOME_ASCII_ART);

  const shopifyService = new ShopifyService();
  const waproService = new WaproService();

  await waproService.initializeConnection();
  await shopifyService.initialize();

  let isSyncing = false;

  cron.schedule(CRON_EXPRESSIONS.EVERY_MINUTE, async () => {
    if (isSyncing) {
      return;
    }

    isSyncing = true;
    const inventoryItems = await waproService.getInventoryData();
    const variantMap = await shopifyService.fetchVariantsByBarcode();

    for (const inventoryItem of inventoryItems) {
      const { barcode, available, price } = inventoryItem;
      const variant = variantMap.get(barcode);

      try {
        if (
          variant &&
          (parseFloat(variant.price) !== inventoryItem.price ||
            variant.inventory_quantity !== inventoryItem.available)
        ) {
          logger.info(`Updating variant #${variant.id}...`);

          await shopifyService.updateInventory(variant, {
            price,
            available: available,
          });

          logger.success(`Successfully updated variant #${variant.id}`);
          await sleep(1000);
        }
      } catch (e) {
        logger.danger(`Failed to update variant #${variant.id}`);
      }
    }

    isSyncing = false;
  });
})();
