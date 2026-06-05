import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, setToken } from '../lib/supabase';
import styles from './Login.module.css';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('正在验证邮箱…');

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setMessage('验证链接无效，请重新注册。');
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const token = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (type === 'signup' && token) {
      supabase.auth.setSession({ access_token: token, refresh_token: refreshToken })
        .then(({ error }) => {
          if (error) {
            setMessage('验证失败：' + error.message);
          } else {
            setToken(token);
            setMessage('邮箱验证成功！');
            setTimeout(() => navigate('/'), 800);
          }
        });
    } else {
      setMessage('验证链接无效，请重新注册。');
    }
  }, [navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p style={{ fontSize: 16, color: 'var(--color-text)' }}>{message}</p>
      </div>
    </div>
  );
}
