import { Cart } from '@commercetools/platform-sdk'
import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import { ReactComponent as SvgCheckout } from '@/assets/icons/arrow-right.svg'
import { ReactComponent as SvgDiscount } from '@/assets/icons/discount.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import CartContext from '@/contexts/CartContext'
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

  if (!currentCart) return emptyCartStub

  const { cart, removeLineItem, updateLineItemQuantity, addDiscountCode } =
    currentCart

  const cleanCart = async (basket: Cart): Promise<void> => {
    basket.lineItems.forEach((item) => {
      removeLineItem(item.id)
    })
  }

  return (
    <section className={s.cart}>
      <h2 className={s.cartHeader}>Shopping Cart</h2>

      {!cart?.lineItems.length && emptyCartStub}

      {cart?.lineItems.length !== 0 && (
        <>
          <button
            type="button"
            className={s.cartDelLink}
            onClick={() => cart && cleanCart(cart)}
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
                <div className={s.summaryLine}>
                  <span>Total:</span>
                  <span>EUR {Number(cart?.totalPrice.centAmount) / 100}</span>
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
                <div className={s.promoInputContainer}>
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
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
