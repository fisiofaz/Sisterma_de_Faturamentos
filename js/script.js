window.addEventListener("load", () => {
  esconderPreloader();
});

function esconderPreloader() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarToggleTema();
  inicializarMenuToggle();
})
  
function inicializarToggleTema() {
  const toggleThemeBtn = document.getElementById("toggle-theme");
  if (toggleThemeBtn) {
    // Carregar tema do localStorage na inicialização
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo === 'dark') {
      document.body.classList.add('dark');
    }

    toggleThemeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      // Persistir tema no localStorage
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }
}

function inicializarMenuToggle() {
  const toggleBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');

  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggleBtn.classList.toggle('open');
    });
  }
}

function logout() {
  localStorage.removeItem('logado');
  window.location.href = './page/login.html'; // Redireciona para a página de login
}

