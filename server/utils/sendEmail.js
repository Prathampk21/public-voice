const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailHost = process.env.MAIL_HOST;
    const mailPort = process.env.MAIL_PORT;
    const mailUser = process.env.MAIL_USER;
    const mailPass = process.env.MAIL_PASS;
    const mailFrom = process.env.MAIL_FROM || mailUser;

    if (!mailHost || !mailPort || !mailUser || !mailPass) {
      console.log("Email configuration missing. Email not sent.");
      return {
        success: false,
        message: "Email configuration missing"
      };
    }

    const transporter = nodemailer.createTransport({
      host: mailHost,
      port: Number(mailPort),
      secure: Number(mailPort) === 465,
      auth: {
        user: mailUser,
        pass: mailPass
      }
    });

    const info = await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      text,
      html
    });

    return {
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId
    };
  } catch (error) {
    console.error("Email send error:", error.message);

    return {
      success: false,
      message: error.message
    };
  }
};

module.exports = sendEmail;