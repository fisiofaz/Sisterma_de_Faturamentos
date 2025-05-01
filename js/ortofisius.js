document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('faturamento-form');
  const dataInput = document.getElementById('data');
  const valorInput = document.getElementById('valor');
  const tabela = document.getElementById('historico-tabela');

  const STORAGE_KEY = 'faturamento_ortofisius'; // Altere conforme a loja

  function carregarDados() {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    tabela.innerHTML = '';

    dados.forEach((registro, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${registro.data}</td>
        <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
        <td class="acoes">
          <button onclick="editarRegistro(${index})" title="Editar">✏️</button>
          <button onclick="excluirRegistro(${index})" title="Excluir">🗑️</button>
        </td>
      `;
      tabela.appendChild(tr);
    });
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

    const novaData = prompt('Editar data:', registro.data);
    const novoValor = prompt('Editar valor:', registro.valor);

    if (novaData && novoValor && !isNaN(parseFloat(novoValor))) {
      registros[index] = {
        data: novaData,
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
