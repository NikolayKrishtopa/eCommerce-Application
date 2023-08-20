import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CurrentUserContext from '@/hooks/contexts/CurrentUserContext'
import useAuth from '@/hooks/useAuth'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/AuthPage/LoginPage'
import RegistrationPage from '../Pages/AuthPage/RegistrationPage'
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

  const { login, register, currentUser, logout, checkAuth } = useAuth(setupMsg)

  const resetSystMsg = () => {
    setupMsg('', false)
  }

  // remove those useEffects when done
  useEffect(() => {
    getProject().catch(() => setupMsg(SYSTEM_MESSAGES.INIT_ERROR, true))
    checkAuth()
  }, [])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <button
        style={{ marginTop: '300px' }}
        type="button"
        onClick={() =>
          register({
            email: 'fff@example.am',
            firstName: 'Samuel',
            lastName: 'Jackson',
            password: 'secret123',
            country: 'US',
            city: 'Los Angeles',
            street: '1st str.',
            bldng: '3',
            zipCode: '001001',
            isBillingAddressSame: false,
            setDefaultShipAddress: false,
            billingCountry: 'US',
            billingCity: 'Tacoma',
            billingStreet: '5st str.',
            billingBldng: '14',
            billingZipCode: '001001',
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
            email: 'fff@example.am',
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
