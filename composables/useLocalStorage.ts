export function useLocalStorage() {
  const isClient = typeof window !== 'undefined'

  const setLocalData = (key: string, value: string | object | boolean) => {
    if (isClient) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  const getLocalData = (key: string) => {
    if (isClient) {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    }
    return null
  }

  const removeLocalData = (key: string) => {
    if (isClient) {
      localStorage.removeItem(key)
    }
  }

  const clearLocalData = () => {
    if (isClient) {
      localStorage.clear()
    }
  }

  return {
    setLocalData,
    getLocalData,
    removeLocalData,
    clearLocalData
  }
}
