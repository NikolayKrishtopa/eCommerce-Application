import {
  type Address,
  type MyCustomerUpdateAction,
  type AddressDraft,
} from '@commercetools/platform-sdk'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import { type UserUpdatePayloadType } from '@/Models/Models'
import isErrorResponse from '@/utils/isErrorResponse'
import useAuth from './useAuth'

export default function useUser(
  params: ReturnType<typeof useAuth> & {
    systemMessage: (msg: string, isSuccess: boolean) => void
    setIsFetching: (isFetching: boolean) => void
  },
) {
  const {
    authApiRoot,
    currentUserRef,
    setCurrentUser,
    isAuthenticated,
    systemMessage,
    setIsFetching,
  } = params

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
        isErrorResponse(e) ? e.message : SYSTEM_MESSAGES.DEFAULT_ERROR,
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
        isErrorResponse(e) ? e.message : SYSTEM_MESSAGES.PASSWORD_CHANGE_ERR,
        false,
      )
    } finally {
      setIsFetching(false)
    }
  }

  return {
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
