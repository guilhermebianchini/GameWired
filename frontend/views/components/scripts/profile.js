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
            window.location.href = "../login.html"
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

/*async function carregarPostsPerfil() {
  const userId = localStorage.getItem("userId")

  const response = await fetch(`https://gamewired-api.duckdns.org/posts/user/${userId}`)
  const posts = await response.json()

  const container = document.getElementById('postsContainer')

  container.innerHTML = posts.map(post => `
    <div class="post">
      <div class="post_origem">
        <div class="user_photo">
          <img src="${post.foto_perfil}" alt="Foto de Perfil">
        </div>

        <div class="infos_post">
          <p id="username">${post.nome_usuario}</p>
          <p id="dataCatg">
            ${new Date(post.data_postagem).toLocaleDateString()} - ${post.categoria}
          </p>
        </div>
      </div>

      <div class="content_post">
        <h4>${post.titulo_postagem}</h4>
        <p>${post.conteudo_postagem}</p>
        ${post.foto_postagem ? `<img src="${post.foto_postagem}" alt="Imagem do post">` : ''}
      </div>
    </div>
  `).join('')
}

carregarPostsPerfil()*/