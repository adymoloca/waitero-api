import 'dotenv/config';
import nodemailer from "nodemailer";

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            auth: {
                user: process.env.USER,
                pass: "585adfd9a987db819502aafba45d2abf-523596d9-ecc840d3"
            }
        });


        // let mailOptions = {
        //     from: fromEmailAddress, // <= should be verified and accepted by service provider. ex. 'youremail@gmail.com'
        //     to: toEmailAddress, // <= recepient email address. ex. 'friendemail@gmail.com'
        //     subject: emailSubject, // <= email subject ex. 'Test email'
        //     //text: emailData.text, // <= for plain text emails. ex. 'Hello world'
        //     html: htmlTemplate // <= for html templated emails
        // };
        
        // // send mail with defined transport object
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //     return console.log(error.message);
        //     }
        //     console.log('Message sent: %s', info.messageId);
        // });

        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text
        });

    } catch (error) {
        console.log(error, "email not sent");
    }
};

export default sendEmail;