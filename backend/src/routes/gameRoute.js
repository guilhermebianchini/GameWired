import { Router } from "express"
import gameController from "../controllers/gameController.js"
import { uploadGames } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { gameIDValidation, platformValidation, insertGameValidation, updateGameValidation, deleteGameValidation, validateGame } from "../middlewares/validation/gameValidation.js"
import { sanitizeGame } from "../middlewares/sanitization/gameSanitize.js"

const gameRouter = Router()

gameRouter.get('/games', gameController.getAllGames)

gameRouter.get('/games/select', gameController.getGameBySelect)

gameRouter.get('/games/:id', gameIDValidation, validateGame, gameController.getGameById)

gameRouter.get('/games/platform/:platform_id', platformValidation, validateGame, gameController.getGameByPlatform)

gameRouter.post('/games', verifyToken, uploadGames.single("game_img"), insertGameValidation, validateGame, sanitizeGame, gameController.insertGame)

gameRouter.patch('/games/:games_id', verifyToken, uploadGames.single("game_img"), updateGameValidation, validateGame, sanitizeGame, gameController.updateGame)

gameRouter.delete('/games/:games_id', verifyToken, deleteGameValidation, validateGame, gameController.deleteGame)

export default gameRouter