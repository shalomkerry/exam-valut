"use server";

import { authClient } from "@/lib/auth/auth-client";

export async function login(email:string,password:string) {
  return authClient.signIn.email({
    email,password
  });
}