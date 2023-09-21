import cn from 'classnames'
import CurrentCartContext from '@/contexts/CurrentCartContext'
import CartHelpersContext from '@/contexts/CartHelpersContext'
import { useState, useEffect, useContext } from 'react'
import { LineItem } from '@commercetools/platform-sdk'
import { useNavigate } from 'react-router-dom'
import type ShoppingCardProps from './ShoppingCard.d'
import s from './ShoppingCard.module.scss'

export default function ShoppingCard(props: ShoppingCardProps) {
  const {
    className = '',
    name,
    description,
    price,
    currency,
    imageUrl,
    imageAlt,
    discountPrice = undefined,
    onNameClick = undefined,
    toFixed = 2,
    intlLocale = 'de-DE',
    productId,
  } = props

  const currentCart = useContext(CurrentCartContext)
  const cartHelpers = useContext(CartHelpersContext)

  const [itemInCart, setItemInCard] = useState<LineItem | null>(null)

  const navigate = useNavigate()

  const goToCart: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    navigate('/cart')
  }

  useEffect(() => {
    const newItemInCart = currentCart?.lineItems.find(
      (e) => e.productId === productId,
    )
    if (!newItemInCart) return
    setItemInCard(newItemInCart)
  }, [currentCart, productId])

  const addToCart: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    cartHelpers?.addLineItem(productId)
  }

  const isDiscount = typeof discountPrice === 'number'

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currencyDisplay: 'code',
      currency,
      maximumFractionDigits: toFixed,
    }).format(p)

  const originalPrice = formatPrice(price)

  const PriceJSX = isDiscount ? (
    <>
      <s>{originalPrice}</s>
      <span className={s.singleSellerDiscountPrice}>{discountPrice}</span>
    </>
  ) : (
    <span>{originalPrice}</span>
  )

  return (
    <div className={cn(s.singleSeller, className)}>
      {isDiscount && (
        <span className={s.singleSellerDiscount}>
          -{Math.round(((price - discountPrice) * 100) / price)}%
        </span>
      )}
      <img className={s.singleSellerImage} src={imageUrl} alt={imageAlt} />
      <div className={s.singleSellerInfoContainer}>
        <button
          type="button"
          onClick={onNameClick}
          className={cn(s.singleSellerButton, { [s.noHover]: !onNameClick })}
        >
          <h5 className={s.singleSellerName}>{name}</h5>
        </button>
        <div className={s.singleSellerDescription}>{description}</div>
        <div className={s.singleSellerPrice}>{PriceJSX}</div>
        <div className={s.cartBtnBlock}>
          {itemInCart ? (
            <button
              className={cn(s.cartBtn, s.addedToCartBtn)}
              type="button"
              onClick={goToCart}
            >
              Added to cart
            </button>
          ) : (
            <button className={s.cartBtn} type="button" onClick={addToCart}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
