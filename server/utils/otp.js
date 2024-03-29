const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');

const generateOTP = () => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
};

const sendOTP = (email, OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // user: process.env.EMAIL_SERVICE_USER,
      // pass: process.env.EMAIL_SERVICE_PASS,
      user: "bamboo.cse042@gmail.com",
      pass: "exze ygnf wsom tnag",
    },
  });

  console.log(" ==> ", process.env.EMAIL_SERVICE_USER, " ==> ", process.env.EMAIL_SERVICE_PASS, "<==");

  const mailOptions = {
    // from: process.env.EMAIL_SERVICE_USER,
    from: "bamboo.cse042@gmail.com",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is: ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("error => ",error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("otp send call end here");
};

module.exports = { generateOTP, sendOTP };