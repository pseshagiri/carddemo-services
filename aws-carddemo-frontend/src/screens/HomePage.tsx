/**
 * HomePage — GOV.UK start page / module summary
 * https://design-system.service.gov.uk/patterns/start-using-a-service/
 */
import PageHeader from '../components/PageHeader';

const modules = [
  { title: 'Customer Management', desc: 'Onboard and manage customer records including personal details and identity verification.' },
  { title: 'Account Management', desc: 'View, create and maintain credit card account records and balance information.' },
  { title: 'Card Management', desc: 'Issue, review and update physical and virtual card attributes.' },
  { title: 'Transaction Processing', desc: 'Record and view purchase, refund and authorisation transactions.' },
  { title: 'Reporting', desc: 'Filter and generate transaction and balance reports by date and account.' },
  { title: 'Security & Access', desc: 'Role-based access control for Admin and standard User personas.' }
];

const gds = {
  black: '#0b0c0c',
  blue: '#1d70b8',
  green: '#00703c',
  white: '#ffffff',
  grey1: '#f3f2f1',
  borderGrey: '#b1b4b6'
};

export default function HomePage() {
  return (
    <div>
      <PageHeader
        title="Main Dashboard"
        caption="AWS CardDemo Modernisation"
        subtitle="Modern entry point for business workflows. This frontend preserves legacy functional behaviour while modernising the user experience."
      />

      {/* Service-wide notification banner */}
      <div
        role="region"
        aria-label="Information"
        style={{
          background: gds.blue,
          padding: '15px 20px',
          marginBottom: 30,
          borderLeft: `5px solid ${gds.black}`
        }}
      >
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.white, margin: 0, fontWeight: 700 }}>
          Information
        </p>
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: gds.white, margin: '5px 0 0' }}>
          This service demonstrates modernisation of a legacy CICS COBOL application on AWS.
        </p>
      </div>

      <h2 style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 27, color: gds.black, margin: '0 0 20px' }}>
        Service modules
      </h2>

      {/* Module cards — 2-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20
        }}
      >
        {modules.map((mod) => (
          <div
            key={mod.title}
            style={{
              background: gds.white,
              border: `1px solid ${gds.borderGrey}`,
              padding: '20px 25px',
              borderTop: `5px solid ${gds.blue}`
            }}
          >
            <h3 style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 22, color: gds.black, margin: '0 0 8px' }}>
              {mod.title}
            </h3>
            <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontSize: 19, color: '#505a5f', margin: 0, lineHeight: '1.3' }}>
              {mod.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
