/**
 * UnauthorizedPage — GOV.UK warning text pattern
 * https://design-system.service.gov.uk/components/warning-text/
 */
const gds = { black: '#0b0c0c', blue: '#1d70b8' };

export default function UnauthorizedPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 36,
          color: gds.black,
          margin: '0 0 30px'
        }}
      >
        Access denied
      </h1>

      {/* GOV.UK warning text */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          marginBottom: 30
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 27,
            color: gds.black,
            lineHeight: '1',
            flexShrink: 0
          }}
        >
          !
        </span>
        <strong
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontSize: 19,
            fontWeight: 700,
            color: gds.black
          }}
        >
          You do not have permission to access this page.
        </strong>
      </div>

      <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: 0 }}>
        Contact your administrator if you believe this is an error, or{' '}
        <a href="/" style={{ color: gds.blue }}>
          return to the main dashboard
        </a>
        .
      </p>
    </div>
  );
}
