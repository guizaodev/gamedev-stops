import { useMemo } from 'react'

const CORES = ['#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#eab308']

interface Peca {
  esquerda: number
  atraso: number
  duracao: number
  cor: string
  tamanho: number
}

export function Confete({ quantidade = 90 }: { quantidade?: number }) {
  const pecas = useMemo<Peca[]>(
    () =>
      Array.from({ length: quantidade }, (_, i) => ({
        esquerda: Math.random() * 100,
        atraso: Math.random() * 2.5,
        duracao: 2.8 + Math.random() * 2.4,
        cor: CORES[i % CORES.length],
        tamanho: 8 + Math.random() * 10,
      })),
    [quantidade],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {pecas.map((p, i) => (
        <span
          key={i}
          className="anim-fall absolute top-0 rounded-sm"
          style={{
            left: `${p.esquerda}%`,
            width: p.tamanho,
            height: p.tamanho * 1.4,
            background: p.cor,
            animationDelay: `${p.atraso}s`,
            animationDuration: `${p.duracao}s`,
          }}
        />
      ))}
    </div>
  )
}
