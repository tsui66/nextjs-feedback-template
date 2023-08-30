"use server";

import FeedbackEmail from "@/emails/feedback-email";

export async function submitFeedback(data: FormData) {
  const email = data.get("email") as string;
  const feedback = data.get("feedback") as string;

  if (!process.env.RESEND_API_KEY) {
    console.log(
      "Resend is not configured. You need to add a RESEND_API_KEY in your .env file for emails to work.",
    );
    return Promise.resolve();
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: "feedback@sine.at",
      to: email, // change it
      reply_to: email,
      ...(email && { reply_to: email }),
      subject: "🎉 New Feedback Received!",
      react: FeedbackEmail({
        email,
        feedback,
      }),
    }),
  });

  return await res.json()
}
