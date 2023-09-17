import { useEffect, useState } from 'react'
import { DiscountCode } from '@commercetools/platform-sdk'
import { apiRoot } from '../eComMerchant/client'

export default function useDiscountCodes() {
  const [data, setData] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    apiRoot
      .discountCodes()
      .get()
      .execute()
      .then(({ body }) => {
        setData(body.results)
        setTotal(body.total ? body.total : 0)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  const findDiscountCodeBy = ({ codeId }: { codeId: string }) =>
    data.find((dc) => dc.id === codeId)

  return { loading, data, error, total, findDiscountCodeBy }
}
