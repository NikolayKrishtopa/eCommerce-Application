import { SYSTEM_MESSAGES } from '@/utils/constants'
import { UserRegisterPayloadType, UserLoginPayloadType } from '@/Models/Models'
import { apiRoot } from '../client'

export default function useAuth(
  setSystMsg: (msg: string, isSuccess: boolean) => void,
) {
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
      .catch(() => {
        setSystMsg(SYSTEM_MESSAGES.REGISTER_FAIL, true)
      })
      .finally(console.log)
  }

  const login = (data: UserLoginPayloadType) => {
    apiRoot
      .login()
      .post({
        body: data,
      })
      .execute()
      .then(() => {
        setSystMsg(SYSTEM_MESSAGES.LOGIN_SCSS, false)
      })
      .catch(() => {
        setSystMsg(SYSTEM_MESSAGES.LOGIN_FAIL, true)
      })
      .finally(console.log)
  }

  return { login, register }
}
