// RENDERIZAR CARDS

function renderizarGames(wrapper, games) {

  wrapper.innerHTML = ""

  if (games.length === 0) {
    wrapper.innerHTML = "<p>Nenhum jogo encontrado.</p>"
    return
  }

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
                  <p><strong>Publicador(a):</strong> ${game.publicadora}</p>
                  <p><strong>Classificação Indicativa:</strong> ${game.classificacao}</p>
                  <p><strong>Tipo:</strong> ${game.tipo}</p>
                  <p class="sourceDownload"><strong>Download/Onde Jogar?</strong> ${game.download}</p>
                  <p><strong>Requisitos:</strong> ${game.requisitos}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      `
  })

  configurarModais()
}

// CARREGAR JOGOS POR PLATAFORMA

document.addEventListener("DOMContentLoaded", () => {
  carregarJogosPorPlataforma(2)
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

    renderizarGames(wrapper, games)

  } catch (err) {
    console.error("Erro ao carregar jogos:", err)
    wrapper.innerHTML = `<p>Erro ao carregar jogos.</p>`
  }
}

// CONFIGURAÇÃO DO MODAL

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

// PESQUISAR JOGOS

const searchInput = document.querySelector(".search")

let debounce

searchInput.addEventListener("input", () => {
  clearTimeout(debounce)

  debounce = setTimeout(() => {
    pesquisarJogo(searchInput.value)
  }, 300)
})

async function pesquisarJogo(termo) {
  const wrapper = document.getElementById("carouselGames")

  termo = termo.trim()

  if (termo === "") {
    await carregarJogosPorPlataforma(2)

    return
  }

  if (termo.length < 2) return

  try {
    const response = await fetch(
      `${API_URL}/games/search?platform=1&q=${encodeURIComponent(termo)}`
    )

    if (!response.ok) {
      throw new Error("Erro na requisição!");
    }

    const data = await response.json()

    if (!data.ok) {
      throw new Error("Erro ao pesquisar jogos!")
    }

    renderizarGames(wrapper, data.data)

  } catch (err) {
    console.error(err)
  }
}