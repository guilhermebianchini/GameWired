// AUTENTICAÇÃO PARA PUBLICAR

function communityAuth() {
  const token = localStorage.getItem("token")

  const CommunityOff = document.getElementById("CommunityLoggedOff")
  const CommunityIn = document.getElementById("CommunityLoggedIn")

  if (token) {
    CommunityOff.classList.add("hidden")
    CommunityIn.classList.remove("hidden")
  } else {
    CommunityOff.classList.remove("hidden")
    CommunityIn.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("token")
  window.location.reload()
}

document.addEventListener("DOMContentLoaded", communityAuth)

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

// CARREGAR PERFIL

document.addEventListener("DOMContentLoaded", () => { carregarPerfil() })

async function carregarPerfil() {
  const token = localStorage.getItem("token")
  const abrirPerfilUsuario = document.getElementById("abrirPerfil")
  const foto = document.querySelector(".foto-perfil")

  const fotoPadrao = "https://res.cloudinary.com/dtno5yrwl/image/upload/v1776181814/user-default_gcbfvc.jpg"

  if (!token) {
    abrirPerfilUsuario.style.display = "none"
    if (foto) foto.src = fotoPadrao
    return
  }

  try {
    const res = await fetch(`http://localhost:3000/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })

    const user = await res.json()

    abrirPerfilUsuario.addEventListener("click", () => {
      window.location.href = `/frontend/views/pages/subpages/profile.html`
    })

    document.getElementById("nome_usuario").textContent = user.nome_usuario

    if (foto) {
      foto.src = user.foto_perfil && user.foto_perfil.trim() !== ""
        ? user.foto_perfil
        : fotoPadrao
    }

  } catch (err) {
    console.error("Erro ao carregar perfil:", err)
  }
}

// MODAL DE POSTAGEM

let editandoId = null

document.addEventListener("DOMContentLoaded", () => {
  const openModal = document.querySelector(".openModal")
  const modal = document.querySelector(".modal")
  const closeModal = document.querySelector(".closeModal")
  const form = document.querySelector(".postForm")

  openModal.addEventListener("click", () => {
    modal.style.display = "flex"
  })

  closeModal.addEventListener("click", () => {
    modal.style.display = "none"
    form.reset()
    editandoId = null

    document.querySelector(".modal h3").textContent = "Faça sua postagem na comunidade!"
    document.querySelector(".sentPost").textContent = "Enviar"
  })

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
      form.reset()
      editandoId = null
    }
  })
})

// FORMULÁRIO DE POSTAGEM E VALIDAÇÃO

const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const token = localStorage.getItem("token")

  const titulo = document.getElementById("titulo_postagem").value.trim()
  const conteudo = document.getElementById("conteudo_postagem").value.trim()
  const categoria = document.getElementById("categoria_postagem").value
  const fileInput = document.getElementById("foto_postagem")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para criar uma postagem.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  if (!titulo || !conteudo || !categoria) {
    Swal.fire({
      icon: "warning",
      title: "Preencha todos os dados!",
      text: "Os campos de título, jogo e conteúdo são obrigatórios.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  const formData = new FormData()
  formData.append("titulo_postagem", titulo)
  formData.append("conteudo_postagem", conteudo)
  formData.append("games_id", categoria)

  if (fileInput.files.length > 0) {
    formData.append("foto_postagem", fileInput.files[0])
  }

  let url = "http://localhost:3000/posts"
  let method = "POST"

  if (editandoId) {
    url = `http://localhost:3000/posts/${editandoId}`
    method = "PATCH"
  }

  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: result.message || "Erro ao criar postagem!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Postagem feita com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "community.html"
    })
  } catch (err) {
    console.error("Erro ao criar postagem:", err)
  }
})

// SELECT COM OS JOGOS (MODAL DE POSTAGEM)

document.addEventListener("DOMContentLoaded", () => { carregarJogos() })

async function carregarJogos() {
  try {
    const res = await fetch("http://localhost:3000/games/select")
    const games = await res.json()

    const select = document.getElementById("categoria_postagem")

    select.innerHTML = '<option value="">Selecione um jogo...</option>'

    games.forEach(game => {
      const option = document.createElement("option")
      option.value = game.games_id
      option.textContent = game.nome

      select.appendChild(option)
    })

  } catch (err) {
    console.error("Erro ao carregar jogos:", err)
  }
}

