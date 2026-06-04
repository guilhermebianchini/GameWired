import { Router } from "express"
import userController from "../controllers/userController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { registerValidation } from "../middlewares/validation/userValidation.js"
import { loginValidation } from "../middlewares/validation/userValidation.js"
import { validateUser } from "../middlewares/validation/userValidation.js"

const userRoute = Router()

userRoute.get('/users', userController.getAllUsers)

userRoute.get('/users/me', verifyToken, userController.getMe)

userRoute.get('/users/:id', userController.getUserById)

userRoute.post('/users/register', registerValidation, validateUser, userController.insert)

userRoute.post('/users/login', loginValidation, validateUser, userController.login)

userRoute.patch('/users/update/:id', verifyToken, userController.update)

userRoute.delete('/users/delete/:id', verifyToken, userController.deleteUser)

export default userRoute