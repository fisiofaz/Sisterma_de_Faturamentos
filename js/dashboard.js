import { obterTotaisFaturamento, prepararDadosGraficoDashboard, formatarMoeda, formatarDataBR, obterDados, calcularTotais, calcularDestaques } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  atualizarDestaques();
  carregarGraficoDashboard();
  exibirResumoTotais();
  exibirDestaquesMes();
  atualizarDashboard(obterFaturamentoConsolidado()); // Chama a função inicial para atualizar o dashboard
});

function atualizarDestaques() {
  const ortofisiusTotais = obterTotaisFaturamento('faturamento_ortofisius');
  document.getElementById('ortofisius-total-dia').textContent = ortofisiusTotais.totalDia;
  document.getElementById('ortofisius-total-mes').textContent = ortofisiusTotais.totalMes;

  const fisiomedCentroTotais = obterTotaisFaturamento('faturamento_fisiomed_centro');
  document.getElementById('fisiomed-centro-total-dia').textContent = fisiomedCentroTotais.totalDia;
  document.getElementById('fisiomed-centro-total-mes').textContent = fisiomedCentroTotais.totalMes;

  const fisiomedCamobiTotais = obterTotaisFaturamento('faturamento_fisiomed_camobi');
  document.getElementById('fisiomed-camobi-total-dia').textContent = fisiomedCamobiTotais.totalDia;
  document.getElementById('fisiomed-camobi-total-mes').textContent = fisiomedCamobiTotais.totalMes;
}

function carregarGraficoDashboard() {
  const lojas = [
    { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
    { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
    { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
  ];

  const dadosGrafico = prepararDadosGraficoDashboard(lojas);
  const ctx = document.getElementById('grafico-dashboard').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: dadosGrafico,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: valor => 'R$ ' + valor.toFixed(2)
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'Faturamento Total por Loja'
        }
      }
    }
  });
}

function obterFaturamentoConsolidado() {
  const dadosOrtofisius = obterDados("faturamento_ortofisius").map(item => ({ ...item, loja: "Ortofisi’us" }));
  const dadosFisiomedCentro = obterDados("faturamento_fisiomedcentro").map(item => ({ ...item, loja: "Fisiomed Centro" }));
  const dadosFisiomedCamobi = obterDados("faturamento_fisiomedcamobi").map(item => ({ ...item, loja: "Fisiomed Camobi" }));
  return [...dadosOrtofisius, ...dadosFisiomedCentro, ...dadosFisiomedCamobi];
}

// Processar totais
function exibirResumoTotais() {
  const dadosOrtofisius = obterDados("faturamento_ortofisius");
  const dadosFisiomedCentro = obterDados("faturamento_fisiomedcentro");
  const dadosFisiomedCamobi = obterDados("faturamento_fisiomedcamobi");

  const totalOrtofisius = calcularTotais(dadosOrtofisius);
  const totalCentro = calcularTotais(dadosFisiomedCentro);
  const totalCamobi = calcularTotais(dadosFisiomedCamobi);
  const totalGeral = totalOrtofisius + totalCentro + totalCamobi;

  document.getElementById("resumo-totais").innerHTML = `
    <h2>Totais por Loja</h2>
    <ul>
      <li>🩺 Ortofisi’us: ${formatarMoeda(totalOrtofisius)}</li>
      <li>🏥 Fisiomed Centro: ${formatarMoeda(totalCentro)}</li>
      <li>🧑‍⚕️ Fisiomed Camobi: ${formatarMoeda(totalCamobi)}</li>
      <li><strong>💰 Total Geral: ${formatarMoeda(totalGeral)}</strong></li>
    </ul>
  `;
}

