import express from "express"
import { getHomePage, getCRUDPage, PostCRUDPage, displayCRUDPage, getUpdatePage, postUpdatePage, getDeletePage } from "../controllers/homeController.js"
import userController from "../controllers/userController.js"
import docterController from "../controllers/doctorController.js"
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

router.post('/api/login', userController.handleLogin)

router.get('/api/get-all-users', userController.handleGetAllUsers)

router.post('/api/create-new-users', userController.handleCreateNewUser)

router.put('/api/update-user', userController.handleUpdateUser)

router.delete('/api/delete-user', userController.handleDeleteUser)

router.get('/api/allcode', userController.getAllCode)

router.get('/api/top-doctor-home', docterController.getTopDoctorHome)

module.exports = router


