import { UI_TEXTS, TEAM } from '@/utils/constants'
import OurTeamCard from '@/Components/OurTeamCard/OurTeamCard'
import schoolLogo from '@/assets/img/rs_school logo.png'
import skateBoardPic from '@/assets/img/skateboard_horizontal.png'
import Breadcrumbs from '@/Components/Breadcrumbs/Breadcrumbs'
import s from './AboutPage.module.scss'

export default function AboutPage() {
  return (
    <div className={s.pageContainer}>
      <Breadcrumbs />
      <h3 className={s.title}>{UI_TEXTS.ABOUT_HEADER}</h3>
      <div className={s.cardsContainer}>
        {TEAM.map((m) => (
          <OurTeamCard profile={m} key={m.NAME} />
        ))}
      </div>
      <div className={s.logoWrapper}>
        <img src={schoolLogo} alt="RS school logo" className={s.logo} />
      </div>
      <div className={s.skateWrapper}>
        <img src={skateBoardPic} alt="skateboard" className={s.skateImg} />
      </div>
    </div>
  )
}
