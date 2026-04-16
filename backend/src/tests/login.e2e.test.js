import { describe, assert, test } from 'poku'

const requestLogin = (body) => fetch('http://localhost:3000/users/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})

describe('TESTE DE LOGIN', { background: 'yellow' })

await test('LOGIN COM SUCESSO', async () => {
  const response = await requestLogin({
    email: 'pedromelquiades@gmail.com',
    senha: 'Teste123@'
  })

  const dados = await response.json()

  assert.strictEqual(response.status, 200, "Status 200 - OK")
  assert.strictEqual(dados.ok, true, "LOGIN EFETUADO COM SUCESSO!")
})

await test('ERRO: EMAIL INVÁLIDO/MAL FORMATADO', async () => {
  const response = await requestLogin({
    email: 'pedromelquiades',
    senha: '1234@Teste'
  })
  const dados = await response.json()

  assert.strictEqual(response.status, 401, "Status 401 - NÃO OK")
  assert.strictEqual(dados.ok, false, "O E-MAIL DIGITADO É INVÁLIDO!")
})

await test('ERRO: CAMPOS OBRIGATÓRIOS VAZIOS', async () => {
  const response = await requestLogin({ email: '', senha: '' });
  const dados = await response.json()

  assert.strictEqual(response.status, 400, "Status 400 - NÃO OK")
  assert.strictEqual(dados.ok, false, "OS CAMOS NÃO PODEM FICAR VAZIOS!")
})

await test('ERRO: SENHA INCORRETA', async () => {
  const response = await requestLogin({
    email: 'pedromelquiades@gmail.com',
    senha: 'errada'
  })
  const dados = await response.json()

  assert.strictEqual(response.status, 401, "Status 401 - NÃO OK")
  assert.strictEqual(dados.ok, false, "A SENHA ESTÁ INCORRETA!")
})

await test('ERRO: USUÁRIO INEXISTENTE', async () => {
  const response = await requestLogin({
    email: 'naoexiste@gmail.com',
    senha: 'Teste123@'
  })
  const dados = await response.json()

  assert.strictEqual(response.status, 401, "Status 401 - NÃO OK")
  assert.strictEqual(dados.ok, false, "EMAIL NÃO ENCONTRADO NA BASE!")
})