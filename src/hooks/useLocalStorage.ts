import { useEffect, useState } from 'react'

/** Estado persistido em localStorage com fallback silencioso (SSR/privacidade). */
export function useLocalStorage<T>(chave: string, inicial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(() => {
    try {
      const salvo = localStorage.getItem(chave)
      return salvo !== null ? (JSON.parse(salvo) as T) : inicial
    } catch {
      return inicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      /* ignore */
    }
  }, [chave, valor])

  return [valor, setValor]
}
