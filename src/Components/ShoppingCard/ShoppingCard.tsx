import cn from 'classnames'
import s from './ShoppingCard.module.scss'

type ShoppingCardProps = {
  className?: string
  name: string
  description: string
  imageUrl: string
  imageAlt: string
  price: number
  currency: string
  discountRate?: number
  onNameClick?: () => void
  toFixed?: 2
  intlLocale?: string
}

export default function ShoppingCard(props: ShoppingCardProps) {
  const {
    className = '',
    name,
    description,
    price,
    currency,
    imageUrl,
    imageAlt,
    discountRate = undefined,
    onNameClick = undefined,
    toFixed = 2,
    intlLocale = 'de-DE',
  } = props

  const isDiscount = typeof discountRate === 'number'

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currencyDisplay: 'code',
      currency,
      maximumFractionDigits: toFixed,
    }).format(p)

  const originalPrice = formatPrice(price)
  const discountPrice = formatPrice(price * (1 - (discountRate as number)))

  const PriceJSX = isDiscount ? (
    <>
      <s>{originalPrice}</s>
      <span className={s.singleSellerDiscountPrice}>{discountPrice}</span>
    </>
  ) : (
    <span>{originalPrice}</span>
  )

  return (
    <div className={cn(s.singleSeller, className)}>
      {isDiscount && (
        <span className={s.singleSellerDiscount}>
          -{Math.floor(discountRate * 100)}%
        </span>
      )}
      <img className={s.singleSellerImage} src={imageUrl} alt={imageAlt} />
      <div className={s.singleSellerInfoContainer}>
        <button
          type="button"
          onClick={onNameClick}
          className={cn(s.singleSellerButton, { [s.noHover]: !onNameClick })}
        >
          <h5 className={s.singleSellerName}>{name}</h5>
        </button>
        <div className={s.singleSellerDescription}>{description}</div>
        <div className={s.singleSellerPrice}>{PriceJSX}</div>
      </div>
    </div>
  )
}
