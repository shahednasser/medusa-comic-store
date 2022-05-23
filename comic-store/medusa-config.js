const dotenv = require('dotenv');
let ENV_FILE_NAME = '';
switch (process.env.NODE_ENV) {
	case 'prod':
		ENV_FILE_NAME = '.env';
		break;
	case 'test':
		ENV_FILE_NAME = '.env.test';
		break;
	default:
		ENV_FILE_NAME = '.env';
		break;
}

dotenv.config({ path: process.cwd() + '/' + ENV_FILE_NAME });

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

// Database URL (here we use a local database called medusa-development)
const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-store";

// Medusa uses Redis, so this needs configuration as well
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

// Stripe keys
const STRIPE_API_KEY = process.env.STRIPE_API_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// This is the place to include plugins. See API documentation for a thorough guide on plugins.
const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_CLIENT_SECRET,
      auth_webhook_id: process.env.PAYPAL_AUTH_WEBHOOK_ID
    }
  },
  {
    resolve: `medusa-file-minio`,
    options: {
        endpoint: process.env.MINIO_SERVER,
        bucket: process.env.MINIO_BUCKET,
        access_key_id: process.env.MINIO_ACCESS_KEY,
        secret_access_key: process.env.MINIO_SECRET_KEY,
    }
  },
  {
    resolve: `medusa-plugin-meilisearch`,
    options: {
      config: {
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY
      },
      settings: {
        products: {
          searchableAttributes: ["title", "description", "variant_sku"],
          displayedAttributes: ["title", "description", "variant_sku"],
        },
      },
    },
  }
];

module.exports = {
  projectConfig: {
    // redis_url: REDIS_URL,
    // For more production-like environment install PostgresQL
    database_url: DATABASE_URL,
    database_type: "postgres",
    // database_database: "./medusa-db.sql",
    // database_type: "sqlite",
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  plugins,
};
