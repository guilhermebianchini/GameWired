import userRepository from "../repositories/userRepository.js"
import auth from "./authUserController.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userController = {
    async getAllUsers(req, res) {
        const users = await userRepository.readAll()
        res.json(users)
    },

    async getUserById(req, res) {
        const id = req.params.id
        const users = await userRepository.readById(id)
        res.json(users)
    },

    async getMe(req, res) {

        try {
            const user = await userRepository.readAuthUser(req.user.id)

            if (!user) {
                return res.status(404).json({
                    message: "Usuário não encontrado!"
                })
            }

            res.status(200).json(user)

        } catch (error) {

            res.status(500).json({
                message: error.message
            })
        }
    },

    async insert(req, res) {
        try {
            const model = req.body

            if (!model.senha || !model.confirmarSenha) {
                return res.status(400).json({
                    ok: false,
                    message: "Senha e confirmação são obrigatórias!"
                })
            }

            if (model.senha !== model.confirmarSenha) {
                return res.status(400).json({
                    ok: false,
                    message: "As senhas não coincidem!"
                })
            }

            delete model.confirmarSenha

            model.senha = await auth.crypt(model.senha)

            const respDB = await userRepository.create(model)

            if (respDB) {
                res.status(200).json({
                    ok: true,
                    message: 'Usuário inserido com sucesso!',
                    email: model.email
                })
            }

            res.status(500).json({
                ok: false,
                message: 'Erro ao inserir usuário!',
                email: model.email
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!'
            })
        }
    },

    async login(req, res) {
        try {
            const { email, senha } = req.body

            if (!email || !senha) {
                return res.status(400).json({
                    ok: false,
                    message: "Email e Senha são obrigatórios!"
                })
            }

            const user = await userRepository.findByEmail(email)

            if (!user) {
                return res.status(401).json({
                    ok: false,
                    message: "Credenciais inválidas!"
                })
            }

            const senhaValida = await bcrypt.compare(senha, user.senha)

            if (!senhaValida) {
                return res.status(401).json({
                    ok: false,
                    message: "Credenciais inválidas!"
                })
            }

            const token = jwt.sign(
                { id: user.user_id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            return res.status(200).json({
                ok: true,
                message: "Login realizado com sucesso!",
                token,
                user
            })
        } catch (err) {
            console.error("Erro no login:", err)
            res.status(500).json({
                ok: false,
                message: "Erro interno do servidor!"
            })
        }
    },

    async update(req, res) {
        try {
            const model = req.body
            const id = req.params.id

            model.senha = await auth.crypt(model.senha)

            const respDB = await userRepository.update(id, model)

            if (respDB) {
                res.status(200).json({
                    ok: true,
                    message: 'Usuário alterado com sucesso!',
                    email: model.email
                })
            }

            res.status(500).json({
                ok: false,
                message: 'Erro ao alterar usuário',
                email: model.email
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor',
                error: e
            })
        }
    },

    async deleteUser(req, res) {
        try {
            const id = req.params.id
            const confirma = req.body.key
            if (confirma === 'EXCLUIR') {
                const respDB = await userRepository.deleteUser(id)
                if (respDB) {
                    res.status(200).json({
                        ok: true,
                        message: 'Usuário deletado com sucesso!',
                    })
                    return
                }
            } else {
                res.status(400).json({
                    ok: false,
                    message: 'Confirmação inválida!',
                })
                return
            }

            res.status(500).json({
                ok: false,
                message: 'Erro ao deletar senha!',
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e
            })
        }
    }
}

export default userController