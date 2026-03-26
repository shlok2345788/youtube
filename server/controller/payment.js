import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "secret_placeholder",
});

const sendInvoiceEmail = async (email, username, plan) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "dummy_password",
      },
    });

    const amount = plan === 'bronze' ? 10 : plan === 'silver' ? 50 : 100;

    const mailOptions = {
      from: '"YouTube Clone" <no-reply@youtubeclone.com>',
      to: email,
      subject: `Your ${plan.toUpperCase()} Subscription Invoice`,
      html: `
        <h2>Thank you for upgrading, ${username || 'User'}!</h2>
        <p>You have successfully subscribed to the <b>${plan.toUpperCase()}</b> plan.</p>
        <p>Amount Paid: <b>₹${amount}</b></p>
        <p>Enjoy your new perks and limits!</p>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log("Invoice email sent to", email);
    } else {
        console.log("Mock Invoice email generated for", email, ":", mailOptions.subject);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    let amountToPay = 0;
    if (plan === 'bronze') amountToPay = 1000; // 10 Rs
    else if (plan === 'silver') amountToPay = 5000; // 50 Rs
    else if (plan === 'gold') amountToPay = 10000; // 100 Rs
    else return res.status(400).json({ message: "Invalid plan" });
    // Check if keys are placeholders (Test Mode)
    if (
      process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder" ||
      !process.env.RAZORPAY_KEY_ID
    ) {
      return res.json({
        id: `order_mock_${Date.now()}`,
        currency: "INR",
        amount: amountToPay,
        status: "created",
      });
    }

    const options = {
      amount: amountToPay, // Amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, plan } = req.body;

    const finalizePayment = async () => {
      const u = await User.findByIdAndUpdate(userId, { isPremium: true, plan: plan }, { new: true });
      if (u && u.email) {
          await sendInvoiceEmail(u.email, u.username, plan);
      }
      return u;
    };

    // Mock Verification Check
    if (razorpay_order_id.startsWith("order_mock_")) {
      const updatedUser = await finalizePayment();
      return res.json({ message: "Mock Payment verified successfully", user: updatedUser });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "secret_placeholder")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment successful, update user status
      const updatedUser = await finalizePayment();
      res.json({ message: "Payment verified successfully", user: updatedUser });
    } else {
      res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
