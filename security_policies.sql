-- Enable Row Level Security (RLS) on the posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone (anon) to READ posts
CREATE POLICY "Allow public read access"
ON posts
FOR SELECT
TO anon
USING (true);

-- Policy: Allow only authenticated users (admin) to INSERT posts
CREATE POLICY "Allow authenticated insert"
ON posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow only authenticated users (admin) to UPDATE posts
CREATE POLICY "Allow authenticated update"
ON posts
FOR UPDATE
TO authenticated
USING (true);

-- Policy: Allow only authenticated users (admin) to DELETE posts
CREATE POLICY "Allow authenticated delete"
ON posts
FOR DELETE
TO authenticated
USING (true);
