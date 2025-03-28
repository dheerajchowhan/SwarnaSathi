const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log(options);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.data.content
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;