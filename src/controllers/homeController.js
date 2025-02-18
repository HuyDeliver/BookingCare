import db from "../models"
const getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll()
        return res.render('home.ejs', { user: JSON.stringify(data) })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getHomePage
}