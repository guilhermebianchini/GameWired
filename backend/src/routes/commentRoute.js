import { Router } from "express"
import commentController from "../controllers/commentController.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { commentIDValidation, createCommentValidation, updateCommentValidation, deleteCommentValidation, validateComment } from "../middlewares/validation/commentValidator.js"
import { sanitizeComment } from "../middlewares/sanitization/commentSanitize.js"

const commentRouter = Router()

commentRouter.get('/comentarios', commentController.getAllComments)

commentRouter.get('/comentarios/:comentario_id', commentIDValidation, validateComment, commentController.getCommentById)

commentRouter.get('/comentarios/:comentario_id/me', verifyToken, commentIDValidation, validateComment, commentController.getCommentByIdAndUser)

commentRouter.post('/comentarios', verifyToken, createCommentValidation, validateComment, sanitizeComment, commentController.insertComment)

commentRouter.patch('/comentarios/:comentario_id', verifyToken, updateCommentValidation, validateComment, sanitizeComment, commentController.updateComment)

commentRouter.delete('/comentarios/:comentario_id', verifyToken, deleteCommentValidation, validateComment, commentController.deleteComment)

export default commentRouter