# Expenditure Finance Frontend

## 🚀 React Application with Supabase Integration

Complete frontend implementation for **Sri Venkateswara Enterprises Expenditure Finance Management System** with Supabase backend integration, authentication, and real-time updates.

---

## 📦 Tech Stack

- **Frontend:** React / Next.js
- **Backend:** Supabase (PostgreSQL + REST APIs)
- **Authentication:** Supabase Auth (Email/Password)
- **Real-time:** Supabase Realtime
- **Styling:** Tailwind CSS / Your choice

---

## 🔗 Related Repositories

- **Backend Repository:** https://github.com/manisriviswa/expenditure-finance-backend
- **Supabase Project:** https://supabase.com/dashboard/project/dyvcwupcliycezsvsapo

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (already configured)

### 2. Installation

```bash
# Clone repository
git clone https://github.com/manisriviswa/expenditure-finance-frontend.git
cd expenditure-finance-frontend

# Install dependencies
npm install

# Install Supabase client
npm install @supabase/supabase-js
```

### 3. Environment Configuration

Create `.env.local` file in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dyvcwupcliycezsvsapo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Get Your API Key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/dyvcwupcliycezsvsapo/settings/api-keys)
2. Copy the **anon/public** key
3. Paste in `.env.local` file

### 4. Supabase Client Configuration

The `src/lib/supabase.js` file is already configured:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 🔐 Authentication Implementation

### Sign Up

```javascript
import { supabase } from './lib/supabase'

const handleSignUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  
  if (error) throw error
  return data
}
```

### Sign In

```javascript
const handleSignIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}
```

### Sign Out

```javascript
const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

### Get Current User

```javascript
const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}
```

---

## 💾 Database Operations

### Fetch All Expenses

```javascript
const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      expense_categories (name, description),
      users (full_name, email)
    `)
    .order('expense_date', { ascending: false })
  
  if (error) throw error
  return data
}
```

### Create New Expense

```javascript
const createExpense = async (expenseData) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      amount: expenseData.amount,
      category_id: expenseData.categoryId,
      description: expenseData.description,
      expense_date: expenseData.date,
      organization_id: expenseData.organizationId,
      user_id: expenseData.userId,
      status: 'pending'
    })
    .select()
  
  if (error) throw error
  return data
}
```

### Update Expense

```javascript
const updateExpense = async (id, updates) => {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data
}
```

### Delete Expense

```javascript
const deleteExpense = async (id) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}
```

### Fetch Expense Categories

```javascript
const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('expense_categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}
```

---

## 🔴 Real-time Subscriptions

### Subscribe to Expense Changes

```javascript
const subscribeToExpenses = (callback) => {
  const channel = supabase
    .channel('expenses-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'expenses'
      },
      (payload) => {
        console.log('Change detected:', payload)
        callback(payload)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}
```

### Usage in React Component

```javascript
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function ExpensesList() {
  const [expenses, setExpenses] = useState([])
  
  useEffect(() => {
    // Initial fetch
    fetchExpenses().then(setExpenses)
    
    // Subscribe to changes
    const unsubscribe = subscribeToExpenses((payload) => {
      if (payload.eventType === 'INSERT') {
        setExpenses(prev => [payload.new, ...prev])
      } else if (payload.eventType === 'UPDATE') {
        setExpenses(prev => 
          prev.map(exp => exp.id === payload.new.id ? payload.new : exp)
        )
      } else if (payload.eventType === 'DELETE') {
        setExpenses(prev => prev.filter(exp => exp.id !== payload.old.id))
      }
    })
    
    return unsubscribe
  }, [])
  
  return (
    <div>
      {expenses.map(expense => (
        <div key={expense.id}>{expense.description}</div>
      ))}
    </div>
  )
}
```

---

## 🎨 Integration with Figma Make Code

### Option 1: Direct Integration

1. Extract your downloaded Figma Make code
2. Copy `src/lib/supabase.js` from this repo
3. Replace API calls with Supabase calls
4. Add authentication flows

### Option 2: Service Layer Approach

Create `src/services/expenseService.js`:

```javascript
import { supabase } from '../lib/supabase'

export const expenseService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('expenses')
      .select('*, expense_categories(*), users(*)')
    if (error) throw error
    return data
  },
  
  create: async (expense) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
    if (error) throw error
    return data[0]
  },
  
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },
  
  delete: async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
    if (error) throw error
  }
}
```

---

## 🚀 Run Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

---

## 📚 Available Database Tables

| Table | Description |
|-------|-------------|
| `organizations` | Company/Organization details |
| `users` | User profiles with roles (admin, accountant, manager, user) |
| `expense_categories` | Expense categorization |
| `expenses` | Main expense records with status tracking |

---

## 🔑 API Keys Location

**Supabase Dashboard:**
https://supabase.com/dashboard/project/dyvcwupcliycezsvsapo/settings/api-keys

**Project URL:**
https://dyvcwupcliycezsvsapo.supabase.co

---

## 📖 Backend Documentation

For complete backend schema, API endpoints, and security policies:
https://github.com/manisriviswa/expenditure-finance-backend

---

## 🛡️ Security Notes

- ✅ Row Level Security (RLS) enabled
- ✅ JWT-based authentication
- ✅ Environment variables for sensitive data
- ✅ Never commit `.env.local` to Git
- ✅ Use `anon` key for client-side (safe)
- ❌ Never use `service_role` key in frontend

---

## 👥 Developer

Developed by manisriviswa

---

**Last Updated:** November 2025  
**Status:** ✅ Ready for Integration
