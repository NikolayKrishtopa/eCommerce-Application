import { afterEach, describe, expect, test } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import AppRouter from './AppRouter'
import routes from './routes'

describe('Test router', () => {
  const testRoutes = [
    { path: '/', navlink: 'Main', check: 'Hello from task crushers' },
    { path: '/login', navlink: 'Login', check: 'Please Log In' },
    { path: '/registration', navlink: 'Registration', check: 'Please Sign Up' },
  ]

  test.each(testRoutes)(
    'By clicking on $navlink -> $check should be rendered',
    (item) => {
      render(<AppRouter />)

      fireEvent.click(screen.getByText(item.navlink))

      expect(screen.getByText(item.check)).toBeDefined()

      afterEach(() => {
        document.body.innerHTML = ``
      })
    },
  )

  test.each(testRoutes)(
    'By entering path $path -> $check should be rendered',
    (item) => {
      const stubRouter = createMemoryRouter(routes, {
        initialEntries: [item.path],
      })

      render(<RouterProvider router={stubRouter} />)

      expect(screen.getByText(item.check)).toBeDefined()
    },
  )

  test('handling non existing path', () => {
    const wrongPath = '/wrong-path'
    const stubRouter = createMemoryRouter(routes, {
      initialEntries: [wrongPath],
    })
    render(<RouterProvider router={stubRouter} />)

    expect(screen.getByText('404: Page Not Found')).toBeDefined()
  })
})
