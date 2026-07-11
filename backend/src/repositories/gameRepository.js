import query from "../config/connection.js"
import { pool } from "../config/connection.js"

const gameRepository = {

    async readAll() {
        const { rows } = await query(`
            SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.publicadora, g.classificacao, g.tipo, g.download, g.requisitos, g.game_img, ARRAY_AGG(gp.platform_id ORDER BY gp.platform_id) AS plataformas, ARRAY_AGG(pl.platform_nome ORDER BY gp.platform_id) AS plataformas_nome
        FROM games g
        JOIN game_platform gp ON gp.games_id = g.games_id
        JOIN platforms pl ON pl.platform_id = gp.platform_id
        GROUP BY g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.publicadora, g.classificacao, g.tipo, g.download, g.requisitos, g.game_img
        ORDER BY g.nome ASC
        `)

        return rows
    },

    async searchByGame(platformId, term) {
        if (!term) {
            return []
        }

        const sql = `
                SELECT g.*
                FROM games g
                INNER JOIN game_platform gp
                    ON gp.games_id = g.games_id
                WHERE gp.platform_id = $1
                    AND g.nome ILIKE $2
                ORDER BY g.nome
            `

        const { rows } = await pool.query(sql, [
            platformId,
            `%${term}%`
        ])

        return rows
    },

    async readById(games_id) {
        const { rows } = await query(`
                SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.publicadora, g.classificacao, g.tipo, g.download, g.requisitos, g.game_img, ARRAY_AGG(gp.platform_id ORDER BY gp.platform_id) AS plataformas, ARRAY_AGG(pl.platform_nome ORDER BY gp.platform_id) AS plataformas_nome
                FROM games g
                JOIN game_platform gp ON gp.games_id = g.games_id
                JOIN platforms pl ON pl.platform_id = gp.platform_id
                WHERE g.games_id = $1
                GROUP BY g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.publicadora, g.classificacao, g.tipo, g.download, g.requisitos, g.game_img
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
            SELECT g.games_id, g.nome, g.descricao, g.genero, g.desenvolvedora, g.publicadora, g.classificacao, g.tipo, g.download, g.requisitos, g.game_img, pl.platform_nome
            FROM games g
            JOIN game_platform gp ON gp.games_id = g.games_id
            JOIN platforms pl ON pl.platform_id = gp.platform_id
            WHERE pl.platform_id = $1
            ORDER BY g.nome ASC
        `, [platform_id])

        return rows
    },

    async create(games) {
        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            const game = await client.query(`
                INSERT INTO games (
                    nome,
                    descricao,
                    genero,
                    desenvolvedora,
                    tipo,
                    download,
                    requisitos,
                    game_img,
                    publicadora,
                    classificacao
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                RETURNING games_id
                `,

                [
                    games.nome,
                    games.descricao,
                    games.genero,
                    games.desenvolvedora,
                    games.tipo,
                    games.download,
                    games.requisitos,
                    games.game_img,
                    games.publicadora,
                    games.classificacao
                ]
            )

            const gameId = game.rows[0].games_id

            for (const platformId of games.plataformas) {
                await client.query(`
                INSERT INTO game_platform (games_id, platform_id)
                VALUES ($1, $2)`,
                    [gameId, platformId])
            }

            await client.query("COMMIT")

            return game.rows[0]

        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    async update(games) {

        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            const sql = `
                UPDATE games
                SET nome = $1,
                descricao = $2,
                genero = $3,
                desenvolvedora = $4,
                tipo = $5,
                download = $6,
                requisitos = $7,
                game_img = $8,
                publicadora = $9,
                classificacao = $10
                WHERE games_id = $11
                RETURNING *
                `

            const { rows } = await client.query(sql, [
                games.nome,
                games.descricao,
                games.genero,
                games.desenvolvedora,
                games.tipo,
                games.download,
                games.requisitos,
                games.game_img,
                games.publicadora,
                games.classificacao,
                games.games_id
            ])

            const gameId = rows[0].games_id

            if (rows.length === 0) {
                throw new Error("Jogo não encontrado!")
            }

            await client.query(
                `DELETE FROM game_platform WHERE games_id = $1`,
                [gameId]
            )

            for (const platformId of games.plataformas) {
                await client.query(
                    `
                INSERT INTO game_platform (games_id, platform_id)
                VALUES ($1, $2)
                `,
                    [gameId, platformId]
                )
            }

            await client.query("COMMIT")

            return rows[0]

        } catch (err) {
            await client.query("ROLLBACK")
            throw err;
        } finally {
            client.release()
        }
    },

    async delete(games_id) {

        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            await client.query(
                `DELETE FROM game_platform
                WHERE games_id = $1`,
                [games_id]
            )

            const { rows } = await client.query(`
                DELETE FROM games
                WHERE games_id = $1
                RETURNING *
                `, [games_id])

            await client.query("COMMIT")

            return rows[0]

        } catch (err) {
            await client.query("ROLLBACK")
            throw err;
        } finally {
            client.release()
        }
    }
}

export default gameRepository