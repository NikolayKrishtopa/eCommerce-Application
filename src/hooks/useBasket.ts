import { apiRoot } from '@/eComMerchant/client'
import { Cart } from '@commercetools/platform-sdk'
import { useEffect, useState } from 'react'

const STORAGE_BASKET_ID = 'basketId'
const DEFAULT_CURRENCY = 'EUR'

export default function useBasket() {
  const basketId = localStorage.getItem(STORAGE_BASKET_ID)

  const [basket, setBasket] = useState<Cart>()

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
              setBasket(body)
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
              setBasket(body)
              localStorage.setItem(STORAGE_BASKET_ID, body.id)
            }
          })
      }
    } finally {
      setIsFetching(false)
      setIsLoaded(true)
    }
  }, [basketId])

  return {
    basket,
    isLoaded,
    isFetching,
  }
}
