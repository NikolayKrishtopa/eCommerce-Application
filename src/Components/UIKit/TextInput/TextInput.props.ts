type TextInputProps = JSX.IntrinsicElements['input'] & {
  type?: 'text' | 'email' | 'password' | 'date'
  id?: string | number
  label?: string
  error?: string
  errorJump?: boolean
  icon?: JSX.Element
  iconError?: JSX.Element
  onIconClick?: () => void
}

export default TextInputProps
