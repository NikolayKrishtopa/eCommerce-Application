export default function filename(path: string) {
  return (
    path
      .match(/[ \w-]+\./)
      ?.at(-1)
      ?.slice(0, -1) || ''
  )
}
