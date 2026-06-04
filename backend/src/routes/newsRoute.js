import { Router } from "express"
import newsController from "../controllers/newsController.js"
import { uploadNews } from "../config/cloudinary.js"
import { verifyToken } from "../middlewares/authMiddleware.js"
import { newsIDValidation, createNewsValidation, updateNewsValidation, deleteNewsValidation, validateNews } from "../middlewares/validation/newsValidation.js"
import { sanitizeNews } from "../middlewares/sanitization/newsSanitize.js"

const newsRouter = Router()

newsRouter.get('/news/me', verifyToken, newsController.getNewsByUser)

newsRouter.get('/news', newsController.getAllNews)

newsRouter.get('/news/:news_id', newsIDValidation, validateNews, newsController.getNewsById)

newsRouter.get('/news/:news_id/me', verifyToken, newsIDValidation, validateNews, newsController.getNewstByIdAndUser)

newsRouter.post('/news', verifyToken, uploadNews.single("img_noticia"), createNewsValidation, validateNews, sanitizeNews, newsController.insertNews)

newsRouter.patch('/news/:news_id', verifyToken, uploadNews.single("img_noticia"), updateNewsValidation, validateNews, sanitizeNews, newsController.updateNews)

newsRouter.delete('/news/:news_id', verifyToken, deleteNewsValidation, validateNews, newsController.deleteNews)

export default newsRouter