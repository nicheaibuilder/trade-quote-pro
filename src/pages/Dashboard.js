import React, { useState } from 'react';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ClientEditor from './ClientEditor';
import ItemEditor from './ItemEditor'; // Import the new component

export default function Dashboard({ user, userData, dashboardStats, onLogout, onSelectQuote, onCreateNewQuote, onSaveClient, onSaveItem }) {
    const [activeTab, setActiveTab] = useState('quotes');
    const [showClientModal, setShowClientModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);

    if (!userData || !dashboardStats) return <div>Loading dashboard...</div>;

    const { quotes = [], clients = [], items = [] } = userData;

    const handleSaveAndClose = (saveFunc, data, setModalFunc) => {
        saveFunc(data);
        setModalFunc(false);
    };

    const QuotesList = () => ( /* ... No changes ... */ <div>...</div> );
    const ClientsList = () => ( /* ... No changes ... */ <div>...</div> );
    
    const ItemsList = () => (
        <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.25rem', margin:0}}>Your Item Catalog</h2>
                <button onClick={() => setShowItemModal(true)} style={{background:'#3182ce', color:'white'}}>+ New Item</button>
            </div>
            <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                 {items.length > 0 ? items.map(item => (
                    <div key={item.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 1.5rem', borderBottom:'1px solid #e2e8f0'}}>
                        <p style={{margin:0, fontWeight:'600'}}>{item.description}</p>
                        <p style={{margin:0, color:'#718096', fontSize:'0.9rem'}}>${item.price.toFixed(2)}</p>
                    </div>
                )) : <p style={{padding:'2rem', textAlign:'center', color:'#718096'}}>No catalog items saved yet.</p>}
            </div>
        </div>
    );

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            {showClientModal && <ClientEditor onSave={(client) => handleSaveAndClose(onSaveClient, client, setShowClientModal)} onCancel={() => setShowClientModal(false)} />}
            {showItemModal && <ItemEditor onSave={(item) => handleSaveAndClose(onSaveItem, item, setShowItemModal)} onCancel={() => setShowItemModal(false)} />}
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                {/* ... Header is unchanged ... */}
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                {/* ... StatCards are unchanged ... */}
            </div>

            <div style={{display:'flex', borderBottom:'2px solid #e2e8f0', marginBottom:'1.5rem'}}>
                <button onClick={() => setActiveTab('quotes')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='quotes'?'600':'400', borderBottom:activeTab==='quotes'?'2px solid #3182ce':'none'}}>Quotes</button>
                <button onClick={() => setActiveTab('clients')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='clients'?'600':'400', borderBottom:activeTab==='clients'?'2px solid #3182ce':'none'}}>Clients</button>
                <button onClick={() => setActiveTab('items')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='items'?'600':'400', borderBottom:activeTab==='items'?'2px solid #3182ce':'none'}}>Items</button>
            </div>

            {activeTab === 'quotes' && <QuotesList />}
            {activeTab === 'clients' && <ClientsList />}
            {activeTab === 'items' && <ItemsList />}
        </div>
    );
}