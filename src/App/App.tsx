import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegistrationPage from '../Pages/RegistrationPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'
import { getProject } from '../client'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const setupMsg = (msg: string, error: boolean) => {
    setSystMsg(msg)
    setIsError(error)
  }

  const { login, register } = useAuth(setupMsg)

  const resetSystMsg = () => {
    setupMsg('', false)
  }

  // remove those useEffects when done
  useEffect(() => {
    getProject()
      .then((res) => {
        console.log(res.body)
        setSystMsg('project data is loaded')
      })
      .catch(console.log)
  }, [])

  // useEffect(() => {
  //   apiRoot
  //     .me()
  //     .get({ headers: { token: 'zPAlO72LJQcqplgmj9-VyMgqgRoAgjAK' } })
  //     .execute()
  //     .then(console.log)
  // }, [])

  return (
    <>
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
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
