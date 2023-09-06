import { useEffect, useState } from 'react'
import { Category } from '@commercetools/platform-sdk'
import useProducts from '@/hooks/useProducts'
import ShoppingCard from '@/Components/ShoppingCard/ShoppingCard'
import Loader from '@/Components/Loader/Loader'
import ProductCard from '@/Components/ProductCard/ProductCard'
import Breadcrumbs from '@/Components/Breadcrumbs/Breadcrumbs'
import Search from '@/Components/Search/Search'
import Categories from '@/Components/Categories/Categories'
import { Route, Routes, Link, useParams } from 'react-router-dom'
import { ReactComponent as SvgFilter } from '@/assets/icons/filter.svg'
import { apiRoot } from '@/eComMerchant/client'
import useCategories from '@/hooks/useCategories'
import s from './ProductsPage.module.scss'

const PRODS_ON_PAGE = 30

const HARDCODED_FILTERS = [
  {
    name: 'medium-length',
    filter: 'variants.attributes.skateboard-length:"range (1 to *)"',
  },
]

const useCategorySlug = (categorySlug?: string) => {
  const [category, setCategory] = useState<Category>()
  useEffect(() => {
    if (categorySlug) {
      apiRoot
        .categories()
        .get({ queryArgs: { where: `slug(en="${categorySlug}")`, limit: 1 } })
        .execute()
        .then((resp) => {
          if (resp.statusCode === 200) {
            setCategory(resp.body.results.at(0))
          }
        })
    }
  }, [categorySlug])
  return category
}

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState('')
  const { categorySlug } = useParams()
  const currentCategory = useCategorySlug(categorySlug)
  const { data: categoriesList } = useCategories()

  // Filter logic
  const [filters, setFilters] =
    useState<{ name: string; filter: string }[]>(HARDCODED_FILTERS)

  const onCancelFilterClick = (name: string) => () => {
    setFilters((fs) => fs.filter((f) => f.name !== name))
  }
  const onClearFiltersClick = () => {
    setFilters([])
  }

  const {
    data: fetchedProducts,
    loading,
    total,
  } = useProducts({
    limit: PRODS_ON_PAGE,
    offset: currentPage * PRODS_ON_PAGE,
    filter: filters.map((f) => f.filter),
    categoryId: currentCategory?.id,
    searchText: query,
  })

  const MAX_PAGES = Math.ceil(total / PRODS_ON_PAGE) - 1
  const isMaxPage = currentPage >= MAX_PAGES

  const [products, setProducts] = useState<typeof fetchedProducts>([])

  useEffect(() => {
    setProducts((prev) => [...prev, ...fetchedProducts])
  }, [JSON.stringify(fetchedProducts)])

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

    const link = `/catalog/${currentCategory?.slug.en || 'all-products'}/${
      product.slug.en
    }`

    return (
      <li key={product.id + Math.random() * 9999999} className={s.prodListItem}>
        <Link to={link}>{ShoppingCard(prodData)}</Link>
      </li>
    )
  })

  return (
    <section className={s.productPageContainer}>
      <div className={s.breadAndSearch}>
        <Breadcrumbs />
        <Search onSubmit={setQuery} />
      </div>

      <h2 className={s.prodHeader}>
        {!loading && (
          <>
            {!currentCategory ? 'Products' : currentCategory.name.en}{' '}
            {!total ? null : <span>[{total} products]</span>}
          </>
        )}
      </h2>

      <div className={s.row}>
        <div className={s.cancelFilterGroup}>
          {!!filters.length && (
            <>
              <ul className={s.cancelFilterList}>
                {filters.map(({ name }) => (
                  <li key={name} className={s.cancelFilterItem}>
                    <button
                      type="button"
                      className={s.cancelFilterItemButton}
                      onClick={onCancelFilterClick(name)}
                    >
                      <span className={s.cancelFilterItemButtonName}>
                        {name}
                      </span>
                      <span className={s.cancelFilterItemButtonIcon}>𝕏</span>
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
                <span className={s.clearFiltersButtonText}>Clear filters</span>
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
        <Categories
          categories={categoriesList}
          activeCategorySlug={categorySlug}
        />
      </div>
      <div className={s.products}>
        <ul className={s.prodList}>{prodList}</ul>
        {loading && <Loader className={s.prodLoader} />}
        <button
          type="button"
          className={s.loadMore}
          disabled={isMaxPage}
          onClick={() => {
            setCurrentPage((prev) => Math.min(MAX_PAGES, prev + 1))
          }}
        >
          Load more
        </button>
      </div>
    </section>
  )
}

export default function ProductCardRoutes() {
  return (
    <Routes>
      <Route path="/:categorySlug/:productSlug" element={<ProductCard />} />
      <Route path="/:categorySlug?" element={<ProductsPage />} />
    </Routes>
  )
}
