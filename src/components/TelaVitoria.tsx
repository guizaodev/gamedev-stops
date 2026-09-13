import { useEffect } from 'react'
import { Confete } from './Confete'
import { IconeCasa, IconeRefresh, IconeTrofeu } from './Icones'
import { useSons } from '../hooks/useAudio'
import { PONTOS_VITORIA, type Jogador } from '../data/tipos'

interface Props {
  vencedor: Jogador
  jogadores: Jogador[]
  muted: boolean
  onToggleSom: () => void
  onJogarNovamente: () => void
  onNovoJogo: () => void
}

export function TelaVitoria({ vencedor, jogadores, muted, onToggleSom, onJogarNovamente, onNovoJogo }: Props) {
  const tocar = useSons(muted)

  useEffect(() => {
    tocar('vitoriaFinal')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ordenados = [...jogadores].sort((a, b) => b.pontos - a.pontos)

  return (
    <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center p-6">
      <Confete quantidade={110} />

      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={onToggleSom}
          aria-label={muted ? 'Ativar som' : 'Silenciar'}
          className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-white ring-2 ring-white/20 transition-transform active:scale-90"
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="anim-fadeup flex flex-col items-center text-center">
        <IconeTrofeu className="anim-pop h-28 w-28 text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.7)]" />

        <p className="mt-2 text-2xl font-bold uppercase tracking-[0.35em] text-white/70">
          Temos um campeão!
        </p>
        <h1 className="anim-pop texto-contorno my-2 text-7xl font-black text-yellow-300 drop-shadow-xl sm:text-8xl">
          {vencedor.nome}
        </h1>
        <p className="text-3xl font-extrabold text-white">
          Chegou a <span className="text-green-400">{PONTOS_VITORIA} pontos</span> 🎉
        </p>

        {/* Placar final */}
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {ordenados.map((j, i) => (
            <li
              key={j.id}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 ring-2 ${
                j.id === vencedor.id
                  ? 'bg-yellow-300 text-indigo-950 ring-yellow-200'
                  : 'bg-white/10 text-white ring-white/15'
              }`}
            >
              <span className="text-lg font-black opacity-70">{i + 1}º</span>
              <span className="max-w-40 truncate text-xl font-extrabold">{j.nome}</span>
              <span className="rounded-lg bg-black/20 px-2 py-0.5 text-lg font-black tabular-nums">
                {j.pontos}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onJogarNovamente}
            className="flex items-center gap-3 rounded-3xl bg-green-500 px-10 py-5 text-2xl font-black uppercase tracking-widest text-white shadow-[0_8px_0] shadow-green-700 transition-all active:translate-y-1.5 active:shadow-none"
          >
            <IconeRefresh className="h-7 w-7" />
            Jogar novamente
          </button>
          <button
            type="button"
            onClick={onNovoJogo}
            className="flex items-center gap-3 rounded-3xl bg-white/10 px-10 py-5 text-2xl font-black uppercase tracking-widest text-white ring-2 ring-white/25 transition-all active:translate-y-1.5"
          >
            <IconeCasa className="h-7 w-7" />
            Novo jogo
          </button>
        </div>
      </div>
    </div>
  )
}
