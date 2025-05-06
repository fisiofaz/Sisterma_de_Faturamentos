document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('faturamento-form');
  const dataInput = document.getElementById('data');
  const valorInput = document.getElementById('valor');
  const tabela = document.getElementById('historico-tabela');

  const STORAGE_KEY = 'faturamento_fisiomed_centro'; // Altere conforme a loja

  function formatarDataBR(dataISO) {
    if (!dataISO || !dataISO.includes("-")) return dataISO;
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  function carregarDados() {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    tabela.innerHTML = '';
  
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
  
    let totalDia = 0;
    let totalMes = 0;
  
    dados.forEach((registro, index) => {
      const dataRegistro = new Date(registro.data);
  
      // Soma total do dia
      if (
        dataRegistro.getDate() === diaAtual &&
        dataRegistro.getMonth() === mesAtual &&
        dataRegistro.getFullYear() === anoAtual
      ) {
        totalDia += parseFloat(registro.valor);
      }
  
      // Soma total do mês
      if (
        dataRegistro.getMonth() === mesAtual &&
        dataRegistro.getFullYear() === anoAtual
      ) {
        totalMes += parseFloat(registro.valor);
      }
  
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${formatarDataBR(registro.data)}</td>
        <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
        <td class="acoes">
          <button onclick="editarRegistro(${index})" title="Editar">✏️</button>
          <button onclick="excluirRegistro(${index})" title="Excluir">🗑️</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
  
    // Atualiza os valores no HTML
    document.getElementById('total-dia').textContent = totalDia.toFixed(2);
    document.getElementById('total-mes').textContent = totalMes.toFixed(2);
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

  window.editarRegistro = function(index) {
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const registro = registros[index];
  
    const dataBR = formatarDataBR(registro.data); // de aaaa-mm-dd → dd/mm/aaaa
    const novaDataBR = prompt('Editar data (dd/mm/aaaa):', dataBR);
    const novoValor = prompt('Editar valor:', registro.valor);
  
    function formatarDataISO(dataBR) {
      const [dia, mes, ano] = dataBR.split('/');
      return `${ano}-${mes}-${dia}`; // dd/mm/aaaa → aaaa-mm-dd
    }
  
    if (novaDataBR && novoValor && !isNaN(parseFloat(novoValor))) {
      registros[index] = {
        data: formatarDataISO(novaDataBR),
        valor: parseFloat(novoValor).toFixed(2)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
      carregarDados();
    } else {
      alert('Entrada inválida. Edição cancelada.');
    }
  };
  

  window.excluirRegistro = function(index) {
    const registros = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      registros.splice(index, 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
      carregarDados();
    }
  };

  carregarDados();
});

