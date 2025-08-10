import patientServices from '../services/patientServices'
const postBookingAppointment = async (req, res) => {
    try {
        let info = await patientServices.postBookingAppointmentService(req.body)
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}
const postVerifyBookingAppointment = async (req, res) => {
    try {
        let info = await patientServices.postVerifyBookingAppointmentService(req.body)
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
    postBookingAppointment,
    postVerifyBookingAppointment
}