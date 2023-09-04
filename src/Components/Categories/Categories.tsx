import { NavLink } from 'react-router-dom'
import useCategories from '@/hooks/useCategories'
import { Category } from '@commercetools/platform-sdk'
import { useEffect, useState } from 'react'
import s from './Categogories.module.scss'

interface CatCallback {
  callback: (cat: Category | null) => void
}

export default function Categories(props: CatCallback) {
  const { callback } = props
  const { data } = useCategories()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    if (data) {
      setCategories(data)
    }
  }, [data])

  return (
    <nav className={s.categoriesMenu}>
      <NavLink className={s.categoryLink} to="" onClick={() => callback(null)}>
        All products
      </NavLink>
      {categories.map((category) => (
        <NavLink
          key={category.id}
          className={s.categoryLink}
          to={category.slug.en}
          onClick={() => {
            // e.preventDefault()
            callback(category)
          }}
        >
          {category.name.en}
        </NavLink>
      ))}
    </nav>
  )
}
