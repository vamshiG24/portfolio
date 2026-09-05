import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({ status: "online", service: "IVY AI Backend", version: "1.0.0" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "online", service: "IVY AI Backend", keyConfigured: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Chat Route
app.post("/api/chat", async (req, res) => {
  console.log("🔔 /api/chat called");
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, message: "Messages array is required" });
  }

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured on the server." });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const SYSTEM_PROMPT = `You are IVY (Intelligent Virtual Yielding Assistant), the personal AI assistant of Gowni Vamshi (Vamshi Gowni). You live inside Vamshi's interactive portfolio.

ABOUT VAMSHI:
- Full Name: Gowni Vamshi
- Location: Bengaluru, India
- Phone: +91 6301675616
- Email: vamshigowniv26@gmail.com
- GitHub: https://github.com/vamshiG24
- LinkedIn: https://www.linkedin.com/in/vamshi-gowni-8bba28322
- Portfolio: https://portfolio-seven-chi-z8v6hmlert.vercel.app/
- Summary: Computer Science undergraduate with expertise in MERN Stack development, AI/ML, and Data Structures & Algorithms. Research Intern at IIT Madras working on LLM watermarking using Pseudorandom Codes, with a strong interest in scalable backend systems and AI-powered applications.

EDUCATION & EXPERIENCE:
1. Research Intern at Indian Institute of Technology Madras (May 2026 – Jul 2026, Chennai, India)
   - Research Title: Study of LLM Watermarking via Pseudorandom Codes.
   - Conducted research on Large Language Model (LLM) watermarking using Pseudorandom Codes (PRCs), focusing on secure and robust text watermarking techniques.
   - Studied Reed–Solomon and Folded Reed–Solomon codes, list recovery algorithms, and cryptographic security proofs involving soundness, undetectability, and adaptive robustness.
2. Indian Institute of Technology Madras (2026 – 2027)
   - B.Tech Final Year Exchange Program (MoU) in Computer Science & Engineering.
3. Indian Institute of Information Technology Manipur (2023 – 2027)
   - B.Tech in Computer Science and Engineering (AI & Data Science) — CPI: 8.10.
4. Sri Chaitanya Junior College, Vijayawada (2021 – 2023)
   - Intermediate (Class XII) — Percentage: 97%.

KEY PROJECTS:
1. BioSecure (Multi-Modal Biometric Authentication):
   - Technologies: React, Node.js, Flask, MongoDB, Deep Learning
   - GitHub: https://github.com/vamshiG24/BioSecure-Access
   - Details: Multi-modal biometric authentication system using voice, face, and hand geometry recognition with ECAPA-TDNN, VGG-Face, and ORB + BFMatcher. Built a full-stack React, Node.js, Flask, and MongoDB solution with hybrid RBAC + ABAC access control and audio preprocessing.
2. Secure Digital Evidence (Tamper-Proof Platform):
   - Technologies: React, Node.js, MongoDB, Docker, Socket.IO, Gemini AI
   - GitHub: https://github.com/vamshiG24/secure-digital-evidence
   - Live: https://secure-digital-evidence.vercel.app
   - Details: Built a secure digital evidence platform using MERN microservices architecture. Implemented SHA-256 hashing for tamper detection and chain-of-custody audit logging; integrated a multimodal RAG pipeline using Gemini 2.5 Flash for AI-powered evidence Q&A and forensic report synthesis. Integrated Socket.IO for real-time notifications and containerized services with Docker and Nginx as a reverse proxy for scalable deployment.

TECHNICAL SKILLS:
- Programming Languages: Python, C++, JavaScript
- Web Technologies: React.js, Node.js, Express.js, MongoDB, Tailwind CSS
- Backend & Architecture: REST APIs, Microservices, Authentication, RBAC, ABAC
- DevOps & Infrastructure: Docker, Redis, Nginx, Git
- AI/ML: Machine Learning, Deep Learning, TensorFlow, Keras, Generative AI
- AI Tools: ChatGPT, Claude, AntiGravity, Prompt Engineering
- Soft Skills: Problem Solving, Teamwork, Fast Learner

ACHIEVEMENTS & CERTIFICATIONS:
- GATE Qualified (Graduate Aptitude Test in Engineering) in Computer Science & Engineering.
- Research Internship Certificate — Indian Institute of Technology Madras.
- Python Certification — Spoken Tutorial, IIT Bombay.
- C++ Certification — Spoken Tutorial, IIT Bombay.

PERSONALITY & GUIDELINES:
- Be friendly, professional, and enthusiastic.
- Keep responses relatively brief, clear, and easy to read.
- Use emojis occasionally.
- VERY IMPORTANT: Only talk about Vamshi Gowni. If asked about unrelated topics, politely pivot back to Vamshi's portfolio, skills, or projects.`;

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

    const candidateModels = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
    let text = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT
        });

        const chat = model.startChat({
          history: geminiHistory
        });

        const result = await chat.sendMessage(latestMessage);
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (err) {
        console.warn(`⚠️ Model ${modelName} hit high demand, attempting fallback:`, err.message);
        lastError = err;
      }
    }

    if (!text) {
      throw lastError || new Error("All AI models are currently busy.");
    }

    res.status(200).json({ success: true, reply: text });
  } catch (err) {
    console.error("❌ Gemini Chat Error:", err);
    res.status(500).json({ 
      success: false, 
      message: "I'm experiencing a brief rush in AI traffic right now! 🚦 Please try again in a few seconds." 
    });
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

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are missing.");
    return res.status(500).json({ 
      success: false, 
      message: "Server email credentials (EMAIL_USER / EMAIL_PASS) are not configured." 
    });
  }

  try {
    // Email Transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER.trim(),
        pass: process.env.EMAIL_PASS.trim(),
      },
    });

    console.log("📧 Sending email to owner...");
    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      text: `📩 New contact message:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
    });
    console.log("✅ Email sent to owner");

    console.log("📧 Sending auto-reply to sender...");
    await transporter.sendMail({
      from: `"Vamshi Gowni" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for reaching out!",
      text: `Hi ${name},\n\nThanks for getting in touch with me! I’ve received your message and will review it shortly.\nYou can expect a reply within the next 24–48 hours.\n\nIf it’s urgent, feel free to reach out to me directly at ${process.env.EMAIL_USER}.\n\nBest regards,\nVamshi Gowni\n`,
    });
    console.log("✅ Auto-reply sent to sender");

    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: err.message || "Error sending email" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});