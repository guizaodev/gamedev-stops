import { useEffect, useRef, useState } from 'react'
import { TEMAS } from '../data/temas'
import { useSons } from '../hooks/useAudio'
import { IconeMudo, IconeSom } from './Icones'

interface Props {
  dificuldade: keyof typeof TEMAS
  jogadorDaVez: string
  onConfirmar: (tema: string) => void
  muted: boolean
  onToggleSom: () => void
}

const CORES_SETORES = [
  '#f43f5e', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7',
  '#ec4899', '#14b8a6', '#eab308', '#fb7185', '#84cc16',
]

export function Roleta({ dificuldade, jogadorDaVez, onConfirmar, muted, onToggleSom }: Props) {
  const temas = TEMAS[dificuldade]
  const [girando, setGirando] = useState(false)
  const [rotacao, setRotacao] = useState(0)
  const [temaFinal, setTemaFinal] = useState<string | null>(null)
  const tocar = useSons(muted)
  const cliquesRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cliquesRef.current) clearTimeout(cliquesRef.current)
    }
  }, [])

  const girar = () => {
    if (girando) return
    setGirando(true)
    setTemaFinal(null)

    const n = temas.length
    const escolhido = Math.floor(Math.random() * n)
    const fatia = 360 / n
    const centro = escolhido * fatia + fatia / 2

    // Leva o centro da fatia sorteada até o ponteiro (topo), com 4+ voltas
    const atual = rotacao % 360
    const destino = 360 - centro
    let delta = (destino - atual) % 360
    if (delta <= 0) delta += 360
    setRotacao(r => r + 360 * 4 + delta)

    // Cliques que desaceleram junto com a roleta
    let intervalo = 110
    const clique = () => {
      tocar('roleta')
      intervalo = Math.min(450, intervalo * 1.18)
      if (intervalo < 430) {
        cliquesRef.current = setTimeout(clique, intervalo)
      }
    }
    clique()

    const duracao = 4200
    setTimeout(() => {
      setGirando(false)
      setTemaFinal(temas[escolhido])
      tocar('vitoriaRodada')
    }, duracao)
  }

  const gradiente = `conic-gradient(${temas
    .map(
      (_, i) =>
        `${CORES_SETORES[i % CORES_SETORES.length]} ${(i * 100) / temas.length}% ${((i + 1) * 100) / temas.length}%`,
    )
    .join(', ')})`

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col p-4 sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="select-none text-3xl font-black tracking-wide text-white sm:text-4xl">
          Sorteio do tema
        </h1>
        <div className="anim-pulsar rounded-2xl bg-white/10 px-5 py-2 text-right ring-2 ring-yellow-300/60">
          <span className="block text-xs uppercase tracking-widest text-white/70">Vez de</span>
          <span className="text-2xl font-black text-yellow-300">{jogadorDaVez}</span>
        </div>
        <button
          type="button"
          onClick={onToggleSom}
          aria-label={muted ? 'Ativar som' : 'Silenciar'}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-2 ring-white/20 transition-transform active:scale-90"
        >
          {muted ? <IconeMudo className="h-7 w-7" /> : <IconeSom className="h-7 w-7" />}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 py-2 lg:flex-row lg:gap-10">
        {/* Roleta */}
        <div className="relative aspect-square w-64 shrink-0 sm:w-80 lg:w-[24rem]">
          <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 text-4xl drop-shadow-lg">🔻</div>
          <div
            className="h-full w-full rounded-full shadow-2xl ring-8 ring-white/70"
            style={{
              background: gradiente,
              transform: `rotate(${rotacao}deg)`,
              transition: girando ? 'transform 4.2s cubic-bezier(0.12, 0.72, 0.16, 1)' : 'none',
            }}
          />
          <div className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-full bg-indigo-950 text-3xl ring-4 ring-white/70">
            🎯
          </div>
        </div>

        {/* Resultado + ações */}
        <div className="flex min-w-0 flex-1 flex-col items-center gap-5">
          <div className="min-h-28 w-full text-center">
            {temaFinal ? (
              <>
                <p className="anim-pop texto-contorno text-5xl font-black text-yellow-300 sm:text-6xl">
                  {temaFinal}
                </p>
                <p className="mt-2 text-xl text-white/70">Falem palavras desse tema!</p>
              </>
            ) : (
              <p className="pt-6 text-2xl text-white/60">
                {girando ? 'Girando a roleta...' : 'Aperte GIRAR para sortear o tema!'}
              </p>
            )}
          </div>

          {temaFinal === null ? (
            <button
              type="button"
              onClick={girar}
              disabled={girando}
              className="w-full max-w-sm rounded-3xl bg-fuchsia-500 py-6 text-3xl font-black tracking-widest text-white shadow-[0_8px_0] shadow-purple-800 transition-all enabled:active:translate-y-1.5 enabled:active:shadow-none disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none"
            >
              GIRAR
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onConfirmar(temaFinal)}
              className="anim-pulsar w-full max-w-sm rounded-3xl bg-green-500 py-6 text-3xl font-black tracking-widest text-white shadow-[0_8px_0] shadow-green-700 transition-all active:translate-y-1.5 active:shadow-none"
            >
              COMEÇAR!
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
