import { type ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder'

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

function extend<T extends ByProjectKeyRequestBuilder, K extends object[]>(
  proto: T,
  ...targets: K
) {
  const target = {}
  targets.forEach((t) => Object.assign(target, t))
  Object.setPrototypeOf(target, proto)
  return target as UnionToIntersection<T | K[number]>
}

export default extend
