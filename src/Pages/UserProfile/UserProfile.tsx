import { Link } from 'react-router-dom'
import { ReactComponent as SvgCross } from '@/assets/icons/cross.svg'
import { FormEvent, useContext, useEffect, useState } from 'react'
import cn from 'classnames'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import TextInput from '@/Components/UIKit/TextInput/TextInput'
import TextInputHidden from '@/Components/UIKit/TextInput/TextInputHidden/TextInputHidden'
import Checkbox from '@/Components/UIKit/Checkbox/Checkbox'
import FormSection from './FormSection/FormSection'
import s from './UserProfile.module.scss'
import UserProfileProps from './UserProfile.props'

export default function UserProfile(props: UserProfileProps) {
  const { onUserUpdate, onPasswordChange } = props

  const currentUser = useContext(CurrentUserContext)
  const [firstName, setFirstName] = useState(currentUser?.firstName ?? '')
  const [lastName, setLastName] = useState(currentUser?.lastName ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth ?? '')
  const [changePasswordMode, setChangePasswordMode] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const submitUserUpdate = (e: FormEvent) => {
    e.preventDefault()
    onUserUpdate({ firstName, lastName, email, dateOfBirth })
  }

  const submitPasswordUpdate = (e: FormEvent) => {
    e.preventDefault()
    onPasswordChange(newPassword, currentPassword)
  }

  useEffect(() => {
    setFirstName(currentUser?.firstName ?? '')
    setLastName(currentUser?.lastName ?? '')
    setEmail(currentUser?.email ?? '')
    setDateOfBirth(currentUser?.dateOfBirth ?? '')
  }, [
    currentUser?.firstName,
    currentUser?.lastName,
    currentUser?.email,
    currentUser?.dateOfBirth,
  ])

  const isEditUserInvalid =
    (firstName === currentUser?.firstName &&
      lastName === currentUser?.lastName &&
      email === currentUser?.email &&
      dateOfBirth === currentUser?.dateOfBirth) ||
    (!firstName && !lastName && !email && !dateOfBirth)

  const isPasswordValid =
    currentPassword &&
    newPassword &&
    newPasswordRepeat &&
    newPassword === newPasswordRepeat

  return (
    <main className={s.main}>
      <div className={s.introSection}>
        {/* Profile */}
        <FormSection
          legend="Account"
          hint="You can change your personal information here"
        >
          <div className={s.inputsRow}>
            <TextInput
              label="First name"
              placeholder="Samantha"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextInput
              label="Last name"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <TextInput
            type="email"
            label="Email"
            placeholder="samantha.smith@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            type="date"
            label="Date of birth"
            placeholder="11/20/1980"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value)
            }}
          />
          <button
            type="submit"
            className={cn(s.button, {
              [s.buttonDisabled]: isEditUserInvalid,
            })}
            onClick={submitUserUpdate}
          >
            Update profile
          </button>
        </FormSection>
      </div>
      {/* Password */}
      <FormSection
        legend={changePasswordMode ? 'Password' : undefined}
        hint={
          changePasswordMode
            ? 'Your password must contain minimum 8 characters'
            : undefined
        }
      >
        {changePasswordMode && (
          <>
            <TextInputHidden
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <TextInputHidden
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className={s.inputWith}>
              <TextInputHidden
                label="Repeat password"
                errorJump
                value={newPasswordRepeat}
                onChange={(e) => setNewPasswordRepeat(e.target.value)}
              />
              <Link to="/no-route" className={s.link}>
                Do not remember the password?
              </Link>
            </div>
          </>
        )}
        {changePasswordMode ? (
          <>
            <button
              type="submit"
              className={cn(s.button, { [s.buttonDisabled]: !isPasswordValid })}
              onClick={submitPasswordUpdate}
            >
              Save
            </button>
            <button
              type="button"
              className={s.button}
              onClick={() => setChangePasswordMode(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className={s.button}
            onClick={() => setChangePasswordMode(true)}
          >
            Change password
          </button>
        )}
      </FormSection>
      {/* Default address */}
      <FormSection
        legend="Default address"
        hint="Add, edit or remove any of your addresses"
      >
        <TextInput label="Country/region" />
        <TextInput label="City" />
        <TextInput label="Address" />
        <TextInput label="Postal code" />
        <TextInput label="Billing address" />
        <div className={s.buttonsRow}>
          <button type="button" className={s.button}>
            Delete
          </button>
          <button type="submit" className={s.button}>
            Edit
          </button>
        </div>
      </FormSection>
      {/* New address */}
      <FormSection
        legend="Add address"
        hint="Add, edit or remove any of your addresses"
      >
        <TextInput label="Country/region" />
        <TextInput label="City" />
        <div className={s.inputWith}>
          <TextInput label="Address" errorJump />
          <Checkbox label="Set as my default shipping address" />
        </div>
        <TextInput label="Postal code" />
        <div className={s.inputWith}>
          <TextInput label="Billing address" errorJump />
          <Checkbox label="Same as my shipping address" />
        </div>
        <div className={s.buttonsRow}>
          <button type="button" className={s.button}>
            Delete
          </button>
          <button type="submit" className={s.button}>
            Edit
          </button>
        </div>
      </FormSection>
      <button type="button" className={s.addAddress}>
        <SvgCross />
        <span>Add address</span>
      </button>
    </main>
  )
}
