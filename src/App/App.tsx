import { useMemo, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SessionContext from '@/contexts/SessionContext'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import CartContext from '@/contexts/CartContext'
import AboutPage from '@/Pages/AboutPage/AboutPage'
import ProtectedRoute from '@/hok/ProtectedRoute/ProtectedRoute'
import { FullPageLoader } from '@/Components/Loader/Loader'
import CartPage from '@/Pages/CartPage/CartPage'
import useAuth from '@/hooks/useAuth'
import useUser from '@/hooks/useUser'
import useCart from '@/hooks/useCart'
import SystMsgAlert from '../Components/SystMsgAlert/SystMsgAlert'
import s from './App.module.scss'
import MainPage from '../Pages/MainPage/MainPage'
import LoginPage from '../Pages/AuthPage/LoginPage'
import RegistrationPage from '../Pages/AuthPage/RegistrationPage'
import NotFoundPage from '../Pages/NotFoundPage/NotFoundPage'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'
import ProductCardRoutes from '../Pages/ProductsPage/ProductsPage'
import UserProfile from '../Pages/UserProfile/UserProfile'

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
    const { header = false, footer = false, children } = props
    return (
      <div className={s.page}>
        {header && HeaderJSX}
        <div className={s.pageMain}>{children}</div>
        {footer && FooterJSX}
      </div>
    )
  }
}

export default function App() {
  const [systMsg, setSystMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [isFetching, setIsFetching] = useState(false)

  const setupMsg = (msg: string, isSuccess: boolean) => {
    setSystMsg(msg)
    setIsError(!isSuccess)
  }

  const auth = useAuth()

  const { authApiRoot, currentUser, sessionState, isAuthenticated } = auth

  const {
    userLogin,
    userRegister,
    userLogout,
    setDefaultAddress,
    setAddress,
    addAddress,
    removeAddress,
    updateUserData,
    updatePassword,
    editAddress,
    unsetAddress,
  } = useUser({
    ...auth,
    systemMessage: setupMsg,
    setIsFetching,
  })

  const resetSystMsg = () => {
    setSystMsg('')
  }

  const Page = PageBuilder({
    HeaderJSX: <Header onLogout={userLogout} />,
    FooterJSX: <Footer />,
  })

  const cart = useCart(setIsFetching)

  const sessionContextValue = useMemo(
    () => ({ authApiRoot, isAuthenticated, sessionState }),
    [isAuthenticated, sessionState],
  )

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <CurrentUserContext.Provider value={currentUser}>
        <CartContext.Provider value={cart}>
          <FullPageLoader show={isFetching} />
          <SystMsgAlert
            msg={systMsg}
            onResetMsg={resetSystMsg}
            type={isError ? 'fail' : 'success'}
          />
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
                <ProtectedRoute condition={!isAuthenticated}>
                  <Page header>
                    <LoginPage onSubmit={userLogin} />
                  </Page>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute condition={!isAuthenticated}>
                  <Page header>
                    <RegistrationPage onSubmit={userRegister} />
                  </Page>
                </ProtectedRoute>
              }
            />
            <Route
              path="/about"
              element={
                <Page header footer>
                  <AboutPage />
                </Page>
              }
            />
            <Route
              path="/catalog/*"
              element={
                <Page header footer>
                  <ProductCardRoutes />
                </Page>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute condition={isAuthenticated}>
                  <Page header footer>
                    <UserProfile
                      onUserUpdate={updateUserData}
                      onPasswordChange={updatePassword}
                      onAddAddress={addAddress}
                      onEditAddress={editAddress}
                      onSetAddress={setAddress}
                      onRemoveAddress={removeAddress}
                      onSetDefaultAddress={setDefaultAddress}
                      onUnsetAddress={unsetAddress}
                    />
                  </Page>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <Page header footer>
                  <CartPage alert={(msg: string) => setupMsg(msg, true)} />
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
        </CartContext.Provider>
      </CurrentUserContext.Provider>
    </SessionContext.Provider>
  )
}
