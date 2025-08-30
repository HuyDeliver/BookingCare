
const db = require('../models/index')
require('dotenv').config()
const { sendSimpleEmail } = require("./emailService")
const { v4 } = require('uuid')
const uuidv4 = v4
const buildUrlEmail = (doctorID, token) => {
    let result = ''
    result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorID=${doctorID}`
    return result
}

const postBookingAppointmentService = async (data) => {
    try {
        console.log(data)
        if (!data.email || !data.doctorID || !data.timeType || !data.birthdayDate || !data.lastName || !data.firstName
            || !data.dateBooking || !data.phoneNumber || !data.address || !data.selectedGender || !data.reason) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters'
            };
        } else {
            let token = uuidv4()
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    firstName: data.firstName,
                    lastname: data.lastName,
                    email: data.email,
                    roleID: 'R3',
                    gender: data.selectedGender,
                    phoneNumber: data.phoneNumber,
                    address: data.address
                }
            })
            if (user && user[0]) {
                let existingBooking = await db.Booking.findOne({
                    where: {
                        patientID: user[0].id,
                        statusID: { [db.Sequelize.Op.ne]: 'S3' },
                        date: date.dateBooking
                    }
                })
                if (existingBooking) {
                    return {
                        errCode: 2,
                        errMessage: "You have an uncompleted appointment for the day"
                    }
                }
            }


            await db.Booking.create({
                statusID: 'S1',
                doctorID: data.doctorID,
                patientID: user[0].id,
                date: data.dateBooking,
                birthday: data.birthdayDate,
                timeType: data.timeType,
                reason: data.reason,
                token: token
            })
            await sendSimpleEmail({
                receiveEmail: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                time: data.timeString,
                doctorName: data.doctorName,
                redirectLink: buildUrlEmail(data.doctorID, token),
                language: data.language
            })
            return {
                errCode: 0,
                errMessage: 'Save infor success'
            }
        }
    } catch (error) {
        console.log(error)
    }
}
const postVerifyBookingAppointmentService = async (data) => {
    try {
        if (!data.token || !data.doctorID) {
            return {
                errCode: 1,
                errMessage: "Missing required parameters"
            }
        } else {
            let appointment = await db.Booking.findOne({
                where: {
                    doctorID: data.doctorID,
                    token: data.token,
                    statusID: 'S1'
                },
                raw: false
            })
            if (appointment) {
                appointment.statusID = 'S2'
                await appointment.save()
                return {
                    errCode: 0,
                    errMessage: "Update appointment succeed"
                }
            } else {
                return {
                    errCode: 2,
                    errMessage: "Appointment has been activated or does not exist"
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
    postBookingAppointmentService,
    postVerifyBookingAppointmentService,
}