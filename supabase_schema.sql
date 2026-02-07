-- Create the 'posts' table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT,
  image_url TEXT,
  reading_time TEXT,
  views INT DEFAULT 0
);

-- Create the 'categories' table (optional, for scalability)
-- For now, we'll stick to hardcoded categories in the App or simple distinct query

-- Enable Realtime for 'posts' table (for view counts/updates)
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- Initial data seed
INSERT INTO posts (title, slug, excerpt, content, category, image_url, reading_time, views)
VALUES 
(
  'The Architecture of Abandoned Digital Worlds',
  'architecture-of-abandoned-digital-worlds',
  'We spent 48 hours exploring the servers of a forgotten 1999 MMO. What we found wasn''t just data—it was a ghost town of digital memories and the structural debris of a lost society.',
  'Content goes here...',
  'The Rabbit Hole',
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
  '18 min read',
  4200
),
(
  'The ''Dark Forest'' theory of the internet is finally here',
  'dark-forest-theory',
  'Why the internet is becoming a silent place.',
  'Content...',
  'Culture',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
  '2 min read',
  120
),
(
  'Is ''Antigravity'' by Google the next evolution in UI development?',
  'antigravity-google-ui',
  'Exploring the future of interface design.',
  'Content...',
  'Tech',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  '4 min read',
  340
);
