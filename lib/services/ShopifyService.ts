import axios, { AxiosInstance } from 'axios';

import {
  ShopifyLocation,
  ShopifyProduct,
  ShopifyProductVariant,
  ShopifyVariantMap,
} from '../types/shopify';
import { logger } from '../utils/logger';
import { requireEnv } from '../utils/requireEnv';

class ShopifyService {
  private axios: AxiosInstance;
  private list: ShopifyVariantMap;
  private location: ShopifyLocation;

  constructor() {
    this.list = new Map();

    const headers = {
      'X-Shopify-Access-Token': requireEnv('SHOPIFY_PASSWORD'),
      Authorization:
        'Basic ' + btoa(requireEnv('SHOPIFY_API_KEY') + ':' + requireEnv('SHOPIFY_PASSWORD')),
    };

    this.axios = axios.create({
      baseURL: `https://${requireEnv('SHOPIFY_SHOP_NAME')}.myshopify.com/admin/api/2023-01`,
      headers,
    });
  }

  public async initialize() {
    try {
      logger.info('Initializing Shopify service');
      const { locations } = (await this.axios.get('/locations.json')).data as {
        locations: ShopifyLocation[];
      };

      this.location = locations[0];
      logger.success('Shopify service initialized');
    } catch (e) {
      logger.danger('Failed to initialize Shopify service');
      process.exit(1);
    }
  }

  async fetchVariantsByBarcode(sinceId?: number): Promise<ShopifyVariantMap> {
    if (!sinceId) {
      this.list = new Map();
    }

    const response = await this.axios.get('/products.json', {
      params: {
        fields: 'id,variants',
        limit: 250,
        since_id: sinceId,
      },
    });

    const { products } = response.data as { products: ShopifyProduct[] };

    if (!products.length) {
      logger.danger(`${this.list.size} products found`);
      return this.list;
    }

    for (const product of products) {
      for (const variant of product.variants) {
        this.list.set(variant.barcode, variant);
      }
    }

    return this.fetchVariantsByBarcode(products[products.length - 1].id);
  }

  async updateInventory(
    { id, inventory_item_id }: ShopifyProductVariant,
    { price, available }: { price: number; available: number }
  ) {
    logger.info(`Updating variant price for Variant #${id}...`);
    await this.updateVariantPrice(id, price);
    logger.success(`Successfully variant price for Variant #${id}`);

    logger.info(`Updating inventory level for Inventory Level #${inventory_item_id}...`);
    await this.adjustInventoryLevel(inventory_item_id, available);
    logger.success(
      `Successfully updated inventory level for Inventory Level #${inventory_item_id}`
    );
  }

  private async updateVariantPrice(id: number, price: number) {
    const response = await this.axios.put(`/variants/${id}.json`, {
      variant: {
        id,
        price,
      },
    });

    return response.data;
  }

  private async adjustInventoryLevel(inventoryItemId: number, available: number) {
    const response = await this.axios.post(`/inventory_levels/set.json`, {
      inventory_item_id: inventoryItemId,
      location_id: this.location.id,
      available,
    });

    return response.data;
  }
}

export { ShopifyService };
