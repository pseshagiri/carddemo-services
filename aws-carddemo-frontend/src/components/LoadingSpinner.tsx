/**
 * LoadingSpinner — inline GOV.UK-flavoured spinner
 */
export default function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '24px 0' }}
    >
      <svg
        aria-hidden="true"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        style={{ animation: 'spin 0.8s linear infinite' }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <circle
          cx="14"
          cy="14"
          r="11"
          fill="none"
          stroke="#b1b4b6"
          strokeWidth="3"
        />
        <path
          d="M14 3 a11 11 0 0 1 11 11"
          fill="none"
          stroke="#1d70b8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontSize: 19,
          color: '#505a5f',
        }}
      >
        {label}
      </span>
    </div>
  );
}
