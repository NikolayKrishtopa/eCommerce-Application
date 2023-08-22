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
  type TestValid = <T>(v: T, clb: (arg: T) => unknown) => void

  const testValid: TestValid = (value, callback) => {
    test(`Valid: '${value}'`, () => callback(value))
  }
  const testError: TestValid = (value, callback) => {
    test(`Error: '${value}'`, () => callback(value))
  }
  const expectFormErrorMaker =
    <T extends keyof ValidateFormValues>(
      key: T,
      merge?: Partial<ValidateFormValues>,
    ) =>
    (isErr: boolean) =>
    (val: ValidateFormValues[T]) =>
      expect(Boolean(formKeyError(key, val, merge))).toBe(isErr)

  describe('Email validation', () => {
    const expectError = expectFormErrorMaker('email')

    const truthy = {
      default: 'email@subdomain.com',
      twoNames: 'name.surname@subdomain.com',
      twoDomains: 'email@subdomain1.subdomain2.com',
      numbers: '1@2.com',
    }

    const falsy = {
      empty: '',
      noDot: 'email@nodot',
      wrongTolLevelDomain: 'email@111.222.333.44444',
      twoAtSyms: 'email@@dom.com',
    }

    describe(`Email address must be properly formatted (e.g., user@example.com)`, () => {
      Object.values(truthy).forEach((email) => {
        testValid(email, expectError(false))
      })

      Object.values(falsy).forEach((email) => {
        testError(email, expectError(true))
      })
    })

    describe('Email address must not contain leading or trailing whitespace', () => {
      testError(`${' '}email@subdomain.com`, expectError(true))
      testError(`email@subdomain.com${' '}`, expectError(true))
      testError(`${' '}email@subdomain.com${' '}`, expectError(true))
    })
    describe('Email address must contain a domain name (e.g., example.com)', () => {
      testError('email@subdomain', expectError(true))
      testError('email@subdomain.123', expectError(true))
      testValid('email@subdomain.com', expectError(false))
      testValid('email@subdomain.de', expectError(false))
      testValid('email@subdomain.fr', expectError(false))
      testValid('email@subdomain.gb', expectError(false))
    })
    describe(`Email address must contain '@' symbol separating local part and domain name`, () => {
      testError('email@@subdomain.com', expectError(true))
      testError('email', expectError(true))
    })
  })

  describe('Password validation', () => {
    const expectError = expectFormErrorMaker('password')

    describe('Password must be at least 8 characters long', () => {
      testValid('123456Aa9', expectError(false))
      testError('aA0#5678', expectError(true))
      describe('With special symbol:', () => {
        testValid('aA0$56789', expectError(false))
      })
    })
    describe('Password must contain at least one uppercase letter (A-Z)', () => {
      testValid(`${'A'}a0b56789`, expectError(false))
      testError(`${'a'}a0b56789`, expectError(true))
      describe('With special symbol:', () => {
        testValid(`${'A'}a0#56789`, expectError(false))
      })
    })
    describe('Password must contain at least one lowercase letter (a-z)', () => {
      testValid(`${'a'}ABC06789`, expectError(false))
      testError(`${'A'}ABC06789`, expectError(true))
      describe('With special symbol:', () => {
        testValid(`${'a'}ABC0#789`, expectError(false))
      })
    })
    describe('Password must contain at least one digit (0-9)', () => {
      testValid(`${'1'}bAaBbCc`, expectError(false))
      testError(`${'d'}bAaBbCc`, expectError(true))
      describe('With special symbol:', () => {
        testValid(`${'1'}bA#BbCc`, expectError(false))
      })
    })
    describe('(Optional) Password must contain at least one special character (e.g., !@#$%^&*)', () => {
      testValid(`${'!'}aABbCc89`, expectError(false))
      testValid(`${'@'}aABbCc89`, expectError(false))
      testValid(`${'#'}aABbCc89`, expectError(false))
      testValid(`${'$'}aABbCc89`, expectError(false))
      testValid(`${'%'}aABbCc89`, expectError(false))
      testValid(`${'^'}aABbCc89`, expectError(false))
      testValid(`${'&'}aABbCc89`, expectError(false))
      testValid(`${'*'}aABbCc89`, expectError(false))
      testValid(`${')'}aABbCc89`, expectError(false))
      testError(`${'d'}aABbCc89`, expectError(true))
    })
    describe('Password must not contain leading or trailing whitespace', () => {
      testError(`${' '}aABbCc`, expectError(true))
      testError(`aABbCc${' '}`, expectError(true))
      testError(`${' '}aABbCc${' '}`, expectError(true))
    })
  })

  const Numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8]
  const Specials = ['$', '#', '&']

  describe('Validate name', () => {
    describe('First name: Must contain at least one character and no special characters or numbers', () => {
      const expectError = expectFormErrorMaker('firstname')

      testValid(`name`, expectError(false))
      testValid(`Name`, expectError(false))
      testError(``, expectError(true))
      testError(`Na Me`, expectError(true))
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Name${n}`, `Na${n}me`, `${n}Name`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach(expectError(true))
        })
      })
    })

    describe('Last name: Must contain at least one character and no special characters or numbers', () => {
      const expectError = expectFormErrorMaker('lastname')

      testValid(`surname`, expectError(false))
      testValid(`Surname`, expectError(false))
      testError(``, expectError(true))
      testError(`Sur Name`, expectError(true))
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Surname${n}`, `Sur${n}name`, `${n}Surname`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach(expectError(true))
        })
      })
    })
  })

  describe('Address fields:', () => {
    describe('Street: Must contain at least one character', () => {
      const expectError = expectFormErrorMaker('street_ship')

      testValid(`Letsby Avenue, Sheffield`, expectError(false))
      testError(``, expectError(true))
    })

    describe('City: Must contain at least one character and no special characters or numbers', () => {
      const expectError = expectFormErrorMaker('city_ship')

      testValid(`Liverpool`, expectError(false))
      testValid(`liverpool`, expectError(false))
      testValid(`Liver Pool`, expectError(false))
      testError(``, expectError(true))
      ;[...Numbers, ...Specials].forEach((n) => {
        const names = [`Liverpool${n}`, `Lever${n}pool`, `${n}Liverpool`]
        test(`Error: ${names.join(', ')}`, () => {
          names.forEach(expectError(true))
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
        const expectError = expectFormErrorMaker('postal_code_ship', {
          country_ship: code,
        })
        zipCodes.forEach((zip) => {
          testValid(zip, expectError(false))
        })
      })
    })
  })
})
