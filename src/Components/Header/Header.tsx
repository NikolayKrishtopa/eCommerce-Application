import { NavLink } from 'react-router-dom'
import s from './Header.module.scss'
import logoImg from '../../assets/logo.svg'
import basketImg from '../../assets/basket.svg'

export default function Header() {
  return (
    <header className={s.header}>
      <div className={s.logo}>
        <img className={s.logoImg} src={logoImg} alt="logo" />
        <NavLink to="/">The Skateshop</NavLink>
      </div>
      <nav>
        <ul className={s.mainMenu}>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/catalog">Products</NavLink>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
        </ul>
      </nav>

      <div className={s.authlink}>
        <NavLink to="/login">Login</NavLink>
      </div>

      <div className={s.authlink}>
        <NavLink to="/register">Register</NavLink>
      </div>

      <div className={s.basketlink}>
        <NavLink to="/basket">
          <img className={s.basketImg} src={basketImg} alt="basket" />
        </NavLink>
      </div>
    </header>
  )
}
