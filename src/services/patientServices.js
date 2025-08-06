import { where } from "sequelize"
import db from "../models"
require('dotenv').config()
import EventEmitter from 'events'
import { emitter } from "../utils/emitter"

const postBookingAppointmentService = async (data) => {
    try {
        console.log(data)
        if (!data.email || !data.doctorID || !data.timeType || !data.birthdayDate) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameters'
            };
        } else {
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                default: {
                    email: data.email,
                    roleID: 'R3'
                }
            })
            if (user && user[0]) {
                await db.Booking.create({
                    statusID: 'S1',
                    doctorID: data.doctorID,
                    patientID: user[0].id,
                    date: new Date(),
                    birthday: data.birthdayDate,
                    timeType: data.timeType
                })
            }

            emitter.emit('available', {
                doctorID: data.doctorID,
                date: new Date(),
                timeType: data.timeType
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

module.exports = {
    postBookingAppointmentService
}