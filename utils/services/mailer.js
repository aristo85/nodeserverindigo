
const nodemailer = require('nodemailer');

const user = process.env.HOST_MAIL;
const pass = process.env.MAIL_PASS;
const service = process.env.MAIL_SERVICE;

const transport = nodemailer.createTransport({
    service: service,
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: user,
        pass: pass,
    },
});

exports.sendPasswordResetEmail = async (email, code) => {
    try {
        return transport
            .sendMail({
                from: user,
                to: email,
                subject: 'SuperWorld: password reset',
                html: `<h1>resetting your password</h1>
            <h2>SuperWorld: code for resetting your password:</h2>
            <p>${code}</p>
            </div>`,
            })
    } catch (error) {
        throw error
    }
};
