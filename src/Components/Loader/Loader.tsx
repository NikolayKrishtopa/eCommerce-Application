import { useEffect } from 'react'
import cn from 'classnames'
import s from './Loader.module.scss'

type LoaderProps = Partial<{
  show: boolean
  className: string
}>

export default function Loader(props: LoaderProps) {
  const { show = true, className = '' } = props

  if (!show) return null

  return <div className={cn(s.loader, className)} data-testid="loader" />
}

export function FullPageLoader(props: LoaderProps) {
  const { show = true, className = '' } = props

  useEffect(() => {
    document.body.style.overflow = show ? 'hidden' : 'unset'
  }, [show])

  if (!show) return null

  return (
    <div className={cn(s.fullPageMask, className)} data-testid="loader">
      <div className={cn(s.loader)} />
    </div>
  )
}
