// import useCart from '@/hooks/useCart'
import { Cart } from '@commercetools/platform-sdk'
import CartProductCard from '@/Components/CartProductCard/CartProductCard'
import { ReactComponent as SvgCheckout } from '@/assets/icons/arrow-right.svg'
import { ReactComponent as SvgDiscount } from '@/assets/icons/discount.svg'
import s from './CartPage.module.scss'

const mockCart: Cart = {
  type: 'Cart',
  id: '3a506597-5329-4dbe-b740-056eb5091833',
  version: 12,
  versionModifiedAt: '2023-09-13T23:06:31.067Z',
  lastMessageSequenceNumber: 1,
  createdAt: '2023-09-13T22:31:48.790Z',
  lastModifiedAt: '2023-09-13T23:06:31.067Z',
  lastModifiedBy: {
    clientId: 'Djy17nsDyJD_qmn2ZaOtBdD_',
    isPlatformClient: false,
  },
  createdBy: {
    clientId: 'Djy17nsDyJD_qmn2ZaOtBdD_',
    isPlatformClient: false,
  },
  lineItems: [
    {
      id: 'ea9707c4-b2c3-47a3-ac25-d67679e9482a',
      productId: '7d0af266-f204-4026-b627-bdbfacc6cdb7',
      name: {
        en: 'BIRDHOUSE Stage 3 Plague Doctor 8" Complete-Board',
      },
      productType: {
        typeId: 'product-type',
        id: '7e8c2453-f80c-4b8f-b90e-7dc95a1c3e58',
        version: 57,
      },
      productSlug: {
        en: 'birdhouse-stage-3-plague-doctor-8-complete-board',
      },
      variant: {
        id: 1,
        sku: '142098',
        key: '142098',
        prices: [
          {
            id: '14252fed-1b97-4d7a-b824-f1ce3459f05f',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 9999,
              fractionDigits: 2,
            },
          },
        ],
        images: [
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/142098-0.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/142098-1.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
        ],
        attributes: [
          {
            name: 'skateboard-length',
            value: 31.5,
          },
          {
            name: 'skateboard-width',
            value: 8,
          },
          {
            name: 'skateboard-wheelbase',
            value: 14,
          },
          {
            name: 'skateboard-concave',
            value: {
              key: 'medium',
              label: 'medium',
            },
          },
          {
            name: 'skateboard-brand',
            value: {
              key: 'birdhouse',
              label: 'Birdhouse',
            },
          },
        ],
        assets: [],
      },
      price: {
        id: '14252fed-1b97-4d7a-b824-f1ce3459f05f',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 9999,
          fractionDigits: 2,
        },
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: '2023-09-13T22:57:48.283Z',
      lastModifiedAt: '2023-09-13T22:57:48.283Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '37fb2328-0ad7-47c8-8b37-fbbc155d0095',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 9999,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
    },
    {
      id: '55bccb56-6ac6-4c0b-8f1c-68a6e9163be8',
      productId: '96e3f6b2-67f8-4c54-bae7-cccf9ee2c0e3',
      name: {
        en: 'ANTIX Repitat Conical Wheels 54mm 100A 4 Pack',
      },
      productType: {
        typeId: 'product-type',
        id: '0ac83fe6-67f6-4ead-be12-7b72ea625ec5',
        version: 31,
      },
      productSlug: {
        en: 'antix-repitat-conical-wheels-54mm-100a-4-pack',
      },
      variant: {
        id: 1,
        sku: '155510',
        key: '155510',
        prices: [
          {
            id: '98819456-e260-47fb-bfc2-095f0770bf3d',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 3999,
              fractionDigits: 2,
            },
          },
        ],
        images: [
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/155510-0.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/155510-1.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/155510-2.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
        ],
        attributes: [
          {
            name: 'wheel-brand',
            value: {
              key: 'antix',
              label: 'Antix',
            },
          },
          {
            name: 'wheel-diameter',
            value: {
              key: '54',
              label: '54 mm',
            },
          },
          {
            name: 'wheel-width',
            value: 34.5,
          },
          {
            name: 'wheel-shape',
            value: {
              key: 'conical',
              label: 'conical',
            },
          },
          {
            name: 'wheel-durometer',
            value: {
              key: '100A',
              label: '100A',
            },
          },
        ],
        assets: [],
      },
      price: {
        id: '98819456-e260-47fb-bfc2-095f0770bf3d',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 3999,
          fractionDigits: 2,
        },
      },
      quantity: 3,
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: '2023-09-13T23:04:11.769Z',
      lastModifiedAt: '2023-09-13T23:04:11.769Z',
      state: [
        {
          quantity: 3,
          state: {
            typeId: 'state',
            id: '37fb2328-0ad7-47c8-8b37-fbbc155d0095',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 11997,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
    },
    {
      id: '97c0b7e5-9246-4f20-b06d-8188e9dc357c',
      productId: '613a7cb4-8e85-4e0e-932d-55e68be32618',
      name: {
        en: 'ALMOST Max Cars Impact Pro Light 8.25" Skateboard Deck ',
      },
      productType: {
        typeId: 'product-type',
        id: 'd09d3b4e-4359-48b9-85a0-49e4fda4cd76',
        version: 29,
      },
      productSlug: {
        en: 'almost-max-cars-impact-pro-light-825in-skateboard-deck',
      },
      variant: {
        id: 1,
        sku: '161891',
        key: '161891',
        prices: [
          {
            id: '88ba891a-e915-41f0-8d7f-c370add47bcd',
            value: {
              type: 'centPrecision',
              currencyCode: 'EUR',
              centAmount: 7499,
              fractionDigits: 2,
            },
          },
        ],
        images: [
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/161891-0.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/161891-1.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
          {
            url: 'https://raw.githubusercontent.com/Ivan-Gav/pics-for-ecom/main/161891-2.jpeg',
            label: '',
            dimensions: {
              w: 900,
              h: 1049,
            },
          },
        ],
        attributes: [
          {
            name: 'deck-brand',
            value: {
              key: 'almost',
              label: 'Almost',
            },
          },
          {
            name: 'deck-length',
            value: 31.625,
          },
          {
            name: 'deck-width',
            value: 8.25,
          },
          {
            name: 'deck-wheelbase',
            value: 14.25,
          },
          {
            name: 'deck-concave',
            value: {
              key: 'low',
              label: 'low',
            },
          },
          {
            name: 'deck-shape',
            value: {
              key: 'popsicle',
              label: 'Standard Popsicle',
            },
          },
        ],
        assets: [],
      },
      price: {
        id: '88ba891a-e915-41f0-8d7f-c370add47bcd',
        value: {
          type: 'centPrecision',
          currencyCode: 'EUR',
          centAmount: 7499,
          fractionDigits: 2,
        },
      },
      quantity: 1,
      discountedPricePerQuantity: [],
      perMethodTaxRate: [],
      addedAt: '2023-09-13T23:06:31.052Z',
      lastModifiedAt: '2023-09-13T23:06:31.052Z',
      state: [
        {
          quantity: 1,
          state: {
            typeId: 'state',
            id: '37fb2328-0ad7-47c8-8b37-fbbc155d0095',
          },
        },
      ],
      priceMode: 'Platform',
      lineItemMode: 'Standard',
      totalPrice: {
        type: 'centPrecision',
        currencyCode: 'EUR',
        centAmount: 7499,
        fractionDigits: 2,
      },
      taxedPricePortions: [],
    },
  ],
  cartState: 'Active',
  totalPrice: {
    type: 'centPrecision',
    currencyCode: 'EUR',
    centAmount: 29495,
    fractionDigits: 2,
  },
  shippingMode: 'Single',
  shipping: [],
  customLineItems: [],
  discountCodes: [],
  directDiscounts: [],
  inventoryMode: 'None',
  taxMode: 'Platform',
  taxRoundingMode: 'HalfEven',
  taxCalculationMode: 'LineItemLevel',
  deleteDaysAfterLastModification: 90,
  refusedGifts: [],
  origin: 'Customer',
  itemShippingAddresses: [
    {
      title: 'My Address',
      salutation: 'Mr.',
      firstName: 'Example',
      lastName: 'Person',
      streetName: 'Example Street',
      streetNumber: '4711',
      additionalStreetInfo: 'Backhouse',
      postalCode: '80933',
      city: 'Exemplary City',
      region: 'Exemplary Region',
      state: 'Exemplary State',
      country: 'DE',
      company: 'My Company Name',
      department: 'Sales',
      building: 'Hightower 1',
      apartment: '247',
      pOBox: '2471',
      phone: '+49 89 12345678',
      mobile: '+49 171 2345678',
      email: 'email@example.com',
      fax: '+49 89 12345679',
      additionalAddressInfo: 'no additional Info',
      externalId: 'Information not needed',
      key: 'exampleKey',
    },
  ],
  totalLineItemQuantity: 5,
}

export default function CartPage() {
  return (
    <section className={s.cart}>
      <h2 className={s.cartHeader}>Shopping Cart</h2>
      <p>Clear shopping cart</p>
      <div className={s.cartWrapper}>
        <div className={s.cartProducts}>
          {mockCart.lineItems.map((item) => (
            <div key={crypto.randomUUID()}>
              <CartProductCard item={item} />
            </div>
          ))}
        </div>
        <div className={s.cartSummaryContainer}>
          <div className={s.summary}>
            <h3 className={s.summaryHeader}>Order summary</h3>
            <div className={s.summaryLine}>
              <span>Total:</span>
              <span>EUR {Number(mockCart.totalPrice.centAmount) / 100}</span>
            </div>
            <button type="button" className={s.checkoutBtn}>
              <div>Checkout</div>
              <SvgCheckout />
            </button>
          </div>
          <div className={s.promoContainer}>
            <div className={s.promoHeader}>
              <SvgDiscount />
              <div>Use a promo code</div>
            </div>
            <div className={s.promoInputContainer}>
              <input
                className={s.promoInput}
                type="text"
                placeholder="Enter promo code"
              />
              <button className={s.promoSubmit} type="submit">
                APPLY
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
