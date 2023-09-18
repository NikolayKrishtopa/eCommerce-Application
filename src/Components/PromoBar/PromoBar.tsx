import { ReactComponent as SvgDiscount } from '@/assets/icons/discount.svg'
import { ReactComponent as SvgClose } from '@/assets/icons/close.svg'
import { useState } from 'react'
import s from './PromoBar.module.scss'

type PromoBarProps = {
  message: string
  code: string
  color?: string
}

export default function PromoBar(props: PromoBarProps) {
  const { message, code, color = '#EC4E20' } = props
  const [visible, setVisible] = useState(true)

  return (
    visible && (
      <section className={s.promoBar} style={{ backgroundColor: color }}>
        <SvgDiscount className={s.icon} />
        <span>
          {message}: <span className={s.code}>{code}</span>
        </span>
        <button
          className={s.closeBtn}
          type="button"
          onClick={() => setVisible(false)}
        >
          {' '}
          <SvgClose />
        </button>
      </section>
    )
  )
}
