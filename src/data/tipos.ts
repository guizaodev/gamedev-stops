export type Fase = 'menu' | 'roleta' | 'jogo' | 'vitoria'

export interface Jogador {
  id: number
  nome: string
  pontos: number
}

export type OpcaoTempo = 2 | 3 | 5 | 10
export const OPCOES_TEMPO: OpcaoTempo[] = [2, 3, 5, 10]

export const PONTOS_VITORIA = 3
export const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
