import doctorService from '../services/doctorServices'

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10
    try {
        let resonse = await doctorService.getTopDoctorServices(+limit)
        return res.status(200).json(resonse)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

const getAllDoctors = async (req, res) => {
    try {
        let doctor = await doctorService.getAllDoctorService()
        return res.status(200).json(doctor)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}
const postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInforDoctorService(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

const getDetailDoctor = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorService(req.query.id)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

module.exports = {
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctor,
    getDetailDoctor
}