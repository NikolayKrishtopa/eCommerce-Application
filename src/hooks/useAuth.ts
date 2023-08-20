import { useState } from 'react'
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
) {
  const [currentUser, setCurrentUser] = useState<null | UserLoggedIn>(null)
  const isLoggedIn = !!currentUser

  const register = (data: UserRegisterPayloadType) => {
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
                  action: 'addShippingAddressId',
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
              actions2.push({
                action: 'addBillingAddressId',
                addressId: billingAddress!.id,
              })
              if (data.setDefaultShipAddress) {
                actions2.push({
                  action: 'setDefaultShippingAddress',
                  addressId: address!.id,
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
              .then(() => setSystMsg(SYSTEM_MESSAGES.REGISTER_SCSS, false))
          })
      })
      .catch((res) => {
        setSystMsg(res.body.message ?? SYSTEM_MESSAGES.REGISTER_FAIL, true)
      })
  }

  const login = (data: UserLoginPayloadType) => {
    apiRoot
      .login()
      .post({
        body: data,
      })
      .execute()
      .then((res) => {
        setCurrentUser({
          email: res.body.customer.email,
          firstName: res.body.customer.firstName as string,
          lastName: res.body.customer.lastName as string,
        })
        setSystMsg(
          `${SYSTEM_MESSAGES.LOGIN_SCSS} ${res.body.customer.firstName}`,
          false,
        )
      })
      .catch(() => {
        setSystMsg(SYSTEM_MESSAGES.LOGIN_FAIL, true)
      })
  }

  const checkAuth = () => {
    apiRoot
      .get()
      //   .withPasswordToken({
      //     passwordToken: 'c40f7784-012a-45d6-bebe-fe340263ec85',
      //   })
      .execute()
      .then(console.log)
  }

  const logout = () => {
    setCurrentUser(null)
    setSystMsg(SYSTEM_MESSAGES.LOGOUT_SCSS, false)
  }

  return { login, register, isLoggedIn, currentUser, logout, checkAuth }
}
