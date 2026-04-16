import { Router } from "express"
import postController from "../controllers/postController.js"
import { uploadPosts } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const postRouter = Router()

postRouter.get('/posts/cursor', postController.getAllPostsCursor)
/*postRouter.get('/posts', postController.getAllPosts)*/
postRouter.get('/posts/:post_id', postController.getPostById)
postRouter.get('/posts/:post_id/me', verifyToken, postController.getPostByIdAndUser)
postRouter.post('/posts', verifyToken, uploadPosts.single("foto_postagem"), postController.insertPost)
postRouter.patch('/posts/:post_id', verifyToken, uploadPosts.single("foto_postagem"), postController.updatePost)
postRouter.delete('/posts/:post_id', verifyToken, postController.deletePost)

export default postRouter

/*postRouter.get('/posts/users/:id', postController.getPostsByUser)*/