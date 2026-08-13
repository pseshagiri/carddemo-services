/**
 * CardDetailPage — GET /api/cards/{id}
 */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getCardById, type CardResponse } from '../api/cardsApi';

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  blue: '#1d70b8',
  green: '#00703c',
  red: '#d4351c',
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
  boxShadow: `0 2px 0 #003078`,
};

const summaryRow: React.CSSProperties = { display: 'flex', borderBottom: `1px solid ${gds.borderGrey}`, padding: '10px 0' };
const summaryKey: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, fontWeight: 700, color: gds.black, width: 200, flexShrink: 0, margin: 0 };
const summaryVal: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: 0, flexGrow: 1 };

export default function CardDetailPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cardId) return;
    getCardById(cardId)
      .then(setCard)
      .catch((err) => setError(err.message ?? 'Failed to load card.'))
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) return <LoadingSpinner label="Loading card…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!card) return <ErrorBanner message="Card not found." />;

  return (
    <div>
      <PageHeader
        title="Card Detail"
        caption="Card Management"
        subtitle="Display card, account, and customer details."
        actions={
          <button style={btnPrimary} onClick={() => navigate(`/cards/${card.id}/edit`)}>
            Update card
          </button>
        }
      />

      <dl style={{ margin: 0 }}>
        <div style={summaryRow}>
          <dt style={summaryKey}>Card number</dt>
          <dd style={summaryVal}>{card.cardMasked}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Account number</dt>
          <dd style={summaryVal}>{card.accountNumber}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Cardholder name</dt>
          <dd style={summaryVal}>{card.cardHolderName}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Card type</dt>
          <dd style={summaryVal}>{card.cardType}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Network</dt>
          <dd style={summaryVal}>{card.network}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Status</dt>
          <dd style={{ ...summaryVal, color: card.status === 'ACTIVE' ? gds.green : gds.red, fontWeight: 700 }}>
            {card.status}
          </dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Expiry date</dt>
          <dd style={summaryVal}>{String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Daily limit</dt>
          <dd style={summaryVal}>${Number(card.dailyLimit).toLocaleString()}</dd>
        </div>
        <div style={summaryRow}>
          <dt style={summaryKey}>Issued at</dt>
          <dd style={summaryVal}>{card.issuedAt}</dd>
        </div>
      </dl>
    </div>
  );
}
