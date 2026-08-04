import panelRepository from "../repositories/panelRepository.js"

const panelController = {

  async getStats(req, res) {
    try {
      const dados = await panelRepository.getStats()
      res.status(200).json(dados)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  async topUsers(req, res) {
    try {
      const dados = await panelRepository.topUsers()
      res.status(200).json(dados)
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default panelRepository