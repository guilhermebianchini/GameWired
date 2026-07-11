import gameRepository from "../repositories/gameRepository.js"

function normalizarPlataformas(plataformas) {
    if (!plataformas) {
        return []
    }

    const lista = Array.isArray(plataformas)
        ? plataformas
        : [plataformas]

    return lista
        .map(Number)
        .filter(Number.isInteger)
}

const gameController = {
    async getAllGames(req, res) {
        try {
            const games = await gameRepository.readAll()
            res.json(games)
        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    },

    async searchGames(req, res) {
        try {
            const { platform, q = "" } = req.query
            const platformId = Number(platform)

            const games = await gameRepository.searchByGame(platform, q.trim())

            return res.status(200).json({
                ok: true,
                data: games
            })

        } catch (err) {
            res.status(500).json({
                ok: false,
                message: err.message
            })
        }
    },

    async getGameById(req, res) {

        try {
            const games_id = req.params.games_id
            const games = await gameRepository.readById(games_id)

            if (!games) {
                return res.status(404).json({
                    ok: false,
                    mensagem: "Jogo não encontrado!"
                })
            }

            return res.status(200).json({
                ok: true,
                data: games
            })

        } catch (err) {
            res.status(500).json({
                ok: false,
                message: err.message
            })
        }
    },

    async getGameBySelect(req, res) {
        try {
            const games = await gameRepository.readSelect()
            res.json(games)
        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    },

    async getGameByPlatform(req, res) {
        try {
            const platform_id = Number(req.params.platform_id)

            const games = await gameRepository.readByPlatform(platform_id)

            if (!games || games.length === 0) {
                return res.status(404).json({ mensagem: "Nenhum jogo encontrado para essa plataforma" })
            }

            res.json(games)

        } catch (err) {
            res.status(500).json({ erro: err.message })
        }
    },

    async insertGame(req, res) {
        try {
            const { nome, descricao, genero, desenvolvedora, tipo, download, requisitos, publicadora, classificacao } = req.body

            const plataformas = normalizarPlataformas(req.body.plataformas)

            const game_img = req.file?.path

            if (!game_img) {
                return res.status(400).json({
                    ok: false,
                    message: "A imagem do jogo é obrigatória!"
                })
            }

            const model = {
                nome,
                descricao,
                genero,
                desenvolvedora,
                tipo,
                download,
                requisitos,
                game_img,
                publicadora,
                classificacao,
                plataformas
            }

            const gameCreated = await gameRepository.create(model)

            res.status(201).json({
                ok: true,
                message: "Jogo adicionado com sucesso!",
                data: gameCreated
            })
        } catch (e) {
            console.error(e)

            res.status(500).json({
                ok: false,
                message: "Erro do servidor!"
            })
        }
    },

    async updateGame(req, res) {
        try {
            const plataformas = normalizarPlataformas(req.body.plataformas)

            const games_id = req.params.games_id

            const existing = await gameRepository.readById(games_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Jogo não encontrado!"
                })
            }

            const model = {
                ...req.body,
                games_id,
                plataformas,
                game_img: req.file ? req.file.path : existing.game_img
            }

            const gameUpdated = await gameRepository.update(model)

            if (gameUpdated) {
                return res.status(200).json({
                    ok: true,
                    message: "Jogo atualizado com sucesso!",
                    data: gameUpdated
                })
            }
        } catch (e) {
            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    },

    async deleteGame(req, res) {
        try {
            const games_id = req.params.games_id

            const existing = await gameRepository.readById(games_id)

            if (!existing) {
                return res.status(404).json({
                    ok: false,
                    message: "Jogo não encontrado!"
                })
            }

            const gameDeleted = await gameRepository.delete(games_id)

            if (gameDeleted) {
                return res.status(200).json({
                    ok: true,
                    message: "Jogo deletado com sucesso!",
                    data: gameDeleted
                })
            }
        } catch (e) {
            console.error("Erro ao deletar jogo:", e)

            res.status(500).json({
                ok: false,
                message: 'Erro do servidor!',
                error: e.message
            })
        }
    }
}

export default gameController