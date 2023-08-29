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
  onNameClick?: () => void
  toFixed?: 2
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
    onNameClick = undefined,
    toFixed = 2,
  } = props

  const cnNoButtonAction = { [s.noHover]: !onNameClick }

  return (
    <div className={cn(s.singleSeller, className)}>
      <img className={s.singleSellerImage} src={imageUrl} alt={imageAlt} />
      <div className={s.singleSellerInfoContainer}>
        <button
          type="button"
          onClick={onNameClick}
          className={cn(s.singleSellerButton, cnNoButtonAction)}
        >
          <h5 className={s.singleSellerName}>{name}</h5>
        </button>
        <div className={s.singleSellerDescription}>{description}</div>
        <div className={s.singleSellerPrice}>
          <span>{price.toFixed(toFixed)}</span> <span>{currency}</span>
        </div>
      </div>
    </div>
  )
}
