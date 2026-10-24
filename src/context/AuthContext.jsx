import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// NOTE: demo only. Real apps hash passwords on a server and use JWT/sessions.
export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('pulsechat_users', []);
  const [user, setUser] = useLocalStorage('pulsechat_session', null);

  const register = useCallback(({ name, email, password }) => {
    if (!name.trim()) return { ok: false, error: 'Name is required.' };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: 'Enter a valid email.' };
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
    if (users.some((u) => u.email === email.toLowerCase())) return { ok: false, error: 'Email already registered.' };
    const newUser = { id: crypto.randomUUID(), name: name.trim(), email: email.toLowerCase(), password };
    setUsers((prev) => [...prev, newUser]);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return { ok: true };
  }, [users, setUsers, setUser]);

  const login = useCallback(({ email, password }) => {
    const found = users.find((u) => u.email === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    setUser({ id: found.id, name: found.name, email: found.email });
    return { ok: true };
  }, [users, setUser]);

  const demoLogin = useCallback(() => setUser({ id: 'demo', name: 'Demo User', email: 'demo@pulsechat.dev' }), [setUser]);
  const logout = useCallback(() => setUser(null), [setUser]);

  const value = useMemo(() => ({ user, register, login, demoLogin, logout }), [user, register, login, demoLogin, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
