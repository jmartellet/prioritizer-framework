// =============================================================
// app.js — a parte que "desenha" a tela e calcula o score
// lê as dimensões do criteria.js e cria o formulário sozinho.
// =============================================================

// guarda a nota (1 a 5) de cada critério. Começa tudo em 3 (neutro).
const scores = {};
DIMENSIONS.forEach(dim => {
  dim.criteria.forEach(c => { scores[c.id] = 3; });
});

// -------------------------------------------------------------
// CÁLCULOS (Etapa 2)
// -------------------------------------------------------------

// média simples dos critérios de UMA dimensão
function dimensionAverage(dim) {
  let total = 0;
  dim.criteria.forEach(c => { total += scores[c.id]; });
  return total / dim.criteria.length;
}

// nota final = soma de (média da dimensão × peso da dimensão)
function finalScore() {
  let total = 0;
  DIMENSIONS.forEach(dim => {
    total += dimensionAverage(dim) * dim.weight;
  });
  // arredonda para 2 casas: a nota que aparece na tela é a mesma usada na decisão
  return Math.round(total * 100) / 100;
}

// regra de negócio: acima do corte, vai para execução
function verdict(score) {
  if (score > CUTOFF) {
    return { label: "Candidato à execução", className: "go" };
  }
  return { label: "Backlog", className: "backlog" };
}

// atualiza na tela as médias, a nota final e o veredito
function updateScore() {
  DIMENSIONS.forEach(dim => {
    document.getElementById(`avg-${dim.id}`).textContent =
      dimensionAverage(dim).toFixed(1);
  });

  const score = finalScore();
  const v = verdict(score);

  const scoreEl = document.getElementById("score");
  scoreEl.textContent = score.toFixed(2);
  scoreEl.className = `score ${v.className}`;

  const verdictEl = document.getElementById("verdict");
  verdictEl.textContent = v.label;
  verdictEl.className = `verdict ${v.className}`;
}

// -------------------------------------------------------------
// FORMULÁRIO (etapa 1)
// -------------------------------------------------------------

// cria um bloco (card) para cada dimensão
function renderForm() {
  const container = document.getElementById("dimensions");
  container.innerHTML = "";

  DIMENSIONS.forEach(dim => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <h2>${dim.name}</h2>
        <span class="weight">Peso: ${Math.round(dim.weight * 100)}% · Média: <b id="avg-${dim.id}">-</b></span>
      </div>
    `;

    dim.criteria.forEach(c => {
      const row = document.createElement("div");
      row.className = "criterion";
      row.innerHTML = `
        <div class="criterion-title">
          <strong>${c.name}</strong>
          <span class="value" id="value-${c.id}">${scores[c.id]}</span>
        </div>
        <div class="scale"></div>
        <small class="hint">${c.hint}</small>
      `;

      // botões de 1 a 5
      const scale = row.querySelector(".scale");
      for (let n = 1; n <= 5; n++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = n;
        if (n === scores[c.id]) btn.classList.add("active");

        btn.addEventListener("click", () => {
          scores[c.id] = n;
          // tira o destaque dos outros botões e marca o clicado
          scale.querySelectorAll("button").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          document.getElementById(`value-${c.id}`).textContent = n;
          updateScore(); // NOVO: recalcula a nota a cada clique
        });

        scale.appendChild(btn);
      }

      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

renderForm();
updateScore(); // calcula a nota inicial assim que a página abre
