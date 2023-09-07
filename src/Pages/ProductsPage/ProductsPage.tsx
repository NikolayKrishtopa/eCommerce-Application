import { useEffect, useState } from 'react'
import {
  AttributeDefinition,
  Category,
  ProductType,
} from '@commercetools/platform-sdk'
import useProducts from '@/hooks/useProducts'
import ShoppingCard from '@/Components/ShoppingCard/ShoppingCard'
import Loader from '@/Components/Loader/Loader'
import ProductCard from '@/Components/ProductCard/ProductCard'
import Breadcrumbs from '@/Components/Breadcrumbs/Breadcrumbs'
import Search from '@/Components/Search/Search'
import Categories from '@/Components/Categories/Categories'
import { Route, Routes, Link, useParams } from 'react-router-dom'
import { ReactComponent as SvgFilter } from '@/assets/icons/filter.svg'
import { ReactComponent as SvgSort } from '@/assets/icons/sort.svg'
import { apiRoot } from '@/eComMerchant/client'
import useCategories from '@/hooks/useCategories'
import Checkbox from '@/Components/UIKit/Checkbox/Checkbox'
import s from './ProductsPage.module.scss'
import b from './Sidebar.module.scss'

const PRODS_ON_PAGE = 10

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

const useGlobalFilters = () => {
  const [enumFilters, setEnumFilters] = useState<ProductType[]>([])
  useEffect(() => {
    apiRoot
      .productTypes()
      .get()
      .execute()
      .then((resp) => {
        if (resp.statusCode === 200) {
          setEnumFilters(resp.body.results)
        }
      })
  }, [])
  return enumFilters
}

type Filter = {
  name: string
  values: string[]
}

function FilterOption(props: {
  attribute: AttributeDefinition
  currentFilters: Filter[]
  onChange: (p: { key: string; value: string; checked: boolean }) => void
}) {
  const { attribute, currentFilters, onChange } = props
  const {
    label: { en: attributeLabel },
    name,
    type,
  } = attribute
  if (type.name === 'enum') {
    return (
      <li key={crypto.randomUUID()} className={b.option}>
        <span className={b.optionName}>{attributeLabel}</span>
        <ul className={b.optionVariantGroup}>
          {type.values.map(({ key, label }) => (
            <li key={crypto.randomUUID()} className={b.optionVariant}>
              <Checkbox
                label={label}
                checked={currentFilters.some(
                  (f) => f.name === name && f.values.some((v) => v === key),
                )}
                onChange={(e) => {
                  onChange({
                    key: name,
                    value: key,
                    checked: e.target.checked,
                  })
                }}
              />
            </li>
          ))}
        </ul>
      </li>
    )
  }

  return null
}

const useFilters = () => {
  const [filters, setFilters] = useState<Filter[]>([])
  const put = (name: string, value: string) => {
    const index = filters.findIndex((f) => f.name === name)
    if (index === -1) {
      setFilters([...filters, { name, values: [value] }])
    } else {
      const updated = [...filters]
      updated[index].values.push(value)
      setFilters(updated)
    }
  }
  const remove = (name: string, value?: string) => {
    const index = filters.findIndex((f) => f.name === name)
    if (index !== -1) {
      let updated = [...filters]
      if (value) {
        updated[index].values = updated[index].values.filter((v) => v !== value)
      } else {
        updated = updated.filter((_, i) => i !== index)
      }
      setFilters(updated)
    }
  }
  const clear = () => {
    setFilters([])
  }
  return {
    currentFilters: filters,
    putFilter: put,
    removeFilter: remove,
    clearFilters: clear,
  }
}

