// =============================================================
// advisor.js — AI Strategic Advisor (etapa 6)
// gera um parecer estratégico com o Gemini (Google).
//
// SEGURANÇA: a chave de API NUNCA fica no código nem no GitHub.
// cada pessoa cola a própria chave, que fica salva só no
// navegador dela (localStorage) e vai direto para o Google.
// =============================================================

// modelo do Gemini. se o Google lançar outro, mudamos aqui 
// se a cota gratuita acabar, vale testar o modelo "flash-lite".
const AI_MODEL = "gemini-3.8-flash";
const AI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent`;
const KEY_STORAGE = "prioritizer_gemini_key";

// -------------------------------------------------------------
// 1. A CHAVE: salvar, ler e esquecer (só neste navegador)
// try/catch: se o navegador bloquear o armazenamento, o app não quebra
// -------------------------------------------------------------
function getKey() {
  try { return localStorage.getItem(KEY_STORAGE) || ""; } catch (e) { return ""; }
}

function saveKey() {
  const key = document.getElementById("ai-key").value.trim();
  if (!key) return;
  try { localStorage.setItem(KEY_STORAGE, key); } catch (e) { /* segue sem salvar */ }
  document.getElementById("ai-key").value = "";
  updateKeyStatus();
}

function forgetKey() {
  try { localStorage.removeItem(KEY_STORAGE); } catch (e) { /* nada a fazer */ }
  updateKeyStatus();
}

// Mostra o campo da chave OU o aviso "chave salva"
function updateKeyStatus() {
  const hasKey = getKey() !== "";
  document.getElementById("ai-key-form").hidden = hasKey;
  document.getElementById("ai-key-saved").hidden = !hasKey;
  document.getElementById("btn-advisor").disabled = !hasKey;
}

// -------------------------------------------------------------
// 2. O PROMPT: o "briefing" que a IA recebe
// -------------------------------------------------------------
function buildPrompt() {
  const ini = initiative();          // vem do export.js
  const score = finalScore();        // vem do app.js
  const v = verdict(score);

  let details = "";
  DIMENSIONS.forEach(dim => {
    details += `\n- ${dim.name} (peso ${Math.round(dim.weight * 100)}%): média ${dimensionAverage(dim).toFixed(1)}`;
    dim.criteria.forEach(c => {
      details += `\n    • ${c.name}: ${scores[c.id]}/5 (${c.hint})`;
    });
  });

  return `Você é um consultor sênior de estratégia de IA e dados.
Analise a iniciativa abaixo, avaliada com um framework de priorização (notas de 1 a 5).

INICIATIVA: ${ini.name}
DESCRIÇÃO: ${ini.description || "(não informada)"}
SCORE FINAL PONDERADO: ${score.toFixed(2)} / 5
VEREDITO DO FRAMEWORK: ${v.label} (corte: acima de ${CUTOFF})

NOTAS POR DIMENSÃO:${details}

Escreva em português do Brasil, de forma objetiva e executiva, citando as notas quando fizer sentido.
Responda APENAS com um JSON válido, sem texto antes ou depois, com estas 4 chaves:
{
  "analise_negocio": "1 parágrafo: potencial de valor e principais tensões entre as dimensões",
  "riscos_mitigacao": "1 parágrafo: os 2 ou 3 maiores riscos (use as notas mais baixas) e como mitigar",
  "veredito_executivo": "1 a 2 frases: recomendação clara (ex.: aprovar, aprovar com condições, amadurecer)",
  "caminho_mvp": "1 parágrafo: um primeiro passo pequeno e testável em até 90 dias"
}`;
}

// -------------------------------------------------------------
// 3. A CHAMADA: envia o prompt ao Gemini e recebe o parecer
// "async/await" = espera a resposta da internet sem travar a página
// -------------------------------------------------------------
async function generateAdvice() {
  const btn = document.getElementById("btn-advisor");
  const output = document.getElementById("ai-output");
  const errorBox = document.getElementById("ai-error");

  btn.disabled = true;
  btn.textContent = "Gerando parecer... ✧";
  errorBox.hidden = true;
  output.hidden = true;

  try {
    const response = await fetch(AI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": getKey()
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt() }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();

    // se o Google devolveu erro (chave inválida, cota esgotada...)
    if (!response.ok) {
      throw new Error(data.error ? data.error.message : `Erro ${response.status}`);
    }

    // junta os pedaços de texto da resposta (ignorando o "raciocínio" interno)
    const parts = data.candidates[0].content.parts;
    let text = parts.filter(p => p.text && !p.thought).map(p => p.text).join("");
    text = text.replace(/```json|```/g, "").trim(); // tira cercas de código, se vierem

    showAdvice(JSON.parse(text));
  } catch (error) {
    errorBox.textContent = "Não foi possível gerar o parecer: " + error.message;
    errorBox.hidden = false;
  } finally {
    btn.disabled = getKey() === "";
    btn.textContent = "Gerar parecer IA";
  }
}

// -------------------------------------------------------------
// 4. MOSTRAR: coloca o parecer na tela
// textContent (e não innerHTML): o texto da IA entra como texto puro,
// sem risco de virar código dentro da página
// -------------------------------------------------------------
function showAdvice(advice) {
  document.getElementById("ai-analise").textContent = advice.analise_negocio || "";
  document.getElementById("ai-riscos").textContent = advice.riscos_mitigacao || "";
  document.getElementById("ai-veredito").textContent = advice.veredito_executivo || "";
  document.getElementById("ai-mvp").textContent = advice.caminho_mvp || "";
  document.getElementById("ai-output").hidden = false;
}

// ao abrir os resultados de novo, apaga o parecer antigo
// (as notas podem ter mudado, então o parecer ficaria desatualizado)
function resetAdvice() {
  document.getElementById("ai-output").hidden = true;
  document.getElementById("ai-error").hidden = true;
}

// -------------------------------------------------------------
// liga os botões às funções
// -------------------------------------------------------------
document.getElementById("btn-save-key").addEventListener("click", saveKey);
document.getElementById("btn-forget-key").addEventListener("click", forgetKey);
document.getElementById("btn-advisor").addEventListener("click", generateAdvice);
document.getElementById("btn-results").addEventListener("click", resetAdvice);

updateKeyStatus();
