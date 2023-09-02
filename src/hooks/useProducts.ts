import { useEffect, useState } from 'react'
import { ProductProjection } from '@commercetools/platform-sdk'
import { ProductQueryParams } from '@/Models/Models'
import { apiRoot } from '../eComMerchant/client'

export default function useProducts(props: ProductQueryParams) {
  const [data, setData] = useState<ProductProjection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    apiRoot
      .productProjections()
      .get({ queryArgs: { limit: props.limit, offset: props.offset } })
      .execute()
      .then(({ body }) => {
        setData(body.results)
        setTotal(body.total ? body.total : 0)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [props.limit, props.offset])

  return { loading, data, error, total }
}
