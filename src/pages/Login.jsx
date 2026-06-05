import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { supabase, setToken } from '../lib/supabase';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 先尝试登录
      let result = await supabase.auth.signInWithPassword({ email, password });

      // 用户不存在则自动注册
      if (result.error && result.error.message?.includes('Invalid login credentials')) {
        result = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });

        if (result.error) {
          setError(result.error.message);
          setLoading(false);
          return;
        }

        // 注册成功但没有 session（开了邮箱验证）→ 直接切登录
        if (result.data.user && !result.data.session) {
          result = await supabase.auth.signInWithPassword({ email, password });
        }
      }

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return;
      }

      if (result.data.session) {
        setToken(result.data.session.access_token);
        navigate('/app');
      }
    } catch (err) {
      setError(err.message || '出了点问题，请重试');
    }

    setLoading(false);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <BookOpen size={34} strokeWidth={1.5} className={styles.brandIcon} />
          <span>Recall</span>
        </div>
        <p className={styles.tagline}>your content companion</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="email">
              邮箱
            </label>
            <input
              id="email"
              className={styles.fieldInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel} htmlFor="password">
              密码
            </label>
            <input
              id="password"
              className={styles.fieldInput}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码（至少6位）"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? '处理中…' : '继续'}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        <p className={styles.hint}>
          新用户自动注册，已有账号直接登录
        </p>
      </div>
    </div>
  );
}
