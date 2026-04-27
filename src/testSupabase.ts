import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the root of the project
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase credentials in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("🔍 Testing connection to Supabase...");
  console.log(`🔗 URL: ${supabaseUrl}`);

  try {
    // Test Auth
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) throw authError;
    console.log("✅ Auth connection: OK");

    // Test Database (try to list schemas or a simple select)
    // We'll try to select from a common table or just run a simple RPC if possible, 
    // but usually checking if we can fetch any public data is enough.
    const { data: dbData, error: dbError } = await supabase.from('profiles').select('*').limit(1);
    
    if (dbError) {
      if (dbError.code === 'PGRST116' || dbError.code === '42P01') {
        console.log("✅ Database connection: OK (but 'profiles' table might not exist or is empty)");
      } else {
        throw dbError;
      }
    } else {
      console.log("✅ Database connection: OK");
    }

    console.log("🚀 Supabase Connected Successfully");
  } catch (error: any) {
    console.error("❌ Connection failed:");
    console.error(error.message || error);
    process.exit(1);
  }
}

testConnection();
