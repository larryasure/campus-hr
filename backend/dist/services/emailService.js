import nodemailer from "nodemailer";
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const emailEnabled = Boolean(emailUser && emailPassword);
const transporter = emailEnabled
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    })
  : null;
if (!emailEnabled) {
  console.warn(
    "Email service is disabled. Add EMAIL_USER and EMAIL_PASSWORD to .env to enable emails.",
  );
}
const emailTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CampusHR</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background: #f1f5f9;
  font-family: Arial, Helvetica, sans-serif;
  color: #1e293b;
">
  <div style="
    max-width: 600px;
    margin: 0 auto;
    padding: 32px 16px;
  ">
    <div style="
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    ">
      <div style="
        background: #2563eb;
        padding: 24px;
      ">
        <h1 style="
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 700;
        ">
          CampusHR
        </h1>

        <p style="
          margin: 6px 0 0;
          color: #dbeafe;
          font-size: 13px;
        ">
          University Lecturer HR Management System
        </p>
      </div>

      <div style="
        padding: 28px 24px;
        font-size: 14px;
        line-height: 1.7;
      ">
        ${content}
      </div>

      <div style="
        border-top: 1px solid #e2e8f0;
        padding: 16px 24px;
        background: #f8fafc;
      ">
        <p style="
          margin: 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.5;
        ">
          This is an automated message from CampusHR.
          Please do not reply directly to this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
export const sendEmail = async (to, subject, content) => {
  if (!transporter) {
    console.warn(
      `Email skipped because email service is disabled. Recipient: ${to}`,
    );
    return;
  }
  await transporter.sendMail({
    from: `"CampusHR" <${emailUser}>`,
    to,
    subject,
    html: emailTemplate(content),
  });
};
export const sendRegistrationEmail = async (to, fullName, staffId) => {
  const loginUrl = `${frontendUrl}/login`;
  await sendEmail(
    to,
    "Welcome to CampusHR",
    `
      <h2 style="
        margin: 0 0 12px;
        color: #0f172a;
        font-size: 20px;
      ">
        Welcome to CampusHR, ${fullName}
      </h2>

      <p>
        Your lecturer account has been successfully created.
      </p>

      <div style="
        margin: 20px 0;
        padding: 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
      ">
        <p style="margin: 0 0 6px;">
          <strong>Staff ID:</strong> ${staffId}
        </p>

        <p style="margin: 0;">
          <strong>Account:</strong> Lecturer
        </p>
      </div>

      <p>
        You can now sign in to CampusHR and complete your lecturer profile.
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${loginUrl}"
          style="
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 11px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          Log in to CampusHR
        </a>
      </div>
    `,
  );
};
export const sendPasswordResetEmail = async (to, resetToken) => {
  const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
  await sendEmail(
    to,
    "CampusHR — Reset Your Password",
    `
      <h2 style="
        margin: 0 0 12px;
        color: #0f172a;
        font-size: 20px;
      ">
        Reset your password
      </h2>

      <p>
        We received a request to reset your CampusHR password.
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 11px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          Reset Password
        </a>
      </div>

      <p style="
        color: #64748b;
        font-size: 13px;
      ">
        This link expires in 30 minutes.
        If you did not request a password reset, you can simply ignore this email.
      </p>
    `,
  );
};
export const sendPasswordChangedEmail = async (to, fullName) => {
  const loginUrl = `${frontendUrl}/login`;
  await sendEmail(
    to,
    "CampusHR — Password Changed",
    `
      <h2 style="
        margin: 0 0 12px;
        color: #0f172a;
        font-size: 20px;
      ">
        Password changed successfully
      </h2>

      <p>
        Hello ${fullName},
      </p>

      <p>
        Your CampusHR account password has been changed successfully.
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${loginUrl}"
          style="
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 11px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          Log in to CampusHR
        </a>
      </div>
    `,
  );
};
export const sendAnnouncementEmail = async (
  to,
  lecturerName,
  title,
  content,
) => {
  await sendEmail(
    to,
    `CampusHR — ${title}`,
    `
      <p>
        Dear ${lecturerName},
      </p>

      <h2 style="
        margin: 0 0 14px;
        color: #0f172a;
        font-size: 20px;
      ">
        ${title}
      </h2>

      <div>
        ${content}
      </div>

      <p style="
        margin-top: 24px;
        color: #64748b;
        font-size: 13px;
      ">
        Please log in to CampusHR for more information.
      </p>

      <div style="margin: 24px 0;">
        <a
          href="${frontendUrl}/login"
          style="
            display: inline-block;
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 11px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
          "
        >
          Open CampusHR
        </a>
      </div>
    `,
  );
};
