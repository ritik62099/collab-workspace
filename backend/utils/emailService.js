import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Tumhara Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (Not your regular password)
  },
});

export const sendInviteEmail = async (email, workspaceName, inviteLink) => {
  try {
    const mailOptions = {
      from: `"Collab Workspace" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You've been invited to join "${workspaceName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #0ea5e9;">You've been invited! 🎉</h2>
          <p>You have been invited to join the workspace <strong>${workspaceName}</strong>.</p>
          <p>Click the button below to create your account and automatically join the workspace:</p>
          <a href="${inviteLink}" style="display: inline-block; background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Join Workspace</a>
          <p style="color: #6b7280; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #0ea5e9; word-break: break-all;">${inviteLink}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Invite email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending invite email:', error);
    throw new Error('Failed to send invite email');
  }
};