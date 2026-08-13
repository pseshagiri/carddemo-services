/**
 * AdminPage — GOV.UK inset / notification panel
 */
import PageHeader from '../components/PageHeader';

const gds = {
  black: '#0b0c0c',
  green: '#00703c',
  white: '#ffffff',
  blue: '#1d70b8',
  borderGrey: '#b1b4b6',
  grey1: '#f3f2f1'
};

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        caption="Administration"
        subtitle="Administrator-only functions such as customer onboarding and controlled maintenance."
      />

      {/* GOV.UK success panel */}
      <div
        style={{
          background: gds.green,
          padding: '30px 40px',
          marginBottom: 30
        }}
      >
        <h2
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontWeight: 700,
            fontSize: 32,
            color: gds.white,
            margin: '0 0 8px'
          }}
        >
          Admin access granted
        </h2>
        <p
          style={{
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontSize: 19,
            color: gds.white,
            margin: 0
          }}
        >
          You have full access to administrative workflows.
        </p>
      </div>

      {/* Inset text */}
      <div
        style={{
          borderLeft: `10px solid ${gds.borderGrey}`,
          padding: '15px 20px',
          marginBottom: 30
        }}
      >
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.black, margin: 0 }}>
          Use this area for <strong>customer onboarding</strong> and other administrative workflows.
          Changes made here affect live data — proceed with care.
        </p>
      </div>

      {/* Quick links */}
      <ul
        style={{
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontSize: 19,
          lineHeight: '1.5',
          color: gds.black,
          paddingLeft: 20
        }}
      >
        <li><a href="/customers/add" style={{ color: gds.blue }}>Add a new customer</a></li>
        <li><a href="/accounts" style={{ color: gds.blue }}>View all accounts</a></li>
        <li><a href="/reports" style={{ color: gds.blue }}>Run a report</a></li>
      </ul>
    </div>
  );
}
