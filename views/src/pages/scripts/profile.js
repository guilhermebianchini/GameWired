document.addEventListener("DOMContentLoaded", () => {
    carregarPerfil()
    ajustarTextareas()
})

const inputFoto = document.getElementById("inputFoto")
const fotoImg = document.getElementById("foto_perfil")
let fotoBase64 = null

fotoImg.addEventListener("click", () => {
    inputFoto.click()
})

function redimensionarImagem(base64, maxWidth = 800, maxHeight = 800) {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {

            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                    height *= maxWidth / width
                    width = maxWidth
                } else {
                    width *= maxHeight / height
                    height = maxHeight
                }
            }

            const canvas = document.createElement("canvas")
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, width, height)

            const novoBase64 = canvas.toDataURL("image/jpeg", 0.7)

            resolve(novoBase64)
        }

        img.src = base64
    })
}

inputFoto.addEventListener("change", function () {
    const file = this.files[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = async function (e) {
        const base64Original = e.target.result

        const base64Reduzido = await redimensionarImagem(base64Original)

        fotoBase64 = base64Reduzido
        fotoImg.src = base64Reduzido
    }

    reader.readAsDataURL(file)
})

function autoResizeTextarea(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = textarea.scrollHeight + "px"
}

const bioTextarea = document.getElementById("bio")
const prefTextarea = document.getElementById("preferencias")

function ajustarTextareas() {
    [bioTextarea, prefTextarea].forEach(textarea => {
        autoResizeTextarea(textarea)
        textarea.addEventListener("input", () => autoResizeTextarea(textarea))
    })
}

async function carregarPerfil() {
    const userId = localStorage.getItem("userId")

    if (!userId) {
        Swal.fire({
            icon: 'error',
            title: `Você não está logado!`,
            text: `Redirecionando para a página de login...`,
            confirmButtonColor: '#8863e7',
            confirmButtonText: 'Continuar'
        }).then(() => {
            window.location.href = "./login.html"
        })

        return
    }

    try {
        const res = await fetch(`http://localhost:3000/profile/${userId}`)
        const user = await res.json()

        if (!user || user.erro) {
            alert("Erro ao carregar perfil!")
            return
        }

        document.getElementById("nome_usuario").textContent = user.nome_usuario
        document.getElementById("bio").value = user.bio || ""
        document.getElementById("preferencias").value = Array.isArray(user.preferencias)
            ? user.preferencias.join(", ")
            : ""

        ajustarTextareas()
        
        const foto = document.querySelector(".foto-perfil")
        foto.src = user.foto_perfil || "/views/src/assets/imgs/user-default.jpg"
        fotoBase64 = user.foto_perfil || null

    } catch (err) {
        console.error("Erro ao carregar perfil:", err)
    }
}

document.getElementById("btnSalvar").addEventListener("click", salvarPerfil)

async function salvarPerfil() {
    const userId = localStorage.getItem("userId")

    const bio = document.getElementById("bio").value
    const pref = document.getElementById("preferencias").value

    const preferenciasArray = pref
        .split(",")
        .map(p => p.trim())
        .filter(p => p.length > 0)

    const data = {
        foto_perfil: fotoBase64,
        bio,
        preferencias: preferenciasArray
    }

    try {
        const res = await fetch(`http://localhost:3000/profile/update/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify (data)
        })

        const result = await res.json()
        console.log(result)

        Swal.fire({
            icon: "success",
            title: "Perfil atualizado!",
            text: "Alterações salvas com sucesso.",
            confirmButtonColor: "#8863e7"
        })

        ajustarTextareas()

    } catch (err) {
        console.error("Erro ao salvar perfil:", err)
    }
}