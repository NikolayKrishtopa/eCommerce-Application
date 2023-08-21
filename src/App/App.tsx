import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import useAuth from '@/hooks/useAuth'
import ProtectedRoute from '@/hok/ProtectedRoute'
import { FullPageLoader } from '@/Components/Loader/Loader'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/AuthPage/LoginPage'
import RegistrationPage from '../Pages/AuthPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const setupMsg = (msg: string, error: boolean) => {
    setSystMsg(msg)
    setIsError(error)
  }

  const { login, register, currentUser, logout, checkAuth } = useAuth(setupMsg)

  const resetSystMsg = () => {
    setSystMsg('')
  }

  // remove those useEffects when done
  useEffect(() => {
    checkAuth()
    console.log(currentUser)
    setIsFetching(false)
  }, [])

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <FullPageLoader show={isFetching} />
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <Header onLogout={logout} />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute condition={!currentUser}>
              <LoginPage onSubmit={login} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute condition={!currentUser}>
              <RegistrationPage onSubmit={register} />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </CurrentUserContext.Provider>
  )
}
