import query from "../config/connection.js"
import { pool } from "../config/connection.js"

const newsRepository = {

    /*async readAll() {

        const { rows } = await query(`
            SELECT * FROM news n
            ORDER BY n.data_publicacao DESC
            `)

        return rows
    },*/

    async readByNewsPage(page, limit, categoria = 0) {

        const offset = (page - 1) * limit

        const { rows } = await query(`
            SELECT
                n.news_id,
                n.titulo,
                n.data_publicacao,
                n.subtitulo,
                n.img_noticia,
                COALESCE(
                    ARRAY_AGG(DISTINCT c.category_id ORDER BY c.category_id)
                        FILTER (WHERE c.category_id IS NOT NULL),
                    '{}'
                ) AS categorias,
                COALESCE(
                    ARRAY_AGG(DISTINCT c.category_name ORDER BY c.category_id)
                        FILTER (WHERE c.category_id IS NOT NULL),
                    '{}'
                ) AS categorias_nome
            FROM news n
            LEFT JOIN news_categories nc
                ON n.news_id = nc.news_id
            LEFT JOIN categories c
                ON nc.category_id = c.category_id
            WHERE (
                $3 = 0
                    OR EXISTS (
                    SELECT 1
                    FROM news_categories nc2
                    WHERE nc2.news_id = n.news_id
                    AND nc2.category_id = $3
                )
            )
            GROUP BY
                n.news_id,
                n.titulo,
                n.data_publicacao,
                n.subtitulo,
                n.img_noticia
            ORDER BY n.data_publicacao DESC
            LIMIT $1
            OFFSET $2
        `, [limit, offset, categoria])

        return rows
    },

    async readById(news_id) {

        const { rows } = await query(`SELECT n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia, n.conteudo, n.fonte, u.nome_usuario, COALESCE( ARRAY_AGG(DISTINCT c.category_id ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias, COALESCE( ARRAY_AGG(DISTINCT c.category_name ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias_nome
            FROM news n
            JOIN users u ON n.user_id = u.user_id
            LEFT JOIN news_categories nc
                ON n.news_id = nc.news_id
            LEFT JOIN categories c
                ON nc.category_id = c.category_id
            WHERE n.news_id = $1
            GROUP BY
                n.news_id,
                u.nome_usuario;
            `, [news_id])

        if (rows.length === 0) {
            return null
        }

        return rows[0]
    },

    async readByUser(user_id) {

        const { rows } = await query(`
        SELECT
            n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia, n.conteudo, n.fonte, COALESCE( ARRAY_AGG(DISTINCT c.category_id ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias, COALESCE( ARRAY_AGG(DISTINCT c.category_name ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias_nome
        FROM news n
        LEFT JOIN news_categories nc
            ON n.news_id = nc.news_id
        LEFT JOIN categories c
            ON nc.category_id = c.category_id
        WHERE n.user_id = $1
        GROUP BY
            n.news_id
        ORDER BY n.data_publicacao DESC
        `, [user_id])

        return rows
    },

    async readByLatestNews() {

        const { rows } = await query(`
            SELECT
                n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia, COALESCE( ARRAY_AGG(DISTINCT c.category_id ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias, COALESCE( ARRAY_AGG(DISTINCT c.category_name ORDER BY c.category_id) FILTER (WHERE c.category_id IS NOT NULL), '{}' ) AS categorias_nome
            FROM news n
            LEFT JOIN news_categories nc
                ON n.news_id = nc.news_id
            LEFT JOIN categories c
                ON nc.category_id = c.category_id
            GROUP BY n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia
            ORDER BY n.data_publicacao DESC
            LIMIT 3
        `)

        return rows
    },

    async countNews(categoria = 0) {

        const { rows } = await query(`
        SELECT COUNT(*) AS total
        FROM news n
        WHERE (
            $1 = 0
            OR EXISTS (
                SELECT 1
                FROM news_categories nc
                WHERE nc.news_id = n.news_id
                AND nc.category_id = $1
            )
        )
        `, [categoria])

        return Number(rows[0].total)
    },

    async createWithTransaction(news) {

        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            const newsInsert = await client.query(`
                INSERT INTO news
                (
                    titulo,
                    subtitulo,
                    img_noticia,
                    conteudo,
                    fonte,
                    user_id
                )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
                `,
                [
                    news.titulo,
                    news.subtitulo,
                    news.img_noticia,
                    news.conteudo,
                    news.fonte,
                    news.user_id
                ]
            )

            const newsId = newsInsert.rows[0].news_id

            for (const categoryId of news.categorias) {
                await client.query(`
                INSERT INTO news_categories (news_id, category_id)
                VALUES ($1, $2)`,
                    [newsId, categoryId])
            }

            await client.query("COMMIT")

            return newsInsert.rows[0]

        } catch (error) {

            await client.query("ROLLBACK")
            throw error

        } finally {

            client.release()

        }
    },

    async readByIdAndUser(news_id, user_id) {

        const { rows } = await query(`
            SELECT n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia, n.conteudo, n.fonte, u.user_id, COALESCE( ARRAY_AGG(DISTINCT nc.category_id ORDER BY nc.category_id) FILTER (WHERE nc.category_id IS NOT NULL), '{}' ) AS categorias
            FROM news n
            JOIN users u ON n.user_id = u.user_id
            LEFT JOIN news_categories nc ON n.news_id = nc.news_id
            WHERE n.news_id = $1
            AND n.user_id = $2
            GROUP BY n.news_id, n.titulo, n.subtitulo, n.img_noticia, n.conteudo, n.fonte, u.user_id;
            `, [news_id, user_id])

        return rows[0] || null
    },

    async update(news) {

        const client = await pool.connect()

        try {
            await client.query("BEGIN")

            const sql = `
                UPDATE news
                    SET titulo = $1,
                    subtitulo = $2,
                    img_noticia = $3,
                    conteudo = $4,
                    fonte = $5
                    WHERE news_id = $6
                    AND user_id = $7
                RETURNING *
                `

            const { rows } = await client.query(sql, [
                news.titulo,
                news.subtitulo,
                news.img_noticia,
                news.conteudo,
                news.fonte,
                news.news_id,
                news.user_id
            ])

            if (rows.length === 0) {
                throw new Error("Notícia não encontrada!")
            }

            const newsId = rows[0].news_id

            await client.query(
                `DELETE FROM news_categories WHERE news_id = $1`,
                [newsId]
            )

            for (const categoryId of news.categorias) {
                await client.query(
                    `
                INSERT INTO news_categories (news_id, category_id)
                VALUES ($1, $2)
                `,
                    [newsId, categoryId]
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

    async delete(news_id, user_id) {

        const existing = await this.readByIdAndUser(news_id, user_id)

        if (!existing) throw new Error("Notícia não encontrada ou não pertence ao editor!")

        const { rows } = await query(`
            DELETE FROM news
            WHERE news_id = $1
            AND user_id = $2
            RETURNING *
            `, [news_id, user_id])

        return rows[0]
    }
}

export default newsRepository