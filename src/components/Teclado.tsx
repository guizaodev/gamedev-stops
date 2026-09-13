import { ALFABETO } from '../data/tipos'

interface Props {
  usadas: ReadonlySet<string>
  onLetra: (letra: string) => void
}

export function Teclado({ usadas, onLetra }: Props) {
  return (
    <div className="grid w-full max-w-2xl grid-cols-7 gap-2 sm:gap-2.5" role="group" aria-label="Letras já faladas">
      {ALFABETO.map(letra => {
        const usada = usadas.has(letra)
        return (
          <button
            key={letra}
            type="button"
            disabled={usada}
            aria-pressed={usada}
            aria-label={usada ? `${letra} — já usada` : `Marcar letra ${letra}`}
            onClick={() => onLetra(letra)}
            className={`grid h-12 place-items-center rounded-xl text-2xl font-black transition-all sm:h-14 sm:text-3xl ${
              usada
                ? 'bg-indigo-950/40 text-white/25 shadow-inner ring-1 ring-white/5'
                : 'bg-white text-indigo-950 shadow-[0_5px_0] shadow-indigo-300 active:translate-y-1 active:shadow-none'
            }`}
          >
            {letra}
          </button>
        )
      })}
    </div>
  )
}
