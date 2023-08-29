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

export default ShoppingCardProps
