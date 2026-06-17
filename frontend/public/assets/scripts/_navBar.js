function openMenu() {
  const navMenu = document.querySelector(".nav__mobile");
  if (navMenu.classList.contains("active")) {
    navMenu.classList.remove("active")
  } else {
    navMenu.classList.add("active")
  }
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".platforms-btn")

    if (!btn) return

    const platformItems = document.querySelector(".platforms-items")
    const arrow = document.querySelector(".arrow")

    platformItems.classList.toggle("open")

    arrow.textContent =
        platformItems.classList.contains("open")
            ? "▲"
            : "▼"
})

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => toggleMenu());
})