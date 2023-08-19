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
  {
    id: 1,
    name: 'Full skateboards',
    image: skateboardImage,
    link: '/no-route',
  },
  {
    id: 2,
    name: 'Decks',
    image: decksImage,
    link: '/no-route',
  },
  {
    id: 3,
    name: 'Wheels',
    image: wheelsImage,
    link: '/no-route',
  },
]

const trendingData = [
  {
    id: 1,
    name: 'New in',
    description: 'Apparel from Carhartt',
    image: newInImage,
    link: '/no-route',
  },
  {
    id: 2,
    name: 'Latest',
    description: 'Chocolate skateboards',
    image: latestImage,
    link: '/no-route',
  },
]

const sellersData = Object.values(
  import.meta.glob('@/assets/img/sellers/*', { eager: true, as: 'url' }),
).map((src, index) => ({
  id: index,
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
      <section className={h.container}>
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
      </section>
      {/* Categories */}
      <section className={c.container}>
        <h2 className={c.heading}>Shop by category</h2>
        <ul className={c.categories}>
          {categoriesData.map(({ id, name, image, link }) => (
            <li key={id} className={c.singleCategory}>
              <Link to={link} className={c.singleCategoryLinkWrapper}>
                <h3 className={c.singleCategoryName}>{name}</h3>
                <img className={c.singleCategoryImage} src={image} alt={name} />
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/no-route" className={c.button}>
          Shop
        </Link>
      </section>
      {/* Trending */}
      <section className={t.container}>
        <h2 className={t.heading}>Shop trending</h2>
        <ul className={t.trends}>
          {trendingData.map(({ id, name, description, image, link }) => (
            <li key={id} className={t.singleTrend}>
              <div className={t.singleTrendInfoContainer}>
                <h3 className={t.singleTrendName}>{name}</h3>
                <h4 className={t.singleTrendDescription}>{description}</h4>
                <Link to={link} className={t.singleTrendButton}>
                  Shop brand
                </Link>
              </div>
              <img className={t.singleTrendImage} src={image} alt={name} />
            </li>
          ))}
        </ul>
      </section>
      {/* Top sellers */}
      <section className={s.container}>
        <h2 className={s.heading}>Our top sellers</h2>
        <ul className={s.sellers}>
          {sellersData.map(
            ({ id, name, description, image, price, currency }) => (
              <li key={id} className={s.singleSeller}>
                <Link to="/no-route" className={s.singleSellerLinkWrapper}>
                  <img className={s.singleSellerImage} src={image} alt="" />
                  <div className={s.singleSellerInfoContainer}>
                    <div className={s.singleSellerName}>{name}</div>
                    <div className={s.singleSellerDescription}>
                      {description}
                    </div>
                    <div className={s.singleSellerPrice}>
                      <span>{price}</span> <span>{currency}</span>
                    </div>
                  </div>
                </Link>
              </li>
            ),
          )}
        </ul>
      </section>
    </main>
  )
}
