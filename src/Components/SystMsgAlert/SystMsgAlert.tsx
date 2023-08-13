import { useEffect } from 'react'
import cn from 'classnames'
import SystAlertProps from './SystMsgAlert.props'
import skateIcon from '../../assets/img/skateboard.svg'
import closeIcon from '../../assets/img/close.svg'
import s from './SystMsgAlert.module.scss'

export default function SystMsgAlert(props: SystAlertProps) {
  const { msg, onResetMsg, type } = props

  useEffect(() => {
    const timeout = setTimeout(onResetMsg, 3000)
    return () => clearTimeout(timeout)
  }, [msg])

  return (
    <div
      className={cn(
        s.popup,
        { [s.success]: type === 'success' },
        { [s.fail]: type === 'fail' },
        { [s.shown]: !!msg },
      )}
    >
      <img src={skateIcon} alt="scateboard icon" className={s.icon} />
      <p className={s.msgText}>{msg}</p>
      <button type="button" className={s.closeBtn} onClick={onResetMsg}>
        <img src={closeIcon} alt="Close button" className={s.closeIcon} />
      </button>
    </div>
  )
}
