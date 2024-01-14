const nodemailer = require('nodemailer');
async function sendEmailSurvey(surveyData, email) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_email_password', 
            },
        });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'NPS Survey',
            text: `Dear customer, ${surveyData.question}`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email survey sent to ${email}: "${surveyData.question}"`);
        return result;
    } catch (error) {
        console.error('Error sending email survey:', error);
        throw error;
    }
}
