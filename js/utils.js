/**
 * Carrega dados do localStorage com a chave fornecida e preenche uma tabela HTML.
 * Para cada registro carregado, a função de callback `criarLinhaCallback` é chamada
 * para criar e inserir uma nova linha na tabela.
 *
 * @param {string} storageKey A chave sob a qual os dados estão armazenados no localStorage.
 * @param {string} tabelaId O ID do elemento da tabela HTML a ser preenchido.
 * @param {function} criarLinhaCallback Uma função que recebe a linha da tabela (<tr>),
 * o registro de dados e o índice como argumentos, e é responsável por preencher a linha.
 */
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

/**
 * Atualiza os elementos HTML que exibem os totais do dia e do mês com base nos dados
 * armazenados no localStorage para a chave fornecida.
 *
 * @param {string} storageKey A chave sob a qual os registros estão armazenados no localStorage.
 * @param {string} totalDiaId O ID do elemento HTML (<span>, <p>, etc.) onde o total do dia será exibido.
 * @param {string} totalMesId O ID do elemento HTML onde o total do mês será exibido.
 */
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

/**
 * Permite editar um registro específico no localStorage. Solicita novos valores para os campos
 * definidos em `camposEdicao` através de prompts. Valida os novos valores e, se válidos,
 * atualiza o registro e chama a função de callback para recarregar a tabela.
 *
 * @param {string} storageKey A chave sob a qual os registros estão armazenados no localStorage.
 * @param {number} index O índice do registro a ser editado.
 * @param {Object} camposEdicao Um objeto onde as chaves são os nomes dos campos a serem editados
 * e os valores são objetos com as propriedades `solicitarValor` (função para obter o novo valor)
 * e `validarValor` (função para validar o novo valor), e opcionalmente `formatarValor` (função para formatar o valor).
 * @param {function} callbackRecarregar Uma função a ser chamada após a edição bem-sucedida para recarregar a tabela.
 */
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

/**
 * Exclui um registro específico do localStorage com base no índice fornecido e,
 * em seguida, chama a função de callback para recarregar a tabela.
 *
 * @param {string} storageKey A chave sob a qual os registros estão armazenados no localStorage.
 * @param {number} index O índice do registro a ser excluído.
 * @param {function} callbackRecarregar Uma função a ser chamada após a exclusão bem-sucedida para recarregar a tabela.
 */
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

/**
 * Carrega dados de faturamento de múltiplas lojas do localStorage e preenche uma tabela HTML.
 * Permite filtrar por loja e por data. Para cada registro, a função de callback `criarLinhaCallback`
 * é chamada para criar e preencher uma nova linha na tabela.
 *
 * @param {Array<Object>} lojas Um array de objetos, onde cada objeto deve ter as propriedades 'nome' e 'chave' (a chave do localStorage).
 * @param {string} tabelaId O ID do elemento da tabela HTML a ser preenchido.
 * @param {function} criarLinhaCallback Uma função que recebe a linha da tabela (<tr>),
 * o registro de dados e o nome da loja como argumentos, e é responsável por preencher a linha.
 * @param {string} [filtroLoja='todas'] Uma chave de loja específica para filtrar os registros.
 * Se for 'todas', todos os registros de todas as lojas serão carregados.
 * @param {string} [filtroData=''] Uma data específica (no formato ISO YYYY-MM-DD) para filtrar os registros.
 * Se estiver vazia, todos os registros serão carregados.
 */
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

/**
 * Formata uma data no formato ISO (YYYY-MM-DD) para o formato brasileiro (DD/MM/YYYY).
 * Se a string de entrada não for uma data ISO válida, ela será retornada sem alterações.
 *
 * @param {string} dataISO A data no formato ISO (ex: '2025-05-08').
 * @returns {string} A data formatada no formato brasileiro (ex: '08/05/2025'),
 * ou a string original se não for uma data ISO válida.
 */
export function formatarDataBR(dataISO) {
  if (!dataISO || !dataISO.includes("-")) return dataISO;
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata uma data no formato brasileiro (DD/MM/YYYY) para o formato ISO (YYYY-MM-DD).
 * Se a string de entrada não for uma data brasileira válida (com '/'), ela será retornada sem alterações.
 *
 * @param {string} dataBR A data no formato brasileiro (ex: '08/05/2025').
 * @returns {string} A data formatada no formato ISO (ex: '2025-05-08'),
 * ou a string original se não for uma data brasileira válida.
 */
export function formatarDataISO(dataBR) {
  if (!dataBR || !dataBR.includes("/")) return dataBR;
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}

/**
 * Prepara os dados para um gráfico de linha mostrando o faturamento ao longo do tempo
 * para cada loja. Os dados são extraídos do localStorage para cada loja fornecida.
 *
 * @param {Array<Object>} lojas Um array de objetos, onde cada objeto deve ter as propriedades 'nome' e 'chave' (a chave do localStorage).
 * @returns {Object} Um objeto com as propriedades 'labels' (um array de datas ordenadas)
 * e 'datasets' (um array de objetos, onde cada objeto representa uma loja e seus dados de faturamento).
 */
export function prepararDadosGrafico(lojas) {
  const datasUnicas = new Set();
  const dadosPorLoja = {};

  lojas.forEach(loja => {
    const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];
    registros.forEach(reg => {
      datasUnicas.add(reg.data);
      if (!dadosPorLoja[loja.nome]) {
        dadosPorLoja[loja.nome] = {};
      }
      dadosPorLoja[loja.nome][reg.data] = parseFloat(reg.valor) || 0;
    });
  });

  const datasOrdenadas = Array.from(datasUnicas).sort();
  const datasets = lojas.map(loja => ({
    label: loja.nome,
    data: datasOrdenadas.map(data => dadosPorLoja[loja.nome]?.[data] || 0),
    fill: false,
    borderColor: gerarCorAleatoria(), // Assumindo que gerarCorAleatoria também será movida para utils.js
    tension: 0.1
  }));

  return { labels: datasOrdenadas, datasets: datasets };
}

