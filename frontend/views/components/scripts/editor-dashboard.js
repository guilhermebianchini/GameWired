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