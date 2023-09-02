// import { useState } from 'react'
import s from './Search.module.scss'
import { ReactComponent as SearchImg } from '../../assets/icons/search.svg'

export default function Search() {
  // const [query, setQuery] = useState('')

  return (
    <div className={s.searchContainer}>
      <SearchImg className={s.searchImg} />
      <input
        type="text"
        className={s.searchInput}
        placeholder="Search products"
      />
    </div>
  )
}
