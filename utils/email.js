const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // i create a transporter (sevice to send the email ep. gmail, Mailtrap)
  // const transporter = nodemailer.createTransport({
  //     service: 'Gmail',
  //     auth: {
  //         user: process.env.EMAIL_USERNAME
  //         pass: process.env.EMAIL_PASSWORD
  //     }
  //     // activate in gmail 'less secure app' option

  // })
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // activate in gmail 'less secure app' option
  });
  // ii define email options
  const mailOptions = {
    from: "saulo assis <tokentestsauloaaadmin@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: stuff
  };
  // iii Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
