import { describe, assert, test } from 'poku';

describe('TESTE DE LOGIN', { background: 'yellow' })

await test('E2E - LOGIN FUNCIONANDO (CONDIÇÕES TRUE)', async () => {
  const response = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pedromelquiades@gmail.com', senha: 'Teste123@' })
  })

  const dados = await response.json()

  assert.strictEqual(response.status, 200, "Status 200 - OK")
  assert.strictEqual(dados.ok, true, "Login efetuado com sucesso!")
})

await test('E2E - LOGIN NÃO FUNCIONANDO (CONDIÇÕES FALSE)', async () => {
  const response = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pedromelquiades', senha: '1234@Teste' })
  })

  const dados = await response.json()

  assert.strictEqual(dados.ok, false, "Login não efetuado!")
  assert.strictEqual(dados.message, "Credenciais inválidas!", "Erro retornado com sucesso!")
})