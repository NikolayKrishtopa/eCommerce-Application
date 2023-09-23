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

export enum PortfolioLinkType {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  FRAMER = 'framer',
}

export interface TeamMember {
  NAME: string
  ROLE: string
  SKILLS: Array<{ id: number; text: string }>
  PICTURE?: string
  PORTFOLIO: {
    LINK: string
    TYPE: PortfolioLinkType
  }
}
