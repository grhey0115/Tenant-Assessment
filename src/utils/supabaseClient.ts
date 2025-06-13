import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://teqdoifuhksvaytatylp.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlcWRvaWZ1aGtzdmF5dGF0eWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDMyNTgsImV4cCI6MjA2NTMxOTI1OH0.tndBDjb0umRWP0pj4afK2k3Tt7YGleUzJZ8dH-UaRg0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client successfully created and connected.");
