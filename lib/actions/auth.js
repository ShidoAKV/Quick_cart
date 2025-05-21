'use server';

import { signIn, signOut } from '@/auth';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export const login = async () => {
   await signIn("github");
   
   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    console.log(token);
    
   //  const user=new User({
   //    name:
   //  })



};

export const logout = async () => {
    await signOut({ redirectTo:'/'});
  
};
