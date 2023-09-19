import { useEffect, useState } from 'react'
import { Category } from '@commercetools/platform-sdk'
// import { CategoriesQueryParams } from '@/Models/Models'
import { apiRoot } from '@/client'

export default function useCategories() {
  const [data, setData] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    apiRoot
      .categories()
      .get()
      .execute()
      .then(({ body }) => {
        setData(body.results)
        setTotal(body.total ? body.total : 0)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  return { loading, data, error, total }
}
