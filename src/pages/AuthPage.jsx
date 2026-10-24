import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    const res = isLogin ? login(form) : register(form);
    if (res.ok) navigate('/chat');
    else setError(res.error);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>💬 PulseChat</h1>
        <p className="muted">{isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account.'}</p>
        {!isLogin && <input name="name" placeholder="Full name" value={form.name} onChange={onChange} />}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} />
        {error && <div className="error" role="alert">{error}</div>}
        <button className="primary" type="submit">{isLogin ? 'Log in' : 'Register'}</button>
        <button type="button" className="ghost" onClick={() => { demoLogin(); navigate('/chat'); }}>Try demo account</button>
        <p className="muted small center">
          {isLogin ? <>No account? <Link to="/register">Register</Link></> : <>Have an account? <Link to="/login">Log in</Link></>}
        </p>
      </form>
    </div>
  );
}
