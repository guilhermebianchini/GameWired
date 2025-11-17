import { Router } from "express"
import profileController from "../controllers/profileController.js"

const profileRoute = Router()

profileRoute.get('/profile/:id',profileController.getPerfilById)
profileRoute.put('/profile/update/:id', profileController.updateProfile)

export default profileRoute