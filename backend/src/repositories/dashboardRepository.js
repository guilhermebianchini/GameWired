import query from "../config/connection.js"

const dashboardRepository = {

  async getStats() {
    const { rows } = await query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_usuarios,
        (SELECT COUNT(*) FROM posts) AS total_posts,
        (SELECT COUNT(*) FROM comentarios) AS total_comentarios,
        (SELECT COUNT(*) FROM games) AS total_jogos,
        (SELECT COUNT(*) FROM news) AS total_noticias
    `)

    return rows[0]
  },

  async topUsers() {
    const { rows } = await query(`
      SELECT
        u.user_id,
        u.nome_usuario,
        COUNT(DISTINCT p.post_id) AS total_posts,
        COUNT(DISTINCT c.comentario_id) AS total_comentarios
      FROM users u
      LEFT JOIN posts p ON u.user_id = p.user_id
      LEFT JOIN comentarios c ON u.user_id = c.user_id
      GROUP BY u.user_id, u.nome_usuario
      ORDER BY total_posts DESC, total_comentarios DESC
      LIMIT 10
    `)

    return rows
  }

}

export default dashboardRepository