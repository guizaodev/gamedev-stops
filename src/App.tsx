import { useCallback, useState } from 'react'
import { Menu } from './components/Menu'
import { Roleta } from './components/Roleta'
import { Jogo } from './components/Jogo'
import { TelaVitoria } from './components/TelaVitoria'
import { useMuted } from './hooks/useAudio'
import { useLocalStorage } from './hooks/useLocalStorage'
import { PONTOS_VITORIA, type Fase, type Jogador, type OpcaoTempo } from './data/tipos'
import type { Dificuldade } from './data/temas'

const CORES_FUNDO = ['#4c1d95', '#1e1b4b', '#831843', '#134e4a']

export default function App() {
  const [fase, setFase] = useState<Fase>('menu')
  const [jogadores, setJogadores] = useLocalStorage<Jogador[]>('stops_jogadores', [])
  const [tempo, setTempo] = useLocalStorage<OpcaoTempo>('stops_tempo', 5)
  const [dificuldade, setDificuldade] = useLocalStorage<Dificuldade>('stops_dificuldade', 'normal')
  const [tema, setTema] = useState('')
  const [filaInicial, setFilaInicial] = useState<number[]>([])
  const [inicioVez, setInicioVez] = useState(0)
  const [muted, toggleSom] = useMuted()
  const [rodadaKey, setRodadaKey] = useState(0)

  const proximoId = jogadores.length > 0 ? Math.max(...jogadores.map(j => j.id)) + 1 : 1

  const adicionarJogador = (nome: string) => {
    if (jogadores.length >= 8) return
    setJogadores(js => [...js, { id: proximoId, nome, pontos: 0 }])
  }

  const removerJogador = (id: number) => {
    setJogadores(js => js.filter(j => j.id !== id))
  }

  const iniciarJogo = () => {
    setJogadores(js => js.map(j => ({ ...j, pontos: 0 })))
    setFase('roleta')
  }

  const confirmarTema = useCallback((temaSorteado: string, fila: number[], primeiro: number) => {
    setTema(temaSorteado)
    setFilaInicial(fila)
    setInicioVez(primeiro)
    setRodadaKey(k => k + 1)
    setFase('jogo')
  }, [])

  const rodadaVencida = useCallback(
    (vencedorId: number) => {
      const atualizadas = jogadores.map(j => (j.id === vencedorId ? { ...j, pontos: j.pontos + 1 } : j))
      setJogadores(atualizadas)
      if (atualizadas.some(j => j.pontos >= PONTOS_VITORIA)) {
        setFase('vitoria')
      } else {
        setFase('roleta')
      }
    },
    [jogadores, setJogadores],
  )

  const novoJogo = () => {
    setFase('menu')
  }

  const corFundo = CORES_FUNDO[fase === 'menu' ? 0 : fase === 'roleta' ? 1 : fase === 'jogo' ? 2 : 3]

  return (
    <main
      className="relative h-dvh w-full overflow-hidden transition-colors duration-700"
      style={{ background: corFundo }}
    >
      {/* Bolhas decorativas de fundo */}
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-fuchsia-500 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-yellow-500 blur-3xl" />
      </div>

      <div className="relative z-10 h-full">
        {fase === 'menu' && (
          <Menu
            jogadores={jogadores}
            onAdd={adicionarJogador}
            onRemover={removerJogador}
            tempo={tempo}
            onTempo={setTempo}
            dificuldade={dificuldade}
            onDificuldade={setDificuldade}
            onIniciar={iniciarJogo}
          />
        )}

        {fase === 'roleta' && jogadores.length > 0 && (
          <Roleta
            key={rodadaKey}
            dificuldade={dificuldade}
            jogadorDaVez={jogadores[rodadaKey % jogadores.length].nome}
            onConfirmar={tema =>
              confirmarTema(tema, jogadores.map(j => j.id), rodadaKey % jogadores.length)
            }
            muted={muted}
            onToggleSom={toggleSom}
          />
        )}

        {fase === 'jogo' && (
          <Jogo
            key={rodadaKey}
            jogadores={jogadores}
            filaInicial={filaInicial}
            indicePrimeiro={inicioVez}
            tema={tema}
            tempoRodada={tempo}
            muted={muted}
            onToggleSom={toggleSom}
            onRodadaVencida={rodadaVencida}
            onSair={novoJogo}
          />
        )}

        {fase === 'vitoria' && (() => {
          const vencedor = jogadores.find(j => j.pontos >= PONTOS_VITORIA)
          return vencedor ? (
            <TelaVitoria
              vencedor={vencedor}
              jogadores={jogadores}
              muted={muted}
              onToggleSom={toggleSom}
              onJogarNovamente={iniciarJogo}
              onNovoJogo={novoJogo}
            />
          ) : null
        })()}
      </div>
    </main>
  )
}
