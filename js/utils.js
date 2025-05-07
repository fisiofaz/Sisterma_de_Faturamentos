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