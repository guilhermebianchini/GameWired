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
        const response = await fetch("https://gamewired-api.duckdns.org/users/me", {
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

// CARREGAMENTO DE ESTATÍSTICAS

async function carregarStats() {
    const token = localStorage.getItem("token")

    let url = "https://gamewired-api.duckdns.org/stats"

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error(`Erro: ${res.status}`)
        }

        const dados = await res.json()

        document.getElementById("usersInfo").textContent = dados.total_usuarios
        document.getElementById("postsInfo").textContent = dados.total_posts
        document.getElementById("commentsInfo").textContent = dados.total_comentarios
        document.getElementById("gamesInfo").textContent = dados.total_jogos
        document.getElementById("newsInfo").textContent = dados.total_noticias

    } catch (err) {
        console.error(
            "Erro ao carregar estatísticas:",
            err
        )
    }
}

async function carregarRanking() {

    const token = localStorage.getItem("token")

    let url = "https://gamewired-api.duckdns.org/top-users"

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error(`Erro: ${res.status}`)
        }

        const usuarios = await res.json()

        const tbody = document.getElementById("ranking-body")

        tbody.innerHTML = ""

        usuarios.forEach((usuario, index) => {

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${usuario.nome_usuario}</td>
                    <td>${usuario.total_posts}</td>
                    <td>${usuario.total_comentarios}</td>
                </tr>
            `
        })

    } catch (err) {
        console.error(
            "Erro ao carregar ranking:",
            err
        )
    }
}

async function iniciarDashboard() {
    await carregarStats()
    await carregarRanking()
}

iniciarDashboard()