import express from "express"
import cors from "cors"
import userRoute from "./src/routes/userRoute.js"
import profileRoute from "./src/routes/profileRoute.js"
import globalMiddleware from "./src/middlewares/globalMiddleware.js"
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