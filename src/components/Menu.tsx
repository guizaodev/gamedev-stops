import { useState } from 'react'
import {
  OPCOES_TEMPO,
  PONTOS_VITORIA,
  type Jogador,
  type OpcaoTempo,
} from '../data/tipos'
import { NOMES_DIFICULDADE, type Dificuldade } from '../data/temas'
import { IconeMais, IconeX } from './Icones'

interface Props {
  jogadores: Jogador[]
  onAdd: (nome: string) => void
  onRemover: (id: number) => void
  tempo: OpcaoTempo
  onTempo: (t: OpcaoTempo) => void
  dificuldade: Dificuldade
  onDificuldade: (d: Dificuldade) => void
  onIniciar: () => void
}

const CORES_JOGADOR = ['#f43f5e', '#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ec4899', '#14b8a6', '#eab308']

export function Menu({ jogadores, onAdd, onRemover, tempo, onTempo, dificuldade, onDificuldade, onIniciar }: Props) {
  const [nome, setNome] = useState('')
  const podeIniciar = jogadores.length >= 2

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const n = nome.trim()
    if (!n) return
    onAdd(n)
    setNome('')
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-6xl flex-col p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="texto-contorno select-none text-6xl font-black tracking-wide text-yellow-300 sm:text-7xl">
          St<span className="text-red-500">O</span>pS
        </h1>
        <div className="rounded-2xl bg-white/10 px-4 py-2 text-white/80 ring-2 ring-white/15">
          <span className="text-sm uppercase tracking-widest">Vence com</span>{' '}
          <span className="text-2xl font-black text-yellow-300">{PONTOS_VITORIA} pts</span>
        </div>
      </header>

      <div className="mt-4 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr]">
        {/* Coluna esquerda: jogadores */}
        <section className="flex min-h-0 flex-col rounded-3xl bg-indigo-950/60 p-4 ring-2 ring-white/10 sm:p-5">
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">Jogadores</h2>
          <form onSubmit={enviar} className="mt-3 flex gap-2">
            <input
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Nome do jogador"
              maxLength={12}
              autoComplete="off"
              enterKeyHint="done"
              className="min-w-0 flex-1 rounded-2xl border-0 bg-white/10 px-4 py-3.5 text-xl font-bold text-white placeholder-white/40 ring-2 ring-white/20 outline-none focus:ring-4 focus:ring-yellow-300/70"
            />
            <button
              type="submit"
              aria-label="Adicionar jogador"
              className="grid w-16 shrink-0 place-items-center rounded-2xl bg-green-500 text-white shadow-[0_6px_0] shadow-green-700 transition-transform active:translate-y-1 active:shadow-none"
            >
              <IconeMais className="h-8 w-8" />
            </button>
          </form>

          <ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {jogadores.length === 0 && (
              <li className="rounded-2xl bg-white/5 px-4 py-3 text-lg text-white/50">
                Adicione ao menos 2 jogadores para começar 🎉
              </li>
            )}
            {jogadores.map((j, i) => (
              <li
                key={j.id}
                className="anim-fadeup flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3"
              >
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg font-black text-white"
                  style={{ background: CORES_JOGADOR[i % CORES_JOGADOR.length] }}
                  aria-hidden
                >
                  {j.nome.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1 truncate text-2xl font-extrabold text-white">{j.nome}</span>
                <button
                  type="button"
                  onClick={() => onRemover(j.id)}
                  aria-label={`Remover ${j.nome}`}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-red-500/90 text-white transition-transform active:scale-90"
                >
                  <IconeX className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Coluna direita: opções */}
        <section className="flex min-h-0 flex-col gap-4 rounded-3xl bg-indigo-950/60 p-4 ring-2 ring-white/10 sm:p-5">
          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">Tempo por rodada</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {OPCOES_TEMPO.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTempo(t)}
                  aria-pressed={tempo === t}
                  className={`rounded-2xl py-4 text-2xl font-black transition-all active:scale-95 ${
                    tempo === t
                      ? 'bg-yellow-300 text-indigo-950 shadow-[0_6px_0] shadow-amber-500'
                      : 'bg-white/10 text-white/80 ring-2 ring-white/15'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-white sm:text-2xl">Dificuldade dos temas</h2>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {(Object.keys(NOMES_DIFICULDADE) as Dificuldade[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onDificuldade(d)}
                  aria-pressed={dificuldade === d}
                  className={`rounded-2xl px-1 py-4 text-lg font-black transition-all active:scale-95 ${
                    dificuldade === d
                      ? 'bg-fuchsia-500 text-white shadow-[0_6px_0] shadow-purple-800'
                      : 'bg-white/10 text-white/80 ring-2 ring-white/15'
                  }`}
                >
                  {NOMES_DIFICULDADE[d]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <button
              type="button"
              onClick={onIniciar}
              disabled={!podeIniciar}
              className="w-full rounded-3xl bg-green-500 py-6 text-4xl font-black tracking-wide text-white shadow-[0_8px_0] shadow-green-700 transition-all enabled:active:translate-y-1.5 enabled:active:shadow-none disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none"
            >
              COMEÇAR JOGO
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
