/**
 * TransactionListPage — GET /api/transactions/account/{accountId}
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';
import { getTransactionsByAccount, type TransactionResponse } from '../api/transactionsApi';

const gds = { green: '#00703c', white: '#ffffff', blue: '#1d70b8', grey1: '#f3f2f1', borderGrey: '#b1b4b6', black: '#0b0c0c' };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 18px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 16,
  cursor: 'pointer', borderRadius: 0, marginRight: 8, boxShadow: `0 2px 0 #002d18`,
};
const btnSecondary: React.CSSProperties = {
  ...btnPrimary, background: gds.grey1, color: gds.black, boxShadow: `0 2px 0 ${gds.borderGrey}`,
};

function formatType(type: string): string {
  return type
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

export default function TransactionListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [accountIdInput, setAccountIdInput] = useState(searchParams.get('accountId') ?? '');
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accountId = searchParams.get('accountId');

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    setError('');
    getTransactionsByAccount(accountId)
      .then((page) => setTransactions(page.content))
      .catch((err) => setError(err.message ?? 'Failed to load transactions.'))
      .finally(() => setLoading(false));
  }, [accountId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountIdInput.trim()) setSearchParams({ accountId: accountIdInput.trim() });
  };

  return (
    <div>
      <PageHeader
        title="Transaction List"
        caption="Transaction Processing"
        subtitle="Browse transaction history."
        actions={
          <div>
            <button style={btnPrimary} onClick={() => navigate('/transactions/add')}>Add transaction</button>
            <button style={btnSecondary} onClick={() => navigate('/transactions/compare')}>Compare transactions</button>
          </div>
        }
      />

      {/* Account search */}
      <form onSubmit={handleSearch} noValidate style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <GovUkFormGroup id="txnAccountId" label="Account ID" hint="Enter an account ID to view its transactions.">
          <input
            id="txnAccountId"
            type="text"
            inputMode="numeric"
            style={{ ...govUkInputStyle(), maxWidth: 220 }}
            value={accountIdInput}
            onChange={(e) => setAccountIdInput(e.target.value)}
          />
        </GovUkFormGroup>
        <button type="submit" style={{ ...btnPrimary, marginBottom: 20 }}>Search</button>
      </form>

      {loading && <LoadingSpinner label="Loading transactions…" />}
      {error && <ErrorBanner message={error} />}

      {!loading && accountId && (
        <DataTable
          caption={`Transactions for account ${accountId}`}
          columns={[
            { key: 'referenceId', header: 'Reference' },
            {
              key: 'amount',
              header: 'Amount',
              render: (row) => `$${Number(row.amount).toFixed(2)}`,
            },
            {
              key: 'type',
              header: 'Type',
              render: (row) => formatType(row.type),
            },
            { key: 'occurredAt', header: 'Date / time' },
            { key: 'cardMasked', header: 'Card number' },
            { key: 'merchantName', header: 'Merchant' },
            { key: 'status', header: 'Status' },
          ]}
          rows={transactions}
        />
      )}

      {!loading && !accountId && (
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: '#505a5f' }}>
          Enter an account ID above to view its transactions.
        </p>
      )}
    </div>
  );
}
