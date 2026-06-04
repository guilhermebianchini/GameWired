import { Router } from "express"
import postController from "../controllers/postController.js"
import { uploadPosts } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { cursorValidation, postIDValidation, createPostValidation, updatePostValidation, deletePostValidation, validatePost } from "../middlewares/validation/postValidation.js"
import { sanitizePost } from "../middlewares/sanitization/postSanitize.js"

const postRouter = Router()

postRouter.get('/posts/latest', postController.getByLatestPosts)

postRouter.get('/posts/me', verifyToken, postController.getPostsByUser)

postRouter.get('/posts/cursor', cursorValidation, validatePost, postController.getAllPostsCursor)

postRouter.get('/posts/:post_id', postIDValidation, validatePost, postController.getPostById)

postRouter.get('/posts/:post_id/me', verifyToken, postIDValidation, validatePost, postController.getPostByIdAndUser)

postRouter.post('/posts', verifyToken, uploadPosts.single("foto_postagem"), createPostValidation, validatePost, sanitizePost, postController.insertPost)

postRouter.patch('/posts/:post_id', verifyToken, uploadPosts.single("foto_postagem"), updatePostValidation, postIDValidation, validatePost, sanitizePost, postController.updatePost)

postRouter.delete('/posts/:post_id', verifyToken, deletePostValidation, postIDValidation, validatePost, postController.deletePost)

export default postRouter