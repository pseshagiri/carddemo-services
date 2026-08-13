/**
 * GOV.UK Form Group — wraps a single form field with label, hint, and error.
 * Follows https://design-system.service.gov.uk/components/text-input/
 */
import React from 'react';

interface GovUkFormGroupProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

const s: Record<string, React.CSSProperties> = {
  group: { marginBottom: 30 },
  groupError: { paddingLeft: 15, borderLeft: '4px solid #d4351c' },
  label: {
    display: 'block',
    marginBottom: 5,
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 700,
    fontSize: 19,
    lineHeight: '1.3',
    color: '#0b0c0c'
  },
  hint: {
    display: 'block',
    marginBottom: 10,
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontSize: 19,
    lineHeight: '1.3',
    color: '#505a5f'
  },
  error: {
    display: 'block',
    marginBottom: 10,
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 700,
    fontSize: 19,
    lineHeight: '1.3',
    color: '#d4351c'
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap'
  }
};

export default function GovUkFormGroup({ id, label, hint, error, children }: GovUkFormGroupProps) {
  const hasError = !!error;
  const groupStyle: React.CSSProperties = hasError
    ? { ...s.group, ...s.groupError }
    : s.group;

  return (
    <div style={groupStyle}>
      <label htmlFor={id} style={s.label}>
        {label}
      </label>
      {hint && (
        <div id={`${id}-hint`} style={s.hint}>
          {hint}
        </div>
      )}
      {hasError && (
        <p id={`${id}-error`} style={s.error} role="alert">
          <span style={s.srOnly}>Error:</span> {error}
        </p>
      )}
      {children}
    </div>
  );
}

// GOV.UK text input style to use inside GovUkFormGroup
export const govUkInputStyle = (hasError = false): React.CSSProperties => ({
  appearance: 'none',
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontWeight: 400,
  fontSize: 19,
  lineHeight: '1.3',
  color: '#0b0c0c',
  background: '#ffffff',
  border: `2px solid ${hasError ? '#d4351c' : '#0b0c0c'}`,
  borderRadius: 0,
  padding: '5px 4px 4px',
  outline: 'none',
  width: '100%',
  maxWidth: 460,
  boxSizing: 'border-box' as const
});

export const govUkSelectStyle = (hasError = false): React.CSSProperties => ({
  ...govUkInputStyle(hasError),
  padding: '5px 40px 4px 4px',
  appearance: 'none' as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='10' viewBox='0 0 17 10'%3E%3Cpath d='M8.5 10L0 0h17z' fill='%230b0c0c'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  backgroundSize: '17px 10px',
  maxWidth: 460
});
