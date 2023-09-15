import s from './AddressTag.module.scss'
import { AddressTagProps } from './AddressTag.props'

export default function AddressTag(props: AddressTagProps) {
  const {
    addressData,
    onEdit,
    onRemove,
    onSetAddress,
    onSetDefaultAddress,
    onUnsetAddress,
  } = props

  const editAddress = () => {
    if (!onEdit || !addressData.id) return
    onEdit(addressData)
  }
  const removeAddress = () => {
    if (!onRemove || !addressData.id) return
    onRemove(addressData.id)
  }
  const SetDefaultBillingAddress = () => {
    if (!onSetDefaultAddress || !addressData.id) return
    onSetDefaultAddress('billing', addressData.id)
  }
  const SetDefaultShippingAddress = () => {
    if (!onSetDefaultAddress || !addressData.id) return
    onSetDefaultAddress('shipping', addressData.id)
  }

  const addToShipping = () => {
    if (!onSetAddress || !addressData.id) return
    onSetAddress('shipping', addressData.id)
  }
  const addToBilling = () => {
    if (!onSetAddress || !addressData.id) return
    onSetAddress('billing', addressData.id)
  }
  return (
    <div className={s.address}>
      <p className={s.addressText}>
        {[
          addressData.streetNumber,
          addressData.streetName,
          addressData.city,
          addressData.country,
          addressData.postalCode,
        ].join(', ')}
      </p>
      <div className={s.btnWrapper}>
        {onEdit && (
          <button type="button" className={s.button} onClick={editAddress}>
            Edit
          </button>
        )}
        {onRemove && (
          <button type="button" className={s.button} onClick={removeAddress}>
            Remove
          </button>
        )}
        {onSetAddress && (
          <>
            <button type="button" className={s.button} onClick={addToShipping}>
              Add to shipping
            </button>
            <button type="button" className={s.button} onClick={addToBilling}>
              Add to billing
            </button>
          </>
        )}
        {onSetDefaultAddress && (
          <>
            <button
              type="button"
              className={s.button}
              onClick={SetDefaultShippingAddress}
            >
              Set as default shipping
            </button>
            <button
              type="button"
              className={s.button}
              onClick={SetDefaultBillingAddress}
            >
              Set as default billing
            </button>
          </>
        )}
        {onUnsetAddress && (
          <button
            type="button"
            className={s.button}
            onClick={() => {
              if (!addressData.id) return
              onUnsetAddress(addressData.id)
            }}
          >
            Unset
          </button>
        )}
      </div>
    </div>
  )
}
