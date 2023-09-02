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

export interface Root {
  id: string
  version: number
  versionModifiedAt: string
  lastMessageSequenceNumber: number
  createdAt: string
  lastModifiedAt: string
  lastModifiedBy: LastModifiedBy
  createdBy: CreatedBy
  email: string
  firstName: string
  lastName: string
  password: string
  addresses: Address[]
  shippingAddressIds: string[]
  billingAddressIds: string[]
  isEmailVerified: boolean
  stores: Array<unknown>
  authenticationMode: string
}

export interface LastModifiedBy {
  clientId: string
  isPlatformClient: boolean
}

export interface CreatedBy {
  clientId: string
  isPlatformClient: boolean
}

export interface Address {
  id: string
  streetName: string
  streetNumber: string
  postalCode: string
  city: string
  country: string
}
