// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ehacsmyeslurrwwbzocc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYWNzbXllc2x1cnJ3d2J6b2NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODE3ODYsImV4cCI6MjA2MzI1Nzc4Nn0.7IYZM9-T6R_ruXrQhnaLxfVaduCoIeqjgcjg1dCarZs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);