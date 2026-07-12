let paginaAtual = 1
let totalPaginas = 1
let categoriaAtual = 0
let ordemAtual = "data-new"
let pesquisaAtual = ""

// MODELO DO CONTAINER DAS NOTÍCIAS + RENDERIZAÇÃO DAS NOTÍCIAS

function limparNews() {
  const container = document.getElementById("newsContainer")
  if (container) container.innerHTML = ""
}

function renderizarNews(wrapper, noticias) {
  wrapper.innerHTML = ""

  if (noticias.length === 0) {
    wrapper.innerHTML = "<p>Nenhuma notícia encontrada.</p>"
    return
  }

  noticias.forEach(news => {
    wrapper.innerHTML += `
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
}

// CARREGAMENTO DAS NOTÍCIAS

async function carregarNoticias(page = 1, categoria = categoriaAtual, ordem = ordemAtual) {
  const wrapper = document.getElementById("newsContainer")

  pesquisaAtual = ""

  try {
    const response = await fetch(
      `${API_URL}/news?page=${page}&categoria=${categoria}&ordem=${ordem}`
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
    categoriaAtual = categoria
    ordemAtual = ordem

    renderizarNews(wrapper, result.data)
    renderizarPaginacao()

    return result
  } catch (error) {
    console.error(error)
    return null
  }
}

// PESQUISAR NOTÍCIAS

const form = document.querySelector(".searchBarNews")
const searchInput = document.querySelector(".searchNews")

form.addEventListener("submit", (e) => {
  e.preventDefault()

  pesquisarNoticias(searchInput.value)
})

async function pesquisarNoticias(termo, page = 1) {
  const wrapper = document.getElementById("newsContainer")

  termo = termo.trim()

  pesquisaAtual = termo

  if (termo === "") {
    await carregarNoticias()
    return
  }

  try {
    const response = await fetch(
      `${API_URL}/news/search?q=${encodeURIComponent(termo)}&page=${page}`
    )

    if (!response.ok) {
      throw new Error("Erro na requisição!");
    }

    const data = await response.json()

    if (!data.ok) {
      throw new Error("Erro ao pesquisar notícias!")
    }

    paginaAtual = data.page
    totalPaginas = data.totalPages

    renderizarNews(wrapper, data.data)
    renderizarPaginacao()

  } catch (err) {
    console.error(err)
  }
}

// PAGINAÇÃO

function renderizarPaginacao() {
  const paginacao = document.getElementById("paginacao")

  if (!paginacao) return

  paginacao.innerHTML = ""

  if (totalPaginas <= 1) return

  const btnAnterior = document.createElement("button")
  btnAnterior.classList.add("pag-btn", "pag-arrow")
  btnAnterior.innerHTML = '<i class="bi bi-chevron-left"></i>'
  btnAnterior.disabled = paginaAtual === 1

  btnAnterior.addEventListener("click", () => {
    if (pesquisaAtual) {
      pesquisarNoticias(pesquisaAtual, paginaAtual - 1)
    } else {
      carregarNoticias(paginaAtual - 1, categoriaAtual, ordemAtual)
    }

    rolarParaTopo()
  })

  paginacao.appendChild(btnAnterior)

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button")
    btn.classList.add("pag-btn")
    btn.textContent = i

    if (i === paginaAtual) {
      btn.classList.add("pag-ativo")
    }

    btn.addEventListener("click", () => {
      if (pesquisaAtual) {
        pesquisarNoticias(pesquisaAtual, i)
      } else {
        carregarNoticias(i, categoriaAtual, ordemAtual)
      }

      rolarParaTopo()
    })

    paginacao.appendChild(btn)
  }

  const btnProximo = document.createElement("button")
  btnProximo.classList.add("pag-btn", "pag-arrow")
  btnProximo.innerHTML = '<i class="bi bi-chevron-right"></i>'
  btnProximo.disabled = paginaAtual === totalPaginas

  btnProximo.addEventListener("click", () => {
    if (pesquisaAtual) {
      pesquisarNoticias(pesquisaAtual, paginaAtual + 1)
    } else {
      carregarNoticias(paginaAtual + 1, categoriaAtual, ordemAtual)
    }

    rolarParaTopo()
  })

  paginacao.appendChild(btnProximo)
}

// FILTRO DE CATEGORIA

document
  .querySelectorAll(".newsCatgFilter button")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".newsCatgFilter button")
        .forEach(btn => btn.classList.remove("ativo"))

      button.classList.add("ativo")

      categoriaAtual = Number(button.dataset.category)

      carregarNoticias(1, categoriaAtual, ordemAtual)

    })

  })

// FILTRO DE ORDENAÇÃO

const filtro = document.getElementById("filter")

if (filtro) {

  filtro.addEventListener("change", () => {

    ordemAtual = filtro.value || "data-new"

    carregarNoticias(
      1,
      categoriaAtual,
      ordemAtual
    )

  })
}

// VOLTAR PARA O TOPO

function rolarParaTopo() {

  const news = document.getElementById("news")

  if (news) {
    news.scrollIntoView({

      behavior: "smooth"

    })
  }
}

// INICIALIZAÇÃO

carregarNoticias()