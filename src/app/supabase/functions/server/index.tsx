import { Hono } from 'npm:hono@4';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// Create Supabase client with service role key for admin operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );
};

// Create Supabase client with anon key for user operations
const getSupabaseAnonClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  );
};

// =====================================
// AUTHENTICATION ROUTES
// =====================================

// Sign up new account (Guardian or Admin)
app.post('/make-server-c94c0456/auth/signup', async (c) => {
  try {
    const supabase = getSupabaseClient();
    const body = await c.req.json();
    const { email, password, name, role, section, guardianData } = body;

    // Validate input
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Email, password, name, and role are required' }, 400);
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since email server not configured
      user_metadata: { name, role }
    });

    if (authError) {
      console.log('Sign up auth error:', authError);
      return c.json({ error: `Failed to create user account: ${authError.message}` }, 400);
    }

    // Store additional user data in KV store
    const userId = authData.user?.id;
    if (!userId) {
      return c.json({ error: 'User ID not found after creation' }, 500);
    }

    const userData = {
      id: userId,
      email,
      name,
      role, // 'super-admin', 'admin', 'guardian'
      section: section || null,
      guardianData: guardianData || null,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    await kv.set(`user:${userId}`, userData);
    
    // Also store user by email for quick lookup
    await kv.set(`user:email:${email}`, userId);

    console.log(`Successfully created account for ${email} with role ${role}`);
    
    return c.json({ 
      success: true, 
      message: 'Account created successfully',
      user: {
        id: userId,
        email,
        name,
        role
      }
    });
  } catch (error) {
    console.log('Sign up error:', error);
    return c.json({ error: `Server error during sign up: ${error.message}` }, 500);
  }
});

// Sign in
app.post('/make-server-c94c0456/auth/signin', async (c) => {
  try {
    const supabase = getSupabaseAnonClient();
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error);
      return c.json({ error: `Failed to sign in: ${error.message}` }, 401);
    }

    // Get user data from KV store
    const userId = data.user?.id;
    const userData = await kv.get(`user:${userId}`);

    console.log(`User ${email} signed in successfully`);

    return c.json({ 
      success: true,
      accessToken: data.session?.access_token,
      user: userData || {
        id: data.user?.id,
        email: data.user?.email,
        name: data.user?.user_metadata?.name,
        role: data.user?.user_metadata?.role
      }
    });
  } catch (error) {
    console.log('Sign in server error:', error);
    return c.json({ error: `Server error during sign in: ${error.message}` }, 500);
  }
});

