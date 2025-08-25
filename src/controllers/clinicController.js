const { createNewClinicService, getAllClinicService, getDetailClinicServices, postDetailClinicServices } = require("../services/clinicServices")

const createNewClinic = async (req, res) => {
    try {
        let data = await createNewClinicService(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getAllClinic = async (req, res) => {
    try {
        let data = await getAllClinicService()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}
const getDetailClinic = async (req, res) => {
    try {
        let data = await getDetailClinicServices(req.query.id)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}
const postDetailClinic = async (req, res) => {
    try {
        let data = await postDetailClinicServices(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinic, postDetailClinic
}