import InputSlotProps from '../InputSlot/InputSlot.props'

type SelectProps = JSX.IntrinsicElements['select'] &
  Omit<
    InputSlotProps,
    'children' | 'icon' | 'iconError' | 'onIconClick' | 'htmlFor'
  > & {
    id?: string | number
    options?: JSX.Element
    children?: React.ReactNode[]
  }

type SelectOptionProps = JSX.IntrinsicElements['option']

export default SelectProps
export type { SelectOptionProps }
