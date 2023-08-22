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
})
