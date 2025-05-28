import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface MailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const transporter: Transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  service: SMTP_SERVICE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendMail = async (option: MailOptions): Promise<void> => {
  const { email, subject, template, data } = option;
  const templatePath = path.join(__dirname, "../mails", template);

  const html = await ejs.renderFile(templatePath, data);

  const MailOptions = {
    from: SMTP_USER,
    to: email,
    subject: subject,
    html: html,
  };

  await transporter.sendMail(MailOptions);
};

export default sendMail;