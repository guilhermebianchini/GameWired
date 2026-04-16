import postRepository from "../repositories/postRepository.js"

const postController = {
    /*async getAllPosts(req, res) {
        try {
            const { games_id } = req.query

            const posts = games_id
                ? await postRepository.readByGameId(Number(games_id))
                : await postRepository.readAll()

            res.json(posts)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar posts!"
            })
        }
    },*/

    async getAllPostsCursor(req, res) {
        try {

            const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
            const games_id = req.query.games_id ? parseInt(req.query.games_id) : null
            const limit = 10

            if (req.query.cursor && isNaN(cursor)) {
                return res.status(400).json({
                    ok: false,
                    message: "Cursor inválido!"
                })
            }

            if (req.query.games_id && isNaN(games_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "Jogo inválido!"
                })
            }

            const data = await postRepository.readAllCursor(limit + 1, cursor, games_id)

            let next_cursor = null

            if (data.length > limit) {
                next_cursor = data[limit - 1].post_id
                data.pop()
            }

            res.status(200).json({
                ok: true,
                cursor,
                next_cursor,
                limit,
                games_id,
                data
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar posts!"
            })
        }
    },

    async getPostById(req, res) {
        try {
            const post_id = Number(req.params.post_id)

            if (isNaN(post_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            const post = await postRepository.readById(post_id)

            if (!post) {
                return res.status(404).json({
                    ok: false,
                    message: "Post não encontrado!"
                })
            }

            res.json({
                ok: true,
                data: post
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar post!"
            })
        }
    },

    /*async getPostsByUser(req, res) {
        try {
            const { id } = req.params

            const posts = await postRepository.getByUser(id)

            res.json(posts)
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar posts do usuário!"
            })
        }
    },*/

    async insertPost(req, res) {
        try {
            const { titulo_postagem, conteudo_postagem, games_id } = req.body
            const user_id = req.user.id

            if (!titulo_postagem || !conteudo_postagem) {
                return res.status(400).json({
                    ok: false,
                    message: "Título, categoria e conteúdo da postagem são obrigatórios!"
                })
            }

            const foto_postagem = req.file ? req.file.path : null

            const model = {
                titulo_postagem,
                conteudo_postagem,
                foto_postagem,
                user_id,
                games_id: Number(games_id)
            }

            const postCreated = await postRepository.create(model)

            res.status(201).json({
                ok: true,
                message: 'Postagem inserida com sucesso!',
                data: postCreated
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!'
            })
        }
    },

    async getPostByIdAndUser(req, res) {
        try {
            const post_id = Number(req.params.post_id)
            const user_id = Number(req.user.id)

            if (isNaN(post_id)) {
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

            const post = await postRepository.readByIdAndUser(post_id, user_id)

            if (!post) {
                return res.status(404).json({
                    ok: false,
                    message: "Post não encontrado ou não pertence ao usuário!"
                })
            }

            return res.status(200).json({
                ok: true,
                data: post
            })

        } catch (e) {
            return res.status(500).json({
                ok: false,
                message: "Erro do servidor!",
                error: e.message
            })
        }
    },

    async updatePost(req, res) {
        try {
            const model = req.body
            const post_id = Number(req.params.post_id)
            const user_id = Number(req.user.id)

            if (isNaN(post_id)) {
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

            if (!model.titulo_postagem || !model.conteudo_postagem) {
                return res.status(400).json({
                    ok: false,
                    message: "Título e conteúdo são obrigatórios!"
                })
            }

            const existing = await postRepository.readByIdAndUser(post_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Post não encontrado ou não pertence ao usuário!"
                })
            }

            model.post_id = post_id
            model.user_id = user_id
            model.games_id = Number(model.games_id)

            model.foto_postagem = req.file ? req.file.path : existing.foto_postagem

            const rowsAffected = await postRepository.update(model)

            if (rowsAffected > 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'Post atualizado com sucesso!'
                })
            }

            return res.status(400).json({
                ok: false,
                message: 'Nenhuma alteração foi realizada!'
            })

        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    },

    async deletePost(req, res) {
        try {
            const post_id = Number(req.params.post_id)
            const user_id = Number(req.user.id)
            const confirma = req.body?.key

            if (isNaN(post_id)) {
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
                    message: 'Confirmação inválida!',
                })
            }

            const rowsAffected = await postRepository.delete(post_id, user_id)

            if (rowsAffected > 0) {
                return res.status(200).json({
                    ok: true,
                    message: 'Post deletado com sucesso!',
                })
            }

            return res.status(400).json({
                ok: false,
                message: "Não foi possível deletar o post!"
            })
        } catch (e) {
            console.error("Erro ao deletar post:", e)

            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    }
}

export default postController