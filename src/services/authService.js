// Client-side Authentication Service (UI/UX Simulation)
// No backend database or real email dependencies.

const STORAGE_KEYS = {
  USERS: 'ajiet_erp_mock_users',
  SESSION: 'ajiet_erp_current_session',
  ACTIVE_OTP: 'ajiet_erp_active_otp'
};

// Seed accounts covering all 4 portal categories and sub-roles
const DEFAULT_USERS = {
  // 1. Student
  '4JK26AB123': {
    id: '4JK26AB123',
    username: '4JK26AB123',
    password: '4JK26AB123',
    role: 'student',
    subRole: 'Student',
    category: 'student',
    name: 'Pratham R. Shetty',
    branch: 'Computer Science & Engineering',
    section: 'A',
    year: '1st Year',
    email: '4jk26ab123@ajiet.ac.in',
    isFirstLogin: true
  },
  '4JK26CS045': {
    id: '4JK26CS045',
    username: '4JK26CS045',
    password: 'Student@123',
    role: 'student',
    subRole: 'Student',
    category: 'student',
    name: 'Ananya Rao',
    branch: 'Computer Science & Engineering',
    section: 'B',
    year: '1st Year',
    email: '4jk26cs045@ajiet.ac.in',
    isFirstLogin: false
  },

  // 2. Faculty
  'ABCDE12345': {
    id: 'ABCDE12345',
    username: 'ABCDE12345',
    password: 'ABCDE12345',
    role: 'faculty',
    subRole: 'Faculty',
    category: 'faculty',
    name: 'Dr. Ramesh Kumar',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    email: 'ramesh.cse@ajiet.ac.in',
    isFirstLogin: true
  },

  // 3. Department (HOD, Mentor, Advisor)
  'HODCS12345': {
    id: 'HODCS12345',
    username: 'HODCS12345',
    password: 'Hod@12345',
    role: 'hod',
    subRole: 'HOD',
    category: 'department',
    name: 'Dr. Anthony D\'Souza',
    department: 'Computer Science & Engineering',
    designation: 'Head of Department',
    email: 'hod.cse@ajiet.ac.in',
    isFirstLogin: false
  },
  'MNTR012345': {
    id: 'MNTR012345',
    username: 'MNTR012345',
    password: 'MNTR012345',
    role: 'mentor',
    subRole: 'Mentor',
    category: 'department',
    name: 'Prof. Suresh Nair',
    department: 'Information Science & Engineering',
    designation: 'Assistant Professor & Mentor',
    email: 'suresh.ise@ajiet.ac.in',
    isFirstLogin: true
  },
  'ADVS012345': {
    id: 'ADVS012345',
    username: 'ADVS012345',
    password: 'ADVS012345',
    role: 'advisor',
    subRole: 'Class Advisor',
    category: 'department',
    name: 'Prof. Preethi Hegde',
    department: 'Computer Science & Engineering',
    designation: 'Assistant Professor & Class Advisor',
    email: 'preethi.cse@ajiet.ac.in',
    isFirstLogin: true
  },

  // 4. Institution (Principal, Dean, HR, OA, Admin Officer, Accountant)
  'PRIN012345': {
    id: 'PRIN012345',
    username: 'PRIN012345',
    password: 'Principal@123',
    role: 'principal',
    subRole: 'Principal',
    category: 'institution',
    name: 'Dr. Shantharama Rai C',
    department: 'Institutional Administration',
    designation: 'Principal',
    email: 'principal@ajiet.ac.in',
    isFirstLogin: false
  },
  'DEAN012345': {
    id: 'DEAN012345',
    username: 'DEAN012345',
    password: 'DEAN012345',
    role: 'dean',
    subRole: 'Dean',
    category: 'institution',
    name: 'Dr. Nagesh Prabhu',
    department: 'Academic Affairs',
    designation: 'Dean (Academics)',
    email: 'dean.academics@ajiet.ac.in',
    isFirstLogin: true
  },
  'HR00012345': {
    id: 'HR00012345',
    username: 'HR00012345',
    password: 'HR00012345',
    role: 'hr',
    subRole: 'HR',
    category: 'institution',
    name: 'Smt. Deepa Shetty',
    department: 'Human Resources',
    designation: 'HR Manager',
    email: 'hr@ajiet.ac.in',
    isFirstLogin: true
  },
  'OA00012345': {
    id: 'OA00012345',
    username: 'OA00012345',
    password: 'OA00012345',
    role: 'oa',
    subRole: 'OA',
    category: 'institution',
    name: 'Sri. Mohan Gowda',
    department: 'Office Administration',
    designation: 'Office Attendant',
    email: 'oa.office@ajiet.ac.in',
    isFirstLogin: true
  },
  'ADMIN12345': {
    id: 'ADMIN12345',
    username: 'ADMIN12345',
    password: 'Admin@12345',
    role: 'admin',
    subRole: 'Admin Officer',
    category: 'institution',
    name: 'System Administrator',
    department: 'IT & Administration',
    designation: 'Administrative Officer',
    email: 'admin@ajiet.ac.in',
    isFirstLogin: false
  },
  'ACCT012345': {
    id: 'ACCT012345',
    username: 'ACCT012345',
    password: 'ACCT012345',
    role: 'accountant',
    subRole: 'Accountant',
    category: 'institution',
    name: 'Sri. Rajesh Bhat',
    department: 'Finance & Accounts',
    designation: 'Chief Accountant',
    email: 'accounts@ajiet.ac.in',
    isFirstLogin: true
  }
};

