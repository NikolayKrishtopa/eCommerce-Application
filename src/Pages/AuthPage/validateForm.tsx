type Values = {
  email: string
  password: string
  firstname?: string
}

export default function validateForm(values: Values) {
  const errors = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    dob: '',
    country_ship: '',
    city_ship: '',
    postal_code_ship: '',
    streetandhouse_ship: '',
    country_bill: '',
    city_bill: '',
    postal_code_bill: '',
    streetandhouse_bill: '',
  }

  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

  const namePattern = /^[a-z ,.'-]+$/i

  if (values.email === '') {
    errors.email = 'Email is required'
  } else if (!emailPattern.test(values.email)) {
    errors.email = 'Invalid email format'
  }

  if (values.password === '') {
    errors.password = 'Password is required'
  } else if (!passwordPattern.test(values.password)) {
    errors.password =
      'Password must have min 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number'
  }

  if (values.firstname === '') {
    errors.firstname = 'First name is required'
  } else if (values.firstname && !namePattern.test(values.firstname)) {
    errors.password =
      'First name can contain only letters, period, aposrophe and hyphen symbols'
  }

  return errors
}
