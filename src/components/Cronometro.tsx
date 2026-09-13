interface Props {
  /** Fração do tempo restante, de 1 (cheio) a 0 (esgotado). */
  progresso: number
  /** Segundos restantes arredondados para exibição. */
  segundos: number
  /** Segundos totais da rodada (para o rótulo inicial). */
  total: number
}

export function Cronometro({ progresso, segundos, total }: Props) {
  const raio = 84
  const circunferencia = 2 * Math.PI * raio
  const cor = progresso > 0.6 ? '#22c55e' : progresso > 0.3 ? '#f59e0b' : '#ef4444'
  const urgente = progresso <= 0.3

  return (
    <div className={`relative h-44 w-44 shrink-0 ${urgente ? 'anim-pulsar' : ''}`}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={raio} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="18" />
        <circle
          cx="100"
          cy="100"
          r={raio}
          fill="none"
          stroke={cor}
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia * (1 - progresso)}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className="texto-contorno text-6xl font-black tabular-nums"
          style={{ color: cor }}
          role="timer"
          aria-label={`${segundos} segundos restantes`}
        >
          {segundos}
        </span>
        <span className="sr-only">de {total}s</span>
      </div>
    </div>
  )
}
