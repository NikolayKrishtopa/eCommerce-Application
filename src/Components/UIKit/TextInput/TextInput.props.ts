import InputSlotProps from '../InputSlot/InputSlot.props'

type TextInputProps = JSX.IntrinsicElements['input'] &
  Omit<InputSlotProps, 'htmlFor'> & {
    type?: 'text' | 'number' | 'email' | 'password' | 'date'
    id?: string | number
  }

export default TextInputProps
