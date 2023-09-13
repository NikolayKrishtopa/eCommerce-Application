import { apiRoot } from '@/eComMerchant/client'
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk'
import { useEffect, useRef, useState } from 'react'

const STORAGE_BASKET_ID = 'basketId'
const DEFAULT_CURRENCY = 'EUR'

export default function useBasket() {
  const basketId = localStorage.getItem(STORAGE_BASKET_ID)

  const basketRef = useRef<Cart>()
  const [basket, setBasket] = useState<Cart>()

  const updateBasket = (cart: Cart) => {
    setBasket(cart)
    basketRef.current = cart
  }

  const [isFetching, setIsFetching] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      if (basketId) {
        apiRoot
          .carts()
          .withId({ ID: basketId })
          .get()
          .execute()
          .then((resp) => {
            const { statusCode, body } = resp
            if (statusCode === 200) {
              updateBasket(body)
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
              updateBasket(body)
              localStorage.setItem(STORAGE_BASKET_ID, body.id)
            }
          })
      }
    } finally {
      setIsFetching(false)
      setIsLoaded(true)
    }
  }, [basketId])

  const updateCart = (cartUpdate: CartUpdateAction | CartUpdateAction[]) => {
    if (!basketId) {
      throw new Error('Basket is not created')
    }
    if (!basketRef.current) {
      throw new Error('Basket is not fetched yet')
    }
    return apiRoot
      .carts()
      .withId({ ID: basketId })
      .post({
        body: {
          version: basketRef.current.version,
          actions: [cartUpdate].flat(),
        },
      })
      .execute()
      .then((resp) => {
        const { statusCode, body } = resp
        if (statusCode === 200) {
          updateBasket(body)
          localStorage.setItem(STORAGE_BASKET_ID, body.id)
        }
        return resp
      })
  }

  const findLineItemBy = ({ productId }: { productId: string }) =>
    basketRef.current?.lineItems.find((li) => li.productId === productId)

  /* Expose API */

  const addItem = async (productId: string, quantity = 1) => {
    setIsFetching(true)
    try {
      await updateCart({ action: 'addLineItem', productId, quantity })
    } finally {
      setIsFetching(false)
    }
  }

  const removeItem = async (productId: string) => {
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

  const updateItemQuantity = async (
    productId: string,
    updater: (q: number) => number,
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

  return {
    basket,
    isLoaded,
    isFetching,
    addItem,
    removeItem,
    updateItemQuantity,
  }
}
