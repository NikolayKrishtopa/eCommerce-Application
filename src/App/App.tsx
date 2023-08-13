import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'

import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/LoginPage/LoginPage'
import RegistrationPage from '../Pages/RegistrationPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(true)

  const resetSystMsg = () => {
    setSystMsg('')
    setIsError(false)
  }

  return (
    <>
      <Header />
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <button
        type="button"
        onClick={() => setSystMsg('test message')}
        style={{ marginTop: '100px' }}
      >
        test use only-needs to be removed then
      </button>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
