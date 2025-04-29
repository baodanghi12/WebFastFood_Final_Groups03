import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "qbao1947@gmail.com",         // Gmail của bạn
    pass: "kaix tdfb zgkw ekwv",        // App Password (16 chữ số)
  },
});

export default transporter;
