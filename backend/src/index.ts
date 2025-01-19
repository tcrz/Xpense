import "dotenv/config"
import cors from "cors"
import express from "express"
import { connectToDatabase } from "./config/db"
import { PORT } from "./constants/constants"
import { errorHandler } from "./middleware/errorHandler"
import { handleAsyncController } from "./utils/handleAsyncController"
import { authRoutes } from "./routes/auth.route"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

app.get("/health", handleAsyncController(async (req, res, next) => {
    res.send("Alive and Serving!")
}))

app.use("/auth", authRoutes)

app.use(errorHandler)
app.listen(PORT, async () => {
    console.log("Server is running on port 3001")
    await connectToDatabase()
})