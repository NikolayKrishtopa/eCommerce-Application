import TextInputProps from '../TextInput/TextInput.props'

type TextInputHiddenProps = Omit<
  TextInputProps,
  'type' | 'icon' | 'iconError' | 'onIconClick'
> & {
  visible?: boolean
  onIconClick?: (nextVisible: boolean) => void
}

export default TextInputHiddenProps
