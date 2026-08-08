// Supabase Configuration
const SUPABASE_URL = "https://wrabxqejkabbheddioxa.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYWJ4cWVqa2FiYmhlZGRpb3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzUwODAsImV4cCI6MjEwMTYxMTA4MH0.ss-HG38k8ZeEzV5Icg55_G7Pkz4VuY7AbbxWAnCJpLk";

// Initialize Supabase Client with Realtime
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
