import { where } from "sequelize"
import db from "../models"

const getTopDoctorServices = async (limitInput) => {
    try {
        let user = await db.User.findAll({
            limit: limitInput,
            where: {
                roleID: 'R2'
            },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['value_EN', 'value_VN'] },
                { model: db.Allcode, as: 'genderData', attributes: ['value_EN', 'value_VN'] }
            ],
            raw: true,
            nest: true
        })
        return {
            errCode: 0,
            errMessage: 'get top doctor success',
            data: user
        }
    } catch (error) {
        console.log(error)
    }
}

const getAllDoctorService = async () => {
    try {
        let doctor = await db.User.findAll({
            where: { roleID: 'R2' },
            attributes: {
                exclude: ['password', 'image']
            }
        })
        return {
            errCode: 0,
            data: doctor
        }
    } catch (error) {
        console.log(error)
    }
}

const saveInforDoctorService = async (data) => {
    try {
        if (!data.doctorId || !data.contentMarkdown || !data.contentHTML) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Markdown.create({
                contentHTML: data.contentHTML,
                contentMarkdown: data.contentMarkdown,
                description: data.description,
                doctorId: data.doctorId
            })
            return {
                errCode: 0,
                errMessage: 'save infor doctor success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getTopDoctorServices,
    getAllDoctorService,
    saveInforDoctorService
}