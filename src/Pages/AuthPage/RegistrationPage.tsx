import s from './AuthPage.module.scss'
import skatepic from '../../assets/img/skateboard.png'
import { UI_TEXTS } from '../../utils/constants'

export default function RegistrationPage() {
  return (
    <div className={s.authPage}>
      <section className={s.authPromo}>
        <img className={s.skatepic} src={skatepic} alt="" />
        <h2 className={s.authHeader}>
          Your new <br />
          skateboard
        </h2>
        <p className={s.authCta}>{UI_TEXTS.REGISTER_CTA}</p>
      </section>

      <section className={s.authFormContainer}>
        <h3 className={s.authFormHeader}>{UI_TEXTS.REGISTER_HEADER}</h3>
        <form action="" className={s.authForm}>
          <fieldset className={s.nameFields}>
            <div className={s.inputBox}>
              <label htmlFor="firstname">First Name</label>
              <input id="firstname" type="text" placeholder="Samantha" />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="lastname">Last Name</label>
              <input id="lastname" type="text" placeholder="Smith" />
            </div>
          </fieldset>

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
            <p>Must contain minimum 8 characters</p>
          </div>

          <div className={s.inputBox}>
            <label htmlFor="dob">Date of Birth</label>
            <input id="dob" type="date" placeholder="DD/MM/YY" />
          </div>

          <fieldset className={s.shippingAddress}>
            <div className={s.inputBox}>
              <label htmlFor="country-ship">Country / Region</label>
              <input
                id="country-ship"
                type="select"
                placeholder="United Kingdom"
              />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="city-ship">City</label>
              <input id="city-ship" type="text" placeholder="Manchester" />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="postal-code-ship">Postal Code</label>
              <input id="postal-code-ship" type="text" placeholder="M1" />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="streetandhouse-ship">Street, House etc</label>
              <input
                id="streetandhouse-ship"
                type="text"
                placeholder="17, Elm Street"
              />
            </div>
          </fieldset>

          <div className={s.checkboxContainer}>
            <input id="setasdefaultship" type="checkbox" checked />
            <label htmlFor="setasdefaultship">
              Set as my default shipping address
            </label>
          </div>

          <div
            className={`${s.checkboxContainer} ${s.checkboxContainerClosing}`}
          >
            <input id="billingisthesame" type="checkbox" checked />
            <label htmlFor="billingisthesame">Same as my billing address</label>
          </div>

          <fieldset className={s.billingAddress}>
            <div className={s.inputBox}>
              <label htmlFor="country-bill">Country / Region</label>
              <input
                id="country-bill"
                type="select"
                placeholder="United Kingdom"
              />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="city-bill">City</label>
              <input id="city-bill" type="text" placeholder="Manchester" />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="postal-code-bill">Postal Code</label>
              <input id="postal-code-bill" type="text" placeholder="M1" />
            </div>

            <div className={s.inputBox}>
              <label htmlFor="streetandhouse-bill">Street, House etc</label>
              <input
                id="streetandhouse-bill"
                type="text"
                placeholder="17, Elm Street"
              />
            </div>
          </fieldset>

          <div
            className={`${s.checkboxContainer} ${s.checkboxContainerClosing}`}
          >
            <input id="setasdefaultbill" type="checkbox" checked />
            <label htmlFor="setasdefaultbill">
              Set as my default billing address
            </label>
          </div>

          <button type="submit">{UI_TEXTS.REGISTER_BTN}</button>
        </form>
        <p className={s.authRedirect}>
          Already have an account? <a href="/login">Log in</a>
        </p>
      </section>
    </div>
  )
}
