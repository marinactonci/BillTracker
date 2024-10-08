import { supabase } from '../lib/supabaseClient'

export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github'})
  if (error) throw error
  return data
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google'})
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}