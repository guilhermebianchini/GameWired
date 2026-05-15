import 'dotenv/config'

import express from "express"
import cors from "cors"

import userRoute from "./src/routes/userRoute.js"
import profileRoute from "./src/routes/profileRoute.js"
import postRouter from "./src/routes/postRoute.js"
import gameRouter from "./src/routes/gameRoute.js"
import commentRouter from './src/routes/commentRoute.js'

import globalMiddleware from "./src/middlewares/globalMiddleware.js"

const port = process.env.PORT || 3000
const app = express()

app.use(cors({
  origin: "https://gamewired.vercel.app",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

app.use(globalMiddleware.getIP)

app.use(userRoute)
app.use(profileRoute)
app.use(postRouter)
app.use(commentRouter)
app.use(gameRouter)

<<<<<<< HEAD
app.listen(port, "0.0.0.0", () => {
=======
app.listen(port, () => {
>>>>>>> 7e4dd07ce52bc5481b73052f9e48217fad760258
  console.log(`Servidor rodando na porta: ${port}`)
})