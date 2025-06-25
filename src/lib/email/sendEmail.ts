import { Resend } from "resend";
import { WelcomeEmail } from "./templates/WelcomeEmail";
import { createElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "");

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "no-reply@yourdomain.com",
    to,
    subject: "Welcome!",
    react: createElement(WelcomeEmail, { name }),
  });
}