/**
 * Gera uma cor RGB aleatória no formato 'rgb(r, g, b)', onde r, g e b são valores entre 100 e 255.
 *
 * @returns {string} Uma string representando uma cor RGB aleatória.
 */
export function gerarCorAleatoria() {
  const r = Math.floor(Math.random() * 156) + 100;
  const g = Math.floor(Math.random() * 156) + 100;
  const b = Math.floor(Math.random() * 156) + 100;
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Obtém os totais de faturamento do dia atual e do mês atual para uma loja específica,
 * com base nos dados armazenados no localStorage.
 *
 * @param {string} storageKey A chave sob a qual os registros de faturamento da loja estão armazenados no localStorage.
 * @returns {Object} Um objeto com as propriedades 'totalDia' (total do dia formatado como string)
 * e 'totalMes' (total do mês formatado como string).
 */
export function obterTotaisFaturamento(storageKey) {
  const registros = JSON.parse(localStorage.getItem(storageKey)) || [];
  const hoje = new Date().toISOString().split('T')[0];
  const mesAtual = hoje.slice(0, 7);

  const totalDia = registros
    .filter(r => r.data === hoje)
    .reduce((soma, r) => soma + parseFloat(r.valor), 0);

  const totalMes = registros
    .filter(r => r.data.startsWith(mesAtual))
    .reduce((soma, r) => soma + parseFloat(r.valor), 0);

  return {
    totalDia: totalDia.toFixed(2),
    totalMes: totalMes.toFixed(2),
  };
}

/**
 * Prepara os dados para um gráfico de barras no dashboard, mostrando o total de faturamento
 * do dia e do mês para cada loja fornecida.
 *
 * @param {Array<Object>} lojas Um array de objetos, onde cada objeto deve ter as propriedades 'nome' e 'chave' (a chave do localStorage).
 * @returns {Object} Um objeto com as propriedades 'labels' (um array com os nomes das lojas)
 * e 'datasets' (um array de objetos, onde cada objeto representa um conjunto de dados: 'Total Dia' e 'Total Mês').
 */
export function prepararDadosGraficoDashboard(lojas) {
  const labels = lojas.map(loja => loja.nome);
  const totaisDia = lojas.map(loja => {
    const totais = obterTotaisFaturamento(loja.chave);
    return parseFloat(totais.totalDia);
  });
  const totaisMes = lojas.map(loja => {
    const totais = obterTotaisFaturamento(loja.chave);
    return parseFloat(totais.totalMes);
  });

  return {
    labels: labels,
    datasets: [
      {
        label: 'Total Dia',
        data: totaisDia,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Mês',
        data: totaisMes,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };
}

/**
 * Formata um valor numérico para a representação em moeda brasileira (BRL).
 *
 * @param {number} valor O valor numérico a ser formatado.
 * @returns {string} Uma string representando o valor formatado em moeda brasileira.
 */
export function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


/**
 * Obtém os dados armazenados no localStorage para uma chave específica.
 * Se não houver dados para a chave, retorna um array vazio.
 *
 * @param {string} nomeStorage A chave do localStorage para recuperar os dados.
 * @returns {Array<any>} Um array contendo os dados recuperados do localStorage, ou um array vazio se a chave não existir.
 */
export function obterDados(nomeStorage) {
  return JSON.parse(localStorage.getItem(nomeStorage)) || [];
}

/**
 * Calcula a soma dos valores da propriedade 'valor' em um array de objetos.
 * Ignora valores que não podem ser convertidos para números.
 *
 * @param {Array<Object>} dados Um array de objetos, onde cada objeto deve ter uma propriedade 'valor' que possa ser convertida para um número.
 * @returns {number} A soma dos valores numéricos encontrados, ou 0 se o array estiver vazio.
 */
export function calcularTotais(dados) {
  return dados.reduce((soma, item) => soma + (parseFloat(item.valor) || 0), 0);
}

/**
 * Calcula os destaques de um array de objetos com valores de faturamento.
 * Retorna o maior valor, a média dos valores e o dia em que ocorreu o maior valor.
 *
 * @param {Array<Object>} dados Um array de objetos, onde cada objeto deve ter as propriedades 'valor' (que possa ser convertida para um número) e 'data' (no formato ISO YYYY-MM-DD).
 * @returns {Object|null} Um objeto contendo as propriedades 'maiorValor' (number), 'media' (number)
 * e 'diaMaior' (string no formato DD/MM/YYYY), ou null se o array de dados estiver vazio.
 */
export function calcularDestaques(dados) {
  if (dados.length === 0) return null;

  const valores = dados.map((d) => parseFloat(d.valor) || 0);
  const maiorValor = Math.max(...valores);
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const dataOriginal = dados.find((d) => parseFloat(d.valor) === maiorValor)?.data || "N/A";

  return {
    maiorValor,
    media,
    diaMaior: formatarDataBR(dataOriginal), // Usando a função importada de utils.js
  };
}