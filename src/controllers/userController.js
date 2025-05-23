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
    },
    handleCreateNewUser: async (req, res) => {
        let message = await userServices.createNewUser(req.body)
        return res.status(200).json(message)
    },
    handleEditUser: async (req, res) => {
        let user = await userServices.UpdateUser(req.body)
        return res.status(200).json(user)
    },
    handleDeleteUser: async (req, res) => {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter'
            })
        }
        let message = await userServices.DeleteUser(req.body.id)
        return res.status(200).json(message)
    },
    handleUpdateUser: async (req, res) => {
        let data = req.body
        if (!data.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter'
            })
        }
        let message = await userServices.UpdateUser(data)
        return res.status(200).json(message)
    },
    getAllCode: async (req, res) => {
        try {
            let data = await userServices.getAllCodeService(req.query.type)
            return res.status(200).json(data)
        } catch (e) {
            console.log('get all code: ', e)
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            })
        }
    }
}