import { type MyCartUpdateAction } from '@commercetools/platform-sdk'
import isErrorResponse from '@/utils/isErrorResponse'
import { SYSTEM_MESSAGES } from '@/utils/constants'
import useAuth, { SessionType } from './useAuth'

export default function useCart(
  params: Pick<
    ReturnType<typeof useAuth>,
    'authApiRoot' | 'currentCartRef' | 'setCurrentCart' | 'sessionState'
  > & {
    systemMessage: (msg: string, isSuccess: boolean) => void
    setIsFetching: (isFetching: boolean) => void
  },
) {
  const {
    authApiRoot,
    currentCartRef,
    setCurrentCart,
    sessionState,
    systemMessage,
    setIsFetching,
  } = params

  const canHaveCart = () =>
    sessionState === SessionType.Anonymous ||
    sessionState === SessionType.Authenticated

  const myCartUpdateActions = async (...actions: MyCartUpdateAction[]) => {
    if (!canHaveCart() || !currentCartRef.current) {
      return undefined
    }
    try {
      const { id: ID, version } = currentCartRef.current
      const response = await authApiRoot()
        .me()
        .carts()
        .withId({ ID })
        .post({
          body: {
            version,
            actions,
          },
        })
        .execute()
      setCurrentCart(response.body)
      return response
    } catch (e) {
      systemMessage(
        isErrorResponse(e) ? e.message : SYSTEM_MESSAGES.DEFAULT_ERROR,
        false,
      )
    } finally {
      setIsFetching(false)
    }
    return undefined
  }

  const findLineItemBy = ({ productId }: { productId: string }) =>
    currentCartRef.current?.lineItems.find((li) => li.productId === productId)

  const PRICE_TO_FIXED = 2

  const cartTotalPrice = currentCartRef.current?.lineItems
    .reduce((total, li) => {
      const term = li.price.discounted
        ? li.price.discounted.value.centAmount
        : li.price.value.centAmount
      return total + (Number(term) / 100) * li.quantity
    }, 0)
    .toFixed(PRICE_TO_FIXED)

  const cartDiscountedPrice = (
    Number(currentCartRef.current?.totalPrice?.centAmount) / 100
  ).toFixed(PRICE_TO_FIXED)

  const addLineItem = async (productId: string, quantity = 1) => {
    try {
      setIsFetching(true)
      await myCartUpdateActions({ action: 'addLineItem', productId, quantity })
    } finally {
      setIsFetching(false)
    }
  }

  const removeLineItem = async (productId: string) => {
    const lineItem = findLineItemBy({ productId })
    if (!lineItem) {
      return
    }
    try {
      setIsFetching(true)
      await myCartUpdateActions({
        action: 'removeLineItem',
        lineItemId: lineItem.id,
      })
    } finally {
      setIsFetching(false)
    }
  }

  const clearCart = async () => {
    if (!canHaveCart() || !currentCartRef.current) {
      return
    }
    const { lineItems, discountCodes } = currentCartRef.current
    const liActions: MyCartUpdateAction[] = lineItems.map((item) => ({
      action: 'removeLineItem',
      lineItemId: item.id,
    }))
    const dcActions: MyCartUpdateAction[] = discountCodes.map((code) => ({
      action: 'removeDiscountCode',
      discountCode: code.discountCode,
    }))
    await myCartUpdateActions(...liActions, ...dcActions)
  }

  const updateLineItemQuantity = async (
    productId: string,
    update: number | ((q?: number) => number),
  ) => {
    const lineItem = findLineItemBy({ productId })
    if (!lineItem) {
      return
    }
    try {
      setIsFetching(true)
      await myCartUpdateActions({
        action: 'changeLineItemQuantity',
        lineItemId: lineItem.id,
        quantity:
          typeof update === 'function' ? update(lineItem.quantity) : update,
      })
    } finally {
      setIsFetching(false)
    }
  }

  const addDiscountCode = async (code: string) => {
    try {
      setIsFetching(true)
      await myCartUpdateActions({ action: 'addDiscountCode', code })
    } finally {
      setIsFetching(false)
    }
  }

  const removeDiscountCode = async (codeId: string) => {
    const discountCode = currentCartRef.current?.discountCodes.find(
      (dc) => codeId === dc.discountCode.id,
    )?.discountCode
    if (!discountCode) {
      throw new Error(`Discount '${codeId}' is not applied`)
    }
    try {
      setIsFetching(true)
      await myCartUpdateActions({ action: 'removeDiscountCode', discountCode })
    } finally {
      setIsFetching(false)
    }
  }

  return {
    addLineItem,
    removeLineItem,
    updateLineItemQuantity,
    addDiscountCode,
    removeDiscountCode,
    clearCart,
    cartTotalPrice,
    cartDiscountedPrice,
  }
}
