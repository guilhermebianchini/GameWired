import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const gameRepository = {

    async readAll() {
        const conn = await connect()
        const { recordset } = await conn.query(`SELECT g.games_id, g.nome, g.plataforma, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos
        FROM Games g
        ORDER BY g.nome ASC`)

        return recordset
    },

    async readById(games_id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('games_id', sqltype.Int, games_id)
            .query(`
                SELECT g.games_id, g.nome, g.plataforma, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos
                FROM Games g
                WHERE g.games_id = @games_id
            `)

        return recordset[0]
    },

    async readSelect() {
        const conn = await connect()

        const { recordset } = await conn.query(`SELECT games_id, nome
        FROM Games
        ORDER BY nome ASC`)

        return recordset
    }
}

export default gameRepository