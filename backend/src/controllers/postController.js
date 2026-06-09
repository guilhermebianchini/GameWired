import postRepository from "../repositories/postRepository.js"

const postController = {

    async getAllPostsCursor(req, res) {
        try {

            const cursor = req.query.cursor || null
            const games_id = req.query.games_id || null
            const limit = 10

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
            const post_id = req.params.post_id

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

    async getPostsByUser(req, res) {
        try {

            const userId = req.user.id
            const { cursor } = req.query

            const result = await postRepository.readByUser(
                userId,
                cursor ? Number(cursor) : null
            )

            return res.status(200).json(result)

        } catch (error) {
            console.error(error)

            return res.status(500).json({
                ok: false,
                message: "Erro ao carregar posts!"
            })
        }
    },

    async getByLatestPosts(req, res) {

        try {

            const posts = await postRepository.readByLatestPosts()

            res.status(200).json(posts)

        } catch (e) {

            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async insertPost(req, res) {
        try {
            const { titulo_postagem, conteudo_postagem, games_id } = req.body
            const user_id = req.user.id

            const foto_postagem = req.file ? req.file.path : null

            const model = {
                titulo_postagem,
                conteudo_postagem,
                foto_postagem,
                user_id,
                games_id: games_id
            }

            const postCreated = await postRepository.createWithTransaction(model)

            res.status(201).json({
                ok: true,
                message: "Postagem inserida com sucesso!",
                data: postCreated
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async getPostByIdAndUser(req, res) {
        try {
            const post_id = req.params.post_id
            const user_id = req.user.id

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
            const post_id = req.params.post_id
            const user_id = req.user.id

            const existing = await postRepository.readByIdAndUser(post_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Post não encontrado ou não pertence ao usuário!"
                })
            }

            model.post_id = post_id
            model.user_id = user_id
            model.games_id = model.games_id

            model.foto_postagem = req.file ? req.file.path : existing.foto_postagem

            const postUpdated = await postRepository.update(model)

            if (postUpdated) {
                return res.status(200).json({
                    ok: true,
                    message: "Post atualizado com sucesso!",
                    data: postUpdated
                })
            }

            return res.status(400).json({
                ok: false,
                message: "Nenhuma alteração foi realizada!"
            })

        } catch (e) {
            res.status(500).json({
                ok: false,
                message: "Erro do servidor!",
                error: e.message
            })
        }
    },

    async deletePost(req, res) {
        try {
            const post_id = req.params.post_id
            const user_id = req.user.id

            const postDeleted = await postRepository.delete(post_id, user_id)

            if (postDeleted) {
                return res.status(200).json({
                    ok: true,
                    message: "Post deletado com sucesso!",
                    data: postDeleted
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
                message: "Erro do servidor!",
                error: e.message
            })
        }
    }
}

export default postController