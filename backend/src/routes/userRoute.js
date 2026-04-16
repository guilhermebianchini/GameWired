import { Router } from "express"
import userController from "../controllers/userController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const userRoute = Router()

userRoute.get('/users', userController.getAllUsers)
userRoute.get('/users/:id', userController.getUserById)
userRoute.post('/users/register', userController.insert)
userRoute.post('/users/login', userController.login)
userRoute.patch('/users/update', verifyToken, userController.update)
userRoute.delete('/users/delete/:id', verifyToken, userController.deleteUser)

export default userRoute