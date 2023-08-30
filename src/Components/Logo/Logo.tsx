import cn from 'classnames'
import { ReactComponent as SvgLogoLight } from '@/assets/icons/logo-light.svg'
import { ReactComponent as SvgLogoDark } from '@/assets/icons/logo-dark.svg'
import s from './Logo.module.scss'

type LogoProps = {
  invert?: boolean
  className?: string
}

export default function Logo(props: LogoProps) {
  const { invert = false, className } = props

  return (
    <div className={cn(s.logo, { [s.invert]: invert }, className)}>
      <div className={s.iconContainer}>
        {invert ? <SvgLogoDark /> : <SvgLogoLight />}
      </div>
      <span className={s.text}>The Skateshop</span>
    </div>
  )
}
