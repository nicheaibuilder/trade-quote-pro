import React, { useState } from 'react';
import ClientEditor from '../components/ClientEditor';
import ItemEditor from '../components/ItemEditor';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

const StatCard = ({ title, value }) => ( <div style={{background:'white', padding:'1.5rem', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}><h3 style={{margin:0, color:'#a0aec0', fontSize:'0.9rem', textTransform:'uppercase'}}>{title}</h3><p style={{margin:'0.5rem 0 0 0', color:'#1a20c', fontSize:'2.25rem', fontWeight:'700'}}>{value}</p></div> );
const StatusBadge = ({ status }) => { const colors = { Draft: { bg: '#e2e8f0', text: '#4a5568' }, Sent: { bg: '#bee3f8', text: '#2b6cb0' }, Approved: { bg: '#c6f6d5', text: '#2f855a' }, Declined: { bg: '#fed7d7', text: '#c53030' }, Invoiced: { bg: '#f0e6ff', text: '#553c9a'} }; const style = { backgroundColor: colors[status]?.bg, color: colors[status]?.text, padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '600' }; return <span style={style}>{status}</span>; };

export default function Dashboard({ user, userData, dashboardStats, handlers }) {
    const [activeTab, setActiveTab] = useState('quotes');
    const [showClientModal, setShowClientModal] = useState(false);
    const [showItemModal, setShowItemModal] = useState(false);
    
    if (!userData) { return <div style={{textAlign:'center', padding:'4rem'}}>Loading dashboard...</div>; }

    const { quotes = [], clients = [], items = [], invoices = [] } = userData;

    const handleSaveAndClose = (saveFunc, data, setModalFunc) => { saveFunc(data); setModalFunc(false); };

    return (
        <div style={{fontFamily:'Inter, sans-serif', maxWidth:'1000px', margin:'2rem auto', padding:'2rem', backgroundColor: '#f7fafc'}}>
            {showClientModal && <ClientEditor onSave={(client) => handleSaveAndClose(handlers.onSaveClient, client, setShowClientModal)} onCancel={() => setShowClientModal(false)} />}
            {showItemModal && <ItemEditor onSave={(item) => handleSaveAndClose(handlers.onSaveItem, item, setShowItemModal)} onCancel={() => setShowItemModal(false)} />}
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
                 <div><h1 style={{margin:0}}>Dashboard</h1><p style={{margin:0, color:'#718096'}}>Welcome, {userData.profile?.companyName || user.email}</p></div>
                 <button onClick={handlers.onLogout} style={{background:'#a0aec0'}}>Log Out</button>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:'1.5rem', marginBottom:'2rem'}}>
                <StatCard title="Total Revenue (Paid)" value={`$${dashboardStats.totalRevenue.toLocaleString()}`} />
                <StatCard title="Outstanding Revenue" value={`$${dashboardStats.outstandingRevenue.toLocaleString()}`} />
                <StatCard title="Quote Approval Rate" value={`${dashboardStats.approvalRate}%`} />
            </div>

            <div style={{display:'flex', borderBottom:'2px solid #e2e8f0', marginBottom:'1.5rem'}}>
                <button onClick={() => setActiveTab('quotes')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='quotes'?'600':'400', borderBottom:activeTab==='quotes'?'2px solid #3182ce':'none', color:activeTab==='quotes'?'#3182ce':'#4a5568'}}>Quotes</button>
                <button onClick={() => setActiveTab('invoices')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='invoices'?'600':'400', borderBottom:activeTab==='invoices'?'2px solid #3182ce':'none', color:activeTab==='invoices'?'#3182ce':'#4a5568'}}>Invoices</button>
                <button onClick={() => setActiveTab('clients')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='clients'?'600':'400', borderBottom:activeTab==='clients'?'2px solid #3182ce':'none', color:activeTab==='clients'?'#3182ce':'#4a5568'}}>Clients</button>
                <button onClick={() => setActiveTab('items')} style={{padding:'0.8rem 1.5rem', border:'none', background:'none', fontWeight:activeTab==='items'?'600':'400', borderBottom:activeTab==='items'?'2px solid #3182ce':'none', color:activeTab==='items'?'#3182ce':'#4a5568'}}>Items</button>
            </div>

            {activeTab === 'quotes' && (
                <div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem'}}><h2 style={{fontSize:'1.25rem', margin:0}}>Your Quotes</h2><button onClick={handlers.onCreateNewQuote} style={{background:'#3182ce', color:'white'}}>+ New Quote</button></div>
                    <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                        {quotes.map(quote => ( <div key={quote.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',borderBottom:'1px solid #e2e8f0'}}><div><p style={{margin:0,fontWeight:'600'}}>Quote #{quote.quoteNumber}</p><p style={{margin:0,color:'#718096',fontSize:'0.9rem'}}>{quote.clientName}</p></div><div style={{display:'flex',alignItems:'center',gap:'1rem'}}><select onChange={(e)=>handlers.onUpdateQuoteStatus(quote.id, e.target.value)} value={quote.status} disabled={quote.status === 'Invoiced'}><option>Draft</option><option>Sent</option><option>Approved</option><option>Declined</option></select><StatusBadge status={quote.status} />{quote.status === 'Approved' && <button onClick={()=>handlers.onConvertToInvoice(quote.id)} style={{background:'#38a169',color:'white',fontSize:'0.9rem'}}>Convert to Invoice</button>}<button onClick={()=>handlers.onSelectQuote(quote.id)} style={{background:'#2d3748',color:'white'}}>Edit</button></div></div> ))}
                    </div>
                </div>
            )}
            {activeTab === 'invoices' && (
                <div>
                    <div style={{marginBottom:'1.5rem'}}><h2 style={{fontSize:'1.25rem', margin:0}}>Your Invoices</h2></div>
                    <div style={{background:'white', borderRadius:'12px', boxShadow:'0 4px 6px -1px rgba(0,0,0,0.1)'}}>
                         {invoices.map(invoice => ( <div key={invoice.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',borderBottom:'1px solid #e2e8f0'}}><div><p style={{margin:0,fontWeight:'600'}}>Invoice #{invoice.invoiceNumber}</p><p style={{margin:0,color:'#718096',fontSize:'0.9rem'}}>{invoice.clientName}</p></div><div style={{display:'flex',alignItems:'center',gap:'1rem'}}><InvoiceStatusBadge status={invoice.status} dueDate={invoice.dueDate}/>{invoice.status === 'Unpaid' && <button onClick={()=>handlers.onMarkInvoicePaid(invoice.id)} style={{background:'#38a169',color:'white'}}>Mark as Paid</button>}</div></div>))}
                    </div>
                </div>
            )}
            {activeTab === 'clients' && ( <div>...</div> )}
            {activeTab === 'items' && ( <div>...</div> )}
        </div>
    );
}