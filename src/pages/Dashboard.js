import React from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard({ user, userData, dashboardStats, onLogout }) {
    if (!userData || !dashboardStats) {
        return <div>Loading dashboard...</div>
    }

    const { quotes = [] } = userData;

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p>
                </div>
                <button onClick={onLogout} style={{background:'#a0aec0'}}>Log Out</button>
            </div>

            {/* Stats Section */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Revenue (Paid)" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} />
                <StatCard title="Outstanding Revenue" value={`$${dashboardStats.outstandingRevenue.toLocaleString()}`} />
                <StatCard title="Quote Approval Rate" value={`${dashboardStats.approvalRate}%`} />
            </div>

            {/* Quotes List */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2>
                <button onClick={() => alert("Open Quote Editor")} style={{background:'#3182ce', color:'white'}}>+ New Quote</button>
            </div>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                {quotes.length > 0 ? quotes.map(quote => (
                    <div key={quote.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', borderBottom:'1px solid #e2e8f0'}}>
                        <div>
                            <p style={{margin:0, fontWeight:'600'}}>Quote #{quote.quoteNumber}</p>
                            <p style={{margin:0, color:'#718096', fontSize:'0.9rem'}}>{quote.clientName}</p>
                        </div>
                        <StatusBadge status={quote.status} />
                    </div>
                )) : (
                    <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No quotes yet. Click "+ New Quote" to get started.</p>
                )}
            </div>
        </div>
    );
}