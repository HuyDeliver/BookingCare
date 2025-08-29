const db = require('../models/index')
const { createNewUser, getAllUser, getOneUser, updateUser, deleteUser } = require("../services/CRUD-services.js")
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
    await createNewUser(req.body)
    return res.redirect('/getCRUD')
}

const displayCRUDPage = async (req, res) => {
    let getUser = await getAllUser()
    return res.render('displayCRUD.ejs', { data: getUser })
}

const getUpdatePage = async (req, res) => {
    let User = req.params.id
    if (User) {
        let updateUser = await getOneUser(User)
        return res.render('updateUser.ejs', { data: updateUser })
    } else {
        return res.send('cannot find user')
    }
}

const postUpdatePage = async (req, res) => {
    await updateUser(req.body)
    res.redirect('/getCRUD')
}

const getDeletePage = async (req, res) => {
    await deleteUser(req.params.id)
    res.redirect('/getCRUD')
}

module.exports = {
    getHomePage,
    getCRUDPage,
    PostCRUDPage,
    displayCRUDPage,
    getUpdatePage,
    postUpdatePage,
    getDeletePage
}