import { useEffect, useState } from 'react'
import { ProductProjection } from '@commercetools/platform-sdk'
import { ProductQueryParams } from '@/Models/Models'
import { apiRoot } from '../eComMerchant/client'

export default function useProducts(props: ProductQueryParams) {
  const { searchText, limit, offset, filter, categoryId, sort } = props
  const [data, setData] = useState<ProductProjection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [total, setTotal] = useState(0)

  const filtersStringArray: string[] = []

  if (categoryId) {
    filtersStringArray.push(`categories.id:"${categoryId}"`)
  }

  if (filter) {
    filtersStringArray.concat(filter)
  }

  useEffect(() => {
    setLoading(true)
    apiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          limit,
          offset,
          filter: filtersStringArray,
          sort,
          'text.en': searchText,
        },
      })
      .execute()
      .then(({ body }) => {
        if (body.count) {
          setData(body.results)
          setTotal(body.total || 0)
        }
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [JSON.stringify(filter), limit, offset, sort, searchText, categoryId])

  return { loading, data, error, total }
}
