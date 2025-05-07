// Função para carregar dados do localStorage e preencher uma tabela HTML
export function carregarDadosGenerico(storageKey, tabelaId, criarLinhaCallback) {
    const tabela = document.getElementById(tabelaId);
    if (!tabela) {
      console.error(`Tabela com ID "${tabelaId}" não encontrada.`);
      return;
    }
    tabela.innerHTML = '';
    const dados = JSON.parse(localStorage.getItem(storageKey)) || [];
  
    dados.forEach((registro, index) => {
      const linha = tabela.insertRow();
      criarLinhaCallback(linha, registro, index);
    });
  }

  export function atualizarTotaisGenerico(storageKey, totalDiaId, totalMesId) {
    const totalDiaSpan = document.getElementById(totalDiaId);
    const totalMesSpan = document.getElementById(totalMesId);
  
    if (!totalDiaSpan || !totalMesSpan) {
      console.error('Elementos para exibir os totais não encontrados.');
      return;
    }
  
    const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
    const hoje = new Date().toISOString().split('T')[0];
    const mesAtual = hoje.slice(0, 7);
  
    const totalDia = registros
      .filter(r => r.data === hoje)
      .reduce((soma, r) => soma + parseFloat(r.valor), 0);
  
    const totalMes = registros
      .filter(r => r.data.startsWith(mesAtual))
      .reduce((soma, r) => soma + parseFloat(r.valor), 0);
  
    totalDiaSpan.textContent = totalDia.toFixed(2);
    totalMesSpan.textContent = totalMes.toFixed(2);
  }