// SETAS - CARROSSÉIS

function iniciarCarousel(carouselSelector, wrapperSelector, arrowsSelector) {
  document.querySelectorAll(carouselSelector).forEach(carousel => {
    const wrapper = carousel.querySelector(wrapperSelector)

    const arrows = carousel.parentElement.querySelector(arrowsSelector)

    const leftBtn = arrows.querySelector(".arrow.left")
    const rightBtn = arrows.querySelector(".arrow.right")

    const getScroll = () => {
      const primeiroCard = wrapper.firstElementChild
      if (!primeiroCard) return 220

      const gap = parseFloat(getComputedStyle(wrapper).gap) || 0
      return primeiroCard.offsetWidth + gap
    }

    leftBtn.addEventListener("click", () => {
      wrapper.scrollBy({
        left: -getScroll(),
        behavior: "smooth"
      })
    })

    rightBtn.addEventListener("click", () => {
      wrapper.scrollBy({
        left: getScroll(),
        behavior: "smooth"
      })
    })
  })
}

iniciarCarousel(".carousel", ".carousel-wrapper", ".arrowsCarousel")
iniciarCarousel(".browserCarousel", ".browserWrapper", ".arrowsBrowser")

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