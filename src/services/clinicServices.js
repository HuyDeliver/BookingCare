const { where } = require("sequelize")
const db = require("../models")
const { convertToWebp } = require("../utils/convertWebp")

const createNewClinicService = async (data) => {
    try {
        if (!data.name || !data.descriptionMarkdown || !data.descriptionHTML || !data.avatar || !data.address || !data.background || !data.province) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Clinic.create(
                {
                    name: data.name,
                    address: data.address,
                    image: await convertToWebp(data.avatar),
                    provinceId: data.province,
                    bgImage: await convertToWebp(data.background),
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML
                },
            )
            return {
                errCode: 0,
                errMessage: 'Save new clinic success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const getAllClinicService = async () => {
    try {
        let data = await db.Clinic.findAll({
            attributes: {
                exclude: ['descriptionHTML', 'descriptionMarkdown', 'updatedAt', 'provinceId', 'createdAt', 'address', 'bgImage']
            },
            order: [['id', 'ASC']],
        },
        )
        if (data && data.length > 0) {
            data.map((item) => {
                item.image = Buffer.from(item.image, 'base64').toString('binary')
                return item
            })
        }
        return {
            errCode: 0,
            errMessage: 'success',
            data: data
        }
    } catch (error) {
        console.log(error)
    }
}
const getDetailClinicServices = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 0,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.Clinic.findOne({
                where: { id: inputId },
                include: [
                    { model: db.Doctor_infor, attributes: ['doctorId'] }
                ],
                order: [
                    ['id', 'ASC'],
                ],
                raw: false,
                nest: true
            })
            if (data && data.image && data.bgImage) {
                data.image = Buffer.from(data.image, 'base64').toString('binary')
                data.bgImage = Buffer.from(data.bgImage, 'base64').toString('binary')
            }
            return {
                errCode: 0,
                errMessage: 'success',
                data
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const postDetailClinicServices = async (data) => {
    try {
        if (!data.id || !data.name || !data.descriptionMarkdown || !data.descriptionHTML || !data.avatar || !data.background || !data.province) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Clinic.update(
                {
                    name: data.name,
                    image: await convertToWebp(data.avatar),
                    provinceId: data.province,
                    bgImage: await convertToWebp(data.background),
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML
                },
                {
                    where: { id: data.id }
                },
            )
            return {
                errCode: 0,
                errMessage: 'Save update specialty success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    createNewClinicService,
    getAllClinicService,
    getDetailClinicServices, postDetailClinicServices
}