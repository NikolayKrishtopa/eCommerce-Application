import { Outlet } from 'react-router-dom'
import LoginPage from '../../Pages/Login/login-page'
import MainPage from '../../Pages/Main/main-page'
import RegistrationPage from '../../Pages/Registration/registration-page'
import NotFoundPage from '../../Pages/404/not-found-page'
import Header from '../Header/Header'

const routes = [
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <MainPage /> },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegistrationPage />,
      },
    ],
  },
]

export default routes
