// Local Authentication Service
// Works without Firebase - uses localStorage for demo/development
// ⚠️ SECURITY WARNING: This is for DEMO/DEVELOPMENT only!
// In production, ALWAYS use Firebase Auth or another secure backend

export interface LocalUser {
  id: string;
  email: string;
  password: string; // In production, this would be hashed!
  name: string;
  role: 'user' | 'admin' | 'client';
  phone?: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Generate secure random password for demo users
const generateDemoPassword = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Demo users for testing - passwords generated dynamically
// In production, users must register or use Firebase Auth
const createDemoUsers = (): LocalUser[] => {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;
  
  if (!isDev) {
    // In production, return empty array - no demo users!
    console.warn('[LocalAuth] Demo users disabled in production. Use Firebase Auth.');
    return [];
  }
  
  // Generate random passwords for demo users each session
  // These are displayed in console for development testing only
  const adminPassword = generateDemoPassword();
  const clientPassword = generateDemoPassword();
  const testPassword = generateDemoPassword();
  
  console.log('%c🔐 DEMO CREDENTIALS (Development Only)', 'color: #ff6600; font-weight: bold; font-size: 14px;');
  console.log(`   Admin: admin@tchova.digital / ${adminPassword}`);
  console.log(`   Client: cliente@tchova.digital / ${clientPassword}`);
  console.log(`   Test: teste@tchova.digital / ${testPassword}`);
  
  return [
    {
      id: 'admin-001',
      email: 'admin@tchova.digital',
      password: adminPassword,
      name: 'Tchova Admin',
      role: 'admin',
      phone: '+258 87 909 7249',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'user-001',
      email: 'cliente@tchova.digital',
      password: clientPassword,
      name: 'Cliente Demo',
      role: 'user',
      phone: '+258 84 123 4567',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'user-002',
      email: 'teste@tchova.digital',
      password: testPassword,
      name: 'Usuário Teste',
      role: 'user',
      phone: '+258 82 987 6543',
      createdAt: new Date('2024-02-01'),
    },
  ];
};

// Initialize demo users
const DEMO_USERS = createDemoUsers();

const USERS_STORAGE_KEY = 'tchova_local_users';
const CURRENT_USER_KEY = 'tchova_current_user';

// Initialize users in localStorage if not exists
export const initializeLocalUsers = (): void => {
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  if (!storedUsers) {
    console.log('[LocalAuth] Initializing demo users in localStorage');
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEMO_USERS));
  } else {
    console.log('[LocalAuth] Users already exist in localStorage');
  }
};

// Get all users
export const getLocalUsers = (): LocalUser[] => {
  initializeLocalUsers();
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  const users = storedUsers ? JSON.parse(storedUsers) : DEMO_USERS;
  console.log('[LocalAuth] Getting users, count:', users.length);
  return users;
};

// Find user by email
export const findUserByEmail = (email: string): LocalUser | null => {
  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  console.log('[LocalAuth] Finding user by email:', email, 'Found:', !!user);
  return user;
};

// Validate login credentials
export const validateLocalLogin = (email: string, password: string): { success: boolean; user?: LocalUser; error?: string } => {
  console.log('[LocalAuth] Validating login for:', email);
  
  const user = findUserByEmail(email);
  
  if (!user) {
    console.log('[LocalAuth] User not found:', email);
    return { success: false, error: 'Usuário não encontrado.' };
  }
  
  if (user.password !== password) {
    console.log('[LocalAuth] Wrong password for:', email);
    return { success: false, error: 'Senha incorreta.' };
  }
  
  console.log('[LocalAuth] Login successful for:', email);
  
  // Update last login
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date();
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
  
  return { success: true, user };
};

// Register new user
export const registerLocalUser = (userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
}): { success: boolean; user?: LocalUser; error?: string } => {
  const users = getLocalUsers();
  
  // Check if email already exists
  if (users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, error: 'Este email já está cadastrado.' };
  }
  
  const newUser: LocalUser = {
    id: `user-${Date.now()}`,
    email: userData.email,
    password: userData.password,
    name: userData.name,
    role: 'user',
    phone: userData.phone,
    createdAt: new Date(),
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return { success: true, user: newUser };
};

// Set current user session
export const setCurrentUser = (user: LocalUser): void => {
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    authType: 'local' as const,
  };
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
};

// Get current user session
export const getCurrentUser = (): (Omit<LocalUser, 'password'> & { authType: 'local' }) | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// Clear current user session
export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Check if using local auth (Firebase not configured)
export const isUsingLocalAuth = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  
  // List of placeholder values that indicate Firebase is not properly configured
  const placeholderValues: (string | undefined | null)[] = [
    'demo-key',
    'your_firebase_api_key_here',
    'demo.firebaseapp.com',
    'demo-project',
    'your_project_id',
    undefined,
    null,
    ''
  ];
  
  // If API key is a placeholder or missing, use local auth
  if (placeholderValues.includes(apiKey)) {
    console.log('[Auth] Using LOCAL auth - API key is placeholder or missing:', apiKey);
    return true;
  }
  
  // If project ID is a placeholder or missing, use local auth
  if (placeholderValues.includes(projectId)) {
    console.log('[Auth] Using LOCAL auth - Project ID is placeholder or missing:', projectId);
    return true;
  }
  
  // Check if the values look like real Firebase config
  // Real Firebase API keys are typically 39 characters and start with "AIza"
  if (apiKey && typeof apiKey === 'string' && apiKey.startsWith('AIza')) {
    console.log('[Auth] Using FIREBASE auth - Real API key detected');
    return false; // Real Firebase config detected
  }
  
  // Default to local auth if uncertain
  console.log('[Auth] Using LOCAL auth - Default fallback');
  return true;
};

// Update user profile
export const updateUserProfile = (userId: string, updates: Partial<LocalUser>): { success: boolean; user?: LocalUser; error?: string } => {
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'Usuário não encontrado.' };
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return { success: true, user: users[userIndex] };
};

// Change password
export const changePassword = (userId: string, currentPassword: string, newPassword: string): { success: boolean; error?: string } => {
  const users = getLocalUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, error: 'Usuário não encontrado.' };
  }
  
  if (users[userIndex].password !== currentPassword) {
    return { success: false, error: 'Senha atual incorreta.' };
  }
  
  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  return { success: true };
};

// Delete user account
export const deleteUser = (userId: string): { success: boolean; error?: string } => {
  const users = getLocalUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return { success: false, error: 'Usuário não encontrado.' };
  }
  
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filteredUsers));
  return { success: true };
};
