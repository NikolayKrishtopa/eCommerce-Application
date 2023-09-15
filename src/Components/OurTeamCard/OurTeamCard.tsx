import githubIcon from '@/assets/icons/github.svg'
import framerIcon from '@/assets/icons/framer.svg'
import { PortfolioLinkType } from '@/Models/Models'
import { OurTeamCardProps } from './OurTeamCard.props'
import s from './OurTeamCard.module.scss'

export default function OurTeamCard(props: OurTeamCardProps) {
  const { profile } = props
  return (
    <div className={s.card}>
      <img src={profile.PICTURE} alt="avatar" className={s.avatar} />
      <h2 className={s.title}>{profile.NAME}</h2>
      <p className={s.subtitle}>{profile.ROLE}</p>
      <div className={s.description}>
        {profile.SKILLS.map((e) => (
          <p className={s.paragraph}>{e}</p>
        ))}
      </div>
      <a href={profile.PORTFOLIO.LINK} target="blank" className={s.link}>
        <img
          src={
            profile.PORTFOLIO.TYPE === PortfolioLinkType.GITHUB
              ? githubIcon
              : framerIcon
          }
          alt="icon"
        />
      </a>
    </div>
  )
}
