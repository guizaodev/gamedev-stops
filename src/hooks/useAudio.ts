import { useCallback, useEffect, useRef, useState } from 'react'

export function useMuted(): [boolean, () => void] {
  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('stops_muted') === '1'
    } catch {
      return false
    }
  })
  const toggle = useCallback(() => {
    setMuted(m => {
      const novo = !m
      try { localStorage.setItem('stops_muted', novo ? '1' : '0') } catch { /* ignore */ }
      return novo
    })
  }, [])
  return [muted, toggle]
}

type TimerId = ReturnType<typeof setInterval>

/** Loop de tic-tac acelerando perto do fim. `ativo` liga/desliga; `urgente` acelera. */
export function useTicTac(ativo: boolean, urgente: boolean, muted: boolean) {
  const timerRef = useRef<TimerId | null>(null)

  useEffect(() => {
    const limpar = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
    limpar()
    if (!ativo || muted) return

    const tick = () => {
      const ctx = getContext()
      if (!ctx || !tone(ctx, 880, 0.04, 0.08, 'square')) return
    }
    tick()

    const intervalo = urgente ? 220 : 500
    timerRef.current = setInterval(tick, intervalo)
    return limpar
  }, [ativo, urgente, muted])
}

type CtxConstrutor = typeof AudioContext
let construtor: CtxConstrutor | null = null

function getConstrutor(): CtxConstrutor | null {
  if (construtor !== null) return construtor
  if (typeof window === 'undefined') return null
  const w = window as unknown as { AudioContext?: CtxConstrutor; webkitAudioContext?: CtxConstrutor }
  construtor = w.AudioContext ?? w.webkitAudioContext ?? null
  return construtor
}

let ctxCache: AudioContext | null = null

function getContext(): AudioContext | null {
  const Ctor = getConstrutor()
  if (!Ctor) return null
  if (!ctxCache) ctxCache = new Ctor()
  if (ctxCache.state === 'suspended') void ctxCache.resume()
  return ctxCache
}

function tone(
  ctx: AudioContext,
  freq: number,
  dur: number,
  vol: number,
  type: OscillatorType,
  delay = 0,
): boolean {
  if (ctx.state !== 'running') return false
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
  return true
}

export type Som =
  | 'letra'
  | 'passar'
  | 'erro'
  | 'vitoriaRodada'
  | 'vitoriaFinal'
  | 'roleta'
  | 'clique'

export function useSons(muted: boolean) {
  return useCallback(
    (som: Som) => {
      if (muted) return
      const ctx = getContext()
      if (!ctx) return
      switch (som) {
        case 'letra':
          tone(ctx, 660, 0.08, 0.15, 'square')
          break
        case 'clique':
          tone(ctx, 440, 0.06, 0.12, 'triangle')
          break
        case 'passar': {
          tone(ctx, 320, 0.12, 0.2, 'sine')
          tone(ctx, 240, 0.16, 0.2, 'sine', 0.1)
          break
        }
        case 'erro': {
          for (let i = 0; i < 3; i++) tone(ctx, 180, 0.22, 0.25, 'sawtooth', i * 0.25)
          break
        }
        case 'vitoriaRodada': {
          const notas = [523.25, 659.25, 783.99]
          notas.forEach((f, i) => tone(ctx, f, 0.16, 0.2, 'triangle', i * 0.12))
          break
        }
        case 'vitoriaFinal': {
          const melodia = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5]
          melodia.forEach((f, i) => tone(ctx, f, 0.2, 0.22, 'triangle', i * 0.16))
          break
        }
        case 'roleta': {
          tone(ctx, 500, 0.03, 0.1, 'square')
          break
        }
      }
    },
    [muted],
  )
}
