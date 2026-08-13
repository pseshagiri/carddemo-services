/**
 * AccountListPage — GET /api/accounts
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getAllAccounts, type AccountResponse } from '../api/accountsApi';

const linkStyle: React.CSSProperties = {
  color: '#1d70b8',
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontSize: 19,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'underline',
};

export default function AccountListPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllAccounts()
      .then((page) => setAccounts(page.content))
      .catch((err) => setError(err.message ?? 'Failed to load accounts.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading accounts…" />;

  return (
    <div>
      <PageHeader
        title="Account List"
        caption="Account Management"
        subtitle="Browse and review account records."
      />
      {error && <ErrorBanner message={error} />}
      <DataTable
        caption="All accounts"
        columns={[
          { key: 'accountNumber', header: 'Account number' },
          { key: 'customerNumber', header: 'Customer number' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <strong style={{ color: row.status === 'ACTIVE' ? '#00703c' : '#d4351c' }}>
                {row.status}
              </strong>
            ),
          },
          {
            key: 'currentBalance',
            header: 'Current balance',
            render: (row) => `$${Number(row.currentBalance).toFixed(2)}`,
          },
          {
            key: 'creditLimit',
            header: 'Credit limit',
            render: (row) => `$${Number(row.creditLimit).toLocaleString()}`,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: (row) => (
              <button style={linkStyle} onClick={() => navigate(`/accounts/${row.id}`)}>
                View<span className="govuk-visually-hidden"> account {row.accountNumber}</span>
              </button>
            ),
          },
        ]}
        rows={accounts}
      />
    </div>
  );
}
