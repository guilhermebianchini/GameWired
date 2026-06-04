import profileRepository from "../repositories/profileRepository.js"

const profileController = {
    async getPerfilById(req, res) {
        try {
            const user_id = req.user.id

            const perfil = await profileRepository.readPerfilById(user_id)

            if (!perfil) {
                return res.status(404).json({ mensagem: "Usuário não encontrado!" })
            }

            return res.json(perfil)
        } catch (err) {

            return res.status(500).json({ erro: err.message })
        }
    },

    async updateProfile(req, res) {
        try {
            const user_id = req.user.id
            
            const bio = req.body.bio?.trim() || null

            const fotoUrl = req.file ? req.file.path : null

            const perfilAtualizado = await profileRepository.updateProfile(
                user_id,
                fotoUrl,
                bio
            )

            return res.json(perfilAtualizado)

        } catch (err) {
            return res.status(500).json({ erro: err.message })
        }
    }
}

export default profileController