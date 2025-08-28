import express from "express"
import configViewEngine from "./config/viewEngine.js"
import router from "./routers/web.js"
import connectTest from "./config/connectDB.js"
import cors from "cors"
const compression = require('compression');

require("dotenv").config()
const port = process.env.PORT || 6969

const app = express()

app.use(cors({ credentials: true, origin: true }));

//config app

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(compression());

app.use(express.static('public', {
    maxAge: '1h',
}));

// Không cache cho API JSON
app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.set('Cache-Control', 'no-store');
    }
    next();
});

configViewEngine(app)
app.use(router)
connectTest()


app.listen(port, () => {
    console.log("backend nodejs is running on the port " + port)
})
