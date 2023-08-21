import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomerUpdateAction } from '@commercetools/platform-sdk'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import {
  UserRegisterPayloadType,
  UserLoginPayloadType,
  UserLoggedIn,
} from '@/Models/Models'
import { apiRoot } from '../eComMerchant/client'

export default function useAuth(
  setSystMsg: (msg: string, isSuccess: boolean) => void,
  setIsFetching: (isFetching: boolean) => void,
) {
  const [currentUser, setCurrentUser] = useState<null | UserLoggedIn>(null)
  const isLoggedIn = !!currentUser
  const navigate = useNavigate()

  const login = (data: UserLoginPayloadType) => {
    setIsFetching(true)
    apiRoot
      .login()
      .post({
        body: data,
      })
      .execute()
      .then((res) => {
        setCurrentUser({
          id: res.body.customer.id,
          email: res.body.customer.email,
          firstName: res.body.customer.firstName as string,
          lastName: res.body.customer.lastName as string,
        })
        localStorage.setItem('currentUser', res.body.customer.id)
        setSystMsg(
          `${SYSTEM_MESSAGES.LOGIN_SCSS} ${res.body.customer.firstName}`,
          false,
        )
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

  const checkAuth = () => {
    setIsFetching(true)
    if (currentUser) return
    const id = localStorage.getItem('currentUser')
    if (!id) {
      return
    }
    apiRoot
      .customers()
      .withId({ ID: id })
      .get()
      .execute()
      .then((res) => {
        if (!res.body.firstName || !res.body.lastName) {
          return
        }
        setCurrentUser({
          email: res.body.email,
          firstName: res.body.firstName,
          lastName: res.body.lastName,
          id: res.body.id,
        })
      })
      .finally(() => setIsFetching(false))
  }

  return { login, register, isLoggedIn, currentUser, logout, checkAuth }
}
