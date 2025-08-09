import React from 'react';

// A simple placeholder for the StatCard component
const StatCard = ({ title, value }) => (
    <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
        <h3 style={{margin:0, color:'#a0aec0', fontSize:'0.9rem', textTransform:'uppercase'}}>{title}</h3>
        <p style={{margin:'0.5rem 0 0 0', color:'#1a202c', fontSize:'2.25rem', fontWeight:'700'}}>{value}</p>
    </div>
);

export default function Dashboard({ user, userData, onLogout }) {
    if (!userData) {
        return <div style={{textAlign:'center', padding:'4rem'}}>Loading dashboard...</div>;
    }
    const { quotes = [], invoices = [] } = userData;

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p>
                </div>
                <button onClick={onLogout} style={{background:'#a0aec0'}}>Log Out</button>
            </div>
            
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Quotes" value={quotes.length} />
                <StatCard title="Total Invoices" value={invoices.length} />
                <StatCard title="Approval Rate" value="N/A" />
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2>
                <button style={{background:'#3182ce', color:'white'}}>+ New Quote</button>
            </div>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                {quotes.length > 0 ? quotes.map(quote => (
                    <div key={quote.id || quote.quoteNumber} style={{padding:'1rem 1.5rem', borderBottom:'1px solid #e2e8f0'}}>
                        <p style={{margin:0, fontWeight:'600'}}>Quote #{quote.quoteNumber}</p>
                    </div>
                )) : <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No quotes yet.</p>}
            </div>
        </div>
    );
}