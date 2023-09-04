import { Link } from 'react-router-dom'
import { ReactComponent as SvgCross } from '@/assets/icons/cross.svg'
import { FormEvent, useContext, useEffect, useState } from 'react'
import cn from 'classnames'
import CurrentUserContext from '@/contexts/CurrentUserContext'
import TextInput from '@/Components/UIKit/TextInput/TextInput'
import TextInputHidden from '@/Components/UIKit/TextInputHidden/TextInputHidden'
import Checkbox from '@/Components/UIKit/Checkbox/Checkbox'
import { Address } from '@commercetools/platform-sdk'
import AddressTag from '@/Components/Address/AddressTag'
import FormSection from './FormSection/FormSection'
import s from './UserProfile.module.scss'
import UserProfileProps from './UserProfile.props'

export default function UserProfile(props: UserProfileProps) {
  const {
    onUserUpdate,
    onPasswordChange,
    onAddAddress,
    onEditAddress,
    onRemoveAddress,
    onSetAddress,
    onSetDefaultAddress,
    onUnsetAddress,
  } = props

  const currentUser = useContext(CurrentUserContext)
  const [firstName, setFirstName] = useState(currentUser?.firstName ?? '')
  const [lastName, setLastName] = useState(currentUser?.lastName ?? '')
  const [email, setEmail] = useState(currentUser?.email ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(currentUser?.dateOfBirth ?? '')
  const [changePasswordMode, setChangePasswordMode] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [country, setCountry] = useState('')
  const [streetName, setStreetName] = useState('')
  const [streetNumber, setStreetNumber] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [setAsDefaultShipping, setSetAsDefaultShipping] = useState(false)
  const [setAsDefaultBilling, setSetAsDefaultBilling] = useState(false)
  const [addressMode, setAddressMode] = useState<'add' | 'edit' | null>(null)
  const [addressToUpdate, setAddressToUpdate] = useState('')

  const submitUserUpdate = (e: FormEvent) => {
    e.preventDefault()
    onUserUpdate({ firstName, lastName, email, dateOfBirth })
  }

  const submitPasswordUpdate = (e: FormEvent) => {
    e.preventDefault()
    onPasswordChange(newPassword, currentPassword)
  }

  const SubmitAddAddress = (e: FormEvent) => {
    e.preventDefault()
    onAddAddress(
      { country, city, streetName, streetNumber, postalCode },
      setAsDefaultShipping,
      setAsDefaultBilling,
    )
  }

  const submitUpdateAddress = (e: FormEvent) => {
    e.preventDefault()
    if (!addressToUpdate) return
    onEditAddress(addressToUpdate, {
      country,
      city,
      streetName,
      streetNumber,
      postalCode,
    })
  }

  const resetAddressField = () => {
    setCity('')
    setCountry('')
    setStreetName('')
    setStreetNumber('')
    setPostalCode('')
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

  const isAddressValid =
    !!country && !!city && !!postalCode && !!streetName && !!streetNumber
  return (
    <main className={s.main}>
      <div className={s.introSection}>
        {/* Profile */}
        <FormSection
          legend="Account"
          hint="You can change your personal information here. Edit below to change your profile"
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
        {changePasswordMode ? (
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

      {addressMode === 'add' || addressMode === 'edit' ? (
        <FormSection
          legend={addressMode === 'add' ? 'Add new address' : 'Edit address'}
          hint="Add, edit or remove any of your addresses"
        >
          <div className={s.inputBox}>
            <label htmlFor="Country/region" className={s.inputLabel}>
              Country/region
            </label>
            <div className={s.inputFieldBox}>
              <select
                onChange={(e) => setCountry(e.target.value)}
                value={country}
                name="Country/region"
                className={s.input}
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
          </div>
          <TextInput
            label="City"
            errorJump
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <TextInput
            label="Street"
            errorJump
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
          />
          <TextInput
            label="Building"
            errorJump
            value={streetNumber}
            onChange={(e) => setStreetNumber(e.target.value)}
          />
          <TextInput
            label="Postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          {addressMode === 'add' ? (
            <div className={s.inputWith}>
              <Checkbox
                label="Set as my default shipping address"
                checked={setAsDefaultShipping}
                onChange={(e) => setSetAsDefaultShipping(e.target.checked)}
              />
              <Checkbox
                label="Set as my default billing address"
                checked={setAsDefaultBilling}
                onChange={(e) => setSetAsDefaultBilling(e.target.checked)}
              />
            </div>
          ) : (
            <> </>
          )}
          <div className={s.buttonsRow}>
            <button
              type="button"
              className={cn(s.button, { [s.buttonDisabled]: !isAddressValid })}
              onClick={
                addressMode === 'add' ? SubmitAddAddress : submitUpdateAddress
              }
            >
              Save
            </button>
            <button
              type="submit"
              className={s.button}
              onClick={() => {
                setAddressMode(null)
                resetAddressField()
              }}
            >
              Cancel
            </button>
          </div>
        </FormSection>
      ) : (
        <>
          <FormSection
            legend="Your addresses"
            hint="all addresses you have added to your account"
          >
            {currentUser?.addresses.map((a) => (
              <AddressTag
                key={a.id}
                addressData={a}
                onEdit={(addressData: Address) => {
                  setAddressMode('edit')
                  setAddressToUpdate(addressData.id ?? '')
                  setCity(addressData.city ?? '')
                  setCountry(addressData.country ?? '')
                  setStreetName(addressData.streetName ?? '')
                  setStreetNumber(addressData.streetNumber ?? '')
                  setPostalCode(addressData.postalCode ?? '')
                }}
                onRemove={onRemoveAddress}
                onSetAddress={onSetAddress}
                onSetDefaultAddress={onSetDefaultAddress}
              />
            ))}
          </FormSection>
          <FormSection legend="Your shipping addresses" hint=" ">
            {currentUser?.addresses
              .filter((e) =>
                e.id ? currentUser.shippingAddressIds?.includes(e.id) : null,
              )
              .map((a) => (
                <AddressTag
                  key={a.id}
                  addressData={a}
                  onUnsetAddress={(id: string) =>
                    onUnsetAddress('shipping', id)
                  }
                />
              )) ?? <span>Not specipied</span>}
          </FormSection>
          <FormSection legend="Your billing addresses" hint=" ">
            {currentUser?.addresses
              .filter((e) =>
                e.id ? currentUser.billingAddressIds?.includes(e.id) : null,
              )
              .map((a) => (
                <AddressTag
                  key={a.id}
                  addressData={a}
                  onUnsetAddress={(id: string) => onUnsetAddress('billing', id)}
                />
              )) ?? <span>Not specipied</span>}
          </FormSection>
          <FormSection legend="Your default shipping address" hint=" ">
            {currentUser?.addresses
              .filter((e) =>
                e.id
                  ? currentUser.defaultShippingAddressId?.includes(e.id)
                  : null,
              )
              .map((a) => <AddressTag key={a.id} addressData={a} />) ?? (
              <span>Not specipied</span>
            )}
          </FormSection>
          <FormSection legend="Your default billing address" hint=" ">
            {currentUser?.addresses
              .filter((e) =>
                e.id
                  ? currentUser.defaultBillingAddressId?.includes(e.id)
                  : null,
              )
              .map((a) => <AddressTag key={a.id} addressData={a} />) ?? (
              <span>Not specipied</span>
            )}
          </FormSection>
          <button
            type="button"
            className={s.addAddress}
            onClick={() => setAddressMode('add')}
          >
            <SvgCross />
            <span>Add address</span>
          </button>
        </>
      )}
    </main>
  )
}
