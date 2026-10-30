// =============================================================
// criteria.js ⟢ o "cérebro" do framework
// Aqui ficam as dimensões, os pesos e os critérios de avaliação.
// ⋆⟢⋆⟢⋆⟢ se formos a mudar a metodologia, é aqui que iremos mexer ⋆⟢⋆⟢⋆

const DIMENSIONS = [
  {
    id: "impacto",
    name: "Impacto de Negócio",
    weight: 0.30, // 30% da nota final
    criteria: [
      { id: "financeiro", name: "Impacto Financeiro", hint: "Avalie o potencial de retorno financeiro direto." },
      { id: "eficiencia", name: "Eficiência Operacional", hint: "Avalie ganhos de tempo e redução de erros." },
      { id: "vantagem", name: "Vantagem Estratégica", hint: "O quão difícil será para o concorrente copiar?" },
      { id: "cliente", name: "Impacto no Cliente", hint: "Muda a vida do usuário final?" }
    ]
  },
  {
    id: "maturidade",
    name: "Maturidade IA & Dados",
    weight: 0.20,
    criteria: [
      { id: "dados", name: "Qualidade dos Dados", hint: "1 = Dados inexistentes, 5 = Prontos para treinamento" },
      { id: "modelo", name: "Complexidade do Modelo", hint: "1 = P&D complexo, 5 = Modelo conhecido/SaaS" },
      { id: "infra", name: "Infraestrutura", hint: "A empresa suporta rodar isso hoje?" },
      { id: "clareza", name: "Clareza Técnica", hint: "Temos certeza que IA resolve esse problema?" }
    ]
  },
  {
    id: "viabilidade",
    name: "Viabilidade de Implementação",
    weight: 0.15,
    criteria: [
      { id: "ttv", name: "Time-to-Value", hint: "1 = mais de 12 meses, 5 = menos de 90 dias" },
      { id: "custo", name: "Custo Total (Build & Run)", hint: "1 = Muito alto, 5 = Muito baixo" },
      { id: "risco", name: "Risco Técnico & Operacional", hint: "1 = Risco crítico, 5 = Baixo risco" },
      { id: "integracao", name: "Integração Processual", hint: "1 = Exige mudança cultural drástica, 5 = Plug-and-play" }
    ]
  },
  {
    id: "roi",
    name: "Retorno (ROI)",
    weight: 0.20,
    criteria: [
      { id: "metricas", name: "Clareza de Métricas", hint: "1 = ROI subjetivo, 5 = KPI direto e mensurável" },
      { id: "escala", name: "Escalabilidade", hint: "1 = Crescimento linear, 5 = Exponencial" },
      { id: "payback", name: "Horizonte de Payback", hint: "1 = Longo prazo, 5 = Imediato/Curto" }
    ]
  },
  {
    id: "alinhamento",
    name: "Alinhamento Estratégico",
    weight: 0.15,
    criteria: [
      { id: "okrs", name: "Alinhamento com OKRs", hint: "1 = Fora do foco, 5 = Prioridade máxima" },
      { id: "sponsor", name: "Sponsorship Executivo", hint: "Temos um diretor/VP apadrinhando?" }
    ]
  }
];
