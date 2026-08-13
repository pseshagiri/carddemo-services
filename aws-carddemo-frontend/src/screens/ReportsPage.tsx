/**
 * ReportsPage — transaction report built from transaction-service + account-service
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PageHeader from '../components/PageHeader';
import GovUkFormGroup, { govUkInputStyle } from '../components/GovUkFormGroup';
import GovUkDateInput, { type GovUkDateValue } from '../components/GovUkDateInput';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import { getTransactionReport, type ReportSummary } from '../api/reportsApi';

interface FormValues {
  accountId: string;
}

const gds = { green: '#00703c', white: '#ffffff', blue: '#1d70b8', borderGrey: '#b1b4b6', black: '#0b0c0c' };

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19,
  cursor: 'pointer', borderRadius: 0, boxShadow: `0 2px 0 #002d18`,
};

const summaryRow: React.CSSProperties = { display: 'flex', borderBottom: `1px solid ${gds.borderGrey}`, padding: '8px 0' };
const summaryKey: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, fontWeight: 700, color: gds.black, width: 200, flexShrink: 0, margin: 0 };
const summaryVal: React.CSSProperties = { fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 16, color: gds.black, margin: 0, flexGrow: 1 };

export default function ReportsPage() {
  const { register, handleSubmit } = useForm<FormValues>();
  const [dateFrom, setDateFrom] = useState<GovUkDateValue>({ day: '', month: '', year: '' });
  const [dateTo, setDateTo] = useState<GovUkDateValue>({ day: '', month: '', year: '' });
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (values: FormValues) => {
    if (!values.accountId) return;
    const startDate = `${dateFrom.year}-${dateFrom.month.padStart(2, '0')}-${dateFrom.day.padStart(2, '0')}`;
    const endDate = `${dateTo.year}-${dateTo.month.padStart(2, '0')}-${dateTo.day.padStart(2, '0')}`;
    setLoading(true);
    setError('');
    setReport(null);
    try {
      const result = await getTransactionReport(values.accountId, startDate, endDate);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Online Report Request"
        caption="Reporting"
        subtitle="Filter and preview transaction reports by date range and account."
      />

      <div style={{ maxWidth: 560 }}>
        <div style={{ borderLeft: `10px solid ${gds.borderGrey}`, padding: '15px 20px', marginBottom: 30 }}>
          <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: 0 }}>
            Enter the date range and account ID for the report.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <GovUkDateInput id="dateFrom" legend="Date from" hint="For example, 3 1 2025" value={dateFrom} onChange={setDateFrom} />
          <GovUkDateInput id="dateTo" legend="Date to" hint="For example, 31 3 2025" value={dateTo} onChange={setDateTo} />

          <GovUkFormGroup id="accountId" label="Account ID" hint="Required — numeric account ID.">
            <input id="accountId" type="text" inputMode="numeric" style={govUkInputStyle()} {...register('accountId', { required: true })} />
          </GovUkFormGroup>

          <button type="submit" style={btnPrimary} disabled={loading}>
            {loading ? 'Running…' : 'Run report'}
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner label="Generating report…" />}
      {error && <ErrorBanner message={error} />}

      {report && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 24, color: gds.black, marginBottom: 16 }}>
            Report: Account {report.accountNumber}
          </h2>
          <dl style={{ margin: 0 }}>
            <div style={summaryRow}><dt style={summaryKey}>Account number</dt><dd style={summaryVal}>{report.accountNumber}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Period</dt><dd style={summaryVal}>{report.periodStart} → {report.periodEnd}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Current balance</dt><dd style={summaryVal}>${Number(report.currentBalance ?? 0).toFixed(2)}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Credit limit</dt><dd style={summaryVal}>${Number(report.creditLimit ?? 0).toLocaleString()}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Available credit</dt><dd style={summaryVal}>${Number(report.availableCredit ?? 0).toFixed(2)}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Total debits</dt><dd style={summaryVal}>${Number(report.totalDebits ?? 0).toFixed(2)}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Total credits</dt><dd style={summaryVal}>${Number(report.totalCredits ?? 0).toFixed(2)}</dd></div>
            <div style={summaryRow}><dt style={summaryKey}>Transactions</dt><dd style={summaryVal}>{report.transactionCount}</dd></div>
            {Object.entries(report.summaryByType).map(([type, summary]) => (
              <div key={type} style={summaryRow}>
                <dt style={summaryKey}>{type}</dt>
                <dd style={summaryVal}>{summary.count} × ${Number(summary.totalAmount).toFixed(2)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
