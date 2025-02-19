import express from "express"
import { getHomePage, getCRUDPage, PostCRUDPage } from "../controllers/homeController.js"
import db from "../models/index.js"
const router = express.Router()

router.get('/', getHomePage)

router.get('/crud', getCRUDPage)

router.post('/postCRUD', PostCRUDPage)

router.get('/hoidanit', async (req, res) => {
    return res.send('hoidanit')
})

module.exports = router


