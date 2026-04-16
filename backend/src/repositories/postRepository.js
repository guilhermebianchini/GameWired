import { connect } from "../config/connection.js"
import sqltype from 'mssql'

const postRepository = {

    /*async readAll() {
        const conn = await connect()

        const { recordset } = await conn.query(`SELECT p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, p.user_id, p.games_id, u.nome_usuario, u.foto_perfil, g.nome AS categoria
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            JOIN Games g ON p.games_id = g.games_id
            ORDER BY p.data_postagem DESC`)

        return recordset
    },*/

    async readAllCursor(limit, cursor = null, games_id = null) {
        const conn = await connect()

        let query = `SELECT TOP (@limit) 
        p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, p.user_id, p.games_id, u.nome_usuario, u.foto_perfil, g.nome AS categoria
        FROM Posts p
        JOIN Users u ON p.user_id = u.user_id
        JOIN Games g ON p.games_id = g.games_id
        WHERE 1=1`

        const request = conn.request()
        request.input("limit", sqltype.Int, limit)

        if (cursor !== null) {
            query += ` AND p.post_id < @cursor`
            request.input("cursor", sqltype.Int, cursor)
        }

        if (games_id !== null) {
            query += ` AND p.games_id = @games_id`
            request.input("games_id", sqltype.Int, games_id)
        }

        query += ` ORDER BY p.post_id DESC`

        const { recordset } = await request.query(query)

        return recordset
    },

    async readById(post_id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('post_id', sqltype.Int, post_id)
            .query(`SELECT p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, u.nome_usuario, u.foto_perfil, g.nome
        FROM Posts p
        JOIN Users u ON p.user_id = u.user_id
        JOIN Games g ON p.games_id = g.games_id
        WHERE p.post_id = @post_id`)

        if (recordset.length === 0) {
            return null
        }

        return recordset[0]
    },

    async readByGameId(games_id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('games_id', sqltype.Int, games_id)
            .query(`SELECT g.games_id, g.nome, g.plataforma, g.descricao, g.genero, g.desenvolvedora, g.tipo, g.download, g.requisitos, p.post_id, p.titulo_postagem, p.conteudo_postagem, p.data_postagem, p.foto_postagem, p.games_id, u.nome_usuario, u.foto_perfil, g.nome AS categoria
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            JOIN Games g ON p.games_id = g.games_id
            WHERE p.games_id = @games_id
            ORDER BY p.data_postagem DESC`)

        return recordset
    },

    /*async getByUser(userId) {
        const conn = await connect()

        const { recordset } = await conn.query(`
    SELECT 
      p.post_id,
      p.titulo_postagem,
      p.conteudo_postagem,
      p.data_postagem,
      p.foto_postagem,
      u.nome_usuario,
      u.foto_perfil,
      g.nome AS categoria
    FROM Posts p
    JOIN Users u ON p.id = u.id
    JOIN Games g ON p.games_id = g.games_id
    WHERE p.id = ${userId}
    ORDER BY p.data_postagem DESC
  `)

        return recordset
    },*/

    async create(post) {
        const conn = await connect()

        if (!post.titulo_postagem || !post.conteudo_postagem) {
            throw new Error("Título e conteúdo são obrigatórios!")
        }

        const sql = `INSERT INTO Posts (titulo_postagem, conteudo_postagem, foto_postagem, user_id, games_id)
        OUTPUT INSERTED.*
        VALUES (@titulo_postagem, @conteudo_postagem, @foto_postagem, @user_id, @games_id)`

        const result = await conn.request()
            .input("titulo_postagem", sqltype.VarChar, post.titulo_postagem)
            .input("conteudo_postagem", sqltype.VarChar, post.conteudo_postagem)
            .input("foto_postagem", sqltype.VarChar, post.foto_postagem)
            .input("user_id", sqltype.Int, post.user_id)
            .input("games_id", sqltype.Int, post.games_id)
            .query(sql)

        return result.recordset[0]
    },

    async readByIdAndUser(post_id, user_id) {
        const conn = await connect()

        const { recordset } = await conn.request()
            .input('post_id', sqltype.Int, post_id)
            .input('user_id', sqltype.Int, user_id)
            .query(`
            SELECT 
                p.post_id,
                p.titulo_postagem,
                p.conteudo_postagem,
                p.data_postagem,
                p.foto_postagem,
                p.games_id,
                u.nome_usuario,
                u.foto_perfil
            FROM Posts p
            JOIN Users u ON p.user_id = u.user_id
            WHERE p.post_id = @post_id AND p.user_id = @user_id
        `)

        return recordset[0] || null
    },

    async update(post) {
        const conn = await connect()

        const existing = await this.readByIdAndUser(post.post_id, post.user_id)
        if (!existing) throw new Error("Post não encontrado ou não pertence ao usuário!")

        const sql = `UPDATE Posts
            SET titulo_postagem=@titulo_postagem, conteudo_postagem=@conteudo_postagem, foto_postagem=@foto_postagem,
            games_id=@games_id
            WHERE post_id=@post_id AND user_id=@user_id`

        const result = await conn.request()
            .input('post_id', sqltype.Int, post.post_id)
            .input('titulo_postagem', sqltype.VarChar, post.titulo_postagem)
            .input('conteudo_postagem', sqltype.VarChar, post.conteudo_postagem)
            .input('foto_postagem', sqltype.VarChar, post.foto_postagem)
            .input('user_id', sqltype.Int, post.user_id)
            .input('games_id', sqltype.Int, post.games_id)
            .query(sql)

        return result.rowsAffected[0]
    },

    async delete(post_id, user_id) {
        const conn = await connect()

        const existing = await this.readByIdAndUser(post_id, user_id)
        if (!existing) throw new Error("Post não encontrado ou não pertence ao usuário!")

        await conn.request()
            .input("post_id", sqltype.Int, post_id)
            .query(`
            DELETE FROM Comentarios
            WHERE post_id = @post_id
        `)

        const result = await conn.request()
            .input("post_id", sqltype.Int, post_id)
            .input("user_id", sqltype.Int, user_id)
            .query(`
            DELETE FROM Posts
            WHERE post_id = @post_id AND user_id = @user_id
        `)

        return result.rowsAffected[0]
    }
}

export default postRepository