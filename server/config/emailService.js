import axios from "axios";

export const sendEmail = async (to, subject, text, html) => {
  try {
    const res = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: process.env.SENDER_EMAIL,
          name: "KashmirBuy",
        },
        to: [{ email: to }],
        subject,
        htmlContent: html || `<p>${text}</p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent via Brevo API:", res.data.messageId);
    return { success: true };
  } catch (error) {
    console.error(
      "Brevo API error:",
      error.response?.data || error.message
    );
    return { success: false };
  }
};

