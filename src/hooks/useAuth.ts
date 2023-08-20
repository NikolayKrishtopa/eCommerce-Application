import { useState } from 'react'
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
        body: data,
      })
      .execute()
      .then(() => {
        setSystMsg(SYSTEM_MESSAGES.REGISTER_SCSS, false)
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

  const logout = () => {
    setCurrentUser(null)
    setSystMsg(SYSTEM_MESSAGES.LOGOUT_SCSS, false)
  }

  return { login, register, isLoggedIn, currentUser, logout }
}
