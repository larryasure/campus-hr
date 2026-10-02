import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

if (!resendApiKey) {
  console.warn(
    "RESEND_API_KEY is not configured. Email notifications are disabled.",
  );
}

if (!emailFrom) {
  console.warn(
    "EMAIL_FROM is not configured. Email notifications are disabled.",
  );
}

const resend = resendApiKey && emailFrom ? new Resend(resendApiKey) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> => {
  if (!resend || !emailFrom) {
    console.warn(
      `Email not sent to ${to}: Resend email service is not configured.`,
    );
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Resend email error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
};

export const sendRegistrationEmail = async (
  email: string,
  fullName: string,
  staffId: string,
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: "Welcome to CampusHR",
    text: `Hello ${fullName},

Your CampusHR account has been created successfully.

Staff ID: ${staffId}

You can sign in here:
${frontendUrl}/login

Regards,
CampusHR`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to CampusHR</h2>

        <p>Hello ${fullName},</p>

        <p>
          Your CampusHR account has been created successfully.
        </p>

        <p>
          <strong>Staff ID:</strong> ${staffId}
        </p>

        <p>
          You can sign in here:
          <a href="${frontendUrl}/login">
            ${frontendUrl}/login
          </a>
        </p>

        <p>Regards,<br />CampusHR</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: email,
    subject: "CampusHR Password Reset",
    text: `Hello,

We received a request to reset your CampusHR password.

Reset your password here:
${resetUrl}

If you did not request this, you can ignore this email.

Regards,
CampusHR`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset</h2>

        <p>Hello,</p>

        <p>
          We received a request to reset your CampusHR password.
        </p>

        <p>
          <a href="${resetUrl}">
            Reset your password
          </a>
        </p>

        <p>
          If you did not request this, you can ignore this email.
        </p>

        <p>Regards,<br />CampusHR</p>
      </div>
    `,
  });
};

export const sendPasswordChangedEmail = async (
  email: string,
  fullName: string,
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: "CampusHR Password Changed",
    text: `Hello ${fullName},

Your CampusHR password was changed successfully.

If you did not make this change, please contact HR immediately.

Regards,
CampusHR`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Changed</h2>

        <p>Hello ${fullName},</p>

        <p>
          Your CampusHR password was changed successfully.
        </p>

        <p>
          If you did not make this change, please contact HR immediately.
        </p>

        <p>Regards,<br />CampusHR</p>
      </div>
    `,
  });
};

export const sendAnnouncementEmail = async (
  email: string,
  fullName: string,
  title: string,
  content: string,
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: `CampusHR Announcement: ${title}`,
    text: `Hello ${fullName},

${title}

${content}

Regards,
CampusHR`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>${title}</h2>

        <p>Hello ${fullName},</p>

        <div>
          ${content}
        </div>

        <p>Regards,<br />CampusHR</p>
      </div>
    `,
  });
};
