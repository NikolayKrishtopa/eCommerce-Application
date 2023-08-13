import { NavLink } from 'react-router-dom'
import pict from '../../assets/img/404.png'
import { UI_TEXTS } from '../../utils/constants'
import s from './NotFoundPae.module.scss'

export default function NotFoundPage() {
  return (
    <div className={s.page}>
      <img src={pict} alt="404 not found page" className={s.img} />
      <p className={s.mainText}>{UI_TEXTS.NOT_FOUND}</p>
      <p className={s.supplText}>
        {UI_TEXTS.LINK_FROM_NOT_FOUND}{' '}
        <NavLink to="/" className={s.link}>
          Main page
        </NavLink>
      </p>
    </div>
  )
}
