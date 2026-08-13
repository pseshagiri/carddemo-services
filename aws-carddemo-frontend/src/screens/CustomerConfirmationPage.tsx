/**
 * CustomerConfirmationPage — GOV.UK confirmation panel
 * https://design-system.service.gov.uk/components/panel/
 */
import { useNavigate } from 'react-router-dom';

const gds = {
  black: '#0b0c0c',
  white: '#ffffff',
  green: '#00703c',
  blue: '#1d70b8',
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

export default function CustomerConfirmationPage() {
  const navigate = useNavigate();
  return (
    <div>
      {/* GOV.UK confirmation panel */}
      <div
        style={{
          background: gds.green,
          padding: '35px 40px',
          textAlign: 'center',
          marginBottom: 30
        }}
      >
        <h1
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 36,
            color: gds.white,
            margin: '0 0 8px'
          }}
        >
          Application complete
        </h1>
        <p
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontSize: 27,
            fontWeight: 700,
            color: gds.white,
            margin: 0
          }}
        >
          Customer record created successfully
        </p>
      </div>

      <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: '0 0 20px' }}>
        The new customer has been saved to the system.
      </p>

      <div>
        <button style={btnPrimary} onClick={() => navigate('/customers/add')}>
          Add another customer
        </button>
        <button style={btnSecondary} onClick={() => navigate('/admin')}>
          Return to Admin
        </button>
      </div>
    </div>
  );
}
