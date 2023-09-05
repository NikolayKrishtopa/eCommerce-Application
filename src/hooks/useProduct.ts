import { apiRoot } from '@/eComMerchant/client'
import { ProductProjection } from '@commercetools/platform-sdk'
import { useState, useEffect } from 'react'

const useProduct = (productSlug?: string) => {
  const [product, setProduct] = useState<ProductProjection>()
  useEffect(() => {
    console.log(`I got this slug: ${productSlug}`)
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
  console.log(`I return this product: ${product?.name.en}`)
  return product
}

export default useProduct
