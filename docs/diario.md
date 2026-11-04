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

---

## Etapa 4: página de resultados 📊

### O que fiz

- Criei o arquivo [`js/results.js`](../js/results.js), que monta o "Relatório de Priorização".
- Adicionei o botão **Ver resultados** e o **← Voltar**: as duas telas ficam no mesmo arquivo, e o código só mostra uma e esconde a outra.
- Desenhei o radar **Footprint de Valor** com a biblioteca [Chart.js](https://www.chartjs.org/), mostrando a média de cada dimensão.
- Criei as barras por dimensão: verdes acima de 3,5 e amarelas abaixo, usando a mesma régua do veredito.

### Por que um radar

A nota final resume tudo em um número, mas esconde *onde* está a força e *onde* está o risco de cada projeto. Pense em dois projetos com a mesma nota 3,6: um equilibrado, com todas as dimensões perto de 3,6, e outro com Impacto 5 e Maturidade 2. A nota é igual, mas o "formato" do radar é bem diferente.

Com o radar, dá para ver de forma simples onde o projeto é forte e onde ele é fraco. O primeiro é uma aposta segura. O segundo tem um potencial enorme, mas a empresa ainda não tem dados ou estrutura para entregá-lo. A decisão deixa de ser só "sim ou não" e passa a ser "o que precisamos resolver antes", por exemplo, investir primeiro na qualidade dos dados.

### O que aprendi

- **Reaproveitar funções:** o `results.js` usa as funções de cálculo do `app.js` (`finalScore`, `verdict`, `dimensionAverage`) sem refazer nenhuma conta. Se eu mudar uma regra, ela vale nas duas telas.
- **Usar uma biblioteca pronta:** em vez de desenhar o radar do zero, usei o Chart.js. Eu só entrego os nomes, os números e as cores, e ele desenha.
- **Mostrar e esconder telas:** as duas telas ficam no mesmo arquivo, e o atributo `hidden` funciona como uma cortina: abre uma e fecha a outra, sem carregar uma página nova.
- **Regra de três nas barras:** `(média ÷ 5) × 100` transforma a nota em porcentagem. Nota 5 = barra cheia, nota 4 = 80%.

---

## Etapa 5: exportações 📤

### O que fiz

- Criei o arquivo [`js/export.js`](../js/export.js) com três formas de levar o relatório para fora do app:
  - **CSV:** uma linha por critério, pronto para abrir no Excel em português (separador `;`, vírgula nos decimais e acentos certos).
  - **PDF:** pela impressão do navegador (`window.print()`), com um estilo de impressão próprio (`@media print`) que esconde botões e mantém as cores.
  - **Jira:** um texto no formato do Jira (*wiki markup*), com sumário executivo e tabela por dimensão, copiado com um clique.

### Por que exportar

Uma ferramenta de decisão que não conversa com as ferramentas do time acaba esquecida. Por isso, cada formato tem um destino:

- **CSV:** para quem quer comparar várias iniciativas numa planilha.
- **PDF:** para levar a decisão a um comitê ou à liderança.
- **Jira:** para o time de produto ou tecnologia transformar a iniciativa em backlog.

### O que aprendi

- **CSV para o Excel brasileiro:** usar `;` como separador, vírgula nos decimais e o "aviso invisível" `\uFEFF` no começo do arquivo para os acentos aparecerem certos.
- **Estilo de impressão:** o `@media print` muda a página só na hora de imprimir, sem afetar a tela.
- **Funções ajudantes:** funções pequenas, que fazem uma coisa só, deixam o código mais fácil de ler e de reaproveitar.

---

## Etapa 6: AI Strategic Advisor ✧

### O que fiz

- Criei o arquivo [`js/advisor.js`](../js/advisor.js), que gera um parecer estratégico com o Gemini (`gemini-3.8-flash`).
- O app monta um *prompt* automático com o nome, a descrição, o score e cada nota da iniciativa, e pede a resposta em JSON com 4 partes: análise de negócio, riscos e mitigação, veredito executivo e caminho para o MVP.
- Cada pessoa usa a própria chave de API, que fica salva só no navegador dela (`localStorage`) e nunca vai para o GitHub.
- A resposta da IA entra na página como texto puro (`textContent`), sem risco de virar código.

### Por que cada um usa a própria chave

Escolhi que cada pessoa use a própria chave do Gemini por dois motivos:

- **Segurança:** uma chave escrita no código de um repositório público pode ser copiada por qualquer pessoa, que passaria a usar (e gastar) a minha conta. Assim, nenhuma chave fica exposta.
- **Acesso sem burocracia:** qualquer pessoa consegue usar o app de graça, criando a própria chave em poucos minutos no Google AI Studio, sem depender de mim nem de um servidor.

### O que aprendi

- **API e chave de API:** uma API é a "porta" pela qual um programa conversa com outro serviço, no caso o Gemini. A chave é a identificação de quem está pedindo.
- **`fetch` com `async/await`:** o app envia o pedido pela internet e espera a resposta sem travar a página.
- **O prompt define a qualidade:** quanto mais contexto a IA recebe (notas, dicas dos critérios, descrição), mais específico é o parecer.
- **Resposta em JSON:** pedir um formato fixo permite separar o parecer em caixas diferentes na tela.
- **`localStorage`:** uma "gaveta" do navegador para guardar informações só no computador de quem usa.
- **Segurança com `textContent`:** a resposta da IA entra como texto puro, sem risco de virar código na página.
- **A documentação muda rápido:** os modelos do Gemini mudaram de versão várias vezes. Por isso, o nome do modelo fica numa linha só, fácil de trocar.
