import 'dotenv/config';
import nodemailer from 'nodemailer';

export const sendRecoveryMail = (newPass, clientMail) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'waiterorecoverypasstest@gmail.com',
            pass: process.env.GOOGLE_SEND_EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: 'waiterorecoverypasstest@gmail.com',
        to: clientMail,
        subject: 'Your password has been generated',
        text: 'Your new password for waitero client ' + clientMail + ' is: ' + newPass
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}