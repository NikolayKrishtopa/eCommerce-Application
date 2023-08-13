import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import LoginPage from '../../Pages/LoginPage/LoginPage'
import MainPage from '../../Pages/MainPage/MainPage'
import NotFoundPage from '../../Pages/NotFoundPage/NotFoundPage'
import RegistrationPage from '../../Pages/RegistrationPage/RegistrationPage'

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
