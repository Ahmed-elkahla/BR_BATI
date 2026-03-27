import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, firstName: string, token: string) {
  const link = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to,
    subject: "Confirmez votre compte BâtiPro",
    html: `
      <div style="font-family:Segoe UI,sans-serif;max-width:520px;margin:auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #e2e8f0">
        <div style="text-align:center;margin-bottom:24px">
          <span style="font-size:36px">🏗️</span>
          <h2 style="color:#1a2236;margin:8px 0 4px">BâtiPro</h2>
          <p style="color:#64748b;font-size:13px">Architecture & Construction</p>
        </div>
        <h3 style="color:#1a2236">Bonjour ${firstName} 👋</h3>
        <p style="color:#475569;line-height:1.6;margin:12px 0">
          Merci de vous être inscrit sur <strong>BâtiPro</strong>. Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.
        </p>
        <div style="text-align:center;margin:28px 0">
          <a href="${link}" style="background:#f97316;color:#fff;padding:13px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
            Confirmer mon compte
          </a>
        </div>
        <p style="color:#94a3b8;font-size:12px;text-align:center">
          Ce lien expire dans <strong>24 heures</strong>.<br/>
          Si vous n'avez pas créé de compte, ignorez cet email.
        </p>
        <hr style="border:none;border-top:1px solid #f1f5f9;margin:24px 0"/>
        <p style="color:#cbd5e1;font-size:11px;text-align:center">
          © ${new Date().getFullYear()} BâtiPro — Architecture & Construction
        </p>
      </div>
    `,
  });
}
