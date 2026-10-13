import nodemailer from 'nodemailer';

interface SendOtpResult {
  delivered: boolean;
  messageId?: string;
  previewOtp?: string;
  provider: 'smtp' | 'preview_mode';
  details?: string;
}

class EmailService {
  private transporter: any = null;
  private isConfigured = false;

  constructor() {
    this.initTransporter();
  }

  private initTransporter() {
    const host = process.env.SMTP_HOST?.trim();
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim();

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user,
            pass
          }
        });
        this.isConfigured = true;
        console.log(`[EmailService] SMTP transporter configured for host: ${host}:${port} (${user})`);
      } catch (err) {
        console.warn('[EmailService] Failed to initialize SMTP transporter:', err);
        this.isConfigured = false;
      }
    } else {
      this.isConfigured = false;
      console.log('[EmailService] Running in development preview mode. OTPs will be displayed in console and UI helper.');
    }
  }

  public async sendOtp(recipientEmail: string, otpCode: string): Promise<SendOtpResult> {
    const fromAddress = process.env.SMTP_FROM || '"Olfactory AI Atelier" <auth@olfactory.ai>';
    const subject = `Your Olfactory AI Scent Passport Passkey: ${otpCode}`;

    // Luxury Haute Parfumerie HTML Email Template
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #120F0D; color: #F5EFEB; margin: 0; padding: 24px; }
          .container { max-width: 520px; margin: 0 auto; background: #1C1713; border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 20px; padding: 36px 32px; box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5); }
          .header { text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 24px; margin-bottom: 28px; }
          .seal { display: inline-block; width: 44px; height: 44px; line-height: 44px; background: rgba(217, 119, 6, 0.15); border: 1px solid rgba(217, 119, 6, 0.4); border-radius: 12px; font-size: 20px; color: #D97706; }
          .brand-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #D97706; margin-top: 12px; font-weight: 600; }
          .title { font-size: 22px; font-weight: 500; color: #FAF6F0; margin-top: 6px; letter-spacing: -0.01em; }
          .content { text-align: center; font-size: 14px; line-height: 1.6; color: #A89C8F; }
          .otp-card { background: #120F0D; border: 1px solid rgba(217, 119, 6, 0.35); border-radius: 16px; padding: 24px; margin: 28px 0; text-align: center; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: bold; letter-spacing: 0.28em; color: #FBBF24; padding-left: 0.28em; text-shadow: 0 0 12px rgba(251, 191, 36, 0.2); }
          .expiry { font-size: 11px; color: #8A7E72; margin-top: 10px; }
          .notice { font-size: 12px; color: #7A6F64; margin-top: 24px; line-height: 1.5; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 20px; }
          .footer { text-align: center; font-size: 10px; color: #61564C; margin-top: 24px; letter-spacing: 0.15em; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="seal">✧</div>
            <div class="brand-title">L'Atelier Olfactif</div>
            <div class="title">Scent Passport Verification</div>
          </div>
          <div class="content">
            <p>Greetings, Fragrance Connoisseur.</p>
            <p>Your one-time authentication passkey to access your personal fragrance vault, living olfactory portrait, and customized perfume formulations is below:</p>
            
            <div class="otp-card">
              <div class="otp-code">${otpCode}</div>
              <div class="expiry">Valid for 10 minutes · Single use</div>
            </div>

            <p style="font-size: 13px; color: #9A8D80;">Enter this code in your Olfactory AI authentication terminal to complete your sign-in.</p>
            
            <div class="notice">
              If you did not request this verification code, please ignore this dispatch. Your formulation secrets and collection remain securely preserved.
            </div>
          </div>
          <div class="footer">
            Olfactory AI Intelligence Atelier · Kannauj & Grasse
          </div>
        </div>
      </body>
      </html>
    `;

    const textBody = `L'Atelier Olfactif - Scent Passport Verification\n\nYour one-time login code is: ${otpCode}\n\nValid for 10 minutes.\n\nIf you did not request this code, ignore this email.`;

    // Attempt real SMTP delivery if configured
    if (this.isConfigured && this.transporter) {
      try {
        const info = await this.transporter.sendMail({
          from: fromAddress,
          to: recipientEmail,
          subject,
          text: textBody,
          html: htmlBody
        });

        console.log(`[EmailService] OTP email successfully dispatched to ${recipientEmail}. MessageId: ${info.messageId}`);
        return {
          delivered: true,
          messageId: info.messageId,
          provider: 'smtp',
          details: `Sent to ${recipientEmail} via SMTP`
        };
      } catch (sendErr: any) {
        console.error(`[EmailService] Failed to dispatch email via SMTP to ${recipientEmail}:`, sendErr.message);
        // Fall back to preview mode if SMTP failed so user is not locked out
        return {
          delivered: false,
          previewOtp: otpCode,
          provider: 'preview_mode',
          details: `SMTP error (${sendErr.message}). Preview code generated.`
        };
      }
    }

    // In preview / dev mode: log to server output and provide preview code
    console.log(`\n======================================================`);
    console.log(`📬 [EMAIL OTP DISPATCH]`);
    console.log(`To: ${recipientEmail}`);
    console.log(`Verification Code: [ ${otpCode} ]`);
    console.log(`Expires: 10 minutes`);
    console.log(`======================================================\n`);

    return {
      delivered: false,
      previewOtp: otpCode,
      provider: 'preview_mode',
      details: `Code generated for ${recipientEmail}. Configure SMTP in .env for direct inbox transmission.`
    };
  }
}

export const emailService = new EmailService();
