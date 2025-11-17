const form = document.querySelector("#form")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const fields = [
        { id: 'email', validator: emailIsValid },
        { id: 'senha', validator: senhaIsSecure }
    ]

    const errorIcon = '<i class="fa-solid fa-triangle-exclamation"></i>'

    let formIsValid = true

    fields.forEach(function (field) {
        const input = document.getElementById(field.id)
        const inputBox = input.closest('.input-box')
        const inputValue = input.value.trim()
        const errorSpan = inputBox.querySelector('.error')

        errorSpan.innerHTML = ''
        inputBox.classList.remove('invalid')
        inputBox.classList.add('valid')

        const fieldValidator = field.validator(inputValue)

        if (!fieldValidator.isValid) {
            errorSpan.innerHTML = `${errorIcon} ${fieldValidator.errorMessage}`
            inputBox.classList.add('invalid')
            inputBox.classList.remove('valid')
            formIsValid = false
        }
    })

    if (!formIsValid) return

    const data = {
        email: document.getElementById('email').value,
        senha: document.getElementById('senha').value
    }

    const url = "http://localhost:3000/users/login";

    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(data)
    })

    const result = await res.json()
    console.log(result)

    if (!res.ok) {
        const emailInputBox = document.getElementById('email').closest('.input-box')
        const senhaInputBox = document.getElementById('senha').closest('.input-box')

        emailInputBox.querySelector('.error').innerHTML = "Email ou senha incorretos!"
        senhaInputBox.querySelector('.error').innerHTML = "Email ou senha incorretos!"

        emailInputBox.classList.add('invalid')
        senhaInputBox.classList.add('invalid')
        return
    }

    localStorage.setItem("userId", result.user.id)

    Swal.fire({
        icon: 'success',
        title: `Login realizado com sucesso!`,
        text: `Seja bem vindo, ${result.user.nome_usuario}!`,
        confirmButtonColor: '#8863e7',
        confirmButtonText: 'Continuar'
    }).then(() => {
        window.location.href = "/index.html"
    })
})

function isEmpty(value) {
    return value === ''
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

    return validator
}

function senhaIsSecure(value) {
    const validator = {
        isValid: true,
        errorMessage: null
    }

    if (isEmpty(value)) {
        validator.isValid = false
        validator.errorMessage = 'A senha é obrigatória!'
        return validator
    }

    return validator
}