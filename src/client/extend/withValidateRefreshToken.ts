import variables from '../variables'

const { clientId, clientSecret, authHost } = variables

function withValidateRefreshToken() {
  const validateRefreshToken = async (token: string) => {
    const url = new URL('oauth/token', authHost)
    url.searchParams.set('grant_type', 'refresh_token')
    url.searchParams.set('refresh_token', token)
    const headers = new Headers()
    headers.append(
      'Authorization',
      `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    )
    const response = await fetch(url, { method: 'POST', headers })
    return response.ok
  }

  return { validateRefreshToken }
}

export default withValidateRefreshToken
