import express from "express"
import { getHomePage, getCRUDPage, PostCRUDPage, displayCRUDPage, getUpdatePage, postUpdatePage, getDeletePage } from "../controllers/homeController.js"
import db from "../models/index.js"
const router = express.Router()

router.get('/', getHomePage)

router.get('/crud', getCRUDPage)

router.post('/postCRUD', PostCRUDPage)

router.get('/getCRUD', displayCRUDPage)

router.get('/getEdit/:id', getUpdatePage)

router.post('/postEdit', postUpdatePage)

router.get('/getDelete/:id', getDeletePage)

router.get('/hoidanit', async (req, res) => {
    return res.send('hoidanit')
})

module.exports = router


