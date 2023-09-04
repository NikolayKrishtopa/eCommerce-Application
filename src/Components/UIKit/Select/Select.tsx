import React, { MouseEvent, useState } from 'react'
import cn from 'classnames'
import './Select.scss'
import useMemoId from '@/hooks/useMemoId'
import { ReactComponent as SvgDropdown } from '@/assets/icons/dropdown.svg'
import InputSlot from '../InputSlot/InputSlot'
import SelectProps, { SelectOptionProps } from './Select.props'

export function Option(props: SelectOptionProps) {
  return React.createElement('div', props)
}

export default function Select(props: SelectProps) {
  const {
    className,
    label,
    id,
    error,
    errorJump,
    disabled: selectDisabled,
    children: optionElements,
    currentValue: initCurrentValue = '',
    onOptionChange,
    open: initOpen = false,
  } = props

  const selectId = useMemoId(id)

  const [currentValue, setCurrentValue] = useState(initCurrentValue)
  const [open, setOpen] = useState(initOpen)

  const options = (optionElements ? [optionElements].flat() : []).map(
    ({ props: p }) => p,
  )
  const firstGlobOption = options.find(({ value }) => value === '*')
  const exactOption = options.find(({ value }) => currentValue === value)
  const currentOption = exactOption || firstGlobOption

  const onOptionClick: (v: string, e: MouseEvent) => void = (value) => {
    setOpen(false)
    setCurrentValue(value)
    if (onOptionChange) onOptionChange(value)
  }

  return (
    <div
      className={cn('select', { 'select--disabled': selectDisabled })}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false)
        }
      }}
    >
      <InputSlot
        htmlFor={selectId}
        className={className}
        label={label}
        error={error}
        errorJump={errorJump}
        disabled={selectDisabled}
        selectLabelText
      >
        <button
          type="button"
          className="select__placeholder"
          onClick={() => setOpen((p) => !p)}
        >
          {currentOption?.children}
        </button>
        <span className="select__icon-container">
          <SvgDropdown className="select__icon" />
        </span>
      </InputSlot>
      <div
        className={cn('select__dropdown', { 'select__dropdown--open': open })}
        id={selectId}
      >
        <ul className="select__options-list" id={selectId}>
          {options.map(({ value, disabled, children }) => {
            const isDisabled = selectDisabled || disabled
            return (
              <li
                key={value}
                className={cn('select__option', {
                  'select__option--disabled': isDisabled,
                })}
              >
                <button
                  type="button"
                  className="select__option-button"
                  disabled={isDisabled}
                  onClick={(e) => onOptionClick(value, e)}
                >
                  {children}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
