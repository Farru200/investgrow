import express from "express";
import { Resend } from "resend";

const app = express();

app.use(express.json({ limit: "20kb" }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("InvestGrow Email Backend is running!");
});

app.post("/send-email", async (req, res) => {
  try {
    const { to, subject, message } = req.body || {};

    if (
      typeof to !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string"
    ) {
      return res.status(400).json({
        success: false,
        error: "Email, subject aur message dena zaroori hai."
      });
    }

    if (
      to.length > 254 ||
      subject.trim().length === 0 ||
      subject.length > 200 ||
      message.trim().length === 0 ||
      message.length > 10000
    ) {
      return res.status(400).json({
        success: false,
        error: "Email, subject ya message ki length galat hai."
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to.trim()],
      subject: subject.trim(),
      text: message
    });

    if (result.error) {
      console.error("Email provider error:", result.error);

      return res.status(502).json({
        success: false,
        error: "Email send nahi ho saki."
      });
    }

    return res.json({
      success: true,
      message: "Email request accept ho gayi."
    });

  } catch (error) {
    console.error("Email error:", error.message);

    return res.status(500).json({
      success: false,
      error: "Server par error aaya."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`InvestGrow Email Backend running on port ${PORT}`);
});
