import { useEffect } from 'react'
import cn from 'classnames'
import s from './Loader.module.scss'

type LoaderProps = Partial<{
  show: boolean
  className: string
}>

export default function Loader(props: LoaderProps) {
  const { show = true, className = '' } = props

  return <div className={cn(s.loader, { [s.hide]: !show }, className)} />
}

export function FullPageLoader(props: LoaderProps) {
  const { show = true, className = '' } = props

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'unset'
  }, [show])

  return (
    <div className={cn(s.fullPageMask, { [s.hide]: !show }, className)}>
      <div className={cn(s.loader)} />
    </div>
  )
}
