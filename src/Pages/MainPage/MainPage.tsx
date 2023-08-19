import { Link } from 'react-router-dom'
import heroImage from '@/assets/img/hero-skater.jpg'
import vansImage from '@/assets/img/partners/vans.png'
import nikeImage from '@/assets/img/partners/nike.png'
import santaCruzImage from '@/assets/img/partners/santacruz.png'
import adidasImage from '@/assets/img/partners/adidas.png'
import patagoniaImage from '@/assets/img/partners/patagonia.png'
import skateboardImage from '@/assets/img/categories/skateboards.jpg'
import decksImage from '@/assets/img/categories/decks.jpg'
import wheelsImage from '@/assets/img/categories/wheels.jpg'
import newInImage from '@/assets/img/trending/new-in.jpg'
import latestImage from '@/assets/img/trending/latest.jpg'
import m from './styles/MainPage.module.scss'
import h from './styles/Hero.module.scss'
import c from './styles/Category.module.scss'
import t from './styles/Trending.module.scss'
import s from './styles/Sellers.module.scss'

const partnerImages = {
  [vansImage]: 'vans',
  [nikeImage]: 'nike',
  [santaCruzImage]: 'santaCruz',
  [adidasImage]: 'adidas',
  [patagoniaImage]: 'patagonia',
}

const categoriesData = [
  { name: 'Full skateboards', image: skateboardImage, link: '/no-route' },
  { name: 'Decks', image: decksImage, link: '/no-route' },
  { name: 'Wheels', image: wheelsImage, link: '/no-route' },
]

const trendingData = [
  {
    name: 'New in',
    description: 'Apparel from Carhartt',
    image: newInImage,
    link: '/no-route',
  },
  {
    name: 'Latest',
    description: 'Chocolate skateboards',
    image: latestImage,
    link: '/no-route',
  },
]

const sellersData = Object.values(
  import.meta.glob('@/assets/img/sellers/*', { eager: true, as: 'url' }),
)
  .map((o) => [o, o])
  .flat()
  .map((src, id) => ({
    id,
    name: 'POLAR',
    image: src,
    description:
      'Polar Herrington Chain smoker 2.0 wheel well 8.5” Skateboard deck (white)',
    price: '69,99',
    currency: 'EUR',
  }))

export default function MainPage() {
  return (
    <main className={m.main}>
      {/* Hero */}
      <div className={h.container}>
        <div className={h.hero}>
          <div className={h.background}>
            <div className={h.mask} />
            <img
              className={h.image}
              draggable={false}
              src={heroImage}
              alt="boy doing a skate trick"
            />
          </div>
          <div className={h.content}>
            <h1 className={h.heading}>
              Skateboards and <br /> Streetwear
            </h1>
            <Link to="/no-route" className={h.button}>
              Shop now
            </Link>
          </div>
        </div>
        <div className={h.partnersContainer}>
          <div className={h.partners}>
            {Object.entries(partnerImages).map(([imgSrc, brand]) => (
              <img
                className={h.singlePartner}
                key={imgSrc}
                src={imgSrc}
                alt={`brand ${brand} logo`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className={c.container}>
        <h2 className={c.heading}>Shop by category</h2>
        <div className={c.categories}>
          {categoriesData.map(({ name, image, link }) => (
            <Link to={link} key={name} className={c.singleCategory}>
              <h3 className={c.singleCategoryName}>{name}</h3>
              <img className={c.singleCategoryImage} src={image} alt={name} />
            </Link>
          ))}
        </div>
        <Link to="/no-route" className={c.button}>
          Shop
        </Link>
      </div>
      {/* Trending */}
      <div className={t.container}>
        <h2 className={t.heading}>Shop trending</h2>
        <div className={t.trends}>
          {trendingData.map(({ name, description, image, link }) => (
            <div key={name} className={t.singleTrend}>
              <div key={name} className={t.singleTrendInfoContainer}>
                <h3 className={t.singleTrendName}>{name}</h3>
                <h4 className={t.singleTrendDescription}>{description}</h4>
                <Link to={link} className={t.singleTrendButton}>
                  Shop brand
                </Link>
              </div>
              <img className={t.singleTrendImage} src={image} alt={name} />
            </div>
          ))}
        </div>
      </div>
      {/* Top sellers */}
      <div className={s.container}>
        <h2 className={s.heading}>Our top sellers</h2>
        <div className={s.sellers}>
          {sellersData.map(
            ({ id, name, description, image, price, currency }) => (
              <Link to="/no-route" key={id} className={s.singleSeller}>
                <img className={s.singleSellerImage} src={image} alt="" />
                <div className={s.singleSellerInfoContainer}>
                  <div className={s.singleSellerName}>{name}</div>
                  <div className={s.singleSellerDescription}>{description}</div>
                  <div className={s.singleSellerPrice}>
                    <span>{price}</span> <span>{currency}</span>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </main>
  )
}
