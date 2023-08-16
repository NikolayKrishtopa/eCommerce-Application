import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'

import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegistrationPage from '../Pages/RegistrationPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'
import { getProject, apiRoot } from '../client'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)

  const resetSystMsg = () => {
    setSystMsg('')
    setIsError(false)
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

  useEffect(() => {
    apiRoot
      .me()
      .get({ headers: { token: 'zPAlO72LJQcqplgmj9-VyMgqgRoAgjAK' } })
      .execute()
      .then(console.log)
  }, [])

  return (
    <>
      <Header />
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
