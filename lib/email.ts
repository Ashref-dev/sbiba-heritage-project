import { render } from "@react-email/render";
import { createElement } from "react";
import MagicLinkEmail from "@/emails/magic-link-email";

interface SendMagicLinkEmailOptions {
  actionUrl: string;
  firstName?: string;
  mailType: "login" | "register";
  siteName: string;
  email: string;
}

/**
 * Renders the React Email template to HTML
 */
export function renderMagicLinkEmail(options: Omit<SendMagicLinkEmailOptions, "email">) {
  const { actionUrl, firstName = "", mailType, siteName } = options;
  
  // Create the React element
  const emailElement = createElement(MagicLinkEmail, {
    actionUrl,
    firstName,
    mailType,
    siteName,
  });
  
  // Render to HTML
  return render(emailElement);
}

/**
 * Prepares the email data for Nodemailer
 */
export function createMagicLinkEmailData(options: SendMagicLinkEmailOptions) {
  const { email, siteName, mailType } = options;
  
  // Render the email to HTML
  const html = renderMagicLinkEmail(options);
  
  // Create the email data
  return {
    to: email,
    subject: mailType === "login" 
      ? `Sign in to ${siteName}`
      : `Welcome to ${siteName}`,
    html,
  };
} 