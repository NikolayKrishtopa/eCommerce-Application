import { Link } from 'react-router-dom'
import cn from 'classnames'
import heroImage from '@/assets/img/hero-skater.jpg'
import vansImage from '@/assets/img/partners/vans.png'
import nikeImage from '@/assets/img/partners/nike.png'
import santaCruzImage from '@/assets/img/partners/santacruz.png'
import adidasImage from '@/assets/img/partners/adidas.png'
import patagoniaImage from '@/assets/img/partners/patagonia.png'
import skateboardImage from '@/assets/img/categories/skateboards.jpg'
import decksImage from '@/assets/img/categories/decks.jpg'
import wheelsImage from '@/assets/img/categories/wheels.jpg'
import main from './styles/MainPage.module.scss'
import hero from './styles/Hero.module.scss'
import categories from './styles/Category.module.scss'

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
            <Link to="/no-route" className={main.button}>
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
        <h2 className={cn(main.subHeading, categories.heading)}>
          Shop by category
        </h2>
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
        <Link to="/no-route" className={cn(main.button, categories.button)}>
          Shop
        </Link>
      </div>
    </main>
  )
}