// Destaques do mês
function exibirDestaquesMes() {
  const dadosOrtofisius = obterDados("faturamento_ortofisius");
  const dadosFisiomedCentro = obterDados("faturamento_fisiomedcentro");
  const dadosFisiomedCamobi = obterDados("faturamento_fisiomedcamobi");

  const destaques = {
    Ortofisius: calcularDestaques(dadosOrtofisius),
    Centro: calcularDestaques(dadosFisiomedCentro),
    Camobi: calcularDestaques(dadosFisiomedCamobi),
  };

  document.getElementById("destaques-mes").innerHTML = `
    <h2>Destaques do Mês</h2>
    <ul>
      <li><strong>Ortofisi’us:</strong> Maior: ${formatarMoeda(destaques.Ortofisius?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Ortofisius?.media || 0)}, Dia do Pico: ${destaques.Ortofisius?.diaMaior}</li>
      <li><strong>Centro:</strong> Maior: ${formatarMoeda(destaques.Centro?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Centro?.media || 0)}, Dia do Pico: ${destaques.Centro?.diaMaior}</li>
      <li><strong>Camobi:</strong> Maior: ${formatarMoeda(destaques.Camobi?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Camobi?.media || 0)}, Dia do Pico: ${destaques.Camobi?.diaMaior}</li>
    </ul>
  `;
}

// Gráfico
const ctx = document.getElementById("graficoFaturamento").getContext("2d");
let chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Ortofisi’us", "Fisiomed Centro", "Fisiomed Camobi"],
    datasets: [
      {
        label: "Faturamento (R$)",
        data: [totalOrtofisius, totalCentro, totalCamobi],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => formatarMoeda(ctx.raw) } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (valor) => formatarMoeda(valor) },
      },
    },
  },
});

// Atualizar gráfico com novos dados
function atualizarGrafico(dados) {
  const valores = [
    calcularTotais(dados.filter((d) => d.loja === "Ortofisi’us")),
    calcularTotais(dados.filter((d) => d.loja === "Fisiomed Centro")),
    calcularTotais(dados.filter((d) => d.loja === "Fisiomed Camobi")),
  ];

  chart.data.datasets[0].data = valores;
  chart.update();
}

// Resumo filtrado
function calcularResumo(dados) {
  const total = dados.reduce((acc, cur) => acc + cur.valor, 0);
  const media = dados.length ? total / dados.length : 0;
  const maior = dados.length ? Math.max(...dados.map((i) => i.valor)) : 0;
  const menor = dados.length ? Math.min(...dados.map((i) => i.valor)) : 0;

  return { total, media, maior, menor };
}

function atualizarDashboard(dados) {
  const resumo = calcularResumo(dados);

  document.getElementById("resumo").innerHTML = `
    <li><strong>Total:</strong> ${formatarMoeda(resumo.total)}</li>
    <li><strong>Média:</strong> ${formatarMoeda(resumo.media)}</li>
    <li><strong>Maior Valor:</strong> ${formatarMoeda(resumo.maior)}</li>
    <li><strong>Menor Valor:</strong> ${formatarMoeda(resumo.menor)}</li>
  `;

  atualizarGrafico(dados);
}

// Filtro por mês
document.getElementById("mesFiltro").addEventListener("change", (e) => {
  const mesSelecionado = e.target.value; // yyyy-mm
  if (!mesSelecionado) return;

  const filtrados = faturamento.filter((item) =>
    item.data.startsWith(mesSelecionado)
  );

  atualizarDashboard(filtrados);
});

// Exportar PDF
function exportarPDF() {
  const elemento = document.querySelector("main");

  // --- Manipulações do DOM para a exportação ---

  // Exemplo: Remover elementos que você não quer no PDF
  const elementosParaRemover = elemento.querySelectorAll(".nao-imprimir");
  elementosParaRemover.forEach(el => el.style.display = "none");

  // Exemplo: Adicionar uma classe para formatação específica de impressão
  elemento.classList.add("para-impressao");

  // Exemplo: Garantir que elementos inicialmente escondidos estejam visíveis
  const elementosEscondidos = elemento.querySelectorAll(".escondido-para-tela");
  elementosEscondidos.forEach(el => el.style.display = "block");

  const opt = {
    margin: 0.5,
    filename: "dashboard_faturamento.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(elemento).save().finally(() => {
    // --- Limpeza das manipulações do DOM após a exportação (opcional) ---
    elementosParaRemover.forEach(el => el.style.display = "");
    elemento.classList.remove("para-impressao");
    elementosEscondidos.forEach(el => el.style.display = "");
  });
}