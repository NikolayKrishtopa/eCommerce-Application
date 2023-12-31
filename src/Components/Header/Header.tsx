import { useState, useContext, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import CartContext from '@/contexts/CartContext'
import s from './Header.module.scss'
import { ReactComponent as BasketImg } from '../../assets/icons/basket.svg'
import { ReactComponent as LogoutImg } from '../../assets/icons/logout.svg'
import { ReactComponent as ProfileImg } from '../../assets/icons/person.svg'
import { HeaderProps } from './Header.props'
import Logo from '../Logo/Logo'

export default function Header(props: HeaderProps) {
  const { onLogout } = props
  const [burgerActive, setBurgerActive] = useState(false)
  const location = useLocation()
  const currentUser = useContext(CurrentUserContext)

  const currentCart = useContext(CartContext)

  const isTransparent = () =>
    location.pathname === '/register' || location.pathname === '/login'

  useEffect(() => {
    document.body.style.overflow = burgerActive ? 'hidden' : 'unset'
  }, [burgerActive])

  return (
    <header
      className={isTransparent() ? `${s.header} ${s.transparent}` : s.header}
    >
      <h1 className={s.logo}>
        <NavLink to="/" onClick={() => setBurgerActive(false)}>
          <Logo />
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

        {!currentUser && (
          <div className={s.authlink}>
            <NavLink
              to="/login"
              onClick={() => setBurgerActive(false)}
              data-testid="login-button"
            >
              Login
            </NavLink>
          </div>
        )}

        {!currentUser && (
          <div className={s.authlink}>
            <NavLink
              to="/register"
              onClick={() => setBurgerActive(false)}
              data-testid="register-button"
            >
              Register
            </NavLink>
          </div>
        )}
      </nav>

      {currentUser && (
        <div className={s.profileLink}>
          <NavLink
            to="/profile"
            onClick={() => setBurgerActive(false)}
            data-testid="profile-button"
          >
            <ProfileImg className={s.profileImg} />
          </NavLink>
        </div>
      )}

      {currentUser && (
        <div className={s.profileLink}>
          <NavLink
            to="/"
            onClick={() => {
              onLogout()
              setBurgerActive(false)
            }}
            data-testid="logout-button"
          >
            <LogoutImg className={s.profileImg} />
          </NavLink>
        </div>
      )}

      <div className={s.basketLink}>
        <NavLink to="/cart" onClick={() => setBurgerActive(false)}>
          <div className={s.basketImgContainer}>
            <BasketImg className={s.basketImg} />
            {currentCart?.cart && currentCart?.cart.totalLineItemQuantity && (
              <div className={s.basketCount}>
                {currentCart?.cart.totalLineItemQuantity}
              </div>
            )}
          </div>
        </NavLink>
      </div>

      <button
        type="button"
        className={!burgerActive ? s.burger : `${s.burger} ${s.active}`}
        onClick={() => {
          setBurgerActive(!burgerActive)
        }}
      >
        <span />
      </button>
    </header>
  )
}