// FILTRO DE JOGOS

async function carregarJogosFiltro() {
  try {
    const res = await fetch('http://localhost:3000/games/select')
    const games = await res.json()

    const select = document.getElementById('select-button')

    if (!select) {
      console.error('Select do filtro não encontrado!')
      return
    }

    select.innerHTML = '<option value="">Selecione...</option>'

    games.forEach(game => {
      const option = document.createElement('option')
      option.value = game.games_id
      option.textContent = game.nome
      select.appendChild(option)
    })

  } catch (err) {
    console.error('Erro ao carregar jogos:', err)
  }
}

// CARREGAR POSTAGENS

let nextCursor = null
let loading = false
let hasMore = true
let gameIdAtual = null
let postsController = null

function mostrarLoading() {
  const loadingEl = document.getElementById("loadingPosts")
  if (loadingEl) loadingEl.classList.remove("hidden")
}

function esconderLoading() {
  const loadingEl = document.getElementById("loadingPosts")
  if (loadingEl) loadingEl.classList.add("hidden")
}

function limparPosts() {
  const container = document.getElementById("postsContainer")
  if (container) container.innerHTML = ""
}

async function recarregarFeed() {
  observer.disconnect()

  nextCursor = null
  hasMore = true
  loading = false

  await carregarPosts(true)

  const sentinela = document.getElementById("sentinelaPosts")
  if (sentinela) {
    observer.observe(sentinela)
  }
}

function montarHTMLPosts(posts, comentarios, userIdLogado) {
  let html = ""

  posts.forEach(post => {
    const comentariosDoPost = comentarios.filter(comentario =>
      Number(comentario.post_id) === Number(post.post_id)
    )

    let comentariosHTML = ""

    comentariosDoPost.forEach(comentario => {
      comentariosHTML += `
        <div class="comment">
          <div class="comment_origem">
            <div class="user_photo_comment">
              <img src="${comentario.foto_perfil}" alt="Foto de Perfil">
            </div>

            <div class="infos_comment">
              <p class="usernameComment">${comentario.nome_usuario}</p>
            </div>

            ${Number(comentario.user_id) === Number(userIdLogado) ? `
              <div class="comment_menu">
                <button onclick="toggleMenuComentario(${comentario.comentario_id})">⋮</button>

                <div class="menu_options" id="comentario_menu-${comentario.comentario_id}">
                  <button onclick="editarComment(${comentario.comentario_id})">Editar</button>
                  <button onclick="deletarComment(${comentario.comentario_id})">Deletar</button>
                </div>
              </div>
            ` : ""}
          </div>

          <div class="content_comment">
            <p>${comentario.comentario_conteudo}</p>
          </div>

          <p class="dataComment">
            Data de Publicação: ${new Date(comentario.comentario_data).toLocaleDateString()}
          </p>
        </div>
      `
    })

    html += `
      <div class="post">
        <div class="post_origem">
          <div class="user_photo">
            <img src="${post.foto_perfil}" alt="Foto de Perfil">
          </div>

          <div class="infos_post">
            <p class="username">${post.nome_usuario}</p>
            <p class="Catg">${post.categoria}</p>
          </div>

          ${Number(post.user_id) === Number(userIdLogado) ? `
            <div class="post_menu">
              <button onclick="toggleMenu(${post.post_id})">⋮</button>

              <div class="menu_options" id="menu-${post.post_id}">
                <button onclick="editarPost(${post.post_id})">Editar</button>
                <button onclick="deletarPost(${post.post_id})">Deletar</button>
              </div>
            </div>
          ` : ""}
        </div>

        <div class="content_post">
          <h3>${post.titulo_postagem}</h3>
          <p>${post.conteudo_postagem}</p>
          ${post.foto_postagem ? `<img src="${post.foto_postagem}" alt="Imagem do post">` : ""}
        </div>

        <div class="dataPost">
          Data de Publicação: ${new Date(post.data_postagem).toLocaleDateString()}
        </div>

        <hr>

        <div class="comments_list">
          ${comentariosHTML || `<p class="semComentarios">Nenhum comentário ainda.</p>`}
        </div>

        <form class="comments" data-post-id="${post.post_id}">
          <textarea class="commentContent" placeholder="Escreva seu comentário..."></textarea>
          <button type="submit" class="commentBtn">Comentar</button>
        </form>
      </div>
    `
  })

  return html
}

