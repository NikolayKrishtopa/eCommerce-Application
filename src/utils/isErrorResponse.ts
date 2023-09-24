import { ErrorResponse } from '@commercetools/platform-sdk'

export default function isErrorResponse(t: unknown): t is ErrorResponse {
  return (
    typeof t === 'object' && t !== null && 'statusCode' in t && 'message' in t
  )
}
