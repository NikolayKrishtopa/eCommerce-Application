import { useContext } from 'react'

export default function makeProtectedUseContext<T>(
  Context: React.Context<T>,
  hookName?: string,
) {
  return () => {
    const context = useContext(Context)

    if (!context) {
      throw new Error(
        `${hookName || 'Hook'} value has to be used within <${
          Context.displayName
        }>`,
      )
    }

    return context
  }
}
