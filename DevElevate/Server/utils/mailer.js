import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendWelcomeEmail = async (to,htmlContent) => {
  const mailOptions = {
    from: `"DevElevate Team" <${process.env.MAIL_USER}>`,
    to,
    subject: " 🎉 Welcome to DevElevate! ",
    html:htmlContent
  };

  await transporter.sendMail(mailOptions);
};

export default sendWelcomeEmail;
