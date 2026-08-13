/**
 * AccountBalancePage — GET /api/accounts/{id}
 * Shows the account's current balance and credit summary.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getAccountById, type AccountResponse } from '../api/accountsApi';

const gds = {
  black: '#0b0c0c',
  blue: '#1d70b8',
  white: '#ffffff',
  borderGrey: '#b1b4b6',
};

export default function AccountBalancePage() {
  const { accountId } = useParams();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getAccountById(accountId)
      .then(setAccount)
      .catch((err) => setError(err.message ?? 'Failed to load balance.'))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return <LoadingSpinner label="Loading balance…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!account) return <ErrorBanner message="Account not found." />;

  const balanceItems = [
    {
      label: 'Current Balance',
      value: `$${Number(account.currentBalance).toFixed(2)}`,
      desc: 'Total outstanding balance on the account.',
    },
    {
      label: 'Available Credit',
      value: `$${Number(account.availableCredit).toFixed(2)}`,
      desc: 'Remaining available credit.',
    },
    {
      label: 'Credit Limit',
      value: `$${Number(account.creditLimit).toLocaleString()}`,
      desc: 'Maximum approved credit limit.',
    },
    {
      label: 'Interest Rate',
      value: `${account.interestRate}%`,
      desc: 'Annual interest rate on the account.',
    },
  ];

  return (
    <div>
      <PageHeader
        title="Balance Summary"
        caption="Account Management"
        subtitle="Current balance and credit details."
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {balanceItems.map((item) => (
          <div
            key={item.label}
            style={{
              background: gds.white,
              border: `1px solid ${gds.borderGrey}`,
              borderTop: `5px solid ${gds.blue}`,
              padding: '20px 24px',
              minWidth: 220,
              flex: '1 1 220px',
            }}
          >
            <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, color: '#505a5f', margin: '0 0 4px', lineHeight: '1.3' }}>
              {item.label}
            </p>
            <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 36, color: gds.black, margin: '0 0 8px', lineHeight: '1.1' }}>
              {item.value}
            </p>
            <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, color: '#505a5f', margin: 0 }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
