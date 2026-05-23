// src/utils/storage.js
// Single source of truth for localStorage token operations.
// No React component should ever call localStorage directly.

const TOKEN_KEY = 'mi_auth_token';
const USER_KEY = 'mi_auth_user';

export const storage = {
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // silently fail in restricted environments
    }
  },

  removeToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // silently fail
    }
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setUser(user) {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // silently fail
    }
  },

  removeUser() {
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      // silently fail
    }
  },

  clearAll() {
    this.removeToken();
    this.removeUser();
  },
};
