import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const LOGO_URL =
  "https://res.cloudinary.com/dt7w60zoz/image/upload/v1781885709/LOGO_x3t364.png";
const BRAND_COLOR = "#16a34a";
const BRAND_COLOR_LIGHT = "#f0fdf4";
const BRAND_COLOR_BORDER = "#bbf7d0";
const BRAND_COLOR_TEXT = "#14532d";

// ── i18n ──

const t = {
  en: {
    platform: "Restaurant Management Platform",
    footer: (year: number) =>
      `© ${year} Mazaya. All rights reserved.<br/>If you didn't request this email, you can safely ignore it.`,
    dir: "ltr",
    lang: "en",

    verification: {
      subject: (code: string) => `${code} is your Mazaya verification code`,
      heading: "Verify your email address",
      body: (restaurant: string) =>
        `Welcome to Mazaya! To complete your registration for <strong style="color:#0f172a;">${restaurant}</strong>, enter the verification code below:`,
      label: "Verification Code",
      expiry:
        "This code expires in <strong>15 minutes</strong>. Do not share it with anyone.",
      ignore: "If you didn't create a Mazaya account, no action is required.",
    },

    reset: {
      subject: "Reset your Mazaya password",
      heading: "Reset your password",
      body: (name: string) =>
        `Hi <strong style="color:#0f172a;">${name}</strong>, we received a request to reset the password for your Mazaya account. Click the button below to choose a new one.`,
      cta: "Reset Password",
      fallbackLabel: "Or copy this link into your browser",
      expiry:
        "This link expires in <strong>15 minutes</strong>. If you didn't request a password reset, you can safely ignore this email — your password will not change.",
    },
  },

  ar: {
    platform: "منصة إدارة وتطوير المطاعم",
    footer: (year: number) =>
      `© ${year} مزايا. جميع الحقوق محفوظة.<br/>إذا لم تطلب هذا البريد، يمكنك تجاهله بأمان.`,
    dir: "rtl",
    lang: "ar",

    verification: {
      subject: (code: string) => `${code} :رمز التحقق الخاص بك في مزايا`,
      heading: "تحقق من بريدك الإلكتروني",
      body: (restaurant: string) =>
        `أهلاً بك في مزايا! لإتمام تسجيل مطعمك <strong style="color:#0f172a;">${restaurant}</strong>، أدخل رمز التحقق التالي:`,
      label: "رمز التحقق",
      expiry:
        "ينتهي صلاحية هذا الرمز بعد <strong>15 دقيقة</strong>. لا تشاركه مع أي شخص.",
      ignore: "إذا لم تقم بإنشاء حساب في مزايا، يمكنك تجاهل هذا البريد.",
    },

    reset: {
      subject: "إعادة تعيين كلمة المرور - مزايا",
      heading: "إعادة تعيين كلمة المرور",
      body: (name: string) =>
        `مرحباً <strong style="color:#0f172a;">${name}</strong>، تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك في مزايا. انقر على الزر أدناه لاختيار كلمة مرور جديدة.`,
      cta: "إعادة تعيين كلمة المرور",
      fallbackLabel: "أو انسخ هذا الرابط في متصفحك",
      expiry:
        "ينتهي هذا الرابط بعد <strong>15 دقيقة</strong>. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد — لن يتم تغيير كلمة مرورك.",
    },
  },
} as const;

type Locale = keyof typeof t;

function resolveLocale(locale: string): Locale {
  return locale in t ? (locale as Locale) : "en";
}

// ── Shell ──

function emailShell(content: string, locale: string): string {
  const l = t[resolveLocale(locale)];
  const year = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="${l.lang}" dir="${l.dir}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Mazaya</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;direction:${l.dir};">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">

              <!-- Header -->
              <tr>
                <td style="background-color:${BRAND_COLOR};padding:32px;text-align:center;">
                  ${
                    LOGO_URL
                      ? `<img src="${LOGO_URL}" alt="Mazaya"
                          style="display:block;margin:0 auto;height:52px;width:auto;" />`
                      : `<span style="font-family:Georgia,serif;font-size:32px;font-weight:800;color:#ffffff;">مزايا</span>`
                  }
                  <p style="margin:10px 0 0;color:#bbf7d0;font-size:13px;letter-spacing:0.05em;text-transform:uppercase;font-weight:500;">
                    ${l.platform}
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 32px;text-align:${l.dir === "rtl" ? "right" : "left"};">
                  ${content}
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
                    ${l.footer(year)}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// ── Verification Email ──

interface SendVerificationEmailParams {
  to: string;
  code: string;
  restaurantName: string;
  locale: string;
}

export async function sendVerificationEmail({
  to,
  code,
  restaurantName,
  locale,
}: SendVerificationEmailParams) {
  const l = t[resolveLocale(locale)].verification;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
      ${l.heading}
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
      ${l.body(restaurantName)}
    </p>

    <!-- OTP Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <div style="display:inline-block;background-color:${BRAND_COLOR_LIGHT};border:2px dashed ${BRAND_COLOR_BORDER};border-radius:14px;padding:20px 48px;">
            <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;font-weight:600;">
              ${l.label}
            </p>
            <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:40px;font-weight:800;color:${BRAND_COLOR};letter-spacing:10px;line-height:1.2;">
              ${code}
            </p>
          </div>
        </td>
      </tr>
    </table>

    <!-- Expiry notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:${BRAND_COLOR_LIGHT};border-left:3px solid ${BRAND_COLOR};border-radius:0 8px 8px 0;padding:12px 16px;">
          <p style="margin:0;font-size:13px;color:${BRAND_COLOR_TEXT};">⏱ ${l.expiry}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">${l.ignore}</p>
  `;

  return await transporter.sendMail({
    from: `"Mazaya" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: l.subject(code),
    html: emailShell(content, locale),
  });
}

// ── Password Reset Email ──

interface SendPasswordResetEmailParams {
  to: string;
  name: string;
  resetLink: string;
  locale: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetLink,
  locale,
}: SendPasswordResetEmailParams) {
  const l = t[resolveLocale(locale)].reset;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">
      ${l.heading}
    </h2>
    <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
      ${l.body(name)}
    </p>

    <!-- CTA Button -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td align="center">
          <a href="${resetLink}"
            style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.01em;">
            ${l.cta}
          </a>
        </td>
      </tr>
    </table>

    <!-- Fallback link -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;">
          <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;font-weight:600;">
            ${l.fallbackLabel}
          </p>
          <p style="margin:0;font-size:12px;color:#64748b;word-break:break-all;">${resetLink}</p>
        </td>
      </tr>
    </table>

    <!-- Expiry notice -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="background-color:${BRAND_COLOR_LIGHT};border-left:3px solid ${BRAND_COLOR};border-radius:0 8px 8px 0;padding:12px 16px;">
          <p style="margin:0;font-size:13px;color:${BRAND_COLOR_TEXT};">⏱ ${l.expiry}</p>
        </td>
      </tr>
    </table>
  `;

  return await transporter.sendMail({
    from: `"Mazaya" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject: l.subject,
    html: emailShell(content, locale),
  });
}
