/*Função para atualizar imagens
function updateThemeImages(isLightTheme) {
  document.querySelectorAll('[data-theme-image]').forEach(element => {
    const darkSrc = element.getAttribute('data-dark-src');
    const lightSrc = element.getAttribute('data-light-src');

    if (isLightTheme && lightSrc) {
      element.src = lightSrc;
    } else if (darkSrc) {
      element.src = darkSrc;
    }
  });
}

// Função para alternar tema (corrigida para iOS)
function toggleTheme() {
  const body = document.body;
  const themeToggleIcon = document.querySelector("#theme-toggle i");

  // Hack para forçar repaint no iOS
  body.style.display = 'none';
  body.offsetHeight; // Aciona reflow
  body.style.display = '';

  body.classList.toggle("light-theme");
  const isLightTheme = body.classList.contains("light-theme");

  if (isLightTheme) {
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
  } else {
    themeToggleIcon.classList.replace("ph-sun-dim", "ph-moon-stars");
  }

  updateThemeImages(isLightTheme);

  localStorage.setItem("theme", isLightTheme ? "light" : "dark");

  // Força atualização final
  void body.offsetWidth;
}

// Função para aplicar tema salvo (mantida igual)
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const themeToggleIcon = document.querySelector("#theme-toggle i");
  let isLightTheme = false;

  if (savedTheme === "light") {
    body.classList.add("light-theme");
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
    isLightTheme = true;
  } else if (savedTheme === "dark") {
    body.classList.remove("light-theme");
    themeToggleIcon.classList.replace("ph-sun-dim", "ph-moon-stars");
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    body.classList.add("light-theme");
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
    localStorage.setItem("theme", "light");
    isLightTheme = true;
  }

  updateThemeImages(isLightTheme);
}

// Event listeners (mantido igual)
document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();

  const toggleBtn = document.getElementById("theme-toggle");
  toggleBtn.addEventListener("click", toggleTheme);
  toggleBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    toggleTheme();
  });

  document
    .querySelector(".hero .theme-toggle")
    .addEventListener("click", toggleTheme);
});
*/

document.addEventListener('click', (e) => {
  const btn = e.target.closest('#theme-toggle')
  if (!btn) return

  toggleTheme()
})

function toggleTheme() {
  const body = document.body
  const dark = body.classList.toggle('dark')
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

// Função para atualizar imagens
function updateThemeImages(isLightTheme) {
  document.querySelectorAll("[data-theme-image]").forEach((element) => {
    const darkSrc = element.getAttribute("data-dark-src");
    const lightSrc = element.getAttribute("data-light-src");

    if (isLightTheme && lightSrc) {
      element.src = lightSrc;
    } else if (darkSrc) {
      element.src = darkSrc;
    }
  });
}

// Função para alternar tema (corrigida para iOS)
function toggleTheme() {
  const body = document.body;
  const themeToggleIcon = document.querySelector("#theme-toggle i");

  // Hack para forçar repaint no iOS
  body.style.display = "none";
  body.offsetHeight; // Aciona reflow
  body.style.display = "";

  body.classList.toggle("light-theme");
  const isLightTheme = body.classList.contains("light-theme");

  if (isLightTheme) {
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
  } else {
    themeToggleIcon.classList.replace("ph-sun-dim", "ph-moon-stars");
  }

  updateThemeImages(isLightTheme);

  localStorage.setItem("theme", isLightTheme ? "light" : "dark");

  // Força atualização final
  void body.offsetWidth;
}

// Função para aplicar tema salvo (mantida igual)
function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const themeToggleIcon = document.querySelector("#theme-toggle i");
  let isLightTheme = false;

  if (savedTheme === "light") {
    body.classList.add("light-theme");
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
    isLightTheme = true;
  } else if (savedTheme === "dark") {
    body.classList.remove("light-theme");
    themeToggleIcon.classList.replace("ph-sun-dim", "ph-moon-stars");
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    body.classList.add("light-theme");
    themeToggleIcon.classList.replace("ph-moon-stars", "ph-sun-dim");
    localStorage.setItem("theme", "light");
    isLightTheme = true;
  }

  updateThemeImages(isLightTheme);
}

// Event listeners (mantido igual)
document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();

  const toggleBtn = document.getElementById("theme-toggle");
  toggleBtn.addEventListener("click", toggleTheme);
  toggleBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    toggleTheme();
  });

  document
    .querySelector(".hero .theme-toggle")
    .addEventListener("click", toggleTheme);
});
