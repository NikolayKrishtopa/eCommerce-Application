import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { ProductProjection } from '@commercetools/platform-sdk'
import { Routes, Route, Link } from 'react-router-dom'
import ProductsContext from '@/contexts/ProductsContext'
import useProducts from '@/hooks/useProducts'
import ShoppingCard from '@/Components/ShoppingCard/ShoppingCard'
import Loader from '@/Components/Loader/Loader'
import ProductCard from '@/Components/ProductCard/ProductCard'
import Breadcrumbs from '@/Components/Breadcrumbs/Breadcrumbs'
import Search from '@/Components/Search/Search'
import s from './ProductsPage.module.scss'

const PRODS_ON_PAGE = 15

function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const { data, loading, total } = useProducts({
    limit: PRODS_ON_PAGE,
    offset: currentPage * PRODS_ON_PAGE,
  })
  const [products, setProducts] = useState<ProductProjection[]>(data)

  const { ref, inView } = useInView({
    threshold: 0.1,
    delay: 100,
  })

  const isFetching = Number(total) > products.length

  useEffect(() => {
    if (data && isFetching) {
      setProducts((prev) => [...prev, ...data])
    }
  }, [data, isFetching, loading])

  useEffect(() => {
    if (inView) {
      setCurrentPage((prev) => prev + 1)
    }
  }, [inView])

  const prodList = products.map((product) => {
    const brandName = product.masterVariant.attributes?.find((attribute) =>
      attribute.name.endsWith('-brand'),
    )?.value.label

    const discounted =
      product.masterVariant.prices && product.masterVariant.prices[0].discounted
        ? product.masterVariant.prices[0].discounted.value.centAmount / 100
        : undefined

    const prodData = {
      className: '',
      name: brandName,
      description: product.name.en,
      price: product.masterVariant.prices
        ? product.masterVariant.prices[0].value.centAmount / 100
        : 0,
      currency: product.masterVariant.prices
        ? product.masterVariant.prices[0].value.currencyCode
        : 'EUR',
      imageUrl: product.masterVariant.images
        ? product.masterVariant.images[0].url
        : '',
      imageAlt: product.name.en,
      discountPrice: discounted,
      onNameClick: undefined,
      toFixed: 2,
      intlLocale: 'en-EN',
    }

    return (
      <li key={product.id} className={s.prodListItem}>
        <Link to={`${product.slug.en.toString()}`}>
          {ShoppingCard(prodData)}
        </Link>
      </li>
    )
  })

  return (
    <ProductsContext.Provider value={products}>
      <Routes>
        <Route
          path="/"
          element={
            <section className={s.productsContainer}>
              <div className={s.breadAndSearch}>
                <Breadcrumbs />
                <Search />
              </div>

              <h2 className={s.prodHeader}>
                Products {total && <span>[{total} products]</span>}
              </h2>
              {products && <ul className={s.prodList}>{prodList}</ul>}
              {loading && isFetching && <Loader className={s.prodLoader} />}
              {!loading && isFetching && (
                <div ref={ref} className={s.pageBreak} />
              )}
            </section>
          }
        />
        <Route path="/:slug" element={<ProductCard />} />
      </Routes>
    </ProductsContext.Provider>
  )
}

export default ProductsPage
