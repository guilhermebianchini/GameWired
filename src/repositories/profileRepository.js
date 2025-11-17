import { connect } from "../database/userConnection.js"
import sqltype from 'mssql'

const profileRepository = {
    async readPerfilById(usuarioId) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input("usuarioId", sqltype.Int, usuarioId)
            .query(`SELECT foto_perfil, nome_usuario, bio, preferencias
            FROM Users
            WHERE id = @usuarioId`)

        return recordset[0]
    },

    async updateProfile(usuarioId, foto_perfil, bio, preferencias) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input("usuarioId", sqltype.Int, usuarioId)
            .input("foto_perfil", sqltype.VarChar, foto_perfil)
            .input("bio", sqltype.VarChar, bio)
            .input("preferencias", sqltype.VarChar, preferencias)
            .query(`UPDATE Users SET 
        foto_perfil = @foto_perfil,
        bio = @bio,
        preferencias = @preferencias
        WHERE id = @usuarioId;

        SELECT foto_perfil, bio, preferencias
        FROM Users
        WHERE id = @usuarioId`)

        return recordset[0]
    }
}

export default profileRepository