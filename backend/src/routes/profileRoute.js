import { Router } from "express"
import profileController from "../controllers/profileController.js"
import { uploadPerfil } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { updateProfileValidation, validateProfile } from "../middlewares/validation/profileValidator.js"
import { sanitizeProfile } from "../middlewares/sanitization/profileSanitize.js"

const profileRoute = Router()

profileRoute.get('/profile', verifyToken, profileController.getPerfilById)

profileRoute.put('/profile', verifyToken, uploadPerfil.single("foto_perfil"), updateProfileValidation, validateProfile, sanitizeProfile, profileController.updateProfile)

export default profileRoute