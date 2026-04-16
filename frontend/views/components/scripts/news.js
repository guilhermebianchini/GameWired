const filtro = document.getElementById("filtro")
const listaNoticias = document.getElementById("listaNoticias")
const paginacao = document.getElementById("paginacao")

let todasNoticias = Array.from(listaNoticias.querySelectorAll(".card-news"))
const NOTICIAS_POR_PAGINA = 9
let paginaAtual = 1

function totalPaginas() {
  return Math.ceil(todasNoticias.length / NOTICIAS_POR_PAGINA)
}

function renderizarNoticias() {
  listaNoticias.innerHTML = ""
  const inicio = (paginaAtual - 1) * NOTICIAS_POR_PAGINA
  const fim = inicio + NOTICIAS_POR_PAGINA
  todasNoticias.slice(inicio, fim).forEach(noticia => listaNoticias.appendChild(noticia))
  renderizarPaginacao()
}

function renderizarPaginacao() {
  paginacao.innerHTML = ""
  const total = totalPaginas()

  if (total <= 1) return

  // BOTÃO ANTERIOR

  const btnAnterior = document.createElement("button")
  btnAnterior.classList.add("pag-btn", "pag-arrow")
  btnAnterior.innerHTML = '<i class="bi bi-chevron-left"></i>'
  btnAnterior.disabled = paginaAtual === 1
  btnAnterior.setAttribute("aria-label", "Página anterior")
  btnAnterior.addEventListener("click", () => {
    if (paginaAtual > 1) {
      paginaAtual--;
      renderizarNoticias()
      rolarParaTopo()
    }
  })
  paginacao.appendChild(btnAnterior)

  // NÚMEROS DA PÁGINA

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button")
    btn.classList.add("pag-btn")
    if (i === paginaAtual) {
      btn.classList.add("pag-ativo")
      btn.setAttribute("aria-current", "page")
    }
    btn.textContent = i
    btn.setAttribute("aria-label", "Página " + i)
    const pagina = i
    btn.addEventListener("click", () => {
      paginaAtual = pagina
      renderizarNoticias()
      rolarParaTopo()
    })
    paginacao.appendChild(btn)
  }

  // BOTÃO PRÓXIMO

  const btnProximo = document.createElement("button")
  btnProximo.classList.add("pag-btn", "pag-arrow")
  btnProximo.innerHTML = '<i class="bi bi-chevron-right"></i>'
  btnProximo.disabled = paginaAtual === total;
  btnProximo.setAttribute("aria-label", "Próxima página")
  btnProximo.addEventListener("click", () => {
    if (paginaAtual < total) {
      paginaAtual++;
      renderizarNoticias()
      rolarParaTopo()
    }
  })
  paginacao.appendChild(btnProximo)
}

function rolarParaTopo() {
  document.getElementById("news").scrollIntoView({ behavior: "smooth" })
}

// ORDENAÇÃO

function ordenarNoticias() {
  const tipo = filtro.value
  let ordenadas = [...todasNoticias]

  if (tipo === "a-z") {
    ordenadas.sort((a, b) => {
      const tituloA = a.querySelector("h4").innerText.toLowerCase()
      const tituloB = b.querySelector("h4").innerText.toLowerCase()
      return tituloA.localeCompare(tituloB)
    })
  }
  if (tipo === "z-a") {
    ordenadas.sort((a, b) => {
      const tituloA = a.querySelector("h4").innerText.toLowerCase()
      const tituloB = b.querySelector("h4").innerText.toLowerCase()
      return tituloB.localeCompare(tituloA)
    })
  }

  todasNoticias = ordenadas
  paginaAtual = 1
  renderizarNoticias()
}

filtro.addEventListener("change", ordenarNoticias)

// INICIALIZAÇÃO

renderizarNoticias()