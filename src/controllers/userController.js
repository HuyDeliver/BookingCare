import userServices from "../services/userServices.js"
module.exports = {
    handleLogin: async (req, res) => {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: 'Mising input parameter'
            })
        }

        let userData = await userServices.handleUserLogin(email, password)
        return res.status(200).json({
            errCode: userData.errorCode,
            message: userData.errorMessage,
            user: userData.user ? userData.user : []
        })
    },
    handleGetAllUsers: async (req, res) => {
        let id = req.query.id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter',
                user: []
            })
        }
        let user = await userServices.getAllUserService(id)
        return res.status(200).json({
            errCode: 0,
            errMessage: 'OK',
            user
        })


    }
}