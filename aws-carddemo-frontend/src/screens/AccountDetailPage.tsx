/**
 * AccountDetailPage — GET /api/accounts/{id}
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getAccountById, type AccountResponse } from '../api/accountsApi';

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  blue: '#1d70b8',
  green: '#00703c',
  red: '#d4351c',
  grey1: '#f3f2f1',
  borderGrey: '#b1b4b6',
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-block',
  background: gds.blue,
  color: gds.white,
  border: `2px solid transparent`,
  padding: '8px 22px 7px',
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontWeight: 700,
  fontSize: 16,
  cursor: 'pointer',
  borderRadius: 0,
  marginRight: 10,
  boxShadow: `0 2px 0 #003078`,
};

const btnSecondary: React.CSSProperties = {
  ...btnPrimary,
  background: gds.grey1,
  color: gds.black,
  boxShadow: `0 2px 0 ${gds.borderGrey}`,
};

const summaryRow: React.CSSProperties = {
  display: 'flex',
  borderBottom: `1px solid ${gds.borderGrey}`,
  padding: '10px 0',
};
const summaryKey: React.CSSProperties = {
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontSize: 19,
  fontWeight: 700,
  color: gds.black,
  width: 200,
  flexShrink: 0,
  margin: 0,
};
const summaryVal: React.CSSProperties = {
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontSize: 19,
  color: gds.black,
  margin: 0,
  flexGrow: 1,
};

export default function AccountDetailPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getAccountById(accountId)
      .then(setAccount)
      .catch((err) => setError(err.message ?? 'Failed to load account.'))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return <LoadingSpinner label="Loading account…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!account) return <ErrorBanner message="Account not found." />;

  return (
    <div>
      <PageHeader
        title={`Account ${account.accountNumber}`}
        caption="Account Management"
        subtitle="Display full account and customer context."
        actions={
          <div>
            <button style={btnPrimary} onClick={() => navigate(`/accounts/${account.id}/edit`)}>
              Update account
            </button>
            <button style={btnSecondary} onClick={() => navigate(`/accounts/${account.id}/balance`)}>
              Balance summary
            </button>
          </div>
        }
      />

      <dl style={{ margin: 0 }}>
        <div style={summaryRow}>
          <dt style={summaryKey}>Customer number</dt>
          <dd style={summaryVal}>{account.customerNumber}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Account type</dt>
          <dd style={summaryVal}>{account.type}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Status</dt>
          <dd style={{ ...summaryVal, color: account.status === 'ACTIVE' ? gds.green : gds.red, fontWeight: 700 }}>
            {account.status}
          </dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Current balance</dt>
          <dd style={summaryVal}>${Number(account.currentBalance).toFixed(2)}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Credit limit</dt>
          <dd style={summaryVal}>${Number(account.creditLimit).toLocaleString()}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Available credit</dt>
          <dd style={summaryVal}>${Number(account.availableCredit).toFixed(2)}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Interest rate</dt>
          <dd style={summaryVal}>{account.interestRate}%</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Currency</dt>
          <dd style={summaryVal}>{account.currency}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Created</dt>
          <dd style={summaryVal}>{account.createdAt}</dd>
        </div>
      </dl>
    </div>
  );
}
