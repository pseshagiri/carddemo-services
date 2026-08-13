/**
 * AddCustomerPage — POST /api/customers
 *
 * Note: The new customer-service requires identityUserId (from identity-service).
 * Users must provide the identity user ID from a previously registered user.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';
import GovUkDateInput, { type GovUkDateValue } from '../components/GovUkDateInput';
import ErrorBanner from '../components/ErrorBanner';
import { createCustomer } from '../api/customersApi';

interface FormValues {
  identityUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  annualIncome: string;
}

const gds = { green: '#00703c', white: '#ffffff' };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19,
  cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

export default function AddCustomerPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();
  const [dob, setDob] = useState<GovUkDateValue>({ day: '', month: '', year: '' });
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    setApiError('');
    try {
      await createCustomer({
        identityUserId: parseInt(values.identityUserId, 10),
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        nationalId: values.nationalId || undefined,
        annualIncome: values.annualIncome ? parseFloat(values.annualIncome) : undefined,
        dateOfBirth:
          dob.year && dob.month && dob.day
            ? `${dob.year}-${dob.month.padStart(2, '0')}-${dob.day.padStart(2, '0')}`
            : undefined,
      });
      navigate('/customers/confirmation');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to save customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Customer" caption="Customer Management" subtitle="Create a new customer record." />
      {apiError && <ErrorBanner message={apiError} />}

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkFormGroup
            id="identityUserId"
            label="Identity User ID"
            hint="Numeric user ID from the identity service (registered user)."
            error={errors.identityUserId ? 'Identity User ID is required' : undefined}
          >
            <input id="identityUserId" type="text" inputMode="numeric" style={govUkInputStyle(!!errors.identityUserId)} {...register('identityUserId', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="firstName" label="First name" error={errors.firstName ? 'First name is required' : undefined}>
            <input id="firstName" type="text" autoComplete="given-name" style={govUkInputStyle(!!errors.firstName)} {...register('firstName', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="lastName" label="Last name" error={errors.lastName ? 'Last name is required' : undefined}>
            <input id="lastName" type="text" autoComplete="family-name" style={govUkInputStyle(!!errors.lastName)} {...register('lastName', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="email" label="Email address" error={errors.email ? 'Email is required' : undefined}>
            <input id="email" type="email" autoComplete="email" style={govUkInputStyle(!!errors.email)} {...register('email', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="phone" label="Phone number" hint="International format, e.g. +12125551234.">
            <input id="phone" type="tel" style={govUkInputStyle()} {...register('phone')} />
          </GovUkFormGroup>

          <GovUkFormGroup id="nationalId" label="National ID / SSN" hint="9-digit SSN or national identifier.">
            <input id="nationalId" type="text" inputMode="numeric" maxLength={11} style={{ ...govUkInputStyle(), maxWidth: 180 }} {...register('nationalId')} />
          </GovUkFormGroup>

          <GovUkDateInput id="dob" legend="Date of birth" hint="For example, 31 3 1980" value={dob} onChange={setDob} />

          <GovUkFormGroup id="annualIncome" label="Annual income" hint="Gross annual income in USD.">
            <input id="annualIncome" type="text" inputMode="decimal" style={{ ...govUkInputStyle(), maxWidth: 180 }} {...register('annualIncome')} />
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary} disabled={saving}>
            {saving ? 'Saving…' : 'Save customer'}
          </button>
        </form>
      </div>
    </div>
  );
}