function renderizarPosts(posts, comentarios) {
  const container = document.getElementById("postsContainer")

  if (!container) {
    console.error("Container dos posts não encontrado!")
    return
  }

  const userIdLogado = getUserIdFromToken()
  const html = montarHTMLPosts(posts, comentarios, userIdLogado)

  container.insertAdjacentHTML("beforeend", html)
}

async function carregarPosts(reset = false) {
  if (loading && !reset) return
  if (!hasMore && !reset) return

  if (reset) {
    if (postsController) {
      postsController.abort()
    }

    nextCursor = null
    hasMore = true
    loading = false
  }

  loading = true
  mostrarLoading()

  postsController = new AbortController()

  try {
    let url = "http://localhost:3000/posts/cursor"
    const params = new URLSearchParams()

    if (gameIdAtual) {
      params.append("games_id", gameIdAtual)
    }

    if (nextCursor !== null) {
      params.append("cursor", nextCursor)
    }

    if ([...params].length > 0) {
      url += `?${params.toString()}`
    }

    console.log("URL da requisição:", url)

    const [responsePosts, responseComentarios] = await Promise.all([
      fetch(url, { signal: postsController.signal }),
      fetch("http://localhost:3000/comentarios", { signal: postsController.signal })
    ])

    const postsResult = await responsePosts.json()
    const comentariosResult = await responseComentarios.json()

    if (!responsePosts.ok) {
      console.error("Erro retornado pelo backend:", postsResult)
      return
    }

    const posts = postsResult.data || []
    const comentarios = comentariosResult.data || comentariosResult

    if (!Array.isArray(posts)) {
      console.error("A resposta de posts não é um array:", posts)
      return
    }

    if (reset) {
      limparPosts()
    }

    renderizarPosts(posts, comentarios)

    nextCursor = postsResult.next_cursor || null
    hasMore = !!postsResult.next_cursor
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Erro ao carregar posts:", error)
    }
  } finally {
    loading = false
    esconderLoading()
  }
}

const observer = new IntersectionObserver(async (entries) => {
  const entry = entries[0]

  if (entry.isIntersecting && !loading && hasMore) {
    await carregarPosts()
  }
}, {
  root: null,
  rootMargin: "0px",
  threshold: 1
})

document.addEventListener("DOMContentLoaded", async () => {
  await carregarJogosFiltro()
  await carregarPosts(true)

  const sentinela = document.getElementById("sentinelaPosts")
  if (sentinela) {
    observer.observe(sentinela)
  }

  const botaoFiltrar = document.getElementById("filtrar")

  if (botaoFiltrar) {
    botaoFiltrar.addEventListener('click', async () => {

      observer.disconnect()

      const select = document.getElementById('select-button')
      gameIdAtual = select.value || null

      await carregarPosts(true)

      const sentinela = document.getElementById("sentinelaPosts")
      if (sentinela) {
        observer.observe(sentinela)
      }
    })
  }
})

function toggleMenu(postId) {
  const menu = document.getElementById(`menu-${postId}`)

  document.querySelectorAll(".menu_options").forEach(m => {
    if (m !== menu) m.style.display = "none"
  })

  menu.style.display = menu.style.display === "flex" ? "none" : "flex"
}

function toggleMenuComentario(comentarioId) {
  const menu = document.getElementById(`comentario_menu-${comentarioId}`)

  document.querySelectorAll(".comment_menu .menu_options").forEach(m => {
    if (m !== menu) m.style.display = "none"
  })

  menu.style.display = menu.style.display === "flex" ? "none" : "flex"
}

// EDITAR POSTAGEM

