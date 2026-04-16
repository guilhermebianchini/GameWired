import httpMocks from "node-mocks-http"
import { afterEach, assert, describe, it } from "poku"
import quibble from "quibble"

const userMock = {
  user_id: 1,
  email: "teste@email.com",
  senha: "hash"
}

await quibble.esm("../repositories/userRepository.js", {
  default: {
    readAll: async () => [userMock],
    readById: async (id) => (id == 1 ? [userMock] : []),
    create: async () => ({ rowsAffected: [1] }),
    findByEmail: async () => userMock,
    update: async () => ({ rowsAffected: [1] }),
    deleteUser: async () => ({ rowsAffected: [1] }),
  }
})

await quibble.esm("../controllers/authUserController.js", {
  default: {
    crypt: async () => "senha_hash"
  }
})

await quibble.esm("bcrypt", {
  default: {
    compare: async () => true
  }
})

await quibble.esm("jsonwebtoken", {
  default: {
    sign: () => "token_fake"
  }
})

const userController = (await import("../controllers/userController.js")).default

describe("UserController", { background: "blue" })

await it("getUserById() - usuário encontrado", async () => {
  const req = httpMocks.createRequest({
    method: "GET",
    params: { id: 1 }
  })

  const res = httpMocks.createResponse()

  await userController.getUserById(req, res)

  const data = res._getJSONData()

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(data[0].email, "teste@email.com")
})

await it("insert() - sucesso", async () => {
  const req = httpMocks.createRequest({
    method: "POST",
    body: {
      email: "teste@email.com",
      senha: "123",
      confirmarSenha: "123"
    }
  })

  const res = httpMocks.createResponse()

  await userController.insert(req, res)

  const data = res._getJSONData()

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(data.ok, true)
})

await it("login() - sucesso", async () => {
  const req = httpMocks.createRequest({
    method: "POST",
    body: {
      email: "teste@email.com",
      senha: "123"
    }
  })

  const res = httpMocks.createResponse()

  process.env.JWT_SECRET = "teste"

  await userController.login(req, res)

  const data = res._getJSONData()

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(data.token, "token_fake")
});

await it("deleteUser() - sucesso", async () => {
  const req = httpMocks.createRequest({
    method: "DELETE",
    params: { id: 1 },
    body: { key: "EXCLUIR" }
  })

  const res = httpMocks.createResponse()

  await userController.deleteUser(req, res)

  const data = res._getJSONData()

  assert.strictEqual(res.statusCode, 200)
  assert.strictEqual(data.ok, true)
})

afterEach(() => {
  quibble.reset();
})