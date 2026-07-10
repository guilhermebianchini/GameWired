import { API_URL } from "../../../config/connection.js"

// CARREGAR NOTÍCIAS

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

function renderizarNews(news) {
  const container = document.getElementById("newsContainer")

  if (!container) {
    console.error("Container das notícias não encontrado!")
    return
  }

  const html = previewNews(news)

  container.innerHTML = html
}

async function carregarNoticias() {
  try {
    const response = await fetch(`${API_URL}/news/latest`)

    const noticias = await response.json()

    renderizarNews(noticias)
  } catch (error) {
    console.error(error)
  }
}

carregarNoticias()

// CARROSSEL DE JOGOS

document.addEventListener("DOMContentLoaded", () => {
  carregarJogosPorPlataforma(1)
})

async function carregarJogosPorPlataforma(platform_id) {
  const wrapper = document.getElementById("carouselGames")

  try {
    const res = await fetch(`${API_URL}/games/platform/${platform_id}`)
    const games = await res.json()

    if (!res.ok) {
      wrapper.innerHTML = `<p>Nenhum jogo encontrado.</p>`
      return
    }

    wrapper.innerHTML = ""

    games.forEach(game => {
      wrapper.innerHTML += `
        <article class="card__game">
          <img src="${game.game_img}" alt="${game.nome}" />

          <div class="game-n-more">
            <p>${game.nome}</p>

            <button class="openModal" data-id="${game.games_id}">
              Saiba mais
            </button>

            <div class="modal" id="modal-${game.games_id}">
              <div class="modal-content">
                <span class="close">&times;</span>

                <h2>${game.nome}</h2>
                <hr>

                <div class="game-content">
                  <p>${game.descricao}</p>
                  <p><strong>Gênero:</strong> ${game.genero}</p>
                  <p><strong>Desenvolvedor(a):</strong> ${game.desenvolvedora}</p>
                  <p><strong>Tipo:</strong> ${game.tipo}</p>
                  <p class="sourceDownload"><strong>Download:</strong> ${game.download}</p>
                  <p><strong>Requisitos:</strong> ${game.requisitos}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      `
    })

    configurarModais()

  } catch (err) {
    console.error("Erro ao carregar jogos:", err)
    wrapper.innerHTML = `<p>Erro ao carregar jogos.</p>`
  }
}

function configurarModais() {
  const buttons = document.querySelectorAll(".openModal")
  const closes = document.querySelectorAll(".close")

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const gameId = button.dataset.id
      const modal = document.getElementById(`modal-${gameId}`)

      if (modal) {
        modal.classList.add("active")
      }
    })
  })

  closes.forEach(close => {
    close.addEventListener("click", () => {
      const modal = close.closest(".modal")
      modal.classList.remove("active")
    })
  })

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("active")
    }
  })
}

// CARREGAR POSTAGENS DA COMUNIDADE

function limparPosts() {
  const container = document.getElementById("postsContainer")
  if (container) container.innerHTML = ""
}

function previewPosts(posts) {
  let html = ""

  posts.forEach(post => {

    const resumo =
    post.conteudo_postagem.length > 120
      ? post.conteudo_postagem.slice(0, 120) + "..."
      : post.conteudo_postagem

    html += `
      <div class="container-community">
        <div class="community-wrapper">
          <div class="card-community">
            <div class="community-user">
              <img src="${post.foto_perfil}" alt="Foto de Perfil">
              <h4>${post.nome_usuario}</h4>
            </div>

            <div class="txt-community">
              <span>${post.categoria}</span>

              <p>${resumo}</p>
            </div>
          </div>
        </div>
      </div>
    `
  })

  return html
}

function renderizarPosts(post) {
  const container = document.getElementById("postsContainer")

  if (!container) {
    console.error("Container das postagens não encontrado!")
    return
  }

  const html = previewPosts(post)

  container.innerHTML = html
}

async function carregarPosts() {
  try {
    const response = await fetch(`${API_URL}/posts/latest`)

    const posts = await response.json()

    if (!Array.isArray(posts)) {
      console.error(posts)
      return
    }

    renderizarPosts(posts)
  } catch (error) {
    console.error(error)
  }
}

carregarPosts()