import fetch from 'node-fetch'
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2'

// const {
//   VITE_PROJECT_KEY,
//   VITE_CLIENT_ID,
//   VITE_CLIENT_SECRET,
//   VITE_SCOPE,
//   VITE_AUTH_HOST,
//   VITE_API_HOST,
// } = import.meta.env

const projectKey = 'rss-ecommerce-app'
const scopes = [
  'manage_my_profile:rss-ecommerce-app view_published_products:rss-ecommerce-app manage_my_business_units:rss-ecommerce-app create_anonymous_token:rss-ecommerce-app manage_my_quote_requests:rss-ecommerce-app view_categories:rss-ecommerce-app manage_my_shopping_lists:rss-ecommerce-app manage_my_orders:rss-ecommerce-app manage_my_payments:rss-ecommerce-app manage_my_quotes:rss-ecommerce-app',
]

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.europe-west1.gcp.commercetools.com',
  projectKey,
  credentials: {
    clientId: '3FrswyDjqXZvSK6zyFyTJnzR',
    clientSecret: 'zz2gt4tE9oMUQ0jCGJNmpTQqqMGmI2Rm',
  },
  scopes,
  fetch,
}

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.europe-west1.gcp.commercetools.com',
  fetch,
}

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build()

export default ctpClient
