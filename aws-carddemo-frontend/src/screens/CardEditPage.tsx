/**
 * CardEditPage — PATCH /api/cards/{id}/activate | block | daily-limit
 */
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle, govUkSelectStyle } from '../components/GovUkFormGroup';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getCardById, activateCard, blockCard, updateDailyLimit, type CardResponse } from '../api/cardsApi';

interface FormValues {
  activeStatus: string;
  dailyLimit: string;
}

const gds = { black: '#0b0c0c', white: '#ffffff', green: '#00703c' };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700,
  fontSize: 19, cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

export default function CardEditPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardResponse | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (!cardId) return;
    getCardById(cardId)
      .then((c) => {
        setCard(c);
        reset({
          activeStatus: c.status,
          dailyLimit: String(c.dailyLimit),
        });
      })
      .catch((err) => setLoadError(err.message ?? 'Failed to load card.'));
  }, [cardId, reset]);

  const onSubmit = async (values: FormValues) => {
    if (!cardId) return;
    setSaving(true);
    setSaveError('');
    try {
      // Update status via dedicated PATCH endpoints
      if (card && values.activeStatus !== card.status) {
        if (values.activeStatus === 'ACTIVE') await activateCard(cardId);
        else if (values.activeStatus === 'BLOCKED') await blockCard(cardId);
      }
      // Update daily limit if changed
      const newLimit = parseFloat(values.dailyLimit);
      if (card && !isNaN(newLimit) && newLimit !== card.dailyLimit) {
        await updateDailyLimit(cardId, newLimit);
      }
      navigate(`/cards/${cardId}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <ErrorBanner message={loadError} />;
  if (!card) return <LoadingSpinner label="Loading card…" />;

  return (
    <div>
      <PageHeader title="Update Card" caption="Card Management" subtitle="Maintain card attributes." />
      {saveError && <ErrorBanner message={saveError} />}

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkFormGroup id="activeStatus" label="Card status">
            <select id="activeStatus" style={govUkSelectStyle()} {...register('activeStatus')}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </GovUkFormGroup>

          <GovUkFormGroup id="dailyLimit" label="Daily spending limit" hint="Maximum amount per day in US dollars.">
            <input id="dailyLimit" type="text" inputMode="decimal" style={govUkInputStyle()} {...register('dailyLimit')} />
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
