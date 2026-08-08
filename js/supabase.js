/* js/supabase.js */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// আপনার Supabase প্রজেক্টের URL
const SUPABASE_URL = 'https://Wrabxqejkabbheddioxa.supabase.co';

// আপনার Supabase Anon / Public Key (এখানে আপনার আসল Key-টি বসাবেন)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYWJ4cWVqa2FiYmhlZGRpb3hhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMzUwODAsImV4cCI6MjEwMTYxMTA4MH0.ss-HG38k8ZeEzV5Icg55_G7Pkz4VuY7AbbxWAnCJpLk';

// Supabase ক্লায়েন্ট ইনিশিয়ালাইজ করা
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true, // ব্রাউজারে লগইন সেশন ধরে রাখবে (কাস্টমার ম্যানুয়ালি লগআউট না করা পর্যন্ত)
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});

// ডাটাবেজ হেল্পার ফাংশনসমূহ (সহজে অন্যান্য ফাইল থেকে কল করার জন্য)

/**
 * ১. যেকোনো টেবিল থেকে ডাটা ফেচ (Fetch) করার ফাংশন
 * @param {string} table - টেবিলের নাম
 * @param {string} select - সিলেক্ট কলাম (ডিফল্ট '*')
 */
export async function fetchData(table, select = '*') {
    const { data, error } = await supabase.from(table).select(select);
    if (error) {
        console.error(`Error fetching from ${table}:`, error.message);
        return null;
    }
    return data;
}

/**
 * ২. যেকোনো টেবিলে নতুন ডাটা ইন্সার্ট (Insert) করার ফাংশন
 * @param {string} table - টেবিলের নাম
 * @param {object|array} payload - যে ডাটা অবজেক্ট বা এরে সেভ করতে চান
 */
export async function insertData(table, payload) {
    const { data, error } = await supabase.from(table).insert(payload).select();
    if (error) {
        console.error(`Error inserting into ${table}:`, error.message);
        return { success: false, error };
    }
    return { success: true, data };
}

/**
 * ৩. যেকোনো টেবিলের ডাটা আপডেট (Update) করার ফাংশন
 * @param {string} table - টেবিলের নাম
 * @param {object} payload - আপডেট করার ডাটা
 * @param {string} matchColumn - ফিল্টার কলামের নাম (যেমন 'id')
 * @param {any} matchValue - ফিল্টার ভ্যালু
 */
export async function updateData(table, payload, matchColumn, matchValue) {
    const { data, error } = await supabase.from(table).update(payload).eq(matchColumn, matchValue).select();
    if (error) {
        console.error(`Error updating ${table}:`, error.message);
        return { success: false, error };
    }
    return { success: true, data };
}

/**
 * ৪. বর্তমান লগইন ইউজারের সেশন জানার ফাংশন
 */
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
      }
