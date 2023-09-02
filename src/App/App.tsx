import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import useAuth from '@/hooks/useAuth'
import ProtectedRoute from '@/hok/ProtectedRoute/ProtectedRoute'
import { FullPageLoader } from '@/Components/Loader/Loader'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import './App.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/AuthPage/LoginPage'
import RegistrationPage from '../Pages/AuthPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import ProductsPage from '../Pages/ProductsPage/ProductsPage'

function PageBuilder(build: {
  HeaderJSX: JSX.Element
  FooterJSX: JSX.Element
}) {
  const { HeaderJSX, FooterJSX } = build
  return function Page(props: {
    header?: boolean
    footer?: boolean
    children: JSX.Element
  }) {
    const { header = false, children, footer = false } = props
    return (
      <>
        {header && HeaderJSX}
        {children}
        {footer && FooterJSX}
      </>
    )
  }
}

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const setupMsg = (msg: string, error: boolean) => {
    setSystMsg(msg)
    setIsError(error)
  }

  const { login, register, currentUser, logout, checkAuth } = useAuth(
    setupMsg,
    setIsFetching,
  )

  const resetSystMsg = () => {
    setSystMsg('')
  }

  // remove those useEffects when done
  useEffect(() => {
    checkAuth()
    console.log(currentUser)
    setIsFetching(false)
  }, [])

  const Page = PageBuilder({
    HeaderJSX: <Header onLogout={logout} />,
    FooterJSX: <Footer />,
  })

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <FullPageLoader show={isFetching} />
      <SystMsgAlert
        msg={systMsg}
        onResetMsg={resetSystMsg}
        type={isError ? 'fail' : 'success'}
      />
      <Header onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <Page header footer>
              <MainPage />
            </Page>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectedRoute condition={!currentUser}>
              <Page header>
                <LoginPage onSubmit={login} />
              </Page>
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute condition={!currentUser}>
              <Page header>
                <RegistrationPage onSubmit={register} />
              </Page>
            </ProtectedRoute>
          }
        />
        <Route
          path="/catalog"
          element={
            <Page header footer>
              <ProductsPage />
            </Page>
          }
        />
        <Route
          path="/*"
          element={
            <Page header>
              <NotFoundPage />
            </Page>
          }
        />
      </Routes>
    </CurrentUserContext.Provider>
  )
}
