import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const RECIPIENT_EMAIL_ADDRESS = process.env.RECIPIENT_EMAIL_ADDRESS;
const RECIPIENT_EMAIL_PASSWORD = process.env.RECIPIENT_EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: RECIPIENT_EMAIL_ADDRESS,
    pass: RECIPIENT_EMAIL_PASSWORD,
  },
});

export const sendEmailForOtp = async (to: string, otp: string) => {
  const mailOptions = {
    from: 'noreplycrm@gmail.com',
    to,
    subject: `Your OTP from CRM Company`,
    text: `Your OTP is ${otp}. This OTP has been sent by CRM Company and is valid for the next 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);

    return true;
  } catch {
    return false;
  }
};

export const sendEmailForInvitation = async (to: string, url: string) => {
  const mailOptions = {
    from: 'noreplycrm@gmail.com',
    to,
    subject: `You have invited to the crm `,
    text: `To login in the crm click on the link ${url} `,
  };

  try {
    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
