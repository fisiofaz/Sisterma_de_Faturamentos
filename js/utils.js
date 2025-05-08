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

export function editarRegistroGenerico(storageKey, index, camposEdicao, callbackRecarregar) {
    const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (index < 0 || index >= registros.length) {
      console.error('Índice de registro inválido.');
      return;
    }
  
    const registro = { ...registros[index] }; // Cria uma cópia para evitar modificação direta
    let edicaoCancelada = false;
  
    for (const campo in camposEdicao) {
      const definicaoCampo = camposEdicao[campo];
      const valorAtual = registro[campo];
      const novoValorPrompt = definicaoCampo.solicitarValor(valorAtual);
  
      if (novoValorPrompt === null) {
        edicaoCancelada = true;
        break; // Edição cancelada pelo usuário
      }
  
      if (!definicaoCampo.validarValor(novoValorPrompt)) {
        alert(`Valor inválido para o campo "${campo}". Edição cancelada.`);
        return;
      }
  
      registro[campo] = definicaoCampo.formatarValor ? definicaoCampo.formatarValor(novoValorPrompt) : novoValorPrompt;
    }
  
    if (!edicaoCancelada) {
      registros[index] = registro;
      localStorage.setItem(storageKey, JSON.stringify(registros));
      callbackRecarregar();
    }
}

export function excluirRegistroGenerico(storageKey, index, callbackRecarregar) {
    const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (index < 0 || index >= registros.length) {
      console.error('Índice de registro para exclusão inválido.');
      return;
    }
  
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      registros.splice(index, 1);
      localStorage.setItem(storageKey, JSON.stringify(registros));
      callbackRecarregar();
    }
}

export function carregarTabelaGenerico(lojas, tabelaId, criarLinhaCallback, filtroLoja = 'todas', filtroData = '') {
    const tabela = document.getElementById(tabelaId);
    if (!tabela) {
      console.error(`Tabela com ID "${tabelaId}" não encontrada.`);
      return;
    }
    tabela.innerHTML = ''; // limpa a tabela
  
    lojas.forEach(loja => {
      if (filtroLoja !== 'todas' && filtroLoja !== loja.chave) return;
  
      const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];
  
      registros.forEach((registro, index) => {
        if (filtroData && registro.data !== filtroData) return;
  
        const tr = document.createElement('tr');
        criarLinhaCallback(tr, registro, loja.nome);
        tabela.appendChild(tr);
      });
    });
}

export function formatarDataBR(dataISO) {
  if (!dataISO || !dataISO.includes("-")) return dataISO;
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataISO(dataBR) {
  if (!dataBR || !dataBR.includes("/")) return dataBR;
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}