// =============================================================
// app.js ✦ a parte que "desenha" a tela
// lê as dimensões do criteria.js e cria o formulário sozinho.
// =============================================================

// guarda a nota (1 a 5) de cada critério. começa tudo em 3 (neutro).
const scores = {};
DIMENSIONS.forEach(dim => {
  dim.criteria.forEach(c => { scores[c.id] = 3; });
});

// Cria um bloco (card) para cada dimensão
function renderForm() {
  const container = document.getElementById("dimensions");
  container.innerHTML = "";

  DIMENSIONS.forEach(dim => {
    const card = document.createElement("section");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <h2>${dim.name}</h2>
        <span class="weight">Peso: ${Math.round(dim.weight * 100)}%</span>
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
        });

        scale.appendChild(btn);
      }

      card.appendChild(row);
    });

    container.appendChild(card);
  });
}

renderForm();
