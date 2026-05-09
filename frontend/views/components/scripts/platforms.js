document.addEventListener("DOMContentLoaded", () => {
  const platform_id = document.body.dataset.platform
  carregarJogosPorPlataforma(platform_id)
})

carregarJogosPorPlataforma(1) // PC
carregarJogosPorPlataforma(2) // CONSOLE
carregarJogosPorPlataforma(3) // MOBILE