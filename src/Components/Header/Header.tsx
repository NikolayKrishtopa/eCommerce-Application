import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import s from './Header.module.scss'
import { ReactComponent as BasketImg } from '../../assets/icons/basket.svg'
import { ReactComponent as Logo } from '../../assets/icons/logo.svg'

export default function Header() {
  const [burgerActive, setBurgerActive] = useState(false)
  const location = useLocation()

  const isTransparent = () =>
    location.pathname === '/register' || location.pathname === '/login'

  return (
    <header
      className={isTransparent() ? `${s.header} ${s.transparent}` : s.header}
    >
      <h1 className={s.logo}>
        <NavLink to="/" onClick={() => setBurgerActive(false)}>
          <Logo className={s.logoImg} />
          <span>The Skateshop</span>
        </NavLink>
      </h1>
      <nav className={!burgerActive ? s.navbar : `${s.navbar} ${s.open}`}>
        <ul className={s.mainMenu}>
          <li>
            <NavLink to="/" onClick={() => setBurgerActive(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/catalog" onClick={() => setBurgerActive(false)}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => setBurgerActive(false)}>
              About
            </NavLink>
          </li>
        </ul>

        <div className={s.authlink}>
          <NavLink to="/login" onClick={() => setBurgerActive(false)}>
            Login / Register
          </NavLink>
        </div>
      </nav>

      <div className={s.basketLink}>
        <NavLink to="/basket" onClick={() => setBurgerActive(false)}>
          <BasketImg className={s.basketImg} />
        </NavLink>
      </div>

      <button
        type="button"
        className={!burgerActive ? s.burger : `${s.burger} ${s.active}`}
        onClick={() => setBurgerActive(!burgerActive)}
      >
        <span />
      </button>
    </header>
  )
}
