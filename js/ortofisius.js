// ../js/ortofisius.js
import { carregarDadosGenerico, atualizarTotaisGenerico } from './utils.js'; // Importa a função utilitária

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('faturamento-form');
  const dataInput = document.getElementById('data');
  const valorInput = document.getElementById('valor');
  const tabela = document.getElementById('historico-tabela');
  const totalDiaSpan = document.getElementById('total-dia');
  const totalMesSpan = document.getElementById('total-mes');
  const STORAGE_KEY = 'faturamento_ortofisius';

  function formatarDataBR(dataISO) {
    if (!dataISO || !dataISO.includes("-")) return dataISO;
  const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataISO(dataBR) {
    const [dia, mes, ano] = dataBR.split('/');
    return `${ano}-${mes}-${dia}`;
  }

  window.editarRegistro = function(index) {
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const registro = registros[index];

    const dataBR = formatarDataBR(registro.data); // de aaaa-mm-dd → dd/mm/aaaa
  
  const novaDataBR = prompt('Editar data (dd/mm/aaaa):', dataBR);
    const novoValor = prompt('Editar valor:', registro.valor);

    if (novaDataBR && novoValor && !isNaN(parseFloat(novoValor))) {
      registros[index] = {
        data: formatarDataISO(novaDataBR),
        valor: parseFloat(novoValor).toFixed(2)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
      carregarDados(); // Chama a função para recarregar a tabela e os totais
    } else {
      alert('Entrada inválida. Edição cancelada.');
    }
  };

  window.excluirRegistro = function(index) {
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      registros.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
      carregarDados(); // Chama a função para recarregar a tabela e os totais
    }
  };

  function criarLinhaOrtofisius(linha, registro, index) {
    const celulaData = linha.insertCell();
    const celulaValor = linha.insertCell();
    const celulaAcoes = linha.insertCell();

    celulaData.textContent = formatarDataBR(registro.data);
    celulaValor.textContent = `R$ ${parseFloat(registro.valor).toFixed(2)}`;
    celulaAcoes.classList.add('acoes');
    celulaAcoes.innerHTML = `
      <button class="editar" onclick="editarRegistro(${index})" title="Editar registro">✏️</button>
      <button class="excluir" onclick="excluirRegistro(${index})" title="Excluir registro">🗑️</button>
    `;
  }

  function carregarDados() {
    carregarDadosGenerico(STORAGE_KEY, 'historico-tabela', criarLinhaOrtofisius);
    atualizarTotaisGenerico(STORAGE_KEY, 'total-dia', 'total-mes'); // Usa a função genérica
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = dataInput.value;
    const valor = valorInput.value;

    if (!data || !valor) return;

    const novoRegistro = { data, valor };
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    registros.push(novoRegistro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));

    dataInput.value = '';
    valorInput.value = '';

    carregarDados();
  });

  // Chama a função para carregar os dados inicialmente
  carregarDados();
});