// Initialize mock store if not present
export const initMockStore = () => {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!existing) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
  } catch (e) {
    console.warn('Storage not available', e);
  }
};

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : { ...DEFAULT_USERS };
  } catch {
    return { ...DEFAULT_USERS };
  }
};

export const saveUser = (user) => {
  try {
    const users = getStoredUsers();
    users[user.username.toUpperCase()] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Error saving user', e);
  }
};

// Generate a random 6-digit OTP
export const generateRandomOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// USN Validation: 10 chars starting with 4JK + 2-digit year + 2-letter branch + 3-digit roll
export const validateUsnFormat = (usn) => {
  if (!usn || typeof usn !== 'string') return false;
  const cleaned = usn.trim().toUpperCase();
  if (cleaned.length !== 10) return false;
  const regex = /^4JK\d{2}[A-Z]{2}\d{3}$/;
  return regex.test(cleaned);
};

// Staff ID Validation: 10 chars
export const validateStaffIdFormat = (staffId) => {
  if (!staffId || typeof staffId !== 'string') return false;
  const cleaned = staffId.trim().toUpperCase();
  return cleaned.length === 10;
};

// Attempt Login with Category Context
export const attemptLogin = (identifier, password, portalCategory, subRole = null) => {
  const cleanId = (identifier || '').trim().toUpperCase();
  const cleanPass = (password || '').trim();
  const users = getStoredUsers();

  let user = users[cleanId];

  // If user not in seed, create on-the-fly seed record to allow flexible dynamic testing
  if (!user) {
    if (portalCategory === 'student') {
      if (!validateUsnFormat(cleanId)) {
        return {
          success: false,
          error: 'USN must be strictly 10 characters in VTU format (e.g. 4JK26AB123).'
        };
      }

      // Check if registration session has the actual student name and details
      let realName = `Student (${cleanId})`;
      let realBranch = cleanId.substring(5, 7);
      let realEmail = `${cleanId.toLowerCase()}@ajiet.ac.in`;
      try {
        const savedSession = sessionStorage.getItem('ajiet_student_registration_session');
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.fullName) realName = parsed.fullName;
          if (parsed.branch) realBranch = parsed.branch;
          if (parsed.email) realEmail = parsed.email;
        }
      } catch {}

      user = {
        id: cleanId,
        username: cleanId,
        password: cleanId, // default password is USN
        role: 'student',
        subRole: 'Student',
        category: 'student',
        name: realName,
        branch: realBranch,
        year: '1st Year',
        email: realEmail,
        isFirstLogin: true
      };
      saveUser(user);
    } else {
      if (!validateStaffIdFormat(cleanId)) {
        return {
          success: false,
          error: 'Staff ID must be exactly 10 alphanumeric characters (e.g. ABCDE12345).'
        };
      }
      user = {
        id: cleanId,
        username: cleanId,
        password: cleanId, // default password is Staff ID
        role: subRole?.toLowerCase().replace(/\s+/g, '_') || portalCategory,
        subRole: subRole || 'Staff Member',
        category: portalCategory,
        name: `${subRole || 'Staff'} (${cleanId})`,
        department: 'Institutional Staff',
        designation: subRole || 'Staff',
        email: `${cleanId.toLowerCase()}@ajiet.ac.in`,
        isFirstLogin: true
      };
      saveUser(user);
    }
  }

  // Category mismatch validation
  if (portalCategory === 'student' && user.category !== 'student') {
    return {
      success: false,
      error: 'This account does not belong to the Student Portal. Please select the appropriate staff role.'
    };
  }
  if (portalCategory !== 'student' && user.category === 'student') {
    return {
      success: false,
      error: 'This is a Student account. Please select Student Login from the gateway.'
    };
  }

  // Check password
  if (user.password !== cleanPass) {
    return {
      success: false,
      error: 'Invalid password. Please check your credentials or click Forgot Password.'
    };
  }

  // First time login check:
  // If first login is true or if password still matches initial default username
  const isFirstTime = user.isFirstLogin || user.password === cleanId;

  return {
    success: true,
    user,
    requiresFirstTimeFlow: isFirstTime
  };
};

// Update Password
export const updatePassword = (username, newPassword) => {
  const cleanId = (username || '').trim().toUpperCase();
  const users = getStoredUsers();
  if (users[cleanId]) {
    users[cleanId].password = newPassword;
    users[cleanId].isFirstLogin = false;
    saveUser(users[cleanId]);
    return { success: true, user: users[cleanId] };
  }
  return { success: false, error: 'User not found' };
};

// Session storage helpers
export const setCurrentSession = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  } catch (e) {
    console.warn('Session write error', e);
  }
};

export const getCurrentSession = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearCurrentSession = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (e) {
    console.warn('Session clear error', e);
  }
};
