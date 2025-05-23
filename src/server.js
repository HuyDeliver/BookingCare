import express from "express"
import configViewEngine from "./config/viewEngine.js"
import router from "./routers/web.js"
import connectTest from "./config/database.js"
import cors from "cors"

require("dotenv").config()
const port = process.env.PORT || 6969

const app = express()

app.use(cors({ credentials: true, origin: true }));

//config app

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

configViewEngine(app)
app.use(router)
connectTest()


app.listen(port, () => {
    console.log("backend nodejs is running on the port " + port)
})
