require('dotenv').config();
const nodemailer = require("nodemailer");

// Khởi tạo transporter dùng App Password
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_APP,
        pass: process.env.EMAIL_APP_PASS,
    },
});


const sendSimpleEmail = async (dataSend) => {
    try {
        const info = transporter.sendMail({
            from: `"Booking Clinic" <${process.env.EMAIL_APP}>`,
            to: dataSend.receiveEmail,
            subject: "Thông tin đặt lịch khám bệnh",
            html: getBodyEmail(dataSend)
        });

        console.log("✅ Email sent:", info.messageId);
    } catch (err) {
        console.error("❌ Lỗi gửi email:", err);
    }
};
let getBodyEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
            <h3>Xin chào ${dataSend.lastName} ${dataSend.firstName}</h3>
            <p>Bạn đã nhận được email này vì đã đặt lịch khám bệnh tại Bookingcare </p>
            <p>Thông tin đặt lịch khám bệnh: </p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin trên là đúng sự thật vui lòng clik vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh</p>
            <div><a href=${dataSend.redirectLink} target="_blank">Ấn vào đây</a></div>
            <div>Xin chân thành cảm ơn</div>
        `
    } else if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear, ${dataSend.firstName} ${dataSend.lastName}</h3>
            <p>You have received this email because you have scheduled a medical appointment at Bookingcare. </p>
            <p>Information to schedule an appointment: </p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to complete the appointment scheduling procedure.</p>
            <div><a href=${dataSend.redirectLink} target="_blank">Click here</a></div>
            <div>Thank you sincerely</div>
        `
    }
    return result
}

let sendAttackment = async (dataSend) => {
    try {
        const info = transporter.sendMail({
            from: `"Booking Clinic" <${process.env.EMAIL_APP}>`,
            to: dataSend.email,
            subject: "Kết quả đặt lịch khám bệnh",
            html: getBodyRedemyEmail(dataSend),
            attachments: [
                {
                    filename: 'donthuoc.png',
                    content: dataSend.image.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        });

        console.log("✅ Email sent:", info.messageId);
    } catch (err) {
        console.error("❌ Lỗi gửi email:", err);
    }
}
let getBodyRedemyEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
            <h3>Xin chào ${dataSend.lastName} ${dataSend.firstName}</h3>
            <p>Bạn đã nhận được email này vì đã đặt lịch khám bệnh tại Bookingcare </p>
            <p>Thông tin đơn thuốc và hóa đơn được gửi trong file đính kèm: </p>
            <div>Xin chân thành cảm ơn</div>
        `
    } else if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear, ${dataSend.firstName} ${dataSend.lastName}</h3>
            <p>You have received this email because you have scheduled a medical appointment at Bookingcare. </p>
            <p>The prescription information and invoice are attached in the file.: </p>
            <div>Thank you sincerely</div>
        `
    }
    return result
}
module.exports = {
    sendSimpleEmail,
    sendAttackment
};
