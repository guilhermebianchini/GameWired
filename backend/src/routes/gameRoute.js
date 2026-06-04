import { Router } from "express"
import gameController from "../controllers/gameController.js"
import { gameIDValidation } from "../middlewares/validation/gameValidation.js"
import { platformValidation } from "../middlewares/validation/gameValidation.js"
import { validateGame } from "../middlewares/validation/gameValidation.js"

const gameRouter = Router()

gameRouter.get('/games', gameController.getAllGames)

gameRouter.get('/games/select', gameController.getGameBySelect)

gameRouter.get('/games/:id', gameIDValidation, validateGame, gameController.getGameById)

gameRouter.get('/games/platform/:platform_id', platformValidation, validateGame, gameController.getGameByPlatform)

export default gameRouter