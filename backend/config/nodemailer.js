import nodemailer from 'nodemailer';


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export  const sendOTPEmail = async(to, code)=> {
const info = await transporter.sendMail({
from: process.env.SENDER_EMAIL,
to,
subject: 'Your OTP Code',
text: `Your OTP code is ${code}. It expires in 10 minutes.`,
html: `<p>Your OTP code is <b>${code}</b>. It expires in 10 minutes.</p>`
});
console.log('Mail sent', info.messageId);
}




