import cn from 'classnames'
import './InputSlot.scss'
import { ReactComponent as SvgError } from '@/assets/icons/error.svg'
import InputSlotProps from './InputSlot.props'

export default function InputSlot(props: InputSlotProps) {
  const {
    className,
    label,
    htmlFor,
    error,
    errorJump,
    icon,
    iconError,
    onIconClick,
    disabled,
    children,
    selectLabelText = false,
  } = props

  return (
    <div
      className={cn(
        'input-slot',
        {
          'input-slot--error': error,
          'input-slot--disabled': disabled,
        },
        className,
      )}
    >
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn('input-slot__label', {
            'input-slot__label--no-text-select': !selectLabelText,
          })}
        >
          {label}
        </label>
      )}
      <div
        className={cn('input-slot__box', {
          'input-slot__box--icon': icon,
        })}
      >
        <div className="input-slot__children">{children}</div>
        {icon && (
          <button
            type="button"
            className="input-slot__icon-btn"
            onClick={onIconClick}
            disabled={disabled || !onIconClick}
          >
            {error ? iconError || icon : icon}
          </button>
        )}
      </div>
      {(error || !errorJump) && (
        <div className="input-slot__error">
          {error && (
            <>
              <SvgError
                className="input-slot__error-icon"
                fill="currentColor"
              />
              <p className="input-slot__error-msg">{error}</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
