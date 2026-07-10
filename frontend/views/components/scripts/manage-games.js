// AUTENTICAÇÃO

async function userAuth() {

  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: 'error',
      title: `Você não está logado!`,
      text: `Redirecionando para a página de login...`,
      confirmButtonColor: '#8863e7',
      confirmButtonText: 'Continuar'
    }).then(() => {
      window.location.href = "/login"
    })

    return
  }

  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const user = await response.json()

    if (user.user_type !== "admin") {
      Swal.fire({
        icon: 'error',
        title: 'Autenticação inválida!',
        text: 'Você não é um administrador para acessar essa página.',
        confirmButtonColor: '#8863e7',
        confirmButtonText: 'Continuar'
      }).then(() => {
        window.location.href = "/"
      })

      return
    }

    const loggedOff = document.getElementById("loggedOff")
    const loggedIn = document.getElementById("loggedIn")

    loggedOff.classList.add("hidden")
    loggedIn.classList.remove("hidden")

  } catch (error) {
    console.error("Erro ao autenticar usuário:", error)
  }
}

document.addEventListener("DOMContentLoaded", userAuth)

// PEGANDO O ID DO USUÁRIO COM O JWT

function getUserIdFromToken() {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payloadBase64 = token.split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    const decoded = JSON.parse(atob(payloadBase64))
    return Number(decoded.id)
  } catch (e) {
    console.error("Erro ao decodificar token:", e)
    return null
  }
}

// CARREGAMENTO DE JOGOS

function limparManageGames() {
  const container = document.getElementById("manageGamesContainer")
  if (container) container.innerHTML = ""
}

function previewManageGames(jogos) {
  let html = ""

  jogos.forEach(games => {

    const resumo =
    games.descricao.length > 300
      ? games.descricao.slice(0, 300) + "..."
      : games.descricao

    html += `
      <div class="games-list">
        <div class="games-card">
          <img src="${games.game_img}" alt="${games.nome}">
            <div class="games-content">
              <h3>${games.nome}</h3>
              <span class="description">${resumo}</span>
                <div class="actions">
                  <a class="btn-edit" href="/postagem-jogos/${games.games_id}"> Editar </a>

                  <button class="btn-delete" onclick="abrirModalExclusao(${games.games_id})">
                    Excluir
                  </button>
                </div>
            </div>
        </div>
      </div>
    `
  })

  return html
}

function renderizarManageGames(games) {
  const container = document.getElementById("manageGamesContainer")

  if (!container) {
    console.error("Container dos jogos não encontrado!")
    return
  }

  const html = previewManageGames(games)

  container.innerHTML = html
}

async function carregarGerenciamentoJogos() {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/games`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const jogos = await response.json()

    renderizarManageGames(jogos)
  } catch (error) {
    console.error(error)
  }
}

carregarGerenciamentoJogos()

// FUNÇÃO DO BOTÃO DE DELETAR

let gamesIdParaExcluir = null

function abrirModalExclusao(games_id) {

  gamesIdParaExcluir = games_id

  document
    .getElementById("delete-modal")
    .classList.remove("hidden")
}

function fecharModalExclusao() {

  document
    .getElementById("delete-modal")
    .classList.add("hidden")
}

document
  .getElementById("cancel-delete")
  .addEventListener("click", fecharModalExclusao)

document
  .getElementById("confirm-delete")
  .addEventListener("click", async () => {

    if (!gamesIdParaExcluir) return

    await deletarGame(gamesIdParaExcluir)

    fecharModalExclusao()
  })

window.abrirModalExclusao = abrirModalExclusao

// DELETAR JOGO

async function deletarGame(games_id) {
  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para deletar um jogo.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  try {
    const res = await fetch(`${API_URL}/games/${games_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        key: "EXCLUIR"
      })
    })

    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: result.message || "Erro ao deletar jogo!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Jogo deletado com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    document
      .getElementById("delete-modal")
      .classList.add("hidden")

    await carregarGerenciamentoJogos()

  } catch (err) {
    console.error("Erro ao deletar jogo:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao deletar o jogo.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

// RESIZE TEXTAREA

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
}

const contentTextarea = document.getElementById("conteudo")

function ajustarTextareas() {
    [contentTextarea].forEach(textarea => {
        autoResizeTextarea(textarea)
        textarea.addEventListener("input", () => autoResizeTextarea(textarea))
    })
}

ajustarTextareas()

// MODAL DE LIMPAR

const btnClear = document.querySelector("#btn-clear")
const modalClear = document.querySelector("#clear-modal")
const btnCancelClear = document.querySelector("#cancel-clear")
const btnConfirmClear = document.querySelector("#confirm-clear")

btnClear.addEventListener("click", () => {
  modalClear.classList.remove("hidden")
})

btnCancelClear.addEventListener("click", () => {
  modalClear.classList.add("hidden")
})

btnConfirmClear.addEventListener("click", () => {
  form.reset()

  // LIMPAR ERROS VISUAIS
  document.querySelectorAll('.input-box').forEach(box => {
    box.classList.remove('invalid', 'valid')
    const error = box.querySelector('.error')
    if (error) error.innerHTML = ''
  })

  modalClear.classList.add("hidden")
})

modalClear.addEventListener("click", (e) => {
  if (e.target === modalClear) {
    modalClear.classList.add("hidden")
  }
})