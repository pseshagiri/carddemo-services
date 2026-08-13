/**
 * AccountEditPage — PATCH /api/accounts/{id}/credit-limit + activate/suspend/close
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle, govUkSelectStyle } from '../components/GovUkFormGroup';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import {
  getAccountById,
  updateCreditLimit,
  activateAccount,
  suspendAccount,
  closeAccount,
  type AccountResponse,
} from '../api/accountsApi';

interface FormValues {
  creditLimit: string;
  activeStatus: string;
}

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  green: '#00703c',
  grey1: '#f3f2f1',
  borderGrey: '#b1b4b6',
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
  cursor: 'pointer',
  borderRadius: 0,
  boxShadow: `0 2px 0 #002d18`,
};

export default function AccountEditPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (!accountId) return;
    getAccountById(accountId)
      .then((a) => {
        setAccount(a);
        reset({
          creditLimit: String(a.creditLimit),
          activeStatus: a.status,
        });
      })
      .catch((err) => setLoadError(err.message ?? 'Failed to load account.'));
  }, [accountId, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!accountId) return;
    setSaving(true);
    setSaveError('');
    try {
      // Update credit limit if changed
      const newLimit = parseFloat(values.creditLimit);
      if (account && newLimit !== account.creditLimit) {
        await updateCreditLimit(accountId, newLimit);
      }
      // Update status via dedicated PATCH endpoints
      if (account && values.activeStatus !== account.status) {
        if (values.activeStatus === 'ACTIVE') await activateAccount(accountId);
        else if (values.activeStatus === 'SUSPENDED') await suspendAccount(accountId);
        else if (values.activeStatus === 'CLOSED') await closeAccount(accountId);
      }
      navigate(`/accounts/${accountId}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <ErrorBanner message={loadError} />;
  if (!account) return <LoadingSpinner label="Loading account…" />;

  return (
    <div>
      <PageHeader title="Update Account" caption="Account Management" subtitle="Maintain account attributes." />

      {saveError && <ErrorBanner message={saveError} />}

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkFormGroup id="creditLimit" label="Credit limit" hint="Enter the credit limit in US dollars.">
            <input id="creditLimit" type="text" inputMode="numeric" style={govUkInputStyle()} {...register('creditLimit')} />
          </GovUkFormGroup>

          <GovUkFormGroup id="activeStatus" label="Account status">
            <select id="activeStatus" style={govUkSelectStyle()} {...register('activeStatus')}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="CLOSED">Closed</option>
            </select>
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