export function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState('')
  const { categorySlug } = useParams()
  const currentCategory = useCategorySlug(categorySlug)
  const { data: categoriesList } = useCategories()
  const globalFilters = useGlobalFilters()
  const [sidebar, setSidebar] = useState<'filters' | 'sort' | null>()

  // Filter logic
  const { currentFilters, putFilter, removeFilter, clearFilters } = useFilters()

  const {
    data: fetchedProducts,
    loading,
    total,
  } = useProducts({
    limit: currentFilters.length ? undefined : currentPage * PRODS_ON_PAGE,
    filter: currentFilters.map(({ name, values }) =>
      !values.length
        ? ''
        : `variants.attributes.${name}.key:"${values.join(`","`)}"`,
    ),
    categoryId: currentCategory?.id,
    searchText: query,
  })

  const MAX_PAGES = Math.ceil(total / PRODS_ON_PAGE) - 1
  const isMaxPage = currentPage >= MAX_PAGES

  const [products, setProducts] = useState<typeof fetchedProducts>([])

  useEffect(() => {
    setProducts(fetchedProducts)
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
      <li key={crypto.randomUUID()} className={s.prodListItem}>
        <Link to={link}>{ShoppingCard(prodData)}</Link>
      </li>
    )
  })

  return (
    <section className={s.productPageContainer}>
      {sidebar === 'filters' && (
        <div className={b.sidebar}>
          <div className={b.mask} />
          <div className={b.head}>
            <h3 className={b.heading}>Filters</h3>
            <button
              type="button"
              className={b.closeButton}
              onClick={() => {
                setSidebar(null)
              }}
            >
              X
            </button>
          </div>
          <div className={b.main}>
            <ul className={b.list}>
              {globalFilters.map(({ name: groupName, attributes }) => (
                <li key={crypto.randomUUID()} className={b.group}>
                  <span className={s.groupName}>{groupName}</span>
                  <ul className={s.groupList}>
                    {attributes?.map((attribute) => (
                      <FilterOption
                        key={crypto.randomUUID()}
                        attribute={attribute}
                        currentFilters={currentFilters}
                        onChange={({ key, value, checked }) => {
                          if (checked) {
                            putFilter(key, value)
                          } else {
                            removeFilter(key, value)
                          }
                        }}
                      />
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {sidebar === 'sort' && (
        <div className={b.sidebar}>
          <div className={b.mask} />
          <div className={b.head}>
            <h3 className={b.heading}>Sort</h3>
            <button
              type="button"
              className={b.closeButton}
              onClick={() => {
                setSidebar(null)
              }}
            >
              X
            </button>
          </div>
          <div className={b.main}>
            <ul className={b.list}>
              {[].map(() => (
                <li key={crypto.randomUUID()} className={b.item}>
                  <input type="radio" />
                  <input type="radio" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
          {!!currentFilters.length && (
            <>
              <ul className={s.cancelFilterList}>
                {currentFilters.map(({ name, values }) =>
                  values.map((value) => (
                    <li
                      key={crypto.randomUUID()}
                      className={s.cancelFilterItem}
                    >
                      <button
                        type="button"
                        className={s.cancelFilterItemButton}
                        onClick={() => {
                          removeFilter(name, value)
                        }}
                      >
                        <span className={s.cancelFilterItemButtonName}>
                          {`${name}: ${value}`}
                        </span>
                        <span className={s.cancelFilterItemButtonIcon}>𝕏</span>
                      </button>
                    </li>
                  )),
                )}
              </ul>
              <button
                type="button"
                className={s.clearFiltersButton}
                onClick={() => {
                  clearFilters()
                }}
              >
                <span className={s.clearFiltersButtonIcon}>×</span>
                <span className={s.clearFiltersButtonText}>Clear filters</span>
              </button>
            </>
          )}
        </div>
        <div className={s.openSidebarGroup}>
          <button
            type="button"
            className={s.openSidebarButton}
            onClick={() => setSidebar('filters')}
          >
            <span className={s.openSidebarButtonText}>Filters</span>
            <span className={s.openSidebarButtonIcon}>
              <SvgFilter />
            </span>
          </button>
          <button
            type="button"
            className={s.openSidebarButton}
            onClick={() => setSidebar('sort')}
          >
            <span className={s.openSidebarButtonText}>Sort</span>
            <span className={s.openSidebarButtonIcon}>
              <SvgSort />
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
