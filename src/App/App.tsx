import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import CurrentUserContext from '@/hooks/contexts/CurrentUserContext'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegistrationPage from '../Pages/RegistrationPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'
import { getProject } from '../eComMerchant/client'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const setupMsg = (msg: string, error: boolean) => {
    setSystMsg(msg)
    setIsError(error)
  }

  const { login, register, isLoggedIn, currentUser, logout } = useAuth(setupMsg)

  const resetSystMsg = () => {
    setupMsg('', false)
  }

  // remove those useEffects when done
  useEffect(() => {
    getProject().catch(() => setupMsg(SYSTEM_MESSAGES.INIT_ERROR, true))
    console.log([isLoggedIn, currentUser])
  }, [])

  // useEffect(() => {
  //   apiRoot
  //     .me()
  //     .get({ headers: { token: 'zPAlO72LJQcqplgmj9-VyMgqgRoAgjAK' } })
  //     .execute()
  //     .then(console.log)
  // }, [])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <button
        style={{ marginTop: '300px' }}
        type="button"
        onClick={() =>
          register({
            email: 'johndoe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            password: 'secret123',
          })
        }
      >
        Register
      </button>
      <button
        style={{ marginTop: '300px' }}
        type="button"
        onClick={() =>
          login({
            email: 'johndoe@example.com',
            password: 'secret123',
          })
        }
      >
        Login
      </button>
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <button style={{ marginTop: '300px' }} type="button" onClick={logout}>
        Logout
      </button>
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </CurrentUserContext.Provider>
  )
}
