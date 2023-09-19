import {
  buildClientCredentialsFlowApiRoot,
  buildRefreshTokenFlowApiRoot,
  buildPasswordFlowApiRoot,
  buildAnonymousSessionFlowApiRoot,
} from '@/client/client'
import {
  type Cart,
  type Customer,
  type MyCustomerDraft,
  type MyCustomerSignin,
} from '@commercetools/platform-sdk'
import { useEffect, useRef, useState } from 'react'

enum SessionType {
  Client = 'client',
  Anonymous = 'anonymous',
  Authenticated = 'authenticated',
}

const isEnum = <T extends { [k: string]: unknown }>(
  targetEnum: T,
  value: unknown,
): value is T[keyof T] => Object.values(targetEnum).includes(value)

class SessionStore {
  static STORAGE_SESSION_TYPE = 'sessionType'
  static STORAGE_REFRESH_TOKEN = 'refreshToken'

  private session = SessionType.Client
  private refreshToken = ''

  retrieveFromLocalStorage() {
    const storageSessionType = localStorage.getItem(
      SessionStore.STORAGE_SESSION_TYPE,
    )
    const storageRefreshToken = localStorage.getItem(
      SessionStore.STORAGE_REFRESH_TOKEN,
    )
    this.session = isEnum(SessionType, storageSessionType)
      ? storageSessionType
      : SessionType.Client
    this.refreshToken = storageRefreshToken || ''
    return this
  }

  get() {
    return {
      session: this.session,
      refreshToken: this.refreshToken,
    }
  }

  set(session: SessionType, refreshToken?: string) {
    this.session = session
    localStorage.setItem(SessionStore.STORAGE_SESSION_TYPE, session)
    if (refreshToken) {
      this.refreshToken = refreshToken
      localStorage.setItem(SessionStore.STORAGE_REFRESH_TOKEN, refreshToken)
    } else {
      this.refreshToken = ''
      localStorage.removeItem(SessionStore.STORAGE_REFRESH_TOKEN)
    }
  }
}

const sessionStore = new SessionStore().retrieveFromLocalStorage()

function useAuth() {
  const [currentUser, setCurrentUser] = useState<Customer>()
  const [currentCart, setCurrentCart] = useState<Cart>()

  const authApiRootRef = useRef(buildClientCredentialsFlowApiRoot())

  const validateToken = async (token: string) =>
    authApiRootRef.current.validateRefreshToken(token)

  const authenticateClientApp = () => {
    setCurrentUser(undefined)
    authApiRootRef.current = buildClientCredentialsFlowApiRoot()
    sessionStore.set(SessionType.Client)
  }

  const authenticateAnonymous = async (refreshToken?: string) => {
    try {
      if (refreshToken) {
        const apiRoot = buildRefreshTokenFlowApiRoot(refreshToken)
        setCurrentUser(undefined)
        authApiRootRef.current = apiRoot
      } else {
        const apiRoot = buildAnonymousSessionFlowApiRoot()
        const token = await apiRoot.retrieveToken()
        sessionStore.set(SessionType.Anonymous, token.refreshToken)
      }
    } catch {
      authenticateClientApp()
    }
  }

  const authenticateFallback = () => authenticateClientApp()

  const authenticateCustomer = async (refreshToken: string) => {
    try {
      const apiRoot = buildRefreshTokenFlowApiRoot(refreshToken)
      const response = await apiRoot.me().get().execute()
      if (response.statusCode === 200) {
        setCurrentUser(response.body)
        sessionStore.set(SessionType.Authenticated, refreshToken)
        authApiRootRef.current = apiRoot
      } else {
        throw new Error('Jump into catch')
      }
    } catch {
      authenticateFallback()
    }
  }

  const onTokenValidation = (
    token: string,
    onValid: (t: string) => unknown,
    onInvalid: (t: string, e?: Error) => unknown = authenticateFallback,
  ) =>
    validateToken(token)
      .then((isValid) => {
        if (isValid) onValid(token)
        else onInvalid(token)
      })
      .catch((e) => onInvalid(token, e))

  useEffect(() => {
    const { session, refreshToken } = sessionStore.get()
    if (session === SessionType.Authenticated) {
      onTokenValidation(refreshToken, authenticateCustomer)
      return
    }
    if (session === SessionType.Anonymous) {
      onTokenValidation(refreshToken, authenticateAnonymous)
      return
    }
    authenticateFallback()
  }, [])

  const login = async (customerSignIn: MyCustomerSignin) => {
    const { session } = sessionStore.get()
    if (session === SessionType.Authenticated) {
      return {}
    }
    let response
    if (session === SessionType.Anonymous) {
      response = await authApiRootRef.current
        .me()
        .login()
        .post({ body: customerSignIn })
        .execute()
    } else {
      response = await authApiRootRef.current
        .login()
        .post({ body: customerSignIn })
        .execute()
    }
    const { email, password } = customerSignIn
    const customerApiRoot = buildPasswordFlowApiRoot(email, password)
    const token = await customerApiRoot.retrieveToken()
    sessionStore.set(SessionType.Authenticated, token.refreshToken)
    const { customer, cart } = response.body
    setCurrentCart(cart)
    setCurrentUser(customer)
    return { customer, cart }
  }

  const logout = () => {
    authenticateFallback()
  }

  const register = async (customerDraft: MyCustomerDraft, autoLogin = true) => {
    const { session } = sessionStore.get()
    if (session !== SessionType.Anonymous) {
      await authenticateAnonymous()
    }
    const response = await authApiRootRef.current
      .me()
      .signup()
      .post({ body: customerDraft })
      .execute()
    if (autoLogin) {
      await login(customerDraft)
    }
    return response.body
  }

  const authApiRoot = () => authApiRootRef.current

  const sessionState = sessionStore.get().session
  const isAuthenticated =
    sessionStore.get().session === SessionType.Authenticated

  return {
    authApiRoot,
    sessionState,
    isAuthenticated,
    currentUser,
    currentCart,
    setCurrentUser,
    setCurrentCart,
    login,
    logout,
    register,
  }
}

export default useAuth
export { SessionType }
