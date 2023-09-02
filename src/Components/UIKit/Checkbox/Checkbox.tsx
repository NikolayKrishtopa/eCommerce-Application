import cn from 'classnames'
import CheckboxProps from './Checkbox.props'
import './Checkbox.scss'

export default function Checkbox(props: CheckboxProps) {
  const {
    className,
    label,
    id,
    disabled,
    changeOnLabelClick = true,
    ...inputProps
  } = props

  let inputId: string | undefined

  if (typeof id === 'number') {
    inputId = String(id)
  }

  if (label) {
    inputId = id || crypto.randomUUID()
  }

  return (
    <div
      className={cn('checkbox', { 'checkbox--disabled': disabled }, className)}
    >
      <input
        id={inputId}
        type="checkbox"
        className="checkbox__input"
        disabled={disabled}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...inputProps}
      />
      {label && (
        <label
          htmlFor={inputId}
          className={cn('checkbox__label', {
            'checkbox__label--clickable': changeOnLabelClick,
          })}
        >
          {label}
        </label>
      )}
    </div>
  )
}
