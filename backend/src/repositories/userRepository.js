import { connect } from "../config/database.js"
import authUserController from "../controllers/authUserController.js"
import sqltype from 'mssql'

const userRepository = {

    async readAll() {
        const conn = await connect()
        const { recordset } = await conn.query('select * from Users')
        return recordset
    },

    async readById(id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('id', sqltype.Int, id)
            .query('select * from Users where id = @id')

        return recordset
    },

    async create(user) {
        const conn = await connect()

        const sql = `insert into Users (nome_usuario, data_nascimento, email, senha)
        values (@nome_usuario, @data_nascimento, @email, @senha)`

        const result = await conn.request()
            .input("nome_usuario", sqltype.VarChar, user.nome_usuario)
            .input("data_nascimento", sqltype.Date, user.data_nascimento)
            .input("email", sqltype.VarChar, user.email)
            .input("senha", sqltype.VarChar, user.senha)
            .query(sql)

        return result
    },

    async readUser(email, senha) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('email', sqltype.VarChar(150), email)
            .query(`select * from Users where email = @email`)

        if (recordset.length > 0) {
            const hash = recordset[0].senha

            if (authUserController.compare(senha, hash)) {
                return recordset[0]
            }
        }

        return null
    },

    async update(id, user) {
        const conn = await connect()

        const sql = `update Users
        set nome_usuario=@nome_usuario, email=@email,data_nascimento=@data_nascimento
        where id=@id;`

        const result = await conn.request()
            .input('id', sqltype.Int, id)
            .input('nome_usuario', sqltype.VarChar, user.nome_usuario)
            .input('email', sqltype.VarChar, user.email)
            .input('data_nascimento', sqltype.Date, user.data_nascimento)
            .query(sql)

        return result
    },

    async delete(id) {
        const conn = await connect()

        const sql = `delete from Users where id=@id`

        const result = await conn.request()
            .input("id", sqltype.Int, id)
            .query(sql)

        return result
    }
}

export default userRepository