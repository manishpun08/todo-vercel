import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "52547c367aba25",
    pass: "30ca596d377e93",
  },
});

export const sendEmailOTP = async (name, otp, email) => {
  try {
    const info = await transporter.sendMail({
      from: '"admin" <admin@gmail.com>', // sender address
      to: "bar@example.com, baz@example.com", // list of receivers
      subject: "Reset Password Otp", // Subject line
      html: `
   

      <h3>Reset Password OTP</h3>
      <p>Dear ${name},</p>
      <p>Your OTP is <span style="font-weight:bold;">${otp}</span>.</p>
      <p>If you did not request to change your password, you can ignore this message.</p>
    </div>
    `,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};
