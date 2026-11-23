/**
 * Centralized Session Manager for AJIET ERP
 * Manages JWT Auth Token and User Identity across LocalStorage and Browser Cookies.
 * Ensures sessions persist across tab closures, refreshes, and browser restarts.
 */

const TOKEN_KEY = 'ajiet_auth_token';
const USER_KEY = 'ajiet_current_user';
const LOGIN_FLAG = 'ajiet_is_logged_in';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

// Helper to read cookie by name
function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  } catch (e) {
    console.warn('Cookie read error:', e);
  }
  return null;
}

// Helper to set cookie
function setCookie(name, value, maxAge = COOKIE_MAX_AGE) {
  try {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie write error:', e);
  }
}

// Helper to delete cookie
function deleteCookie(name) {
  try {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
  } catch (e) {
    console.warn('Cookie delete error:', e);
  }
}

/**
 * Save user credentials and JWT token into both LocalStorage and Cookie
 */
export function saveSession(user, token) {
  if (!user) return;
  const authToken = token || user.token;

  try {
    if (authToken) {
      localStorage.setItem(TOKEN_KEY, authToken);
      setCookie(TOKEN_KEY, authToken);
    }
    const cleanUser = { ...user, token: authToken };
    localStorage.setItem(USER_KEY, JSON.stringify(cleanUser));
    localStorage.setItem(LOGIN_FLAG, 'true');
    setCookie(LOGIN_FLAG, 'true');
  } catch (err) {
    console.warn('Session save failed:', err);
  }
}

/**
 * Retrieve current active session from LocalStorage or Cookies
 */
export function getStoredSession() {
  try {
    // 1. Try reading user from LocalStorage
    const savedUserStr = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY) || getCookie(TOKEN_KEY);
    const isLoggedIn = localStorage.getItem(LOGIN_FLAG) === 'true' || getCookie(LOGIN_FLAG) === 'true';

    if (savedUserStr && isLoggedIn) {
      const user = JSON.parse(savedUserStr);
      return {
        ...user,
        token: token || user.token
      };
    }
  } catch (err) {
    console.warn('Failed to parse active session:', err);
  }
  return null;
}

/**
 * Clear session from both LocalStorage and Cookies (Logout)
 */
export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LOGIN_FLAG);

    deleteCookie(TOKEN_KEY);
    deleteCookie(LOGIN_FLAG);

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
  } catch (err) {
    console.warn('Failed to clear session:', err);
  }
}
