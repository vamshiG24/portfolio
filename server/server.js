import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error("❌ MongoDB Error:", err));

// // Schema & Model with only name and email
// const ContactSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   date: { type: Date, default: Date.now },
// });
// const Contact = mongoose.model("Contact", ContactSchema);

// AI Chat Route
app.post("/api/chat", async (req, res) => {
  console.log("🔔 /api/chat called");
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "Messages array is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const SYSTEM_PROMPT = `You are ARIA (Artificial Reasoning & Intelligence Assistant), the personal AI assistant of Vamshi Gowni. You live inside Vamshi's interactive portfolio.

ABOUT VAMSHI:
- Full Name: Vamshi Gowni
- GitHub: github.com/vamshiG24
- LinkedIn: linkedin.com/in/vamshi-gowni-8bba28322
- Role: Full Stack MERN Developer & AI/ML Enthusiast
- Availability: Actively looking for Full Stack Developer or AI/ML Engineer opportunities.

PROJECTS:
1. BioSecure Access System – Multimodal biometric authentication (Voice + Face) combining voice verification (ECAPA-TDNN) and face recognition (DeepFace). Stack: Flask, React, Python, Deep Learning.
2. Secure Digital Evidence Management System – MERN stack platform for managing digital evidence with role-based access, case logging, and evidence integrity hashing (SHA-256). Stack: MongoDB, Express, React, Node.js.
3. EEG Seizure Detection Web App – Medical AI application using CNNs to predict epileptic seizures from EEG signals, featuring a Flask REST API for inference. Stack: Flask, TensorFlow, Keras, React.

SKILLS: React, Node.js, MongoDB, Express.js, Python, TensorFlow, Keras, JavaScript, Git, Tailwind CSS, Pandas, NumPy, SQL, Flask, Deep Learning, Computer Vision.

TIMELINE:
- 2023: Mastered C/C++, Data Structures & Algorithms, and core frontend web development.
- 2024: Built full-stack applications and mastered the MERN stack.
- 2025: Transitioned into AI, Machine Learning, and Deep Learning research projects.

PERSONALITY & GUIDELINES:
- Be friendly, professional, and enthusiastic.
- Keep responses relatively brief and easy to read.
- Use emojis occasionally.
- VERY IMPORTANT: Only talk about Vamshi Gowni. If asked about unrelated topics, politely pivot back to Vamshi's portfolio, skills, or projects. For example: "I am only programmed to talk about Vamshi and his work. Feel free to ask me about his project BioSecure or his skills!"`;

    // Filter out the initial assistant greeting if it starts the history to satisfy Gemini's requirement
    let historyMessages = messages;
    if (historyMessages.length > 0 && historyMessages[0].role === 'assistant') {
      historyMessages = historyMessages.slice(1);
    }

    // Map client messages ('user' / 'assistant') to Gemini format ('user' / 'model')
    const geminiHistory = historyMessages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const latestMessage = historyMessages[historyMessages.length - 1].content;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: geminiHistory
    });

    const result = await chat.sendMessage(latestMessage);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ success: true, reply: text });
  } catch (err) {
    console.error("❌ Gemini Chat Error:", err);
    res.status(500).json({ success: false, message: "Failed to generate AI response" });
  }
});

// API Route
app.post("/send-email", async (req, res) => {
  console.log("🔔 /send-email called");
  console.log("Request body:", req.body);

  const { name, email, subject, message } = req.body;

  if (!name || !email) {
    console.log("❌ Missing name or email");
    return res.status(400).json({ success: false, message: "Name and Email are required" });
  }

  try {
    // Check if this contact already exists (same name & email)
    // const existing = await Contact.findOne({ name, email });

    // if (existing) {
    //   console.log("⚠️ Duplicate contact detected, skipping DB save.");
    // } else {
    //   console.log("💾 Saving contact to DB...");
    //   const newContact = new Contact({ name, email });
    //   await newContact.save();
    //   console.log("✅ Contact saved:", newContact);
    // }

    // Email Transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("📧 Sending email to owner...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      text: `📩 New contact message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    });
    console.log("✅ Email sent to owner");

    console.log("📧 Sending auto-reply to sender...");
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for reaching out!",
      text: `Hi ${name},

Thanks for getting in touch with me! I’ve received your message and will review it shortly.
You can expect a reply within the next 24–48 hours.

If it’s urgent, feel free to reach out to me directly at ${process.env.EMAIL_USER}.

Best regards,
Vamshi Gowni
`,
    });
    console.log("✅ Auto-reply sent to sender");

    res.status(200).json({ success: true, message: "Email sent & saved to DB!" });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ success: false, message: "Error sending email or saving to DB" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});