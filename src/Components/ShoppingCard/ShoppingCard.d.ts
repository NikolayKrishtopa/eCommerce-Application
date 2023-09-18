type ShoppingCardProps = {
  className?: string
  name: string
  description: string
  imageUrl: string
  imageAlt: string
  price: number
  currency: string
  discountPrice?: number
  onNameClick?: () => void
  toFixed?: number
  intlLocale?: string
  productId: string
}

export default ShoppingCardProps
