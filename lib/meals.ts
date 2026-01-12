import { supabase } from './supabase';
import { Meal } from '@/types/meal';

export async function getAllMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching meals:', error);
    return [];
  }

  return data || [];
}

export async function getMealById(id: string): Promise<Meal | null> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching meal:', error);
    return null;
  }

  return data;
}
