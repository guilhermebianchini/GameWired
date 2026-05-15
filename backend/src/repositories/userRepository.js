import query from "../config/connection.js"
import authUserController from "../controllers/authUserController.js"

const userRepository = {

    async readAll() {
        const { rows } = await query('SELECT * FROM users')

        return rows
    },

    async readById(id) {
        const { rows } = await query(
            'SELECT * FROM users WHERE user_id = $1',
            [id]
        )

        return rows[0]
    },

    async create(user) {

        const sql = `
        INSERT INTO users (nome_usuario, data_nascimento, email, senha)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `

        const { rows } = await query(sql, [
            user.nome_usuario,
            user.data_nascimento,
            user.email,
            user.senha
        ])

        return rows[0]
    },

    async findByEmail(email) {
        const { rows } = await query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        return rows[0]
    },

    async update(id, user) {

        const sql = `
        UPDATE users
        SET nome_usuario=$1, email=$2, data_nascimento=$3
        WHERE user_id = $4
        RETURNING *
        `

        const { rows } = await query(sql, [
            user.nome_usuario,
            user.email,
            user.data_nascimento,
            id
        ])

        return rows[0]
    },

    async deleteUser(id) {
        const { rows } = await query(
            'DELETE FROM users WHERE user_id = $1 RETURNING *',
            [id]
        )

        return rows[0]
    }
}

export default userRepository