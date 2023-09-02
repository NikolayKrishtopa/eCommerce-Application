import { NavLink } from 'react-router-dom'
import s from './Categogories.module.scss'

export default function Categories() {
  const categories = [
    'Complete skateboards',
    'Longboards',
    'Cruisers',
    'Decks',
    'Wheels',
  ]

  return (
    <nav className={s.categoriesMenu}>
      {categories.map((category) => (
        <NavLink className={s.categoryLink} to="/">
          {category}
        </NavLink>
      ))}
    </nav>
  )
}
