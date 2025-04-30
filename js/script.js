window.addEventListener("load", () => {
    document.getElementById("preloader").style.display = "none";
});
  
const toggleThemeBtn = document.getElementById("toggle-theme");
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

