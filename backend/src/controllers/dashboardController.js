import dashboardRepository from "../repositories/dashboardRepository.js"

const dashboardController = {

  async stats(req, res) {
    try {
      const dados = await dashboardRepository.getStats()
      res.status(200).json(dados)
    } catch (error) {
      res.status(500).json(error)
    }
  },

  async topUsers(req, res) {
    try {
      const dados = await dashboardRepository.topUsers()
      res.status(200).json(dados)
    } catch (error) {
      res.status(500).json(error)
    }
  }

}

export default dashboardController