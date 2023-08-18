import s from './AuthPage.module.scss'
import skatepic from '../../assets/img/skateboard.png'
import { UI_TEXTS } from '../../utils/constants'

export default function LoginPage() {
  return (
    <div className={s.authPage}>
      <section className={s.authPromo}>
        <img className={s.skatepic} src={skatepic} alt="" />
        <h2 className={s.authHeader}>
          Your new <br />
          skateboard
        </h2>
        <p className={s.authCta}>{UI_TEXTS.LOGIN_CTA}</p>
      </section>

      <section className={s.authFormContainer}>
        <h3 className={s.authFormHeader}>{UI_TEXTS.LOGIN_HEADER}</h3>
        <form action="" className={s.authForm}>
          <div className={s.inputBox}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="samantha.smith@gmail.com"
            />
          </div>

          <div className={s.inputBox}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" />
            <p className={s.authRedirect}>
              Forgot password? <a href="/">Reset</a>
            </p>
          </div>

          <button type="submit">{UI_TEXTS.LOGIN_BTN}</button>
        </form>
        <p className={s.authRedirect}>
          Don&apos;t have an account yet? <a href="/register">Register</a>
        </p>
      </section>
    </div>
  )
}
