/**
 * BatchReportsPage — GOV.UK table pattern
 */
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import { batchReports } from '../data/mockData';

const gds = { green: '#00703c', black: '#0b0c0c' };

export default function BatchReportsPage() {
  return (
    <div>
      <PageHeader
        title="Batch Reports Centre"
        caption="Reporting"
        subtitle="Operational and batch-generated report visibility."
      />

      {/* GOV.UK notification banner — all reports available */}
      <div
        style={{
          background: '#d4efdf',
          borderLeft: `5px solid ${gds.green}`,
          padding: '15px 20px',
          marginBottom: 24
        }}
      >
        <p style={{ fontFamily: '"GDS Transport", Arial, sans-serif', fontWeight: 700, fontSize: 19, color: gds.black, margin: 0 }}>
          All reports are available
        </p>
      </div>

      <DataTable
        caption="Available batch reports"
        columns={[
          { key: 'reportName', header: 'Report name' },
          { key: 'category', header: 'Category' },
          {
            key: 'status',
            header: 'Status',
            render: (row) => (
              <strong style={{ color: gds.green }}>
                {row.status}
              </strong>
            )
          }
        ]}
        rows={batchReports}
      />
    </div>
  );
}
