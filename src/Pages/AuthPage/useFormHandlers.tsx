import { useState, useCallback, ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'
import validateForm from './validateForm'

const initialValues = {
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  dob: '',
  country_ship: '',
  city_ship: '',
  postal_code_ship: '',
  street_ship: '',
  house_ship: '',
  setasdefaultship: true,
  billingisthesame: true,
  country_bill: '',
  city_bill: '',
  postal_code_bill: '',
  street_bill: '',
  house_bill: '',
  setasdefaultbill: true,
}

const initialErrors = {
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  dob: '',
  country_ship: '',
  city_ship: '',
  postal_code_ship: '',
  street_ship: '',
  house_ship: '',
  country_bill: '',
  city_bill: '',
  postal_code_bill: '',
  street_bill: '',
  house_bill: '',
}

export default function useFormHandlers() {
  const [errors, setErrors] = useState(initialErrors)
  const [values, setValues] = useState(initialValues)
  const [isValid, setIsValid] = useState(false)

  const location = useLocation()

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    const { name, value, checked, type } = target
    if (type === 'checkbox') {
      setValues({ ...values, [name]: checked })
    } else {
      setValues({ ...values, [name]: value })
    }

    const currentErrors = validateForm(
      { ...values, [name]: value },
      location.pathname,
    )
    setErrors(currentErrors)
    setIsValid(!Object.values(currentErrors).some((err) => err !== ''))
  }

  const resetForm = useCallback(
    (
      newValues = initialValues,
      newErrors = initialErrors,
      newIsValid = false,
    ) => {
      setValues(newValues)
      setErrors(newErrors)
      setIsValid(newIsValid)
    },
    [setValues, setErrors, setIsValid],
  )

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
  }
}
