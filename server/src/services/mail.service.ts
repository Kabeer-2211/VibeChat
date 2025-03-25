import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const smtpConfig: SMTPTransport.Options = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(smtpConfig);

export async function Mail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> {
  await transporter.sendMail({
    from: "vibechat@gmail.com",
    to: to,
    subject: subject,
    text: text,
    html: html,
  });
}
