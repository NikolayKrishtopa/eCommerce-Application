type Values = {
  email: string
  password: string
  firstname: string
  lastname: string
  dob: string
  country_ship: string
  city_ship: string
  postal_code_ship: string
  street_ship: string
  house_ship: string
  setasdefaultship: boolean
  billingisthesame: boolean
  country_bill: string
  city_bill: string
  postal_code_bill: string
  street_bill: string
  house_bill: string
  setasdefaultbill: boolean
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
    street_ship: '',
    house_ship: '',
    country_bill: '',
    city_bill: '',
    postal_code_bill: '',
    street_bill: '',
    house_bill: '',
  }

  const emailPattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/

  const namePattern = /^[a-z ,.'-]+$/i

  const allowedAge = 14

  const cityPattern = /^[a-z ,.-]+$/i

  const zipPatternGB =
    /^([G][I][R] 0[A]{2})|((([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2})$/i
  const zipPatternDeFr = /^\d{5}$/
  const zipPatternBe = /^\d{4}$/
  const zipPatternNl = /^(?:NL-)?(\d{4})\s*([A-Z]{2})$/i

  const streetPattern = /(.*[a-z]){3}/i

  const checkDob = (dob: string) => {
    const now = new Date()
    const birthDate = new Date(
      Number(dob.slice(0, 4)),
      Number(dob.slice(5, 7)) - 1,
      Number(dob.slice(8, 10)),
    )
    const diff = new Date(Number(now) - Number(birthDate)).getFullYear() - 1970
    return diff >= allowedAge
  }

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
    errors.firstname =
      'Name can contain only letters, period, aposrophe and hyphen symbols'
  }

  if (values.lastname === '') {
    errors.lastname = 'First name is required'
  } else if (values.lastname && !namePattern.test(values.lastname)) {
    errors.lastname =
      'Name can contain only letters, period, aposrophe and hyphen symbols'
  }

  if (values.dob === '') {
    errors.dob = 'Birth date is required'
  } else if (values.dob && !checkDob(values.dob)) {
    errors.dob = `Your age must be over ${allowedAge} years`
  }

  if (values.country_ship === '') {
    errors.country_ship = 'Shipping country is required'
  }

  if (values.city_ship === '') {
    errors.city_ship = 'Shipping city is required'
  } else if (values.city_ship && !cityPattern.test(values.city_ship)) {
    errors.city_ship =
      'City name can contain only letters, period, and hyphen symbols'
  }

  const zipCheck = (zip: string) => {
    let errorMsg = ''

    if (zip === '') {
      errorMsg = 'Postal code is required'
    } else if (!values.country_ship) {
      errorMsg = 'Select the country first'
    } else if (values.country_ship === 'GB' && zip && !zipPatternGB.test(zip)) {
      errorMsg = 'Postal code format must be AAA 9AA or AA99 9AA or AA9 9AA'
    } else if (
      (values.country_ship === 'DE' || values.country_ship === 'FR') &&
      zip &&
      !zipPatternDeFr.test(zip)
    ) {
      errorMsg = 'Postal code format must be 99999'
    } else if (values.country_ship === 'BE' && zip && !zipPatternBe.test(zip)) {
      errorMsg = 'Postal code format must be 9999'
    } else if (values.country_ship === 'NL' && zip && !zipPatternNl.test(zip)) {
      errorMsg = 'Postal code format must be 9999 AA or 9999AA'
    }
    return errorMsg
  }

  if (values.postal_code_ship !== undefined)
    errors.postal_code_ship = zipCheck(values.postal_code_ship)

  if (values.street_ship === '') {
    errors.street_ship = 'Street is required'
  } else if (values.street_ship && !streetPattern.test(values.street_ship)) {
    errors.street_ship = 'Street name must contain at least 3 letters'
  }

  if (!values.billingisthesame) {
    if (values.country_bill === '') {
      errors.country_bill = 'Country is required'
    }

    if (values.city_bill === '') {
      errors.city_bill = 'City is required'
    } else if (values.city_bill && !cityPattern.test(values.city_bill)) {
      errors.city_bill =
        'City name can contain only letters, period, and hyphen symbols'
    }

    if (values.postal_code_bill !== undefined)
      errors.postal_code_bill = zipCheck(values.postal_code_bill)

    if (values.street_bill === '') {
      errors.street_bill = 'Street is required'
    } else if (values.street_bill && !streetPattern.test(values.street_bill)) {
      errors.street_bill = 'Street name must contain at least 3 letters'
    }
  }

  return errors
}
