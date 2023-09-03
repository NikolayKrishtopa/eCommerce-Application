import { UserUpdatePayloadType } from '@/Models/Models'
import { Address } from '@commercetools/platform-sdk'

export default interface UserProfileProps {
  onUserUpdate: (userData: UserUpdatePayloadType) => void
  onPasswordChange: (newPassword: string, currentPassword: string) => void
  onAddAddress: (
    address: Address,
    setDefaultShippingAddress: boolean,
    setDefaultBillingAddress: boolean,
  ) => void
  onEditAddress: (addressId: string, address: Address) => void
  onRemoveAddress: (id: string) => void
  onSetAddress: (addressType: 'shipping' | 'billing', addressId: string) => void
  onUnsetAddress: (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => void
  onSetDefaultAddress: (
    addressType: 'shipping' | 'billing',
    addressId: string,
  ) => void
}
