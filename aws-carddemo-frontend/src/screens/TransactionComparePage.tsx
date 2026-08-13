/**
 * TransactionComparePage — compares two live transactions fetched by ID
 */
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getTransactionById, type TransactionResponse } from '../api/transactionsApi';

const gds = {
  black: '#0b0c0c',
  blue: '#1d70b8',
  white: '#ffffff',
  borderGrey: '#b1b4b6',
  grey1: '#f3f2f1',
  green: '#00703c',
};

const summaryRow: React.CSSProperties = { display: 'flex', borderBottom: `1px solid ${gds.borderGrey}`, padding: '8px 0' };
const summaryKey: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, fontWeight: 700, color: gds.black, width: 140, flexShrink: 0, margin: 0 };
const summaryVal: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, color: gds.black, margin: 0, flexGrow: 1 };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700,
  fontSize: 19, cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

function txRows(tx: TransactionResponse) {
  return [
    { label: 'ID', value: String(tx.id) },
    { label: 'Transaction ID', value: tx.transactionId },
    { label: 'Amount', value: `$${Number(tx.amount).toFixed(2)}` },
    { label: 'Currency', value: tx.currency },
    { label: 'Type', value: tx.type },
    { label: 'Status', value: tx.status },
    { label: 'Card', value: tx.cardMasked ?? '—' },
    { label: 'Date / time', value: tx.occurredAt },
    { label: 'Merchant', value: tx.merchantName ?? '—' },
  ];
}

export default function TransactionComparePage() {
  const [idA, setIdA] = useState('');
  const [idB, setIdB] = useState('');
  const [txA, setTxA] = useState<TransactionResponse | null>(null);
  const [txB, setTxB] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idA || !idB) return;
    setLoading(true);
    setError('');
    try {
      const [a, b] = await Promise.all([getTransactionById(idA), getTransactionById(idB)]);
      setTxA(a);
      setTxB(b);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Transaction Comparison" caption="Transaction Processing" subtitle="Compare two transactions side by side." />

      <form onSubmit={handleCompare} noValidate style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
        <GovUkFormGroup id="txIdA" label="Transaction A — ID">
          <input id="txIdA" type="text" inputMode="numeric" style={{ ...govUkInputStyle(), maxWidth: 180 }} value={idA} onChange={(e) => setIdA(e.target.value)} />
        </GovUkFormGroup>
        <GovUkFormGroup id="txIdB" label="Transaction B — ID">
          <input id="txIdB" type="text" inputMode="numeric" style={{ ...govUkInputStyle(), maxWidth: 180 }} value={idB} onChange={(e) => setIdB(e.target.value)} />
        </GovUkFormGroup>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 20 }}>
          <button type="submit" style={btnPrimary} disabled={loading}>Compare</button>
        </div>
      </form>

      {loading && <LoadingSpinner label="Loading transactions…" />}
      {error && <ErrorBanner message={error} />}

      {txA && txB && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {([{ label: 'Transaction A', tx: txA }, { label: 'Transaction B', tx: txB }] as const).map(({ label, tx }) => (
            <div key={label} style={{ flex: '1 1 280px', border: `1px solid ${gds.borderGrey}`, borderTop: `5px solid ${gds.blue}`, padding: '16px 20px', background: gds.white }}>
              <h2 style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 22, color: gds.black, margin: '0 0 16px' }}>
                {label}
              </h2>
              <dl style={{ margin: 0 }}>
                {txRows(tx).map((r) => (
                  <div key={r.label} style={summaryRow}>
                    <dt style={summaryKey}>{r.label}</dt>
                    <dd style={summaryVal}>{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
