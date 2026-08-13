/**
 * GOV.UK Date Input component
 * Follows https://design-system.service.gov.uk/components/date-input/
 *
 * Renders three separate number inputs for Day / Month / Year with
 * the correct GOV.UK fieldset + legend pattern, hint text, and
 * inline error handling with the yellow error border and red error message.
 */
import React from 'react';

export interface GovUkDateValue {
  day: string;
  month: string;
  year: string;
}

interface GovUkDateInputProps {
  id: string;
  legend: string;
  hint?: string;
  error?: string;
  value: GovUkDateValue;
  onChange: (v: GovUkDateValue) => void;
  /** Marks the fieldset as a page-level heading (h1). Default false. */
  asPageHeading?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  fieldset: {
    border: 0,
    margin: 0,
    padding: 0,
    minWidth: 0
  },
  legend: {
    display: 'table',
    maxWidth: '100%',
    marginBottom: 8,
    whiteSpace: 'normal',
    color: '#0b0c0c',
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 700,
    fontSize: 19,
    lineHeight: '1.3'
  },
  legendH1: {
    fontSize: 32,
    lineHeight: '1.25'
  },
  hint: {
    display: 'block',
    marginBottom: 10,
    color: '#505a5f',
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontSize: 19,
    lineHeight: '1.3'
  },
  errorMessage: {
    display: 'block',
    marginBottom: 15,
    color: '#d4351c',
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 700,
    fontSize: 19,
    lineHeight: '1.3'
  },
  errorVisuallyHidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: 0,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap'
  },
  itemsWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    alignItems: 'flex-end'
  },
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'block',
    marginBottom: 5,
    color: '#0b0c0c',
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 400,
    fontSize: 19,
    lineHeight: '1.3',
    cursor: 'pointer'
  },
  inputBase: {
    appearance: 'none',
    fontFamily: '"GDS Transport", Arial, sans-serif',
    fontWeight: 400,
    fontSize: 19,
    lineHeight: '1.3',
    color: '#0b0c0c',
    background: '#ffffff',
    border: '2px solid #0b0c0c',
    borderRadius: 0,
    padding: '5px 4px 4px',
    outline: 'none',
    boxSizing: 'border-box',
    MozAppearance: 'textfield' as any
  },
  inputError: {
    borderColor: '#d4351c'
  },
  inputDay: { width: 50 },
  inputMonth: { width: 50 },
  inputYear: { width: 74 },
  formGroup: {
    marginBottom: 30
  },
  formGroupError: {
    paddingLeft: 15,
    borderLeft: '4px solid #d4351c'
  }
};

export default function GovUkDateInput({
  id,
  legend,
  hint,
  error,
  value,
  onChange,
  asPageHeading = false
}: GovUkDateInputProps) {
  const hasError = !!error;

  const handleChange =
    (field: keyof GovUkDateValue) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...value, [field]: e.target.value });
    };

  const inputStyle = (extra: React.CSSProperties): React.CSSProperties => ({
    ...styles.inputBase,
    ...(hasError ? styles.inputError : {}),
    ...extra
  });

  const legendStyle: React.CSSProperties = asPageHeading
    ? { ...styles.legend, ...styles.legendH1 }
    : styles.legend;

  const groupStyle: React.CSSProperties = hasError
    ? { ...styles.formGroup, ...styles.formGroupError }
    : styles.formGroup;

  return (
    <div style={groupStyle}>
      <fieldset style={styles.fieldset} aria-describedby={hint ? `${id}-hint` : undefined}>
        <legend style={legendStyle}>
          {asPageHeading ? <h1 style={{ margin: 0, fontWeight: 'inherit', fontSize: 'inherit', lineHeight: 'inherit' }}>{legend}</h1> : legend}
        </legend>

        {hint && (
          <div id={`${id}-hint`} className="govuk-hint" style={styles.hint}>
            {hint}
          </div>
        )}

        {hasError && (
          <p id={`${id}-error`} style={styles.errorMessage} role="alert">
            <span style={styles.errorVisuallyHidden}>Error:</span> {error}
          </p>
        )}

        <div style={styles.itemsWrapper}>
          {/* Day */}
          <div style={styles.item}>
            <label htmlFor={`${id}-day`} style={styles.label}>
              Day
            </label>
            <input
              id={`${id}-day`}
              name={`${id}-day`}
              type="text"
              inputMode="numeric"
              autoComplete="bday-day"
              pattern="[0-9]*"
              maxLength={2}
              value={value.day}
              onChange={handleChange('day')}
              aria-describedby={hasError ? `${id}-error` : undefined}
              style={inputStyle(styles.inputDay)}
            />
          </div>

          {/* Month */}
          <div style={styles.item}>
            <label htmlFor={`${id}-month`} style={styles.label}>
              Month
            </label>
            <input
              id={`${id}-month`}
              name={`${id}-month`}
              type="text"
              inputMode="numeric"
              autoComplete="bday-month"
              pattern="[0-9]*"
              maxLength={2}
              value={value.month}
              onChange={handleChange('month')}
              aria-describedby={hasError ? `${id}-error` : undefined}
              style={inputStyle(styles.inputMonth)}
            />
          </div>

          {/* Year */}
          <div style={styles.item}>
            <label htmlFor={`${id}-year`} style={styles.label}>
              Year
            </label>
            <input
              id={`${id}-year`}
              name={`${id}-year`}
              type="text"
              inputMode="numeric"
              autoComplete="bday-year"
              pattern="[0-9]*"
              maxLength={4}
              value={value.year}
              onChange={handleChange('year')}
              aria-describedby={hasError ? `${id}-error` : undefined}
              style={inputStyle(styles.inputYear)}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
