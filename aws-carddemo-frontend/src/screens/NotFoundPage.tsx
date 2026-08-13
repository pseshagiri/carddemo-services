/**
 * NotFoundPage — GOV.UK 404 pattern
 * https://design-system.service.gov.uk/patterns/page-not-found-pages/
 */
const gds = { black: '#0b0c0c', blue: '#1d70b8', borderGrey: '#b1b4b6' };

export default function NotFoundPage() {
  return (
    <div style={{ padding: '40px 20px' }}>
      <h1
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 36,
          color: gds.black,
          margin: '0 0 20px'
        }}
      >
        Page not found
      </h1>

      <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: '0 0 15px' }}>
        If you typed the web address, check it is correct.
      </p>
      <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: '0 0 15px' }}>
        If you pasted the web address, check you copied the entire address.
      </p>
      <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: '0 0 15px' }}>
        If the web address is correct or you selected a link or button, please{' '}
        <a href="/" style={{ color: gds.blue }}>
          return to the main dashboard
        </a>
        .
      </p>
    </div>
  );
}
