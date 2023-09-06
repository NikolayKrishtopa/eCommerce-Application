import cn from 'classnames'
import { NavLink } from 'react-router-dom'
import useCategories from '@/hooks/useCategories'
import { Category } from '@commercetools/platform-sdk'
import { useEffect, useState } from 'react'
import s from './Categogories.module.scss'

interface CategoriesProps {
  activeCategorySlug?: string
}

export default function Categories(props: CategoriesProps) {
  const { activeCategorySlug } = props
  const { data } = useCategories()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (data) {
      setCategories(data)
    }
  }, [data])

  const matchingCategory = categories.find(
    (c) => c.slug.en === activeCategorySlug,
  )

  return (
    <nav className={s.categoriesMenu}>
      <NavLink
        className={cn(s.categoryLink, { [s.active]: !matchingCategory })}
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
