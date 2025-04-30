document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.getElementById('tabela-geral');
  
    const lojas = [
      { nome: 'Ortofisi’us', chave: 'faturamento_ortofisius' },
      { nome: 'Fisiomed Centro', chave: 'faturamento_fisiomed_centro' },
      { nome: 'Fisiomed Camobi', chave: 'faturamento_fisiomed_camobi' },
    ];
  
    lojas.forEach(loja => {
      const registros = JSON.parse(localStorage.getItem(loja.chave)) || [];
  
      registros.forEach(registro => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${loja.nome}</td>
          <td>${registro.data}</td>
          <td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>
        `;
        tabela.appendChild(tr);
      });
    });
});
  