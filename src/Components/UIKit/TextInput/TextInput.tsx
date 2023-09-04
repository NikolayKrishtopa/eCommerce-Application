import './TextInput.scss'
import useMemoId from '@/hooks/useMemoId'
import InputSlot from '../InputSlot/InputSlot'
import TextInputProps from './TextInput.props'

export default function TextInput(props: TextInputProps) {
  const {
    type = 'text',
    className,
    label,
    id,
    error,
    errorJump,
    icon,
    iconError,
    onIconClick,
    disabled,
    children,
    ...inputProps
  } = props

  const inputId = useMemoId(id)

  return (
    <InputSlot
      htmlFor={inputId}
      className={className}
      label={label}
      error={error}
      errorJump={errorJump}
      icon={icon}
      iconError={iconError}
      onIconClick={onIconClick}
      disabled={disabled}
    >
      <input
        className="text-input"
        type={type}
        id={inputId}
        disabled={disabled}
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...inputProps}
      />
    </InputSlot>
  )
}
