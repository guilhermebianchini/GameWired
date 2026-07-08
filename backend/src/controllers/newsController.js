import newsRepository from "../repositories/newsRepository.js"

function normalizarCategorias(categorias) {
    if (!categorias) {
        return []
    }

    const lista = Array.isArray(categorias)
        ? categorias
        : [categorias]

    return lista
        .map(Number)
        .filter(Number.isInteger)
}

const newsController = {
    /*async getAllNews(req, res) {
        try {

            const news = await newsRepository.readAll()

            res.status(200).json(news)

        } catch (e) {

            console.error(e)

            res.status(500).json({
                ok: false,
                message: "Erro ao buscar notícias!"
            })
        }
    },*/

    async getByNewsPage(req, res) {
        try {

            const page = Math.max(Number(req.query.page) || 1, 1)
            const limit = 9

            const categoria = Number(req.query.categoria) || 0

            const ordem = req.query.ordem || "data-new"

            const [news, totalNews] = await Promise.all([
                newsRepository.readByNewsPage(page, limit, categoria, ordem),
                newsRepository.countNews(categoria)
            ])

            const totalPages = Math.ceil(totalNews / limit)

            res.status(200).json({
                ok: true,
                page,
                limit,
                totalNews,
                totalPages,
                hasPrevious: page > 1,
                hasNext: page < totalPages,
                data: news
            })
        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro ao buscar notícias!"
            })
        }
    },

    async getNewsById(req, res) {
        try {
            const news_id = req.params.news_id
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

    async getNewsByUser(req, res) {

        try {
            const news = await newsRepository.readByUser(req.user.id)

            res.status(200).json({
                ok: true,
                data: news
            })

        } catch (e) {
            console.error(e)
            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async getByLatestNews(req, res) {

        try {
            const news = await newsRepository.readByLatestNews()

            res.status(200).json(news)

        } catch (e) {

            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async insertNews(req, res) {
        try {
            const { titulo, subtitulo, conteudo, fonte } = req.body

            const categorias = normalizarCategorias(req.body.categorias)

            const img_noticia = req.file?.path

            const user_id = req.user.id

            if (!img_noticia) {
                return res.status(400).json({
                    ok: false,
                    message: "A imagem da notícia é obrigatória!"
                })
            }

            const model = {
                titulo,
                subtitulo,
                img_noticia,
                conteudo,
                fonte,
                categorias,
                user_id
            }

            const newsCreated = await newsRepository.createWithTransaction(model)

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

    async getNewsByIdAndUser(req, res) {
        try {
            const news_id = req.params.news_id
            const user_id = req.user.id

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
            const categorias = normalizarCategorias(req.body.categorias)

            const news_id = req.params.news_id

            const user_id = req.user.id

            const existing = await newsRepository.readByIdAndUser(news_id, user_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Notícia não encontrada ou não pertence ao usuário!"
                })
            }

            const model = {
                ...req.body,
                categorias,
                news_id,
                user_id,
                img_noticia: req.file ? req.file.path : existing.img_noticia
            }
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
            const news_id = req.params.news_id
            const user_id = req.user.id

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