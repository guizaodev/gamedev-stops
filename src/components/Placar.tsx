import { PONTOS_VITORIA, type Jogador } from '../data/tipos'

interface Props {
  jogadores: Jogador[]
  ativoId: number | null
  /** Ids eliminados na rodada atual (riscados no placar). */
  foraIds: number[]
}

export function Placar({ jogadores, ativoId, foraIds }: Props) {
  return (
    <ul className="flex w-full max-w-2xl flex-wrap justify-center gap-2" aria-label="Placar">
      {jogadores.map(j => {
        const ativo = j.id === ativoId
        const fora = foraIds.includes(j.id)
        return (
          <li
            key={j.id}
            className={`flex items-center gap-2 rounded-2xl px-3 py-1.5 ring-2 transition-all ${
              ativo
                ? 'anim-pulsar bg-yellow-300 text-indigo-950 ring-yellow-200'
                : 'bg-white/10 text-white ring-white/15'
            } ${fora ? 'opacity-40' : ''}`}
          >
            <span className={`max-w-32 truncate text-lg font-extrabold ${fora ? 'line-through' : ''}`}>{j.nome}</span>
            <span
              className={`rounded-lg px-2 py-0.5 text-base font-black tabular-nums ${
                ativo ? 'bg-indigo-950 text-yellow-300' : 'bg-white/15 text-white'
              }`}
            >
              {j.pontos}/{PONTOS_VITORIA}
</span>
          </li>
        )
      })}
    </ul>
  )
}
