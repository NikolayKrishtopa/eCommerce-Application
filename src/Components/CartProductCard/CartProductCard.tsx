import { useEffect, useState } from 'react'
import cn from 'classnames'
import { LineItem } from '@commercetools/platform-sdk'

import s from './CartProductCard.module.scss'
import QtyInput from '../UIKit/QtyInput/QtyInput'

type CartProductCardProps = {
  item: LineItem
}

export default function CartProductCard(props: CartProductCardProps) {
  const { item } = props
  const { quantity, variant, name } = item

  const [qty, setQty] = useState(quantity)

  useEffect(() => {
    // console.log(`qty : ${qty}`)
  }, [qty])

  return (
    <div className={s.productCard}>
      <div className={s.imageBlock}>
        <img
          src={variant.images && variant.images[0]?.url}
          alt="item"
          className={s.image}
        />
      </div>

      <div className={s.textBlock}>
        <h3 className={s.itemTitle}>{name.en}</h3>
        <div className={s.priceBlock}>
          <p
            className={cn(s.price, {
              [s.crossed]: variant?.prices && variant?.prices[0]?.discounted,
            })}
          >
            {variant?.prices && variant?.prices
              ? `${variant?.prices[0]?.value.currencyCode} ${
                  Number(variant?.prices[0]?.value.centAmount) / 100
                }`
              : ''}
          </p>
          <p className={s.pricePromo}>
            {variant?.prices && variant?.prices[0]?.discounted
              ? `${variant?.prices[0]?.discounted?.value.currencyCode} ${
                  Number(variant?.prices[0]?.discounted?.value.centAmount) / 100
                }`
              : ''}
          </p>
        </div>
        <div className={s.tools}>
          <QtyInput
            className={s.cartQtyButtons}
            quantity={quantity}
            onChangeHandler={(q) => setQty(q)}
          />
          <button type="button" className={s.btn}>
            Remove from cart
          </button>
        </div>
      </div>
    </div>
  )
}
