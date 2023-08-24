import { vi, beforeEach, describe, test, expect } from 'vitest'
import { render, cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SystMsgAlert from './SystMsgAlert'
import s from './SystMsgAlert.module.scss'

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

  test(`Toggle '.shown' className on empty 'msg' attribute`, async () => {
    const { rerender } = render(
      <SystMsgAlert msg="Error" onResetMsg={() => {}} />,
    )

    expect(screen.getByTestId('alert')).toHaveClass(s.shown)

    rerender(<SystMsgAlert msg="" onResetMsg={() => {}} />)

    expect(screen.getByTestId('alert')).not.toHaveClass(s.shown)
  })
})
