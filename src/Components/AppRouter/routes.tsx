import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import LoginPage from '../../Pages/LoginPage/LoginPage'
import Main from '../../Pages/Main/Main'
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
      { index: true, element: <Main /> },
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
