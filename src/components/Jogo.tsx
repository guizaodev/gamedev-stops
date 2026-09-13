import { useCallback, useEffect, useRef, useState } from 'react'
import { Cronometro } from './Cronometro'
import { Teclado } from './Teclado'
import { Placar } from './Placar'
import { BotaoSom } from './BotaoSom'
import { IconeCasa } from './Icones'
import { useSons, useTicTac } from '../hooks/useAudio'
import type { Jogador } from '../data/tipos'

interface Props {
  jogadores: Jogador[]
  /** Ordem de jogadores (ids) para a rodada. */
  filaInicial: number[]
  /** Índice dentro de filaInicial de quem começa jogando. */
  indicePrimeiro: number
  tema: string
  tempoRodada: number
  muted: boolean
  onToggleSom: () => void
  onRodadaVencida: (vencedorId: number) => void
  onSair: () => void
}

type Estado = 'aguardando' | 'contando' | 'fimRodada'

export function Jogo({ jogadores, filaInicial, indicePrimeiro, tema, tempoRodada, muted, onToggleSom, onRodadaVencida, onSair }: Props) {
  const [vivos, setVivos] = useState<number[]>(filaInicial)
  const [idxAtual, setIdxAtual] = useState(indicePrimeiro)
  const [turno, setTurno] = useState(0)
  const [usadas, setUsadas] = useState<ReadonlySet<string>>(new Set())
  const [turnoTemLetra, setTurnoTemLetra] = useState(false)
  const [restanteMs, setRestanteMs] = useState(tempoRodada * 1000)
  const [estado, setEstado] = useState<Estado>('aguardando')
  const [vencedorId, setVencedorId] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)
  const [aviso, setAviso] = useState(false)

  const rafRef = useRef<number | null>(null)
  const duracaoMs = tempoRodada * 1000

  const tocar = useSons(muted)
  const tocarRef = useRef(tocar)
  tocarRef.current = tocar

  const vivosRef = useRef(vivos)
  vivosRef.current = vivos
  const idxRef = useRef(idxAtual)
  idxRef.current = idxAtual
  const jogadoresRef = useRef(jogadores)
  jogadoresRef.current = jogadores

  const idAtual = vivos[idxAtual] ?? null
  const jogadorAtual = jogadores.find(j => j.id === idAtual) ?? null
  const progresso = Math.max(0, restanteMs / duracaoMs)
  const segundos = Math.max(0, Math.ceil(restanteMs / 1000))
  const urgente = estado === 'contando' && progresso <= 0.3

  // Loop do cronômetro: reinicia a cada mudança de turno
  useEffect(() => {
    if (estado !== 'contando') return
    let ativo = true
    const inicio = performance.now()
    const passo = () => {
      if (!ativo) return
      const falta = duracaoMs - (performance.now() - inicio)
      if (falta <= 0) {
        setRestanteMs(0)
        ativo = false
        return
      }
      setRestanteMs(falta)
      rafRef.current = requestAnimationFrame(passo)
    }
    rafRef.current = requestAnimationFrame(passo)
    // Fallback: requestAnimationFrame pausa em abas/viewport sem foco;
    // o timeout garante a eliminação mesmo assim.
    const fallback = window.setTimeout(() => {
      if (ativo) setRestanteMs(0)
    }, duracaoMs + 250)
    return () => {
      ativo = false
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      window.clearTimeout(fallback)
    }
  }, [estado, turno, duracaoMs])

  const eliminarAtual = useCallback(() => {
    const atuais = vivosRef.current
    const eliminado = atuais[idxRef.current]
    if (eliminado === undefined) return
    const restantes = atuais.filter(id => id !== eliminado)
    setFlash(true)
    window.setTimeout(() => setFlash(false), 1100)
    tocarRef.current('erro')

    if (restantes.length === 1) {
      setVivos(restantes)
      setVencedorId(restantes[0])
      setEstado('fimRodada')
      window.setTimeout(() => tocarRef.current('vitoriaRodada'), 700)
    } else {
      setVivos(restantes)
      setIdxAtual(idxRef.current % restantes.length)
      setTurno(t => t + 1)
      setTurnoTemLetra(false)
      setEstado('aguardando')
    }
  }, [])

  useEffect(() => {
    if (estado === 'contando' && restanteMs <= 0) eliminarAtual()
  }, [restanteMs, estado, eliminarAtual])

  useTicTac(estado === 'contando', urgente, muted)

  const comecar = () => {
    tocar('clique')
    setEstado('contando')
  }

  const marcarLetra = (letra: string) => {
    if (estado !== 'contando' || usadas.has(letra)) return
    const novo = new Set(usadas)
    novo.add(letra)
    setUsadas(novo)
    setTurnoTemLetra(true)
    tocar('letra')
  }

  const passarVez = () => {
    if (estado !== 'contando') return
    if (!turnoTemLetra) {
      setAviso(true)
      window.setTimeout(() => setAviso(false), 1000)
      tocar('clique')
      return
    }
    tocar('passar')
    setTurnoTemLetra(false)
    setIdxAtual(i => (i + 1) % vivos.length)
    setTurno(t => t + 1)
    setEstado('aguardando')
  }

  const proximaRodada = () => {
    if (vencedorId === null) return
    onRodadaVencida(vencedorId)
  }

  const vencedor = jogadores.find(j => j.id === vencedorId) ?? null
  const foraIds =
    estado === 'fimRodada'
      ? jogadores.filter(j => j.id !== vencedorId).map(j => j.id)
      : jogadores.filter(j => !vivos.includes(j.id)).map(j => j.id)

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col p-3 sm:p-4">
      {flash && (
        <div className="anim-flash pointer-events-none fixed inset-0 z-50 bg-red-600/75" aria-hidden />
      )}

      {aviso && (
        <div
          role="alert"
          className="anim-pop fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-red-500 px-6 py-3 text-xl font-black text-white shadow-2xl"
        >
          Aperte uma letra antes de passar! ✋
        </div>
      )}

      <header className="flex items-stretch gap-2 sm:gap-3">
        <div className="min-w-0 flex-1 rounded-3xl bg-fuchsia-600 px-4 py-2.5 text-center ring-4 ring-fuchsia-300/40">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-white/80">
            Tema da rodada
          </span>
          <span className="block truncate text-2xl font-black leading-tight text-white sm:text-3xl">
            {tema}
          </span>
        </div>
        <BotaoSom muted={muted} onToggle={onToggleSom} />
        <button
          type="button"
          onClick={onSair}
          aria-label="Voltar ao menu"
          className="grid w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-2 ring-white/20 transition-transform active:scale-90"
        >
          <IconeCasa className="h-7 w-7" />
        </button>
      </header>

      <div className="mt-2 grid min-h-0 flex-1 grid-cols-[auto_1fr] gap-3 sm:gap-4">
        <section className="flex w-56 flex-col items-center justify-center gap-2 sm:w-72 sm:gap-3">
          <div className="w-full rounded-2xl bg-white/10 px-3 py-2 text-center ring-2 ring-white/15">
            <span className="block text-[10px] uppercase tracking-widest text-white/60">Vez de</span>
            <span className="block truncate text-2xl font-black leading-tight text-yellow-300 sm:text-3xl">
              {jogadorAtual?.nome ?? '—'}
            </span>
          </div>

          <Cronometro progresso={progresso} segundos={segundos} total={tempoRodada} />

          {estado === 'fimRodada' ? (
            <div className="w-full space-y-2">
              <div className="anim-pop rounded-2xl bg-green-500 px-3 py-3 text-center ring-4 ring-green-300/50">
                <span className="block text-lg font-black text-white">
                  🏆 {vencedor?.nome} venceu a rodada!
                </span>
                <span className="text-sm font-bold text-green-100">+1 ponto</span>
              </div>
              <button
                type="button"
                onClick={proximaRodada}
                className="anim-pulsar w-full rounded-3xl bg-yellow-300 py-4 text-2xl font-black uppercase tracking-widest text-indigo-950 shadow-[0_7px_0] shadow-amber-500 transition-all active:translate-y-1.5 active:shadow-none"
              >
                Próxima rodada →
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={passarVez}
              className="w-full rounded-3xl bg-yellow-300 py-5 text-2xl font-black uppercase tracking-widest text-indigo-950 shadow-[0_8px_0] shadow-amber-500 transition-all active:translate-y-1.5 active:shadow-none"
            >
              RESPONDI!
            </button>
          )}
        </section>

        <section className="flex min-h-0 min-w-0 w-full flex-col items-center justify-center gap-3">
          <Teclado usadas={usadas} onLetra={marcarLetra} />
          <Placar jogadores={jogadores} ativoId={estado === 'fimRodada' ? vencedorId : idAtual} foraIds={foraIds} />
        </section>
      </div>

      {estado === 'aguardando' && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-indigo-950/95 p-6">
          <div className="anim-fadeup text-center">
            <p className="text-xl uppercase tracking-[0.3em] text-white/60">Passa o tablet para</p>
            <p className="anim-pop texto-contorno my-3 text-6xl font-black text-yellow-300 sm:text-7xl">
              {jogadorAtual?.nome ?? '—'}
            </p>
            <p className="text-2xl text-white/80">
              Tema: <b className="text-fuchsia-300">{tema}</b>
            </p>
            <button
              type="button"
              onClick={comecar}
              className="mt-7 rounded-3xl bg-green-500 px-14 py-6 text-3xl font-black tracking-widest text-white shadow-[0_8px_0] shadow-green-700 transition-all active:translate-y-1.5 active:shadow-none"
            >
              COMEÇAR!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
