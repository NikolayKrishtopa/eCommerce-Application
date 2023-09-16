import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2'

const projectKey = import.meta.env.VITE_PROJECT_KEY
const scopes = [import.meta.env.VITE_SCOPE]

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: import.meta.env.VITE_AUTH_HOST,
  projectKey,
  credentials: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  },
  scopes,
  fetch,
}

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: import.meta.env.VITE_API_HOST,
  fetch,
}

const anonymousClient = new ClientBuilder()
  .withAnonymousSessionFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .build()

const apiRoot = createApiBuilderFromCtpClient(anonymousClient).withProjectKey({
  projectKey,
})

// eslint-disable-next-line import/prefer-default-export
export { apiRoot }
