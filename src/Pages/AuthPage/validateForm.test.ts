import { describe, test, expect } from 'vitest'
import validateForm, { ValidateFormValues } from './validateForm'

const formKeyError = <T extends keyof ValidateFormValues>(
  key: T,
  val: ValidateFormValues[T],
  merge: Partial<ValidateFormValues> = {},
) => {
  const emptyData = {
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
    setasdefaultship: false,
    billingisthesame: false,
    country_bill: '',
    city_bill: '',
    postal_code_bill: '',
    street_bill: '',
    house_bill: '',
    setasdefaultbill: false,
    ...merge,
  }

  const errors = validateForm({ ...emptyData, [key]: val }, '/register')
  return errors[key]
}

describe('Registration form validation', () => {
  const importKeyFuncs = <T extends keyof ValidateFormValues>(
    key: keyof ValidateFormValues,
    merge?: Partial<ValidateFormValues>,
  ) => {
    const getError = (val: ValidateFormValues[T]) =>
      formKeyError(key, val, merge)

    const testValid =
      <K extends ValidateFormValues[T]>(
        messageMaker = (v: K) => `Valid: '${v}'`,
      ) =>
      (v: K) => {
        test(messageMaker(v), () => expect(getError(v)).toBeFalsy())
      }
    const testError =
      <K extends ValidateFormValues[T]>(
        messageMaker = (v: K) => `Error: '${v}'`,
      ) =>
      (v: K) => {
        test(messageMaker(v), () => expect(getError(v)).toBeTruthy())
      }

    return [getError, testValid, testError] as const
  }

  describe('Email validation', () => {
    const [, testValid, testError] = importKeyFuncs('email')

    describe(`Email address must be properly formatted (e.g., user@example.com)`, () => {
      testValid()('email@subdomain.com')
      testValid()('name.surname@subdomain.com')
      testValid()('email@subdomain1.subdomain2.com')
      testValid()('1@2.com')
      testError()('')
      testError()('email@nodot')
      testError()('email@111.222.333.44444')
      testError()('email@@dom.com')
    })
    describe('Email address must not contain leading or trailing whitespace', () => {
      testError()(`${' '}email@subdomain.com`)
      testError()(`email@subdomain.com${' '}`)
      testError()(`${' '}email@subdomain.com${' '}`)
    })
    describe('Email address must contain a domain name (e.g., example.com)', () => {
      testError()('email@subdomain')
      testError()('email@subdomain.123')
      testValid()('email@subdomain.com')
      testValid()('email@subdomain.de')
      testValid()('email@subdomain.fr')
      testValid()('email@subdomain.gb')
    })
    describe(`Email address must contain '@' symbol separating local part and domain name`, () => {
      testError()('email@@subdomain.com')
      testError()('email')
    })
  })

  describe('Password validation', () => {
    const [error, testValid, testError] = importKeyFuncs('password')

    describe('Password must be at least 8 characters long', () => {
      testValid()('123456Aa9')
      testError()('aA345678')
      describe('With special symbol:', () => {
        testValid()('aA0$56789')
      })
    })
    describe('Password must contain at least one uppercase letter (A-Z)', () => {
      testValid()(`${'A'}a0b56789`)
      testError()(`${'a'}a0b56789`)
      describe('With special symbol:', () => {
        testValid()(`${'A'}a0#56789`)
      })
    })
    describe('Password must contain at least one lowercase letter (a-z)', () => {
      testValid()(`${'a'}ABC06789`)
      testError()(`${'A'}ABC06789`)
      describe('With special symbol:', () => {
        testValid()(`${'a'}ABC0#789`)
      })
    })
    describe('Password must contain at least one digit (0-9)', () => {
      testValid()(`${'1'}bAaBbCc`)
      testError()(`${'d'}bAaBbCc`)
      describe('With special symbol:', () => {
        testValid()(`${'1'}bA#BbCc`)
      })
    })
    describe('(Optional) Password must contain at least one special character (e.g., !@#$%^&*)', () => {
      ;['!', '@', '#', '$', '%', '^', '&', '*'].forEach((s) => {
        const names = [`aABbCc89${s}`, `aABb${s}Cc89`, `${s}aABbCc89`]
        test(`Valid: ${names.join(', ')}`, () => {
          names.forEach((v) => expect(error(v)).toBeFalsy())
        })
      })
    })
    describe('Password must not contain leading or trailing whitespace', () => {
      testError()(`${' '}aABbCc`)
      testError()(`aABbCc${' '}`)
      testError()(`${' '}aABbCc${' '}`)
    })
  })

  const Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const Specials = ['$', '#', '&']

  describe('Validate name', () => {
    describe('First name: Must contain at least one character and no special characters or numbers', () => {
      const [error, testValid, testError] = importKeyFuncs('firstname')

      testValid()(`name`)
      testValid()(`Name`)
      testError()(``)
      testError()(`Na Me`)
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Name${n}`, `Na${n}me`, `${n}Name`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach((v) => expect(error(v)).toBeTruthy())
        })
      })
    })

    describe('Last name: Must contain at least one character and no special characters or numbers', () => {
      const [error, testValid, testError] = importKeyFuncs('lastname')

      testValid()(`surname`)
      testValid()(`Surname`)
      testError()(``)
      testError()(`Sur Name`)
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Surname${n}`, `Sur${n}name`, `${n}Surname`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach((v) => expect(error(v)).toBeTruthy())
        })
      })
    })
  })

  describe('Address fields:', () => {
    describe('Street: Must contain at least one character', () => {
      const [, testValid, testError] = importKeyFuncs('street_ship')

      testValid()(`Letsby Avenue, Sheffield`)
      testError()(``)
    })

    describe('City: Must contain at least one character and no special characters or numbers', () => {
      const [error, testValid, testError] = importKeyFuncs('city_ship')

      testValid()(`Liverpool`)
      testValid()(`liverpool`)
      testValid()(`Liver Pool`)
      testError()(``)
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Liverpool${n}`, `Lever${n}pool`, `${n}Liverpool`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach((v) => expect(error(v)).toBeTruthy())
        })
      })
    })

    const COUNTRIES = [
      { code: 'GB', zipCodes: ['SW1W 0NY', 'PO16 7GZ'] },
      { code: 'DE', zipCodes: ['10115', '14199'] },
      { code: 'FR', zipCodes: ['75001', '75020'] },
      { code: 'BE', zipCodes: ['1000', '8000'] },
      { code: 'NL', zipCodes: ['1000 AA', '1799 ZZ'] },
    ]

    describe('Postal code: Must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)', () => {
      COUNTRIES.forEach(({ code, zipCodes }) => {
        const [, testValid] = importKeyFuncs('postal_code_ship', {
          country_ship: code,
        })
        zipCodes.forEach((zip) => {
          testValid()(zip)
        })
      })
    })
  })
})
