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

    if (user.user_type !== "admin" && user.user_type !== "editor") {
      Swal.fire({
        icon: 'error',
        title: 'Autenticação inválida!',
        text: 'Você não é um editor ou administrador para acessar essa página.',
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

// CARREGAMENTO DE NOTÍCIAS DO USUÁRIO

function limparManageNews() {
  const container = document.getElementById("manageNewsContainer")
  if (container) container.innerHTML = ""
}

function previewManageNews(noticias) {
  let html = ""

  noticias.forEach(news => {

    html += `
      <div class="news-list">
        <div class="news-card">
          <img src="${news.img_noticia}" alt="${news.titulo}">
            <div class="news-content">
              <h3>${news.titulo}</h3>
              <span class="date">${news.data_publicacao.split('T')[0].split('-').reverse().join('/')}</span>
                <div class="actions">
                  <a class="btn-view" href="/noticias/${news.news_id}"> Visualizar </a>

                  <a class="btn-edit" href="/postagem-noticias/${news.news_id}"> Editar </a>

                  <button class="btn-delete" onclick="abrirModalExclusao(${news.news_id})">
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

function renderizarManageNews(news) {
  const container = document.getElementById("manageNewsContainer")

  if (!container) {
    console.error("Container das notícias não encontrado!")
    return
  }

  const html = previewManageNews(news)

  container.innerHTML = html
}

async function carregarGerenciamentoNoticias() {
  try {
    const token = localStorage.getItem("token")

    const response = await fetch(`${API_URL}/news/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message)
    }

    renderizarManageNews(result.data)
  } catch (error) {
    console.error(error)
  }
}

carregarGerenciamentoNoticias()

// FUNÇÃO DO BOTÃO DE DELETAR

let newsIdParaExcluir = null

function abrirModalExclusao(news_id) {

  newsIdParaExcluir = news_id

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

    if (!newsIdParaExcluir) return

    await deletarNews(newsIdParaExcluir)

    fecharModalExclusao()
  })

window.abrirModalExclusao = abrirModalExclusao

// DELETAR NOTÍCIA

async function deletarNews(news_id) {
  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para deletar uma notícia.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  try {
    const res = await fetch(`${API_URL}/news/${news_id}`, {
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
        text: result.message || "Erro ao deletar notícia!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Notícia deletada com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    document
      .getElementById("delete-modal")
      .classList.add("hidden")

    await carregarGerenciamentoNoticias()

  } catch (err) {
    console.error("Erro ao deletar notícia:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao deletar a notícia.",
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