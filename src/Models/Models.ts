export interface UserLoginPayloadType {
  email: string
  password: string
}

export interface UserRegisterPayloadType extends UserLoginPayloadType {
  firstName: string
  lastName: string
}
