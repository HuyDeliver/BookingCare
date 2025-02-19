import db from "../models/index.js"
import CRUDService from "../services/CRUD-services.js"
const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('home.ejs', { user: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

const getCRUDPage = async (req, res) => {
    return res.render('crud.ejs')
}

const PostCRUDPage = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    console.log(message)
    return res.send('đăng kí thành công')
}

module.exports = {
    getHomePage,
    getCRUDPage,
    PostCRUDPage
}