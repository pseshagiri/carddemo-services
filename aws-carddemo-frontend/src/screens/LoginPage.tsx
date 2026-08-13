/**
 * LoginPage — GOV.UK sign-in pattern
 * https://design-system.service.gov.uk/patterns/sign-in/
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';

interface LoginFormValues {
  userId: string;
  password: string;
}

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  yellow: '#fd0',
  blue: '#1d70b8',
  red: '#d4351c',
  green: '#00703c',
  grey1: '#f3f2f1',
  borderGrey: '#b1b4b6'
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-block',
  background: gds.green,
  color: gds.white,
  border: `2px solid transparent`,
  padding: '8px 22px 7px',
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontWeight: 700,
  fontSize: 19,
  lineHeight: '1.1875',
  cursor: 'pointer',
  borderRadius: 0,
  boxShadow: `0 2px 0 #002d18`
};

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError('');
    const result = await login(values.userId, values.password);
    if (result.success) {
      navigate('/');
    } else {
      setLoginError(result.message || 'Login failed');
    }
  };

  const hasErrors = !!loginError || !!errors.userId || !!errors.password;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: gds.grey1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div style={{ width: '100%', maxWidth: 480, background: gds.white, padding: '40px 40px 60px' }}>

        {/* GOV.UK header strip */}
        <div style={{ background: gds.black, margin: '-40px -40px 40px', padding: '14px 40px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 132 97" height="28" width="38" fill={gds.white}>
            <path d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zm-17.2 0c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zM109 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zm17.2 0c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.5-.2-7.7-3.7-9.1-3.5-1.5-7.7.2-9.1 3.7-1.4 3.5.3 7.6 3.7 9.1zM66 0C29.5 0 0 14.8 0 33.1v63.6h132V33.1C132 14.8 102.5 0 66 0zm0 88.8c-17.7 0-32-6.3-32-14V42.8h64v32c0 7.6-14.3 14-32 14z"/>
          </svg>
          <span style={{ color: gds.white, fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 18 }}>
            GOV.UK
          </span>
        </div>

        <h1 style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 36, color: gds.black, margin: '0 0 24px' }}>
          Sign in
        </h1>

        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: '0 0 30px' }}>
          Sign in to access the AWS CardDemo Modernisation service.
        </p>

        {/* Error summary */}
        {hasErrors && (
          <div
            role="alert"
            aria-labelledby="error-summary-title"
            style={{
              border: `4px solid ${gds.red}`,
              padding: '15px 20px',
              marginBottom: 30
            }}
          >
            <h2 id="error-summary-title" style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19, color: gds.red, margin: '0 0 10px' }}>
              There is a problem
            </h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {loginError && (
                <li style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.red }}>
                  {loginError}
                </li>
              )}
              {errors.userId && (
                <li style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.red }}>
                  Enter your user ID
                </li>
              )}
              {errors.password && (
                <li style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.red }}>
                  Enter your password
                </li>
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkFormGroup
            id="userId"
            label="User ID"
            error={errors.userId ? 'Enter your user ID' : loginError || undefined}
          >
            <input
              id="userId"
              type="text"
              autoComplete="username"
              aria-describedby={errors.userId ? 'userId-error' : undefined}
              style={govUkInputStyle(!!errors.userId || !!loginError)}
              {...register('userId', { required: true })}
            />
          </GovUkFormGroup>

          <GovUkFormGroup
            id="password"
            label="Password"
            error={errors.password ? 'Enter your password' : undefined}
          >
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
              style={govUkInputStyle(!!errors.password)}
              {...register('password', { required: true })}
            />
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary}>
            Sign in
          </button>
        </form>

        {/* Inset hint for demo */}
        <div
          style={{
            borderLeft: `10px solid ${gds.borderGrey}`,
            padding: '15px 20px',
            marginTop: 30
          }}
        >
          <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, color: gds.black, margin: 0 }}>
            <strong>Demo credentials:</strong> admin / admin &nbsp;or&nbsp; user / user
          </p>
        </div>
      </div>
    </div>
  );
}
