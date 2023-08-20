import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './AuthPage.module.scss'
import skatepic from '../../assets/img/skateboard.png'
import { UI_TEXTS } from '../../utils/constants'
import { ReactComponent as VisiblePass } from '../../assets/icons/eye.svg'
import { ReactComponent as InvisiblePass } from '../../assets/icons/eye-slash.svg'
import useFormHandlers from './useFormHandlers'

export default function RegistrationPage() {
  const { values, errors, handleChange } = useFormHandlers()
  const [visiblePass, setVisiblePass] = useState(false)
  const [billingisthesame, setBillingisthesame] = useState(true)
  const [defaultship, setDefaultship] = useState(true)
  const [defaultbill, setDefaultbill] = useState(true)

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
        <form
          action=""
          className={s.authForm}
          // onSubmit={handleFormValidation}
          noValidate
        >
          <fieldset className={s.nameFields}>
            <div className={s.inputBox}>
              <label htmlFor="firstname">First Name</label>
              <div
                className={
                  errors.firstname
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="Samantha"
                  onChange={handleChange}
                />
              </div>
              {errors.firstname && (
                <p className={s.inputErrorMsg}>{errors.firstname}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="lastname">Last Name</label>
              <div
                className={
                  errors.lastname
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder="Smith"
                  onChange={handleChange}
                />
              </div>
              {errors.lastname && (
                <p className={s.inputErrorMsg}>{errors.lastname}</p>
              )}
            </div>
          </fieldset>

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
          </div>

          <div className={s.inputBox}>
            <label htmlFor="dob">Date of Birth</label>
            <div
              className={
                errors.dob
                  ? `${s.inputFieldBox} ${s.inputError}`
                  : s.inputFieldBox
              }
            >
              <input
                id="dob"
                name="dob"
                type="date"
                placeholder="DD/MM/YY"
                onChange={handleChange}
              />
            </div>
            {errors.dob && <p className={s.inputErrorMsg}>{errors.dob}</p>}
          </div>

          <fieldset className={s.shippingAddress}>
            <legend>Shipping address</legend>
            <div className={s.inputBox}>
              <label htmlFor="country-ship">Country / Region</label>
              <div
                className={
                  errors.country_ship
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <select
                  id="country-ship"
                  name="country_ship"
                  onChange={handleChange}
                  value={values.country_ship}
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                </select>
              </div>
              {errors.country_ship && (
                <p className={s.inputErrorMsg}>{errors.country_ship}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="city-ship">City</label>
              <div
                className={
                  errors.city_ship
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="city-ship"
                  name="city_ship"
                  type="text"
                  placeholder="Manchester"
                  onChange={handleChange}
                />
              </div>
              {errors.city_ship && (
                <p className={s.inputErrorMsg}>{errors.city_ship}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="postal-code-ship">Postal Code</label>
              <div
                className={
                  errors.postal_code_ship
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="postal-code-ship"
                  name="postal_code_ship"
                  type="text"
                  placeholder="M1"
                  onChange={handleChange}
                />
              </div>
              {errors.postal_code_ship && (
                <p className={s.inputErrorMsg}>{errors.postal_code_ship}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="street-ship">Street</label>
              <div
                className={
                  errors.street_ship
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="street-ship"
                  name="street_ship"
                  type="text"
                  placeholder="Elm Street"
                  onChange={handleChange}
                />
              </div>
              {errors.street_ship && (
                <p className={s.inputErrorMsg}>{errors.street_ship}</p>
              )}
            </div>

            <div className={`${s.inputBox} ${s.inputBoxClosing}`}>
              <label htmlFor="house-ship">House</label>
              <div
                className={
                  errors.house_ship
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="house-ship"
                  name="house_ship"
                  type="text"
                  placeholder="17"
                  onChange={handleChange}
                />
              </div>
              {errors.house_ship && (
                <p className={s.inputErrorMsg}>{errors.house_ship}</p>
              )}
            </div>
          </fieldset>

          <div className={s.checkboxContainer}>
            <input
              id="setasdefaultship"
              name="setasdefaultship"
              type="checkbox"
              checked={defaultship}
              onChange={(e) => {
                setDefaultship(!defaultship)
                handleChange(e)
              }}
            />
            <label htmlFor="setasdefaultship">
              Set as my default shipping address
            </label>
          </div>

          <div
            className={`${s.checkboxContainer} ${s.checkboxContainerClosing}`}
          >
            <input
              id="billingisthesame"
              name="billingisthesame"
              type="checkbox"
              checked={billingisthesame}
              onChange={(e) => {
                setBillingisthesame(!billingisthesame)
                handleChange(e)
              }}
            />
            <label htmlFor="billingisthesame">Same as my billing address</label>
          </div>

          <fieldset className={s.billingAddress} disabled={billingisthesame}>
            <legend>Billing address</legend>
            <div className={s.inputBox}>
              <label htmlFor="country-bill">Country / Region</label>
              <div
                className={
                  errors.country_bill
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <select
                  id="country-bill"
                  name="country_bill"
                  value={
                    billingisthesame ? values.country_ship : values.country_bill
                  }
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  <option value="GB">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="BE">Belgium</option>
                  <option value="NL">Netherlands</option>
                </select>
              </div>
              {errors.country_bill && (
                <p className={s.inputErrorMsg}>{errors.country_bill}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="city-bill">City</label>
              <div
                className={
                  errors.city_bill
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="city-bill"
                  name="city_bill"
                  type="text"
                  value={billingisthesame ? values.city_ship : values.city_bill}
                  placeholder="Manchester"
                  onChange={handleChange}
                />
              </div>
              {errors.city_bill && (
                <p className={s.inputErrorMsg}>{errors.city_bill}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="postal-code-bill">Postal Code</label>
              <div
                className={
                  errors.postal_code_bill
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="postal-code-bill"
                  name="postal_code_bill"
                  type="text"
                  value={
                    billingisthesame
                      ? values.postal_code_ship
                      : values.postal_code_bill
                  }
                  placeholder="M1"
                  onChange={handleChange}
                />
              </div>
              {errors.postal_code_bill && (
                <p className={s.inputErrorMsg}>{errors.postal_code_bill}</p>
              )}
            </div>

            <div className={s.inputBox}>
              <label htmlFor="street-bill">Street</label>
              <div
                className={
                  errors.street_bill
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="street-bill"
                  name="street_bill"
                  type="text"
                  value={
                    billingisthesame ? values.street_ship : values.street_bill
                  }
                  placeholder="Elm Street"
                  onChange={handleChange}
                />
              </div>
              {errors.street_bill && (
                <p className={s.inputErrorMsg}>{errors.street_bill}</p>
              )}
            </div>

            <div className={`${s.inputBox} ${s.inputBoxClosing}`}>
              <label htmlFor="house-bill">House</label>
              <div
                className={
                  errors.house_bill
                    ? `${s.inputFieldBox} ${s.inputError}`
                    : s.inputFieldBox
                }
              >
                <input
                  id="house-bill"
                  name="house_bill"
                  type="text"
                  value={
                    billingisthesame ? values.house_ship : values.house_bill
                  }
                  placeholder="17"
                  onChange={handleChange}
                />
              </div>
              {errors.house_bill && (
                <p className={s.inputErrorMsg}>{errors.house_bill}</p>
              )}
            </div>

            <div
              className={`${s.checkboxContainer} ${s.checkboxContainerClosing}`}
            >
              <input
                id="setasdefaultbill"
                name="setasdefaultbill"
                type="checkbox"
                checked={defaultbill}
                onChange={(e) => {
                  setDefaultbill(!defaultbill)
                  handleChange(e)
                }}
              />
              <label htmlFor="setasdefaultbill">
                Set as my default billing address
              </label>
            </div>
          </fieldset>

          <button type="submit">{UI_TEXTS.REGISTER_BTN}</button>
        </form>
        <p className={s.authRedirect}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </section>
    </div>
  )
}
