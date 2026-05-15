import query from "../config/connection.js"

const profileRepository = {

    async readPerfilById(usuarioId) {
        const { rows } = await query(`
            SELECT foto_perfil, nome_usuario, bio
            FROM users
            WHERE user_id = $1
            `, [usuarioId])

        return rows[0]
    },

    async updateProfile(usuarioId, foto_perfil, bio) {
        let sql = `
        UPDATE users
        SET bio = $1
    `

    const params = [bio]

        if (foto_perfil) {
            sql += `, foto_perfil = $2`
            params.push(foto_perfil)
        }

        const userIdParam = params.length + 1

        sql += ` WHERE user_id = $${userIdParam}
        RETURNING foto_perfil, bio `

        params.push(usuarioId)

        const { rows } = await query(sql, params)

        return rows[0]
    }
}

export default profileRepository