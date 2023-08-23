import { beforeEach, describe, test, expect } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import Loader, { FullPageLoader } from './Loader'

describe('Loader tests', () => {
  beforeEach(() => {
    cleanup()
  })

  test('Show... Hide... Show', () => {
    const getLoader = () => screen.queryByTestId('loader')

    test('FullPageLoader', () => {
      const { rerender } = render(<FullPageLoader show />)
      expect(getLoader()).toBeInTheDocument()

      rerender(<FullPageLoader show={false} />)
      expect(getLoader()).toBeNull()

      render(<FullPageLoader show />)
      expect(getLoader()).toBeInTheDocument()
    })
    test('Loader', () => {
      const { rerender } = render(<Loader show />)
      expect(getLoader()).toBeInTheDocument()

      rerender(<Loader show={false} />)
      expect(getLoader()).toBeNull()

      render(<Loader show />)
      expect(getLoader()).toBeInTheDocument()
    })
  })
})
