document.addEventListener("DOMContentLoaded", async () => {
  const platformId = Number(document.body.dataset.platform)
  
  if (platformId) {
    await carregarJogosPorPlataforma(platformId)
  }

  iniciarCarousel(".carousel", ".carousel-wrapper", ".arrowsCarousel")
  iniciarCarousel(".browserCarousel", ".browserWrapper", ".arrowsBrowser", true)
})