// Utilitários
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarDataBR(dataISO) {
  if (!dataISO || !dataISO.includes("-")) return dataISO;
  const partes = dataISO.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : dataISO;
}

function obterDados(nomeStorage) {
  return JSON.parse(localStorage.getItem(nomeStorage)) || [];
}

// Dados por loja (do localStorage)
const dadosOrtofisius = obterDados("faturamento_ortofisius");
const dadosFisiomedCentro = obterDados("faturamento_fisiomedcentro");
const dadosFisiomedCamobi = obterDados("faturamento_fisiomedcamobi");

const faturamento = [
  ...dadosOrtofisius.map(item => ({ ...item, loja: "Ortofisi’us" })),
  ...dadosFisiomedCentro.map(item => ({ ...item, loja: "Fisiomed Centro" })),
  ...dadosFisiomedCamobi.map(item => ({ ...item, loja: "Fisiomed Camobi" }))
];

// Processar totais
function calcularTotais(dados) {
  return dados.reduce((soma, item) => soma + (parseFloat(item.valor) || 0), 0);
}

const totalOrtofisius = calcularTotais(dadosOrtofisius);
const totalCentro = calcularTotais(dadosFisiomedCentro);
const totalCamobi = calcularTotais(dadosFisiomedCamobi);
const totalGeral = totalOrtofisius + totalCentro + totalCamobi;

// Destaques
function calcularDestaques(dados) {
  if (dados.length === 0) return null;

  const valores = dados.map((d) => parseFloat(d.valor) || 0);
  const maiorValor = Math.max(...valores);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const dataOriginal = dados.find((d) => parseFloat(d.valor) === maiorValor)?.data || "N/A";

  return {
    maiorValor,
    media,
    diaMaior: formatarDataBR(dataOriginal),
  };
}

const destaques = {
  Ortofisius: calcularDestaques(dadosOrtofisius),
  Centro: calcularDestaques(dadosFisiomedCentro),
  Camobi: calcularDestaques(dadosFisiomedCamobi),
};

// Mostrar Totais
document.getElementById("resumo-totais").innerHTML = `
  <h2>Totais por Loja</h2>
  <ul>
    <li>🩺 Ortofisi’us: ${formatarMoeda(totalOrtofisius)}</li>
    <li>🏥 Fisiomed Centro: ${formatarMoeda(totalCentro)}</li>
    <li>🧑‍⚕️ Fisiomed Camobi: ${formatarMoeda(totalCamobi)}</li>
    <li><strong>💰 Total Geral: ${formatarMoeda(totalGeral)}</strong></li>
  </ul>
`;

// Mostrar Destaques
document.getElementById("destaques-mes").innerHTML = `
  <h2>Destaques do Mês</h2>
  <ul>
    <li><strong>Ortofisi’us:</strong> Maior: ${formatarMoeda(destaques.Ortofisius?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Ortofisius?.media || 0)}, Dia do Pico: ${destaques.Ortofisius?.diaMaior}</li>
    <li><strong>Centro:</strong> Maior: ${formatarMoeda(destaques.Centro?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Centro?.media || 0)}, Dia do Pico: ${destaques.Centro?.diaMaior}</li>
    <li><strong>Camobi:</strong> Maior: ${formatarMoeda(destaques.Camobi?.maiorValor || 0)}, Média: ${formatarMoeda(destaques.Camobi?.media || 0)}, Dia do Pico: ${destaques.Camobi?.diaMaior}</li>
  </ul>
`;

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
  const opt = {
    margin: 0.5,
    filename: "dashboard_faturamento.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(elemento).save();
}
