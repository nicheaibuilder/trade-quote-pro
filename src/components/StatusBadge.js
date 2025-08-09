import React from 'react';

export default function StatusBadge({ status }) {
    const colors = {
        Draft: { bg: '#e2e8f0', text: '#4a5568' },
        Sent: { bg: '#bee3f8', text: '#2b6cb0' },
        Approved: { bg: '#c6f6d5', text: '#2f855a' },
        Declined: { bg: '#fed7d7', text: '#c53030' },
        Invoiced: { bg: '#f0e6ff', text: '#553c9a'}
    };
    const style = {
        backgroundColor: colors[status]?.bg || '#e2e8f0',
        color: colors[status]?.text || '#4a5568',
        padding: '0.25rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: '600',
        display: 'inline-block'
    };
    return <span style={style}>{status}</span>;
}