import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendVerificationEmailParams {
  to: string;
  code: string;
  restaurantName: string;
}

/**
 * Dispatches a beautifully branded HTML verification code transactional email.
 */
export async function sendVerificationEmail({ to, code, restaurantName }: SendVerificationEmailParams) {
  const mailOptions = {
    from: `"مزايا / Mazaya Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: `${code} :رمز التحقق الخاص بك / Your Verification Code`,
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; direction: rtl; text-align: right; max-width: 550px; margin: 0 auto; border: 1px solid #f1f5f9; padding: 32px; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #ea580c; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.05em;">مزايا</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px; font-weight: 500;">منصة إدارة وتطوير المطاعم</p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin-bottom: 24px;" />
        
        <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 8px;">أهلاً بك،</p>
        <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-top: 0;">
          شكراً لتسجيل مطعمك <strong style="color: #0f172a;">${restaurantName}</strong> في منصة مزايا. يرجى استخدام رمز التحقق التالي لإتمام تفعيل حسابك:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
          <div style="display: inline-block; background-color: #fff7ed; border: 2px dashed #ffedd5; padding: 12px 32px; border-radius: 12px;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 700; color: #ea580c; letter-spacing: 4px;">${code}</span>
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 8px;">ينتهي صلاحية هذا الرمز بعد 15 دقيقة</p>
        </div>

        <p style="font-size: 13px; color: #64748b; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-bottom: 0;">
          إذا لم تقم بإنشاء هذا الحساب، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
}