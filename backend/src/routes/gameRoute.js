import { Router } from "express"
import gameController from "../controllers/gameController.js"

const gameRouter = Router()

gameRouter.get('/games', gameController.getAllGames)
gameRouter.get('/games/select', gameController.getGameBySelect)
gameRouter.get('/games/:id', gameController.getGameById)
gameRouter.get('/games/platform/:platform_id', gameController.getGameByPlatform)

export default gameRouter