import { Router } from "express"
import newsController from "../controllers/newsController.js"
import { uploadNews } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"

const newsRouter = Router()

newsRouter.get('/news/me', verifyToken, newsController.getNewsByUser)

newsRouter.get('/news', newsController.getAllNews)
newsRouter.get('/news/:news_id', newsController. getNewsById)
newsRouter.get('/news/:news_id/me', verifyToken, newsController.getNewstByIdAndUser)
newsRouter.post('/news', verifyToken, uploadNews.single("img_noticia"), newsController.insertNews)
newsRouter.patch('/news/:news_id', verifyToken, uploadNews.single("img_noticia"), newsController.updateNews)
newsRouter.delete('/news/:news_id', verifyToken, newsController.deleteNews)

export default newsRouter