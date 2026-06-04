import query from "../config/connection.js"

const postRepository = {

    async readAllCursor(limit, cursor = null, games_id = null) {

        let sql = `
        SELECT
            p.post_id,
            p.titulo_postagem,
            p.conteudo_postagem,
            p.data_postagem,
            p.foto_postagem,
            p.user_id,
            p.games_id,
            u.nome_usuario,
            u.foto_perfil,
            COALESCE(g.nome, 'Sem categoria') AS categoria
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        LEFT JOIN games g ON p.games_id = g.games_id
        WHERE 1=1
    `

        const params = []

        if (cursor !== null) {
            params.push(cursor)
            sql += ` AND p.post_id < $${params.length}`
        }

        if (games_id !== null) {
            params.push(games_id)
            sql += ` AND p.games_id = $${params.length}`
        }

        params.push(limit)

        sql += `
        ORDER BY p.post_id DESC
        LIMIT $${params.length}
    `

        const { rows } = await query(sql, params)

        return rows
    },

    async readById(post_id) {

        const { rows } = await query(`SELECT p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, u.nome_usuario, u.foto_perfil, COALESCE(g.nome, 'Sem categoria') AS categoria
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        LEFT JOIN games g ON p.games_id = g.games_id
        WHERE p.post_id = $1
        `,
            [post_id])

        if (rows.length === 0) {
            return null
        }

        return rows[0]
    },

    async readByGameId(games_id) {

        const { rows } = await query(`
            SELECT g.games_id, g.nome, g.plataforma, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos, p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, p.games_id, u.nome_usuario, u.foto_perfil, g.nome AS categoria
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            JOIN games g ON p.games_id = g.games_id
            WHERE p.games_id = $1
            ORDER BY p.data_postagem DESC
            `, [games_id])

        return rows[0]
    },

    async readByUser(user_id, cursor = null) {

        const params = [user_id]

        let sql = `
        SELECT
            p.post_id,
            p.titulo_postagem,
            p.conteudo_postagem,
            p.data_postagem,
            p.foto_postagem,
            u.nome_usuario,
            u.foto_perfil,
            g.nome AS categoria
        FROM posts p
        JOIN users u ON p.user_id = u.user_id
        JOIN games g ON p.games_id = g.games_id
        WHERE p.user_id = $1
    `

        if (cursor) {
            sql += ` AND p.post_id < $2`
            params.push(cursor)
        }

        sql += `
        ORDER BY p.post_id DESC
        LIMIT 10
    `

        const { rows } = await query(sql, params)

        return {
            posts: rows,
            nextCursor: rows.length === 10
                ? rows[rows.length - 1].post_id
                : null,
            hasMore: rows.length === 10
        }
    },

    async readByLatestPosts() {

        const { rows } = await query(`
            SELECT
                p.post_id,
                p.conteudo_postagem,
                u.nome_usuario,
                u.foto_perfil,
                g.nome AS categoria
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            JOIN games g ON p.games_id = g.games_id
            ORDER BY p.data_postagem DESC
            LIMIT 3
        `)

        return rows
    },

    async create(post) {

        if (!post.titulo_postagem || !post.conteudo_postagem) {
            throw new Error("Título e conteúdo são obrigatórios!")
        }

        const sql = `
        INSERT INTO posts (titulo_postagem, conteudo_postagem, foto_postagem, user_id, games_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `

        const { rows } = await query(sql, [
            post.titulo_postagem,
            post.conteudo_postagem,
            post.foto_postagem,
            post.user_id,
            post.games_id
        ])

        return rows[0]
    },

    async readByIdAndUser(post_id, user_id) {

        const { rows } = await query(`
            SELECT 
                p.post_id,
                p.titulo_postagem,
                p.conteudo_postagem,
                p.data_postagem,
                p.foto_postagem,
                p.games_id,
                u.nome_usuario,
                u.foto_perfil
            FROM posts p
            JOIN users u ON p.user_id = u.user_id
            WHERE p.post_id = $1
            AND p.user_id = $2
        `, [post_id, user_id])

        return rows[0] || null
    },

    async update(post) {

        const existing = await this.readByIdAndUser(post.post_id, post.user_id)

        if (!existing) throw new Error("Post não encontrado ou não pertence ao usuário!")

        const sql = `
            UPDATE posts
            SET titulo_postagem=$1,
            conteudo_postagem=$2,
            foto_postagem=$3,
            games_id=$4
            WHERE post_id=$5
            AND user_id=$6
            RETURNING *
        `

        const { rows } = await query(sql, [
            post.titulo_postagem,
            post.conteudo_postagem,
            post.foto_postagem,
            post.games_id,
            post.post_id,
            post.user_id
        ])

        return rows[0]
    },

    async delete(post_id, user_id) {

        const existing = await this.readByIdAndUser(post_id, user_id)

        if (!existing) throw new Error("Post não encontrado ou não pertence ao usuário!")

        await query(`
        DELETE FROM comentarios
        WHERE post_id = $1;
        `, [post_id])

        const { rows } = await query(`
        DELETE FROM posts
        WHERE post_id = $1
        AND user_id = $2
        RETURNING *
        `, [post_id, user_id])

        return rows[0]
    }
}

export default postRepository