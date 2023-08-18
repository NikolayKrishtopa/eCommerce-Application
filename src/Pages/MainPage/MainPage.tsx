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
import main from './styles/MainPage.module.scss'
import hero from './styles/Hero.module.scss'
import categories from './styles/Category.module.scss'
import trending from './styles/Trending.module.scss'
import sellers from './styles/Sellers.module.scss'

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
    <main className={main.main}>
      {/* Hero */}
      <div className={hero.container}>
        <div className={hero.hero}>
          <div className={hero.background}>
            <div className={hero.mask} />
            <img
              className={hero.image}
              draggable={false}
              src={heroImage}
              alt="boy doing a skate trick"
            />
          </div>
          <div className={hero.content}>
            <h1 className={hero.heading}>
              Skateboards and <br /> Streetwear
            </h1>
            <Link to="/no-route" className={hero.button}>
              Shop now
            </Link>
          </div>
        </div>
        <div className={hero.partnersContainer}>
          <div className={hero.partners}>
            {Object.entries(partnerImages).map(([imgSrc, brand]) => (
              <img
                className={hero.singlePartner}
                key={imgSrc}
                src={imgSrc}
                alt={`brand ${brand} logo`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className={categories.container}>
        <h2 className={categories.heading}>Shop by category</h2>
        <div className={categories.categories}>
          {categoriesData.map(({ name, image, link }) => (
            <Link to={link} key={name} className={categories.singleCategory}>
              <h3 className={categories.singleCategoryName}>{name}</h3>
              <img
                className={categories.singleCategoryImage}
                src={image}
                alt={name}
              />
            </Link>
          ))}
        </div>
        <Link to="/no-route" className={categories.button}>
          Shop
        </Link>
      </div>
      {/* Trending */}
      <div className={trending.container}>
        <h2 className={trending.heading}>Shop trending</h2>
        <div className={trending.trends}>
          {trendingData.map(({ name, description, image, link }) => (
            <div key={name} className={trending.singleTrend}>
              <div key={name} className={trending.singleTrendInfoContainer}>
                <h3 className={trending.singleTrendName}>{name}</h3>
                <h4 className={trending.singleTrendDescription}>
                  {description}
                </h4>
                <Link to={link} className={trending.singleTrendButton}>
                  Shop brand
                </Link>
              </div>
              <img
                className={trending.singleTrendImage}
                src={image}
                alt={name}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Top sellers */}
      <div className={sellers.container}>
        <h2 className={sellers.heading}>Our top sellers</h2>
        <div className={sellers.sellers}>
          {sellersData.map(
            ({ id, name, description, image, price, currency }) => (
              <Link to="/no-route" key={id} className={sellers.singleSeller}>
                <img className={sellers.singleSellerImage} src={image} alt="" />
                <div className={sellers.singleSellerInfoContainer}>
                  <div className={sellers.singleSellerName}>{name}</div>
                  <div className={sellers.singleSellerDescription}>
                    {description}
                  </div>
                  <div className={sellers.singleSellerPrice}>
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
