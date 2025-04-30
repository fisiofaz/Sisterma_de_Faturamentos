document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('faturamento-form');
    const dataInput = document.getElementById('data');
    const valorInput = document.getElementById('valor');
    const tabela = document.getElementById('historico-tabela');
  
    const STORAGE_KEY = 'faturamento_ortofisius';
  
    function carregarDados() {
      const dados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      tabela.innerHTML = '';
  
      dados.forEach((registro) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${registro.data}</td><td>R$ ${parseFloat(registro.valor).toFixed(2)}</td>`;
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
  
    carregarDados();
});
  