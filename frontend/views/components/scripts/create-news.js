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

// TOOLBAR

function execCmd(command) {
  document.execCommand(command, false, null)

  document.getElementById("conteudo").focus()
}

// FORMULÁRIO DE POSTAGEM E VALIDAÇÃO

let editandoId = null

const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const token = localStorage.getItem("token")

  const fields = [
    { id: 'titulo', validator: tituloIsValid },
    { id: 'data_publicacao', validator: dataIsValid },
    { id: 'subtitulo', validator: subtituloIsValid },
    { id: 'img_noticia', validator: imgIsValid },
    { id: 'conteudo', validator: conteudoIsValid },
    { id: 'fonte', validator: fonteIsValid }
  ]

  const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

  let formIsValid = true

  fields.forEach(function (field) {
    const input = document.getElementById(field.id)
    const inputBox = input.closest('.input-box')
    const inputValue =
      field.id === "conteudo"
        ? input.innerHTML
        : input.value

    const errorSpan = inputBox.querySelector('.error')
    errorSpan.innerHTML = ''

    inputBox.classList.remove('invalid')
    inputBox.classList.add('valid')

    const fieldValidator = field.validator(inputValue)

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

  const titulo = document.getElementById("titulo").value.trim()
  const data_publicacao = document.getElementById("data_publicacao").value.trim()
  const subtitulo = document.getElementById("subtitulo").value.trim()
  const fileInput = document.getElementById("img_noticia")
  const conteudo = document.getElementById("conteudo").innerHTML.trim()
  const fonte = document.getElementById("fonte").value

  const formData = new FormData()
  formData.append("titulo", titulo)
  formData.append("data_publicacao", data_publicacao)
  formData.append("subtitulo", subtitulo)
  formData.append("conteudo", conteudo)
  formData.append("fonte", fonte)

  if (fileInput.files.length > 0) {
    formData.append("img_noticia", fileInput.files[0])
  }

  let url = "https://gamewired-api.duckdns.org/news"
  let method = "POST"

  if (editandoId) {
    url = `https://gamewired-api.duckdns.org/news/${editandoId}`
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
        text: result.message || "Erro ao publicar notícia!",
        confirmButtonColor: "#8863e7",
        confirmButtonText: "Continuar"
      })
      return
    }

    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: result.message || "Notícia publicada com sucesso!",
      confirmButtonColor: "#8863e7",
      confirmButtonText: "Continuar"
    }).then(() => {
      window.location.href = "/noticias"
    })
  } catch (err) {
    console.error("Erro ao publicar notícia:", err)
  }
})

// VALIDAÇÃO REGGEX

function isEmpty(value) {
  return value === ''
}

function tituloIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O título não pode estar vazio!'
    return validator
  }

  const min = 50

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `O título deve ter no mínimo ${min} caracteres!`
    return validator
  }

  return validator
}

function dataIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A data é obrigatória!'
    return validator
  }

  const selectedDate = new Date(value)
  const today = new Date()

  if (selectedDate > today) {
    validator.isValid = false
    validator.errorMessage = 'A data não pode ser futura!'
    return validator
  }

  return validator
}

function subtituloIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O subtítulo não pode estar vazio!'
    return validator
  }

  const min = 50

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `O subtítulo deve ter no mínimo ${min} caracteres!`
    return validator
  }

  return validator
}

function imgIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  const fileInput = document.getElementById('img_noticia')

  if (fileInput.files.length === 0) {
    validator.isValid = false
    validator.errorMessage = 'A imagem da notícia é obrigatória!'
    return validator
  }

  const file = fileInput.files[0]
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']

  if (!allowedTypes.includes(file.type)) {
    validator.isValid = false
    validator.errorMessage = 'Formato inválido! Use JPG, PNG ou JPG.'
    return validator
  }

  return validator
}

function conteudoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  // REMOVE TAGS HTML
  const text = (value || '')
    .replace(/<[^>]*>/g, '')
    .trim()

  if (text === '') {
    validator.isValid = false
    validator.errorMessage = 'O conteúdo não pode estar vazio!'
    return validator
  }

  const min = 200

  if (text.length < min) {
    validator.isValid = false
    validator.errorMessage = `O conteúdo deve ter no mínimo ${min} caracteres!`
    return validator
  }

  return validator
}

function fonteIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A fonte é obrigatória!'
    return validator
  }

  const min = 5

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `A fonte deve ter no mínimo ${min} caracteres!`
    return validator
  }

  return validator
}

// EDIÇÃO DE NOTÍCIAS

const params = new URLSearchParams(window.location.search)
const newsId = params.get("id")

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

    editandoId = news.news_id

    document.getElementById("titulo").value = news.titulo
    document.getElementById("data_publicacao").value = news.data_publicacao.split("T")[0]
    document.getElementById("subtitulo").value = news.subtitulo
    document.getElementById("img_noticia") = news.img_noticia
    document.getElementById("conteudo").innerHTML = news.conteudo
    document.getElementById("fonte").value = news.fonte

    document.querySelector(".btn-publish").textContent = "Salvar alterações"
  } catch (err) {
    console.error("Erro ao carregar notícia:", err)
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