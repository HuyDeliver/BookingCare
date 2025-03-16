import { raw } from "body-parser";
import db from "../models";
import Bcrypt from "bcrypt";

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
                console.log(">>>checck pas", user.password)
                console.log(">>>check pas 2: ", password)
                // Kiểm tra password có tồn tại không trước khi so sánh
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
        userData.errorCode = 500; // Mã lỗi server
        userData.errorMessage = "Internal server error";
    }

    return userData; // Luôn trả về userData, kể cả khi có lỗi
};

const checkUserEmail = async (userEmail) => {
    try {
        let user = await db.User.findOne({
            where: { email: userEmail },
        });
        return user; // Trả về user nếu tồn tại, hoặc null nếu không
    } catch (error) {
        console.log("Error in checkUserEmail:", error);
        return null;
    }
};

module.exports = {
    handleUserLogin,
    checkUserEmail,
};