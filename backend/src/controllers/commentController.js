import commentRepository from "../repositories/commentRepository.js"

const commentController = {
    async getAllComments(req, res) {
        try {
            const comentarios = await commentRepository.readAll()
            return res.status(200).json({
                ok: true,
                data: comentarios
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar comentários!"
            })
        }
    },

    async getCommentById(req, res) {
        try {
            const comentario_id = Number(req.params.comentario_id)

            if (isNaN(comentario_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            const comentario = await commentRepository.readById(comentario_id)

            if (!comentario) {
                return res.status(404).json({
                    ok: false,
                    message: "Comentário não encontrado!"
                })
            }

            return res.json({
                ok: true,
                data: comentario
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar comentário!"
            })
        }
    },

    async insertComment(req, res) {
        try {
            const { comentario_conteudo, post_id } = req.body
            const user_id = Number(req.user_id)

            if (!comentario_conteudo) {
                return res.status(400).json({
                    ok: false,
                    message: "Conteúdo do comentário é obrigatório!"
                })
            }

            if (isNaN(user_id)) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuário não autenticado!"
                })
            }

            if (!post_id) {
                return res.status(400).json({
                    ok: false,
                    message: "Post é obrigatório!"
                })
            }

            const model = { comentario_conteudo, user_id, post_id }

            const commentCreated = await commentRepository.create(model)

            res.status(201).json({
                ok: true,
                message: 'Comentário inserido com sucesso!',
                data: commentCreated
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!'
            })
        }
    },

    async getCommentByIdAndUser(req, res) {
        try {
            const comentario_id = Number(req.params.comentario_id)
            const user_id = Number(req.user_id)

            if (isNaN(comentario_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            if (isNaN(user_id)) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuário não autenticado!"
                })
            }

            const comentario = await commentRepository.readByIdAndUser(comentario_id, user_id)

            if (!comentario) {
                return res.status(404).json({
                    ok: false,
                    message: "Comentário não encontrado ou não pertence ao usuário!"
                })
            }

            return res.status(200).json({
                ok: true,
                data: comentario
            })
        } catch (e) {
            return res.status(500).json({
                ok: false,
                message: "Erro do servidor!",
                error: e.message
            })
        }
    },

    async updateComment(req, res) {
        try {
            const model = req.body
            const comentario_id = Number(req.params.comentario_id)
            const user_id = Number(req.user_id)

            if (isNaN(comentario_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            if (isNaN(user_id)) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuário não autenticado!"
                })
            }

            if (!model.comentario_conteudo) {
                return res.status(400).json({
                    ok: false,
                    message: "Conteúdo do comentário é obrigatório!"
                })
            }

            const existing = await commentRepository.readByIdAndUser(comentario_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Comentário não encontrado ou não pertence ao usuário!"
                })
            }

            model.comentario_id = comentario_id
            model.user_id = user_id

            const commentUpdated = await commentRepository.update(model)

            if (commentUpdated) {
                return res.status(200).json({
                    ok: true,
                    message: 'Comentário atualizado com sucesso!',
                    data: commentUpdated
                })
            }

            return res.status(400).json({
                ok: false,
                message: "Nenhuma alteração foi realizada!"
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    },

    async deleteComment(req, res) {
        try {
            const comentario_id = Number(req.params.comentario_id)
            const user_id = Number(req.user_id)
            const confirma = req.body.key

            if (isNaN(comentario_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            if (isNaN(user_id)) {
                return res.status(401).json({
                    ok: false,
                    message: "Usuário não autenticado!"
                })
            }

            if (confirma !== 'EXCLUIR') {
                return res.status(400).json({
                    ok: false,
                    message: "Confirmação inválida!"
                })
            }

            const existing = await commentRepository.readByIdAndUser(comentario_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Comentário não encontrado ou não pertence ao usuário!"
                })
            }

            const commentDeleted = await commentRepository.delete(comentario_id, user_id)

            if (commentDeleted) {
                return res.status(200).json({
                    ok: true,
                    message: 'Comentário deletado com sucesso!',
                    data: commentDeleted
                })
            }

            return res.status(400).json({
                ok: false,
                message: "Não foi possível deletar o comentário!"
            })
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    }
}

export default commentController