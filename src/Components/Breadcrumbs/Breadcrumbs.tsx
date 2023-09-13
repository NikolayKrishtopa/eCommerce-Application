import { Link, useLocation } from 'react-router-dom'
import { ReactNode } from 'react'
import s from './Breadcrumbs.module.scss'

export default function Breadcrumbs() {
  const location = useLocation()

  let currentLink = ''

  const crumbs = location.pathname
    .split('/')
    .filter((crumb) => crumb !== '')
    .map((crumb) => {
      currentLink += `/${crumb}`

      return (
        <span className={s.crumb} key={crumb}>
          <Link to={currentLink}>{crumb}</Link>
        </span>
      )
    })

  return <span className={s.breadcrumbs}>{crumbs as ReactNode}</span>
}
