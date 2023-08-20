import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './AuthPage.module.scss'
import skatepic from '../../assets/img/skateboard.png'
import { UI_TEXTS } from '../../utils/constants'
// import validateForm from './validateForm'
import { ReactComponent as VisiblePass } from '../../assets/icons/eye.svg'
import { ReactComponent as InvisiblePass } from '../../assets/icons/eye-slash.svg'
import useFormHandlers from './useFormHandlers'

export default function LoginPage() {
  const { errors, handleChange } = useFormHandlers()
  const [visiblePass, setVisiblePass] = useState(false)

  // const [errors, setErrors] = useState({
  //   email: '',
  //   password: '',
  // })
  // const [values, setValues] = useState({
  //   email: '',
  //   password: '',
  // })

  // const handleChange = (e: ChangeEvent) => {
  //   e.preventDefault()
  //   const target = e.target as HTMLInputElement
  //   const { name, value } = target
  //   setValues({ ...values, [name]: value })
  // }

  // const handleFormValidation = (e: FormEvent): void => {
  //   e.preventDefault()
  //   setValues({ ...values, email: values.email.trim() })
  //   setErrors(validateForm(values))
  // }

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
        <form
          action=""
          className={s.authForm}
          // onSubmit={handleFormValidation}
          noValidate
        >
          <div className={s.inputBox}>
            <label htmlFor="email">Email</label>
            <div
              className={
                errors.email
                  ? `${s.inputFieldBox} ${s.inputError}`
                  : s.inputFieldBox
              }
            >
              <input
                id="email"
                name="email"
                type="email"
                placeholder="samantha.smith@gmail.com"
                onChange={handleChange}
              />
            </div>

            {errors.email && <p className={s.inputErrorMsg}>{errors.email}</p>}
          </div>

          <div className={s.inputBox}>
            <label htmlFor="password">Password</label>
            <div
              className={
                errors.password
                  ? `${s.inputFieldBox} ${s.inputError}`
                  : s.inputFieldBox
              }
            >
              <input
                id="password"
                name="password"
                type={visiblePass ? 'text' : 'password'}
                onChange={handleChange}
              />
              <button
                className={s.inputFieldControl}
                type="button"
                onClick={() => setVisiblePass(!visiblePass)}
              >
                {visiblePass ? <VisiblePass /> : <InvisiblePass />}
              </button>
            </div>
            {errors.password && (
              <p className={s.inputErrorMsg}>{errors.password}</p>
            )}
            <p className={s.authRedirect}>
              Forgot password? <a href="/">Reset</a>
            </p>
          </div>

          <button type="submit">{UI_TEXTS.LOGIN_BTN}</button>
        </form>
        <p className={s.authRedirect}>
          Don&apos;t have an account yet? <Link to="/register">Register</Link>
        </p>
      </section>
    </div>
  )
}
