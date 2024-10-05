import { supabase } from "../lib/supabaseClient";

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  if (error) throw error
  return data
}

export async function createProfile(name: string, street: string, city: string, country: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        name,
        street,
        city,
        country
      })
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createProfile:", error);
    throw error;
  }
}

export async function updateProfile(id: number, name: string, street: string, city: string, country: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name, street, city, country })
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function deleteProfile(id: number) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getBills(profileId: number) {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('profile_id', profileId)
  if (error) throw error
  return data
}

export async function createBill(profileId: number, name: string, isRecurring: boolean, link: string, username: string, password: string) {
  try {
    if (!profileId) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from('bills')
      .insert({
        profile_id: profileId,
        name: name,
        is_recurring: isRecurring,
        recurring_day: 1,
        link: link,
        username: username,
        password: password
      })
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createBill:", error);
    throw error;
  }
}

export async function updateBill(id: number, updates: { name: string, is_recurring: boolean, link: string, username: string, password: string }) {
  const { data, error } = await supabase
    .from('bills')
    .update(updates)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function deleteBill(id: number) {
  const { data, error } = await supabase
    .from('bills')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}
