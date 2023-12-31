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

  if (categoryId && !filter?.length) {
    filtersStringArray.push(`categories.id:"${categoryId}"`)
  }

  if (filter) {
    filtersStringArray.push(...filter)
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
          'text.en': searchText || undefined,
        },
      })
      .execute()
      .then(({ body }) => {
        setData(body.results)
        setTotal(body.total || 0)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [
    JSON.stringify(filter),
    JSON.stringify(sort),
    limit,
    offset,
    searchText,
    categoryId,
  ])

  return { loading, data, error, total }
}
