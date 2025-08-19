const { createNewSpecialtyService, getAllSpecialtyService, getDetailSpecialtyServices, postDetailSpecialtyServices } = require("../services/specialtyServices")

const createNewSpecialty = async (req, res) => {
    try {
        let data = await createNewSpecialtyService(req.body)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}

const getAllSpecialty = async (req, res) => {
    try {
        let data = await getAllSpecialtyService()
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}
const getDetailSpecialty = async (req, res) => {
    try {
        let data = await getDetailSpecialtyServices(req.query.id, req.query.location)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errcode: -1,
            errMessage: 'Error from server'
        })
    }
}
const postDetailSpecialty = async (req, res) => {
    try {
        let data = await postDetailSpecialtyServices(req.body)
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
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialty, postDetailSpecialty
}