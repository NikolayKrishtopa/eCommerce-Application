import { useEffect, useState } from 'react'
import cn from 'classnames'

import s from './QtyInput.module.scss'

type QtyInputProps = {
  className?: string
  quantity?: number
  onChangeHandler: (qty: number) => void
  size?: 's' | 'm' | 'l'
}

export default function QtyInput(props: QtyInputProps) {
  const { className, quantity = 1, onChangeHandler, size } = props

  const [qty, setQty] = useState(quantity)

  const handleClick = (q: number) => {
    onChangeHandler(q)
    setQty(q)
  }

  useEffect(() => {
    setQty(quantity)
  }, [quantity])

  return (
    <div
      className={cn(s.qtyWrapper, className, {
        [s.qtyWrapperSmall]: size === 's',
      })}
    >
      <button
        type="button"
        disabled={qty <= 1}
        className={cn(s.qtyBtn, { [s.qtyBtnSmall]: size === 's' })}
        onClick={(e) => {
          e.preventDefault()
          handleClick(qty - 1)
        }}
      >
        -
      </button>
      <p className={s.qty}>{qty}</p>

      <button
        type="button"
        className={cn(s.qtyBtn, { [s.qtyBtnSmall]: size === 's' })}
        onClick={(e) => {
          e.preventDefault()
          handleClick(qty + 1)
        }}
      >
        +
      </button>
    </div>
  )
}
