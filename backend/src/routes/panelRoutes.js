import { Router } from "express"
import panelController from "../controllers/panelController.js"

const panelRouter = Router()

panelRouter.get("/stats", panelController.getStats)
panelRouter.get("/top-users", panelController.topUsers)

export default panelRouter