import { useId } from 'react'

export default function useMemoId(memo?: string | number) {
  const generated = useId()
  return memo ? String(memo) : generated
}
