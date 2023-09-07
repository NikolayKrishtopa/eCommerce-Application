import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import { Category } from '@commercetools/platform-sdk'
import s from './Categogories.module.scss'

interface CategoriesProps {
  categories: Category[]
  activeCategorySlug?: string
}

export default function Categories(props: CategoriesProps) {
  const { categories, activeCategorySlug } = props

  const matchingCategory = categories.find(
    (c) => c.slug.en === activeCategorySlug,
  )

  return (
    <nav className={s.categoriesMenu}>
      <NavLink
        className={cn(s.categoryLink, {
          [s.active]: !matchingCategory,
        })}
        to="/catalog"
      >
        All products
      </NavLink>
      {categories.map((category) => (
        <NavLink
          key={category.id}
          className={cn(s.categoryLink, {
            [s.active]: matchingCategory === category,
          })}
          to={`/catalog/${category.slug.en}`}
        >
          {category.name.en}
        </NavLink>
      ))}
    </nav>
  )
}
