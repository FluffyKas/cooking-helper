# Cooking Helper

A modern recipe management web application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Authentication** - Secure email/password login with Supabase Auth
- 📖 **Recipe Management** - Add, edit, view, and delete recipes  
- 🔍 **Search & Filter** - Find recipes by name, complexity, cuisine, or labels
- 🎲 **Random Recipe** - Get a random recipe suggestion
- 🏷️ **Smart Labels** - Dynamic label system with auto-formatting
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 🎨 **Modern UI** - Glassmorphism design with smooth animations

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Fonts:** Lora (headings) & Inter (body)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd cooking-helper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this SQL:

```sql
CREATE TABLE meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  complexity text NOT NULL CHECK (complexity IN ('easy', 'medium', 'hard')),
  cuisine text NOT NULL,
  ingredients text[],
  instructions text,
  image text,
  labels text[],
  prep_time integer,
  servings integer,
  spiciness integer CHECK (spiciness >= 0 AND spiciness <= 3),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_meals_name ON meals(name);
CREATE INDEX idx_meals_cuisine ON meals(cuisine);
CREATE INDEX idx_meals_complexity ON meals(complexity);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for authenticated users" ON meals
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

3. Go to **Authentication** → **Providers** → Make sure **Email** is enabled
4. (Optional) **Authentication** → **Settings** → Disable email confirmations for easier testing

### 4. Set Up Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Get your Supabase credentials from **Settings** → **API** and fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. (Optional) Migrate Sample Data

If you have existing recipes in `data/meals.json`:

```bash
npm run migrate
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Create Your First Account

1. Visit the app → You'll be redirected to `/login`
2. Click "Sign up"
3. Create an account with your email and password
4. You'll be automatically logged in
5. Start adding recipes!

## Project Structure

```
cooking-helper/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── api/               # API routes (meals, labels)
│   ├── meal/[id]/         # Recipe detail pages
│   ├── add/               # Add recipe page
│   └── edit/[id]/         # Edit recipe pages
├── components/            # React components
│   ├── AuthProvider.tsx   # Auth state management
│   ├── ProtectedRoute.tsx # Route protection
│   ├── ThemeProvider.tsx  # Dark mode
│   └── ...
├── lib/                   # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── meals.ts          # Meal data functions
│   └── labels.ts         # Label utilities
├── types/                 # TypeScript types
└── public/               # Static assets (images, etc.)
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Migrate data from JSON to Supabase

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

**Important:** Your Supabase credentials in Vercel must match your Supabase project.

## Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- All users share access to all recipes (collaborative)
- Protected routes automatically redirect to login
- Logout functionality in header

### Recipe Management
- Add new recipes with ingredients, instructions, images, labels
- Edit existing recipes (all users can edit any recipe)
- View detailed recipe pages
- Delete recipes (coming soon)

### Search & Filtering
- **Search:** Find recipes by name (case-insensitive)
- **Complexity Filter:** Easy, Medium, or Hard
- **Cuisine Filter:** Dynamically populated from database
- **Label Filter:** Multi-select with AND logic
- **Random Recipe:** Get a random recipe from filtered results

### Labels System
- Labels are automatically extracted from all recipes
- Auto-formatting: First letter capitalized, rest lowercase
- Case-insensitive matching prevents duplicates
- Add custom labels on the fly

### Dark Mode
- System preference detection
- Manual toggle in header
- Persistent choice via localStorage
- Smooth transitions

## Security Notes

- ⚠️ **Never commit `.env.local`** (already in `.gitignore`)
- ⚠️ Row Level Security (RLS) is enabled but currently allows all authenticated users full access
- ⚠️ For production, consider stricter RLS policies

## Troubleshooting

**"Missing Supabase environment variables"**
- Make sure `.env.local` exists with correct values
- Restart dev server after adding env variables

**"Failed to fetch meals"**
- Check Supabase dashboard → ensure table `meals` exists
- Verify RLS policy allows access
- Check browser console for errors

**Build errors**
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder: `rm -rf .next`

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT
