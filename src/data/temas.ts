export const TEMAS = {
  facil: [
    "Animais", "Cores", "Frutas", "Objetos de casa", "Roupas", "Brinquedos",
    "Partes do corpo", "Bebidas", "Doces e sobremesas", "Meios de transporte",
    "Utensílios de cozinha", "Móveis", "Instrumentos escolares", "Formas geométricas",
    "Dias da semana e meses", "Times de futebol", "Desenhos animados", "Frutas vermelhas",
    "Legumes e verduras", "Animais de estimação", "Cores de carro", "Brincadeiras de infância",
    "Nomes de bebê", "Lanches rápidos", "Emojis", "Sabores de sorvete", "Animais da fazenda",
    "Cômodos da casa", "Ferramentas", "Estações do ano"
  ],
  normal: [
    "Países", "Profissões", "Esportes", "Comidas", "Filmes", "Séries de TV",
    "Cantores e bandas", "Capitais do mundo", "Marcas de roupas", "Redes sociais",
    "Nomes próprios (masculino)", "Nomes próprios (feminino)", "Times de basquete",
    "Jogos de videogame", "Aplicativos de celular", "Personagens de novela",
    "Comidas típicas brasileiras", "Estados do Brasil", "Rios e mares",
    "Objetos de escritório", "Profissões da saúde", "Instrumentos musicais",
    "Bebidas alcoólicas", "Frutas tropicais", "Animais marinhos", "Insetos",
    "Programas de TV", "Youtubers", "Personagens de desenho japonês (anime)",
    "Comidas italianas", "Tipos de queijo", "Carros e montadoras", "Signos do zodíaco"
  ],
  dificil: [
    "Marcas famosas", "Cidades do Brasil", "Personagens de desenho", "Instrumentos musicais raros",
    "Escritores e autores", "Pintores famosos", "Filósofos", "Doenças",
    "Termos de informática", "Partes de um carro", "Palavras em inglês",
    "Nomes de reis e rainhas", "Rios do mundo", "Vulcões e montanhas",
    "Personalidades da música clássica", "Correntes artísticas", "Times de futebol europeus",
    "Ilhas do mundo", "Moedas de países", "Idiomas do mundo", "Danças típicas",
    "Constelações", "Peças de xadrez e termos do jogo", "Profissões raras",
    "Universidades famosas"
  ],
  expert: [
    "Elementos químicos", "Capitais pouco conhecidas", "Termos científicos",
    "Personalidades históricas", "Tratados e acordos internacionais", "Termos jurídicos",
    "Doenças raras", "Minerais e rochas", "Termos de anatomia", "Filósofos gregos",
    "Imperadores romanos", "Batalhas históricas", "Termos de astronomia",
    "Partidos políticos pelo mundo", "Termos econômicos e financeiros",
    "Prêmios Nobel (áreas ou vencedores)", "Dinastias históricas", "Termos de genética",
    "Tratamentos médicos", "Termos náuticos"
  ],
} as const

export type Dificuldade = keyof typeof TEMAS

export const NOMES_DIFICULDADE: Record<Dificuldade, string> = {
  facil: 'Fácil',
  normal: 'Normal',
  dificil: 'Difícil',
  expert: 'Expert',
}
