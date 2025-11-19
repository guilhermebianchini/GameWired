// SETAS

document.querySelectorAll(".carousel").forEach(carousel => {
  const wrapper = carousel.querySelector(".carousel-wrapper");
  const leftBtn = carousel.querySelector(".arrow.left");
  const rightBtn = carousel.querySelector(".arrow.right");

  leftBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: -220, behavior: "smooth" });
  });

  rightBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: 220, behavior: "smooth" });
  });
});

// MODAL

const openButtons = document.querySelectorAll(".openModal")
const modals = document.querySelectorAll(".modal")
const closeButtons = document.querySelectorAll(".close")

openButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    modals[index].style.display = "flex"
  })
})

closeButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    modals[index].style.display = "none"
  })
})

window.addEventListener("click", (e) => {
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
})