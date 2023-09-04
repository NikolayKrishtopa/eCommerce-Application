import { useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import cn from 'classnames'
import ProductsContext from '@/contexts/ProductsContext'
import cartIcon from '@/assets/img/Cart.svg'
import s from './ProductCard.module.scss'

export default function ProductCard() {
  const products = useContext(ProductsContext)
  const { slug } = useParams()
  let item = products?.find((p) => p.slug.en === slug)
  const [qty, setQty] = useState(1)
  useEffect(() => {
    item = products?.find((p) => p.slug.en === slug)
    console.log(products)
  }, [products])

  return (
    <div className={s.productCard}>
      <div className={s.imageBlock}>
        <img
          src={
            item?.masterVariant?.images && item?.masterVariant?.images[0].url
          }
          alt="item"
          className={s.image}
        />
      </div>
      <div className={s.textBlock}>
        <h3 className={s.itemTitle}>{item?.name.en}</h3>
        <div className={s.priceBlock}>
          <p
            className={cn(s.price, {
              [s.crossed]:
                item?.masterVariant?.prices &&
                item?.masterVariant?.prices[0]?.discounted,
            })}
          >
            {item?.masterVariant?.prices && item?.masterVariant?.prices
              ? `${item?.masterVariant?.prices[0]?.value.centAmount} ${item?.masterVariant?.prices[0]?.value.currencyCode}`
              : ''}
          </p>
          <p className={s.pricePromo}>
            {item?.masterVariant?.prices &&
            item?.masterVariant?.prices[0]?.discounted
              ? `${item?.masterVariant?.prices[0]?.discounted?.value.centAmount} ${item?.masterVariant?.prices[0]?.discounted?.value.currencyCode}`
              : ''}
          </p>
        </div>
        <p className={s.description}>{item?.description?.en ?? ''}</p>
        <div className={s.tools}>
          <div className={s.qtyWrapper}>
            <button
              type="button"
              className={s.qtyBtn}
              onClick={() => setQty(qty - 1)}
            >
              -
            </button>
            <p className={s.qty}>{qty}</p>

            <button
              type="button"
              className={s.qtyBtn}
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className={s.btn}
            onClick={() => console.log(item)}
          >
            Add to shopping cart <img src={cartIcon} alt="cart" />
          </button>
        </div>
      </div>
    </div>
  )
}
