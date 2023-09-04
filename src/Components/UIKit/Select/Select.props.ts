import { ReactElement, ReactNode } from 'react'
import InputSlotProps from '../InputSlot/InputSlot.props'

type SelectOptionProps = {
  value: string
  disabled?: boolean
  children?: ReactNode
}

type SelectProps = Omit<
  InputSlotProps,
  'children' | 'icon' | 'iconError' | 'onIconClick' | 'htmlFor'
> & {
  currentValue: SelectOptionProps['value']
  id?: string | number
  children?: ReactElement<SelectOptionProps> | ReactElement<SelectOptionProps>[]
  open?: boolean
  onOptionChange?: (value: string) => void
}

export default SelectProps
export type { SelectOptionProps }
