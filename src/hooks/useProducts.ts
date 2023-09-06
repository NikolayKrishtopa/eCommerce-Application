import { useEffect, useState } from 'react'
import { ProductProjection } from '@commercetools/platform-sdk'
import { ProductQueryParams } from '@/Models/Models'
import { apiRoot } from '../eComMerchant/client'

export default function useProducts(props: ProductQueryParams) {
  const { limit, offset, filter, categoryId } = props
  const [data, setData] = useState<ProductProjection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [total, setTotal] = useState(0)

  const memoizedFilter = filter

  const computedFilter = [
    categoryId ? `categories.id:"${categoryId}"` : undefined,
    memoizedFilter,
  ]
    .flat()
    .filter(Boolean) as string[]

  useEffect(() => {
    setLoading(true)
    apiRoot
      .productProjections()
      .get({
        queryArgs: {
          limit,
          offset,
          filter: computedFilter,
        },
      })
      .execute()
      .then(({ body }) => {
        setData(body.results)
        setTotal(body.total || 0)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [filter, limit, offset, categoryId])

  return { loading, data, error, total }
}
