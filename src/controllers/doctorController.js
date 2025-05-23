import doctorService from '../services/doctorServices'

const getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit ? req.query.limit : 10
    try {
        let resonse = await doctorService.getTopDoctorServices(+limit)
        return res.status(200).json(resonse)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        })
    }
}

module.exports = {
    getTopDoctorHome
}