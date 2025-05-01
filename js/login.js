document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const username = form.username.value.trim();
      const password = form.password.value.trim();
  
      // Credenciais fixas por enquanto
      if (username === 'admin' && password === '1234') {
        localStorage.setItem('usuarioLogado', JSON.stringify({ username }));
        window.location.href = '../../index.html'; 
      } else {
        errorMessage.textContent = 'Usuário ou senha inválidos.';
      }
    });
  });
  