// js/supabase.js


import {

createClient

} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";





// ==========================
// SUPABASE CONFIG
// ==========================


// আপনার Supabase Project URL এখানে দিন

const SUPABASE_URL =
"https://wrabxqejkabbheddioxa.supabase.co";




// আপনার Supabase anon public key এখানে দিন

const SUPABASE_ANON_KEY =

"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYWJ4cWVqa2FiYmhlZGRpb3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzUwODAsImV4cCI6MjEwMTYxMTA4MH0.ss-HG38k8ZeEzV5Icg55_G7Pkz4VuY7AbbxWAnCJpLk";







// ==========================
// CREATE CLIENT
// ==========================


export const supabase =

createClient(

SUPABASE_URL,

SUPABASE_ANON_KEY,

{

auth:{


persistSession:true,


autoRefreshToken:true,


detectSessionInUrl:true


}

}

);
