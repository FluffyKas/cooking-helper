import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
config({ path: '.env.local' });

// You'll need to set these environment variables first
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('Please create .env.local with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateData() {
  try {
    console.log('📖 Reading meals.json...');
    const filePath = path.join(process.cwd(), 'data', 'meals.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const meals = JSON.parse(fileContents);

    console.log(`Found ${meals.length} meals to migrate`);

    // Transform data for Supabase
    const mealsForSupabase = meals.map((meal: any) => ({
      // Don't include old numeric IDs - let Supabase generate UUIDs
      name: meal.name,
      complexity: meal.complexity,
      cuisine: meal.cuisine,
      ingredients: meal.ingredients || null,
      instructions: meal.instructions || null,
      image: meal.image || null,
      labels: meal.labels || null,
      prep_time: meal.prepTime || null,
      servings: meal.servings || null,
      spiciness: meal.spiciness || null,
    }));

    console.log('🚀 Inserting meals into Supabase...');
    
    const { data, error } = await supabase
      .from('meals')
      .insert(mealsForSupabase)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error);
      process.exit(1);
    }

    console.log(`✅ Successfully migrated ${data?.length || 0} meals!`);
    console.log('🎉 Migration complete!');
    
    // Optional: Print the new UUIDs
    if (data) {
      console.log('\n📝 New meal IDs:');
      data.forEach((meal: any) => {
        console.log(`  - ${meal.name}: ${meal.id}`);
      });
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
