import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../services/authService';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [forgotOpen, setForgotOpen] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'E-mail obrigatório.';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'E-mail inválido.';
    if (!password) errs.password = 'Senha obrigatória.';
    else if (password.length < 8) errs.password = 'Mínimo 8 caracteres.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { user, accessToken } = await login(email, password);
      setAuth(user, accessToken);
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao fazer login.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <button className={styles.themeToggle} onClick={toggleTheme} title="Alternar tema">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className={styles.card}>
        <div className={styles.logoArea}>
          <img src="/logo.png" alt="IDEIAS iServices" className={styles.logoImg} />
          <div>
            <h1 className={styles.appName}>IDEIAS - iServices</h1>
            <p className={styles.appSub}>Gestão de Serviços Empresariais</p>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? styles.inputError : ''}
              autoComplete="email"
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.field}>
            <label>Senha</label>
            <div className={styles.passWrapper}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? styles.inputError : ''}
                autoComplete="current-password"
              />
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
          </div>

          <div className={styles.forgotRow}>
            <button type="button" className={styles.forgotLink} onClick={() => setForgotOpen(true)}>
              Esqueci minha senha
            </button>
          </div>

          <Button type="submit" loading={loading} size="lg" className={styles.submitBtn}>
            Entrar
          </Button>

          <button
            type="button"
            className={styles.msBtn}
            onClick={() => toast('Em breve disponível', { icon: '🔜' })}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="MS" width={18} />
            Entrar com Microsoft
          </button>
        </form>

        <p className={styles.footer}>© IDEIAS Brasil Tecnologia — 2026</p>
      </div>

      <Modal open={forgotOpen} onClose={() => setForgotOpen(false)} title="Recuperar Senha" size="sm">
        <div className={styles.forgotModal}>
          <p>Informe seu e-mail e enviaremos um link para redefinição da senha.</p>
          <div className={styles.field} style={{ marginTop: 16 }}>
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com.br" />
          </div>
          <Button className={styles.submitBtn} size="md" onClick={() => { toast.success('Link enviado! Verifique seu e-mail.'); setForgotOpen(false); }}>
            Enviar Link
          </Button>
        </div>
      </Modal>
    </div>
  );
}
