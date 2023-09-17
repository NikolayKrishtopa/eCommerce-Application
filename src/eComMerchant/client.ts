import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
  TokenStore,
  Credentials,
  TokenCache,
} from '@commercetools/sdk-client-v2'

const projectKey = import.meta.env.VITE_PROJECT_KEY
const scopes = [import.meta.env.VITE_SCOPES]

const credentials = {
  clientId: import.meta.env.VITE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
} satisfies Credentials

const authMiddlewareOptions = {
  host: import.meta.env.VITE_AUTH_HOST,
  credentials,
  projectKey,
  scopes,
  fetch,
} satisfies AuthMiddlewareOptions

const httpMiddlewareOptions = {
  host: import.meta.env.VITE_API_HOST,
  fetch,
} satisfies HttpMiddlewareOptions

const baseCtpClient = new ClientBuilder().withHttpMiddleware(
  httpMiddlewareOptions,
)

const buildApiRoot = (ctpBuilder: ClientBuilder) =>
  createApiBuilderFromCtpClient(ctpBuilder.build()).withProjectKey({
    projectKey,
  })

const createTokenStore = () =>
  ({
    token: '',
    expirationTime: 0,
    refreshToken: '',
  }) satisfies TokenStore

const bindTokenStore = (tokenStore: TokenStore) =>
  ({
    set(token) {
      Object.assign(tokenStore, token)
    },
    get() {
      return tokenStore
    },
  }) satisfies TokenCache

/* Without tokenStore */

function buildClientCredentialsFlowApiRoot() {
  return buildApiRoot(
    baseCtpClient.withClientCredentialsFlow(authMiddlewareOptions),
  )
}

function buildRefreshTokenFlowApiRoot(refreshToken: string) {
  return buildApiRoot(
    baseCtpClient.withRefreshTokenFlow({
      ...authMiddlewareOptions,
      refreshToken,
    }),
  )
}

/* With tokenStore */

const extendWithRetrieveToken = <K extends TokenStore>(
  apiRoot: ByProjectKeyRequestBuilder,
  tokenStore: K,
) => {
  const tokenRetrieveRequest = apiRoot.get().execute()
  const extendedApiRoot = Object.create(apiRoot)

  extendedApiRoot.retrieveToken = async () => {
    await tokenRetrieveRequest
    return tokenStore
  }

  return extendedApiRoot as typeof apiRoot & {
    retrieveToken: () => Promise<K>
  }
}

function buildAnonymousSessionFlowApiRoot(anonymousId?: string | null) {
  const tokenStore = createTokenStore()
  const tokenCache = bindTokenStore(tokenStore)

  const apiRoot = buildApiRoot(
    baseCtpClient.withAnonymousSessionFlow({
      ...authMiddlewareOptions,
      credentials: {
        ...credentials,
        anonymousId: anonymousId || undefined,
      },
      tokenCache,
    }),
  )

  return extendWithRetrieveToken(apiRoot, tokenStore)
}

function buildPasswordFlowApiRoot(email: string, password: string) {
  const tokenStore = createTokenStore()
  const tokenCache = bindTokenStore(tokenStore)

  const apiRoot = buildApiRoot(
    baseCtpClient.withPasswordFlow({
      ...authMiddlewareOptions,
      credentials: {
        ...credentials,
        user: {
          username: email,
          password,
        },
      },
      tokenCache,
    }),
  )

  return extendWithRetrieveToken(apiRoot, tokenStore)
}

// Backward compatibility
const apiRoot = buildClientCredentialsFlowApiRoot()

export {
  apiRoot,
  authMiddlewareOptions,
  httpMiddlewareOptions,
  buildClientCredentialsFlowApiRoot,
  buildAnonymousSessionFlowApiRoot,
  buildRefreshTokenFlowApiRoot,
  buildPasswordFlowApiRoot,
}
