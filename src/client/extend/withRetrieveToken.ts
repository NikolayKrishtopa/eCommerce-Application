import { type ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'
import { type TokenCache, type TokenStore } from '@commercetools/sdk-client-v2'

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

function withRetrieveToken<
  T extends ByProjectKeyRequestBuilder,
  K extends TokenStore,
>(apiRoot: T, tokenStore: K) {
  const tokenRetrieveRequest = apiRoot.get().execute()

  const retrieveToken = async () => {
    await tokenRetrieveRequest
    return tokenStore
  }

  return { retrieveToken }
}

export default withRetrieveToken
export { createTokenStore, bindTokenStore }
