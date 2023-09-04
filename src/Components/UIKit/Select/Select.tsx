import cn from 'classnames'
import './Select.scss'
import useMemoId from '@/hooks/useMemoId'
import { ReactComponent as SvgDropdown } from '@/assets/icons/dropdown.svg'
import InputSlot from '../InputSlot/InputSlot'
import SelectProps, { SelectOptionProps } from './Select.props'

export function Option(props: SelectOptionProps) {
  const { children, className, ...optionProps } = props
  return (
    <option
      className={cn('select__option', className)}
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...optionProps}
    >
      {children}
    </option>
  )
}

export default function Select(props: SelectProps) {
  const {
    className,
    label,
    id,
    error,
    errorJump,
    disabled,
    children,
    ...selectProps
  } = props

  const selectId = useMemoId(id)

  return (
    <InputSlot
      htmlFor={selectId}
      className={className}
      label={label}
      error={error}
      errorJump={errorJump}
      disabled={disabled}
      selectLabelText
    >
      <div className="select">
        <select
          className="select__select"
          id={selectId}
          disabled={disabled}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...selectProps}
        >
          {children}
        </select>
        <span className="select__icon-container">
          <SvgDropdown className="select__icon" />
        </span>
      </div>
    </InputSlot>
  )
}
