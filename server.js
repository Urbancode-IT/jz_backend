import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- MAIN ROUTE ----
app.post("/submit", async (req, res) => {
  try {
    const { name, email, course, phone } = req.body;

    const text = `
New Chatbot Enquiry
--------------------------------
Name   : ${name}
Email  : ${email}
Course : ${course}
Phone  : ${phone}
Time   : ${new Date().toLocaleString()}
    `;

    // Gmail Transporter (ONLY ONE)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIN_EMAIL,       // Your Gmail
        pass: process.env.MAIN_EMAIL_PASS   // App Password
      }
    });

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.MAIN_EMAIL,
      to: process.env.RECEIVER_EMAIL,       // Where you receive enquiries
      subject: "New Chatbot Enquiry",
      text
    });

    res.json({ success: true, message: "Details sent successfully!" });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("Chatbot Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
