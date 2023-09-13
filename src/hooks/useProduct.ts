import { apiRoot } from '@/eComMerchant/client'
import { ProductProjection } from '@commercetools/platform-sdk'
import { useState, useEffect } from 'react'

const useProduct = (productSlug?: string) => {
  const [product, setProduct] = useState<ProductProjection>()
  useEffect(() => {
    if (productSlug) {
      apiRoot
        .productProjections()
        .search()
        .get({ queryArgs: { filter: `slug.en:"${productSlug}"`, limit: 1 } })
        .execute()
        .then((resp) => {
          if (resp.statusCode === 200) {
            setProduct(resp.body.results.at(0))
          }
        })
    }
  }, [productSlug])
  return product
}

export default useProduct
