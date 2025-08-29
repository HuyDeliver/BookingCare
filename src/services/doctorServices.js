const db = require('../models/index')
require('dotenv').config()
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
import _, { includes } from "lodash"
import { emitter } from "../utils/emitter"
import { sendAttackment } from "./emailService"

const getTopDoctorServices = async (limitInput) => {
    try {
        let user = await db.User.findAll({
            limit: limitInput,
            where: {
                roleID: 'R2'
            },
            order: [['createdAt', 'DESC']],
            attributes: ['firstName', 'lastName', 'id', 'image'],
            include: [
                { model: db.Allcode, as: 'positionData', attributes: ['value_EN', 'value_VN'] },
                {
                    model: db.Doctor_infor,
                    attributes: {
                        exclude: ['id', 'doctorId', 'clinicId', 'specialtyId', 'priceId', 'provinceId', 'paymentId', 'addressClinic', 'nameClinic', 'note', 'count']
                    },
                    include: [
                        {
                            model: db.Specialty,
                            attributes: ['id', 'name']
                        }
                    ]
                }
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

const checkValidInput = (data) => {
    let isValid = true
    let arr = ['doctorId', 'contentMarkdown', 'contentHTML', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic',
        'addressClinic', 'note', 'description', 'selectedSpecialty', 'selectedClinic']
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!data[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }
    return {
        isValid, element
    }
}
const saveInforDoctorService = async (data) => {
    try {
        let check = checkValidInput(data)
        if (check.isValid === false) {
            return {
                errCode: 1,
                errMessage: `Missing required parameter ${check.element}`
            }
        } else {
            if (data.action === 'CREATE') {
                // Kiểm tra xem đã tồn tại chưa
                const doctorInfor = await db.Doctor_infor.findOne({
                    where: { doctorId: data.doctorId }
                });

                if (doctorInfor) {
                    return {
                        errCode: 2,
                        errMessage: 'Doctor information already exists'
                    }
                }

                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId
                });

                await db.Doctor_infor.create({
                    priceId: data.selectedPrice,
                    paymentId: data.selectedPayment,
                    provinceId: data.selectedProvince,
                    nameClinic: data.nameClinic,
                    addressClinic: data.addressClinic,
                    note: data.note,
                    doctorId: data.doctorId,
                    specialtyId: data.selectedSpecialty,
                    clinicId: data.selectedClinic
                });
            }

            else if (data.action === 'EDIT') {
                await db.Markdown.update(
                    {
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description
                    },
                    {
                        where: { doctorId: data.doctorId }
                    }
                )
                await db.Doctor_infor.update(
                    {
                        priceId: data.selectedPrice,
                        paymentId: data.selectedPayment,
                        provinceId: data.selectedProvince,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        specialtyId: data.selectedSpecialty,
                        clinicId: data.selectedClinic,
                        note: data.note
                    },
                    {
                        where: { doctorId: data.doctorId }
                    }
                )
            }

            return {
                errCode: 0,
                errMessage: 'save infor doctor success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const getDetailDoctorService = async (inputId) => {
    try {
        if (!inputId) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value_EN', 'value_VN'] },
                    {
                        model: db.Doctor_infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['value_EN', 'value_VN'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value_EN', 'value_VN'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['value_EN', 'value_VN'] }
                        ]
                    }
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = Buffer.from(data.image, 'base64').toString('binary')
            }
            return {
                errCode: 0,
                data: data
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const postDoctorScheduleService = async (data) => {
    try {
        if (!data.arrSchedule || !data.doctorID || !data.date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let schedule = data.arrSchedule
            if (schedule && schedule.length > 0) {
                schedule = schedule.map((item) => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE
                    return item
                })
            }
            let existing = await db.Schedule.findAll({
                where: { doctorID: data.doctorID, date: data.date },
                attributes: ['timeType', 'date', 'doctorID', 'maxNumber'],
                raw: true
            })

            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                const formatDate = (d) => new Date(d).toISOString().split('T')[0]; // or use moment(d).format('YYYY-MM-DD')
                return a.timeType === b.timeType && formatDate(a.date) === formatDate(b.date);
            });

            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(schedule)
                return {
                    errCode: 0,
                    errMessage: 'OK'
                }
            } else {
                return {
                    errCode: 2,
                    errMessage: 'Duplicate doctor schedule'
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const getDoctorScheduleService = async (doctorID, date) => {
    try {
        if (!doctorID || !date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        }

        let data = await db.Schedule.findAll({
            where: {
                doctorID: doctorID,
                [db.Sequelize.Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE', db.Sequelize.col('date')),
                        '=',
                        date.split('T')[0] // "2025-07-04"
                    )
                ]
            },
            include: [
                { model: db.Allcode, as: 'timeTypeData', attributes: ['value_EN', 'value_VN'] },
                { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] }
            ],
            raw: false,
            nest: true

        })
        let bookingInfor = await db.Booking.findAll({
            where: {
                doctorID: doctorID,
                [db.Sequelize.Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE', db.Sequelize.col('date')),
                        '=',
                        date.split('T')[0]
                    )
                ],
            },
            attributes: ['timeType', 'statusID', 'patientID'],
            raw: false
        })

        let bookingSlot = bookingInfor.map(item => item.timeType)

        let availableSchedule = data.filter(data => {
            return !bookingSlot.includes(data.timeType)
        })


        return {
            errCode: 0,
            data: availableSchedule
        }
    } catch (error) {
        console.log(error)
    }
}
const getDoctorBookingInforService = async (doctorID) => {
    try {
        if (!doctorID) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.Doctor_infor.findOne({
                where: { doctorId: doctorID },
                include: [
                    { model: db.Allcode, as: 'priceData', attributes: ['value_EN', 'value_VN'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value_EN', 'value_VN'] },
                    { model: db.Allcode, as: 'provinceData', attributes: ['value_EN', 'value_VN'] }
                ],
                raw: false,
                nest: true
            })
            return {
                errCode: 0,
                data: data
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const getProfileDoctorService = async (doctorID) => {
    try {
        if (!doctorID) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            let data = await db.User.findOne({
                where: { id: doctorID },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value_EN', 'value_VN'] },
                    {
                        model: db.Doctor_infor,
                        attributes: {
                            exclude: ['id', 'doctorId']
                        },
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['value_EN', 'value_VN'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value_EN', 'value_VN'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['value_EN', 'value_VN'] }
                        ]
                    }
                ],
                raw: false,
                nest: true
            })
            if (data && data.image) {
                data.image = Buffer.from(data.image, 'base64').toString('binary')
            }
            if (!data) data = {}
            return {
                errCode: 0,
                data: data
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const getListPatientBookingServices = async (doctorID, date) => {
    try {
        if (!doctorID || !date) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        }

        let data = await db.Booking.findAll({
            where: {
                doctorID: doctorID,
                statusID: 'S2',
                [db.Sequelize.Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE', db.Sequelize.col('date')),
                        '=',
                        date.split('T')[0] // "2025-07-04"
                    )
                ]
            },
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['email', 'firstName', 'lastName'],
                    include: [
                        { model: db.Allcode, as: 'genderData', attributes: ['value_EN', 'value_VN'] }
                    ]
                },
                { model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['value_EN', 'value_VN'] }
            ],
            raw: false,
            nest: true

        })

        return {
            errCode: 0,
            data: data
        }
    } catch (error) {
        console.log(error)
    }
}
const postSendRedemyServices = async (data) => {
    try {
        if (!data.doctorID || !data.email || !data.patientID || !data.timeType) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter'
            }
        } else {
            await db.Booking.update(
                {
                    statusID: 'S3'
                },
                {
                    where: {
                        doctorID: data.doctorID,
                        patientID: data.patientID,
                        timeType: data.timeType,
                        statusID: 'S2'
                    }
                }
            )
            await sendAttackment(data)
            return {
                errCode: 0,
                errMessage: 'Confirm success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    getTopDoctorServices,
    getAllDoctorService,
    saveInforDoctorService,
    getDetailDoctorService,
    postDoctorScheduleService,
    getDoctorScheduleService,
    getDoctorBookingInforService,
    getProfileDoctorService,
    getListPatientBookingServices,
    postSendRedemyServices
}