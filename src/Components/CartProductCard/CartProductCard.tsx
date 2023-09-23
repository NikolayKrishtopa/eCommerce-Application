import cn from 'classnames'
import { LineItem } from '@commercetools/platform-sdk'

import { Link } from 'react-router-dom'
import s from './CartProductCard.module.scss'
import QtyInput from '../UIKit/QtyInput/QtyInput'

type CartProductCardProps = {
  item: LineItem
  handleQty: (q: number) => void
  handleRemove: () => void
}

export default function CartProductCard(props: CartProductCardProps) {
  const { item, handleQty, handleRemove } = props
  const { quantity, variant, name, productSlug } = item

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
        <Link to={`/catalog/all-products/${productSlug?.en}` || ''}>
          <h3 className={s.itemTitle}>{name.en}</h3>
        </Link>

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
            onChangeHandler={(q) => {
              handleQty(q)
              // setQty(q)
            }}
          />
          <button
            type="button"
            className={s.btn}
            onClick={() => handleRemove()}
          >
            Remove from cart
          </button>
        </div>
      </div>
    </div>
  )
}
