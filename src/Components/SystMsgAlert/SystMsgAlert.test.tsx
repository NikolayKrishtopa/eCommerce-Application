import { vi, beforeEach, describe, test, expect } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SystMsgAlert from './SystMsgAlert'

describe('System message tests', () => {
  beforeEach(() => {
    cleanup()
  })

  test(`Fire onResetMsg function on close button click`, async () => {
    const onResetMsg = vi.fn()
    const user = userEvent.setup()

    render(<SystMsgAlert msg="Error" onResetMsg={onResetMsg} />)

    await user.click(screen.getByTestId('exit-button'))
    expect(onResetMsg).toBeCalled()
  })
})
