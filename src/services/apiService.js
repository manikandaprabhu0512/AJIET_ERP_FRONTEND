const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Register a new student into MySQL
 */
export async function registerStudentApi(studentData) {
  const response = await fetch(`${API_BASE_URL}/auth/register-student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(studentData)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit student registration');
  }
  return data;
}

/**
 * Login user (Student USN / Staff)
 */
export async function loginUserApi(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed. Please check credentials.');
  }
  return data;
}

/**
 * Update password (for first-time change or reset)
 */
export async function updatePasswordApi(username, newPassword) {
  const response = await fetch(`${API_BASE_URL}/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, newPassword })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update password.');
  }
  return data;
}

/**
 * Fetch authenticated profile using JWT token
 */
export async function getProfileApi(token) {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch student profile.');
  }
  return data.profile;
}
