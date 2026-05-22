import newsRepository from "../repositories/newsRepository.js"

const newsController = {
    async getAllNews(req, res) {
        const news = await newsRepository.readAll()
        res.json(news)
    },

    async getNewsById(req, res) {
        try {
            const news_id = Number(req.params.news_id)

            if (isNaN(news_id)) {
                return res.status(400).json({
                    ok: false,
                    message: "ID inválido!"
                })
            }

            const news = await newsRepository.readById(news_id)

            if (!news) {
                return res.status(404).json({
                    ok: false,
                    message: "Notícia não encontrada!"
                })
            }

            res.json({
                ok: true,
                data: news
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar notícia!"
            })
        }
    },

    async insertNews(req, res) {
        try {
            const { titulo, data_publicacao, subtitulo, conteudo, fonte } = req.body
            const img_noticia = req.file?.path
            const user_id = req.user_id

            if (!titulo || !data_publicacao || !subtitulo || !img_noticia || !conteudo || !fonte) {
                return res.status(400).json({
                    ok: false,
                    message: "Os campos de título, data da publicação, subtítulo, imagem, conteúdo e fonte são obrigatórios!"
                })
            }

            const model = {
                titulo,
                data_publicacao,
                subtitulo,
                img_noticia,
                conteudo,
                fonte,
                user_id
            }

            const newsCreated = await newsRepository.create(model)

            res.status(201).json({
                ok: true,
                message: "Notícia inserida com sucesso!",
                data: newsCreated
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async getNewstByIdAndUser(req, res) {
        try {
            const news_id = Number(req.params.news_id)
            const user_id = Number(req.user.id)

            if (isNaN(news_id)) {
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

            const news = await newsRepository.readByIdAndUser(news_id, user_id)

            if (!news) {
                return res.status(404).json({
                    ok: false,
                    message: "Notícia não encontrada ou não pertence ao usuário!"
                })
            }

            return res.status(200).json({
                ok: true,
                data: news
            })

        } catch (e) {
            return res.status(500).json({
                ok: false,
                message: "Erro do servidor!",
                error: e.message
            })
        }
    },

    async updateNews(req, res) {
        try {
            const model = req.body
            const news_id = Number(req.params.news_id)
            const user_id = Number(req.params.user_id)

            if (isNaN(news_id)) {
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

            if (!model.titulo || !model.data_publicacao || !model.subtitulo || !model.img_noticia || !model.conteudo || !model.fonte) {
                return res.status(400).json({
                    ok: false,
                    message: "Os campos de título, data da publicação, subtítulo, imagem, conteúdo e fonte são obrigatórios!"
                })
            }

            const existing = await newsRepository.readByIdAndUser(news_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Notícia não encontrada ou não pertence ao usuário!"
                })
            }

            model.news_id = news_id
            model.user_id = user_id

            model.img_noticia = req.file ? req.file.path : existing.img_noticia

            const newsUpdated = await newsRepository.update(model)

            if (newsUpdated) {
                return res.status(200).json({
                    ok: true,
                    message: "Notícia atualizada com sucesso!",
                    data: newsUpdated
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

    async deleteNews(req, res) {
        try {
            const news_id = Number(req.params.news_id)
            const user_id = Number(req.user.id)
            const confirma = req.body?.key

            if (isNaN(news_id)) {
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

            const newsDeleted = await newsRepository.delete(news_id, user_id)

            if (newsDeleted) {
                return res.status(200).json({
                    ok: true,
                    message: "Notícia deletada com sucesso!",
                    data: newsDeleted
                })
            }

            return res.status(400).json({
                ok: false,
                message: "Não foi possível deletar a notícia!"
            })
        } catch (e) {
            console.error("Erro ao deletar notícia:", e)

            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    }
}

export default newsController