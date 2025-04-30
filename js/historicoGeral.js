document.addEventListener('DOMContentLoaded', () => {
  carregarTabela();
});

function carregarTabela(filtroLoja = 'todas', filtroData = '') {
  const tabela = document.getElementById('tabela-geral');
  tabela.innerHTML = ''; // limpa a tabela

  const lojas = [
    { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
    { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
    { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
  ];

  lojas.forEach(loja => {
    if (filtroLoja !== 'todas' && filtroLoja !== loja.chave) return;

    const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];

    registros.forEach(registro => {
      if (filtroData && registro.data !== filtroData) return;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${loja.nome}</td>
        <td>${registro.data}</td>
        <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
      `;
      tabela.appendChild(tr);
    });
  });
}

function filtrar() {
  const loja = document.getElementById('filtro-loja').value;
  const data = document.getElementById('filtro-data').value;
  carregarTabela(loja, data);
}

function limparFiltros() {
  document.getElementById('filtro-loja').value = 'todas';
  document.getElementById('filtro-data').value = '';
  carregarTabela();
}
