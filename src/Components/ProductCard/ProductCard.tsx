import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import CartContext from '@/contexts/CartContext'
import cn from 'classnames'
import { LineItem, ProductProjection } from '@commercetools/platform-sdk'
import leftArrIcon from '@/assets/img/chevron_left.svg'
import rightArrIcon from '@/assets/img/chevron_right.svg'
import cartIcon from '@/assets/img/Cart.svg'
import closeIcon from '@/assets/img/X.svg'
import useProduct from '@/hooks/useProduct'
import NotFoundPage from '@/Pages/NotFoundPage/NotFoundPage'
import removeIcon from '@/assets/icons/remove.svg'
import s from './ProductCard.module.scss'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import QtyInput from '../UIKit/QtyInput/QtyInput'

export default function ProductCard() {
  const cart = useContext(CartContext)
  const { productSlug } = useParams()
  const product = useProduct(productSlug)
  const [item, setItem] = useState<ProductProjection | null>(null)
  const [photoQty, setPhotoQty] = useState(1)
  const [currentPicture, setCurrentPicture] = useState(1)
  const [currentPopupPicture, setCurrentPopupPicture] = useState(1)
  const [popupOpen, setPopupOpen] = useState(false)
  const [initiated, setInitiated] = useState(false)

  const incCurPicture = () => {
    if (currentPicture === photoQty) return
    setCurrentPicture(currentPicture + 1)
  }

  const decCurPicture = () => {
    if (currentPicture === 1) return
    setCurrentPicture(currentPicture - 1)
  }

  const incPopupCurPicture = () => {
    if (currentPopupPicture === photoQty) return
    setCurrentPopupPicture(currentPopupPicture + 1)
  }

  const decPopupCurPicture = () => {
    if (currentPopupPicture === 1) return
    setCurrentPopupPicture(currentPopupPicture - 1)
  }

  const [itemInCart, setItemInCard] = useState<LineItem | null>(null)

  const removeFromCart = () => {
    if (!cart || !item) return
    cart.removeLineItem(item.id)
  }

  const addToCart = () => {
    if (!cart || !item) return
    cart.addLineItem(item.id)
  }

  const updateQty = (qty: number) => {
    if (!item) return
    cart?.updateLineItemQuantity(item.id, () => qty)
  }

  useEffect(() => {
    if (!item) return
    const newItemInCart = cart?.cart?.lineItems.find(
      (e) => e.productId === item.id,
    )
    if (!newItemInCart) return
    setItemInCard(newItemInCart)
  }, [cart?.cart, item])

  useEffect(() => {
    if (!cart) return
    const newItem = product
    setItem(newItem ?? null)
    setPhotoQty(newItem?.masterVariant?.images?.length ?? 1)
  }, [product])

  useEffect(() => {
    setCurrentPopupPicture(currentPicture)
  }, [currentPicture])

  useEffect(() => {
    const timer = setTimeout(() => setInitiated(true), 1000)
    return () => clearTimeout(timer)
  })

  if (product) {
    return (
      <>
        {popupOpen && (
          <div className={s.popup}>
            <div className={s.productCard}>
              <button
                type="button"
                className={s.closeBtn}
                onClick={() => {
                  setPopupOpen(false)
                  setCurrentPopupPicture(currentPicture)
                }}
              >
                <img src={closeIcon} alt="close" />
              </button>
              <div className={s.imageBlock}>
                {currentPopupPicture > 1 && (
                  <button
                    type="button"
                    className={cn(s.navButton, s.leftNavBtn)}
                    onClick={(e) => {
                      e.stopPropagation()
                      decPopupCurPicture()
                    }}
                  >
                    <img src={leftArrIcon} alt="previous" />
                  </button>
                )}
                {currentPopupPicture < photoQty && (
                  <button
                    type="button"
                    className={cn(s.navButton, s.rightNavBtn)}
                    onClick={(e) => {
                      e.stopPropagation()
                      incPopupCurPicture()
                    }}
                  >
                    <img src={rightArrIcon} alt="next" />
                  </button>
                )}
                <img
                  src={
                    item?.masterVariant?.images &&
                    item?.masterVariant?.images[currentPopupPicture - 1].url
                  }
                  alt="item"
                  className={s.image}
                />
              </div>
            </div>
          </div>
        )}
        <div className={s.pageContainer}>
          <Breadcrumbs />
          <div className={s.productCard}>
            <button
              type="button"
              className={s.imageBlock}
              onClick={(e) => {
                e.stopPropagation()
                setPopupOpen(true)
              }}
            >
              {currentPicture > 1 && (
                <button
                  type="button"
                  className={cn(s.navButton, s.leftNavBtn)}
                  onClick={(e) => {
                    e.stopPropagation()
                    decCurPicture()
                  }}
                >
                  <img src={leftArrIcon} alt="previous" />
                </button>
              )}
              {currentPicture < photoQty && (
                <button
                  type="button"
                  className={cn(s.navButton, s.rightNavBtn)}
                  onClick={(e) => {
                    e.stopPropagation()
                    incCurPicture()
                  }}
                >
                  <img src={rightArrIcon} alt="next" />
                </button>
              )}
              <img
                src={
                  item?.masterVariant?.images &&
                  item?.masterVariant?.images[currentPicture - 1].url
                }
                alt="item"
                className={s.image}
              />
            </button>

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
                    ? `${item?.masterVariant?.prices[0]?.value.currencyCode} ${
                        Number(
                          item?.masterVariant?.prices[0]?.value.centAmount,
                        ) / 100
                      }`
                    : ''}
                </p>
                <p className={s.pricePromo}>
                  {item?.masterVariant?.prices &&
                  item?.masterVariant?.prices[0]?.discounted
                    ? `${item?.masterVariant?.prices[0]?.discounted?.value
                        .currencyCode} ${
                        Number(
                          item?.masterVariant?.prices[0]?.discounted?.value
                            .centAmount,
                        ) / 100
                      }`
                    : ''}
                </p>
              </div>
              <p className={s.description}>{item?.description?.en ?? ''}</p>
              <div className={s.tools}>
                {itemInCart ? (
                  <>
                    <QtyInput
                      className={s.prodQtyButtons}
                      quantity={itemInCart?.quantity ?? 0}
                      onChangeHandler={updateQty}
                    />
                    <button
                      type="button"
                      className={s.btn}
                      onClick={removeFromCart}
                    >
                      Remove from shopping cart
                      <img src={removeIcon} alt="cart" />
                    </button>
                  </>
                ) : (
                  <button type="button" className={s.btn} onClick={addToCart}>
                    Add to shopping cart <img src={cartIcon} alt="cart" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
  if (initiated) {
    return <NotFoundPage />
  }
}
