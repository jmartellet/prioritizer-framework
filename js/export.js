// =============================================================
// export.js exportações do relatório (etapa 5)
// CSV (para Excel), PDF (pela impressão do navegador)
// e um bloco de texto pronto para colar no Jira.
// usa os dados e cálculos dos outros arquivos.
// =============================================================

// ajudante: número no formato brasileiro (3.59 → "3,59")
function br(n, casas) {
  return n.toFixed(casas).replace(".", ",");
}

// ajudante: nome e descrição da iniciativa
function initiative() {
  return {
    name: document.getElementById("name").value.trim() || "Iniciativa sem nome",
    description: document.getElementById("description").value.trim()
  };
}

// -------------------------------------------------------------
// 1. CSV uma linha por critério, para abrir no Excel
// -------------------------------------------------------------
function exportCSV() {
  const ini = initiative();
  const score = finalScore();

  // separador ";" porque o Excel em português usa a vírgula nos decimais
  const rows = [["Iniciativa", "Dimensão", "Peso", "Critério", "Nota (1-5)", "Média da dimensão"]];

  DIMENSIONS.forEach(dim => {
    dim.criteria.forEach(c => {
      rows.push([
        ini.name,
        dim.name,
        Math.round(dim.weight * 100) + "%",
        c.name,
        scores[c.id],
        br(dimensionAverage(dim), 2)
      ]);
    });
  });

  rows.push([]);
  rows.push(["Score final", br(score, 2)]);
  rows.push(["Veredito", verdict(score).label]);

  // cada célula entre aspas, para nomes com ";" não quebrarem a tabela
  const csv = rows
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  // "\uFEFF" avisa o Excel que o arquivo tem acentos (UTF-8)
  download(`priorizacao-${slug(ini.name)}.csv`, "\uFEFF" + csv, "text/csv;charset=utf-8");
}

// ajudante: cria o arquivo e "clica" num link invisível para baixar
function download(filename, content, type) {
  const blob = new Blob([content], { type: type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ajudante: "Automação de Marketing" → "automacao-de-marketing"
function slug(text) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // tira acentos
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// -------------------------------------------------------------
// 2. PDF abre a impressão do navegador ("Salvar como PDF")
// O visual da impressão fica no style.css, em @media print
// -------------------------------------------------------------
function exportPDF() {
  window.print();
}

// -------------------------------------------------------------
// 3. JIRA texto no formato do Jira (wiki markup)
// h1./h2. = títulos, *texto* = negrito, ||cabeçalho|| e |célula|
// -------------------------------------------------------------
function jiraMarkup() {
  const ini = initiative();
  const score = finalScore();
  const v = verdict(score);
  const icon = v.className === "go" ? "(/)" : "(!)"; // ícones do Jira: ✓ e !

  const lines = [];
  lines.push(`h1. [AI PRIORITIZATION] ${ini.name}`);
  lines.push("");
  lines.push("h2. Sumário Executivo");
  lines.push(`*Status:* ${icon} ${v.label.toUpperCase()}`);
  lines.push(`*Score final ponderado:* ${br(score, 2)} / 5,00`);
  if (ini.description) lines.push(`*Descrição:* ${ini.description}`);
  lines.push("");
  lines.push("h2. Detalhamento por Dimensão");
  lines.push("||Dimensão||Peso||Score (1-5)||");
  DIMENSIONS.forEach(dim => {
    lines.push(`|${dim.name}|${Math.round(dim.weight * 100)}%|${br(dimensionAverage(dim), 1)}|`);
  });
  lines.push("");
  lines.push("_Gerado pelo AI Prioritizer Framework_");

  return lines.join("\n");
}

// mostra o texto do Jira na caixa escura da página de resultados
function renderJira() {
  document.getElementById("jira-text").textContent = jiraMarkup();
}

// copia o texto do Jira para a área de transferência
function copyJira() {
  const btn = document.getElementById("btn-copy");
  navigator.clipboard.writeText(jiraMarkup()).then(() => {
    btn.textContent = "Copiado! ✓";
    setTimeout(() => { btn.textContent = "Copiar Markdown"; }, 2000);
  });
}

// -------------------------------------------------------------
// liga os botões às funções
// -------------------------------------------------------------
document.getElementById("btn-csv").addEventListener("click", exportCSV);
document.getElementById("btn-pdf").addEventListener("click", exportPDF);
document.getElementById("btn-copy").addEventListener("click", copyJira);

// sempre que abrir os resultados, atualiza o texto do Jira
document.getElementById("btn-results").addEventListener("click", renderJira);
