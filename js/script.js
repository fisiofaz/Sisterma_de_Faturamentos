window.addEventListener("load", () => {
    document.getElementById("preloader").style.display = "none";
});
  
const toggleThemeBtn = document.getElementById("toggle-theme");
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

document.getElementById('menuToggle').addEventListener('click', function () {
  this.classList.toggle('ativo');
  document.getElementById('menu').classList.toggle('aberto'); // se desejar abrir/fechar o menu também
});

