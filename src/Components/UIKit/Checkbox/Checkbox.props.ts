type CheckboxProps = Omit<JSX.IntrinsicElements['input'], 'type'> & {
  id?: string | number
  label?: string
  changeOnLabelClick?: boolean
}

export default CheckboxProps
