// pos/js/supabase.js

import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = 
"https://wrabxqejkabbheddioxa.supabase.co";


const supabaseKey = 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYWJ4cWVqa2FiYmhlZGRpb3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzUwODAsImV4cCI6MjEwMTYxMTA4MH0.ss-HG38k8ZeEzV5Icg55_G7Pkz4VuY7AbbxWAnCJpLk";


export const supabase = createClient(
    supabaseUrl,
    supabaseKey
);
