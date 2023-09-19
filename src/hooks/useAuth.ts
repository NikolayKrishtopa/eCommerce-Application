enum SessionType {
  Client = 'client',
  Anonymous = 'anonymous',
  Authenticated = 'authenticated',
}

const isEnum = <T extends { [k: string]: unknown }>(
  targetEnum: T,
  value: unknown,
): value is T[keyof T] => Object.values(targetEnum).includes(value)

class SessionStore {
  static STORAGE_SESSION_TYPE = 'sessionType'
  static STORAGE_REFRESH_TOKEN = 'refreshToken'

  private session = SessionType.Client
  private refreshToken = ''

  retrieveFromLocalStorage() {
    const storageSessionType = localStorage.getItem(
      SessionStore.STORAGE_SESSION_TYPE,
    )
    const storageRefreshToken = localStorage.getItem(
      SessionStore.STORAGE_REFRESH_TOKEN,
    )
    this.session = isEnum(SessionType, storageSessionType)
      ? storageSessionType
      : SessionType.Client
    this.refreshToken = storageRefreshToken || ''
    return this
  }

  get() {
    return {
      session: this.session,
      refreshToken: this.refreshToken,
    }
  }

  set(session: SessionType, refreshToken?: string) {
    this.session = session
    localStorage.setItem(SessionStore.STORAGE_SESSION_TYPE, session)
    if (refreshToken) {
      this.refreshToken = refreshToken
      localStorage.setItem(SessionStore.STORAGE_REFRESH_TOKEN, refreshToken)
    } else {
      this.refreshToken = ''
      localStorage.removeItem(SessionStore.STORAGE_REFRESH_TOKEN)
    }
  }
}

const sessionStore = new SessionStore()
sessionStore.retrieveFromLocalStorage()

function useAuth() {}

export default useAuth
export { SessionType }
