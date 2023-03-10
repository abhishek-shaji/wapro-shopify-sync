interface IMoney {
  amount: number | string;
  currency_code: string;
}

interface ShopifyProductVariantPresentmentPriceSet {
  price: IMoney;
  compare_at_price: IMoney;
}

interface ShopifyProductOption {
  id: number;
  name: string;
  position: number;
  product_id: number;
  values: string[];
}

export interface ShopifyProduct {
  body_html: string;
  created_at: string;
  handle: string;
  id: number;
  image: ShopifyProductImage;
  images: ShopifyProductImage[];
  options: ShopifyProductOption[];
  product_type: string;
  published_at: string;
  published_scope: string;
  tags: string;
  template_suffix: string | null;
  title: string;
  metafields_global_title_tag?: string;
  metafields_global_description_tag?: string;
  updated_at: string;
  variants: ShopifyProductVariant[];
  vendor: string;
  status: 'active' | 'archived' | 'draft';
}

export interface ShopifyProductImage {
  created_at: string;
  id: number;
  position: number;
  product_id: number;
  variant_ids: number[];
  src: string;
  width: number;
  height: number;
  updated_at: string;
  alt: string | null;
}

type ProductVariantInventoryPolicy = 'deny' | 'continue';
type ProductVariantWeightUnit = 'g' | 'kg' | 'oz' | 'lb';

export interface ShopifyLocation {
  id: number;
  active: boolean;
  admin_graphql_api_id: string;
  address1: string;
  address2: string | null;
  city: string;
  country: string;
  country_code: string;
  country_name: string;
  created_at: string;
  deleted_at: string;
  legacy: boolean;
  name: string;
  phone: string;
  province: string;
  province_code: string;
  updated_at: string;
  zip: string;
}

export interface ShopifyProductVariant {
  barcode: string;
  compare_at_price: string | null;
  created_at: string;
  fulfillment_service: string;
  grams: number;
  id: number;
  image_id: number | null;
  inventory_item_id: number;
  inventory_management: string;
  inventory_policy: ProductVariantInventoryPolicy;
  inventory_quantity: number;
  old_inventory_quantity: number;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  presentment_prices: ShopifyProductVariantPresentmentPriceSet[];
  position: number;
  price: string;
  product_id: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  tax_code: string | null;
  title: string;
  updated_at: string;
  weight: number;
  weight_unit: ProductVariantWeightUnit;
}

export type ShopifyVariantMap = Map<string, ShopifyProductVariant>;
