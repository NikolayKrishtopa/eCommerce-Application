import { ReactNode } from 'react'

type InputSlotProps = {
  className?: string
  label?: string
  htmlFor?: string
  error?: string
  errorJump?: boolean
  icon?: JSX.Element
  iconError?: JSX.Element
  onIconClick?: () => void
  disabled?: boolean
  children?: ReactNode
  selectLabelText?: boolean
}

export default InputSlotProps
