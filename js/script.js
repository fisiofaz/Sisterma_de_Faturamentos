window.addEventListener("load", () => {
    document.getElementById("preloader").style.display = "none";
});
  
const toggleThemeBtn = document.getElementById("toggle-theme");
  toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Menu toggle responsivo
const toggleMenu = document.querySelector(".menu-toggle");
const menuLinks = document.querySelector(".menu-links");

if (toggleMenu && menuLinks) {
  toggleMenu.addEventListener("click", () => {
    menuLinks.classList.toggle("show");
  });
}
