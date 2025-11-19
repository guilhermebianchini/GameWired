function openMenu() {
  const navMenu = document.querySelector(".nav__mobile");
  if (navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
  } else {
    navMenu.classList.add("active");
  }
}

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => toggleMenu());
});