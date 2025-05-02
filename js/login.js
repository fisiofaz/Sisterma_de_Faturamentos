document.addEventListener('DOMContentLoaded', () => {
    const mensagem = document.getElementById('mensagem-usuario');
    const usuarioInput = document.getElementById('usuario');
    const ultimoUsuario = localStorage.getItem('ultimoUsuario');
  
    if (ultimoUsuario) {
      mensagem.textContent = `Último login: ${ultimoUsuario}`;
      usuarioInput.value = ultimoUsuario;
    }
  
    const form = document.getElementById('login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
  
      const usuario = usuarioInput.value.trim();
      const senha = document.getElementById('senha').value;
  
      if (usuario === 'admin' && senha === '1234') {
        localStorage.setItem('usuarioLogado', usuario);
        localStorage.setItem('ultimoUsuario', usuario);
        window.location.href = '../index.html';
      } else {
        alert('Usuário ou senha inválidos');
      }
    });
  });
  

document.addEventListener('DOMContentLoaded', () => {
    const mensagem = document.getElementById('mensagem-usuario');
    const ultimoUsuario = localStorage.getItem('ultimoUsuario');
  
    if (ultimoUsuario) {
      mensagem.textContent = `Último login: ${ultimoUsuario}`;
    }
});
  
    