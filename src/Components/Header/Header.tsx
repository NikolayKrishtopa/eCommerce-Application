import { useState, useContext, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import s from './Header.module.scss'
import { ReactComponent as BasketImg } from '../../assets/icons/basket.svg'
import { ReactComponent as Logo } from '../../assets/icons/logo.svg'
import { HeaderProps } from './Header.props'

export default function Header(props: HeaderProps) {
  const { onLogout } = props
  const [burgerActive, setBurgerActive] = useState(false)
  const location = useLocation()
  const currentUser = useContext(CurrentUserContext)

  // ************
  //  !!!!!Это нужно только чтобы не ругалось на неиспользуемые переменные, удали когда заюзаешь их
  useEffect(() => {
    console.log(currentUser)
    console.log(onLogout)
  })
  // ***************

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
