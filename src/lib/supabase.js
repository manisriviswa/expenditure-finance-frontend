// Supabase Client Configuration
// Sri Venkateswara Enterprises - Expenditure Finance Management

import { createClient } from '@supabase/supabase-js'

// Supabase Project Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dyvcwupcliycezsvsapo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined. Please add it to your .env.local file.'
  )
}

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Helper function to get current session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Database table names (for type safety)
export const TABLES = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
  EXPENSE_CATEGORIES: 'expense_categories',
  EXPENSES: 'expenses',
}

// Export default client
export default supabase
