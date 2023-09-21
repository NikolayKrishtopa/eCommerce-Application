import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  buildClientCredentialsFlowApiRoot,
  buildRefreshTokenFlowApiRoot,
  buildPasswordFlowApiRoot,
  buildAnonymousSessionFlowApiRoot,
} from '@/client'
import isErrorResponse from '@/utils/isErrorResponse'
import {
  type Cart,
  type Customer,
  type MyCustomerDraft,
  type MyCustomerSignin,
} from '@commercetools/platform-sdk'
import { type UserRegisterPayloadType } from '@/Models/Models'
import { SYSTEM_MESSAGES } from '@/utils/constants'

const DEFAULT_CURRENCY = 'EUR'

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

function useAuthInner() {
  const [currentUser, $setCurrentUser] = useState<Customer>()
  const [currentCart, $setCurrentCart] = useState<Cart>()

  const currentUserRef = useRef<typeof currentUser>()
  const currentCartRef = useRef<typeof currentCart>()

  const setCurrentUser = (customer: typeof currentUser) => {
    $setCurrentUser(customer)
    currentUserRef.current = customer
  }
  const setCurrentCart = (cart: typeof currentCart) => {
    $setCurrentCart(cart)
    currentCartRef.current = cart
  }

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

  const authenticateFallback = () => authenticateAnonymous()

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

  const initCart = async () => {
    try {
      const response = await authApiRootRef.current
        .me()
        .activeCart()
        .get()
        .execute()
      setCurrentCart(response.body)
    } catch (e) {
      if (isErrorResponse(e) && e.statusCode === 404) {
        const response = await authApiRootRef.current
          .me()
          .carts()
          .post({
            body: {
              currency: DEFAULT_CURRENCY,
              customerEmail: currentUserRef.current?.email,
            },
          })
          .execute()
        setCurrentCart(response.body)
      }
    }
  }

  useEffect(() => {
    const { session, refreshToken } = sessionStore.get()
    if (session === SessionType.Authenticated) {
      onTokenValidation(refreshToken, authenticateCustomer).then(initCart)
      return
    }
    if (session === SessionType.Anonymous) {
      onTokenValidation(refreshToken, authenticateAnonymous).then(initCart)
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
    authenticateAnonymous()
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
    currentUserRef,
    currentCartRef,
    login,
    logout,
    register,
  }
}

function useAuth(params: {
  systemMessage: (msg: string, isSuccess: boolean) => void
  setIsFetching: (isFetching: boolean) => void
}) {
  const navigate = useNavigate()

  const { systemMessage, setIsFetching } = params
  const { login, logout, register, ...pass } = useAuthInner()
  const { isAuthenticated } = pass

  const userLogin = async (data: MyCustomerSignin) => {
    try {
      setIsFetching(true)
      const { customer } = await login(data)
      if (customer) {
        systemMessage(
          `${SYSTEM_MESSAGES.LOGIN_SCSS} ${customer.firstName}`,
          true,
        )
        navigate('/')
      }
    } catch (e) {
      systemMessage(SYSTEM_MESSAGES.LOGIN_FAIL, false)
      throw e
    } finally {
      setIsFetching(false)
    }
  }

  const userLogout = () => {
    if (!isAuthenticated) {
      return
    }
    logout()
    systemMessage(`${SYSTEM_MESSAGES.LOGOUT_SCSS}`, true)
  }

  const deriveCustomerPayload = (data: UserRegisterPayloadType) => {
    const {
      email,
      password,
      firstName,
      lastName,
      street: shippingAddrStreetName,
      bldng: shippingAddrStreetNumber,
      zipCode: shippingAddrPostalCode,
      city: shippingAddrCity,
      country: shippingAddrCountry,
      billingStreet: billAddrStreetName,
      billingBldng: billAddrStreetNumber,
      billingZipCode: billAddrPostalCode,
      billingCity: billAddrCity,
      billingCountry: billAddrCountry,
      dateOfBirth,
      isBillingAddressSame,
      setDefaultShipAddress: setDefaultShippingAddress,
      setDefaultBillingAddress,
    } = data

    const shippingAddress = {
      streetName: shippingAddrStreetName,
      streetNumber: shippingAddrStreetNumber,
      postalCode: shippingAddrPostalCode,
      city: shippingAddrCity,
      country: shippingAddrCountry,
    }
    const billingAddress = {
      streetName: billAddrStreetName,
      streetNumber: billAddrStreetNumber,
      postalCode: billAddrPostalCode,
      city: billAddrCity,
      country: billAddrCountry,
    }

    const addresses = [shippingAddress]

    const indexOf = (t: (typeof addresses)[number]) => {
      const index = addresses.indexOf(t)
      return index !== -1 ? index : undefined
    }

    let defaultShippingAddress
    let defaultBillingAddress

    if (setDefaultShippingAddress) {
      defaultShippingAddress = indexOf(shippingAddress)
    }

    if (isBillingAddressSame) {
      defaultBillingAddress = indexOf(shippingAddress)
    } else {
      addresses.push(billingAddress)
      if (setDefaultBillingAddress) {
        defaultBillingAddress = indexOf(billingAddress)
      }
    }

    return {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      addresses,
      defaultShippingAddress,
      defaultBillingAddress,
    } satisfies MyCustomerDraft
  }

  const userRegister = async (data: UserRegisterPayloadType) => {
    try {
      setIsFetching(true)
      await register(deriveCustomerPayload(data))
      systemMessage(SYSTEM_MESSAGES.REGISTER_SCSS, false)
    } catch (e) {
      systemMessage(SYSTEM_MESSAGES.REGISTER_FAIL, true)
    } finally {
      setIsFetching(false)
    }
  }

  return {
    userLogin,
    userLogout,
    userRegister,
    ...pass,
  }
}

export default useAuth
export { SessionType }