// Get current session
app.get('/make-server-c94c0456/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Session error:', error);
      return c.json({ error: 'Invalid session' }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`);

    return c.json({ 
      success: true,
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role
      }
    });
  } catch (error) {
    console.log('Get session error:', error);
    return c.json({ error: `Server error getting session: ${error.message}` }, 500);
  }
});

// Sign out
app.post('/make-server-c94c0456/auth/signout', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.log('Sign out error:', error);
      return c.json({ error: `Failed to sign out: ${error.message}` }, 400);
    }

    return c.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.log('Sign out server error:', error);
    return c.json({ error: `Server error during sign out: ${error.message}` }, 500);
  }
});

// =====================================
// STUDENT (SANTRI) ROUTES
// =====================================

// Get all students
app.get('/make-server-c94c0456/students', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const students = await kv.getByPrefix('student:');
    return c.json({ success: true, students });
  } catch (error) {
    console.log('Get students error:', error);
    return c.json({ error: `Failed to get students: ${error.message}` }, 500);
  }
});

// Add new student
app.post('/make-server-c94c0456/students', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const studentId = `student:${Date.now()}`;
    const studentData = {
      ...body,
      id: studentId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(studentId, studentData);
    
    console.log(`Student ${body.name} added successfully`);
    return c.json({ success: true, student: studentData });
  } catch (error) {
    console.log('Add student error:', error);
    return c.json({ error: `Failed to add student: ${error.message}` }, 500);
  }
});

// Update student
app.put('/make-server-c94c0456/students/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const studentId = c.req.param('id');
    const body = await c.req.json();
    
    const existingStudent = await kv.get(studentId);
    if (!existingStudent) {
      return c.json({ error: 'Student not found' }, 404);
    }

    const updatedStudent = {
      ...existingStudent,
      ...body,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };

    await kv.set(studentId, updatedStudent);
    
    console.log(`Student ${studentId} updated successfully`);
    return c.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.log('Update student error:', error);
    return c.json({ error: `Failed to update student: ${error.message}` }, 500);
  }
});

// =====================================
// PAYMENT ROUTES
// =====================================

// Get all payment types
app.get('/make-server-c94c0456/payment-types', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const paymentTypes = await kv.getByPrefix('payment-type:');
    return c.json({ success: true, paymentTypes });
  } catch (error) {
    console.log('Get payment types error:', error);
    return c.json({ error: `Failed to get payment types: ${error.message}` }, 500);
  }
});

// Add payment type
app.post('/make-server-c94c0456/payment-types', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const paymentTypeId = `payment-type:${Date.now()}`;
    const paymentTypeData = {
      ...body,
      id: paymentTypeId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(paymentTypeId, paymentTypeData);
    
    console.log(`Payment type ${body.name} added successfully`);
    return c.json({ success: true, paymentType: paymentTypeData });
  } catch (error) {
    console.log('Add payment type error:', error);
    return c.json({ error: `Failed to add payment type: ${error.message}` }, 500);
  }
});

// Get all transactions
app.get('/make-server-c94c0456/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await kv.getByPrefix('transaction:');
    return c.json({ success: true, transactions });
  } catch (error) {
    console.log('Get transactions error:', error);
    return c.json({ error: `Failed to get transactions: ${error.message}` }, 500);
  }
});

// Add transaction
app.post('/make-server-c94c0456/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const transactionId = `transaction:${Date.now()}`;
    const transactionData = {
      ...body,
      id: transactionId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(transactionId, transactionData);
    
    console.log(`Transaction ${transactionId} added successfully`);
    return c.json({ success: true, transaction: transactionData });
  } catch (error) {
    console.log('Add transaction error:', error);
    return c.json({ error: `Failed to add transaction: ${error.message}` }, 500);
  }
});

// =====================================
// ALBUM ROUTES
// =====================================

// Get all album items
app.get('/make-server-c94c0456/albums', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const albums = await kv.getByPrefix('album:');
    return c.json({ success: true, albums });
  } catch (error) {
    console.log('Get albums error:', error);
    return c.json({ error: `Failed to get albums: ${error.message}` }, 500);
  }
});

// Add album item
app.post('/make-server-c94c0456/albums', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const albumId = `album:${Date.now()}`;
    const albumData = {
      ...body,
      id: albumId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(albumId, albumData);
    
    console.log(`Album item ${albumId} added successfully`);
    return c.json({ success: true, album: albumData });
  } catch (error) {
    console.log('Add album error:', error);
    return c.json({ error: `Failed to add album: ${error.message}` }, 500);
  }
});

// =====================================
// ATTENDANCE ROUTES
// =====================================

// Get all attendance records
app.get('/make-server-c94c0456/attendance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const attendance = await kv.getByPrefix('attendance:');
    return c.json({ success: true, attendance });
  } catch (error) {
    console.log('Get attendance error:', error);
    return c.json({ error: `Failed to get attendance: ${error.message}` }, 500);
  }
});

// Add attendance record
app.post('/make-server-c94c0456/attendance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const attendanceId = `attendance:${Date.now()}`;
    const attendanceData = {
      ...body,
      id: attendanceId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(attendanceId, attendanceData);
    
    console.log(`Attendance ${attendanceId} added successfully`);
    return c.json({ success: true, attendance: attendanceData });
  } catch (error) {
    console.log('Add attendance error:', error);
    return c.json({ error: `Failed to add attendance: ${error.message}` }, 500);
  }
});

// =====================================
// DISCIPLINE ROUTES
// =====================================

// Get all discipline records
app.get('/make-server-c94c0456/discipline', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const discipline = await kv.getByPrefix('discipline:');
    return c.json({ success: true, discipline });
  } catch (error) {
    console.log('Get discipline error:', error);
    return c.json({ error: `Failed to get discipline: ${error.message}` }, 500);
  }
});

// Add discipline record
app.post('/make-server-c94c0456/discipline', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const disciplineId = `discipline:${Date.now()}`;
    const disciplineData = {
      ...body,
      id: disciplineId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(disciplineId, disciplineData);
    
    console.log(`Discipline record ${disciplineId} added successfully`);
    return c.json({ success: true, discipline: disciplineData });
  } catch (error) {
    console.log('Add discipline error:', error);
    return c.json({ error: `Failed to add discipline: ${error.message}` }, 500);
  }
});

// =====================================
// ACHIEVEMENT ROUTES
// =====================================

// Get all achievement records
app.get('/make-server-c94c0456/achievements', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const achievements = await kv.getByPrefix('achievement:');
    return c.json({ success: true, achievements });
  } catch (error) {
    console.log('Get achievements error:', error);
    return c.json({ error: `Failed to get achievements: ${error.message}` }, 500);
  }
});

// Add achievement record
app.post('/make-server-c94c0456/achievements', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const achievementId = `achievement:${Date.now()}`;
    const achievementData = {
      ...body,
      id: achievementId,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };

    await kv.set(achievementId, achievementData);
    
    console.log(`Achievement ${achievementId} added successfully`);
    return c.json({ success: true, achievement: achievementData });
  } catch (error) {
    console.log('Add achievement error:', error);
    return c.json({ error: `Failed to add achievement: ${error.message}` }, 500);
  }
});

// Health check endpoint
app.get('/make-server-c94c0456/health', (c) => {
  return c.json({ 
    status: 'ok', 
    message: 'Al-Munawwarah Pondok Pesantren API is running',
    timestamp: new Date().toISOString()
  });
});

Deno.serve(app.fetch);
