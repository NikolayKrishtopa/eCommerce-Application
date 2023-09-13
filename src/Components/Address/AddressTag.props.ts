import { Address } from '@commercetools/platform-sdk'

export interface AddressTagProps {
  addressData: Address
  onEdit?: (addressData: Address) => void
  onRemove?: (id: string) => void
  onSetAddress?: (type: 'shipping' | 'billing', id: string) => void
  onUnsetAddress?: (id: string) => void
  onSetDefaultAddress?: (type: 'shipping' | 'billing', id: string) => void
}
