const { where } = require("sequelize")
const db = require("../models")
const { convertToWebp } = require("../utils/convertWebp")
const { orderBy } = require("lodash")

const createNewSpecialtyService = async (data) => {
    try {
        if (!data.name || !data.descriptionMarkdown || !data.descriptionHTML || !data.avatar) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let imageWebp = await convertToWebp(data.avatar)
            await db.Specialty.create({
                name: data.name,
                image: imageWebp,
                descriptionMarkdown: data.descriptionMarkdown,
                descriptionHTML: data.descriptionHTML
            })
            return {
                errCode: 0,
                errMessage: 'Save new specialty success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const getAllSpecialtyService = async () => {
    try {
        let data = await db.Specialty.findAll({
            attributes: {
                exclude: ['descriptionMarkdown', 'descriptionHTML', 'createdAt', 'updatedAt']
            },
            order: [['id', 'ASC']]
        })
        if (data && data.length > 0) {
            data.map((item) => {
                item.image = Buffer.from(item.image, 'base64').toString('binary')
                return item
            })
        }
        return {
            errCode: 0,
            errMessage: 'success',
            data
        }
    } catch (error) {
        console.log(error)
    }
}
const getDetailSpecialtyServices = async (inputId, location) => {
    try {
        if (!inputId || !location) {
            return {
                errCode: 0,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.Specialty.findOne({
                where: { id: inputId },
            })
            if (data) {
                if (data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary')
                }
                let doctorSpecialty = []
                if (location === 'NOTAKE') {
                    return {
                        errCode: 0,
                        errMessage: 'success',
                        data
                    }
                } else if (location === 'ALL') {
                    doctorSpecialty = await db.Doctor_infor.findAll({
                        where: { specialtyId: inputId },
                        attributes: ['doctorId', 'provinceId']
                    })
                } else {
                    doctorSpecialty = await db.Doctor_infor.findAll({
                        where: { specialtyId: inputId, provinceId: location },
                        attributes: ['doctorId', 'provinceId'],
                    })
                }
                data.doctorSpecialty = doctorSpecialty
            } else {
                data = {}
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
const postDetailSpecialtyServices = async (data) => {
    try {
        if (!data.name || !data.descriptionMarkdown || !data.descriptionHTML || !data.avatar) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Specialty.update(
                {
                    name: data.name,
                    image: await convertToWebp(data.avatar),
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
    createNewSpecialtyService,
    getAllSpecialtyService,
    getDetailSpecialtyServices, postDetailSpecialtyServices
}