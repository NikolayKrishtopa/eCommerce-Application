import { useEffect, useState } from 'react'
import cn from 'classnames'

import s from './QtyInput.module.scss'

type QtyInputProps = {
  className?: string
  quantity?: number
  onChangeHandler: (qty: number) => void
}

export default function QtyInput(props: QtyInputProps) {
  const { className, quantity = 1, onChangeHandler } = props

  const [qty, setQty] = useState(quantity)

  const handleClick = (q: number) => {
    onChangeHandler(q)
    setQty(q)
  }

  useEffect(() => {
    setQty(quantity)
  }, [quantity])

  return (
    <div className={cn(s.qtyWrapper, className)}>
      <button
        type="button"
        disabled={qty <= 1}
        className={s.qtyBtn}
        onClick={() => handleClick(qty - 1)}
      >
        -
      </button>
      <p className={s.qty}>{qty}</p>

      <button
        type="button"
        className={s.qtyBtn}
        onClick={() => handleClick(qty + 1)}
      >
        +
      </button>
    </div>
  )
}
