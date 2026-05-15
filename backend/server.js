import 'dotenv/config'

import express from "express"
import cors from "cors"

import userRoute from "./src/routes/userRoute.js"
import profileRoute from "./src/routes/profileRoute.js"
import postRouter from "./src/routes/postRoute.js"
import gameRouter from "./src/routes/gameRoute.js"
import commentRouter from './src/routes/commentRoute.js'

import globalMiddleware from "./src/middlewares/globalMiddleware.js"

const port = process.env.PORT
const app = express()

app.use(cors({
  origin: "*",
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})