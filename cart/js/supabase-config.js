// Supabase configuration
const SUPABASE_URL = 'https://cfigfcufbornekzjxbqd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmaWdmY3VmYm9ybmVremp4YnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MDU4NDcsImV4cCI6MjA2ODQ4MTg0N30.Y40XGZS1wvUVku4kEKi5CpntHA3k8Y9ohzMSG9bNMHI';

// Wait for Supabase to load then initialize client
let supabase;
if (typeof window.supabase !== 'undefined') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.error('Supabase library not loaded');
}