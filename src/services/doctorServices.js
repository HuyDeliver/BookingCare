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
                exclude: ['password', 'image']
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

module.exports = {
    getTopDoctorServices
}