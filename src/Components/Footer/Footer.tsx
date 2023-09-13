import { Link, NavLink } from 'react-router-dom'
import { ReactComponent as SvgInstagram } from '@/assets/icons/social/instagram.svg'
import { ReactComponent as SvgFacebook } from '@/assets/icons/social/facebook.svg'
import { ReactComponent as SvgVkontakte } from '@/assets/icons/social/vkontakte.svg'
import Logo from '../Logo/Logo'
import s from './Footer.module.scss'

export default function Footer() {
  return (
    <div className={s.footer}>
      <div className={s.row1}>
        <h2 className={s.heading}>Your new skateboard</h2>
        <ul className={s.linksList}>
          <li className={s.linkItem}>
            <Link to="/no-route">About us</Link>
          </li>
          <li className={s.linkItem}>
            <Link to="https://rs.school">RS School</Link>
          </li>
          <li className={s.linkItem}>
            <Link to="/no-route">Contact</Link>
          </li>
          <li className={s.linkItem}>
            <Link to="/no-route">Privacy Policy</Link>
          </li>
          <li className={s.linkItem}>
            <Link to="/no-route">Terms of use</Link>
          </li>
        </ul>
      </div>
      <div className={s.row2}>
        <div>
          <div className={s.logo}>
            <NavLink className={s.logoLink} to="/">
              <Logo invert />
            </NavLink>
          </div>
          <div className={s.copyright}>
            <span>2023 The Skateshop.</span>
            <span>All rights reserved.</span>
          </div>
        </div>
        <div className={s.socialsGroup}>
          <Link className={s.socialSvgLink} to="https://www.instagram.com">
            <SvgInstagram />
          </Link>
          <Link className={s.socialSvgLink} to="https://www.facebook.com">
            <SvgFacebook />
          </Link>
          <Link className={s.socialSvgLink} to="https://vk.com">
            <SvgVkontakte />
          </Link>
        </div>
      </div>
    </div>
  )
}
