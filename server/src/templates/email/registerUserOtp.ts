const registerUserOtpTemplate = (name: string, otp: string) => {
  return {
    subject: "OTP for registration",
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; padding: 24px;">
                <h2 style="color: #333;">Hello ${name},</h2>
                <p>Thank you for registering with us!</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div style="font-size: 2em; font-weight: bold; color: #007bff; margin: 16px 0;">
                    <span style="letter-spacing: 4px;">${otp}</span>
                </div>
                <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
                <p>If you did not request this, please ignore this email.</p>
                <br>
                <p>Best regards,<br>The Blogger Team</p>
            </div>
        `,
  };
};

export default registerUserOtpTemplate;