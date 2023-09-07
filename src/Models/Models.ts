export interface UserLoginPayloadType {
  email: string
  password: string
}

export interface UserUpdatePayloadType {
  firstName: string
  email: string
  lastName: string
  dateOfBirth: string
}

export interface UserRegisterPayloadType
  extends UserLoginPayloadType,
    UserUpdatePayloadType {
  firstName: string
  lastName: string
  dateOfBirth: string
  street: string
  bldng: string
  zipCode: string
  city: string
  country: string
  isBillingAddressSame: boolean
  setDefaultShipAddress: boolean
  setDefaultBillingAddress: boolean
  billingStreet: string
  billingBldng: string
  billingZipCode: string
  billingCountry: string
  billingCity: string
}

export interface UserLoggedIn {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface ProductQueryParams {
  limit?: number
  offset?: number
  filter?: string[]
  sort?: string[]
  categoryId?: string
  searchText?: string
}
