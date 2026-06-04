// AUTENTICAÇÃO

async function newsAuth() {

  console.log("newsAuth executada")

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

    const newsOff = document.getElementById("newsLoggedOff")
    const newsIn = document.getElementById("newsLoggedIn")

    newsOff.classList.add("hidden")
    newsIn.classList.remove("hidden")

  } catch (error) {
    console.error("Erro ao autenticar usuário:", error)
    logout()
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