async function editarPost(post_id) {
  const token = localStorage.getItem("token")

  const res = await fetch(`http://localhost:3000/posts/${post_id}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  try {
    const result = await res.json()

    if (!res.ok) {
      alert(result.message || "Erro ao carregar post!")
      return
    }

    const post = result.data

    editandoId = post.post_id

    document.getElementById("titulo_postagem").value = post.titulo_postagem
    document.getElementById("conteudo_postagem").value = post.conteudo_postagem
    document.getElementById("categoria_postagem").value = post.games_id

    document.querySelector(".modal h3").textContent = "Editar postagem"
    document.querySelector(".sentPost").textContent = "Salvar alterações"

    document.querySelector(".modal").style.display = "flex"

  } catch (err) {
    console.error("Erro ao carregar post:", err)
    alert("Erro de conexão ao carregar post.")
  }
}

// DELETAR POSTAGEM

async function deletarPost(post_id) {
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

  const confirmacao = await Swal.fire({
    icon: "warning",
    title: "Deseja apagar esta postagem?",
    text: "Essa ação não poderá ser desfeita.",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#8863e7",
    confirmButtonText: "Deletar",
    cancelButtonText: "Cancelar"
  })

  if (!confirmacao.isConfirmed) return

  try {
    const res = await fetch(`http://localhost:3000/posts/${post_id}`, {
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
        text: result.message || "Erro ao deletar post!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Post deletado com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    await recarregarFeed()

  } catch (err) {
    console.error("Erro ao deletar post:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao deletar o post.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

// CRIAR COMENTÁRIOS

let editandoComentarioId = null

document.addEventListener("submit", async (e) => {
  const form = e.target

  if (!form.classList.contains("comments")) return

  e.preventDefault()

  const token = localStorage.getItem("token")
  const textarea = form.querySelector(".commentContent")
  const comentario_conteudo = textarea.value.trim()
  const post_id = Number(form.dataset.postId)

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para comentar no post.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  if (!comentario_conteudo) {
    Swal.fire({
      icon: "warning",
      title: "Preencha todos os dados!",
      text: "O conteúdo do comentário não pode ficar vazio.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  let url = "http://localhost:3000/comentarios"
  let method = "POST"
  let body = {
    comentario_conteudo,
    post_id
  }

  if (editandoComentarioId) {
    url = `http://localhost:3000/comentarios/${editandoComentarioId}`
    method = "PATCH"
    body = {
      comentario_conteudo
    }
  }

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: result.message || "Erro ao salvar comentário!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    textarea.value = ""
    form.querySelector(".commentBtn").textContent = "Comentar"
    editandoComentarioId = null

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Comentário feito com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    await recarregarFeed()

  } catch (err) {
    console.error("Erro ao criar comentário:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro ao conectar com o servidor.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
})

// EDITAR COMENTÁRIO

async function editarComment(comentario_id) {
  const token = localStorage.getItem("token")

  try {
    const res = await fetch(`http://localhost:3000/comentarios/${comentario_id}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message || "Erro ao carregar comentário!")
      return
    }

    const comentario = result.data
    editandoComentarioId = comentario.comentario_id

    const form = document.querySelector(`.comments[data-post-id="${comentario.post_id}"]`)
    if (!form) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Formulário do comentário não encontrado.",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    const textarea = form.querySelector(".commentContent")
    const button = form.querySelector(".commentBtn")

    textarea.value = comentario.comentario_conteudo
    textarea.focus()
    button.textContent = "Salvar"

  } catch (err) {
    console.error("Erro ao carregar comentário:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao carregar comentário.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

// DELETAR COMENTÁRIOS

async function deletarComment(comentario_id) {
  const token = localStorage.getItem("token")

  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado!",
      text: "Faça login para deletar uma comentário.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
    return
  }

  const confirmacao = await Swal.fire({
    icon: "warning",
    title: "Deseja apagar este comentário?",
    text: "Essa ação não poderá ser desfeita.",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#8863e7",
    confirmButtonText: "Deletar",
    cancelButtonText: "Cancelar"
  })

  if (!confirmacao.isConfirmed) return

  try {
    const res = await fetch(`http://localhost:3000/comentarios/${comentario_id}`, {
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
        text: result.message || "Erro ao deletar comentário!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Comentário deletado com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })

    await recarregarFeed()

  } catch (err) {
    console.error("Erro ao deletar comentário:", err)
    Swal.fire({
      icon: "error",
      title: "Erro!",
      text: "Erro de conexão ao comentário o post.",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    })
  }
}

// CARREGAR FUNÇÕES

window.onload = () => {
  carregarPosts()
  carregarJogos()
  carregarJogosFiltro()

  document.getElementById('filtrar').addEventListener('click', () => {
    const gameId = document.getElementById('select-button').value
    carregarPosts(gameId)
  })
}