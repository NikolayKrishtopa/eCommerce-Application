import { Link } from 'react-router-dom'
import heroImage from '@/assets/img/hero-skater.jpg'
import vansImage from '@/assets/img/partners/vans.png'
import nikeImage from '@/assets/img/partners/nike.png'
import santaCruzImage from '@/assets/img/partners/santacruz.png'
import adidasImage from '@/assets/img/partners/adidas.png'
import patagoniaImage from '@/assets/img/partners/patagonia.png'
import main from './styles/MainPage.module.scss'
import hero from './styles/Hero.module.scss'

const partnerImages = {
  [vansImage]: 'vans',
  [nikeImage]: 'nike',
  [santaCruzImage]: 'santaCruz',
  [adidasImage]: 'adidas',
  [patagoniaImage]: 'patagonia',
}

export default function MainPage() {
  return (
    <main className={main.main}>
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
    </main>
  )
}
