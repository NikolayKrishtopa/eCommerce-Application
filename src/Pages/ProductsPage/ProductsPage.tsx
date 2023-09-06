import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Category, ProductProjection } from '@commercetools/platform-sdk'
import useProducts from '@/hooks/useProducts'
import ShoppingCard from '@/Components/ShoppingCard/ShoppingCard'
import Loader from '@/Components/Loader/Loader'
import ProductCard from '@/Components/ProductCard/ProductCard'
import Breadcrumbs from '@/Components/Breadcrumbs/Breadcrumbs'
import Search from '@/Components/Search/Search'
import Categories from '@/Components/Categories/Categories'
import { Outlet, Route, Routes, Link, useLocation } from 'react-router-dom'
import useCategories from '@/hooks/useCategories'
import { ReactComponent as SvgFilter } from '@/assets/icons/filter.svg'
import s from './ProductsPage.module.scss'
import getProducts from './getProducts'

const PRODS_ON_PAGE = 15

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [query, setQuery] = useState('')

  const location = useLocation()

  const { data: cats, loading: catLoading } = useCategories()

  const getCategoryFromLocation = () => {
    const url = location.pathname.split('/').filter((item) => item !== '')
    const path = url[url.length - 1]
    const cat = cats.find((item) => item.slug.en === path)
    return cat ? (cat as Category) : null
  }

  const [currentCategory, setCurrentCategory] = useState<Category | null>(
    getCategoryFromLocation(),
  )

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
    if (!catLoading) {
      const c = getCategoryFromLocation()
      setCurrentCategory(c)
      getProducts({
        limit: PRODS_ON_PAGE,
        offset: 0,
        filter: `categories.id:"${c?.id}"`,
      })?.then((res) => {
        setProducts(res.body.results)
        setCurrentPage(0)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, catLoading, cats])

  const prodList = products
    .filter(
      (p) =>
        p.description &&
        (p?.description.en.toLowerCase().includes(query.toLowerCase()) ||
          p?.name.en.toLowerCase().includes(query.toLowerCase())),
    )
    .map((product) => {
      const brandName = product.masterVariant.attributes?.find((attribute) =>
        attribute.name.endsWith('-brand'),
      )?.value.label

      const discounted =
        product.masterVariant.prices &&
        product.masterVariant.prices[0].discounted
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

  // Filter logic
  const [filters, setFilters] = useState([])

  const onCancelFilterClick = (name: string) => () => {
    filters.filter((f) => f !== name)
  }
  const onClearFiltersClick = () => {
    setFilters([])
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <section className={s.productPageContainer}>
            <div className={s.breadAndSearch}>
              <Breadcrumbs />
              <Search onSubmit={setQuery} />
            </div>

            <h2 className={s.prodHeader}>
              {currentCategory ? currentCategory.name.en : 'Products'}{' '}
              {total && <span>[{total} products]</span>}
            </h2>

            <div className={s.row}>
              <div className={s.cancelFilterGroup}>
                {!!filters.length && (
                  <>
                    <ul className={s.cancelFilterList}>
                      {filters.map((name) => (
                        <li key={name} className={s.cancelFilterItem}>
                          <button
                            type="button"
                            className={s.cancelFilterItemButton}
                            onClick={onCancelFilterClick(name)}
                          >
                            <span className={s.cancelFilterItemButtonName}>
                              {name}
                            </span>
                            <span className={s.cancelFilterItemButtonIcon}>
                              𝕏
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className={s.clearFiltersButton}
                      onClick={onClearFiltersClick}
                    >
                      <span className={s.clearFiltersButtonIcon}>×</span>
                      <span className={s.clearFiltersButtonText}>
                        Clear filters
                      </span>
                    </button>
                  </>
                )}
              </div>
              <div className={s.openSidebarGroup}>
                <button type="button" className={s.openSidebarButton}>
                  <span className={s.openSidebarButtonText}>Filters</span>
                  <span className={s.openSidebarButtonIcon}>
                    <SvgFilter />
                  </span>
                </button>
              </div>
            </div>

            <div className={s.catsAndFilter}>
              <Categories callback={categoryCallback} />
            </div>
            <Outlet />
          </section>
        }
      >
        <Route index element={prodOutput} />
        {catsList}
      </Route>
      <Route path="/:slug" element={<ProductCard />} />
      <Route path="/:category?/:slug" element={<ProductCard />} />
    </Routes>
  )
}
