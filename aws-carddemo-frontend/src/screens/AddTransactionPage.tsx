/**
 * AddTransactionPage — POST /api/transactions
 */
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle, govUkSelectStyle } from '../components/GovUkFormGroup';
import ErrorBanner from '../components/ErrorBanner';
import { useState } from 'react';
import { createTransaction } from '../api/transactionsApi';

interface FormValues {
  accountId: string;
  accountNumber: string;
  customerId: string;
  amount: string;
  currency: string;
  typeCode: string;
  merchantCategory: string;
  description: string;
  merchantName: string;
}

const gds = { green: '#00703c', white: '#ffffff' };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19,
  cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

export default function AddTransactionPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    setApiError('');
    try {
      await createTransaction({
        accountId: parseInt(values.accountId, 10),
        accountNumber: values.accountNumber,
        customerId: parseInt(values.customerId, 10),
        type: values.typeCode as 'PURCHASE' | 'REFUND' | 'PAYMENT' | 'CASH_ADVANCE',
        amount: parseFloat(values.amount),
        currency: values.currency || 'USD',
        merchantName: values.merchantName || undefined,
        merchantCategory: values.merchantCategory || undefined,
        description: values.description || undefined,
      });
      navigate('/transactions');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to submit transaction.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Transaction" caption="Transaction Processing" subtitle="Create a new online transaction." />
      {apiError && <ErrorBanner message={apiError} />}

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkFormGroup id="accountId" label="Account ID" hint="Numeric account ID." error={errors.accountId ? 'Account ID is required' : undefined}>
            <input id="accountId" type="text" inputMode="numeric" style={govUkInputStyle(!!errors.accountId)} {...register('accountId', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="accountNumber" label="Account number" hint="Account number string (e.g. 1234567890)." error={errors.accountNumber ? 'Account number is required' : undefined}>
            <input id="accountNumber" type="text" style={govUkInputStyle(!!errors.accountNumber)} {...register('accountNumber', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="customerId" label="Customer ID" hint="Numeric customer ID." error={errors.customerId ? 'Customer ID is required' : undefined}>
            <input id="customerId" type="text" inputMode="numeric" style={govUkInputStyle(!!errors.customerId)} {...register('customerId', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="amount" label="Amount" hint="Enter amount in dollars, e.g. 12.50." error={errors.amount ? 'Amount is required' : undefined}>
            <input id="amount" type="text" inputMode="decimal" style={govUkInputStyle(!!errors.amount)} {...register('amount', { required: true })} />
          </GovUkFormGroup>

          <GovUkFormGroup id="currency" label="Currency" hint="3-letter ISO code, e.g. USD.">
            <input id="currency" type="text" maxLength={3} defaultValue="USD" style={{ ...govUkInputStyle(), maxWidth: 100 }} {...register('currency')} />
          </GovUkFormGroup>

          <GovUkFormGroup id="typeCode" label="Transaction type">
            <select id="typeCode" style={govUkSelectStyle()} defaultValue="PURCHASE" {...register('typeCode')}>
              <option value="PURCHASE">Purchase</option>
              <option value="REFUND">Refund</option>
              <option value="PAYMENT">Payment</option>
              <option value="CASH_ADVANCE">Cash Advance</option>
            </select>
          </GovUkFormGroup>

          <GovUkFormGroup id="merchantCategory" label="Merchant category" hint="Category description, e.g. GROCERIES.">
            <input id="merchantCategory" type="text" style={govUkInputStyle()} {...register('merchantCategory')} />
          </GovUkFormGroup>

          <GovUkFormGroup id="description" label="Description">
            <input id="description" type="text" style={{ ...govUkInputStyle(), maxWidth: '100%' }} {...register('description')} />
          </GovUkFormGroup>

          <GovUkFormGroup id="merchantName" label="Merchant name">
            <input id="merchantName" type="text" style={govUkInputStyle()} {...register('merchantName')} />
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary} disabled={saving}>
            {saving ? 'Submitting…' : 'Submit transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
