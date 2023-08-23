import { vi, beforeEach, describe, test, expect } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import Header from './Header'

describe('Header unit tests', () => {
  const UserData = {
    id: '123456789',
    email: 'johndoe@example.com',
    firstName: 'John',
    lastName: 'Doe',
  }

  const renderWithContext = (element: JSX.Element, { user = true }) =>
    render(
      <BrowserRouter>
        <CurrentUserContext.Provider value={user ? UserData : null}>
          {element}
        </CurrentUserContext.Provider>
      </BrowserRouter>,
    )

  beforeEach(() => {
    cleanup()
  })

  describe('Change Header view on user presence', () => {
    test(`Show Login/Register buttons if user does not exist`, () => {
      renderWithContext(<Header onLogout={() => {}} />, { user: false })

      expect(screen.getByTestId('login-button')).toBeInTheDocument()
      expect(screen.getByTestId('register-button')).toBeInTheDocument()
    })

    test(`Hide Login/Register buttons if user exists`, () => {
      renderWithContext(<Header onLogout={() => {}} />, { user: true })

      expect(screen.queryByTestId('login-button')).toBeNull()
      expect(screen.queryByTestId('register-button')).toBeNull()
    })

    test(`Show Profile/Logout buttons if user exists`, () => {
      renderWithContext(<Header onLogout={() => {}} />, { user: true })

      expect(screen.getByTestId('profile-button')).toBeInTheDocument()
      expect(screen.getByTestId('logout-button')).toBeInTheDocument()
    })
  })

  test(`Fire onLogout function on corresponding element click`, async () => {
    const onLogout = vi.fn()
    const user = userEvent.setup()

    renderWithContext(<Header onLogout={onLogout} />, { user: true })

    await user.click(screen.getByTestId('logout-button'))
    expect(onLogout).toBeCalled()
  })
})
