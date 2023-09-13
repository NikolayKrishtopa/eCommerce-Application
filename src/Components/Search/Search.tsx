import { useState, useEffect } from 'react'
import s from './Search.module.scss'
import { ReactComponent as SearchImg } from '../../assets/icons/search.svg'
import { SearchProps } from './Search.props'

export default function Search(props: SearchProps) {
  const { onSubmit } = props
  const [query, setQuery] = useState('')

  useEffect(() => {
    const searchTimeOut = setTimeout(() => {
      onSubmit(query)
    }, 300)
    return () => clearTimeout(searchTimeOut)
  }, [query])
  return (
    <div className={s.searchContainer}>
      <SearchImg className={s.searchImg} />
      <input
        type="text"
        className={s.searchInput}
        placeholder="Search products"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )
}
