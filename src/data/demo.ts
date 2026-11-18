// Exemplos da demonstração. Tudo aqui é ilustrativo: nomes e perfis são inventados.
export interface Professor {
  iniciais: string;
  nome: string;
  foco: string;
  horarios: string;
  motivo: string;
}
export type Faixa = [number, number];
export interface Dia { d: string; aluno?: Faixa[]; prof?: Faixa[] }
export interface Exemplo {
  id: string;
  rotulo: string;
  /** Partes do texto do aluno; as com `marca` saem em negrito (o dado que a IA leu). */
  texto: { t: string; marca?: boolean }[];
  /** Agendas em horas cheias (8 a 23). Dias sem barra ficam vazios. */
  agenda: { dias: Dia[]; resumo: string };
  semanas: { titulo: string; descricao: string }[];
  professores: [Professor, Professor];
}

export const exemplos: Exemplo[] = [
  {
    id: 'ingles',
    rotulo: 'Inglês para entrevista',
    texto: [
      { t: 'Tenho uma ' },
      { t: 'entrevista em inglês', marca: true },
      { t: ' em ' },
      { t: '4 semanas', marca: true },
      { t: '. Consigo estudar ' },
      { t: 'às terças e quintas, depois das 19h', marca: true },
      { t: '.' },
    ],
    agenda: {
      dias: [
        { d: 'Seg', prof: [[9, 12]] },
        { d: 'Ter', aluno: [[19, 23]], prof: [[19, 22]] },
        { d: 'Qua', prof: [[14, 17]] },
        { d: 'Qui', aluno: [[19, 23]], prof: [[19, 22]] },
        { d: 'Sex' },
        { d: 'Sáb', prof: [[9, 11]] },
      ],
      resumo: 'Terças e quintas, das 19h às 22h. É onde a agenda da Ana cabe na sua.',
    },
    semanas: [
      { titulo: 'Apresentação', descricao: 'Falar de você e da sua área, com o vocabulário que mais aparece.' },
      { titulo: 'Perguntas comuns', descricao: 'Treinar respostas curtas para as perguntas que quase sempre vêm.' },
      { titulo: 'Simulação', descricao: 'Uma entrevista de mentira, gravada, para ouvir o próprio inglês.' },
      { titulo: 'Ajustes', descricao: 'Revisar os erros da simulação e repetir a entrevista inteira.' },
    ],
    professores: [
      {
        iniciais: 'A',
        nome: 'Ana, professora de exemplo',
        foco: 'Inglês para carreira e entrevistas',
        horarios: 'Ter e qui, 19h às 22h',
        motivo: 'Dá aula nos dias e no horário que você tem livres.',
      },
      {
        iniciais: 'R',
        nome: 'Rafael, professor de exemplo',
        foco: 'Conversação e pronúncia',
        horarios: 'Qui, 20h às 22h, e sáb, manhã',
        motivo: 'Foca em falar, e a simulação cabe nas quintas.',
      },
    ],
  },
  {
    id: 'violao',
    rotulo: 'Violão do zero',
    texto: [
      { t: 'Quero ' },
      { t: 'aprender violão', marca: true },
      { t: ' para acompanhar músicas simples. Posso ' },
      { t: 'aos sábados de manhã, por 1 hora', marca: true },
      { t: ', ao longo de ' },
      { t: '4 semanas', marca: true },
      { t: '.' },
    ],
    agenda: {
      dias: [
        { d: 'Seg' },
        { d: 'Ter' },
        { d: 'Qua', prof: [[18, 21]] },
        { d: 'Qui' },
        { d: 'Sex', prof: [[14, 17]] },
        { d: 'Sáb', aluno: [[8, 12]], prof: [[8, 12]] },
      ],
      resumo: 'Sábado, das 8h às 12h. A aula de 1 hora cabe em qualquer ponto dessa faixa.',
    },
    semanas: [
      { titulo: 'Postura e primeiros acordes', descricao: 'Segurar o violão sem dor e tocar dois acordes limpos.' },
      { titulo: 'Troca de acordes', descricao: 'Passar de um acorde a outro sem parar o ritmo.' },
      { titulo: 'Batida simples', descricao: 'Uma levada básica que serve para muitas canções.' },
      { titulo: 'Primeira música', descricao: 'Tocar uma canção inteira, do começo ao fim.' },
    ],
    professores: [
      {
        iniciais: 'L',
        nome: 'Lúcia, professora de exemplo',
        foco: 'Violão para iniciantes adultos',
        horarios: 'Sáb, 8h às 12h',
        motivo: 'Atende aos sábados de manhã e trabalha com quem começa do zero.',
      },
      {
        iniciais: 'T',
        nome: 'Tiago, professor de exemplo',
        foco: 'Acompanhamento de canções',
        horarios: 'Sáb, 9h às 11h',
        motivo: 'Ensina a tocar músicas inteiras desde as primeiras aulas.',
      },
    ],
  },
  {
    id: 'calculo',
    rotulo: 'Cálculo 1',
    texto: [
      { t: 'Preciso passar em ' },
      { t: 'Cálculo 1', marca: true },
      { t: ' daqui a ' },
      { t: '4 semanas', marca: true },
      { t: '. Estudo ' },
      { t: 'à noite, de segunda a quarta', marca: true },
      { t: '.' },
    ],
    agenda: {
      dias: [
        { d: 'Seg', aluno: [[19, 23]], prof: [[19, 22]] },
        { d: 'Ter', aluno: [[19, 23]], prof: [[19, 22]] },
        { d: 'Qua', aluno: [[19, 23]], prof: [[19, 22]] },
        { d: 'Qui', prof: [[8, 11]] },
        { d: 'Sex', prof: [[14, 18]] },
        { d: 'Sáb' },
      ],
      resumo: 'Segunda a quarta, das 19h às 22h. São três noites para escolher.',
    },
    semanas: [
      { titulo: 'Limites', descricao: 'Entender a ideia e resolver os tipos de limite mais cobrados.' },
      { titulo: 'Derivadas', descricao: 'Regras de derivação com exercícios de prova.' },
      { titulo: 'Aplicações', descricao: 'Máximos, mínimos e taxas de variação em problemas.' },
      { titulo: 'Integrais e simulado', descricao: 'Integrais básicas e uma prova completa para treinar.' },
    ],
    professores: [
      {
        iniciais: 'H',
        nome: 'Helena, professora de exemplo',
        foco: 'Cálculo para engenharia',
        horarios: 'Seg a qua, 19h às 22h',
        motivo: 'Tem horário nas três noites e usa provas antigas como treino.',
      },
      {
        iniciais: 'M',
        nome: 'Marcos, professor de exemplo',
        foco: 'Matemática para quem tem dificuldade',
        horarios: 'Ter e qua, 20h às 22h',
        motivo: 'Explica devagar e refaz o que não ficou claro.',
      },
    ],
  },
];
