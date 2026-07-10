// CARREGAR JOGOS POR PLATAFORMA

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
                  <p><strong>Publicador(a):</strong> ${game.publicadora}</p>
                  <p><strong>Classificação Indicativa:</strong> ${game.classificacao}</p>
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

// CARREGAR JOGOS PARA NAVEGADOR

async function carregarJogosParaNavegador(ids) {
  const wrapper = document.getElementById("browserGames")

  try {
    const responses = await Promise.all(
      ids.map(id =>
        fetch(`${API_URL}/games/${id}`)
      )
    )

    const jogos = await Promise.all(
      responses.map(async (res) => {
        if (!res.ok) return null

        const json = await res.json()
        return json.data
      })
    )

    const jogosValidos = jogos.filter(Boolean)

    wrapper.innerHTML = jogosValidos
      .map(game => `
        <article class="browserCard">
          <div class="card-origem">
            <div class="game_img">
              <img src="${game.game_img}" alt="${game.nome}">
            </div>

            <div class="txtGameCard">
              <h4>${game.nome}</h4>

              <p>${game.descricao}</p>

              <div class="gameLink">
                <p>Jogue aqui: <a href="${game.download}" target="_blank"> ${game.download}</a></p>
              </div>
            </div>
          </div>
        </article>
        `).join("")

  } catch (err) {
    console.error("Erro ao carregar jogos:", err)

    wrapper.innerHTML = "<p>Erro ao carregar jogos.</p>"
  }
}

carregarJogosParaNavegador([35, 36, 37])