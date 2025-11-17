const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const fields = [
    { id: 'nome_usuario', validator: nome_usuarioIsValid },
    { id: 'data_nascimento', validator: data_nascimentoIsValid },
    { id: 'email', validator: emailIsValid },
    { id: 'senha', validator: senhaIsSecure },
    { id: 'confirmarSenha', validator: confirmarSenhaIsMach }
  ]

  const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

  fields.forEach(function (field) {
    const input = document.getElementById(field.id)
    const inputBox = input.closest('.input-box')
    const inputValue = input.value

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

  const url = "http://localhost:3000/users/register";

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(data)
  })

  const result = await res.json()
  console.log(result)

  if (res.ok) {

    Swal.fire({
      icon: 'success',
      title: `Cadastro realizado com sucesso!`,
      text: `Você está sendo redirecionado para a página de login e poderá entrar para continuar.`,
      confirmButtonColor: '#8863e7',
      confirmButtonText: 'Continuar'
    }).then(() => {
      window.location.href = "/login.html"
    })
  }
})

function isEmpty(value) {
  return value === ''
}

function nome_usuarioIsValid(value) {
  const validator = {
    isValid: true,
    errorMessage: null
  }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O nome é obrigatório!'
    return validator
  }

  const min = 3

  if (value.length < min) {
    validator.isValid = false
    validator.errorMessage = `O campo deve ter no mínimo ${min} caracteres!`
    return validator
  }

  const max = 30

  if (value.length > max) {
    validator.isValid = false
    validator.errorMessage = `O campo deve ter no máximo ${max} caracteres!`
    return validator
  }

  const regex = /^[a-zA-Z0-9_]+$/

  //NOME COMPLETO: /^[A-Z][a-z].* [A-Z][a-z].*/

  if (!regex.test(value)) {
    validator.isValid = false
    validator.errorMessage = 'Preencha o nome completo corretamente'
  }

  return validator
}

function data_nascimentoIsValid(value) {
  const validator = {
    isValid: true,
    errorMessage: null
  }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A data de nascimento é obrigatória!'
    return validator
  }

  const year = new Date(value).getFullYear()

  if (year < 1920 || year > new Date().getFullYear()) {
    validator.isValid = false
    validator.errorMessage = 'Coloque uma data válida!'
    return validator
  }

  return validator
}

function emailIsValid(value) {
  const validator = {
    isValid: true,
    errorMessage: null
  }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'O e-mail é obrigatório!'
    return validator
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!regex.test(value)) {
    validator.isValid = false
    validator.errorMessage = 'O e-mail é precisa ser válido!'
    return validator
  }

  return validator
}

function senhaIsSecure(value) {
  const validator = {
    isValid: true,
    errorMessage: null
  }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'A senha é obrigatória'
    return validator
  }

  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/

  if (!regex.test(value)) {
    validator.isValid = false
    validator.errorMessage = `
            Sua senha deve conter as menos: <br/>
            8 dígitos <br/>
            1 letra minúscula <br/>
            1 letra maiúscula <br/>
            1 número <br/>
            1 caractere especial
        `
    return validator
  }

  return validator
}

function confirmarSenhaIsMach(value) {
  const validator = {
    isValid: true,
    errorMessage: null
  }

  if (isEmpty(value)) {
    validator.isValid = false
    validator.errorMessage = 'Crie uma senha forte primeiro!'
    return validator
  }

  const senhaValue = document.getElementById('senha').value

  if (value !== senhaValue) {
    validator.isValid = false
    validator.errorMessage = 'As senhas não coincidem!'
    return validator
  }

  return validator
}