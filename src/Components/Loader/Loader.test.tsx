import { beforeEach, describe, test, expect } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import Loader, { FullPageLoader } from './Loader'

describe('Loader tests', () => {
  beforeEach(() => {
    cleanup()
  })

  const getLoader = () => screen.queryByTestId('loader')

  describe('Loader mount/unmount on show attribute change', () => {
    test('<FullPageLoader />', () => {
      const { rerender } = render(<FullPageLoader show />)
      expect(getLoader()).toBeInTheDocument()

      rerender(<FullPageLoader show={false} />)
      expect(getLoader()).toBeNull()

      render(<FullPageLoader show />)
      expect(getLoader()).toBeInTheDocument()
    })
    test('<Loader />', () => {
      const { rerender } = render(<Loader show />)
      expect(getLoader()).toBeInTheDocument()

      rerender(<Loader show={false} />)
      expect(getLoader()).toBeNull()

      render(<Loader show />)
      expect(getLoader()).toBeInTheDocument()
    })
  })

  describe(`FullPageLoader removes no scroll side effect`, () => {
    test(`-> on hide`, () => {
      const { rerender } = render(<FullPageLoader show />)
      expect(document.body).toHaveStyle({ overflow: 'hidden' })

      rerender(<FullPageLoader show={false} />)
      expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
    })
    test(`-> on unmount`, () => {
      const { unmount } = render(<FullPageLoader show />)
      expect(document.body).toHaveStyle({ overflow: 'hidden' })

      unmount()
      expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
    })
  })
})
