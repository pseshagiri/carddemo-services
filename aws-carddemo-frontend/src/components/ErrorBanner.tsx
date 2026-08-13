/**
 * ErrorBanner — GOV.UK error-summary styled alert box
 */
interface ErrorBannerProps {
  message: string;
  errors?: string[];
}

export default function ErrorBanner({ message, errors }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-labelledby="error-banner-title"
      style={{
        border: '4px solid #d4351c',
        padding: '15px 20px',
        margin: '20px 0',
      }}
    >
      <h2
        id="error-banner-title"
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 19,
          color: '#d4351c',
          margin: '0 0 8px',
        }}
      >
        {message}
      </h2>
      {errors && errors.length > 0 && (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {errors.map((e, i) => (
            <li
              key={i}
              style={{
                fontFamily: '"GDS Transport", Arial, sans-serif',
                fontSize: 16,
                color: '#d4351c',
              }}
            >
              {e}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
