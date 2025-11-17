import nodemailer from 'nodemailer';
import config from '../config/env.js';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.user,
      pass: config.email.pass
    },
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates
    }
  });
};

// Send confirmation email to user
export const sendUserConfirmationEmail = async (contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"NTCOG Kenya" <${config.email.user}>`,
      to: contact.email,
      subject: 'Thank You for Contacting NTCOG Kenya',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #1E4E9A; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #1E4E9A; padding: 30px 20px; text-align: center;">
            <img src="https://i.postimg.cc/Fzw0M9yc/FIDEL-CHURCH.png" alt="NTCOG Kenya Logo" style="width: 120px; height: auto; margin-bottom: 15px; background: white; padding: 10px; border-radius: 10px;" onerror="this.style.display='none'"/>
            <h1 style="color: white; margin: 0; font-size: 24px;">New Testament Church of God Kenya</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1E4E9A;">Thank You for Reaching Out!</h2>
            <p>Dear ${contact.fullName},</p>
            <p>We have received your message and appreciate you taking the time to contact us.</p>
            
            <div style="background-color: white; padding: 20px; border-left: 4px solid #E02020; margin: 20px 0;">
              <h3 style="color: #E02020; margin-top: 0;">Your Message Details:</h3>
              <p><strong>Subject:</strong> ${contact.subjectDisplay}</p>
              <p><strong>Message:</strong></p>
              <p style="color: #666;">${contact.message}</p>
            </div>
            
            <p>Our team will review your message and respond as soon as possible. If your inquiry is urgent, please feel free to call us at <strong>+254 759 120 222</strong>.</p>
            
            <p style="margin-top: 30px;">God bless you,<br>
            <strong>NTCOG Kenya Team</strong></p>
          </div>
          <div style="background-color: #1E4E9A; padding: 20px; text-align: center; color: white; font-size: 12px;">
            <img src="https://i.postimg.cc/Fzw0M9yc/FIDEL-CHURCH.png" alt="NTCOG Kenya" style="width: 80px; height: auto; margin-bottom: 10px; background: white; padding: 5px; border-radius: 5px;" onerror="this.style.display='none'"/>
            <p style="margin: 5px 0; font-weight: bold;">New Testament Church of God Kenya</p>
            <p style="margin: 5px 0;">P.O. Box 75, 00502 Karen, Nairobi, Kenya</p>
            <p style="margin: 5px 0;">Phone: +254 759 120 222</p>
            <p style="margin: 5px 0;">Email: info@ntcogk.org</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to user:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending confirmation email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send notification email to admin
export const sendAdminNotificationEmail = async (contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"NTCOG Contact Form" <${config.email.user}>`,
      to: config.email.adminEmail,
      subject: `New Contact Form Submission - ${contact.subjectDisplay}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #E02020; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #E02020; padding: 30px 20px; text-align: center;">
            <img src="https://i.postimg.cc/Fzw0M9yc/FIDEL-CHURCH.png" alt="NTCOG Kenya Logo" style="width: 120px; height: auto; margin-bottom: 15px; background: white; padding: 10px; border-radius: 10px;" onerror="this.style.display='none'"/>
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #1E4E9A;">Contact Details:</h2>
            
            <div style="background-color: white; padding: 20px; margin: 20px 0;">
              <p><strong>Name:</strong> ${contact.fullName}</p>
              <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
              ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
              <p><strong>Subject:</strong> ${contact.subjectDisplay}</p>
              <p><strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-left: 4px solid #1E4E9A; margin: 20px 0;">
              <h3 style="color: #1E4E9A; margin-top: 0;">Message:</h3>
              <p style="color: #333; white-space: pre-wrap;">${contact.message}</p>
            </div>
            
            <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; font-size: 12px;">
              <p><strong>IP Address:</strong> ${contact.ipAddress}</p>
              <p><strong>User Agent:</strong> ${contact.userAgent}</p>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending admin notification:', error.message);
    return { success: false, error: error.message };
  }
};

// Send custom email
export const sendCustomEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"NTCOG Kenya" <${config.email.user}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Custom email sent:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending custom email:', error.message);
    return { success: false, error: error.message };
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration verified successfully');
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    console.error('Email configuration verification failed:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  sendUserConfirmationEmail,
  sendAdminNotificationEmail,
  sendCustomEmail,
  verifyEmailConfig
};
