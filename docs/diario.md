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

---

## Etapa 2: score ao vivo

### O que fiz

- Criei a regra de decisão (`CUTOFF = 3.5`) no `criteria.js`, junto com o resto da metodologia.
- Escrevi os cálculos no `app.js`: média de cada dimensão, nota final ponderada e veredito.
- Fiz a nota recalcular a cada clique e criei o card do *live score*, que fica fixo no topo da tela.
- Publiquei o app no GitHub Pages: [jmartellet.github.io/prioritizer-framework](https://jmartellet.github.io/prioritizer-framework/)

### Como o score é calculado

1. **Média da dimensão:** média simples dos critérios. Ex.: notas 4, 3, 3 e 5 → média 3,75.
2. **Nota final:** soma de cada média × o peso da dimensão.
3. **Veredito:** nota acima de 3,5 → **Candidato à execução**. Igual ou abaixo → **Backlog**.

### Por que o corte é 3,5
A regra de corte transforma a nota em uma decisão clara (executar ou ir para o backlog) e garante que todas as iniciativas sejam julgadas pelo mesmo critério.

O 3,5 foi escolhido porque, na escala de 1 a 5, o 3 é o ponto neutro: um projeto nota 3 é "ok", mas não se destaca. Exigir uma nota acima de 3,5 significa que a iniciativa precisa ser claramente melhor do que a média para receber investimento. Por isso, um 3,50 exato fica no backlog: na dúvida, a ideia volta para ser amadurecida.

### O que aprendi
As contas do código são as mesmas de uma planilha: `MÉDIA` para cada dimensão, `SOMARPRODUTO` com os pesos e `SE` para o veredito. E o HTML e o JavaScript "conversam" pelos `id`s: o código procura a etiqueta `score` na página e escreve a nota dentro dela.

De calculadora a ferramenta de decisão: como a nota se atualiza a cada clique, fica claro na hora quais critérios mais pesam no resultado. Em vez de perguntar "essa ideia é boa?", o time passa a discutir "o que falta para ela valer o investimento?", com base em dados, e não em opinião.

---

## Etapa 3: visual 

### O que fiz

- Separei o visual em um arquivo próprio, `css/style.css`. O HTML agora só aponta para ele com um `<link>`.
- Criei variáveis de cor (`--pink`, `--green`, `--amber`...): o tom de rosa é definido uma vez e usado no app inteiro.
- Montei o layout em duas colunas: formulário à esquerda e live score à direita, acompanhando a rolagem.
- Adaptei para celular: em telas pequenas, vira uma coluna só e o score fica grudado no topo.
- Usei a fonte Inter, do Google Fonts.

### Por que rosa

Rosa porque não sou obrigada 💅

Ferramenta de trabalho não precisa ser cinza nem azul corporativo. O projeto nasceu de uma dor minha e foi pensado para o meu uso, então o visual também tem a minha cara.

### O que aprendi

- **HTML × CSS:** o HTML diz *o que* aparece na tela; o CSS diz *como* aparece.
- **Variáveis de cor:** funcionam como o `criteria.js`: definir uma vez, usar em todo lugar. Para mudar o rosa do app inteiro, troco uma linha.
- **Responsividade:** o `@media` adapta o layout para telas pequenas, como a do celular.
- **Organização:** separar o projeto em arquivos (HTML para a estrutura, CSS para o visual, JS para a lógica) deixa cada parte mais fácil de entender e de mudar.
