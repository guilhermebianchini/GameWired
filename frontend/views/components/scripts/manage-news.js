// AUTENTICAÇÃO PARA PUBLICAR

function newsAuth() {
  const token = localStorage.getItem("token")

  const newsOff = document.getElementById("newsLoggedOff")
  const newsIn = document.getElementById("newsLoggedIn")

  if (token) {
    newsOff.classList.add("hidden")
    newsIn.classList.remove("hidden")
  } else {
    newsOff.classList.remove("hidden")
    newsIn.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("token")
  window.location.reload()
}

document.addEventListener("DOMContentLoaded", newsAuth)

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
              <h4>${news.titulo}</h4>
              <span class="date">${new Date(news.data_publicacao).toLocaleDateString('pt-BR')}</span>
                <div class="actions">
                  <button class="btn-edit">
                    <a href="/frontend/views/create-news.html?id=${news.news_id}" class="bi bi-pencil"> Editar </a>
                  </button>

                  <button class="btn-delete" onclick="abrirModalExclusao(${news.news_id})">
                    <i class="bi bi-trash"></i> Excluir
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

    const response = await fetch(`https://gamewired-api.duckdns.org/news/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const noticias = await response.json()

    renderizarManageNews(noticias)
  } catch (error) {
    console.error(error)
  }
}

carregarGerenciamentoNoticias()

// DELETAR NOTÍCIA

async function deletarNews(news_id) {
  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para deletar uma postagem.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  try {
    const res = await fetch(`https://gamewired-api.duckdns.org/news/${news_id}`, {
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
      text: "Erro de conexão ao deletar o notícia.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

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