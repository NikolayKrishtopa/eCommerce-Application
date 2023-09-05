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
import Categories from '@/Components/Categories/Categories'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import useCategories from '@/hooks/useCategories'
import s from './ProductsPage.module.scss'
import NotFoundPage from '../NotFoundPage/NotFoundPage'
import getProducts from './getProducts'

const PRODS_ON_PAGE = 15

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0)

  const location = useLocation()

  const { data: cats, loading: catLoading } = useCategories()

  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)

  const props = currentCategory
    ? {
        limit: PRODS_ON_PAGE,
        offset: currentPage * PRODS_ON_PAGE,
        filter: `categories.id:"${currentCategory.id}"`,
      }
    : {
        limit: PRODS_ON_PAGE,
        offset: currentPage * PRODS_ON_PAGE,
      }

  const { data, loading, total } = useProducts(props)

  const [products, setProducts] = useState<ProductProjection[]>([])

  const { ref, inView } = useInView({
    threshold: 1,
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

  const categoryCallback = (cat: Category | null) => {
    setCurrentCategory(cat)
  }

  useEffect(() => {
    const getCategoryFromLocation = () => {
      const url = location.pathname.split('/').filter((item) => item !== '')
      const path = url[url.length - 1]
      console.log(`path from func: ${path}`)
      const cat = cats.find((item) => item.slug.en === path)
      console.log(`data from func: ${cat?.name.en}`)
      return cat ? (cat as Category) : null
    }

    if (!catLoading) {
      console.log(`Current location: ${location.pathname}`)
      const c = getCategoryFromLocation()
      setCurrentCategory(c)
      console.log(`currentCategory: ${currentCategory?.name.en}`)
      getProducts({
        limit: PRODS_ON_PAGE,
        offset: 0,
        filter: `categories.id:"${c?.id}"`,
      })?.then((res) => {
        setProducts(res.body.results)
        console.log(`res.results: ${res.body.results}`)
        setCurrentPage(0)
      })
    }
  }, [location, catLoading, cats])

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
      <li
        key={product.id + Math.random() * 99999999}
        className={s.prodListItem}
      >
        <Link to={`${product.slug.en.toString()}`}>
          {ShoppingCard(prodData)}
        </Link>
      </li>
    )
  })

  const prodOutput = (
    <>
      {products && <ul className={s.prodList}>{prodList}</ul>}
      {loading && isFetching && <Loader className={s.prodLoader} />}
      {!loading && isFetching && <div ref={ref} className={s.pageBreak} />}
    </>
  )

  const catsList = cats.map((cat) => (
    <Route key={cat.id} path={`${cat.slug.en}`} element={prodOutput} />
  ))

  return (
    <ProductsContext.Provider value={products}>
      <Routes>
        <Route
          path="/"
          element={
            <section className={s.productPageContainer}>
              <div className={s.breadAndSearch}>
                <Breadcrumbs />
                <Search />
              </div>

              <h2 className={s.prodHeader}>
                {currentCategory ? currentCategory.name.en : 'Products'}{' '}
                {total && <span>[{total} products]</span>}
              </h2>

              <div className={s.catsAndFilter}>
                <Categories callback={categoryCallback} />
                <div className="filterAndSort" />
              </div>

              <Outlet />
            </section>
          }
        >
          <Route index element={prodOutput} />
          {catsList}
        </Route>
        <Route path="/slug" element={<ProductCard />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ProductsContext.Provider>
  )
}

export default ProductsPage
