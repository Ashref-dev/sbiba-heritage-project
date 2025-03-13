import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { env } from "@/env.mjs";

interface MagicLinkEmailProps {
  actionUrl: string;
  firstName: string;
  mailType: "login" | "register";
  siteName: string;
}

const baseUrl = env.NEXT_PUBLIC_APP_URL;

export default function MagicLinkEmail({
  firstName = "",
  actionUrl,
  mailType,
}: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {mailType === "login"
          ? `Sign in to Sbiba Heritage Project`
          : `Welcome to Sbiba Heritage Project - Preserving our heritage`}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Hero Section */}
          <Section style={heroSection}>
            <Img
              src={`${baseUrl}/_static/logo_email.png`}
              width={56}
              height={56}
              alt="Sbiba Heritage Project"
              style={logo}
            />

            <Heading style={heading}>
              {mailType === "login" ? "Welcome 👋" : "Join Our Journey 🏛️"}
            </Heading>

            <Text style={subheading}>
              {mailType === "login"
                ? "Sign in to continue exploring our heritage"
                : "Your journey through Sbiba's rich cultural heritage starts here"}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {firstName ? firstName : "there"},</Text>

            <Text style={paragraph}>
              {mailType === "login"
                ? "We noticed a sign-in attempt from your device. Use the secure button below to access your account."
                : "Thank you for joining the Sbiba Heritage Project. We're excited to have you be part of preserving and celebrating our cultural heritage. Just one quick step to get started:"}
            </Text>

            <Button href={actionUrl} style={button}>
              {mailType === "login"
                ? "Sign in Securely"
                : "Activate Your Account"}
            </Button>

            {/* Security Notices */}
            <Section style={securitySection}>
              <Text style={securityNotice}>
                🔒 This link expires in 24 hours and can only be used once
              </Text>

              {mailType === "login" && (
                <Text style={securityNotice}>
                  ⚠️ Didn&apos;t request this? You can safely ignore this email
                </Text>
              )}
            </Section>
          </Section>

          {/* Features Preview */}
          {mailType === "register" && (
            <Section style={featuresSection}>
              <Text style={featureTitle}>What&apos;s waiting for you:</Text>
              <Text style={featureItem}>✓ Explore Sbiba&apos;s rich cultural heritage</Text>
              <Text style={featureItem}>✓ Contribute to preserving our history</Text>
              <Text style={featureItem}>✓ Connect with our community</Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Best regards,
              <br />
              The Sbiba Heritage Project Team
            </Text>

            <Img
              src={`${baseUrl}/_static/logo_email.png`}
              width={32}
              height={32}
              style={footerLogo}
            />

            <Text style={copyright}>
              © {new Date().getFullYear()} Sbiba Heritage Project. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const heroSection = {
  textAlign: "center" as const,
  padding: "32px 0",
  backgroundColor: "#ffffff",
  borderRadius: "16px 16px 0 0",
};

const logo = {
  margin: "0 auto",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#1a1a1a",
  margin: "24px 0 8px",
};

const subheading = {
  fontSize: "20px",
  color: "#666666",
  fontWeight: "500",
  margin: "0 0 24px",
};

const contentSection = {
  backgroundColor: "#ffffff",
  padding: "32px 40px",
};

const greeting = {
  fontSize: "18px",
  color: "#1a1a1a",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#444444",
  margin: "0 0 24px",
};

const button = {
  backgroundColor: "#F23F00",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 32px",
  margin: "32px auto",
  maxWidth: "280px",
};

const securitySection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const securityNotice = {
  fontSize: "14px",
  color: "#666666",
  margin: "8px 0",
};

const featuresSection = {
  backgroundColor: "#ffffff",
  padding: "24px 40px",
  borderTop: "1px solid #eaeaea",
};

const featureTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 16px",
};

const featureItem = {
  fontSize: "15px",
  color: "#444444",
  margin: "8px 0",
};

const hr = {
  borderColor: "#eaeaea",
  margin: "0",
};

const footer = {
  backgroundColor: "#ffffff",
  padding: "32px 40px",
  borderRadius: "0 0 16px 16px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "15px",
  color: "#666666",
  margin: "0 0 24px",
};

const footerLogo = {
  margin: "24px auto",
};

const copyright = {
  fontSize: "13px",
  color: "#8898aa",
  margin: "0",
};
