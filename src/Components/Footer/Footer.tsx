import { NavLink } from 'react-router-dom'
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
          <li className={s.link}>About us</li>
          <li className={s.link}>RS School</li>
          <li className={s.link}>Contact</li>
          <li className={s.link}>Privacy Policy</li>
          <li className={s.link}>Terms of use</li>
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
            2023 The Skateshop. All rights reserved.
          </div>
        </div>
        <div className={s.socials}>
          <SvgInstagram />
          <SvgFacebook />
          <SvgVkontakte />
        </div>
      </div>
    </div>
  )
}
