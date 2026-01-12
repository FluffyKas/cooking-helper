# Supabase Migration Guide

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) → **API**
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 2: Create Environment Variables File

1. In your project root, create a file named `.env.local`
2. Add these lines (replace with your actual values):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Install Dependencies

```bash
npm install
```

## Step 4: Run Migration

This will copy all your meals from `data/meals.json` to Supabase:

```bash
npm run migrate
```

You should see output like:
```
📖 Reading meals.json...
Found 7 meals to migrate
🚀 Inserting meals into Supabase...
✅ Successfully migrated 7 meals!
🎉 Migration complete!
```

## Step 5: Verify in Supabase

1. Go to your Supabase dashboard
2. Click **Table Editor** → **meals**
3. You should see all your recipes!

## Notes

- Old numeric IDs (1, 2, 3...) will be replaced with UUIDs
- The migration script doesn't delete - it only adds
- If you run it twice, you'll get duplicates (we can add a check if needed)
- After migration succeeds, you can keep `data/meals.json` as a backup

## Next Steps

After migration is complete, I'll update:
- All API routes to use Supabase instead of JSON file
- The Meal type to use UUID instead of string ID
- The frontend to work with new IDs

Ready? Let me know when migration is complete! 🚀
