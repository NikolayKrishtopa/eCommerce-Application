import { useState, useCallback, ChangeEvent } from 'react'
import validateForm from './validateForm'

const initialValues = {
  email: '',
  password: '',
}

const initialErrors = {
  email: '',
  password: '',
}

export default function useFormHandlers() {
  const [errors, setErrors] = useState(initialErrors)
  const [values, setValues] = useState(initialValues)
  const [isValid, setIsValid] = useState(false)

  const handleChange = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement
    const { name, value } = target
    setValues({ ...values, [name]: value })
    setErrors(validateForm(values))
    console.log(value)
    console.log(values)
    console.log(errors)
    setIsValid(!Object.values(errors).some((err) => err !== ''))
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
