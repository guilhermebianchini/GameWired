import query from "../config/connection.js"

const gameRepository = {

    async readAll() {
        const { rows } = await query(`
            SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos, g.game_img
        FROM games g
        ORDER BY g.nome ASC`)

        return rows
    },

    async readById(games_id) {
        const { rows } = await query(`
                SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos, g.game_img
                FROM games g
                WHERE g.games_id = $1
                `, [games_id]
            )

        return rows[0]
    },

    async readSelect() {
        const { rows } = await query(`SELECT games_id, nome
        FROM games
        ORDER BY nome ASC`)

        return rows
    },

    async readByPlatform(platform_id) {
        const { rows } = await query(`
            SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos, g.game_img, pl.platform_nome
            FROM games g
            JOIN game_platform gp ON gp.games_id = g.games_id
            JOIN platforms pl ON pl.platform_id = gp.platform_id
            WHERE pl.platform_id = $1
            ORDER BY g.nome ASC
        `, [platform_id])

        return rows
    }
}

export default gameRepository