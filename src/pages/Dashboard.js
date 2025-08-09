import React from 'react';

const StatCard = ({ title, value }) => ( <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}><h3 style={{margin:0, color:'#a0aec0', fontSize:'0.9rem', textTransform:'uppercase'}}>{title}</h3><p style={{margin:'0.5rem 0 0 0', color:'#1a202c', fontSize:'2.25rem', fontWeight:'700'}}>{value}</p></div> );
const StatusBadge = ({ status }) => { const colors = { Draft: { bg: '#e2e8f0', text: '#4a5568' }, Sent: { bg: '#bee3f8', text: '#2b6cb0' }, Approved: { bg: '#c6f6d5', text: '#2f855a' }, Declined: { bg: '#fed7d7', text: '#c53030' }, Invoiced: { bg: '#f0e6ff', text: '#553c9a'} }; const style = { backgroundColor: colors[status]?.bg, color: colors[status]?.text, padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }; return <span style={style}>{status}</span>; };

// The props list below now correctly includes 'handlers'
export default function Dashboard({ user, userData, dashboardStats, handlers }) {
    if (!userData || !dashboardStats) {
        return <div style={{textAlign:'center', padding:'4rem'}}>Loading dashboard...</div>;
    }

    const { quotes = [] } = userData;

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p>
                </div>
                <div>
                    <button onClick={handlers.onGoToSettings} style={{background:'#718096', color: 'white', marginRight:'1rem'}}>Settings</button>
                    <button onClick={handlers.onLogout} style={{background:'#a0aec0'}}>Log Out</button>
                </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Revenue" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} />
                <StatCard title="Outstanding" value={`$${dashboardStats.outstandingRevenue.toLocaleString()}`} />
                <StatCard title="Approval Rate" value={`${dashboardStats.approvalRate}%`} />
            </div>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2>
                <button onClick={handlers.onCreateNewQuote} style={{background:'#3182ce', color:'white'}}>+ New Quote</button>
            </div>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                {quotes.length > 0 ? quotes.map(quote => (
                    <div key={quote.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', borderBottom:'1px solid #e2e8f0'}}>
                        <div>
                            <p style={{margin:0, fontWeight:'600'}}>Quote #{quote.quoteNumber}</p>
                            <p style={{margin:0, color:'#718096', fontSize:'0.9rem'}}>{quote.clientName}</p>
                        </div>
                        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
                            <StatusBadge status={quote.status} />
                            <button onClick={() => handlers.onGetClientLink(quote.id)} style={{background:'#4a5568', color:'white', fontSize:'0.9rem'}}>Client Link</button>
                            <button onClick={() => handlers.onSelectQuote(quote.id)} style={{background:'#2d3748', color:'white'}}>Edit</button>
                        </div>
                    </div>
                )) : <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No quotes yet.</p>}
            </div>
        </div>
    );
}