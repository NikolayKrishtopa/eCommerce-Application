import cn from 'classnames'
import { ReactComponent as SvgError } from '@/assets/icons/error.svg'
import styleVars from './TextInput.module.scss'
import TextInputProps from './TextInput.props'

export default function TextInput(props: TextInputProps) {
  const {
    type = 'text',
    className,
    label,
    id,
    error,
    errorJump = false,
    icon,
    iconError,
    onIconClick,
    disabled,
    children,
    ...inputProps
  } = props

  const isError = typeof error === 'string' && error.length

  let inputId: string | undefined

  if (typeof id === 'number') {
    inputId = String(id)
  }

  if (label) {
    inputId = id || crypto.randomUUID()
  }

  return (
    <div
      className={cn(
        'text-input',
        {
          'text-input--error': isError,
          'text-input--disabled': disabled,
        },
        className,
      )}
    >
      {label && (
        <label htmlFor={inputId} className="text-input__label">
          {label}
        </label>
      )}
      <div
        className={cn('text-input__input-box', {
          'text-input__input-box--icon': icon,
        })}
      >
        <input
          id={inputId}
          type={type}
          className="text-input__input"
          disabled={disabled}
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          {...inputProps}
        />
        {icon && (
          <button
            type="button"
            className="text-input__icon-btn"
            onClick={onIconClick}
            disabled={disabled || !onIconClick}
          >
            {isError ? iconError || icon : icon}
          </button>
        )}
      </div>
      {(error || !errorJump) && (
        <div className="text-input__error">
          {error && (
            <>
              <SvgError
                className="text-input__error-icon"
                fill="currentColor"
              />
              <p className="text-input__error-msg">{error}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}

TextInput.ColorError = styleVars.colorDanger
TextInput.ColorMain = styleVars.colorMain
