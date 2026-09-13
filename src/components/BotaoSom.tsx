import { IconeMudo, IconeSom } from './Icones'

interface Props {
  muted: boolean
  onToggle: () => void
}

export function BotaoSom({ muted, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Ativar som' : 'Silenciar'}
      className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-white shadow-lg ring-2 ring-white/20 transition-transform active:scale-90"
    >
      {muted ? <IconeMudo className="h-7 w-7" /> : <IconeSom className="h-7 w-7" />}
    </button>
  )
}
