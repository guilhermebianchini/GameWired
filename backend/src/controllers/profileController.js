import profileRepository from "../repositories/profileRepository.js"

const profileController = {
    async getPerfilById(req, res) {
        try {
            const id = req.params.id

            const perfil = await profileRepository.readPerfilById(id)

            if (!perfil) {
                return res.status(404).json({ mensagem: "Usuário não encontrado!" })
            }

            if (perfil.preferencias) {
                try {
                    perfil.preferencias = JSON.parse(perfil.preferencias)
                } catch {
                    perfil.preferencias = []
                }
            } else {
                perfil.preferencias = []
            }

            return res.json(perfil)
        } catch (err) {
            return res.status(500).json({ erro: err.message })
        }
    },

    async updateProfile(req, res) {
        try {
            const usuarioId = req.params.id

            const { foto_perfil, bio, preferencias } = req.body

            const preferenciasJSON = JSON.stringify(preferencias || [])

            const perfilAtualizado = await profileRepository.updateProfile(
                usuarioId,
                foto_perfil,
                bio,
                preferenciasJSON
            )

            return res.json(perfilAtualizado)

        } catch (err) {
            return res.status(500).json({ erro: err.message })
        }
    }
}

export default profileController