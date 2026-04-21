const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (this.transporter) return this.transporter;

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      throw new Error(
        'SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in backend .env'
      );
    }

    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    return this.transporter;
  }

  async sendOtpEmail(email, otp, purpose) {
    const transporter = this.getTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const subject =
      purpose === 'register'
        ? 'Verify your account - Hall Management'
        : 'Reset password OTP - Hall Management';

    const actionText =
      purpose === 'register'
        ? 'complete your registration'
        : 'reset your password';

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `Your OTP is ${otp}. It is valid for 10 minutes. Use this to ${actionText}.`,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hall Management OTP</h2>
        <p>Use the OTP below to ${actionText}:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px;">${otp}</p>
        <p>This OTP will expire in 10 minutes.</p>
      </div>`,
    });
  }
}

module.exports = new EmailService();
