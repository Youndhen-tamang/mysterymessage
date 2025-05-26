import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verify } from "crypto";

export const authOptions:NextAuthOptions={
  providers:[
    CredentialsProvider({
      id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text"},
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any, req):Promise<any> {
      await dbConnect()
      try {
      const user =  await UserModel.findOne({
          $or:[
            {email:credentials.identifier},
            {username:credentials.identifier}
          ]
        })
        if(!user){
          throw new Error("No User found with this error")
        }
        if(!user.isVerified){
          throw new Error("Please verify your account first")
        }
        const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password)
        console.log(isPasswordCorrect)
        if(isPasswordCorrect){
          return user;
        }else{
          throw new Error("Incorrect Password")
        }


      } catch (error:any) {
        throw new Error(error)
      }
    }
    })
  ],
  callbacks:{
    async session({ session, token }) {
      if (token) {
       session.user._id = token._id
       session.user.isVerified = token.isVerified

       session.user.isAccepting = token.isAccepting
       session.user.username = token.username
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isAccepting=user.isAccepting

        token.isVerified = user.isVerified
        token.username = user.username
      }
      return token 
    }
  },
  pages:{
    signIn: '/sign-in'
  },session:{
    strategy:"jwt"
  },
  secret:process.env.NEXTAUTH_SECRET
}