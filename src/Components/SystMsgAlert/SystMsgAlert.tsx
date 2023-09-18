import { useEffect } from 'react'
import cn from 'classnames'
import { ReactComponent as SvgClose } from '@/assets/icons/close.svg'
import SystAlertProps from './SystMsgAlert.props'
import skateIcon from '../../assets/icons/skateboard.svg'
import s from './SystMsgAlert.module.scss'

export default function SystMsgAlert(props: SystAlertProps) {
  const { msg, onResetMsg, type } = props

  useEffect(() => {
    const timeout = setTimeout(onResetMsg, 3000)
    return () => clearTimeout(timeout)
  }, [msg, onResetMsg])

  return (
    <div
      className={cn(
        s.popup,
        { [s.success]: type === 'success' },
        { [s.fail]: type === 'fail' },
        { [s.shown]: !!msg },
      )}
      data-testid="alert"
    >
      <img src={skateIcon} alt="scateboard icon" className={s.icon} />
      <p className={s.msgText}>{msg}</p>
      <button
        type="button"
        className={s.closeBtn}
        onClick={onResetMsg}
        data-testid="exit-button"
      >
        <SvgClose className={s.closeIcon} />
      </button>
    </div>
  )
}
