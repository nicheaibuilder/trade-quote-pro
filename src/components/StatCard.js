import React from 'react';

export default function StatCard({ title, value, icon }) {
    return (
        <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
            <h3 style={{margin:0, color:'#a0aec0', fontSize:'0.9rem', fontWeight:'600', textTransform:'uppercase'}}>{title}</h3>
            <p style={{margin:'0.5rem 0 0 0', color:'#1a202c', fontSize:'2.25rem', fontWeight:'700'}}>{value}</p>
        </div>
    );
}