import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('Rendered with heading', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined()
  })
})
