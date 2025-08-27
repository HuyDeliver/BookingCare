const { searchBarServices } = require("../services/searchServices")

const searchBar = async (req, res) => {
    try {
        let data = await searchBarServices(req.query.searchKey)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    searchBar
}