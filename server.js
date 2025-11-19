import express from "express"
import cors from "cors"
import userRoute from "./backend/src/routes/userRoute.js"
import profileRoute from "./backend/src/routes/profileRoute.js"
import globalMiddleware from "./backend/src/middlewares/globalMiddleware.js"
import dotenv from "dotenv"

dotenv.config ()

const port = process.env.PORT
const host = process.env.HOST
const app = express()

app.use(cors())

app.use(express.json())
app.use(globalMiddleware.getIP)

app.use(userRoute)
app.use(profileRoute)

app.listen(port, host, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})