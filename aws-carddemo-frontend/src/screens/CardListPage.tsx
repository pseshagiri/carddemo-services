/**
 * CardListPage — GET /api/cards/account/{accountId}
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';
import { getCardsByAccount, type CardResponse } from '../api/cardsApi';

const gds = {
  green: '#00703c', white: '#ffffff', blue: '#1d70b8', black: '#0b0c0c', borderGrey: '#b1b4b6',
};

const linkStyle: React.CSSProperties = {
  color: gds.blue,
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontSize: 19,
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'underline',
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700,
  fontSize: 19, cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

export default function CardListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [accountIdInput, setAccountIdInput] = useState(searchParams.get('accountId') ?? '');
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const accountId = searchParams.get('accountId');

  useEffect(() => {
    if (!accountId) return;
    setLoading(true);
    setError('');
    getCardsByAccount(accountId)
      .then((list) => setCards(list))
      .catch((err) => setError(err.message ?? 'Failed to load cards.'))
      .finally(() => setLoading(false));
  }, [accountId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (accountIdInput.trim()) {
      setSearchParams({ accountId: accountIdInput.trim() });
    }
  };

  return (
    <div>
      <PageHeader title="Card List" caption="Card Management" subtitle="Browse and review card records." />

      {/* Account ID search bar */}
      <form onSubmit={handleSearch} noValidate style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        <GovUkFormGroup id="cardAccountId" label="Account ID" hint="Enter an account ID to view its cards.">
          <input
            id="cardAccountId"
            type="text"
            inputMode="numeric"
            style={{ ...govUkInputStyle(), maxWidth: 220 }}
            value={accountIdInput}
            onChange={(e) => setAccountIdInput(e.target.value)}
          />
        </GovUkFormGroup>
        <button type="submit" style={{ ...btnPrimary, marginBottom: 20 }}>Search</button>
      </form>

      {loading && <LoadingSpinner label="Loading cards…" />}
      {error && <ErrorBanner message={error} />}

      {!loading && accountId && (
        <DataTable
          caption={`Cards for account ${accountId}`}
          columns={[
            { key: 'cardMasked', header: 'Card number' },
            { key: 'accountNumber', header: 'Account number' },
            { key: 'cardHolderName', header: 'Cardholder name' },
            {
              key: 'status',
              header: 'Status',
              render: (row) => (
                <strong style={{ color: row.status === 'ACTIVE' ? gds.green : '#d4351c' }}>
                  {row.status}
                </strong>
              ),
            },
            {
              key: 'expiry',
              header: 'Expiry',
              render: (row) => `${String(row.expiryMonth).padStart(2, '0')}/${row.expiryYear}`,
            },
            {
              key: 'actions',
              header: 'Actions',
              render: (row) => (
                <button style={linkStyle} onClick={() => navigate(`/cards/${row.id}`)}>
                  View
                </button>
              ),
            },
          ]}
          rows={cards}
        />
      )}

      {!loading && !accountId && (
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: '#505a5f' }}>
          Enter an account ID above to view its cards.
        </p>
      )}
    </div>
  );
}
