/**
 * DataTable — GOV.UK table component
 * https://design-system.service.gov.uk/components/table/
 */
import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}
interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  caption?: string;
}

const tdStyle: React.CSSProperties = {
  fontFamily: '"GDS Transport", Arial, sans-serif',
  fontSize: 19,
  lineHeight: '1.3',
  color: '#0b0c0c',
  padding: '10px 20px 10px 0',
  borderBottom: '1px solid #b1b4b6',
  verticalAlign: 'top'
};
const thStyle: React.CSSProperties = {
  ...tdStyle,
  fontWeight: 700
};

export default function DataTable<T extends Record<string, any>>({ columns, rows, caption }: Props<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: '"GDS Transport", Arial, sans-serif',
          fontSize: 19
        }}
      >
        {caption && (
          <caption
            style={{
              fontFamily: '"GDS Transport", Arial, sans-serif',
              fontWeight: 700,
              fontSize: 19,
              textAlign: 'left',
              marginBottom: 10,
              color: '#0b0c0c'
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr style={{ borderBottom: '3px solid #0b0c0c' }}>
            {columns.map((col) => (
              <th key={col.key} scope="col" style={thStyle}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key} style={tdStyle}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
