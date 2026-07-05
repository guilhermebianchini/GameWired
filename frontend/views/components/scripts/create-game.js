// AUTENTICAÇÃO PARA PUBLICAR

async function newsAuth() {

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

// FORMULÁRIO DE POSTAGEM E VALIDAÇÃO

let editandoId = null

const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const token = localStorage.getItem("token")

  const fields = [
    { id: 'game_name', validator: nomeIsValid },
    { id: 'game_img', validator: imgIsValid },
    { id: 'game_platforms', validator: plataformaIsValid },
    { id: 'game_description', validator: descricaoIsValid },
    { id: 'game_genre', validator: generoIsValid },
    { id: 'game_developer', validator: desenvolvedoraIsValid },
    { id: 'game_publisher', validator: publicadoraIsValid },
    { id: 'game_classification', validator: classificacaoIsValid },
    { id: 'game_type', validator: tipoIsValid },
    { id: 'game_download', validator: downloadIsValid },
    { id: 'game_requirements', validator: requisitosIsValid }
  ]

  const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

  let formIsValid = true

  fields.forEach(function (field) {
    const input = document.getElementById(field.id)
    const inputBox = input.closest('.input-box')
    const inputValue = input.value
    
    const fieldValidator = field.id === "game_platforms"
      ? field.validator()
      : field.validator(inputValue)

    const errorSpan = inputBox.querySelector('.error')
    errorSpan.innerHTML = ''

    inputBox.classList.remove('invalid')
    inputBox.classList.add('valid')

    if (!fieldValidator.isValid) {
      formIsValid = false

      errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`

      inputBox.classList.add('invalid')
      inputBox.classList.remove('valid')
    }
  })

  if (!formIsValid) {
    return
  }

  const nome = document.getElementById("game_name").value.trim()
  const fileInput = document.getElementById("game_img")
  const plataformas = [...document.querySelectorAll('input[name="platforms"]:checked')].map(checkbox => checkbox.value)
  const descricao = document.getElementById("game_description").value.trim()
  const genero = document.getElementById("game_genre").value.trim()
  const desenvolvedora = document.getElementById("game_developer").value.trim()
  const publicadora = document.getElementById("game_publisher").value.trim()
  const classificacao = document.getElementById("game_classification").value.trim()
  const tipo = document.getElementById("game_type").value.trim()
  const download = document.getElementById("game_download").value.trim()
  const requisitos = document.getElementById("game_requirements").value.trim()

  const formData = new FormData()
  formData.append("nome", nome)
  plataformas.forEach(plataforma => { formData.append("plataformas", plataforma) })
  formData.append("descricao", descricao)
  formData.append("genero", genero)
  formData.append("desenvolvedora", desenvolvedora)
  formData.append("publicadora", publicadora)
  formData.append("classificacao", classificacao)
  formData.append("tipo", tipo)
  formData.append("download", download)
  formData.append("requisitos", requisitos)

  if (fileInput.files.length > 0) {
    formData.append("game_img", fileInput.files[0])
  }

  let url = "https://gamewired-api.duckdns.org/games"
  let method = "POST"

  if (editandoId) {
    url = `https://gamewired-api.duckdns.org/games/${editandoId}`
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
        text: result.message || "Erro ao adicionar jogo!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Jogo adicionado com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "/dashboard"
    })
  } catch (err) {
    console.error("Erro ao adicionar jogo:", err)
  }
})

// VALIDAÇÃO REGGEX

function isEmpty(value) {
  return value === ''
}

function nomeIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O nome do jogo não pode estar vazio!'
    return validator
  }

  const max = 150

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `O nome do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function imgIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  const fileInput = document.getElementById('game_img')

  if (!editandoId && fileInput.files.length === 0) {
    validator.isValid = false
    validator.errorMessage = 'A imagem do jogo é obrigatória!'
    return validator
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0]

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg"
    ]

    if (!allowedTypes.includes(file.type)) {
      validator.isValid = false
      validator.errorMessage =
        "Formato inválido! Use JPEG, PNG ou JPG."
    }
  }

  return validator
}

function plataformaIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  const plataformas = document.querySelectorAll(
    'input[name="platforms"]:checked'
  )

  if (plataformas.length === 0) {
    validator.isValid = false
    validator.errorMessage =
      "É preciso escolher ao menos uma plataforma do jogo!"
  }

  return validator
}

function descricaoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A descrição do jogo não pode estar vazia!'
    return validator
  }

  const min = 25

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `A descrição do jogo deve ter no mínimo ${min} caracteres!`
    return validator
  }

  const max = 1000

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `A descrição do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function generoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O gênero do jogo não pode estar vazio!'
    return validator
  }

  const max = 150

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `O gênero do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function desenvolvedoraIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A desenvolvedora do jogo não pode estar vazia!'
    return validator
  }

  const max = 100

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `A desenvolvedora do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function publicadoraIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A publicadora do jogo não pode estar vazia!'
    return validator
  }

  const max = 100

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `A publicadora do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function classificacaoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A classificação do jogo não pode estar vazia!'
    return validator
  }

  const max = 30

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `A classificação do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function tipoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O tipo do jogo não pode estar vazio!'
    return validator
  }

  const max = 100

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `O tipo do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function downloadIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O link/local do jogo não pode estar vazio!'
    return validator
  }

  const max = 150

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `O link/local do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

function requisitosIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'Os requisitos do jogo não pode estar vazio!'
    return validator
  }

  const min = 25

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `Os requisitos do jogo deve ter no mínimo ${min} caracteres!`
    return validator
  }

  const max = 1000

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `Os requisitos do jogo deve ter no máximo ${max} caracteres!`
    return validator
  }

  return validator
}

// EDIÇÃO DE NOTÍCIAS

let newsId = null

const path = window.location.pathname
const parts = path.split("/").filter(Boolean)
const lastPart = parts[parts.length - 1]

if (/^\d+$/.test(lastPart)) {
  newsId = lastPart
}

if (newsId) {
  editarNews(newsId)
}

async function editarNews(news_id) {
  const token = localStorage.getItem("token")

  const res = await fetch(`https://gamewired-api.duckdns.org/news/${news_id}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  try {
    const result = await res.json()

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Erro ao carregar notícia.",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })

      return
    }

    const news = result.data

    const preview = document.getElementById("preview-imagem")
    const info = document.getElementById("imagem-info")

    if (news.img_noticia) {
      preview.src = news.img_noticia
      preview.style.display = "block"

      info.classList.remove("hidden")
    }

    editandoId = news.news_id

    document.getElementById("titulo").value = news.titulo
    document.getElementById("data_publicacao").value = news.data_publicacao.split("T")[0]
    document.getElementById("subtitulo").value = news.subtitulo
    document.getElementById("conteudo").innerHTML = news.conteudo
    document.getElementById("fonte").value = news.fonte

    document.querySelector(".btn-publish").textContent = "Salvar alterações"
  } catch (err) {
    console.error("Erro ao carregar notícia:", err)
  }
}

const inputImagem = document.getElementById("img_noticia")
const preview = document.getElementById("preview-imagem")

inputImagem?.addEventListener("change", () => {
  const file = inputImagem.files[0]

  if (!file) return

  preview.src = URL.createObjectURL(file)
  preview.style.display = "block"
})

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

  document.getElementById("conteudo").innerHTML = ""

  const preview = document.getElementById("preview-imagem")

  if (preview) {
    preview.src = ""
    preview.style.display = "none"
  }

  const info = document.getElementById("imagem-info")

  if (info) {
    info.style.display = "none"
  }

  document.querySelectorAll('.input-box').forEach(box => {
    box.classList.remove('invalid', 'valid')

    const error = box.querySelector('.error')

    if (error) {
      error.innerHTML = ''
    }
  })

  modalClear.classList.add("hidden")
})

modalClear.addEventListener("click", (e) => {
  if (e.target === modalClear) {
    modalClear.classList.add("hidden")
  }
})