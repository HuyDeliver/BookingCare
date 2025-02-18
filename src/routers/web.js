import express from "express"
import { getHomePage } from "../controllers/homeController.js"
import db from "../models/index.js"
const router = express.Router()

router.get('/', getHomePage)

router.get('/hoidanit', async (req, res) => {
    return res.send('hoidanit')
})

module.exports = router


