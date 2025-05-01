window.addEventListener("load", () => {
    document.getElementById("preloader").style.display = "none";
});
  
const toggleThemeBtn = document.getElementById("toggle-theme");
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('menuToggle');
  const menu = document.getElementById('menu');

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    toggleBtn.classList.toggle('open');
  });
});


function logout() {
  localStorage.removeItem('logado');
  window.location.href = './page/login.html'; // Redireciona para a página de login
}
