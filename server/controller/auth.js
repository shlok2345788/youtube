import users from "../models/user.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const otps = new Map(); // Store OTPs temporarily in memory

const southStates = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana"
];

const sendEmailOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "dummy_password",
      },
    });

    const mailOptions = {
      from: '"YouTube Clone" <no-reply@youtubeclone.com>',
      to: email,
      subject: "Your Login OTP",
      html: `<h2>Your OTP for login is: ${otp}</h2>`,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log("OTP email sent to", email);
    } else {
      console.log("Mock OTP email for", email, ": ", otp);
    }
    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
};

const normalizePhone = (phone) => {
  if (!phone) return null;
  const raw = String(phone).trim();
  // Very small normalization: allow +91XXXXXXXXXX or 10-digit Indian numbers.
  if (raw.startsWith("+")) return raw;
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return raw; // fallback (Twilio may reject if invalid)
};

const sendSmsOTP = async (toPhone, otp) => {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    console.log(`[SMS MOCK] Sending OTP ${otp} to ${toPhone}`);
    return { ok: true, mock: true };
  }

  try {
    const body = new URLSearchParams({
      To: toPhone,
      From: from,
      Body: `Your OTP for login is: ${otp}`,
    });

    const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("Twilio SMS failed:", resp.status, errText);
      return { ok: false, error: "Failed to send SMS" };
    }

    return { ok: true, mock: false };
  } catch (e) {
    console.error("Failed to send SMS OTP:", e);
    return { ok: false, error: "Failed to send SMS" };
  }
};

export const login = async (req, res) => {
    // This is now the final login after verification
    const { name, username, email, image, phone } = req.body;
    const userName = username || name;
    
    try {
      const existingUser = await users.findOne({ email });
      if (!existingUser) {
          const newUser = await users.create({ 
            username: userName, 
            name: userName,
            email, 
            image,
            phone: phone || null,
          });
          return res.status(200).json({ result: newUser });
      } else {
          // Persist phone if provided later (e.g. non-south OTP flow).
          if (phone && !existingUser.phone) {
            existingUser.phone = phone;
            await existingUser.save();
          }
          return res.status(200).json({ result: existingUser });
      }
    } catch (err) {
      console.error(`Error in login: ${err.message}`);
      res.status(500).json({ message: "Error occurred", error: err.message });
    }
};

export const initiateLogin = async (req, res) => {
  const { email, location, phone } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps.set(email, otp);

  const isSouth = southStates.some(state => location?.toLowerCase().includes(state.toLowerCase()));

  if (isSouth) {
    const success = await sendEmailOTP(email, otp);
    if (success) {
      res.status(200).json({ message: "OTP sent via email", method: "email" });
    } else {
      res.status(500).json({ message: "Failed to send OTP email" });
    }
  } else {
    const toPhone = normalizePhone(phone);
    if (!toPhone) {
      return res.status(400).json({ message: "Mobile number is required for OTP (non-south login).", method: "mobile" });
    }

    const smsRes = await sendSmsOTP(toPhone, otp);
    if (!smsRes.ok) {
      return res.status(500).json({ message: smsRes.error || "Failed to send OTP via mobile", method: "mobile" });
    }

    const payload = { message: "OTP sent via mobile", method: "mobile" };
    if (smsRes.mock) {
      payload.otp_mock = otp;
    }
    return res.status(200).json(payload);
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (otps.get(email) === otp) {
    otps.delete(email);
    res.status(200).json({ message: "OTP verified" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};

export const createChannel = async (req, res) => {
  const { userId, channelName } = req.body;

  if (!userId || !channelName) {
    return res.status(400).json({ message: "UserId and Channel Name are required" });
  }

  try {
    const updatedUser = await users.findByIdAndUpdate(
      userId,
      { channelname: channelName },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ result: updatedUser });
  } catch (err) {
    console.error(`Error creating channel: ${err.message}`);
    res.status(500).json({ message: "Error occurred while creating channel", error: err.message });
  }
};
