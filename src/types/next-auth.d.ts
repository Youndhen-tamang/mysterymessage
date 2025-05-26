import 'next-auth'
import { DefaultSession } from 'next-auth';
import { Message } from '@/model/User';

declare module 'next-auth'{
    interface User{
      _id?:string,
      isVerified?:boolean,
      isAccepting: boolean;
      username?:string,
      messages: Message[];
    }
    interface Session{
      user:{
        _id?:string;
        isVerified?:boolean,
        isAccepting: boolean,
      username?:string
      } & DefaultSession['user']
    }
    
}

declare module 'next-auth/jwt'{
  interface JWT{
    _id?:string,
    isVerified?:boolean,
    isAccepting: boolean;
    username?:string
  }
}