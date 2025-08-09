import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ClientEditor from './ClientEditor'; // Import the new component

export default function Dashboard({ user, userData, dashboardStats, onLogout, onSelectQuote, onCreateNewQuote, onSaveClient }) {
    const [activeTab, setActiveTab] = useState('quotes');
    const [showClientModal, setShowClientModal] = useState(false);

    if (!userData || !dashboardStats) {
        return <div>Loading dashboard...</div>
    }

    const { quotes = [], clients = [] } = userData;

    const QuotesList = () => (
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2>
                <button onClick={onCreateNewQuote} style={{background:'#3182ce', color:'white'}}>+ New Quote</button>
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
                            <button onClick={() => onSelectQuote(quote.id)} style={{background:'#2d3748', color:'white'}}>Edit</button>
                        </div>
                    </div>
                )) : <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No quotes yet.</p>}
            </div>
        </div>
    );

    const ClientsList = () => (
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Clients</h2>
                <button onClick={() => setShowClientModal(true)} style={{background:'#3182ce', color:'white'}}>+ New Client</button>
            </div>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                 {clients.length > 0 ? clients.map(client => (
                    <div key={client.id} style={{padding:'1rem 1.5rem', borderBottom:'1px solid #e2e8f0'}}>
                        <p style={{margin:0, fontWeight:'600'}}>{client.name}</p>
                        <p style={{margin:0, color:'#718096', fontSize:'0.9rem'}}>{client.address}</p>
                    </div>
                )) : <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No clients saved yet.</p>}
            </div>
        </div>
    );


    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            {showClientModal && <ClientEditor onSave={onSaveClient} onCancel={() => setShowClientModal(false)} />}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p>
                </div>
                <button onClick={onLogout} style={{background:'#a0aec0'}}>Log Out</button>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Revenue (Paid)" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} />
                <StatCard title="Outstanding Revenue" value={`$${dashboardStats.outstandingRevenue.toLocaleString()}`} />
                <StatCard title="Quote Approval Rate" value={`${dashboardStats.approvalRate}%`} />
            </div>

            <div style={{display:'flex', borderBottom:'2px solid #e2e8f0', marginBottom:'1.5rem'}}>
                <button onClick={() => setActiveTab('quotes')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='quotes'?'600':'400', borderBottom:activeTab==='quotes'?'2px solid #3182ce':'none', color:activeTab==='quotes'?'#3182ce':'#4a5568'}}>Quotes</button>
                <button onClick={() => setActiveTab('clients')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='clients'?'600':'400', borderBottom:activeTab==='clients'?'2px solid #3182ce':'none', color:activeTab==='clients'?'#3182ce':'#4a5568'}}>Clients</button>
            </div>

            {activeTab === 'quotes' ? <QuotesList /> : <ClientsList />}
        </div>
    );
}