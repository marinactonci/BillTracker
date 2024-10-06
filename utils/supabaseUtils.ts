import { supabase } from "../lib/supabaseClient";

export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  if (error) throw error
  return data
}

export async function getProfileById(id: number) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
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

export async function getBills(id: number) {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('profile_id', id)
  if (error) throw error
  return data
}

export async function getBillById(id: number) {
  const { data, error } = await supabase
    .from('bills')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createBill(id: number, name: string, isRecurring: boolean, link: string, username: string, password: string) {
  try {
    if (!id) throw new Error("Profile ID is required");

    const { data, error } = await supabase
      .from('bills')
      .insert({
        profile_id: id,
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

export async function getBillInstances() {
  const { data, error } = await supabase
    .from('bill_instances')
    .select(`
      *,
      bill:bill_id (name)
    `)
  if (error) throw error
  return data
}

export async function createBillInstance(bill_id: number, month:Date, due_date: Date, amount: number, is_paid: boolean) {
  try {
    const { data, error } = await supabase
      .from('bill_instances')
      .insert({
        bill_id,
        month,
        due_date,
        amount,
        is_paid
      })
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createBillInstance:", error);
    throw error;
  }
}

export async function updateBillInstance(id: number, updates: { month:Date, due_date: Date, amount: number, is_paid: boolean }) {
  const { data, error } = await supabase
    .from('bill_instances')
    .update(updates)
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function deleteBillInstance(id: number) {
  const { data, error } = await supabase
    .from('bill_instances')
    .delete()
    .eq('id', id)
  if (error) throw error
  return data
}