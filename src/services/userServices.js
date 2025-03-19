import { raw } from "body-parser";
import db from "../models";
import Bcrypt from "bcrypt";

const salt = Bcrypt.genSaltSync(10);

const handleUserLogin = async (email, password) => {
    let userData = {}; // Khởi tạo userData mặc định

    try {
        let isExist = await checkUserEmail(email);
        if (isExist) {
            let user = await db.User.findOne({
                attributes: ['email', 'roleID', 'password'],
                where: { email: email },
                raw: true
            });
            if (user) {
                if (!user.password) {
                    userData.errorCode = 4;
                    userData.errorMessage = "User password is missing in database";
                } else {
                    // So sánh password
                    let check = Bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errorCode = 0;
                        userData.errorMessage = "OK";
                        delete user.password
                        userData.user = user;
                    } else {
                        userData.errorCode = 3;
                        userData.errorMessage = "Wrong password";
                    }
                }
            } else {
                userData.errorCode = 2;
                userData.errorMessage = "User is not found";
            }
        } else {
            userData.errorCode = 1;
            userData.errorMessage = "Your email doesn't exist";
        }
    } catch (error) {
        console.log("Error in handleUserLogin:", error);
    }

    return userData; // Luôn trả về userData, kể cả khi có lỗi
};

const checkUserEmail = async (userEmail) => {
    try {
        let user = await db.User.findOne({
            where: { email: userEmail },
        });
        return user !== null; // Trả về user nếu tồn tại, hoặc null nếu không
    } catch (error) {
        console.log("Error in checkUserEmail:", error);
        return null;
    }
};

const getAllUserService = async (id) => {
    try {
        let user = ''
        if (id === 'All') {
            user = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                },
            })
        }
        if (id && id != 'All') {
            user = await db.User.findOne({
                attributes: {
                    exclude: ['password']
                },
                where: { id: id },
            })
        }
        return user
    } catch (error) {
        console.log(error)
    }
}

const createNewUser = async (data) => {
    try {
        //Check email có exist hay không
        let check = await checkUserEmail(data.email)
        if (check === true) {
            return {
                errCode: 1,
                errMessage: 'Email already exist'
            }
        }
        let hashPasswordfromBcrypt = hashPassword(data.password);
        // Tạo người dùng mới trong cơ sở dữ liệu
        await db.User.create({
            email: data.email,
            password: hashPasswordfromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            gender: data.gender == 1 ? true : false,
            roleID: data.roleID,
            phoneNumber: data.phoneNumber,
        })

        return {
            errCode: 0,
            errMessage: 'OK'
        };
    } catch (error) {
        console.log(error)
    }
}
const hashPassword = (password) => {
    try {
        return Bcrypt.hashSync(password, salt); // Hash đồng bộ
    } catch (e) {
        console.error("Error in hashing password:", e);
        throw e; // Ném lỗi nếu có vấn đề khi hash mật khẩu
    }
};

const DeleteUser = async (userID) => {
    try {
        let user = await db.User.findOne({
            where: { id: userID },
        })
        if (!user) {
            return {
                errCode: 1,
                errMessage: 'The user is not exist'
            }
        }
        await db.User.destroy({
            where: { id: userID },
        })
        return {
            errCode: 0,
            errMessage: 'The user is delteted'
        }
    } catch (error) {
        console.error("Error in deleting user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}

const UpdateUser = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id },
        })
        if (!user) {
            return {
                errCode: 2,
                errMessage: 'The user is not exist'
            }
        }
        await db.User.update(
            {
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
            },
            {
                where: { id: data.id }
            }
        )
        return {
            errCode: 0,
            errMessage: 'The user is updated'
        }
    } catch (error) {
        console.error("Error in Update user:", error);
        throw error; // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
    }
}

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUserService,
    createNewUser,
    DeleteUser,
    UpdateUser
};