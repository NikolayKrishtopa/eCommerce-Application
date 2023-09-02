import { Link } from 'react-router-dom'
import { ReactComponent as SvgCross } from '@/assets/icons/cross.svg'
import TextInput from '@/Components/UIKit/TextInput/TextInput'
import TextInputHidden from '@/Components/UIKit/TextInput/TextInputHidden/TextInputHidden'
import Checkbox from '@/Components/UIKit/Checkbox/Checkbox'
import FormSection from './FormSection/FormSection'
import s from './UserProfile.module.scss'

export default function UserProfile() {
  return (
    <main className={s.main}>
      <div className={s.introSection}>
        {/* Profile */}
        <FormSection
          legend="Account"
          hint="You can change your personal information here"
        >
          <div className={s.inputsRow}>
            <TextInput label="First name" placeholder="Samantha" />
            <TextInput label="Last name" placeholder="Smith" />
          </div>
          <TextInput
            type="email"
            label="Email"
            placeholder="samantha.smith@gmail.com"
          />
          <TextInput label="Date of birth" placeholder="11/20/1980" />
          <button type="submit" className={s.button}>
            Update profile
          </button>
        </FormSection>
      </div>
      {/* Password */}
      <FormSection
        legend="Password"
        hint="Your password must contain minimum 8 characters"
      >
        <TextInputHidden label="Current password" />
        <TextInputHidden label="New Password" />
        <div className={s.inputWith}>
          <TextInputHidden label="Repeat password" errorJump />
          <Link to="/no-route" className={s.link}>
            Do not remember the password?
          </Link>
        </div>
        <button type="submit" className={s.button}>
          Change password
        </button>
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
