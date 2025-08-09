import React, { useState } from 'react';
import ClientEditor from '../components/ClientEditor';
import ItemEditor from '../components/ItemEditor';

const StatCard = ({ title, value }) => ( <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}><h3 style={{margin:0, color:'#a0aec0', fontSize:'0.9rem', textTransform:'uppercase'}}>{title}</h3><p style={{margin:'0.5rem 0 0 0', color:'#1a20c', fontSize:'2.25rem', fontWeight:'700'}}>{value}</p></div> );
const StatusBadge = ({ status }) => { const colors = { Draft: { bg: '#e2e8f0', text: '#4a5568' }, Sent: { bg: '#bee3f8', text: '#2b6cb0' }, Approved: { bg: '#c6f6d5', text: '#2f855a' }, Declined: { bg: '#fed7d7', text: '#c53030' }, Invoiced: { bg: '#f0e6ff', text: '#553c9a'} }; const style = { backgroundColor: colors[status]?.bg, color: colors[status]?.text, padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }; return <span style={style}>{status}</span>; };

export default function Dashboard({ user, userData, handlers }) {
    const [activeTab, setActiveTab] = useState('quotes');
    const [showClientModal, setShowClientModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    
    if (!userData) { return <div style={{textAlign:'center', padding:'4rem'}}>Loading dashboard...</div>; }

    const { quotes = [], clients = [], items = [] } = userData;
    const dashboardStats = { totalQuotes: quotes.length, totalClients: clients.length, totalItems: items.length };

    const handleSaveAndClose = (saveFunc, data, setModalFunc) => {
        saveFunc(data);
        setModalFunc(false);
    };

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            {showClientModal && <ClientEditor onSave={(client) => handleSaveAndClose(handlers.onSaveClient, client, setShowClientModal)} onCancel={() => setShowClientModal(false)} />}
            {showItemModal && <ItemEditor onSave={(item) => handleSaveAndClose(handlers.onSaveItem, item, setShowItemModal)} onCancel={() => setShowItemModal(false)} />}
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                <div>
                    <h1 style={{margin:0}}>Dashboard</h1>
                    <p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p>
                </div>
                <button onClick={handlers.onLogout} style={{background:'#a0aec0'}}>Log Out</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Quotes" value={dashboardStats.totalQuotes} />
                <StatCard title="Total Clients" value={dashboardStats.totalClients} />
                <StatCard title="Catalog Items" value={dashboardStats.totalItems} />
            </div>

            <div style={{display:'flex', borderBottom:'2px solid #e2e8f0', marginBottom:'1.5rem'}}>
                <button onClick={() => setActiveTab('quotes')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='quotes'?'600':'400', borderBottom:activeTab==='quotes'?'2px solid #3182ce':'none', color:activeTab==='quotes'?'#3182ce':'#4a5568'}}>Quotes</button>
                <button onClick={() => setActiveTab('clients')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='clients'?'600':'400', borderBottom:activeTab==='clients'?'2px solid #3182ce':'none', color:activeTab==='clients'?'#3182ce':'#4a5568'}}>Clients</button>
                <button onClick={() => setActiveTab('items')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='items'?'600':'400', borderBottom:activeTab==='items'?'2px solid #3182ce':'none', color:activeTab==='items'?'#3182ce':'#4a5568'}}>Items</button>
            </div>

            {activeTab === 'quotes' && (
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}><h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2><button onClick={handlers.onCreateNewQuote} style={{background:'#3182ce', color:'white'}}>+ New Quote</button></div>
                    <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                        {quotes.length > 0 ? quotes.map(quote => ( <div key={quote.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',borderBottom:'1px solid #e2e8f0'}}><div><p style={{margin:0,fontWeight:'600'}}>Quote #{quote.quoteNumber}</p><p style={{margin:0,color:'#718096',fontSize:'0.9rem'}}>{quote.clientName}</p></div><button onClick={()=>handlers.onSelectQuote(quote.id)} style={{background:'#2d3748',color:'white'}}>Edit</button></div> )) : <p style={{padding:'2rem',textAlign:'center',color:'#718096'}}>No quotes yet.</p>}
                    </div>
                </div>
            )}
            {activeTab === 'clients' && (
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}><h2 style={{fontSize:'1.25rem', margin:0}}>Your Clients</h2><button onClick={() => setShowClientModal(true)} style={{background:'#3182ce', color:'white'}}>+ New Client</button></div>
                    <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                         {clients.length > 0 ? clients.map(client => ( <div key={client.id} style={{padding:'1rem 1.5rem',borderBottom:'1px solid #e2e8f0'}}><p style={{margin:0,fontWeight:'600'}}>{client.name}</p><p style={{margin:0,color:'#718096',fontSize:'0.9rem'}}>{client.address}</p></div> )) : <p style={{padding:'2rem',textAlign:'center',color:'#718096'}}>No clients saved yet.</p>}
                    </div>
                </div>
            )}
            {activeTab === 'items' && (
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}><h2 style={{fontSize:'1.25rem', margin:0}}>Your Item Catalog</h2><button onClick={() => setShowItemModal(true)} style={{background:'#3182ce', color:'white'}}>+ New Item</button></div>
                    <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                         {items.length > 0 ? items.map(item => ( <div key={item.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',borderBottom:'1px solid #e2e8f0'}}><p style={{margin:0,fontWeight:'600'}}>{item.description}</p><p style={{margin:0,color:'#718096',fontSize:'0.9rem'}}>${item.price.toFixed(2)}</p></div> )) : <p style={{padding:'2rem',textAlign:'center',color:'#718096'}}>No catalog items saved yet.</p>}
                    </div>
                </div>
            )}
        </div>
    );
}