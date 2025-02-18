import express from "express"
import configViewEngine from "./config/viewEngine.js"
import router from "./routers/web.js"
import connectTest from "./config/database.js"
require("dotenv").config()
const port = process.env.PORT || 6969

const app = express()

//config app

app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies

configViewEngine(app)
app.use(router)
connectTest()

app.listen(port, () => {
    console.log("backend nodejs is running on the port " + port)
})
