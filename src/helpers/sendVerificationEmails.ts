import { resend } from "../lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  username:string,
  email:string,
  verifycode:string
):Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: `${email}`,
      subject: ' Mystry Message || Verification Code',
      react: VerificationEmail({username,otp:verifycode}),
    });
    return {success:true,
      message:" Verification email sent sucessfully"
    }
  } catch (emailError) {
    console.log("Error sending verification email",emailError)
    return {success:false,
      message:"Failed to send verification email"
    }
  }
}