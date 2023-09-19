import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import { ReactComponent as SvgCheckout } from '@/assets/icons/arrow-right.svg'
import { ReactComponent as SvgDiscount } from '@/assets/icons/discount.svg'
import { ReactComponent as SvgClose } from '@/assets/icons/close.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import CartContext from '@/contexts/CartContext'
import useDiscountCodes from '@/hooks/useDiscountCodes'
import cn from 'classnames'
import s from './CartPage.module.scss'

type CartPageProps = {
  alert: (msg: string) => void
}

let activeTimer = false

export default function CartPage(props: CartPageProps) {
  const { alert } = props
  const [promoCode, setPromoCode] = useState('')
  const [cartDelDialog, setCartDelDialog] = useState(false)

  const navigate = useNavigate()

  const emptyCartStub = (
    <div className={s.emptyCart}>
      <h3 className={s.emptyCartHeader}>Your Cart is empty</h3>
      <p className={s.emptyCartMessage}>
        Once you add something to your cart - it will appear here. Ready to get
        started?
      </p>
      <button
        type="button"
        className={s.emptyCartButton}
        onClick={() => navigate('/catalog')}
      >
        <div>Go to catalogue</div>
        <SvgCheckout />
      </button>
    </div>
  )

  const currentCart = useContext(CartContext)

  const { findDiscountCodeBy } = useDiscountCodes()

  const cartErrorMsg = currentCart?.cartErrorMsg || ''
  const setCartErrorMsg = currentCart?.setCartErrorMsg
  const [errorMsg, setErrorMsg] = useState(cartErrorMsg)

  useEffect(() => {
    if (errorMsg) {
      alert(errorMsg)
      if (setCartErrorMsg) setCartErrorMsg('')
    }
  }, [errorMsg, alert, setCartErrorMsg])

  if (!currentCart) return emptyCartStub

  const {
    cart,
    removeLineItem,
    updateLineItemQuantity,
    addDiscountCode,
    removeDiscountCode,
    clearCart,
    totalPriceOriginal,
  } = currentCart

  const handleClearCart = () => {
    activeTimer = true
    setCartDelDialog(true)
    let timer = 0
    const t = setInterval(() => {
      timer += 1
      if (timer >= 30 || !activeTimer) {
        clearInterval(t)
        setCartDelDialog(false)
      }
    }, 100)
  }

  return (
    <section className={s.cart}>
      <h2 className={s.cartHeader}>Shopping Cart</h2>

      {!cart?.lineItems.length && emptyCartStub}

      {cart?.lineItems.length !== 0 && (
        <>
          <div className={s.cartDelContainer}>
            <button
              type="button"
              disabled={cartDelDialog}
              className={cn(
                s.cartDelLink,
                cartDelDialog ? s.hiddenDelLink : '',
              )}
              onClick={() => {
                handleClearCart()
              }}
            >
              Clear shopping cart
            </button>
            <div
              className={cn(s.sureToDelete, cartDelDialog ? s.showDialog : '')}
            >
              <span>Are you sure? </span>
              <button
                type="button"
                className={s.cartDelLink}
                onClick={() => cart && clearCart()}
              >
                Yes, clear cart
              </button>
              <button
                type="button"
                className={s.cartDelLink}
                onClick={() => {
                  setCartDelDialog(false)
                  activeTimer = false
                }}
              >
                No, not now
              </button>
            </div>
          </div>

          <div className={s.cartWrapper}>
            <div className={s.cartProducts}>
              {cart?.lineItems.map((item) => (
                <div key={crypto.randomUUID()}>
                  <CartProductCard
                    item={item}
                    handleQty={(q) => {
                      updateLineItemQuantity(item.productId, () => q)
                    }}
                    handleRemove={() => {
                      removeLineItem(item.productId)
                    }}
                  />
                </div>
              ))}
            </div>
            <div className={s.cartSummaryContainer}>
              <div className={s.summary}>
                <h3 className={s.summaryHeader}>Order summary</h3>

                {cart && cart.discountCodes.length > 0 && (
                  <>
                    <div className={cn(s.summaryLine, s.originalPrice)}>
                      <span>Total (original price):</span>
                      <span>
                        EUR{' '}
                        <span className={s.discardedPrice}>
                          {totalPriceOriginal}
                        </span>
                      </span>
                    </div>

                    <div className={s.summaryLine}>
                      <span>Applied promo codes:</span>
                    </div>

                    {cart?.discountCodes.map((dc) => {
                      const code =
                        findDiscountCodeBy({ codeId: dc.discountCode.id })
                          ?.code || ''

                      return (
                        <div
                          className={s.summaryLine}
                          key={crypto.randomUUID()}
                        >
                          <div className={s.promoCode}>
                            <SvgDiscount /> {code}
                          </div>
                          <button
                            className={s.removePromoBtn}
                            type="button"
                            onClick={() =>
                              removeDiscountCode(dc.discountCode.id)
                            }
                          >
                            <SvgClose />
                            <div>REMOVE</div>
                          </button>
                        </div>
                      )
                    })}
                  </>
                )}

                <div className={s.summaryLine}>
                  <span>
                    Total{' '}
                    {cart &&
                      cart?.discountCodes.length > 0 &&
                      '(discounted price)'}
                    :
                  </span>
                  <span>
                    EUR {(Number(cart?.totalPrice.centAmount) / 100).toFixed(2)}
                  </span>
                </div>

                <button type="button" className={s.checkoutBtn}>
                  <div>Checkout</div>
                  <SvgCheckout />
                </button>
              </div>
              <div className={s.promoContainer}>
                <div className={s.promoHeader}>
                  <SvgDiscount />
                  <div>Use a promo code</div>
                </div>
                <form
                  className={s.promoInputContainer}
                  onSubmit={(e) => {
                    e.preventDefault()
                    setErrorMsg('')
                    addDiscountCode(promoCode)
                  }}
                >
                  <input
                    name="promocode-input"
                    className={s.promoInput}
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className={s.promoSubmit} type="submit">
                    APPLY
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
