import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CustomerUpdateAction,
  Customer,
  Address,
} from '@commercetools/platform-sdk'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import {
  UserRegisterPayloadType,
  UserLoginPayloadType,
  UserUpdatePayloadType,
} from '@/Models/Models'
import { apiRoot } from '../client/client'

export default function useUser(
  setSystMsg: (msg: string, isSuccess: boolean) => void,
  setIsFetching: (isFetching: boolean) => void,
) {
  const [currentUser, setCurrentUser] = useState<null | Customer>(null)
  const isLoggedIn = !!currentUser
  const navigate = useNavigate()

  const checkAuth = () => {
    if (currentUser) return
    const id = localStorage.getItem('currentUser')
    if (!id) {
      setIsFetching(false)
      return
    }
    setIsFetching(true)
    apiRoot
      .customers()
      .withId({ ID: id })
      .get()
      .execute()
      .then((res) => {
        if (!res || !res.body.firstName || !res.body.lastName) {
          return
        }
        setCurrentUser(res.body)
      })
      .catch((res) => {
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.LOGIN_FAIL, true)
        localStorage.clear()
      })
      .finally(() => {
        setIsFetching(false)
      })
  }

  const login = async (data: UserLoginPayloadType) => {
    setIsFetching(true)
    apiRoot
      .login()
      .post({
        body: data,
      })
      .execute()
      .then((res) => {
        localStorage.setItem('currentUser', res.body.customer.id)

        setSystMsg(
          `${SYSTEM_MESSAGES.LOGIN_SCSS} ${res.body.customer.firstName}`,
          false,
        )
        checkAuth()
        navigate('/')
      })
      .catch(() => {
        setSystMsg(SYSTEM_MESSAGES.LOGIN_FAIL, true)
        localStorage.clear()
      })
      .finally(() => setIsFetching(false))
  }

  const register = (data: UserRegisterPayloadType) => {
    setIsFetching(true)
    apiRoot
      .customers()
      .post({
        body: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
        },
      })
      .execute()
      .then((res) => {
        const actions = [
          {
            action: 'addAddress',
            address: {
              streetName: data.street,
              streetNumber: data.bldng,
              postalCode: data.zipCode,
              city: data.city,
              country: data.country,
            },
          },
        ] as CustomerUpdateAction[]
        if (
          !data.isBillingAddressSame &&
          data.billingBldng &&
          data.billingCity &&
          data.billingCountry &&
          data.billingStreet &&
          data.billingZipCode
        ) {
          actions.push({
            action: 'addAddress',
            address: {
              streetName: data.billingStreet,
              streetNumber: data.billingBldng,
              postalCode: data.billingZipCode,
              city: data.billingCity,
              country: data.billingCountry,
            },
          })
        }
        if (data.dateOfBirth) {
          actions.push({
            action: 'setDateOfBirth',
            dateOfBirth: data.dateOfBirth,
          })
        }
        apiRoot
          .customers()
          .withId({ ID: res.body.customer.id })
          .post({
            body: {
              version: res.body.customer.version,
              actions,
            },
          })
          .execute()
          .then((res2) => {
            const actions2 = [] as CustomerUpdateAction[]
            if (data.isBillingAddressSame) {
              actions2.push({
                action: 'addBillingAddressId',
                addressId: res2.body.addresses[0].id,
              })
              if (data.setDefaultShipAddress) {
                actions2.push({
                  action: 'setDefaultShippingAddress',
                  addressId: res2.body.addresses[0].id,
                })
              }
              if (data.setDefaultBillingAddress) {
                actions2.push({
                  action: 'setDefaultBillingAddress',
                  addressId: res2.body.addresses[0].id,
                })
              }
            } else {
              const billingAddress = res2.body.addresses.find(
                (a) =>
                  a.country === data.billingCountry &&
                  a.city === data.billingCity &&
                  a.postalCode === data.billingZipCode &&
                  a.streetName === data.billingStreet &&
                  a.streetNumber === data.billingBldng,
              )
              const address = res2.body.addresses.find(
                (a) =>
                  a.country === data.country &&
                  a.city === data.city &&
                  a.postalCode === data.zipCode &&
                  a.streetName === data.street &&
                  a.streetNumber === data.bldng,
              )
              if (data.setDefaultShipAddress) {
                actions2.push({
                  action: 'setDefaultShippingAddress',
                  addressId: address!.id,
                })
              }
              if (data.setDefaultBillingAddress) {
                actions2.push({
                  action: 'setDefaultBillingAddress',
                  addressId: billingAddress!.id,
                })
              } else {
                actions2.push({
                  action: 'addBillingAddressId',
                  addressId: billingAddress!.id,
                })
              }
            }
            apiRoot
              .customers()
              .withId({ ID: res2.body.id })
              .post({
                body: {
                  version: res2.body.version,
                  actions: actions2,
                },
              })
              .execute()
              .then(() => {
                setSystMsg(SYSTEM_MESSAGES.REGISTER_SCSS, false)
                login({ email: data.email, password: data.password })
              })
          })
          .catch((res2) => {
            setSystMsg(res2.body.message ?? SYSTEM_MESSAGES.REGISTER_FAIL, true)
          })
      })
      .catch((res) => {
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.REGISTER_FAIL, true)
      })
      .finally(() => setIsFetching(false))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.clear()
    setSystMsg(SYSTEM_MESSAGES.LOGOUT_SCSS, false)
    navigate('/')
  }

  const setDefaultAddress = (
    addressType: 'shipping' | 'billing',
    addressId: string,
    userVersion?: number,
  ) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser
    const version = userVersion || currentUser.version

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version,
          actions: [
            {
              action:
                addressType === 'billing'
                  ? 'setDefaultBillingAddress'
                  : 'setDefaultShippingAddress',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const setAddress = (
    addressType: 'shipping' | 'billing',
    addressId: string,
    userVersion?: number,
  ) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser
    const version = userVersion || currentUser.version

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version,
          actions: [
            {
              action:
                addressType === 'billing'
                  ? 'addBillingAddressId'
                  : 'addShippingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const unsetAddress = (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: currentUser.version,
          actions: [
            {
              action:
                addressType === 'billing'
                  ? 'removeBillingAddressId'
                  : 'removeShippingAddressId',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const addAddress = (
    address: Address,
    setDefaultShippingAddress: boolean,
    setDefaultBillingAddress: boolean,
  ) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: currentUser.version,
          actions: [
            {
              action: 'addAddress',
              address,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        const newAddress = res?.body.addresses?.find(
          (a) =>
            a.city === address.city &&
            a.streetName === address.streetName &&
            a.streetNumber === address.streetNumber,
        )
        if (!newAddress?.id) return
        if (setDefaultShippingAddress && !setDefaultBillingAddress) {
          setDefaultAddress('shipping', newAddress.id, res.body.version)
        } else if (setDefaultBillingAddress && !setDefaultShippingAddress) {
          setDefaultAddress('billing', newAddress.id, res.body.version)
        } else if (setDefaultBillingAddress && setDefaultShippingAddress) {
          apiRoot
            .customers()
            .withId({ ID: id })
            .post({
              body: {
                version: res.body.version,
                actions: [
                  {
                    action: 'setDefaultBillingAddress',
                    addressId: newAddress.id,
                  },
                  {
                    action: 'setDefaultShippingAddress',
                    addressId: newAddress.id,
                  },
                ],
              },
            })
            .execute()
            .then((res2) => {
              setCurrentUser(res2.body)
              setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
            })
            .catch((res2) =>
              setSystMsg(
                res2.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR,
                true,
              ),
            )
            .finally(() => setIsFetching(false))
        }
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const editAddress = (addressId: string, address: Address) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: currentUser.version,
          actions: [
            {
              action: 'changeAddress',
              addressId,
              address,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const removeAddress = (addressId: string) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser

    apiRoot
      .customers()
      .withId({ ID: id })
      .post({
        body: {
          version: currentUser.version,
          actions: [
            {
              action: 'removeAddress',
              addressId,
            },
          ],
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const updateUserData = (userData: UserUpdatePayloadType) => {
    if (!currentUser) return
    setIsFetching(true)
    const { firstName, lastName, dateOfBirth, email } = userData

    const actions = [] as CustomerUpdateAction[]
    if (firstName && firstName !== currentUser?.firstName) {
      actions.push({
        action: 'setFirstName',
        firstName,
      })
    }
    if (lastName && lastName !== currentUser?.lastName) {
      actions.push({
        action: 'setLastName',
        lastName,
      })
    }
    if (dateOfBirth && dateOfBirth !== currentUser?.dateOfBirth) {
      actions.push({
        action: 'setDateOfBirth',
        dateOfBirth,
      })
    }
    if (email && email !== currentUser?.email) {
      actions.push({
        action: 'changeEmail',
        email,
      })
    }
    if (actions.length === 0) return
    apiRoot
      .customers()
      .withId({ ID: currentUser.id })
      .post({
        body: {
          version: currentUser.version,
          actions,
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.EDIT_USER_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.DEFAULT_ERROR, true),
      )
      .finally(() => setIsFetching(false))
  }

  const updatePassword = (newPassword: string, currentPassword: string) => {
    setIsFetching(true)
    if (!currentUser) return
    const { id } = currentUser

    apiRoot
      .customers()
      .password()
      .post({
        body: {
          id,
          version: currentUser.version,
          currentPassword,
          newPassword,
        },
      })
      .execute()
      .then((res) => {
        setCurrentUser(res.body)
        setSystMsg(SYSTEM_MESSAGES.PASSWORD_CHANGE_SCSS, false)
      })
      .catch((res) =>
        setSystMsg(
          res.body.message ?? SYSTEM_MESSAGES.PASSWORD_CHANGE_ERR,
          true,
        ),
      )
      .finally(() => setIsFetching(false))
  }

  return {
    login,
    register,
    isLoggedIn,
    currentUser,
    logout,
    checkAuth,
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
