const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const fields = [
    { id: 'titulo', validator: tituloIsValid },
    { id: 'data_publicacao', validator: dataIsValid },
    { id: 'capa', validator: capaIsValid },
    { id: 'conteudo', validator: conteudoIsValid }
  ]

  const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

  fields.forEach(function (field) {
    const input = document.getElementById(field.id)
    const inputBox = input.closest('.input-box')
    const inputValue = input.value

    // editor é diferente (contenteditable)
    if (field.id === 'editor') {
      value = input.innerHTML
    }

    const errorSpan = inputBox.querySelector('.error')
    errorSpan.innerHTML = ''

    inputBox.classList.remove('invalid')
    inputBox.classList.add('valid')

    const fieldValidator = field.validator(inputValue)

    if (!fieldValidator.isValid) {
      errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`
      inputBox.classList.add('invalid')
      inputBox.classList.remove('valid')
    }
  })

    const data = {
    nome_usuario: document.getElementById("nome_usuario").value,
    data_nascimento: document.getElementById("data_nascimento").value,
    email: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
    confirmarSenha: document.getElementById("confirmarSenha").value
  }

  /*const url = "http://20.201.122.109:3000/users/register";

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data)
  })

  const result = await res.json()
  console.log(result)*/

})

//const hasInvalid = document.querySelector('.invalid')
//if (hasInvalid) return

function isEmpty(value) {
  return value === ''
}

function tituloIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O título é obrigatório!'
    return validator
  }

  const min = 5

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

function capaIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  const fileInput = document.getElementById('capa')

  if (fileInput.files.length === 0) {
    validator.isValid = false
    validator.errorMessage = 'A imagem de capa é obrigatória!'
    return validator
  }

  const file = fileInput.files[0]
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    validator.isValid = false
    validator.errorMessage = 'Formato inválido! Use JPG, PNG ou WEBP.'
    return validator
  }

  return validator
}

function conteudoIsValid(value) {
  const validator = { isValid: true, errorMessage: null }

  // remove tags HTML
  const text = value.replace(/<[^>]*>/g, '').trim()

  if (text === '') {
    validator.isValid = false
    validator.errorMessage = 'O conteúdo não pode estar vazio!'
    return validator
  }

  if (text.length < 20) {
    validator.isValid = false
    validator.errorMessage = 'O conteúdo deve ter no mínimo 20 caracteres!'
    return validator
  }

  return validator
}

// MODAL LIMPAR
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

  // limpar erros visuais também
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
