import { supabase } from "./supabase";
import { SignInData } from "./auth";

export async function supabaseSignIn(data: SignInData) {
  return await supabase.auth.signInWithPassword(data);
}

export async function supabaseSignOut() {
  return await supabase.auth.signOut();
}

export async function getSupabaseUser() {
  return await supabase.auth.getUser();
}

export async function getSupabaseSession() {
  return await supabase.auth.getSession();
}
