/**
 * PageHeader — GOV.UK heading pattern
 * h1 with optional caption (section name) + optional action buttons.
 * https://design-system.service.gov.uk/styles/headings/
 */
import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  caption?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, caption, actions }: Props) {
  return (
    <div style={{ marginBottom: 30, borderBottom: '1px solid #b1b4b6', paddingBottom: 20 }}>
      {caption && (
        <span
          style={{
            display: 'block',
            fontFamily: '"GDS Transport", Arial, sans-serif',
            fontSize: 19,
            color: '#505a5f',
            marginBottom: 4
          }}
        >
          {caption}
        </span>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1
            style={{
              fontFamily: '"GDS Transport", Arial, sans-serif',
              fontWeight: 700,
              fontSize: 36,
              lineHeight: '1.1',
              color: '#0b0c0c',
              margin: 0
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              style={{
                fontFamily: '"GDS Transport", Arial, sans-serif',
                fontSize: 19,
                lineHeight: '1.3',
                color: '#505a5f',
                margin: '8px 0 0'
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
      </div>
    </div>
  );
}
