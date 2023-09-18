import { apiRoot } from '@/eComMerchant/client'
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk'
import { useEffect, useRef, useState } from 'react'

const STORAGE_CART_ID = 'cartId'
const DEFAULT_CURRENCY = 'EUR'

export default function useCart(setIsFetching: (isFetching: boolean) => void) {
  const cartId = localStorage.getItem(STORAGE_CART_ID)

  const cartRef = useRef<Cart>()
  const [cart, $setCart] = useState<Cart>()
  const [cartErrorMsg, setCartErrorMsg] = useState('')

  const setCart = (newCart: Cart) => {
    $setCart(newCart)
    cartRef.current = newCart
  }

  // const [isFetching, setIsFetching] = useState(true)
  // const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      setIsFetching(true)
      if (cartId) {
        apiRoot
          .carts()
          .withId({ ID: cartId })
          .get()
          .execute()
          .then((resp) => {
            const { statusCode, body } = resp
            if (statusCode === 200) {
              setCart(body)
            }
          })
      } else {
        apiRoot
          .carts()
          .post({ body: { currency: DEFAULT_CURRENCY } })
          .execute()
          .then((resp) => {
            const { statusCode, body } = resp
            if (statusCode === 201) {
              setCart(body)
              localStorage.setItem(STORAGE_CART_ID, body.id)
            }
          })
      }
    } finally {
      setIsFetching(false)
      // setIsLoaded(true)
    }
  }, [cartId])

  const updateCart = (cartUpdate: CartUpdateAction | CartUpdateAction[]) => {
    if (!cartId) {
      throw new Error('Cart is not created')
    }
    if (!cartRef.current) {
      throw new Error('Cart is not fetched yet')
    }
    setIsFetching(true)
    return apiRoot
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartRef.current.version,
          actions: [cartUpdate].flat(),
        },
      })
      .execute()
      .then((resp) => {
        const { statusCode, body } = resp
        if (statusCode === 200) {
          setCart(body)
          localStorage.setItem(STORAGE_CART_ID, body.id)
        }
        return resp
      })
      .finally(() => setIsFetching(false))
  }

  const findLineItemBy = ({ productId }: { productId: string }) =>
    cartRef.current?.lineItems.find((li) => li.productId === productId)

  const getTotalPriceOriginal = () =>
    cartRef.current?.lineItems
      .reduce((total, li) => {
        const term = li.price.discounted
          ? li.price.discounted.value.centAmount
          : li.price.value.centAmount
        return total + (Number(term) / 100) * li.quantity
      }, 0)
      .toFixed(2)

  /* Expose API */

  const addLineItem = async (productId: string, quantity = 1) => {
    setIsFetching(true)
    try {
      await updateCart({ action: 'addLineItem', productId, quantity })
    } finally {
      setIsFetching(false)
    }
  }

  const removeLineItem = async (productId: string) => {
    const lineItem = findLineItemBy({ productId })
    if (lineItem) {
      setIsFetching(true)
      try {
        await updateCart({ action: 'removeLineItem', lineItemId: lineItem.id })
      } finally {
        setIsFetching(false)
      }
    }
  }

  const clearCart = async () => {
    const liActions = cartRef.current?.lineItems.map((item) => ({
      action: 'removeLineItem',
      lineItemId: item.id,
    }))
    const dcActions = cartRef.current?.discountCodes.map((code) => ({
      action: 'removeDiscountCode',
      discountCode: code.discountCode,
    }))

    if (liActions) {
      setIsFetching(true)
      try {
        await updateCart(liActions as CartUpdateAction[])
        if (dcActions) {
          await updateCart(dcActions as CartUpdateAction[])
        }
      } finally {
        setIsFetching(false)
      }
    }
  }

  const updateLineItemQuantity = async (
    productId: string,
    updater: (q?: number) => number,
  ) => {
    const lineItem = findLineItemBy({ productId })
    if (lineItem) {
      setIsFetching(true)
      try {
        await updateCart({
          action: 'changeLineItemQuantity',
          lineItemId: lineItem.id,
          quantity: updater(lineItem.quantity),
        })
      } finally {
        setIsFetching(false)
      }
    }
  }

  const addDiscountCode = async (code: string) => {
    setIsFetching(true)
    setCartErrorMsg('')
    try {
      await updateCart({ action: 'addDiscountCode', code })
    } catch {
      setCartErrorMsg(`Promo code "${code}" not found`)
    } finally {
      setIsFetching(false)
    }
  }

  const removeDiscountCode = async (codeId: string) => {
    const discountCode = cartRef.current?.discountCodes.find(
      (dc) => codeId === dc.discountCode.id,
    )?.discountCode
    if (!discountCode) {
      throw new Error(`Discount '${codeId}' is not applied`)
    }
    setIsFetching(true)
    try {
      await updateCart({ action: 'removeDiscountCode', discountCode })
    } finally {
      setIsFetching(false)
    }
  }

  const totalPriceOriginal = getTotalPriceOriginal()

  return {
    cart,
    // isLoaded,
    // isFetching,
    addLineItem,
    removeLineItem,
    updateLineItemQuantity,
    addDiscountCode,
    removeDiscountCode,
    clearCart,
    cartErrorMsg,
    totalPriceOriginal,
    setCartErrorMsg,
  }
}
