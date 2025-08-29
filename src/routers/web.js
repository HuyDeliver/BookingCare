const express = require("express")
const { getHomePage, getCRUDPage, PostCRUDPage, displayCRUDPage, getUpdatePage, postUpdatePage, getDeletePage } = require("../controllers/homeController.js")
const userController = require("../controllers/userController.js")
const docterController = require("../controllers/doctorController.js")
const patientController = require('../controllers/patientController.js')
const { createNewSpecialty, getAllSpecialty, getDetailSpecialty, postDetailSpecialty } = require("../controllers/specialtyController.js")
const { createNewClinic, getAllClinic, getDetailClinic, postDetailClinic } = require("../controllers/clinicController.js")
const { searchBar } = require("../controllers/searchController.js")
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

router.get('/api/get-all-doctors', docterController.getAllDoctors)

router.post('/api/save-info-doctors', docterController.postInforDoctor)

router.get('/api/get-detail-doctor', docterController.getDetailDoctor)

router.post('/api/post-doctor-schedule', docterController.postDoctorSchedule)

router.get('/api/get-schedule-doctor', docterController.getDoctorSchedule)

router.get('/api/get-booking-infor-doctor', docterController.getDoctorBookingInfor)

router.get('/api/get-profile-doctor', docterController.getProfileDoctor)

router.get('/api/get-list-patient-booking', docterController.getListPatientBooking)

router.post('/api/post-send-redemy', docterController.postSendRedemy)




router.post('/api/post-patient-booking', patientController.postBookingAppointment)

router.post('/api/post-patient-booking', patientController.postBookingAppointment)

router.post('/api/verify-booking-appointment', patientController.postVerifyBookingAppointment)

router.post('/api/create-new-specialty', createNewSpecialty)

router.get('/api/get-all-specialty', getAllSpecialty)

router.get('/api/get-detail-specialty', getDetailSpecialty)

router.post('/api/post-detail-specialty', postDetailSpecialty)




router.post('/api/create-new-clinic', createNewClinic)

router.get('/api/get-all-clinic', getAllClinic)

router.get('/api/get-detail-clinic', getDetailClinic)

router.post('/api/post-detail-clinic', postDetailClinic)

router.get('/api/search', searchBar)

module.exports = router


