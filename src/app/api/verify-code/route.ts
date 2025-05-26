import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request:Request) {
  await dbConnect();

  try {
    const {username,code} = await request.json()

    const decodedUserName = decodeURIComponent(username)

      const user = await UserModel.findOne({username: decodedUserName})

      if(!user){
        return Response.json({
           success:false,
           message:"User not found"
        },{status:500})
      }

      const isCodeValid = user.verifyCode.toString() === code.toString()
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

      if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save();
        return Response.json({
          success:true,
          message:"Account Verified!!"
       },{status:200})
      } else if(!isCodeNotExpired){
        return Response.json({
          success:false,
          message:"Verification code has expired, please signup again to get a new code"
        },{status:400})
      }else{
        return Response.json({
          success:false,
          message:"Incorrect verification code"
        },{status:400})
      }

  } catch (error) {
    console.error("Error verifying user")
    return Response.json({
      success:false,
      message:"Error verifying user"
    })
  }
}