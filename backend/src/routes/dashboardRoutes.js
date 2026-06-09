import { Router } from "express"
import dashboardController from "../controllers/dashboardController.js"

const dashboardRouter = Router()

dashboardRouter.get("/stats", dashboardController.stats)
dashboardRouter.get("/top-users", dashboardController.topUsers)

export default dashboardRouter