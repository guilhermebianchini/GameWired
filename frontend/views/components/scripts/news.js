let paginaAtual = 1
let totalPaginas = 1

// MODELO DO CONTAINER DAS NOTÍCIAS

function limparNews() {
  const container = document.getElementById("newsContainer")
  if (container) container.innerHTML = ""
}

function previewNews(noticias) {
  let html = ""

  noticias.forEach(news => {

    html += `
      <div class="news">
        <div class="news_origem">
          <div class="img-card">
            <img src="${news.img_noticia}" alt="${news.titulo}">
          </div>

          <div class="txt-card">
            <h4>${news.titulo}</h4>

            <span class="date">${news.data_publicacao.split('T')[0].split('-').reverse().join('/')}</span>

            <p>${news.subtitulo}</p>

            <div class="linkNews">
              <a href="/noticias/${news.news_id}" class="link-card"> Leia mais </a>
            </div>
          </div>
        </div>
      </div>
    `
  })

  return html
}

// RENDERIZAÇÃO DAS NOTÍCIAS

function renderizarNews(news) {
  const container = document.getElementById("newsContainer")

  if (!container) {
    console.error("Container das notícias não encontrado!")
    return
  }

  if (!news.length) {
    container.innerHTML = "<p>Nenhuma notícia encontrada.</p>"
    return
  }

  const html = previewNews(news)

  container.innerHTML = html
}

// CARREGAMENTO DAS NOTÍCIAS

async function carregarNoticias(page = 1) {
  try {
    const response = await fetch(
      `https://gamewired-api.duckdns.org/news?page=${page}`
    )

    if (!response.ok) {
      throw new Error("Erro ao carregar notícias!")
    }

    const result = await response.json()

    if (!result.ok) {
      throw new Error("Erro retornado pela API!")
    }

    paginaAtual = result.page
    totalPaginas = result.totalPages

    renderizarNews(result.data)
    renderizarPaginacao()

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

// PAGINAÇÃO

function renderizarPaginacao() {

  const paginacao = document.getElementById("paginacao")

  paginacao.innerHTML = ""

  if (totalPaginas <= 1) return

  // BOTÃO ANTERIOR

  const btnAnterior = document.createElement("button")

  btnAnterior.innerHTML = '<i class="bi bi-chevron-left"></i>'
  btnAnterior.disabled = paginaAtual === 1

  btnAnterior.addEventListener("click", () => {
    carregarNoticias(i)
    rolarParaTopo()
  })

  paginacao.appendChild(btnAnterior)

  // NÚMEROS DA PÁGINA

  for (let i = 1; i <= totalPaginas; i++) {

    const btn = document.createElement("button")

    btn.textContent = i

    if (i === paginaAtual) {
      btn.classList.add("pag-ativo")
    }

    btn.addEventListener("click", () => {
      carregarNoticias(i)
      rolarParaTopo()
    })

    paginacao.appendChild(btn)
  }

  // BOTÃO PRÓXIMO

  const btnProximo = document.createElement("button")

  btnProximo.innerHTML = '<i class="bi bi-chevron-right"></i>'
  btnProximo.disabled = paginaAtual === totalPaginas

  btnProximo.addEventListener("click", () => {
    carregarNoticias(i)
    rolarParaTopo()
  })

  paginacao.appendChild(btnProximo)
}

function rolarParaTopo() {
  document.getElementById("news").scrollIntoView({ behavior: "smooth" })
}

// INICIALIZAÇÃO

carregarNoticias()