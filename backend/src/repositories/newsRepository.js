import query from "../config/connection.js"

const newsRepository = {
    
    async readAll() {

        const { rows } = await query(`SELECT * FROM news`)

        return rows
    },

    async readById(news_id){

        const { rows } = await query(`SELECT n.news_id, n.titulo, n.data_publicacao, n.subtitulo, n.img_noticia, n.conteudo, n.fonte, u.nome_usuario
            FROM news n
            JOIN users u ON n.user_id = u.user_id
            WHERE n.news_id = $1
            `, [news_id])

            if (rows.length === 0) {
                return null
            }

            return rows[0]
    },

    async create(news) {
        if (!news.titulo || !news.data_publicacao || !news.subtitulo || !news.img_noticia || !news.conteudo || !news.fonte) {
            throw new Error ("Os campos de título, data da publicação, subtítulo, imagem, conteúdo e fonte são obrigatórios!")
        }

        const sql = `
        INSERT INTO news (titulo, data_publicacao, subtitulo, img_noticia, conteudo, fonte, user_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `

        const { rows } = await query(sql, [
            news.titulo,
            news.data_publicacao,
            news.subtitulo,
            news.img_noticia,
            news.conteudo,
            news.fonte,
            news.user_id
        ])

        return rows[0]
    },

    async readByIdAndUser (news_id, user_id) {

        const { rows } = await query(`
            SELECT
            n.news_id,
            n.titulo,
            n.data_publicacao,
            n.subtitulo,
            n.img_noticia,
            n.conteudo,
            n.fonte,
            u.user_id,
            FROM news n
            JOIN users u ON n.user_id = u.user_id
            WHERE n.news_id = $1
            AND n.user_id = $2
            `, [news_id, user_id])

            return rows[0] || null
    },

    async update(news) {

        const existing = await this.readByIdAndUser(news.news_id, news.user_id)

        if (!existing) throw new Error ("Notícia não encontrada ou não pertence ao editor!")

            const sql = `
            UPDATE news
            SET titulo = $1,
            data_publicacao = $2,
            subtitulo = $3,
            img_noticia = $4,
            conteudo = $5,
            fonte = $6
            WHERE news_id = $7
            AND user_id = $8
            RETURNING *
            `

            const { rows } = await query(sql, [
                news.titulo,
                news.data_publicacao,
                news.subtitulo,
                news.img_noticia,
                news.conteudo,
                news.fonte,
                news.news_id,
                news.user_id
            ])

            return rows[0]
    },

    async delete (news_id, user_id) {

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