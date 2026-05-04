// src/lib/server/mailer.ts
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: env.SMTP_SECURE === 'true',
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASS
	}
});

// add this temporarily at the top of mailer.ts
transporter.verify((error, success) => {
	if (error) {
		console.error('❌ SMTP connection failed:', error);
	} else {
		console.log('✅ SMTP server is ready');
	}
});
export async function sendOTPEmail(to: string, otp: string) {
	await transporter.sendMail({
		from: `"BMCFREELANCE APP" <${env.SMTP_USER}>`,
		to,
		subject: 'Your verification code',
		html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
        <h2>Email Verification</h2>
        <p>Use the code below to verify your email. It expires in 5 minutes.</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; background: #f4f4f4; text-align: center; border-radius: 8px;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 16px;">If you didn't request this, ignore this email.</p>
      </div>
    `
	});
}

// src/lib/server/mailer.ts
export async function sendPasswordResetEmail(to: string, resetLink: string) {
	// Extract token from Better Auth's URL format:
	// http://localhost:5173/api/auth/reset-password/{token}?callbackURL=...
	const url = new URL(resetLink);
	const token = url.pathname.split('/').at(-1);
	const yourResetUrl = `${url.searchParams.get('callbackURL')}?token=${token}`;

	await transporter.sendMail({
		from: `"Your App" <${env.SMTP_USER}>`,
		to,
		subject: 'Reset your password',
		html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: auto;">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password. This link expires in 15 minutes.</p>
        <a href="${yourResetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px; margin-top: 16px;">If you didn't request this, ignore this email.</p>
      </div>
    `
	});
}
