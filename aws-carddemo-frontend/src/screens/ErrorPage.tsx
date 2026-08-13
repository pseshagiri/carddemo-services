/**
 * ErrorPage — GOV.UK error summary pattern
 * https://design-system.service.gov.uk/components/error-summary/
 */
import { useNavigate } from 'react-router-dom';

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  red: '#d4351c',
  green: '#00703c',
  grey1: '#f3f2f1',
  borderGrey: '#b1b4b6'
};

const btnPrimary: React.CSSProperties = {
  display: 'inline-block', background: gds.green, color: gds.white, border: `2px solid transparent`,
  padding: '8px 22px 7px', fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19,
  cursor: 'pointer', borderRadius: 0, marginRight: 12, boxShadow: `0 2px 0 #002d18`
};
const btnSecondary: React.CSSProperties = {
  ...btnPrimary, background: gds.grey1, color: gds.black, boxShadow: `0 2px 0 ${gds.borderGrey}`
};

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* GOV.UK error summary box */}
      <div
        role="alert"
        aria-labelledby="error-summary-title"
        style={{
          border: `4px solid ${gds.red}`,
          padding: '15px 20px',
          marginBottom: 30
        }}
      >
        <h2
          id="error-summary-title"
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 27,
            color: gds.black,
            margin: '0 0 10px'
          }}
        >
          There is a problem
        </h2>
        <ul style={{ margin: 0, padding: '0 0 0 20px' }}>
          <li
            style={{
              fontFamily: '"GDS Transport", Arial, sans-serif',
              fontSize: 19,
              color: gds.red
            }}
          >
            A business or system error occurred. Please retry the action or return to the main dashboard.
          </li>
        </ul>
      </div>

      <h1
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontWeight: 700,
          fontSize: 36,
          color: gds.black,
          margin: '0 0 20px'
        }}
      >
        Application Error
      </h1>

      <div>
        <button style={btnPrimary} onClick={() => navigate('/')}>
          Return home
        </button>
        <button style={btnSecondary} onClick={() => navigate('/login')}>
          Sign out
        </button>
      </div>
    </div>
  );
}
