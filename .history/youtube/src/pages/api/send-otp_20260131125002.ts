import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

interface OTPResult {
  success: boolean;
  messageId?: string;
  error?: string;
  message?: string;
}

// Mock function for sending SMS (in real implementation, use SMS service provider)
const sendSMS = async (
  phoneNumber: string,
  otp: string
): Promise<OTPResult> => {
  // This is a mock implementation
  // In production, integrate with services like Twilio, AWS SNS, etc.
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  
  // Check if SMS service is configured
  if (!process.env.SMS_SERVICE_API_KEY) {
    console.warn('SMS service not configured - OTP will be logged to console only');
    return { 
      success: false, 
      error: 'SMS service not configured. OTP sent to console only.',
      message: 'SMS service not configured' 
    };
  }
  
  // In real implementation, call actual SMS service
  try {
    // const response = await fetch('SMS_SERVICE_ENDPOINT', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phoneNumber, otp })
    // });
    // return response.ok ? { success: true, message: 'SMS sent successfully' } : { success: false, error: 'SMS service failed' };
    
    // For now, return success but warn
    return { success: true, message: 'SMS sent successfully (mock)' };
  } catch (error) {
    return { success: false, error: 'SMS service error' };
  }
};

// Function to send email OTP
const sendEmailOTP = async (email: string, otp: string): Promise<OTPResult> => {
  // Check if email service is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email service not configured - OTP will be logged to console only');
    return { 
      success: false, 
      error: 'Email service not configured. Contact admin to set up email credentials.',
      message: 'Email service not configured' 
    };
  }
  
  try {
    // Configure your email service here
    // For Gmail, you'll need to enable "Less secure app access" or use App Passwords
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification - Your YouTube App",
      text: `Your OTP for login is: ${otp}

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OTP Verification</h2>
          <p>Hello,</p>
          <p>Your OTP for login is:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">This is an automated message from your YouTube App</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, phoneNumber, location } = req.body;

    if (!email && !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if user is from South Indian states
    const southIndianStates = [
      "Tamil Nadu",
      "Tamilnadu",
      "TN",
      "Kerala",
      "KL",
      "Karnataka",
      "KA",
      "Andhra Pradesh",
      "Andhra",
      "AP",
      "Telangana",
      "TS",
    ];

    const isSouthIndian = southIndianStates.some((state) =>
      location?.toLowerCase().includes(state.toLowerCase())
    );

    let result;

    if (isSouthIndian) {
      // Send OTP via email for South Indian users
      if (!email) {
        return res
          .status(400)
          .json({ message: "Email is required for South Indian users" });
      }
      result = await sendEmailOTP(email, otp);
    } else {
      // Send OTP via SMS for other users
      if (!phoneNumber) {
        return res.status(400).json({
          message: "Phone number is required for non-South Indian users",
        });
      }
      result = await sendSMS(phoneNumber, otp);
    }

    if (result.success) {
      // Store OTP in session/database (implement based on your auth system)
      // For now, we'll just return success
      return res.status(200).json({
        message: "OTP sent successfully",
        method: isSouthIndian ? "email" : "sms",
        otp: otp, // In production, don't send OTP in response - store it securely
      });
    } else {
      return res.status(500).json({
        message: "Failed to send OTP",
        error: result.error || "Unknown error",
      });
    }
  } catch (error) {
    console.error("OTP API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
