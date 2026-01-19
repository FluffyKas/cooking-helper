import { supabase } from './supabase';
import { Meal } from '@/types/meal';

const DEFAULT_PAGE_SIZE = 20;

interface PaginatedMeals {
  meals: Meal[];
  total: number;
  hasMore: boolean;
}

export async function getMealsPaginated(
  limit: number = DEFAULT_PAGE_SIZE,
  offset: number = 0
): Promise<PaginatedMeals> {
  // Get total count
  const { count, error: countError } = await supabase
    .from('meals')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error fetching meal count:', countError);
    return { meals: [], total: 0, hasMore: false };
  }

  const total = count || 0;

  // Get paginated data
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error('Error fetching meals:', error);
    return { meals: [], total, hasMore: false };
  }

  const meals = data || [];
  const hasMore = offset + meals.length < total;

  return { meals, total, hasMore };
}

// Keep for backwards compatibility - fetches all meals
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
