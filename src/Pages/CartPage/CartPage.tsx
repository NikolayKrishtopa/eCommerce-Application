import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import { ReactComponent as SvgCheckout } from '@/assets/icons/arrow-right.svg'
import { ReactComponent as SvgDiscount } from '@/assets/icons/discount.svg'
import { ReactComponent as SvgClose } from '@/assets/icons/close.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import CartContext from '@/contexts/CartContext'
import useDiscountCodes from '@/hooks/useDiscountCodes'
import cn from 'classnames'
import s from './CartPage.module.scss'

export default function CartPage() {
  const [promoCode, setPromoCode] = useState('')

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

  return (
    <section className={s.cart}>
      <h2 className={s.cartHeader}>Shopping Cart</h2>

      {!cart?.lineItems.length && emptyCartStub}

      {cart?.lineItems.length !== 0 && (
        <>
          <button
            type="button"
            className={s.cartDelLink}
            onClick={() => cart && clearCart()}
          >
            Clear shopping cart
          </button>

          <div className={s.cartWrapper}>
            <div className={s.cartProducts}>
              {cart?.lineItems.map((item) => (
                <div key={crypto.randomUUID()}>
                  <CartProductCard
                    item={item}
                    handleQty={(q) => {
                      updateLineItemQuantity(item.id, () => q)
                    }}
                    handleRemove={() => {
                      removeLineItem(item.id)
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
                    addDiscountCode(promoCode)
                  }}
                >
                  <input
                    className={s.promoInput}
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    className={s.promoSubmit}
                    type="button"
                    onClick={() => {
                      addDiscountCode(promoCode)
                    }}
                  >
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
