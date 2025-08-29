
const db = require('../models/index.js')
const Bcrypt = require('bcrypt')

const salt = Bcrypt.genSaltSync(10);

const createNewUser = async (data) => {
    try {
        // Mã hóa mật khẩu
        const hashPasswordfromBcrypt = hashPassword(data.password);

        // Tạo người dùng mới trong cơ sở dữ liệu
        await db.User.create({
            email: data.email,
            password: hashPasswordfromBcrypt,
            firstName: data.firstname,
            lastName: data.lastname,
            address: data.address,
            gender: data.gender == 1 ? true : false,
            roleID: data.roleID,
            phoneNumber: data.phonenumber,
        })

        return 'Create new user success';
    } catch (error) {
        console.error("Error in creating user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
};

const hashPassword = (password) => {
    try {
        return Bcrypt.hashSync(password, salt); // Hash đồng bộ
    } catch (e) {
        console.error("Error in hashing password:", e);
        throw e; // Ném lỗi nếu có vấn đề khi hash mật khẩu
    }
};

const getAllUser = async () => {
    try {
        let users = await db.User.findAll({
            raw: true,
        })
        return users
    } catch (error) {
        console.error("Error in creating user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}

const getOneUser = async (data) => {
    try {

        let getUser = await db.User.findOne({
            where: { id: data },
            raw: true
        })
        return getUser

    } catch (error) {
        console.error("Error in creating user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}

const updateUser = async (data) => {
    try {
        let postUpdate = await db.User.update(
            {
                email: data.email,
                password: data.password,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                gender: data.gender == 1 ? true : false,
                roleID: data.roleID,
                phoneNumber: data.phonenumber,
            },
            {
                where: { id: data.id }
            }
        )
        return postUpdate
    } catch (error) {
        console.error("Error in creating user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}

const deleteUser = async (data) => {
    try {
        let postDelete = await db.User.destroy({
            where: { id: data }
        })
        return postDelete
    } catch (error) {
        console.error("Error in creating user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}
module.exports = {
    createNewUser,
    getAllUser,
    getOneUser,
    updateUser,
    deleteUser
};
