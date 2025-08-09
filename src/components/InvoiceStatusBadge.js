import React from 'react';

export default function InvoiceStatusBadge({ status, dueDate }) {
    // Today's date is August 9, 2025
    const today = new Date('2025-08-09T12:00:00');
    let effectiveStatus = status;
    
    if (status === 'Unpaid' && new Date(dueDate) < today) {
        effectiveStatus = 'Overdue';
    }

    const colors = {
        Unpaid: { bg: '#fefcbf', text: '#b45309' }, // Yellow
        Paid: { bg: '#c6f6d5', text: '#2f855a' },   // Green
        Overdue: { bg: '#fed7d7', text: '#c53030' } // Red
    };
    
    const style = {
        backgroundColor: colors[effectiveStatus]?.bg || '#e2e8f0',
        color: colors[effectiveStatus]?.text || '#4a5568',
        padding: '0.25rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: '600'
    };

    return <span style={style}>{effectiveStatus}</span>;
}