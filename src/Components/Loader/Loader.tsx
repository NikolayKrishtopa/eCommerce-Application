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

  return <div className={cn(s.loader, className)} />
}

export function FullPageLoader(props: LoaderProps) {
  const { show = true, className = '' } = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!show) return null

  return (
    <div className={cn(s.fullPageMask, className)}>
      <div className={cn(s.loader)} />
    </div>
  )
}
