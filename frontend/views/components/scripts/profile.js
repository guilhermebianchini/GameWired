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

  let url = "https://gamewired-api.duckdns.org/posts"
  let method = "POST"

  if (editandoId) {
    url = `https://gamewired-api.duckdns.org/posts/${editandoId}`
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
      window.location.href = "/perfil"
    })
  } catch (err) {
    console.error("Erro ao criar postagem:", err)
  }
})

// SELECT COM OS JOGOS (MODAL DE POSTAGEM)

document.addEventListener("DOMContentLoaded", () => { carregarJogos() })

async function carregarJogos() {
  try {
    const res = await fetch("https://gamewired-api.duckdns.org/games/select")
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

// CARREGAR FOTO, NOME E BIO - ALTERAÇÃO

document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil()
    ajustarTextareas()
})

const inputFoto = document.getElementById("inputFoto")
const fotoImg = document.getElementById("foto_perfil")

fotoImg.addEventListener("click", () => {
    inputFoto.click()
})

inputFoto.addEventListener("change", () => {
    const file = inputFoto.files[0]
    if (!file) return

    const preview = URL.createObjectURL(file)
    fotoImg.src = preview

    fotoImg.onload = () => URL.revokeObjectURL(preview)
})

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
}

const bioTextarea = document.getElementById("bio")

function ajustarTextareas() {
    [bioTextarea].forEach(textarea => {
        autoResizeTextarea(textarea)
        textarea.addEventListener("input", () => autoResizeTextarea(textarea))
    })
}

async function carregarPerfil() {
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
        const res = await fetch(`https://gamewired-api.duckdns.org/profile`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const user = await res.json()

        if (!res.ok || !user) {
            alert("Erro ao carregar perfil!")
            return
        }

        document.getElementById("nome_usuario").textContent = user.nome_usuario
        document.getElementById("bio").value = user.bio || ""

        ajustarTextareas()

        fotoImg.src = user.foto_perfil || "https://res.cloudinary.com/dtno5yrwl/image/upload/v1776181814/user-default_gcbfvc.jpg"

    } catch (err) {
        console.error("Erro ao carregar perfil:", err)
    }
}

document.getElementById("btnSalvar").addEventListener("click", salvarPerfil)

async function salvarPerfil() {
    const token = localStorage.getItem("token")
    const bio = document.getElementById("bio").value

    const formData = new FormData()

    formData.append("bio", bio)

    const file = document.getElementById("inputFoto").files[0]
    if (file) {
        formData.append("foto_perfil", file)
    }

    try {
        const res = await fetch(`https://gamewired-api.duckdns.org/profile`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        const result = await res.json()

        Swal.fire({
            icon: "success",
            title: "Perfil atualizado!",
            text: "Alterações salvas com sucesso.",
            confirmButtonColor: "#8863e7"
        })

    } catch (err) {
        console.error("Erro ao salvar perfil:", err)
    }
}

// CARREGAR POSTAGENS NO PERFIL

let nextCursor = null
let loading = false
let hasMore = true
let postsController = null

function mostrarLoading() {
    const loadingEl = document.getElementById("loadingPosts")

    if (loadingEl) {
        loadingEl.classList.remove("hidden")
    }
}

function esconderLoading() {
    const loadingEl = document.getElementById("loadingPosts")

    if (loadingEl) {
        loadingEl.classList.add("hidden")
    }
}

function limparPosts() {
    const container = document.getElementById("postsContainer")

    if (container) {
        container.innerHTML = ""
    }
}

function montarHTMLPosts(posts) {
    return posts.map(post => `
        <div class="post">
            <div class="post_origem">
                <div class="user_photo">
                    <img src="${post.foto_perfil}" alt="Foto de Perfil">
                </div>

                <div class="infos_post">
                    <p class="username">${post.nome_usuario}</p>
                </div>

                
                <div class="post_menu">
                    <button onclick="toggleMenu(${post.post_id})">
                        ⋮
                    </button>

                    <div class="menu_options" id="menu-${post.post_id}">
                        <button onclick="editarPost(${post.post_id})">
                            Editar
                        </button>

                        <button onclick="deletarPost(${post.post_id})">
                            Deletar
                        </button>
                    </div>
                </div>               
            </div>

            <div class="content_post">
                <h4>${post.titulo_postagem}</h4>

                <p>${post.conteudo_postagem}</p>

                ${post.foto_postagem
                    ? `<img src="${post.foto_postagem}" alt="Imagem do post">`
                    : ""
                }
            </div>

            <div class="dataPost">${post.categoria} -
                Data de Publicação:
                ${new Date(post.data_postagem).toLocaleDateString()}
            </div>
        </div>
    `).join("")
}

function renderizarPosts(posts) {
    const container = document.getElementById("postsContainer")

    if (!container) {
        console.error("Container dos posts não encontrado!")
        return
    }

    container.insertAdjacentHTML(
        "beforeend",
        montarHTMLPosts(posts)
    )
}

async function carregarPosts(reset = false) {
    if (loading && !reset) return
    if (!hasMore && !reset) return

    const token = localStorage.getItem("token")

    if (!token) {
        console.error("Token não encontrado!")
        return
    }

    if (reset) {
        if (postsController) {
            postsController.abort()
        }

        nextCursor = null
        hasMore = true
        loading = false

        limparPosts()
    }

    loading = true
    mostrarLoading()

    postsController = new AbortController()

    try {
        let url = "https://gamewired-api.duckdns.org/posts/me"

        const params = new URLSearchParams()

        if (nextCursor !== null) {
            params.append("cursor", nextCursor)
        }

        if ([...params].length > 0) {
            url += `?${params.toString()}`
        }

        const response = await fetch(url, {
            signal: postsController.signal,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await response.json()

        if (!response.ok) {
            console.error(result);
            return
        }

        const posts = result.posts || []

        if (!Array.isArray(posts)) {
            console.error("Posts não retornaram em formato de array!")
            return
        }

        renderizarPosts(posts)

        nextCursor = result.nextCursor ?? null
        hasMore = result.hasMore ?? false

    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Erro ao carregar posts:", error)
        }
    } finally {
        loading = false;
        esconderLoading()
    }
}

const observer = new IntersectionObserver(
    async (entries) => {
        const entry = entries[0]

        if (
            entry.isIntersecting &&
            !loading &&
            hasMore
        ) {
            await carregarPosts()
        }
    },
    {
        root: null,
        rootMargin: "100px",
        threshold: 0
    }
);

document.addEventListener("DOMContentLoaded", async () => {
    await carregarPosts(true)

    const sentinela = document.getElementById("sentinelaPosts")

    if (sentinela) {
        observer.observe(sentinela)
    }
});

function toggleMenu(postId) {
    const menu = document.getElementById(`menu-${postId}`)

    document.querySelectorAll(".menu_options").forEach(m => {
        if (m !== menu) {
            m.style.display = "none"
        }
    });

    menu.style.display =
        menu.style.display === "flex"
            ? "none"
            : "flex"
}

document.addEventListener("click", (event) => {
    const clicouMenu =
        event.target.closest(".post_menu")

    if (!clicouMenu) {
        document
            .querySelectorAll(".menu_options")
            .forEach(menu => {
                menu.style.display = "none"
            })
    }
})

// EDITAR POSTAGEM

async function editarPost(post_id) {
    const token = localStorage.getItem("token")

    const res = await fetch(`https://gamewired-api.duckdns.org/posts/${post_id}/me`, {
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
        const res = await fetch(`https://gamewired-api.duckdns.org/posts/${post_id}`, {
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