# WAPRO-Shopify Inventory Sync

This library allows you to sync your inventory data from [WAPRO](https://wapro.pl/) to your [Shopify](https://www.shopify.com/) store.

## Getting Started

To use this library, you will need to create a `.env` file in the root directory of the project. This file should contain the following variables:

- `SHOPIFY_SHOP_NAME`: The name of your Shopify store.
- `SHOPIFY_API_KEY`: Your Shopify API key. You can find this in the Shopify Admin under "Apps".
- `SHOPIFY_PASSWORD`: Your Shopify API password. You can find this in the Shopify Admin under "Apps".

Next, you will need to install the dependencies for the project by running the following command:

```bash
yarn install
```

Then, you will need to build the project by running the following command:

```bash
yarn build
```

Finally, you can run the project by running the following command:

```bash
yarn start
```

The sync process will run until you stop it by pressing `CTRL+C`.

## Troubleshooting

If you encounter any issues while using this library, please check the logs for error messages and contact the maintainer at [kontakt@abhishek.pl](mailto:kontakt@abhishek.pl) for assistance.
