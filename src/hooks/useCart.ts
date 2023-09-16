import { apiRoot } from '@/eComMerchant/client'
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk'
import { useEffect, useRef, useState } from 'react'

const STORAGE_CART_ID = 'cartId'
const DEFAULT_CURRENCY = 'EUR'

export default function useCart(setIsFetching: (isFetching: boolean) => void) {
  const cartId = localStorage.getItem(STORAGE_CART_ID)

  const cartRef = useRef<Cart>()
  const [cart, $setCart] = useState<Cart>()

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
    try {
      await updateCart({ action: 'addDiscountCode', code })
    } finally {
      setIsFetching(false)
    }
  }

  const removeDiscountCode = async (code: string) => {
    const discountCode = cartRef.current?.discountCodes.find(
      (dc) => code === dc.discountCode.obj?.code,
    )?.discountCode
    if (!discountCode) {
      throw new Error(`Discount '${code}' is not applied`)
    }
    setIsFetching(true)
    try {
      await updateCart({ action: 'removeDiscountCode', discountCode })
    } finally {
      setIsFetching(false)
    }
  }

  return {
    cart,
    // isLoaded,
    // isFetching,
    addLineItem,
    removeLineItem,
    updateLineItemQuantity,
    addDiscountCode,
    removeDiscountCode,
  }
}
