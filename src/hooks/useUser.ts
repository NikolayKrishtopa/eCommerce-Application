import { useNavigate } from 'react-router-dom'
import {
  type Address,
  type MyCustomerDraft,
  type MyCustomerSignin,
  type ErrorResponse,
  type MyCustomerUpdateAction,
  type AddressDraft,
} from '@commercetools/platform-sdk'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import {
  type UserRegisterPayloadType,
  type UserUpdatePayloadType,
} from '@/Models/Models'
import useAuth from './useAuth'

const isErrorObject = (t: unknown): t is ErrorResponse =>
  typeof t === 'object' && t !== null && 'statusCode' in t && 'message' in t

export default function useUser(
  params: Pick<
    ReturnType<typeof useAuth>,
    | 'authApiRoot'
    | 'currentUserRef'
    | 'setCurrentUser'
    | 'login'
    | 'logout'
    | 'register'
    | 'isAuthenticated'
  > & {
    systemMessage: (msg: string, isSuccess: boolean) => void
    setIsFetching: (isFetching: boolean) => void
  },
) {
  const navigate = useNavigate()
  const {
    authApiRoot,
    currentUserRef,
    setCurrentUser,
    login,
    logout,
    register,
    isAuthenticated,
    systemMessage,
    setIsFetching,
  } = params

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

  const myCustomerUpdateActions = async (
    ...actions: MyCustomerUpdateAction[]
  ) => {
    if (!isAuthenticated || !currentUserRef.current) {
      return
    }
    try {
      setIsFetching(true)
      const { version } = currentUserRef.current
      const response = await authApiRoot()
        .me()
        .post({
          body: {
            version,
            actions,
          },
        })
        .execute()
      setCurrentUser(response.body)
      systemMessage(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
    } catch (e) {
      systemMessage(
        isErrorObject(e) ? e.message : SYSTEM_MESSAGES.DEFAULT_ERROR,
        false,
      )
    } finally {
      setIsFetching(false)
    }
  }

  const setDefaultAddress = async (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => {
    await myCustomerUpdateActions({
      action:
        addressType === 'billing'
          ? 'setDefaultBillingAddress'
          : 'setDefaultShippingAddress',
      addressId,
    })
  }

  const setAddress = async (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => {
    await myCustomerUpdateActions({
      action:
        addressType === 'billing'
          ? 'addBillingAddressId'
          : 'addShippingAddressId',
      addressId,
    })
  }

  const unsetAddress = async (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => {
    await myCustomerUpdateActions({
      action:
        addressType === 'billing'
          ? 'removeBillingAddressId'
          : 'removeShippingAddressId',
      addressId,
    })
  }

  const addAddress = async (
    address: AddressDraft,
    asDefaultShippingAddress: boolean,
    asDefaultBillingAddress: boolean,
  ) => {
    if (!isAuthenticated || !currentUserRef.current) {
      return
    }
    await myCustomerUpdateActions({
      action: 'addAddress',
      address,
    })
    const { addresses } = currentUserRef.current
    const lastAddress = addresses.at(-1)

    if (!lastAddress) {
      return
    }

    if (asDefaultShippingAddress) {
      await myCustomerUpdateActions({
        action: 'setDefaultShippingAddress',
        addressId: lastAddress.id,
      })
    }

    if (asDefaultBillingAddress) {
      await myCustomerUpdateActions({
        action: 'setDefaultBillingAddress',
        addressId: lastAddress.id,
      })
    }
  }

  const editAddress = async (addressId: string, address: Address) => {
    await myCustomerUpdateActions({
      action: 'changeAddress',
      addressId,
      address,
    })
  }

  const removeAddress = async (addressId: string) => {
    await myCustomerUpdateActions({
      action: 'removeAddress',
      addressId,
    })
  }

  const updateUserData = async (userData: UserUpdatePayloadType) => {
    if (!isAuthenticated || !currentUserRef.current) {
      return
    }
    const { firstName, lastName, dateOfBirth, email } = userData
    const user = currentUserRef.current
    const actions = [
      firstName && firstName !== user.firstName
        ? { action: 'setFirstName', firstName }
        : undefined,
      lastName && lastName !== user.lastName
        ? { action: 'setLastName', lastName }
        : undefined,
      dateOfBirth && dateOfBirth !== user.dateOfBirth
        ? { action: 'setDateOfBirth', dateOfBirth }
        : undefined,
      email && email !== user.email
        ? { action: 'changeEmail', email }
        : undefined,
    ].filter(Boolean) as MyCustomerUpdateAction[]
    if (!actions.length) {
      return
    }
    await myCustomerUpdateActions(...actions)
  }

  const updatePassword = async (
    newPassword: string,
    currentPassword: string,
  ) => {
    if (!isAuthenticated || !currentUserRef.current) {
      return
    }
    try {
      setIsFetching(true)
      const { version } = currentUserRef.current
      const response = await authApiRoot()
        .me()
        .password()
        .post({
          body: {
            version,
            newPassword,
            currentPassword,
          },
        })
        .execute()
      setCurrentUser(response.body)
      systemMessage(SYSTEM_MESSAGES.PASSWORD_CHANGE_SCSS, true)
    } catch (e) {
      systemMessage(
        isErrorObject(e) ? e.message : SYSTEM_MESSAGES.PASSWORD_CHANGE_ERR,
        false,
      )
    } finally {
      setIsFetching(false)
    }
  }

  return {
    userLogin,
    userLogout,
    userRegister,
    setDefaultAddress,
    setAddress,
    addAddress,
    removeAddress,
    updateUserData,
    updatePassword,
    editAddress,
    unsetAddress,
  }
}
