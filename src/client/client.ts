import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk'
import {
  ClientBuilder,
  type Credentials,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2'
import variables from './variables'
import extend from './extend/extend'
import withRetrieveToken, {
  bindTokenStore,
  createTokenStore,
} from './extend/withRetrieveToken'

const credentials = {
  clientId: variables.clientId,
  clientSecret: variables.clientSecret,
} satisfies Credentials

const authMiddlewareOptions = {
  host: variables.authHost,
  projectKey: variables.projectKey,
  credentials,
  scopes: variables.scopes,
  fetch,
} satisfies AuthMiddlewareOptions

const httpMiddlewareOptions = {
  host: variables.apiHost,
  fetch,
} satisfies HttpMiddlewareOptions

const baseCtpClient = new ClientBuilder().withHttpMiddleware(
  httpMiddlewareOptions,
)

const buildApiRoot = (ctpBuilder: ClientBuilder) =>
  createApiBuilderFromCtpClient(ctpBuilder.build()).withProjectKey({
    projectKey: variables.projectKey,
  })

/* Without tokenStore */

function buildClientCredentialsFlowApiRoot() {
  const apiRoot = buildApiRoot(
    baseCtpClient.withClientCredentialsFlow(authMiddlewareOptions),
  )

  return apiRoot
}

function buildRefreshTokenFlowApiRoot(refreshToken: string) {
  const apiRoot = buildApiRoot(
    baseCtpClient.withRefreshTokenFlow({
      ...authMiddlewareOptions,
      refreshToken,
    }),
  )

  return apiRoot
}

/* With tokenStore */

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

  return extend(apiRoot, withRetrieveToken(apiRoot, tokenStore))
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

  return extend(apiRoot, withRetrieveToken(apiRoot, tokenStore))
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
