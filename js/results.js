// =============================================================
// results.js — a página de resultados (etapa 4)
// monta o "Relatório de Priorização": radar, barras e veredito.
// usa as funções do app.js (dimensionAverage, finalScore, verdict).
// =============================================================

let radarChart = null; // guarda o gráfico para poder atualizar depois

// troca de tela: esconde a avaliação e mostra os resultados
function showResults() {
  document.getElementById("eval-view").hidden = true;
  document.getElementById("results-view").hidden = false;
  // primeiro mostra a tela, depois desenha: o gráfico precisa
  // estar visível para saber o tamanho que deve ter
  renderResults();
  window.scrollTo(0, 0);
}

// troca de tela: volta para a avaliação
function showEvaluation() {
  document.getElementById("results-view").hidden = true;
  document.getElementById("eval-view").hidden = false;
  window.scrollTo(0, 0);
}

// preenche a página de resultados com os números atuais
function renderResults() {
  // 1. Nome da iniciativa (ou um texto padrão, se estiver vazio)
  const name = document.getElementById("name").value.trim() || "Iniciativa sem nome";
  document.getElementById("result-name").textContent = name;

  // 2. Nota final e veredito
  const score = finalScore();
  const v = verdict(score);
  const scoreEl = document.getElementById("result-score");
  scoreEl.textContent = score.toFixed(2);
  scoreEl.className = `score ${v.className}`;
  const verdictEl = document.getElementById("result-verdict");
  verdictEl.textContent = v.label;
  verdictEl.className = `verdict ${v.className}`;

  // 3. Uma barra para cada dimensão
  const bars = document.getElementById("result-bars");
  bars.innerHTML = "";
  DIMENSIONS.forEach(dim => {
    const avg = dimensionAverage(dim);
    const color = avg > CUTOFF ? "go" : "backlog"; // mesma régua do veredito
    const width = (avg / 5) * 100;                 // nota 5 = barra cheia (100%)

    bars.innerHTML += `
      <div class="bar-row">
        <div class="bar-label"><span>${dim.name}</span><b>${avg.toFixed(1)}</b></div>
        <div class="bar-track"><div class="bar-fill ${color}" style="width: ${width}%"></div></div>
      </div>
    `;
  });

  // 4. Gráfico de radar (Chart.js)
  renderRadar();
}

// desenha (ou atualiza) o radar "Footprint de Valor"
function renderRadar() {
  // nomes compridos viram 2 linhas, para não cortar nas bordas do gráfico
  // ex.: "Viabilidade de Implementação" → ["Viabilidade de", "Implementação"]
  const labels = DIMENSIONS.map(dim => {
    const name = dim.name;
    if (name.length <= 12) return name;         // nome curto: fica numa linha
    const middle = name.length / 2;
    // procura o espaço mais perto do meio do nome e quebra ali
    let cut = name.indexOf(" ");
    for (let i = 0; i < name.length; i++) {
      if (name[i] === " " && Math.abs(i - middle) < Math.abs(cut - middle)) cut = i;
    }
    return [name.slice(0, cut), name.slice(cut + 1)];
  });
  const data = DIMENSIONS.map(dim => dimensionAverage(dim));

  // se o gráfico já existe, só troca os números
  if (radarChart) {
    radarChart.data.datasets[0].data = data;
    radarChart.update();
    return;
  }

  // se ainda não existe, cria
  const pink = getComputedStyle(document.documentElement).getPropertyValue("--pink").trim();
  radarChart = new Chart(document.getElementById("radar"), {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "Média da dimensão",
        data: data,
        backgroundColor: "rgba(224, 51, 122, 0.25)",
        borderColor: pink,
        borderWidth: 2,
        pointBackgroundColor: pink
      }]
    },
    options: {
      layout: { padding: 16 },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 5,
          ticks: { stepSize: 1, display: false },
          pointLabels: { font: { family: "Inter", size: 11, weight: "600" } }
        }
      }
    }
  });
}

// liga os botões às funções
document.getElementById("btn-results").addEventListener("click", showResults);
document.getElementById("btn-back").addEventListener("click", showEvaluation);
