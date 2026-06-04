import query from "../config/connection.js"

const commentRepository = {
    async readAll() {

        const { rows } = await query(`SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, c.user_id, c.post_id, u.nome_usuario, u.foto_perfil
            FROM comentarios c
            JOIN users u ON c.user_id = u.user_id
            JOIN posts p ON c.post_id = p.post_id
            ORDER BY c.comentario_data ASC`)

        return rows
    },

    async readById(comentario_id) {

        const { rows } = await query(`SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, u.nome_usuario, u.foto_perfil, p.post_id
            FROM comentarios c
            JOIN users u ON c.user_id = u.user_id
            JOIN posts p ON c.post_id = p.post_id
            WHERE c.comentario_id = $1
            `, [comentario_id])

        if (rows.length === 0) {
            return null
        }

        return rows[0]
    },

    async create(comentario) {

        if (!comentario.post_id) {
            throw new Error("Post é obrigatório!")
        }

        const sql = `
        INSERT INTO comentarios (comentario_conteudo, user_id, post_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `

        const { rows } = await query(sql, [
            comentario.comentario_conteudo,
            comentario.user_id,
            comentario.post_id
        ])

        return rows[0]
    },

    async readByIdAndUser(comentario_id, user_id) {
        const { rows } = await query(`
            SELECT c.comentario_id, c.comentario_conteudo, c.comentario_data, c.post_id, u.nome_usuario, u.foto_perfil
            FROM comentarios c
            JOIN users u ON c.user_id = u.user_id
            WHERE c.comentario_id = $1
            AND c.user_id = $2
            `, [comentario_id, user_id])

        return rows[0] || null
    },

    async update(comentario) {

        const sql = `UPDATE comentarios
        SET comentario_conteudo=$1
        WHERE comentario_id=$2
        AND user_id=$3
        RETURNING *
        `

        const { rows } = await query(sql, [
            comentario.comentario_conteudo,
            comentario.comentario_id,
            comentario.user_id
        ])

        return rows[0]
    },

    async delete(comentario_id, user_id) {
        
        const { rows } = await query(`DELETE FROM comentarios
            WHERE comentario_id=$1
            AND user_id=$2
            RETURNING *
            `, [comentario_id, user_id])

        return rows[0]
    }
}

export default commentRepository