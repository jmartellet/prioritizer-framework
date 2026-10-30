# Diário de construção · Build log

Registro de como o AI Prioritizer Framework foi construído, etapa por etapa.

---

## Etapa 1: estrutura e critérios

### O que fiz

- Criei a estrutura do projeto: `index.html` (a página), `js/criteria.js` (a metodologia) e `js/app.js` (a lógica da tela).
- Transformei o framework em dados: 5 dimensões, cada uma com peso e critérios avaliados de 1 a 5.

### Por que separei a metodologia em um arquivo próprio

Os critérios e pesos são a parte "de negócio" do projeto. Deixando tudo em `criteria.js`, dá para ajustar a metodologia (mudar um peso, incluir um critério) sem mexer no resto do código.

### Os pesos

| Dimensão | Peso |
|---|---|
| Impacto de Negócio | 30% |
| Maturidade IA & Dados | 20% |
| Retorno (ROI) | 20% |
| Viabilidade de Implementação | 15% |
| Alinhamento Estratégico | 15% |

### Por que Impacto de Negócio pesa mais

O Impacto de Negócio tem o maior peso (30%) porque é o critério que mostra o quanto a iniciativa pode ajudar a empresa, seja aumentando vendas, reduzindo custos ou melhorando a experiência do cliente. Os outros critérios avaliam se temos condições de entregar esse resultado, como dados disponíveis, retorno financeiro, facilidade de execução e alinhamento com a estratégia.

A decisão final considera todos eles juntos, mas dar mais peso ao impacto evita que a empresa invista em projetos de IA só porque são fáceis ou estão na moda, sem resolver problemas importantes.

Ao mesmo tempo, como representa menos de um terço da nota, ele não decide sozinho: uma ideia muito valiosa, mas difícil de colocar em prática, não passa na frente de outra que também traz bons resultados e pode ser realizada de fato.

### O que aprendi

- **Metodologia como dados:** dá para guardar a metodologia como uma lista de dimensões e critérios e deixar o código montar a tela sozinho. Se eu quiser mudar um peso ou incluir um critério, mexo só em um arquivo.
- **Fundamentos de JavaScript:** aprendi o que são funções, repetições (`for` e `forEach`) e eventos de clique. Com poucas linhas, o código cria os 17 critérios e os 85 botões da tela.
- **Paralelo com o meu trabalho:** separar a parte de negócio (os critérios) da parte técnica (a tela) é parecido com o que faço com tracking: primeiro definir o que medir, depois como implementar.
